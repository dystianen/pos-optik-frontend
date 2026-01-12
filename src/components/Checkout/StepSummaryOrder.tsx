import { useOrder } from '@/hooks/useOrder'
import { TSummaryOrders } from '@/types/order'
import { formatCurrency } from '@/utils/format'
import { Box, Button, Card, Divider, Group, LoadingOverlay, Stack, Text } from '@mantine/core'
import { readLocalStorageValue, useLocalStorage } from '@mantine/hooks'
import { toast } from 'react-toastify'
import CardCart from '../Common/CardCart'

const StepSummaryOrder = ({
  summaryOrder,
  isLoadingSummary,
  prevStep,
  nextStep
}: {
  summaryOrder: TSummaryOrders | null
  isLoadingSummary: boolean
  prevStep: () => void
  nextStep: () => void
}) => {
  const csaId = readLocalStorageValue<string>({ key: 'csaId' })
  const [, setCheckoutOrder] = useLocalStorage({ key: 'checkout_order' })
  const { mutate: submitOrder, isPending: isLoadingSubmit } = useOrder.submit()

  const handleSubmitOrders = () => {
    submitOrder(csaId, {
      onSuccess: (res) => {
        const payload = {
          order_id: res.order_id,
          grand_total: res.grand_total,
          created_at: Date.now()
        }

        setCheckoutOrder(JSON.stringify(payload))
        nextStep()
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  return (
    <Card shadow="md" radius="lg" mih={400} p="xl">
      <LoadingOverlay
        visible={isLoadingSummary}
        zIndex={1000}
        overlayProps={{ radius: 'lg', blur: 5 }}
        loaderProps={{ type: 'bars' }}
      />
      {summaryOrder && (
        <Stack gap="md">
          {/* 📦 Shipping Address */}
          <Box>
            <Text fw={600} mb={6}>
              Shipping Address
            </Text>

            <Text size="sm" fw={500}>
              {summaryOrder.shipping_address.recipient_name}
            </Text>

            <Text size="sm" c="dimmed">
              {summaryOrder.shipping_address.phone}
            </Text>

            <Text size="sm" c="gray.7">
              {summaryOrder.shipping_address.address}
            </Text>

            <Text size="sm" c="gray.6">
              {summaryOrder.shipping_address.city}, {summaryOrder.shipping_address.province}{' '}
              {summaryOrder.shipping_address.postal_code}
            </Text>
          </Box>

          <Divider />

          {/* 🛒 Items */}
          <Box>
            <Group justify="space-between" mb="sm">
              <Text fw={600}>Order Items</Text>
              <Text size="xs" c="dimmed">
                {summaryOrder.items.length} items
              </Text>
            </Group>

            <Stack>
              {summaryOrder.items.map((item) => (
                <CardCart key={item.cart_item_id} item={item} hideAction />
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* 🚚 Shipping */}
          <Box>
            <Text fw={600} mb={4}>
              Shipping
            </Text>

            <Group gap={6}>
              <Text size="sm" c="dimmed">
                Service:
              </Text>
              <Text size="sm" fw={500}>
                {summaryOrder.shipping.service}
              </Text>
            </Group>

            <Group gap={6}>
              <Text size="sm" c="dimmed">
                Destination:
              </Text>
              <Text size="sm" fw={500}>
                {summaryOrder.shipping.destination}
              </Text>
            </Group>
          </Box>

          <Divider />

          {/* 💰 Total */}
          <Box>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Subtotal
              </Text>
              <Text size="sm">{formatCurrency(summaryOrder.summary.subtotal)}</Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Shipping
              </Text>
              <Text size="sm">{formatCurrency(summaryOrder.summary.shipping_cost)}</Text>
            </Group>

            <Divider my="xs" />

            <Group justify="space-between">
              <Text fw={600} size="lg">
                Total
              </Text>
              <Text fw={700} size="lg">
                {formatCurrency(summaryOrder.summary.total)}
              </Text>
            </Group>
          </Box>

          <Group grow justify="center" mt="xl">
            <Button variant="default" radius="xl" onClick={prevStep}>
              Back
            </Button>
            <Button radius="xl" onClick={handleSubmitOrders} loading={isLoadingSubmit}>
              Submit Order
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  )
}

export default StepSummaryOrder
