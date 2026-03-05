import { Metadata } from 'next'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'View the products you have added to your shopping cart at Optikers.'
}

const CartPage = () => {
  return <CartClient />
}

export default CartPage
