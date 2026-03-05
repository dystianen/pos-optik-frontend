'use client'

import { useToggleWishlist } from '@/hooks/useProducts'
import { TProduct } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import { ActionIcon, Badge, Card, Group, Stack, Text } from '@mantine/core'
import { IconCircleX, IconHeart, IconHeartFilled, IconShoppingBag } from '@tabler/icons-react'
import productService from '@/services/productService'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'nextjs-toploader/app'
import { memo, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import ModalAuthentication from '../Modal/ModalAuthentication'

const ModalAuthenticationDynamic = dynamic(() => import('../Modal/ModalAuthentication'), {
  ssr: false
})

const CardProduct = memo(({ item }: { item: TProduct }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const { mutate: toggleWishlist } = useToggleWishlist()

  const stock = Number(item.product_stock)
  const totalSold = Number(item.total_sold ?? 0)

  // Prefetch detail on hover
  const handlePrefetch = useCallback(() => {
    if (stock === 0) return
    queryClient.prefetchQuery({
      queryKey: ['product-detail', item.product_id],
      queryFn: () => productService.getProductDetail({ id: item.product_id }),
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

  const handleAddWishlist = useCallback(() => {
    toggleWishlist(item.product_id, {
      onSuccess: (res) => {
        if (res.data.is_wishlist) {
          toast.success(res.message)
        } else {
          toast.error(res.message)
        }
      }
    })
  }, [item.product_id])

  return (
    <>
      <Card
        radius="md"
        shadow="sm"
        onClick={handleDetail}
        className={`transition-all ${stock === 0 ? 'opacity-50 cursor-not-allowed' : 'card-hover'}`}
      >
        {/* Image */}
        <Card.Section bg="primary.0" p="md" onMouseEnter={handlePrefetch}>
          <div style={{ position: 'relative', height: 130 }}>
            <Image
              src={item.product_image_url}
              alt={item.product_name}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            />
          </div>
        </Card.Section>

        <Stack gap={1} mt="sm">
          <Group justify="space-between">
            <Text fz={11} fw={600} c="dimmed" tt="uppercase">
              {item.product_brand}
            </Text>
            <Stack gap={1}></Stack>

            <ActionIcon
              variant="transparent"
              color="yellow"
              onClick={(e) => {
                e.stopPropagation()
                handleAddWishlist()
              }}
            >
              {item.is_wishlist === '1' ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
          </Group>

          <Text fw={600} fz={14} lineClamp={2}>
            {item.product_name}
          </Text>

          <Text fw={700} fz={15} c="primary">
            {formatCurrency(item.product_price)}
          </Text>

          <Group gap="xs" mt="xs" wrap="nowrap">
            {stock > 0 ? (
              <Badge size="xs" color="green" variant="light">
                Stock {stock}
              </Badge>
            ) : (
              <Badge size="xs" color="red" variant="light" leftSection={<IconCircleX size={12} />}>
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
