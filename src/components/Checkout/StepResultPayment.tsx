'use client'
import { useOrder } from '@/hooks/useOrder'
import { readLocalStorageValue } from '@mantine/hooks'
import StepRejectedPayment from './StepRejectedPayment'
import StepSuccessPayment from './StepSuccessPayment'

const StepResultPayment = () => {
  const checkoutOrderRaw = readLocalStorageValue<string>({ key: 'checkout_order' })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null

  const orderId = checkoutOrder?.order_id

  const { data, isLoading, isError } = useOrder.checkStatus(orderId || '')

  // ⏳ Loading state
  if (isLoading) {
    return <p>Checking payment status...</p>
  }

  // ❌ Error / invalid order
  if (isError || !data || !orderId) {
    return <StepRejectedPayment />
  }

  // ✅ Approved
  if (data.payment_status === 'approved') {
    return <StepSuccessPayment />
  }

  // ❌ Rejected
  if (data.payment_status === 'rejected') {
    return <StepRejectedPayment />
  }

  // ⏳ Pending (default)
  return (
    <p style={{ textAlign: 'center' }}>
      Your payment is currently being reviewed. Please wait a moment.
    </p>
  )
}

export default StepResultPayment
