import { render, screen } from '@testing-library/react'
import SectionCarousel from './index'
import { MantineProvider } from '@mantine/core'

// Mock dependencies
vi.mock('@/components/ui/CardProduct', () => ({
  default: ({ item }: { item: any }) => <div data-testid="card-product">{item.product_name}</div>
}))

vi.mock('@/components/ui/Skeleton/CardProductSkeleton', () => ({
  default: () => <div data-testid="skeleton">Skeleton</div>
}))

// Mock Embla (Mantine Carousel uses it)
vi.mock('@mantine/carousel', () => ({
  Carousel: Object.assign(
    ({ children }: { children: React.ReactNode }) => <div data-testid="carousel">{children}</div>,
    {
      Slide: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel-slide">{children}</div>
    }
  )
}))

const mockData = [
  { product_id: '1', product_name: 'Product 1' },
  { product_id: '2', product_name: 'Product 2' }
]

describe('SectionCarousel Component', () => {
  it('renders title correctly', () => {
    render(
      <MantineProvider>
        <SectionCarousel title="Test Section" data={[]} exploreTo="/test" isLoading={false} />
      </MantineProvider>
    )

    expect(screen.getByText('Test Section.')).toBeInTheDocument()
    expect(screen.getByText('Explore >')).toBeInTheDocument()
  })

  it('renders skeletons when loading', () => {
    render(
      <MantineProvider>
        <SectionCarousel title="Test Section" data={[]} exploreTo="/test" isLoading={true} />
      </MantineProvider>
    )

    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders product cards when not loading', () => {
    render(
      <MantineProvider>
        <SectionCarousel title="Test Section" data={mockData as any} exploreTo="/test" isLoading={false} />
      </MantineProvider>
    )

    const cards = screen.getAllByTestId('card-product')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })
})
