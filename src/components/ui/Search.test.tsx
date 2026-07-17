import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Search from './Search'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSearchProduct } from '@/features/product/hooks'

// Mock dependencies
vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn()
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn()
}))

vi.mock('@/features/product/hooks', () => ({
  useSearchProduct: vi.fn()
}))

const mockProducts = [
  {
    category_id: 'cat1',
    category_name: 'Eyewear',
    products: [
      {
        product_id: 'p1',
        product_name: 'Test Glass',
        product_brand: 'Test Brand',
        product_price: 150000,
        product_image_url: '/img.jpg'
      }
    ]
  }
]

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

describe('Search Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    vi.mocked(useSearchProduct).mockReturnValue({ data: mockProducts } as any)
    vi.mocked(usePathname).mockReturnValue('/search-page')
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => 'q=glasses'
    } as any)
  })

  it('renders search trigger correctly', () => {
    renderWithProviders(<Search />)
    const trigger = screen.getByText('Search anything...')
    expect(trigger).toBeInTheDocument()
  })

  it('opens modal on trigger click and allows typing', async () => {
    renderWithProviders(<Search />)
    const trigger = screen.getByText('Search anything...')
    fireEvent.click(trigger)

    const input = (await screen.findByPlaceholderText(
      'Search by brand, name, or attributes...'
    )) as HTMLInputElement
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Glass' } })
    expect(input.value).toBe('Glass')
  })

  it('calls useSearchProduct with input value', async () => {
    renderWithProviders(<Search />)
    const trigger = screen.getByText('Search anything...')
    fireEvent.click(trigger)

    const input = await screen.findByPlaceholderText('Search by brand, name, or attributes...')
    fireEvent.change(input, { target: { value: 'Glass' } })

    // Wait for debounce (300ms in code)
    await waitFor(() => {
      expect(useSearchProduct).toHaveBeenCalledWith('Glass')
    })
  })

  it('navigates to product detail page when product is clicked', async () => {
    renderWithProviders(<Search />)
    const trigger = screen.getByText('Search anything...')
    fireEvent.click(trigger)

    const input = await screen.findByPlaceholderText('Search by brand, name, or attributes...')
    fireEvent.change(input, { target: { value: 'Glass' } })

    // Wait for the product option to appear
    const productItem = await screen.findByText('Test Glass')
    fireEvent.click(productItem)

    expect(mockPush).toHaveBeenCalledWith('/product/detail?id=p1&from=%2Fsearch-page%3Fq%3Dglasses')
  })
})
