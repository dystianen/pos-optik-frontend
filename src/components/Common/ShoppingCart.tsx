'use client'
import { useCart } from '@/hooks/useCart'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useMemo } from 'react'

export default function Cart() {
  const router = useRouter()
  const { data: cart } = useCart.totalCart()
  console.log('🚀 ~ Cart ~ cart:', cart)
  const isCart = useMemo(() => Number(cart?.total_items) > 0, [cart])

  const handleRedirectToCart = useCallback(() => {
    router.push('/cart')
  }, [])

  return (
    <Link href={'/cart'}>
      <Indicator disabled={!isCart} label={cart?.total_items} offset={5} size={18}>
        <ActionIcon
          onClick={handleRedirectToCart}
          variant="transparent"
          color="primary"
          size="xl"
          radius={999}
          aria-label="Settings"
        >
          <IconShoppingCart size={32} stroke={1.5} />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}
