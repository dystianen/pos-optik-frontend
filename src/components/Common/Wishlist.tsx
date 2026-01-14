import { useProducts } from '@/hooks/useProducts'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useMemo } from 'react'

const Wishlist = () => {
  const router = useRouter()
  const { data: wishlist } = useProducts.getTotalWishlist()
  const isWishlist = useMemo(() => Number(wishlist?.total) > 0, [wishlist])

  const handleRedirectToCart = useCallback(() => {
    router.push('/wishlist')
  }, [])

  return (
    <Link href={'/wishlist'}>
      <Indicator disabled={!isWishlist} color="red" label={wishlist?.total} offset={8} size={18}>
        <ActionIcon
          onClick={handleRedirectToCart}
          variant="transparent"
          color="primary"
          size="xl"
          radius={999}
          aria-label="Settings"
        >
          <IconHeart size={24} />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}

export default Wishlist
