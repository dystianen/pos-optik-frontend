'use client'

import { TProduct } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import { Badge, Box, Card, Image, Text } from '@mantine/core'
import { IconCircleX } from '@tabler/icons-react' // icon stock habis
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import ModalAuthentication from '../Modal/ModalAuthentication'

const CardProduct = ({ item }: { item: TProduct }) => {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const stock = Number(item.product_stock)

  const handleLogin = useCallback(() => {
    router.push('/signin')
  }, [])

  const handleDetail = useCallback(() => {
    if (stock === 0) return // disabled if stock 0
    router.push(`/product/detail?id=${item.product_id}`)
  }, [item.product_id, stock])

  return (
    <>
      <Card
        shadow="sm"
        p={{ base: 'sm', md: 'md' }}
        radius="md"
        onClick={handleDetail}
        className={`${stock === 0 ? 'opacity-50 cursor-not-allowed' : 'card-hover'}`}
      >
        <Card.Section>
          <Image
            src={item.product_image_url}
            alt={item.product_name}
            h={{ base: 120, md: 200, lg: 150 }}
            fit="contain"
          />
        </Card.Section>

        <Box mt={'md'}>
          <Text
            fw={500}
            c="primary"
            fz={{ base: 12, md: 14 }}
            style={{ textTransform: 'uppercase' }}
          >
            {item.product_brand}
          </Text>
          <Text fw={500} fz={{ base: 12, md: 14 }}>
            {item.product_name}
          </Text>

          <Text mt={'sm'} size="sm" c="dimmed" fz={{ base: 12, md: 14 }}>
            {formatCurrency(item.product_price)}
          </Text>

          {/* Stock Info */}
          <Box mt="xs">
            {stock > 0 ? (
              <Badge color="green" variant="light">
                Stock: {item.product_stock}
              </Badge>
            ) : (
              <Badge color="red" variant="light" leftSection={<IconCircleX size={14} />}>
                Out of Stock
              </Badge>
            )}
          </Box>
        </Box>
      </Card>

      <ModalAuthentication
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  )
}

export default CardProduct
