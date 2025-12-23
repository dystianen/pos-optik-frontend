'use client'
import { ProductDetailSkeleton } from '@/components/Common/Skeleton/ProductDetailSkeleton'
import SectionCarousel from '@/components/Home/SectionCarousel'
import ModalAuthentication from '@/components/Modal/ModalAuthentication'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { TGalleryDetail, Variant } from '@/types/product'
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
import { clsx } from 'clsx'
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
  const productId = searchParams.get('id') as string
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<TImage>({
    url: '',
    alt_text: ''
  })
  const [galleryImage, setGalleryImage] = useState<TGalleryDetail[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  const { data: product, isFetching: isLoadingPage } = useProducts.getProductDetail(productId)
  const { data: attributes } = useProducts.getProductAttribute(productId || '')
  const { mutate: addToCart } = useCart.addToCart()
  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useProducts.getRecommendations({ productId, limit: 10 })

  useEffect(() => {
    setSelectedVariant(null)
    setVariants([])
    setGalleryImage([])
    setPrimaryImage({ url: '', alt_text: '' })
  }, [productId])

  useEffect(() => {
    if (!product) return
    if (product.gallery.length > 0) {
      setPrimaryImage({
        url: product.gallery[0].url,
        alt_text: product.gallery[0].alt_text
      })
      setGalleryImage(product.gallery)
    }
    setVariants(product.variants)
  }, [product])

  const handleAddCart = useCallback(async () => {
    const isLoggedIn = hasCookie('user')
    if (isLoggedIn) {
      setLoading(true)
      const payload = {
        product_id: product!.product_id,
        variant_id: selectedVariant?.variant_id ?? null,
        quantity: 1
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
  }, [product, selectedVariant])

  const handleLogin = useCallback(() => {
    router.push('/signin')
  }, [])

  const handleSubmit = useCallback(() => {}, [])

  const handleSelectGallery = useCallback((item: TGalleryDetail) => {
    setPrimaryImage({ url: item.url, alt_text: item.alt_text })
    setSelectedVariant(null)
  }, [])

  const handleSelectVariant = useCallback((variant: Variant) => {
    setPrimaryImage({ url: variant.image.url, alt_text: variant.image.alt_text })
    setSelectedVariant(variant)
  }, [])

  const price = selectedVariant?.price ?? product?.product_price ?? '0'

  const variantLabel =
    selectedVariant && selectedVariant.variant_name !== product?.product_name
      ? `(${selectedVariant.variant_name})`
      : ''

  return (
    <Container size={'xl'} my={'xl'} mt={100} w={'100%'}>
      {isLoadingPage ? (
        <ProductDetailSkeleton />
      ) : (
        <>
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
                            <UnstyledButton key={index} onClick={() => handleSelectGallery(item)}>
                              <Card
                                p={2}
                                shadow="md"
                                radius="md"
                                className={clsx(
                                  'card-hover',
                                  primaryImage?.url === item.url && 'border-primary'
                                )}
                              >
                                <Image src={item.url} h={80} fit="contain" />
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
                        <Text fw={600} c="primary" style={{ textTransform: 'uppercase' }}>
                          {product.product_brand}
                        </Text>
                        <Text fw={500}>
                          {product.product_name} {variantLabel}
                        </Text>
                      </Box>

                      <Button mt="md" radius="xl" onClick={handleAddCart} loading={loading}>
                        Add to Cart
                      </Button>
                    </Group>

                    <Text size="xl" fw={600} c="primary">
                      {formatCurrency(price)}
                    </Text>

                    <Stack mt={'lg'} gap={'xs'}>
                      <Text size="sm" fw={500}>
                        Product Description
                      </Text>

                      {attributes?.map((attr) => (
                        <Text size="sm" c="dimmed" key={attr.attribute_id}>
                          {attr.attribute_name} : {attr.values.join(', ')}
                        </Text>
                      ))}
                    </Stack>
                  </Box>
                </Card>
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Card shadow="sm">
                <h2 className="text-xl font-semibold mb-5 sm:mb-0">Product Variants</h2>
                <SimpleGrid cols={{ base: 3, sm: 5, md: 3 }} mt={'sm'}>
                  {variants.map((item, index) => (
                    <UnstyledButton
                      key={index}
                      className="card-hover"
                      onClick={() => handleSelectVariant(item)}
                    >
                      <Card
                        shadow="sm"
                        p={'xs'}
                        className={clsx(
                          'card-hover',
                          primaryImage?.url === item.image.url && 'border-primary'
                        )}
                      >
                        <Image
                          src={item.image.url}
                          alt={item.image.alt_text}
                          h={80}
                          fit="contain"
                        />
                        <Text fz={'10'} lineClamp={2}>
                          {item.variant_name}
                        </Text>
                        <Text fz={'10'} c="primary" mt={'xs'}>
                          {formatCurrency(item.price)}
                        </Text>
                      </Card>
                    </UnstyledButton>
                  ))}
                </SimpleGrid>
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}

      <SectionCarousel
        title="Recommendations"
        exploreTo=""
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
