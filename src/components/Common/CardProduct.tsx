'use client'

import { useCart } from '@/hooks/useCart'
import { TProduct } from '@/types/product'
import { embedImage, formatCurrency } from '@/utils/util'
import { Box, Button, Card, Group, Image, Text } from '@mantine/core'
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
    setLoading(true)
    const isLoggedIn = hasCookie('user')
    if (isLoggedIn) {
      const payload = {
        product_id: item.product_id,
        quantity: 1,
        price: item.product_price,
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

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md">
        <Card.Section>
          <Image src={embedImage(item.product_image_url)} alt="Norway" h={200} fit="inherit" />
        </Card.Section>

        <Box mt={'md'}>
          <Text fw={500} c="primary">
            {item.product_brand}
          </Text>
          <Text fw={500}>{item.product_name}</Text>

          <Group justify="space-between" mt={'md'}>
            <Text size="sm" c="dimmed">
              {item.model}
            </Text>
            <Text size="sm" c="dimmed">
              {formatCurrency(item.product_price)}
            </Text>
          </Group>

          <Button fullWidth mt="md" radius="xl" onClick={handleAddCart} loading={loading}>
            Add to Cart
          </Button>
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
