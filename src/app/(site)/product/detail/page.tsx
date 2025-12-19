'use client'
import SectionCarousel from '@/components/Home/SectionCarousel'
import ModalAuthentication from '@/components/Modal/ModalAuthentication'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { Gallery } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core'
import { hasCookie } from 'cookies-next/client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type TImage = {
  url: string
  alt_text: string
}

const ProductDetail = () => {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<TImage>({
    url: '',
    alt_text: ''
  })
  console.log('🚀 ~ ProductDetail ~ primaryImage:', primaryImage)
  const [galleryImage, setGalleryImage] = useState<Gallery[]>([])
  const [variantImage, setVariantImage] = useState<Gallery[]>([])

  const { data: product } = useProducts.getProductDetail(productId)
  const { mutate: addToCart } = useCart.addToCart()
  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useProducts.getRecommendations({ limit: 10 })

  useEffect(() => {
    if (!product) return
    setPrimaryImage({
      url: product.gallery[0].url,
      alt_text: product.gallery[0].alt_text
    })
    setGalleryImage(product.gallery)
    setVariantImage(product.variant_image)
  }, [product])

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

  const handleSubmit = useCallback(() => {}, [])

  return (
    <Container size={'xl'} my={'xl'} mt={100} w={'100%'}>
      <Text fw={600} fz={'h3'} mb={'sm'}>
        Product Details
      </Text>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
          {product && (
            <Card shadow="sm" padding="lg" radius="md" w={'100%'}>
              <Card.Section>
                <Grid>
                  <Grid.Col span={{ md: 2 }}>
                    <Stack mt={'sm'} mx={'sm'} justify="start" w={'max-content'}>
                      {galleryImage.map((item, index) => (
                        <UnstyledButton
                          key={index}
                          onClick={() =>
                            setPrimaryImage({ url: item.url, alt_text: item.alt_text })
                          }
                          style={{
                            border: primaryImage?.url === item.url ? '1px solid #4F46E5' : '',
                            borderRadius: 5
                          }}
                        >
                          <Card p={1} shadow="sm" radius={'md'}>
                            <Image src={item.url} h={80} />
                          </Card>
                        </UnstyledButton>
                      ))}
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ md: 10 }}>
                    {primaryImage.url !== '' && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt_text}
                        h={400}
                        fit="contain"
                      />
                    )}
                  </Grid.Col>
                </Grid>
              </Card.Section>

              <Box mt={'md'}>
                <Group justify="space-between">
                  <Box>
                    <Text fw={500} c="primary">
                      {product.product_brand}
                    </Text>
                    <Text fw={500}>
                      {product.product_name}{' '}
                      {product.product_name !== primaryImage.alt_text
                        ? `(${primaryImage.alt_text})`
                        : ''}
                    </Text>
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
                  <Text size="sm" fw={500}>
                    Product Description
                  </Text>

                  <Text size="sm" c="dimmed">
                    Lens Material: {product.material || '-'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Frame Material: {product.duration || '-'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Frame Shape: {product.base_curve || '-'}
                  </Text>
                </Stack>
              </Box>
            </Card>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
          <Card shadow="sm">
            <h2 className="text-xl font-semibold mb-5 sm:mb-0">Product Variants</h2>
            <SimpleGrid cols={{ base: 3, sm: 5, md: 3 }} mt={'sm'}>
              {variantImage.map((item, index) => (
                <UnstyledButton
                  key={index}
                  onClick={() => setPrimaryImage({ url: item.url, alt_text: item.alt_text })}
                  style={{
                    border: primaryImage?.url === item.url ? '1px solid #4F46E5' : '',
                    borderRadius: 5
                  }}
                >
                  <Card shadow="sm" p={0}>
                    <Image src={item.url} h={80} />
                    <Text p={'xs'} fz={'10'}>
                      {item.alt_text}
                    </Text>
                  </Card>
                </UnstyledButton>
              ))}
            </SimpleGrid>
          </Card>
        </Grid.Col>
      </Grid>

      <SectionCarousel
        title="Recommendations"
        exploreTo="/recommendations"
        data={recommendations ?? []}
        isLoading={isLoadingRecommendations}
      />

      <ModalAuthentication
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </Container>
  )
}

export default ProductDetail
