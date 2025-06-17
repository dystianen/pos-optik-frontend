'use client'
import CardProduct from '@/components/Common/CardProduct'
import { useProducts } from '@/hooks/useProducts'
import { Container, Grid } from '@mantine/core'
import { useParams, useSearchParams } from 'next/navigation'

function formatCategoryName(slug: string) {
  return slug
    .split('-') // Pisah berdasarkan tanda "-"
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
    .join(' ') // Gabungkan dengan spasi
}

const Products = () => {
  const params = useParams()
  const slug = params.slug as string

  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  const { data: products } = useProducts.getProduct(category)

  return (
    <Container size={'xl'} my={'xl'} mt={100} w={'100%'}>
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-5 sm:mb-0">
          {formatCategoryName(slug)}
        </h2>
      </div>
      <Grid>
        {products?.map((item, index: number) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
            <CardProduct item={item} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}

export default Products
