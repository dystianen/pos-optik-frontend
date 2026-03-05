import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Search from './Search'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { useSearchProduct } from '@/features/product/hooks'

// Mock dependencies
vi.mock('nextjs-toploader/app', () => ({
  useRouter: vi.fn()
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
  })

  it('renders search input correctly', () => {
    renderWithProviders(<Search />)
    const input = screen.getByPlaceholderText('Search eyewear, lenses, brands...')
    expect(input).toBeInTheDocument()
  })

  it('updates input value on change', () => {
    renderWithProviders(<Search />)
    const input = screen.getByPlaceholderText('Search eyewear, lenses, brands...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Glass' } })
    expect(input.value).toBe('Glass')
  })

  it('calls useSearchProduct with input value', async () => {
    renderWithProviders(<Search />)
    const input = screen.getByPlaceholderText('Search eyewear, lenses, brands...')
    fireEvent.change(input, { target: { value: 'Glass' } })

    // Wait for debounce (300ms in code)
    await waitFor(() => {
      expect(useSearchProduct).toHaveBeenCalledWith('Glass')
    })
  })

  it('navigates to category page when option is selected', async () => {
    renderWithProviders(<Search />)
    const input = screen.getByPlaceholderText('Search eyewear, lenses, brands...')
    fireEvent.change(input, { target: { value: 'Glass' } })

    // Open dropdown by focusing or clicking
    fireEvent.focus(input)

    // Wait for the option to appear
    const option = await screen.findByText('Test Glass')
    fireEvent.click(option)

    // router.push(`/product/${formatSlug(selected.category_name)}?search=${search}`)
    expect(mockPush).toHaveBeenCalledWith('/product/eyewear?search=Glass')
  })
})
