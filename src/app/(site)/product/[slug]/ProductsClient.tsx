'use client'

import CardProduct from '@/components/ui/CardProduct'
import CardProductSkeleton from '@/components/ui/Skeleton/CardProductSkeleton'
import { useMenu } from '@/features/menu/hooks'
import { useInfiniteProducts } from '@/features/product/hooks'
import { formatCurrency, formatLabel } from '@/utils/format'
import {
  ActionIcon,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Collapse,
  Container,
  Divider,
  Drawer,
  Grid,
  Group,
  Loader,
  NumberInput,
  RangeSlider,
  Rating,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import {
  IconSearch,
  IconX,
  IconFilter,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconAdjustmentsHorizontal,
  IconStarFilled
} from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useMemo } from 'react'

function formatCategoryName(slug: string) {
  return slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const BRANDS = [
  'ILLUSTRO KIDS',
  'MOIST',
  'NIKE',
  'MOLSION',
  'NATURALENS',
  'WANGI.IN',
  'PUMA',
  'ILLUSTRO',
  'BALLY',
  'ILLUSTRO PRESTIGE',
  'CONVERSE',
  'GUCCI',
  'SKECHERS',
  'PROG',
  'CARRERA',
  'SHERYACC',
  'MARC JACOBS',
  'WISELIE',
  'ACUVUE',
  'ANDREA',
  'EDGY',
  'OLD SCHOOLMATE',
  'AZZARO',
  'OPTIK TUNGGAL',
  'MORRIS',
  'UYAAI',
  'BENETTON',
  'VITA',
  'OPTIKERS',
  'BOLON',
  'RAYBAN',
  'MYLOGY',
  'CAROLINA HERRERA',
  'AZ',
  'COGLORN'
]

const ProductsClient = ({ slug }: { slug: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read URL search params
  const querySearch = searchParams.get('search') ?? ''
  const queryBrand = searchParams.get('brand') ?? ''
  const queryMinPrice = searchParams.get('min_price') ?? ''
  const queryMaxPrice = searchParams.get('max_price') ?? ''
  const queryStock = searchParams.get('stock') ?? ''
  const queryRating = searchParams.get('rating') ?? ''

  // Category resolution from menu
  const { data: menu } = useMenu()
  const category = menu?.find((item) =>
    item.category_name.toLowerCase().includes(formatLabel(slug).toLowerCase())
  )

  // Local states for inputs (to allow user typing before applying)
  const [localSearch, setLocalSearch] = useState('')
  const [localMinPrice, setLocalMinPrice] = useState<number | ''>(queryMinPrice ? Number(queryMinPrice) : '')
  const [localMaxPrice, setLocalMaxPrice] = useState<number | ''>(queryMaxPrice ? Number(queryMaxPrice) : '')

  // Debounce price sliders to prevent sending excessive API requests
  const [debouncedMinPrice] = useDebouncedValue(localMinPrice, 400)
  const [debouncedMaxPrice] = useDebouncedValue(localMaxPrice, 400)

  // Brand search & collapsible state
  const [brandSearch, setBrandSearch] = useState('')
  const [brandsExpanded, setBrandsExpanded] = useState(false)
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)

  // Sync pricing local states with URL params when page changes (e.g. back/forward button)
  useEffect(() => {
    setLocalMinPrice(queryMinPrice ? Number(queryMinPrice) : '')
    setLocalMaxPrice(queryMaxPrice ? Number(queryMaxPrice) : '')
  }, [queryMinPrice, queryMaxPrice])

  const isFirstRender = useRef(true)

  // Sync debounced prices back to URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    updateUrlParams({
      min_price: debouncedMinPrice !== '' ? debouncedMinPrice.toString() : null,
      max_price: debouncedMaxPrice !== '' ? debouncedMaxPrice.toString() : null
    })
  }, [debouncedMinPrice, debouncedMaxPrice])

  // URL query parameter updater helper
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const urlParams = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        urlParams.delete(key)
      } else {
        urlParams.set(key, val)
      }
    })
    router.replace(`?${urlParams.toString()}`, { scroll: false })
  }

  // Handle Search Input Submit
  const handleSearchSubmit = () => {
    if (!localSearch.trim()) return
    updateUrlParams({ search: localSearch.trim() })
    setLocalSearch('') // Reset local input after search submitted, URL keeps search query
  }

  // Clear all filters
  const handleClearAllFilters = () => {
    setLocalSearch('')
    setLocalMinPrice('')
    setLocalMaxPrice('')
    router.replace(`?`, { scroll: false })
  }

  // Retrieve brands to show in checklist (filtered by search input)
  const filteredBrands = useMemo(() => {
    return BRANDS.filter((brand) =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    )
  }, [brandSearch])

  // Split brands list into initial view vs collapsed view
  const visibleBrands = useMemo(() => {
    if (brandsExpanded) return filteredBrands
    return filteredBrands.slice(0, 6)
  }, [filteredBrands, brandsExpanded])

  // Query products with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteProducts({
    category: category?.category_id ?? null,
    search: querySearch,
    brand: queryBrand,
    min_price: queryMinPrice ? Number(queryMinPrice) : undefined,
    max_price: queryMaxPrice ? Number(queryMaxPrice) : undefined,
    stock: queryStock,
    rating: queryRating ? Number(queryRating) : undefined,
    limit: 12
  })

  // Flatten infinite products page structure into a single array
  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  // Infinite Scroll Trigger via Intersection Observer
  const loaderRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Active filter count
  const hasActiveFilters = !!(querySearch || queryBrand || queryMinPrice || queryMaxPrice || queryStock || queryRating)

  // Reusable Filter Content Component
  const renderFiltersContent = () => (
    <Stack gap="lg" className="h-full">
      {/* HEADER SECTION */}
      <Group justify="between" wrap="nowrap">
        <Text fw={700} size="lg" className="text-midnight_text">
          Filters
        </Text>
        {hasActiveFilters && (
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={handleClearAllFilters}
          >
            Clear All
          </Button>
        )}
      </Group>

      <Divider />

      {/* PRICE RANGE FILTER */}
      <div>
        <Text fw={600} size="sm" mb="xs" className="text-midnight_text">
          Price Range (Rp)
        </Text>
        <Stack gap="xs">
          <Group grow gap="xs">
            <NumberInput
              placeholder="Min"
              min={0}
              max={10000000}
              value={localMinPrice}
              onChange={(val) => setLocalMinPrice(val === '' ? '' : Number(val))}
              thousandSeparator="."
              decimalSeparator=","
              radius="md"
            />
            <NumberInput
              placeholder="Max"
              min={0}
              max={10000000}
              value={localMaxPrice}
              onChange={(val) => setLocalMaxPrice(val === '' ? '' : Number(val))}
              thousandSeparator="."
              decimalSeparator=","
              radius="md"
            />
          </Group>
          <div className="px-2 pt-2">
            <RangeSlider
              min={0}
              max={10000000}
              step={50000}
              value={[
                localMinPrice === '' ? 0 : Number(localMinPrice),
                localMaxPrice === '' ? 10000000 : Number(localMaxPrice)
              ]}
              onChange={(val) => {
                setLocalMinPrice(val[0])
                setLocalMaxPrice(val[1])
              }}
              label={(val) => formatCurrency(val)}
              color="primary"
              size="xs"
              styles={{
                thumb: { borderWidth: 2, borderColor: 'var(--mantine-color-primary-6)' }
              }}
            />
          </div>
        </Stack>
      </div>

      <Divider />

      {/* BRAND FILTER */}
      <div>
        <Text fw={600} size="sm" mb="xs" className="text-midnight_text">
          Brands
        </Text>
        <Stack gap="xs">
          <TextInput
            placeholder="Search brands..."
            size="xs"
            radius="md"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
          />
          <Stack gap={6} className="max-h-60 overflow-y-auto pr-1">
            {visibleBrands.length > 0 ? (
              visibleBrands.map((brand) => (
                <Checkbox
                  key={brand}
                  label={brand}
                  checked={queryBrand === brand}
                  onChange={(e) => {
                    updateUrlParams({ brand: e.currentTarget.checked ? brand : null })
                  }}
                  radius="sm"
                  styles={{
                    label: { fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
                  }}
                />
              ))
            ) : (
              <Text size="xs" c="dimmed">
                No brands match
              </Text>
            )}
          </Stack>
          {filteredBrands.length > 6 && (
            <UnstyledButton
              onClick={() => setBrandsExpanded((prev) => !prev)}
              className="flex items-center gap-1 text-xs fw-semibold text-primary-600 hover:text-primary-700 mt-1"
            >
              {brandsExpanded ? (
                <>
                  Show Less <IconChevronUp size={14} />
                </>
              ) : (
                <>
                  Show All ({filteredBrands.length}) <IconChevronDown size={14} />
                </>
              )}
            </UnstyledButton>
          )}
        </Stack>
      </div>

      <Divider />

      {/* STOCK FILTER */}
      <div>
        <Text fw={600} size="sm" mb="xs" className="text-midnight_text">
          Availability
        </Text>
        <Checkbox
          label="In Stock & Ready"
          checked={queryStock === 'in_stock'}
          onChange={(e) => {
            updateUrlParams({ stock: e.currentTarget.checked ? 'in_stock' : null })
          }}
          radius="sm"
          styles={{
            label: { fontSize: '13px', fontWeight: 500, cursor: 'pointer' }
          }}
        />
      </div>

      <Divider />

      {/* RATING FILTER */}
      <div>
        <Text fw={600} size="sm" mb="xs" className="text-midnight_text">
          Customer Rating
        </Text>
        <Stack gap="xs">
          {[4, 3, 2, 1].map((stars) => (
            <UnstyledButton
              key={stars}
              onClick={() => {
                updateUrlParams({ rating: queryRating === stars.toString() ? null : stars.toString() })
              }}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors border
                ${queryRating === stars.toString()
                  ? 'bg-primary-50/30 border-primary-300 text-primary-700'
                  : 'border-transparent hover:bg-gray-50 text-gray-700'
                }`}
            >
              <Group gap="xs" wrap="nowrap">
                <Rating value={stars} readOnly size="sm" />
                <Text size="xs" fw={500}>
                  & Up
                </Text>
              </Group>
              {queryRating === stars.toString() && (
                <IconX size={14} className="text-primary-500" />
              )}
            </UnstyledButton>
          ))}
        </Stack>
      </div>
    </Stack>
  )

  const breadcrumbItems = [
    <Link key="home" href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Text size="sm" c="dimmed">Home</Text>
    </Link>,
    <Text key="current" size="sm" fw={500}>
      {formatCategoryName(slug)}
    </Text>
  ]

  return (
    <Container size="xl" my="xl" mt={120} w="100%" mih={'60vh'}>
      <Breadcrumbs mb="md" separatorMargin={6} styles={{ separator: { color: 'var(--mantine-color-dimmed)' } }}>
        {breadcrumbItems}
      </Breadcrumbs>
      {/* PAGE HEADER */}
      <div className="sm:flex justify-between items-center mb-6">
        <div>
          <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-1">
            {formatCategoryName(slug)}
          </h2>
          <Text size="sm" c="dimmed">
            Browse our curated collection of premium products
          </Text>
        </div>

        {/* Local Input Search Bar */}
        <Group gap="xs" className="mt-4 sm:mt-0 w-full sm:w-auto" wrap="nowrap">
          <TextInput
            placeholder={`Search in ${formatCategoryName(slug)}...`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.currentTarget.value)}
            className="flex-grow sm:w-72"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit()
              }
            }}
          />
          <Button
            onClick={handleSearchSubmit}
            variant="light"
            color="primary"
            leftSection={<IconSearch size={16} />}
          >
            Find
          </Button>
          {/* Mobile Filter Button */}
          <Button
            onClick={openDrawer}
            variant="outline"
            color="gray"
            className="md:hidden"
            leftSection={<IconFilter size={16} />}
          >
            Filters
          </Button>
        </Group>
      </div>

      {/* ACTIVE FILTERS BADGES LIST */}
      {hasActiveFilters && (
        <Group gap="xs" mb="lg" className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
          <Text size="xs" fw={700} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Active:
          </Text>
          {querySearch && (
            <Badge
              variant="light"
              color="primary"
              size="md"
              radius="sm"
              rightSection={
                <IconX
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => updateUrlParams({ search: null })}
                />
              }
            >
              Search: "{querySearch}"
            </Badge>
          )}
          {queryBrand && (
            <Badge
              variant="light"
              color="blue"
              size="md"
              radius="sm"
              rightSection={
                <IconX
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => updateUrlParams({ brand: null })}
                />
              }
            >
              Brand: {queryBrand}
            </Badge>
          )}
          {(queryMinPrice || queryMaxPrice) && (
            <Badge
              variant="light"
              color="green"
              size="md"
              radius="sm"
              rightSection={
                <IconX
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setLocalMinPrice('')
                    setLocalMaxPrice('')
                    updateUrlParams({ min_price: null, max_price: null })
                  }}
                />
              }
            >
              Price: {queryMinPrice ? formatCurrency(queryMinPrice) : '0'} -{' '}
              {queryMaxPrice ? formatCurrency(queryMaxPrice) : 'Max'}
            </Badge>
          )}
          {queryStock === 'in_stock' && (
            <Badge
              variant="light"
              color="teal"
              size="md"
              radius="sm"
              rightSection={
                <IconX
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => updateUrlParams({ stock: null })}
                />
              }
            >
              In Stock Only
            </Badge>
          )}
          {queryRating && (
            <Badge
              variant="light"
              color="yellow"
              size="md"
              radius="sm"
              rightSection={
                <IconX
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => updateUrlParams({ rating: null })}
                />
              }
            >
              Rating: {queryRating}★ & Up
            </Badge>
          )}
          <UnstyledButton
            onClick={handleClearAllFilters}
            className="text-xs fw-semibold text-red-600 hover:text-red-700 ml-auto flex items-center gap-1"
          >
            Clear All
          </UnstyledButton>
        </Group>
      )}

      {/* CORE CONTENT GRID */}
      <Grid gutter="xl">
        {/* DESKTOP SIDEBAR FILTER */}
        <Grid.Col span={{ base: 12, md: 3 }} className="hidden md:block">
          <Card withBorder radius="lg" p="lg" className="sticky top-32 bg-white shadow-">
            {renderFiltersContent()}
          </Card>
        </Grid.Col>

        {/* PRODUCTS CATALOG LIST */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          {isLoading && products.length === 0 ? (
            <Grid>
              {Array.from({ length: 9 }).map((_, i) => (
                <Grid.Col key={i} span={{ base: 6, xs: 4, lg: 3 }}>
                  <CardProductSkeleton />
                </Grid.Col>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <>
              <Grid>
                {products.map((item, index: number) => (
                  <Grid.Col key={`${item.product_id}-${index}`} span={{ base: 6, xs: 4, lg: 3 }}>
                    <CardProduct item={item} />
                  </Grid.Col>
                ))}
              </Grid>

              {/* PAGINATION / INFINITE SCROLL LOADER INDICATOR */}
              <div ref={loaderRef} className="py-10 flex justify-center w-full">
                {isFetchingNextPage ? (
                  <Group gap="xs">
                    <Loader size="sm" color="primary" />
                    <Text size="sm" c="dimmed">
                      Loading more products...
                    </Text>
                  </Group>
                ) : hasNextPage ? (
                  <Button variant="subtle" onClick={() => fetchNextPage()} size="sm">
                    Load More
                  </Button>
                ) : (
                  <Text size="xs" c="dimmed" py="sm">
                    Showing all products in this selection.
                  </Text>
                )}
              </div>
            </>
          ) : (
            <Stack align="center" gap="md" py={60}>
              <Image
                src={'/images/product-not-found.png'}
                width={320}
                height={320}
                alt="Product not found"
                className="opacity-80"
              />
              <Text fw={600} fz={20} className="text-gray-800">
                No matching products found
              </Text>
              <Text c="dimmed" size="sm" ta="center" style={{ maxWidth: 360 }}>
                Try relaxing your filter parameters, removing active search badges, or searching for other keywords.
              </Text>
              {hasActiveFilters && (
                <Button variant="outline" color="primary" onClick={handleClearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </Stack>
          )}
        </Grid.Col>
      </Grid>

      {/* MOBILE DRAWER FILTERS */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Filter Options"
        padding="md"
        size="md"
        position="right"
        radius="lg"
        styles={{
          title: { fontWeight: 700, fontSize: '18px' }
        }}
      >
        <div className="pb-16">{renderFiltersContent()}</div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
          <Button fullWidth onClick={closeDrawer} color="primary" radius="md">
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </Container>
  )
}

export default ProductsClient
