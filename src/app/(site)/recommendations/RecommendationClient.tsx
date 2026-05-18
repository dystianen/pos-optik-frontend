'use client'

import CardProduct from '@/components/ui/CardProduct'
import CardProductSkeleton from '@/components/ui/Skeleton/CardProductSkeleton'
import { useMyRecommendations, useProduct } from '@/features/product/hooks'
import { Button, Container, Grid, Paper, Stack, Text, ThemeIcon, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconSparkles } from '@tabler/icons-react'
import { hasCookie } from 'cookies-next/client'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'

const Recommendations = () => {
  const router = useRouter()
  const isLoggedIn = hasCookie('user')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  // Jika ada search, gunakan general product search
  // Jika tidak ada search, gunakan personalized recommendations
  const { data: myRecs, isLoading: isLoadingRecs } = useMyRecommendations({
    limit: 20,
    enabled: isLoggedIn
  })
  const { data: searchResult, isLoading: isLoadingSearch } = useProduct({
    category: null,
    search: debouncedSearch
  })

  const isLoading = debouncedSearch ? isLoadingSearch : isLoadingRecs
  const products = debouncedSearch ? searchResult : myRecs

  return (
    <Container size="xl" my="xl" mt={100} w="100%">
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold mb-5 sm:mb-0">
          {debouncedSearch ? `Search Results for "${debouncedSearch}"` : 'Just For You'}
        </h2>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="sm:w-72"
          leftSection={<IconSearch size={18} />}
        />
      </div>

      {isLoading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid.Col key={i} span={{ base: 6, xs: 4, md: 3 }}>
              <CardProductSkeleton />
            </Grid.Col>
          ))}
        </Grid>
      ) : !isLoggedIn && !debouncedSearch ? (
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
              onClick={() => router.push('/signin')}
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
            <Grid.Col key={index} span={{ base: 6, xs: 4, md: 3 }}>
              <CardProduct item={item} />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Stack align="center" gap={0}>
          <Image
            src={'/images/product-not-found.png'}
            width={400}
            height={400}
            alt="Product not found"
          />
          <Text c="dimmed" fz={24}>
            Product Not Found.
          </Text>
        </Stack>
      )}
    </Container>
  )
}

export default Recommendations
