'use client'
import { useTotalCart } from '@/hooks/useCart'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useMemo } from 'react'

export default function Cart() {
  const router = useRouter()
  const { data: cart } = useTotalCart()
  const isCart = useMemo(() => Number(cart?.total_items) > 0, [cart])

  const handleRedirectToCart = useCallback(() => {
    router.push('/cart')
  }, [])

  return (
    <Link href={'/cart'}>
      <Indicator disabled={!isCart} color="red" label={cart?.total_items} offset={8} size={18}>
        <ActionIcon
          onClick={handleRedirectToCart}
          variant="transparent"
          color="primary"
          size="xl"
          radius={999}
          aria-label="Settings"
        >
          <IconShoppingCart size={24} />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}
