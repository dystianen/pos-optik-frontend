'use client'

import CardProduct from '@/components/Common/CardProduct'
import CardProductSkeleton from '@/components/Common/Skeleton/CardProductSkeleton'
import { useProducts } from '@/hooks/useProducts'
import { Container, Grid } from '@mantine/core'
import { useParams, useSearchParams } from 'next/navigation'

function formatCategoryName(slug: string) {
  return slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const Products = () => {
  const params = useParams()
  const slug = params.slug as string

  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  const { data: products, isLoading } = useProducts.getProduct(category)

  return (
    <Container size="xl" my="xl" mt={100} w="100%">
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-5 sm:mb-0">
          {formatCategoryName(slug)}
        </h2>
      </div>

      <Grid>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid.Col key={i} span={{ base: 6, xs: 4, md: 3 }}>
                <CardProductSkeleton />
              </Grid.Col>
            ))
          : products?.map((item, index: number) => (
              <Grid.Col key={index} span={{ base: 6, xs: 4, md: 3 }}>
                <CardProduct item={item} />
              </Grid.Col>
            ))}
      </Grid>
    </Container>
  )
}

export default Products
