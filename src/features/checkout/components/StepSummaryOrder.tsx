import { useSubmitOrder, useAvailableCoupons } from '@/features/order/hooks'
import { TSummaryOrders } from '@/features/order/types'
import { formatCurrency } from '@/utils/format'
import { Box, Button, Card, Divider, Group, LoadingOverlay, Stack, Text, TextInput, Badge, SimpleGrid } from '@mantine/core'
import { readLocalStorageValue, useLocalStorage } from '@mantine/hooks'
import { useState } from 'react'
import { toast } from 'react-toastify'
import CardCart from '@/components/ui/CardCart'

const StepSummaryOrder = ({
  summaryOrder,
  setSummaryOrder,
  appliedCouponCode,
  setAppliedCouponCode,
  summaryMutation,
  isLoadingSummary,
  prevStep,
  nextStep
}: {
  summaryOrder: TSummaryOrders | null
  setSummaryOrder: React.Dispatch<React.SetStateAction<TSummaryOrders | null>>
  appliedCouponCode: string
  setAppliedCouponCode: React.Dispatch<React.SetStateAction<string>>
  summaryMutation: any
  isLoadingSummary: boolean
  prevStep: () => void
  nextStep: () => void
}) => {
  const csaId = readLocalStorageValue<string>({ key: 'csaId' })
  const [, setCheckoutOrder] = useLocalStorage({ key: 'checkout_order' })
  const { mutate: submitOrder, isPending: isLoadingSubmit } = useSubmitOrder()
  
  const { data: availableCoupons } = useAvailableCoupons()
  const [manualCode, setManualCode] = useState('')

  const handleApplyCoupon = (code: string) => {
    if (!code.trim()) return
    const formattedCode = code.trim().toUpperCase()
    summaryMutation({ addressId: csaId, couponCode: formattedCode }, {
      onSuccess: (res: TSummaryOrders) => {
        setSummaryOrder(res)
        if (res.coupon_details?.is_valid) {
          setAppliedCouponCode(res.coupon_details.code)
          toast.success(`Coupon "${res.coupon_details.code}" successfully applied!`)
        } else {
          toast.error(res.coupon_details?.error_message || 'Invalid coupon.')
        }
      },
      onError: (err: any) => {
        toast.error(err.message)
      }
    })
  }

  const handleRemoveCoupon = () => {
    summaryMutation({ addressId: csaId, couponCode: '' }, {
      onSuccess: (res: TSummaryOrders) => {
        setSummaryOrder(res)
        setAppliedCouponCode('')
        setManualCode('')
        toast.info('Coupon removed')
      },
      onError: (err: any) => {
        toast.error(err.message)
      }
    })
  }

  const handleSubmitOrders = () => {
    submitOrder({ addressId: csaId, couponCode: appliedCouponCode }, {
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
    <Card withBorder mih={400} p="xl">
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

          {/* 🎟️ Coupons & Discounts */}
          <Box>
            <Text fw={600} mb="xs">
              Coupons & Discounts
            </Text>

            {appliedCouponCode && summaryOrder.coupon_details?.is_valid ? (
              <Card withBorder p="sm" bg="green.0" style={{ borderColor: 'var(--mantine-color-green-4)' }}>
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Group gap="xs">
                      <Badge color="green" variant="filled">
                        {summaryOrder.coupon_details.code}
                      </Badge>
                      <Text size="sm" fw={600} c="green.8">
                        Coupon Applied Successfully!
                      </Text>
                    </Group>
                    <Text size="xs" c="green.7">
                      A discount of {formatCurrency(summaryOrder.coupon_details.discount_amount)} has been applied.
                    </Text>
                  </Stack>
                  <Button variant="subtle" color="red" size="xs" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                </Group>
              </Card>
            ) : (
              <Stack gap="xs">
                <Group align="flex-end">
                  <TextInput
                    placeholder="Enter coupon code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.currentTarget.value)}
                    style={{ flex: 1 }}
                    styles={{ input: { textTransform: 'uppercase' } }}
                  />
                  <Button onClick={() => handleApplyCoupon(manualCode)} disabled={!manualCode.trim()}>
                    Apply
                  </Button>
                </Group>
                
                {summaryOrder.coupon_details && !summaryOrder.coupon_details.is_valid && (
                  <Text size="xs" c="red.6" fw={500}>
                    {summaryOrder.coupon_details.error_message || 'Invalid coupon.'}
                  </Text>
                )}
              </Stack>
            )}

            {/* Available Coupons List */}
            {availableCoupons && availableCoupons.length > 0 && (
              <Box mt="md">
                <Text size="xs" fw={600} c="dimmed" mb="xs">
                  AVAILABLE COUPONS:
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
                  {availableCoupons.map((coupon) => {
                    const isCurrentApplied = appliedCouponCode === coupon.code;
                    return (
                      <Card 
                        key={coupon.coupon_id} 
                        withBorder 
                        p="xs" 
                        radius="md"
                        style={{
                          borderColor: isCurrentApplied ? 'var(--mantine-color-green-6)' : undefined,
                          backgroundColor: !coupon.is_eligible ? 'var(--mantine-color-gray-0)' : undefined,
                          opacity: !coupon.is_eligible ? 0.75 : 1
                        }}
                      >
                        <Stack gap={4} justify="space-between" h="100%">
                          <div>
                            <Group justify="space-between" align="center" wrap="nowrap" mb={4}>
                              <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>
                                {coupon.code}
                              </Text>
                              <Group gap={4}>
                                {coupon.first_order_only && (
                                  <Badge size="xs" color="blue" variant="light">
                                    New User
                                  </Badge>
                                )}
                              </Group>
                            </Group>
                            <Text size="xs" lineClamp={2} c="gray.7">
                              {coupon.description}
                            </Text>
                            {coupon.min_order_amount && (
                              <Text size="11px" c="dimmed" mt={2}>
                                Min. spend: {formatCurrency(coupon.min_order_amount)}
                              </Text>
                            )}
                          </div>
                          
                          <Box mt="xs">
                            {coupon.is_eligible ? (
                              isCurrentApplied ? (
                                <Button size="xs" variant="light" color="green" fullWidth disabled>
                                  Applied
                                </Button>
                              ) : (
                                <Button size="xs" variant="light" fullWidth onClick={() => handleApplyCoupon(coupon.code)}>
                                  Apply
                                </Button>
                              )
                            ) : (
                              <Stack gap={2}>
                                <Button size="xs" variant="light" color="gray" fullWidth disabled>
                                  Ineligible
                                </Button>
                                <Text size="10px" c="red.6" ta="center">
                                  {coupon.ineligible_reason}
                                </Text>
                              </Stack>
                            )}
                          </Box>
                        </Stack>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </Box>
            )}
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

            {summaryOrder.summary.coupon_discount !== undefined && summaryOrder.summary.coupon_discount > 0 && (
              <Group justify="space-between" c="green.6" fw={500}>
                <Text size="sm">
                  Coupon Discount ({summaryOrder.coupon_details?.code})
                </Text>
                <Text size="sm">-{formatCurrency(summaryOrder.summary.coupon_discount)}</Text>
              </Group>
            )}

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
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={handleSubmitOrders} loading={isLoadingSubmit}>
              Submit Order
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  )
}

export default StepSummaryOrder
