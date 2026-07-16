'use client'
import { useTotalCart } from '@/features/cart/hooks'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useMemo } from 'react'

export default function Cart({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const router = useRouter()
  const { data: cart } = useTotalCart({ enabled: isLoggedIn })
  const isCart = useMemo(() => Number(cart?.total_items) > 0, [cart])

  const handleRedirectToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!isLoggedIn) {
        router.push(`/signin?redirectTo=${encodeURIComponent('/cart')}`)
      } else {
        router.push('/cart')
      }
    },
    [isLoggedIn, router]
  )

  return (
    <Link href={'/cart'} onClick={handleRedirectToCart}>
      <Indicator disabled={!isCart} color="red" label={cart?.total_items} offset={8} size={18}>
        <ActionIcon
          variant="transparent"
          color="primary"
          size="xl"
          radius={999}
          aria-label="Cart"
        >
          <IconShoppingCart size={24} />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}
