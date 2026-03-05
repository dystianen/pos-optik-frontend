import { Metadata } from 'next'
import MyOrdersClient from './MyOrdersClient'

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'Monitor the status of your glasses and lenses orders at Optikers.'
}

const MyOrdersPage = () => {
  return <MyOrdersClient />
}

export default MyOrdersPage
