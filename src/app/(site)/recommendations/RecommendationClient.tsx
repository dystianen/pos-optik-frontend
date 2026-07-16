'use client'

import CardProduct from '@/components/ui/CardProduct'
import CardProductSkeleton from '@/components/ui/Skeleton/CardProductSkeleton'
import { useMyRecommendations, useProduct } from '@/features/product/hooks'
import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  TextInput,
  Title,
  UnstyledButton
} from '@mantine/core'
import { IconSearch, IconSparkles, IconX } from '@tabler/icons-react'
import { hasCookie } from 'cookies-next/client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Recommendations = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const querySearch = searchParams.get('search') ?? ''

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    setIsLoggedIn(hasCookie('user'))
  }, [])

  // If search query is present, fall back to general product search
  const { data: myRecs, isLoading: isLoadingRecs } = useMyRecommendations({
    limit: 12,
    enabled: isLoggedIn
  })
  const { data: searchResult, isLoading: isLoadingSearch } = useProduct({
    category: null,
    search: querySearch
  })

  const isLoading = querySearch ? isLoadingSearch : isLoadingRecs
  const products = querySearch ? searchResult : myRecs

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
    <Container size="xl" my="xl" mt={100} w="100%">
      {/* PAGE HEADER */}
      <div className="sm:flex justify-between items-center mb-6">
        <div>
          <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-1">
            {querySearch ? `Search Results` : 'Just For You'}
          </h2>
          <Text size="sm" c="dimmed">
            {querySearch
              ? `Showing results for search filter`
              : 'Personalized styling recommendations curated for you'}
          </Text>
        </div>
        <Group gap="xs" className="mt-4 sm:mt-0 w-full sm:w-auto" wrap="nowrap">
          <TextInput
            placeholder="Search recommendations..."
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

      {/* PRODUCTS DISPLAY */}
      {isLoading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid.Col key={i} span={{ base: 6, xs: 4, md: 3, lg: 2 }}>
              <CardProductSkeleton />
            </Grid.Col>
          ))}
        </Grid>
      ) : !isLoggedIn && !querySearch ? (
        <Stack align="center" gap="md" py={50}>
          <Paper
            p="xl"
            radius="md"
            withBorder
            style={{
              maxWidth: 500,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <ThemeIcon
              size={64}
              radius="50%"
              mx="auto"
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-primary-1) 0%, var(--mantine-color-primary-2) 100%)',
                color: 'var(--mantine-color-primary-6)'
              }}
            >
              <IconSparkles size={36} />
            </ThemeIcon>

            <Title order={3} mt="md" fw={700} c="dark.7">
              Discover Your Perfect Fit
            </Title>

            <Text c="dimmed" size="sm" mt="xs" mb="lg">
              Sign in to unlock personalized style recommendations tailored specifically to your preferences and eye prescription.
            </Text>

            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const redirectTo = encodeURIComponent(window.location.pathname + window.location.search)
                  router.push(`/signin?redirectTo=${redirectTo}`)
                } else {
                  router.push('/signin')
                }
              }}
              fullWidth
              size="md"
              color="primary"
              variant="gradient"
              gradient={{ from: 'primary.6', to: 'primary.8', deg: 135 }}
              style={{
                transition: 'all 0.3s ease'
              }}
            >
              Sign In to Personalize
            </Button>
          </Paper>
        </Stack>
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

export default Recommendations
