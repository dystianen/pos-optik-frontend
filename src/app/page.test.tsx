import { render, screen } from '@testing-library/react'
import Home from './page'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hooks
vi.mock('@/features/product/hooks', () => ({
  useNewEyeWear: vi.fn(),
  useBestSeller: vi.fn()
}))

// Mock Embla Autoplay
vi.mock('embla-carousel-autoplay', () => ({
  default: () => ({
    stop: vi.fn(),
    play: vi.fn()
  })
}))

// Mock Mantine Carousel to avoid Embla issues
vi.mock('@mantine/carousel', () => ({
  Carousel: Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="mantine-carousel">{children}</div>,
    {
      Slide: ({ children }: { children: React.ReactNode }) => <div data-testid="mantine-carousel-slide">{children}</div>
    }
  )
}))

// Mock SectionCarousel to simplify page testing
vi.mock('@/components/Home/SectionCarousel', () => ({
  default: ({ title }: { title: string }) => <div data-testid="section-carousel">{title}</div>
}))

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>{ui}</MantineProvider>
    </QueryClientProvider>
  )
}

import { useNewEyeWear, useBestSeller } from '@/features/product/hooks'

describe('Home Page', () => {
  it('renders correctly with loading state', () => {
    vi.mocked(useNewEyeWear).mockReturnValue({
      data: undefined,
      isLoading: true
    } as any)
    vi.mocked(useBestSeller).mockReturnValue({
      data: undefined,
      isLoading: true
    } as any)

    renderWithProviders(<Home />)

    expect(screen.getByText('New Eyewear')).toBeInTheDocument()
    expect(screen.getByText('Best Seller')).toBeInTheDocument()
  })

  it('renders products when data is fetched', () => {
    vi.mocked(useNewEyeWear).mockReturnValue({
      data: [{ product_id: '1', product_name: 'Glass 1' }],
      isLoading: false
    } as any)
    vi.mocked(useBestSeller).mockReturnValue({
      data: [{ product_id: '2', product_name: 'Glass 2' }],
      isLoading: false
    } as any)

    renderWithProviders(<Home />)

    expect(screen.getByText('New Eyewear')).toBeInTheDocument()
    expect(screen.getByText('Best Seller')).toBeInTheDocument()
    
    const sections = screen.getAllByTestId('section-carousel')
    expect(sections).toHaveLength(2)
  })
})
