'use client'

import { TProduct } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import { Box, Card, Image, Text } from '@mantine/core'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import ModalAuthentication from '../Modal/ModalAuthentication'

const CardProduct = ({ item }: { item: TProduct }) => {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleLogin = useCallback(() => {
    router.push('/signin')
  }, [])

  const handleDetail = useCallback(() => {
    router.push(`/product/detail?id=${item.product_id}`)
  }, [item.product_id])

  return (
    <>
      <Card
        shadow="sm"
        p={{ base: 'sm', md: 'md' }}
        radius="md"
        onClick={handleDetail}
        className="card-hover"
      >
        <Card.Section>
          <Image
            src={item.product_image_url}
            alt="Norway"
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
