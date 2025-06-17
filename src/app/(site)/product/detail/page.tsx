'use client'
import ModalAuthentication from '@/components/Modal/ModalAuthentication'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { embedImage, formatCurrency } from '@/utils/util'
import { Box, Button, Card, Container, Grid, Group, Image, Stack, Text } from '@mantine/core'
import { hasCookie } from 'cookies-next/client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: product } = useProducts.getProductDetail(productId)
  const { mutate: addToCart } = useCart.addToCart()

  const handleAddCart = useCallback(async () => {
    const isLoggedIn = hasCookie('user')
    if (isLoggedIn) {
      setLoading(true)
      const payload = {
        product_id: product!.product_id,
        quantity: 1,
        price: product!.product_price,
        payment_method: null
      }
      addToCart(payload, {
        onSuccess: (res) => {
          setLoading(false)
          toast.success(res.message)
        },
        onError: (err) => {
          setLoading(false)
          toast.error(err.message)
        }
      })
    } else {
      setAuthModalOpen(true)
    }
  }, [])

  const handleLogin = useCallback(() => {
    router.push('/signin')
  }, [])

  return (
    <Container size={'xl'} my={'xl'} mt={100} w={'100%'}>
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-midnight_text text-2xl lg:text-4xl font-semibold mb-5 sm:mb-0"></h2>
      </div>
      <Grid>
        {product && (
          <Card shadow="sm" padding="lg" radius="md" w={'100%'}>
            <Card.Section>
              <Image
                src={embedImage(product.product_image_url)}
                alt="Norway"
                h={600}
                fit="inherit"
              />
            </Card.Section>

            <Box mt={'md'}>
              <Group justify="space-between">
                <Box>
                  <Text fw={500} c="primary">
                    {product.product_brand}
                  </Text>
                  <Text fw={500}>{product.product_name}</Text>
                </Box>

                <Button mt="md" radius="xl" onClick={handleAddCart} loading={loading}>
                  Add to Cart
                </Button>
              </Group>

              <Group justify="space-between" mt={'md'}>
                <Text size="sm" c="dimmed">
                  {product.model}
                </Text>
                <Text size="sm" c="dimmed">
                  {formatCurrency(product.product_price)}
                </Text>
              </Group>

              <Stack mt={'lg'} gap={'xs'}>
                <Text size="sm" c="dimmed">
                  Deskripsi
                </Text>

                <Text size="sm" c="dimmed">
                  Material: {product.material || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  Duration: {product.duration || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  base_curve: {product.base_curve || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  diameter: {product.diameter || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  Power Range: {product.power_range || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  Water Content: {product.water_content || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  UV Protection: {product.uv_protection || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  Color: {product.color || '-'}
                </Text>
                <Text size="sm" c="dimmed">
                  Coating: {product.coating || '-'}
                </Text>
              </Stack>

              {/* <Button fullWidth mt="md" radius="xl" onClick={handleAddCart} loading={loading}>
              Add to Cart
            </Button> */}
            </Box>
          </Card>
        )}
      </Grid>

      <ModalAuthentication
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </Container>
  )
}

export default ProductDetail
