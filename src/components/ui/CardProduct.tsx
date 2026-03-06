'use client'

import * as productApi from '@/features/product/api'
import { useToggleWishlist } from '@/features/product/hooks'
import { TProduct } from '@/features/product/types'
import { formatCurrency } from '@/utils/format'
import { ActionIcon, Badge, Card, Divider, Group, Stack, Text } from '@mantine/core'
import { IconHeart, IconHeartFilled, IconShoppingBag } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ModalAuthenticationDynamic = dynamic(() => import('../Modal/ModalAuthentication'), {
  ssr: false
})

const CardProduct = memo(({ item }: { item: TProduct }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isWishlistLocal, setIsWishlistLocal] = useState(item.is_wishlist === '1')

  const { mutate: toggleWishlist } = useToggleWishlist()

  const stock = Number(item.product_stock)
  const totalSold = Number(item.total_sold ?? 0)

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
    router.push('/signin')
  }, [])

  const handleDetail = useCallback(() => {
    if (stock === 0) return
    router.push(`/product/detail?id=${item.product_id}`)
  }, [item.product_id, stock])

  useEffect(() => {
    setIsWishlistLocal(item.is_wishlist === '1')
  }, [item.is_wishlist])

  const handleAddWishlist = useCallback(() => {
    // 1. Optimistic Update Local Component (Instant < 1ms)
    setIsWishlistLocal((prev) => !prev)

    // 2. Call API & Global Optimistic Update via React Query
    toggleWishlist(item.product_id, {
      onSuccess: (res) => {
        // Handle true/false atau 1/0
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
        // Rollback klu error
        setIsWishlistLocal(item.is_wishlist === '1')
      }
    })
  }, [item.product_id, item.is_wishlist])

  return (
    <>
      <Card
        withBorder
        className={`group relative overflow-hidden transition-all duration-300 
  ${stock === 0 ? 'opacity-50 cursor-not-allowed' : 'card-hover'}`}
      >
        {/* IMAGE */}
        <Card.Section onMouseEnter={handlePrefetch}>
          <div className="relative h-[150px] flex items-center justify-center overflow-hidden">
            <Image
              src={item.product_image_url}
              alt={item.product_name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            />

            {/* gradient hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* Wishlist floating */}
            <ActionIcon
              variant="white"
              radius="xl"
              size="sm"
              className="absolute top-2 right-2 shadow-md opacity-0 group-hover:opacity-100 transition"
              onClick={(e) => {
                e.stopPropagation()
                handleAddWishlist()
              }}
            >
              {isWishlistLocal ? (
                <IconHeartFilled size={16} color="red" />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>

            {/* Quick view button */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDetail()
                }}
                className="bg-white text-xs px-3 py-1 rounded-full shadow hover:bg-primary hover:text-white transition"
              >
                View Product
              </button>
            </div>
          </div>
        </Card.Section>

        <Divider />

        {/* CONTENT */}
        <Stack gap={2} mt="sm">
          <Text fz={11} fw={600} c="dimmed" tt="uppercase">
            {item.product_brand}
          </Text>

          <Text fw={600} fz={14} lineClamp={2}>
            {item.product_name}
          </Text>

          <Text fw={700} fz={15} c="primary">
            {formatCurrency(item.product_price)}
          </Text>

          <Group gap="xs" mt="xs">
            {stock > 0 ? (
              <Badge size="xs" color="green" variant="light">
                Stock {stock}
              </Badge>
            ) : (
              <Badge size="xs" color="red" variant="light">
                Out of Stock
              </Badge>
            )}

            <Badge
              size="xs"
              color="blue"
              variant="light"
              leftSection={<IconShoppingBag size={12} />}
            >
              Terjual {totalSold}
            </Badge>
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

export default CardProduct
