'use client'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton/ProductDetailSkeleton'
import { useAddCart } from '@/features/cart/hooks'
import type { PrescriptionPayload } from '@/features/cart/types'
import { useProductAttribute, useProductDetail, useRecommendations, useToggleWishlist } from '@/features/product/hooks'
import { useAvailableCoupons } from '@/features/order/hooks'
import type { TGalleryDetail, Variant } from '@/features/product/types'
import { ReviewSection } from '@/features/review/components/ReviewSection'
import { useProductReviews } from '@/features/review/hooks'
import { useMediaQueryFromBreakpoints } from '@/hooks/useMediaQueryFromBreakpoints'
import { formatCurrency } from '@/utils/format'
import {
  ActionIcon,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Rating,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import {
  IconCircleX,
  IconHeart,
  IconHeartFilled,
  IconShare,
  IconShoppingCart,
  IconStar
} from '@tabler/icons-react'
import { clsx } from 'clsx'
import { hasCookie } from 'cookies-next/client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './Detail.module.css'

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

/* ─── Stock badge helper ─────────────────────────────────── */
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className={clsx(styles.stockBadge, styles.stockOut)}
        style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca' }}>
        <span className={styles.stockDot} /> Out of Stock
      </span>
    )
  }
  if (stock <= 5) {
    return (
      <span className={clsx(styles.stockBadge, styles.stockLow)}
        style={{ color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a' }}>
        <span className={styles.stockDot} /> Low Stock ({stock} left)
      </span>
    )
  }
  return (
    <span className={clsx(styles.stockBadge, styles.stockIn)}
      style={{ color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
      <span className={styles.stockDot} /> In Stock
    </span>
  )
}

/* ─── Breadcrumb helper ─────────────────────────────────── */
const getBreadcrumbData = (path?: string) => {
  if (!path) return { label: 'Products', href: null }

  try {
    const url = new URL(path, 'http://localhost')
    const pathname = url.pathname

    if (pathname === '/') {
      return { label: 'Products', href: null }
    }
    if (pathname === '/new-eyewear') {
      return { label: 'New Eyewear', href: path }
    }
    if (pathname === '/best-seller') {
      return { label: 'Best Seller', href: path }
    }
    if (pathname === '/recommendations') {
      return { label: 'Recommendations', href: path }
    }
    if (pathname === '/wishlist') {
      return { label: 'Wishlist', href: path }
    }
    if (pathname.startsWith('/product/')) {
      const slug = pathname.replace('/product/', '')
      const formatted = slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return { label: formatted, href: path }
    }

    return { label: 'Products', href: null }
  } catch (error) {
    return { label: 'Products', href: null }
  }
}

/* ─── Main Component ─────────────────────────────────────── */
const DetailClient = ({ productId, fromPage }: { productId: string; fromPage?: string }) => {
  const router = useRouter()
  const isMobile = useMediaQueryFromBreakpoints()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isWishlistLocal, setIsWishlistLocal] = useState(false)
  const [primaryImage, setPrimaryImage] = useState<TImage>({ url: '', alt_text: '' })
  const [galleryImage, setGalleryImage] = useState<TGalleryDetail[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [prescription, setPrescription] = useState<PrescriptionPayload>({ type: 'none' })
  const [quantity, setQuantity] = useState<number>(1)

  const { data: product, isLoading: isLoadingPage } = useProductDetail(productId)
  const { data: attributes } = useProductAttribute(productId || '')
  const { mutate: addToCart } = useAddCart()
  const { mutate: toggleWishlist } = useToggleWishlist()
  const { data: recommendations, isLoading: isLoadingRecommendations } = useRecommendations({
    productId,
    limit: 10
  })
  const { data: reviewData } = useProductReviews(productId)

  /* ─── Sync product data ─────────────────────────────── */
  useEffect(() => {
    setSelectedVariant(null)
    setVariants([])
    setGalleryImage([])
    setPrimaryImage({ url: '', alt_text: '' })
  }, [productId])

  useEffect(() => {
    if (!product) return
    setIsWishlistLocal(product.is_wishlist === '1')
    const productVariants = product.variants || []
    setVariants(productVariants)

    const firstInStock = productVariants.find((v) => Number(v.stock) > 0)
    if (firstInStock) {
      setSelectedVariant(firstInStock)
      setPrimaryImage({ url: firstInStock.image.url, alt_text: firstInStock.image.alt_text })
    } else if (product.gallery.length > 0) {
      setPrimaryImage({ url: product.gallery[0].url, alt_text: product.gallery[0].alt_text })
    }
    setGalleryImage(product.gallery)
  }, [product])

  /* ─── Handlers ──────────────────────────────────────── */
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

  const handleWishlist = useCallback(() => {
    const isLoggedIn = hasCookie('user')
    if (!isLoggedIn) {
      setAuthModalOpen(true)
      return
    }
    setIsWishlistLocal((prev) => !prev)
    toggleWishlist(productId, {
      onSuccess: (res) => {
        const isAdded = res.data.is_wishlist === true || res.data.is_wishlist === 1 || res.data.is_wishlist === '1'
        setIsWishlistLocal(isAdded)
        toast[isAdded ? 'success' : 'info'](res.message)
      },
      onError: () => {
        setIsWishlistLocal(product?.is_wishlist === '1')
      }
    })
  }, [productId, product?.is_wishlist, toggleWishlist])

  const handleShare = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Product link copied to clipboard!')
      }).catch(() => {
        toast.error('Could not copy link')
      })
    }
  }, [])

  const { data: coupons } = useAvailableCoupons()
  const isExplicitlyNotNewUser = coupons !== undefined && !coupons.some(c => c.code === 'NEWUSER' && c.is_eligible)
  const showNewUserPrice = !isExplicitlyNotNewUser

  /* ─── Derived values ────────────────────────────────── */
  const price = selectedVariant?.price ?? product?.product_price ?? '0'
  const originalPrice = Number(price)
  const originalTotal = originalPrice * quantity
  const discountAmount = showNewUserPrice ? Math.min(originalTotal * 0.15, 100000) : 0
  const discountedTotal = originalTotal - discountAmount

  const currentStock = selectedVariant
    ? Number(selectedVariant.stock)
    : Number(product?.product_stock ?? 0)
  const avgRating = Number(reviewData?.summary?.average_rating ?? 0)
  const totalReviews = Number(reviewData?.summary?.total_reviews ?? 0)

  const variantLabel =
    selectedVariant && selectedVariant.variant_name !== product?.product_name
      ? `(${selectedVariant.variant_name})`
      : ''

  /* ─── Breadcrumb items ──────────────────────────────── */
  const breadcrumbData = getBreadcrumbData(fromPage)
  const breadcrumbItems = [
    <Link key="home" href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Text size="sm" c="dimmed">Home</Text>
    </Link>,
    breadcrumbData.href ? (
      <Link key="parent" href={breadcrumbData.href} style={{ color: 'inherit', textDecoration: 'none' }}>
        <Text size="sm" c="dimmed">{breadcrumbData.label}</Text>
      </Link>
    ) : (
      <Text key="parent" size="sm" c="dimmed">{breadcrumbData.label}</Text>
    ),
    <Text key="current" size="sm" fw={500} lineClamp={1} style={{ maxWidth: 200 }}>
      {product?.product_name ?? 'Product Detail'}
    </Text>
  ]

  return (
    <>
      <Container size={'xl'} mt={{ base: 70, md: 100 }} pb={isMobile ? 90 : 0}>
        {/* ─── Breadcrumb ─────────────────────────────── */}
        {!isLoadingPage && (
          <Breadcrumbs mb="md" separatorMargin={6} styles={{ separator: { color: 'var(--mantine-color-dimmed)' } }}>
            {breadcrumbItems}
          </Breadcrumbs>
        )}

        {isLoadingPage ? (
          <ProductDetailSkeleton />
        ) : (
          <>
            <Text fw={700} fz={'h3'} mb={'sm'}>
              Product Details
            </Text>

            <Grid gutter={{ base: 'md', md: 'lg' }}>
              {/* ─── LEFT: Images + Info ─────────────── */}
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                {product && (
                  <Card withBorder padding="lg" w={'100%'} radius="md">
                    {/* ── Image Section ─────────────── */}
                    <Card.Section>
                      <Grid>
                        {/* Thumbnail strip */}
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

                        {/* Main image */}
                        <Grid.Col span={{ md: 10 }}>
                          {primaryImage.url !== '' && (
                            <div
                              onClick={() => setImageModalOpen(true)}
                              className={styles.mainImage}
                              style={{
                                position: 'relative',
                                height: isMobile ? 280 : 420,
                                width: '100%'
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

                    {/* ── Product Info ───────────────── */}
                    <Box mt={'md'}>
                      {/* Brand + Action buttons row */}
                      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="xs">
                        <Group gap="xs" align="center">
                          <span className={styles.brandChip}>{product.product_brand}</span>
                          <StockBadge stock={currentStock} />
                        </Group>
                        <Group gap="xs">
                          <Tooltip label="Share product">
                            <ActionIcon
                              variant="light"
                              color="gray"
                              radius="xl"
                              size="md"
                              className={styles.shareBtn}
                              onClick={handleShare}
                              aria-label="Share product"
                            >
                              <IconShare size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={isWishlistLocal ? 'Remove from wishlist' : 'Add to wishlist'}>
                            <ActionIcon
                              variant="light"
                              color={isWishlistLocal ? 'red' : 'gray'}
                              radius="xl"
                              size="md"
                              className={styles.wishlistBtn}
                              onClick={handleWishlist}
                              aria-label="Toggle wishlist"
                            >
                              {isWishlistLocal
                                ? <IconHeartFilled size={16} />
                                : <IconHeart size={16} />}
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>

                      {/* Product name */}
                      <Text fw={700} fz="xl" lh={1.3} mb="xs">
                        {product.product_name} {variantLabel}
                      </Text>

                      {/* Rating row */}
                      {avgRating > 0 && (
                        <Group gap="xs" mb="xs" className={styles.ratingRow}>
                          <Rating value={avgRating} readOnly fractions={2} size="xs" />
                          <Text className={styles.ratingValue}>{avgRating.toFixed(1)}</Text>
                          {totalReviews > 0 && (
                            <Text className={styles.reviewCount}>({totalReviews} reviews)</Text>
                          )}
                        </Group>
                      )}
                      {avgRating === 0 && (
                        <Group gap={4} mb="xs">
                          <IconStar size={14} color="var(--mantine-color-gray-4)" />
                          <Text size="xs" c="dimmed">No reviews yet</Text>
                        </Group>
                      )}

                      {/* Price + Quantity + Cart */}
                      <Group justify="space-between" align="flex-end" wrap="nowrap" mt="md">
                        <Box>
                          <Text size="xs" c="dimmed" mb={2}>Price</Text>
                          {showNewUserPrice ? (
                            <Stack gap={1} mb={2}>
                              <Group gap="xs" align="baseline" wrap="nowrap">
                                <Text className={styles.priceTag}>
                                  {formatCurrency(discountedTotal)}
                                </Text>
                                <Text fz="sm" c="dimmed" td="line-through" style={{ flexShrink: 0 }}>
                                  {formatCurrency(originalTotal)}
                                </Text>
                              </Group>
                              <Text fz="xs" fw={700} c="red.8">
                                New User Promo (15% off)
                              </Text>
                            </Stack>
                          ) : (
                            <Text className={styles.priceTag}>
                              {formatCurrency(originalTotal)}
                            </Text>
                          )}
                          {quantity > 1 && (
                            <Text size="xs" c="dimmed">
                              {formatCurrency(showNewUserPrice ? originalPrice * 0.85 : originalPrice)} × {quantity}
                            </Text>
                          )}
                        </Box>

                        <Stack gap={10} align="flex-end">
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
                                width: 36,
                                height: 36,
                                border: 'none',
                                background: quantity <= 1 ? 'var(--mantine-color-gray-1)' : 'var(--mantine-color-primary-0)',
                                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: 20,
                                fontWeight: 700,
                                color: quantity <= 1 ? 'var(--mantine-color-gray-5)' : 'var(--mantine-color-primary-7)',
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
                                width: 48,
                                height: 36,
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
                                width: 36,
                                height: 36,
                                border: 'none',
                                background:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant && product && quantity >= Number(product.product_stock))
                                    ? 'var(--mantine-color-gray-1)'
                                    : 'var(--mantine-color-primary-0)',
                                cursor:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant && product && quantity >= Number(product.product_stock))
                                    ? 'not-allowed'
                                    : 'pointer',
                                fontSize: 20,
                                fontWeight: 700,
                                color:
                                  (selectedVariant && quantity >= Number(selectedVariant.stock)) ||
                                  (!selectedVariant && product && quantity >= Number(product.product_stock))
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

                          {/* Add to Cart — Desktop */}
                          {!isMobile && (
                            <Tooltip
                              label="Select variant first"
                              disabled={variants.length === 0 || !!selectedVariant}
                            >
                              <Button
                                onClick={handleAddCart}
                                disabled={variants.length > 0 && !selectedVariant || currentStock === 0}
                                loading={loading}
                                leftSection={<IconShoppingCart size={16} />}
                                radius="md"
                                size="md"
                              >
                                {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </Button>
                            </Tooltip>
                          )}
                        </Stack>
                      </Group>

                      {/* Description / Attributes */}
                      {attributes && attributes.length > 0 && (
                        <>
                          <Divider my="lg" />
                          <Stack gap={'xs'}>
                            <Text size="sm" fw={700} c="dark.5" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Product Specifications
                            </Text>
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                              {attributes.map((attr) => (
                                <Group key={attr.attribute_id} gap={6} align="flex-start">
                                  <Text size="sm" fw={500} style={{ minWidth: 110, color: 'var(--mantine-color-dimmed)' }}>
                                    {attr.attribute_name}
                                  </Text>
                                  <Text size="sm" style={{ flex: 1 }}>
                                    {attr.values.join(', ')}
                                  </Text>
                                </Group>
                              ))}
                            </SimpleGrid>
                          </Stack>
                        </>
                      )}
                    </Box>

                    <Divider my="xl" />

                    <ReviewSection productId={productId} />
                  </Card>
                )}
              </Grid.Col>

              {/* ─── RIGHT: Variants + Prescription ─── */}
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Stack gap={'md'}>
                  {variants.length > 0 && (
                    <Card withBorder radius="md">
                      <Text fw={700} fz="md" mb="sm">
                        Product Variants
                      </Text>
                      <SimpleGrid cols={{ base: 3, sm: 4, md: 3 }} spacing="sm">
                        {variants.map((item, index) => {
                          const isOutOfStock = Number(item.stock) === 0
                          const isActive = selectedVariant?.variant_id === item.variant_id

                          return (
                            <UnstyledButton
                              key={index}
                              onClick={isOutOfStock ? undefined : () => handleSelectVariant(item)}
                              style={{ display: 'block' }}
                            >
                              <Card
                                withBorder
                                p={'xs'}
                                radius="md"
                                className={clsx(
                                  styles.variantCard,
                                  isOutOfStock && styles.variantCardDisabled,
                                  isActive && styles.variantCardActive
                                )}
                              >
                                <Card.Section p="xs">
                                  <div style={{ position: 'relative', height: 54, width: '100%' }}>
                                    <Image
                                      src={item.image.url}
                                      alt={item.image.alt_text}
                                      fill
                                      style={{ objectFit: 'contain' }}
                                    />
                                  </div>
                                </Card.Section>
                                <Stack gap={2} mt={4}>
                                  <Text fz={11} lineClamp={2} fw={500}>
                                    {item.variant_name}
                                  </Text>
                                  <Text fz={11} c="primary" fw={600}>
                                    {formatCurrency(item.price)}
                                  </Text>
                                  {isOutOfStock ? (
                                    <Badge size="xs" color="red" variant="light" leftSection={<IconCircleX size={10} />}>
                                      Out of Stock
                                    </Badge>
                                  ) : (
                                    <Badge size="xs" color="green" variant="light">
                                      Stok: {item.stock}
                                    </Badge>
                                  )}
                                </Stack>
                              </Card>
                            </UnstyledButton>
                          )
                        })}
                      </SimpleGrid>
                    </Card>
                  )}

                  {product?.is_prescription_supported && (
                    <CartLensForm value={prescription} onChange={setPrescription} />
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </>
        )}

        {/* ─── Auth Modal ─────────────────────────────── */}
        <ModalAuthentication
          opened={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />

        {/* ─── Image Zoom Modal ───────────────────────── */}
        <Modal
          opened={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          size="xl"
          centered
          title="Product Image"
          styles={{
            header: { borderBottom: '1px solid var(--mantine-color-default-border)' }
          }}
        >
          <div style={{ position: 'relative', height: isMobile ? 350 : 560, width: '100%' }}>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Modal>
      </Container>

      {/* ─── Mobile Sticky CTA ──────────────────────────── */}
      {!isLoadingPage && product && isMobile && (
        <div className={styles.mobileCta}>
          <Tooltip label="Select variant first" disabled={variants.length === 0 || !!selectedVariant}>
            <Button
              onClick={handleAddCart}
              disabled={variants.length > 0 && !selectedVariant || currentStock === 0}
              loading={loading}
              leftSection={<IconShoppingCart size={16} />}
              radius="md"
              size="md"
              style={{ flex: 1 }}
            >
              {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Tooltip>
        </div>
      )}

      {/* ─── Recommendations ────────────────────────────── */}
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
