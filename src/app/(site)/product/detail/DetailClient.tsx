'use client'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton/ProductDetailSkeleton'
import { useAddCart } from '@/features/cart/hooks'
import type { PrescriptionPayload } from '@/features/cart/types'
import { useProductAttribute, useProductDetail, useRecommendations } from '@/features/product/hooks'
import type { TGalleryDetail, Variant } from '@/features/product/types'
import { ReviewSection } from '@/features/review/components/ReviewSection'
import { useMediaQueryFromBreakpoints } from '@/hooks/useMediaQueryFromBreakpoints'
import { formatCurrency } from '@/utils/format'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { IconCircleX } from '@tabler/icons-react'
import { clsx } from 'clsx'
import { hasCookie } from 'cookies-next/client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CartLensForm = dynamic(() => import('@/features/cart/components/CartLensForm'), {
  ssr: false
})
const ModalAuthentication = dynamic(() => import('@/components/Modal/ModalAuthentication'), {
  ssr: false
})

type TImage = {
  url: string
  alt_text: string
}

const DetailClient = ({ productId }: { productId: string }) => {
  const router = useRouter()
  const isMobile = useMediaQueryFromBreakpoints()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<TImage>({
    url: '',
    alt_text: ''
  })
  const [galleryImage, setGalleryImage] = useState<TGalleryDetail[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [prescription, setPrescription] = useState<PrescriptionPayload>({
    type: 'none'
  })
  const [quantity, setQuantity] = useState<number>(1)

  const { data: product, isLoading: isLoadingPage } = useProductDetail(productId)
  const { data: attributes } = useProductAttribute(productId || '')
  const { mutate: addToCart } = useAddCart()
  const { data: recommendations, isLoading: isLoadingRecommendations } = useRecommendations({
    productId,
    limit: 10
  })

  useEffect(() => {
    setSelectedVariant(null)
    setVariants([])
    setGalleryImage([])
    setPrimaryImage({ url: '', alt_text: '' })
  }, [productId])

  useEffect(() => {
    if (!product) return
    const productVariants = product.variants || []
    setVariants(productVariants)

    // Auto-select first in-stock variant
    const firstInStock = productVariants.find((v) => Number(v.stock) > 0)

    if (firstInStock) {
      setSelectedVariant(firstInStock)
      setPrimaryImage({
        url: firstInStock.image.url,
        alt_text: firstInStock.image.alt_text
      })
    } else if (product.gallery.length > 0) {
      setPrimaryImage({
        url: product.gallery[0].url,
        alt_text: product.gallery[0].alt_text
      })
    }
    setGalleryImage(product.gallery)
  }, [product])

  const handleAddCart = async () => {
    const isLoggedIn = hasCookie('user')
    if (isLoggedIn) {
      setLoading(true)
      const payload = {
        product_id: product!.product_id,
        variant_id: selectedVariant?.variant_id ?? null,
        quantity,
        prescription
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
  }

  const handleLogin = useCallback(() => {
    if (typeof window !== 'undefined') {
      const redirectTo = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/signin?redirectTo=${redirectTo}`)
    } else {
      router.push('/signin')
    }
  }, [router])

  const handleSelectGallery = useCallback((item: TGalleryDetail) => {
    setPrimaryImage({ url: item.url, alt_text: item.alt_text })
  }, [])

  const handleSelectVariant = useCallback((variant: Variant) => {
    setPrimaryImage({ url: variant.image.url, alt_text: variant.image.alt_text })
    setSelectedVariant(variant)
    setQuantity((q) => Math.min(Number(variant.stock), q))
  }, [])

  const price = selectedVariant?.price ?? product?.product_price ?? '0'

  const variantLabel =
    selectedVariant && selectedVariant.variant_name !== product?.product_name
      ? `(${selectedVariant.variant_name})`
      : ''

  return (
    <>
      <Container size={'xl'} mt={{ base: 70, md: 100 }}>
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
                  <Card withBorder padding="lg" w={'100%'}>
                    <Card.Section>
                      <Grid>
                        <Grid.Col span={{ md: 2 }}>
                          <Flex
                            direction={{ base: 'row', md: 'column' }}
                            mt={'sm'}
                            mx={'sm'}
                            justify="start"
                            w={'max-content'}
                            gap={'md'}
                          >
                            {galleryImage.map((item, index) => (
                              <UnstyledButton key={index} onClick={() => handleSelectGallery(item)}>
                                <Card
                                  p={6}
                                  withBorder
                                  className={clsx(
                                    'card-hover',
                                    primaryImage?.url === item.url && 'border-primary'
                                  )}
                                >
                                  <div style={{ position: 'relative', height: 60, width: 60 }}>
                                    <Image
                                      src={item.url}
                                      alt={item.alt_text}
                                      fill
                                      style={{ objectFit: 'contain' }}
                                    />
                                  </div>
                                </Card>
                              </UnstyledButton>
                            ))}
                          </Flex>
                        </Grid.Col>
                        <Grid.Col span={{ md: 10 }}>
                          {primaryImage.url !== '' && (
                            <div
                              onClick={() => setImageModalOpen(true)}
                              style={{
                                position: 'relative',
                                height: isMobile ? 300 : 400,
                                width: '100%',
                                cursor: 'pointer'
                              }}
                              title="Click to zoom image"
                            >
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.alt_text}
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                              />
                            </div>
                          )}
                        </Grid.Col>
                      </Grid>
                    </Card.Section>

                    <Box mt={'md'}>
                      <Group justify="space-between" align="flex-start" wrap='nowrap'>
                        <Box>
                          <Text fw={600} c="primary" style={{ textTransform: 'uppercase' }}>
                            {product.product_brand}
                          </Text>
                          <Text fw={500}>
                            {product.product_name} {variantLabel}
                          </Text>
                          <Text mt={'md'} size="xl" fw={600} c="primary">
                            {formatCurrency(Number(price) * quantity)}
                          </Text>
                        </Box>

                        <Stack gap={16} align="flex-end">
                          {/* Quantity Stepper */}
                          <Box
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0,
                              border: '1.5px solid var(--mantine-color-default-border)',
                              borderRadius: 8,
                              overflow: 'hidden',
                              width: 'fit-content'
                            }}
                          >
                            <button
                              id="qty-decrease-btn"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              disabled={quantity <= 1}
                              style={{
                                width: 34,
                                height: 34,
                                border: 'none',
                                background:
                                  quantity <= 1
                                    ? 'var(--mantine-color-gray-1)'
                                    : 'var(--mantine-color-primary-0)',
                                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: 18,
                                fontWeight: 700,
                                color:
                                  quantity <= 1
                                    ? 'var(--mantine-color-gray-5)'
                                    : 'var(--mantine-color-primary-7)',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              −
                            </button>
                            <Box
                              style={{
                                width: 44,
                                height: 34,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: 15,
                                background: 'white',
                                borderLeft: '1.5px solid var(--mantine-color-default-border)',
                                borderRight: '1.5px solid var(--mantine-color-default-border)'
                              }}
                            >
                              {quantity}
                            </Box>
                            <button
                              id="qty-increase-btn"
                              onClick={() =>
                                setQuantity((q) => {
                                  const maxStock = selectedVariant
                                    ? Number(selectedVariant.stock)
                                    : product
                                      ? Number(product.product_stock)
                                      : Infinity
                                  return Math.min(maxStock, q + 1)
                                })
                              }
                              disabled={
                                selectedVariant
                                  ? quantity >= Number(selectedVariant.stock)
                                  : product
                                    ? quantity >= Number(product.product_stock)
                                    : false
                              }
                              style={{
                                width: 34,
                                height: 34,
                                border: 'none',
                                background:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant &&
                                    product &&
                                    quantity >= Number(product.product_stock))
                                    ? 'var(--mantine-color-gray-1)'
                                    : 'var(--mantine-color-primary-0)',
                                cursor:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant &&
                                    product &&
                                    quantity >= Number(product.product_stock))
                                    ? 'not-allowed'
                                    : 'pointer',
                                fontSize: 18,
                                fontWeight: 700,
                                color:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant &&
                                    product &&
                                    quantity >= Number(product.product_stock))
                                    ? 'var(--mantine-color-gray-5)'
                                    : 'var(--mantine-color-primary-7)',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              +
                            </button>
                          </Box>

                          <Tooltip
                            label="Select variant first"
                            disabled={variants.length === 0 || !!selectedVariant}
                          >
                            <Button
                              onClick={handleAddCart}
                              disabled={variants.length > 0 && !selectedVariant}
                              loading={loading}
                            >
                              Add to Cart
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Group>

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

                    <Divider my="xl" />

                    <ReviewSection productId={productId} />
                  </Card>
                )}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Stack gap={'md'}>
                  {variants.length > 0 ? (
                    <>
                      <Card withBorder>
                        <Text fw={600} fz="lg" mb="sm">
                          Product Variants
                        </Text>
                        <SimpleGrid cols={{ base: 3, sm: 5, md: 3 }} mt={'sm'}>
                          {variants.map((item, index) => {
                            const renderProps =
                              Number(item.stock) === 0
                                ? {
                                    className: '',
                                    cardClass: 'opacity-50 cursor-not-allowed',
                                    badge: (
                                      <Badge
                                        size="sm"
                                        color="red"
                                        variant="light"
                                        leftSection={<IconCircleX size={14} />}
                                      >
                                        Out of Stock
                                      </Badge>
                                    ),
                                    onClick: undefined
                                  }
                                : {
                                    className: 'card-hover',
                                    cardClass: clsx(
                                      'card-hover',
                                      primaryImage?.url === item.image.url && 'border-primary'
                                    ),
                                    badge: (
                                      <Badge size="sm" color="green" variant="light">
                                        Stok: {item.stock}
                                      </Badge>
                                    ),
                                    onClick: () => handleSelectVariant(item)
                                  }

                            return (
                              <UnstyledButton key={index} onClick={renderProps.onClick}>
                                <Card withBorder p={'xs'} className={renderProps.cardClass}>
                                  <Card.Section p="md">
                                    <div
                                      style={{ position: 'relative', height: 50, width: '100%' }}
                                    >
                                      <Image
                                        src={item.image.url}
                                        alt={item.image.alt_text}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                      />
                                    </div>
                                  </Card.Section>
                                  <Stack gap={2}>
                                    <Text fz={'10'} lineClamp={2} mt={'xs'}>
                                      {item.variant_name}
                                    </Text>
                                    <Text fz={'10'} c="primary">
                                      {formatCurrency(item.price)}
                                    </Text>
                                    <Box>{renderProps.badge}</Box>
                                  </Stack>
                                </Card>
                              </UnstyledButton>
                            )
                          })}
                        </SimpleGrid>
                      </Card>

                      <Divider my="sm" />
                    </>
                  ) : null}

                  {product?.is_prescription_supported && (
                    <CartLensForm value={prescription} onChange={setPrescription} />
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </>
        )}

        <ModalAuthentication
          opened={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />

        <Modal
          opened={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          size="lg"
          centered
          title="Product Image Detail"
          styles={{
            header: {
              borderBottom: '1px solid var(--mantine-color-default-border)'
            }
          }}
        >
          <div style={{ position: 'relative', height: isMobile ? 350 : 500, width: '100%' }}>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Modal>
      </Container>

      <SectionCarousel
        title="Recommendations"
        exploreTo=""
        data={recommendations ?? []}
        isLoading={isLoadingRecommendations}
      />
    </>
  )
}

export default DetailClient
