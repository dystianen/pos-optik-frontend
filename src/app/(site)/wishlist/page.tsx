import { Metadata } from 'next'
import WishlistClient from './WishlistClient'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your wishlist at Optikers.'
}

const Wishlist = () => {
  return <WishlistClient />
}

export default Wishlist