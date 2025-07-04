'use client'

import CardProduct from '@/components/Common/CardProduct'
import CardProductSkeleton from '@/components/Common/Skeleton/CardProductSkeleton'
import { useProducts } from '@/hooks/useProducts'
import { Container, Grid, Stack, Text, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import Image from 'next/image'
import { useState } from 'react'

const Recommendations = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const { data: products, isLoading } = useProducts.getRecommendations({ search: debouncedSearch })

  return (
    <Container size="xl" my="xl" mt={100} w="100%">
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold mb-5 sm:mb-0">Recommendations</h2>
        <TextInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="sm:w-72"
          radius="xl"
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
