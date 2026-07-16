'use client'

import CardProduct from '@/components/ui/CardProduct'
import CardProductSkeleton from '@/components/ui/Skeleton/CardProductSkeleton'
import { useBestSeller } from '@/features/product/hooks'
import { Badge, Button, Container, Grid, Group, Stack, Text, TextInput, UnstyledButton } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const BestSellerClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const querySearch = searchParams.get('search') ?? ''

  const [localSearch, setLocalSearch] = useState('')

  const { data: products, isLoading } = useBestSeller({ search: querySearch, limit: 12 })

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

  const handleSearchSubmit = () => {
    if (!localSearch.trim()) return
    updateUrlParams({ search: localSearch.trim() })
    setLocalSearch('')
  }

  return (
    <Container size="xl" mt={{ base: 70, md: 100 }}>
      {/* PAGE HEADER */}
      <div className="sm:flex justify-between items-center mb-6">
        <div>
          <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-1">Best Seller</h2>
          <Text size="sm" c="dimmed">
            Browse our top-selling eyewear products
          </Text>
        </div>
        <Group gap="xs" className="mt-4 sm:mt-0 w-full sm:w-auto" wrap="nowrap">
          <TextInput
            placeholder="Search best sellers..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.currentTarget.value)}
            className="flex-grow sm:w-72"
            leftSection={<IconSearch size={18} />}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit()
              }
            }}
          />
          <Button onClick={handleSearchSubmit} variant="light" color="primary">
            Find
          </Button>
        </Group>
      </div>

      {/* ACTIVE SEARCH TAG */}
      {querySearch && (
        <Group gap="xs" mb="lg" className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
          <Text size="xs" fw={700} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Active:
          </Text>
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
          <UnstyledButton
            onClick={() => updateUrlParams({ search: null })}
            className="text-xs fw-semibold text-red-600 hover:text-red-700 ml-auto flex items-center gap-1"
          >
            Clear Search
          </UnstyledButton>
        </Group>
      )}

      {/* PRODUCTS LIST */}
      {isLoading ? (
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid.Col key={i} span={{ base: 6, xs: 4, md: 3, lg: 2 }}>
              <CardProductSkeleton />
            </Grid.Col>
          ))}
        </Grid>
      ) : products && products.length > 0 ? (
        <Grid>
          {products.map((item, index: number) => (
            <Grid.Col key={index} span={{ base: 6, xs: 4, md: 3, lg: 2 }}>
              <CardProduct item={item} />
            </Grid.Col>
          ))}
        </Grid>
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
            Product Not Found
          </Text>
          <Text c="dimmed" size="sm" ta="center" style={{ maxWidth: 360 }}>
            Try relaxing your filter parameters, removing active search badges, or searching for other keywords.
          </Text>
        </Stack>
      )}
    </Container>
  )
}

export default BestSellerClient
