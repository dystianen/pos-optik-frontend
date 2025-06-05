'use client'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconShoppingCart } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'

export default function Cart() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const handleRedirectToCart = useCallback(() => {
    router.push('/cart')
  }, [])

  return (
    <Indicator label="1" offset={5} size={18}>
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
  )
}
