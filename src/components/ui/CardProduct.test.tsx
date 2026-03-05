import { render, screen, fireEvent } from '@testing-library/react'
import CardProduct from './CardProduct'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { useToggleWishlist } from '@/features/product/hooks'
import { toast } from 'react-toastify'

// Mock dependencies
vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn()
}))

vi.mock('@/features/product/hooks', () => ({
  useToggleWishlist: vi.fn()
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}))

const mockProduct = {
  product_id: '123',
  product_name: 'Test Product',
  product_brand: 'Test Brand',
  product_price: 100000,
  product_stock: '10',
  total_sold: '5',
  product_image_url: '/test.jpg',
  is_wishlist: '0'
}

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

describe('CardProduct Component', () => {
  const mockPush = vi.fn()
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    vi.mocked(useToggleWishlist).mockReturnValue({ mutate: mockMutate } as any)
  })

  it('renders product information correctly', () => {
    renderWithProviders(<CardProduct item={mockProduct as any} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
    expect(screen.getByText('Stock 10')).toBeInTheDocument()
    expect(screen.getByText('Terjual 5')).toBeInTheDocument()
  })

  it('navigates to detail page on click', () => {
    renderWithProviders(<CardProduct item={mockProduct as any} />)

    const card = screen.getByText('Test Product').closest('.mantine-Card-root')
    if (card) fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledWith('/product/detail?id=123')
  })

  it('calls toggleWishlist when heart icon is clicked', () => {
    renderWithProviders(<CardProduct item={mockProduct as any} />)

    // Find the button (ActionIcon) for wishlist
    const wishlistBtn = screen.getByRole('button')
    fireEvent.click(wishlistBtn)

    expect(mockMutate).toHaveBeenCalledWith('123', expect.any(Object))
  })

  it('shows "Out of Stock" when stock is 0', () => {
    const oosProduct = { ...mockProduct, product_stock: '0' }
    renderWithProviders(<CardProduct item={oosProduct as any} />)

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })
})
