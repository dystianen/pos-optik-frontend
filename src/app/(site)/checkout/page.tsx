import { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order at Optikers.'
}

const CheckoutPage = () => {
  return <CheckoutClient />
}

export default CheckoutPage
