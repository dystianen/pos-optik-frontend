'use client'

import * as productApi from '@/features/product/api'
import { useToggleWishlist } from '@/features/product/hooks'
import { TProduct } from '@/features/product/types'
import { useAvailableCoupons } from '@/features/order/hooks'
import { formatCurrency } from '@/utils/format'
import { ActionIcon, Card, Group, Stack, Text } from '@mantine/core'
import { IconHeart, IconHeartFilled, IconStar } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import { usePathname, useSearchParams } from 'next/navigation'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ModalAuthenticationDynamic = dynamic(() => import('../Modal/ModalAuthentication'), {
  ssr: false
})

const CardProduct = memo(({ item }: { item: TProduct }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isWishlistLocal, setIsWishlistLocal] = useState(item.is_wishlist === '1')

  const { mutate: toggleWishlist } = useToggleWishlist()

  const { data: coupons } = useAvailableCoupons()
  const isExplicitlyNotNewUser = coupons !== undefined && !coupons.some(c => c.code === 'NEWUSER' && c.is_eligible)
  const showNewUserPrice = !isExplicitlyNotNewUser

  const originalPrice = Number(item.product_price)
  const newUserPrice = originalPrice * 0.85

  const stock = Number(item.product_stock)
  const totalSold = Number(item.total_sold ?? 0)
  const avgRating = Number(item.avg_rating ?? 0)
  const totalReviews = Number(item.total_reviews ?? 0)

  // Prefetch detail on hover
  const handlePrefetch = useCallback(() => {
    if (stock === 0) return
    queryClient.prefetchQuery({
      queryKey: ['product-detail', item.product_id],
      queryFn: () => productApi.getProductDetail({ id: item.product_id }),
      staleTime: 5 * 60 * 1000
    })
  }, [item.product_id, queryClient, stock])

  const handleLogin = useCallback(() => {
    if (typeof window !== 'undefined') {
      const redirectTo = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/signin?redirectTo=${redirectTo}`)
    } else {
      router.push('/signin')
    }
  }, [router])

  const handleDetail = useCallback(() => {
    if (stock === 0) return
    const fromUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    const fromParam = fromUrl ? `&from=${encodeURIComponent(fromUrl)}` : ''
    router.push(`/product/detail?id=${item.product_id}${fromParam}`)
  }, [item.product_id, stock, pathname, searchParams, router])

  useEffect(() => {
    setIsWishlistLocal(item.is_wishlist === '1')
  }, [item.is_wishlist])

  const handleAddWishlist = useCallback(() => {
    // 1. Optimistic Update Local Component (Instant < 1ms)
    setIsWishlistLocal((prev) => !prev)

    // 2. Call API & Global Optimistic Update via React Query
    toggleWishlist(item.product_id, {
      onSuccess: (res) => {
        const isAdded =
          res.data.is_wishlist === true ||
          res.data.is_wishlist === 1 ||
          res.data.is_wishlist === '1'
        setIsWishlistLocal(isAdded)
        if (isAdded) {
          toast.success(res.message)
        } else {
          toast.info(res.message)
        }
      },
      onError: (err) => {
        // Rollback on error
        setIsWishlistLocal(item.is_wishlist === '1')
      }
    })
  }, [item.product_id, item.is_wishlist])

  return (
    <>
      <Card
        padding="md"
        radius="lg"
        onClick={handleDetail}
        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer bg-white border border-gray-100/80 hover:border-transparent hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5
        ${stock === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* IMAGE CONTAINER */}
        <Card.Section onMouseEnter={handlePrefetch}>
          <div className="relative aspect-[4/3] w-full bg-gray-50/70 rounded-xl flex items-center justify-center overflow-hidden mb-3">
            <Image
              src={item.product_image_url}
              alt={item.product_name}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

            {/* Wishlist Button */}
            <ActionIcon
              variant="white"
              radius="xl"
              size="md"
              aria-label="Wishlist"
              className="absolute top-3 right-3 shadow-sm border border-gray-100 opacity-100 transition hover:scale-105 active:scale-95 z-10"
              onClick={(e) => {
                e.stopPropagation()
                handleAddWishlist()
              }}
            >
              {isWishlistLocal ? (
                <IconHeartFilled size={16} className="text-red-500 animate-fade-in" />
              ) : (
                <IconHeart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
              )}
            </ActionIcon>
          </div>
        </Card.Section>

        {/* CONTENT */}
        <Stack gap={3}>
          {/* Brand & Rating Row */}
          <Group justify="space-between" align="center" gap={4} wrap="nowrap">
            <Text fz={10} fw={700} c="dimmed" className="tracking-wider uppercase truncate">
              {item.product_brand}
            </Text>
            {/* Rating */}
            <Group gap={2} wrap="nowrap" style={{ flexShrink: 0 }}>
              <IconStar size={12} className="text-amber-400 fill-amber-400" />
              <Text fz={11} fw={700} c="dark.6">
                {avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
              </Text>
              {totalReviews > 0 && (
                <Text fz={10} c="dimmed">
                  ({totalReviews})
                </Text>
              )}
            </Group>
          </Group>

          {/* Product Name */}
          <Text fw={600} fz={14} c="dark.7" className="group-hover:text-primary transition-colors line-clamp-1">
            {item.product_name}
          </Text>

          {/* Price */}
          {showNewUserPrice ? (
            <Stack gap={1} className="mt-0.5">
              <Group gap="xs" align="center" wrap="nowrap">
                <Text fw={700} fz={15} c="primary">
                  {formatCurrency(newUserPrice)}
                </Text>
                <Text fz={11} c="dimmed" td="line-through" style={{ flexShrink: 0 }}>
                  {formatCurrency(originalPrice)}
                </Text>
              </Group>
              <Text fz={9} fw={700} c="red.8">
                New User Promo (15% off)
              </Text>
            </Stack>
          ) : (
            <Text fw={700} fz={15} c="primary" className="mt-0.5">
              {formatCurrency(originalPrice)}
            </Text>
          )}

          {/* Footer Metadata */}
          <Group justify="space-between" align="center" mt="xs" pt="xs" className="border-t border-gray-100/60">
            {stock > 0 ? (
              <Text fz={11} c="gray.6" className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Stock {stock}
              </Text>
            ) : (
              <Text fz={11} c="red.6" fw={600} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                Out of Stock
              </Text>
            )}

            {totalSold > 0 && (
              <Text fz={11} c="gray.5" fw={500}>
                Terjual {totalSold}
              </Text>
            )}
          </Group>
        </Stack>
      </Card>

      <ModalAuthenticationDynamic
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  )
})

CardProduct.displayName = 'CardProduct'

export default CardProduct
