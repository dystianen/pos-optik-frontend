'use client'

import { useCart } from '@/hooks/useCart'
import { TProduct } from '@/types/product'
import { formatCurrency } from '@/utils/format'
import { Box, Card, Image, Text } from '@mantine/core'
import { hasCookie } from 'cookies-next/client'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import ModalAuthentication from '../Modal/ModalAuthentication'

const CardProduct = ({ item }: { item: TProduct }) => {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { mutate: addToCart } = useCart.addToCart()

  const handleAddCart = useCallback(async () => {
    const isLoggedIn = hasCookie('user')
    if (isLoggedIn) {
      setLoading(true)
      const payload = {
        product_id: item.product_id,
        quantity: 1,
        price: item.product_price,
        proof_of_payment: null
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
            fit="inherit"
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

          {/* <Button
            fullWidth
            mt="md"
            radius="xl"
            onClick={(e) => {
              e.stopPropagation()
              handleAddCart()
            }}
            loading={loading}
          >
            Add to Cart
          </Button> */}
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
