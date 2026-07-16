import { useTotalWishlist } from '@/features/product/hooks'
import { ActionIcon, Indicator } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useMemo } from 'react'

const Wishlist = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const router = useRouter()
  const { data: wishlist } = useTotalWishlist({ enabled: isLoggedIn })
  const isWishlist = useMemo(() => Number(wishlist) > 0, [wishlist])

  const handleRedirectToWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!isLoggedIn) {
        router.push(`/signin?redirectTo=${encodeURIComponent('/wishlist')}`)
      } else {
        router.push('/wishlist')
      }
    },
    [isLoggedIn, router]
  )

  return (
    <Link href={'/wishlist'} onClick={handleRedirectToWishlist}>
      <Indicator disabled={!isWishlist} color="red" label={wishlist} offset={8} size={18}>
        <ActionIcon
          variant="transparent"
          color="primary"
          size="xl"
          radius={999}
          aria-label="Wishlist"
        >
          <IconHeart size={24} />
        </ActionIcon>
      </Indicator>
    </Link>
  )
}

export default Wishlist
