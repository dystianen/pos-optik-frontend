import { useSearchProduct } from '@/features/product/hooks'
import { formatCurrency } from '@/utils/format'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Kbd,
  Loader,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  TextInput,
  UnstyledButton
} from '@mantine/core'
import { useDebouncedValue, useHotkeys } from '@mantine/hooks'
import { IconSearch, IconSparkles, IconX, IconArrowRight, IconCategory } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useMemo, useState } from 'react'

const POPULAR_BRANDS = [
  'Ray-Ban',
  'Nike',
  'Gucci',
  'Puma',
  'Acuvue',
  'Illustro',
  'Molsion',
  'Converse'
]

const POPULAR_CATEGORIES = [
  { name: 'Sunglasses', slug: 'sunglasses', desc: 'Stylish UV protection' },
  { name: 'Accessories', slug: 'accessories', desc: 'Cases, cleaners & chains' },
  { name: 'Contact Lens', slug: 'contact-lens', desc: 'Daily & monthly solutions' }
]

const Search = () => {
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const { data: products, isLoading } = useSearchProduct(debouncedSearch)

  // Hotkey support Ctrl+K / Cmd+K
  useHotkeys([
    ['mod+K', () => setOpened((o) => !o)],
    ['/', () => setOpened(true)]
  ])

  const handleSelectProduct = (productId: string) => {
    setOpened(false)
    setSearch('')
    router.push(`/product/detail?id=${productId}`)
  }

  const handleSelectCategory = (categorySlug: string) => {
    setOpened(false)
    setSearch('')
    router.push(`/product/${categorySlug}`)
  }

  const handleSelectBrand = (brandName: string) => {
    setSearch(brandName)
  }

  const handleSearchSubmit = () => {
    if (!search.trim()) return
    setOpened(false)
    // Go to first category page with search query
    router.push(`/product/sunglasses?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      {/* Trigger Button in Header */}
      <UnstyledButton
        onClick={() => setOpened(true)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:border-primary-400 bg-gray-50 transition-colors cursor-pointer"
        style={{ height: '38px' }}
      >
        <Group gap="xs" className="text-gray-400">
          <IconSearch size={16} />
          <Text size="sm">Search anything...</Text>
        </Group>
        <Group gap={5} ml={10} className="hidden sm:flex">
          <Kbd size="xs">Ctrl</Kbd>
          <Text size="xs" c="dimmed">+</Text>
          <Kbd size="xs">K</Kbd>
        </Group>
      </UnstyledButton>

      {/* Modern Search Modal overlay */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false)
          setSearch('')
        }}
        size="lg"
        withCloseButton={false}
        padding="md"
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            overflow: 'hidden'
          }
        }}
      >
        <Stack gap="md">
          {/* Main Search Input */}
          <Group gap="xs" wrap="nowrap">
            <TextInput
              placeholder="Search by brand, name, or attributes..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="flex-grow"
              size="md"
              radius="md"
              leftSection={<IconSearch size={20} className="text-gray-400" />}
              rightSection={
                search ? (
                  <ActionIcon variant="subtle" color="gray" onClick={() => setSearch('')}>
                    <IconX size={16} />
                  </ActionIcon>
                ) : null
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit()
                }
              }}
              data-autofocus
            />
            <Button
              onClick={handleSearchSubmit}
              size="md"
              radius="md"
              disabled={!search.trim()}
              variant="gradient"
              gradient={{ from: 'primary.6', to: 'primary.8', deg: 135 }}
            >
              Search
            </Button>
          </Group>

          <Divider />

          {/* Search Content */}
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {isLoading ? (
              <Group justify="center" py="xl">
                <Loader size="md" color="primary" />
                <Text size="sm" c="dimmed">Searching catalog...</Text>
              </Group>
            ) : search.trim() === '' ? (
              /* Empty state suggestion content */
              <Stack gap="lg">
                <div>
                  <Text size="xs" fw={700} c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Popular Categories
                  </Text>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {POPULAR_CATEGORIES.map((cat) => (
                      <UnstyledButton
                        key={cat.slug}
                        onClick={() => handleSelectCategory(cat.slug)}
                        className="p-3 border border-gray-100 rounded-lg hover:border-primary-300 hover:bg-primary-50/20 transition-all flex flex-col items-start gap-1"
                      >
                        <Group gap="xs" className="w-full">
                          <ThemeIcon size="sm" variant="light" color="primary" radius="sm">
                            <IconCategory size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={600} className="text-gray-800">
                            {cat.name}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed" className="mt-1">
                          {cat.desc}
                        </Text>
                      </UnstyledButton>
                    ))}
                  </div>
                </div>

                <div>
                  <Text size="xs" fw={700} c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Popular Brands
                  </Text>
                  <Group gap="xs">
                    {POPULAR_BRANDS.map((brand) => (
                      <Badge
                        key={brand}
                        onClick={() => handleSelectBrand(brand)}
                        className="cursor-pointer py-3 px-4 hover:bg-primary-100 hover:text-primary-800 transition-colors"
                        variant="light"
                        color="gray"
                        radius="md"
                      >
                        {brand}
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Stack>
            ) : products && products.length > 0 ? (
              /* Search results matching state */
              <Stack gap="md">
                {products.map((cat: any) => (
                  <div key={cat.category_id}>
                    <Group justify="between" mb="xs" className="px-1">
                      <Text size="xs" fw={700} c="primary.7" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        {cat.category_name}
                      </Text>
                      <Badge size="xs" color="primary" variant="outline">
                        {cat.products.length} matches
                      </Badge>
                    </Group>
                    <Stack gap={5}>
                      {cat.products.map((prod: any) => (
                        <UnstyledButton
                          key={prod.product_id}
                          onClick={() => handleSelectProduct(prod.product_id)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 hover:scale-[1.005] active:scale-[0.995] transition-all border border-transparent hover:border-gray-100"
                        >
                          <Avatar src={prod.product_image_url} size={44} radius="md" bg="gray.1" />
                          <div className="flex-grow min-w-0">
                            <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>
                              {prod.product_brand}
                            </Text>
                            <Text size="sm" fw={600} className="text-gray-800 truncate">
                              {prod.product_name}
                            </Text>
                          </div>
                          <Text size="sm" fw={700} className="text-primary-600 flex-shrink-0">
                            {formatCurrency(prod.product_price)}
                          </Text>
                          <IconArrowRight size={16} className="text-gray-300" />
                        </UnstyledButton>
                      ))}
                    </Stack>
                    <Divider my="sm" />
                  </div>
                ))}
                
                <Button
                  onClick={handleSearchSubmit}
                  variant="subtle"
                  color="primary"
                  fullWidth
                  rightSection={<IconArrowRight size={16} />}
                >
                  Show all results for "{search}"
                </Button>
              </Stack>
            ) : (
              /* No matching results state */
              <Stack align="center" gap="xs" py="xl">
                <IconSparkles size={40} className="text-gray-300" />
                <Text fw={600} c="gray.6">
                  No products found
                </Text>
                <Text size="xs" c="dimmed" ta="center" style={{ maxWidth: 300 }}>
                  We couldn't find any eyewear matches. Try adjusting your spelling or using different keywords.
                </Text>
              </Stack>
            )}
          </div>
        </Stack>
      </Modal>
    </>
  )
}

export default Search
