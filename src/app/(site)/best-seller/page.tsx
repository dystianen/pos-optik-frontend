import { Metadata } from 'next'
import BestSellerClient from './BestSellerClient'

export const metadata: Metadata = {
  title: 'Best Seller',
  description: 'Check out the most popular and best-selling eyewear collection at Optikers.'
}

export default function Page() {
  return <BestSellerClient />
}
