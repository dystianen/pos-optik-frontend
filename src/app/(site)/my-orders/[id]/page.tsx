'use client'

import { CancelOrderModal } from '@/components/Order/CancelOrderModal'
import { RefundModal } from '@/components/Order/RefundModal'
import { useOrder } from '@/hooks/useOrder'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import {
  IconArrowLeft,
  IconCheck,
  IconClipboard,
  IconCreditCard,
  IconMapPin,
  IconPackage,
  IconTruck
} from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'
import { toast } from 'react-toastify'

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    paid: 'green',
    processing: 'blue',
    waiting_confirmation: 'orange',
    shipped: 'cyan',
    delivered: 'teal',
    cancelled: 'red'
  }
  return statusColors[status] || 'gray'
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const clipboard = useClipboard({ timeout: 1500 })
  const [openedCancel, setOpenedCancel] = useState(false)
  const [openedRefund, setOpenedRefund] = useState(false)

  const { data: order, isLoading } = useOrder.detailOrder(id)
  const { mutate: cancelOrder } = useOrder.cancelOrder()
  const { mutate: submitRefund } = useOrder.submitRefund()
  const { data: refundAccounts } = useOrder.refundAccount()
  const { mutate: updateRefundAccount, isPending: isLoadingUpdateRefundAccount } =
    useOrder.updateRefundAccount()
  // Determine request type based on order status
  const requestType =
    order?.status_code === 'shipped' ? 'refund' : 'cancel'

  const { data: refundStatus } = useOrder.refundStatus(id, requestType)

  const handleCancelOrder = async (payload: any) => {
    console.log('Cancel request payload:', payload)
    await cancelOrder(payload, {
      onSuccess: () => {
        toast.success('Cancel order submitted')
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  const handleSubmitRefund = async (payload: any) => {
    console.log('Refund request payload:', payload)
    await submitRefund(payload, {
      onSuccess: () => {
        toast.success('Refund request submitted')
        setOpenedRefund(false)
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  const handleUpdateRefundAccount = (values: any) => {
    updateRefundAccount(values, {
      onSuccess: () => {
        toast.success('Refund account updated successfully')
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to update refund account')
      }
    })
  }

  const requestStatusInfo = (() => {
    if (!refundStatus) return null

    const isRefund = refundStatus.type === 'refund'
    const typeLabel = isRefund ? 'Return' : 'Cancellation'

    if (!refundStatus.has_request) {
      if (isRefund) {
        return {
          disabled: false,
          label: 'Request Refund',
          color: 'blue',
          tooltip: 'You can request a return/refund for this order'
        }
      }
      return {
        disabled: false,
        label: 'Cancel Order',
        color: 'red',
        tooltip: 'You can request order cancellation'
      }
    }

    switch (refundStatus.status) {
      case 'requested':
        return {
          disabled: true,
          label: `${typeLabel} Requested`,
          color: 'gray',
          tooltip: `Your ${typeLabel.toLowerCase()} request is being reviewed by our team`
        }

      case 'request_rejected':
        return {
          disabled: true,
          label: `${typeLabel} Rejected`,
          color: 'orange',
          tooltip: `Your ${typeLabel.toLowerCase()} request was rejected. Please contact support`
        }

      case 'approved':
        return {
          disabled: true,
          label: `${typeLabel} Approved`,
          color: 'teal',
          tooltip: `Your ${typeLabel.toLowerCase()} has been approved`
        }

      case 'refunded':
        return {
          disabled: true,
          label: 'Refunded',
          color: 'green',
          tooltip: 'Your order has been refunded'
        }

      case 'return_approved':
        return {
          disabled: true,
          label: 'Return Approved',
          color: 'blue',
          tooltip: 'Return request has been approved'
        }

      case 'return_shipped':
        return {
          disabled: true,
          label: 'Return Shipped',
          color: 'cyan',
          tooltip: 'Return item has been shipped'
        }

      case 'return_received':
        return {
          disabled: true,
          label: 'Return Received',
          color: 'teal',
          tooltip: 'Return item has been received'
        }

      case 'return_rejected':
        return {
          disabled: true,
          label: 'Return Rejected',
          color: 'red',
          tooltip: 'Return request has been rejected'
        }

      case 'expired':
        return {
          disabled: true,
          label: 'Request Expired',
          color: 'gray',
          tooltip: 'The request has expired'
        }

      default:
        return null
    }
  })()

  return (
    <Container size="xl" my={100} mih={900} pos={'relative'}>
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <UnstyledButton size="md" onClick={() => router.back()}>
            <Group gap={'xs'} c={'primary'}>
              <IconArrowLeft size={24} /> Back
            </Group>
          </UnstyledButton>
        </Group>

        <Box pos={'relative'} mih={400}>
          <LoadingOverlay visible={isLoading} loaderProps={{ type: 'bars' }} />
          {order && (
            <>
              <Group justify="space-between" align="start" mb={'lg'}>
                <div>
                  <Title order={2}>Order Details</Title>
                  <Text size="sm" c="dimmed" mt="xs">
                    {formatDate(order.order_date)}
                  </Text>
                </div>
                <Badge size="lg" color={getStatusColor(order.status_code)} variant="filled">
                  {order.status}
                </Badge>
              </Group>

              <Grid>
                {/* Left Column */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Stack gap="md">
                    {/* Items */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Group gap="xs">
                          <IconPackage size={20} />
                          <Text fw={600}>Ordered Products</Text>
                        </Group>
                        <Divider />
                        {order.items.map((item) => (
                          <Group key={item.order_item_id} gap="md" align="start" wrap="nowrap">
                            <Image
                              src={item.image}
                              alt={item.product_name}
                              w={80}
                              h={80}
                              radius="md"
                              fit="cover"
                            />
                            <Stack gap={4} style={{ flex: 1 }}>
                              <Text size="sm" fw={500}>
                                {item.product_name}
                              </Text>
                              {item.variant_name && (
                                <Text size="xs" c="dimmed">
                                  Variant: {item.variant_name}
                                </Text>
                              )}
                              <Group gap="xs" mt="xs">
                                <Text size="sm">{formatCurrency(item.price)}</Text>
                                <Text size="sm" c="dimmed">
                                  × {item.quantity}
                                </Text>
                              </Group>
                            </Stack>
                            <Text size="sm" fw={600}>
                              {formatCurrency(item.subtotal)}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Card>

                    {/* Shipping Address */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Group gap="xs">
                          <IconMapPin size={20} />
                          <Text fw={600}>Shipping Address</Text>
                        </Group>
                        <Divider />
                        <Stack gap="xs">
                          <Text fw={500}>{order.shipping.address.recipient_name}</Text>
                          <Text size="sm" c="dimmed">
                            {order.shipping.address.phone}
                          </Text>
                          <Text size="sm">{order.shipping.address.address}</Text>
                          <Text size="sm" c="dimmed">
                            {order.shipping.address.city}, {order.shipping.address.province}{' '}
                            {order.shipping.address.postal_code}
                          </Text>
                        </Stack>
                      </Stack>
                    </Card>

                    {/* Shipping Method */}
                    {order.shipping.method && (
                      <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                          <Group gap="xs">
                            <IconTruck size={20} />
                            <Text fw={600}>Shipping Method</Text>
                          </Group>
                          <Divider />

                          <Group justify="space-between">
                            <div>
                              <Text size="sm" fw={500}>
                                {order.shipping.method}
                              </Text>
                              {order.shipping.estimated_days && (
                                <Text size="xs" c="dimmed">
                                  Estimated: {order.shipping.estimated_days}
                                </Text>
                              )}
                            </div>
                            <Text size="sm" fw={500}>
                              {formatCurrency(order.shipping.rate)}
                            </Text>
                          </Group>

                          {order.shipping.courier && (
                            <Stack gap={0}>
                              <Text size="sm" fw={500}>
                                Courier
                              </Text>
                              <Text size="xs" c="dimmed">
                                {order.shipping.courier}
                              </Text>
                            </Stack>
                          )}

                          {order.shipping.tracking_number && (
                            <>
                              <Stack gap={0}>
                                <Text size="sm" fw={500}>
                                  Tracking Number
                                </Text>
                                <Group gap={'xs'}>
                                  <Text size="xs" c="dimmed">
                                    {order.shipping.tracking_number}
                                  </Text>
                                  <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy'}>
                                    <ActionIcon
                                      variant="subtle"
                                      color={clipboard.copied ? 'teal' : 'blue'}
                                      onClick={() => clipboard.copy(order.shipping.tracking_number)}
                                    >
                                      {clipboard.copied ? (
                                        <IconCheck size={14} />
                                      ) : (
                                        <IconClipboard size={14} />
                                      )}
                                    </ActionIcon>
                                  </Tooltip>
                                </Group>
                              </Stack>

                              <Stack gap={0}>
                                <Text size="sm" fw={500}>
                                  Tracking Link
                                </Text>
                                <Anchor href="https://cekresi.com/" target="_blank" size="xs">
                                  https://cekresi.com/
                                </Anchor>
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </Card>
                    )}
                  </Stack>
                </Grid.Col>

                {/* Right Column */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="md">
                    {/* Payment Info */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Group gap="xs">
                          <IconCreditCard size={20} />
                          <Text fw={600}>Payment Information</Text>
                        </Group>
                        <Divider />
                        {order.payment.method ? (
                          <>
                            <Group justify="space-between">
                              <Text size="sm" c="dimmed">
                                Method
                              </Text>
                              <Text size="sm" fw={500}>
                                {order.payment.method}
                              </Text>
                            </Group>
                            {order.payment.date && (
                              <Group justify="space-between">
                              <Text size="sm" c="dimmed">
                                Payment Date
                              </Text>
                              <Text size="sm" fw={500}>
                                {formatDate(order.payment.date)}
                              </Text>
                            </Group>
                            )}
                          </>
                        ) : (
                          <Text size="sm" c="dimmed" ta="center">
                            No payment yet
                          </Text>
                        )}
                      </Stack>
                    </Card>

                    {/* Order Summary */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Text fw={600}>Order Summary</Text>
                        <Divider />
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            Subtotal ({order.summary.total_items} item)
                          </Text>
                          <Text size="sm">
                            {formatCurrency(
                              order.summary.grand_total - order.summary.shipping_cost
                            )}
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            Shipping Cost
                          </Text>
                          <Text size="sm">{formatCurrency(order.summary.shipping_cost)}</Text>
                        </Group>
                        <Divider />
                        <Group justify="space-between">
                          <Text fw={600}>Total</Text>
                          <Text fw={700} size="lg" c="primary">
                            {formatCurrency(order.summary.grand_total)}
                          </Text>
                        </Group>
                      </Stack>
                    </Card>

                    {/* Cancel Button / Status Info */}
                    {order.status_code === 'processing' && requestStatusInfo && (
                      <Tooltip label={requestStatusInfo.tooltip} withArrow>
                        <Button
                          fullWidth
                          radius="xl"
                          color={requestStatusInfo.color}
                          disabled={requestStatusInfo.disabled}
                          onClick={() => !requestStatusInfo.disabled && setOpenedCancel(true)}
                        >
                          {requestStatusInfo.label}
                        </Button>
                      </Tooltip>
                    )}

                    {/* Refund Button / Status Info */}
                    {order.status_code === 'shipped' && requestStatusInfo && (
                      <Tooltip label={requestStatusInfo.tooltip} withArrow>
                        <Button
                          fullWidth
                          radius="xl"
                          color={requestStatusInfo.color}
                          disabled={requestStatusInfo.disabled}
                          onClick={() => !requestStatusInfo.disabled && setOpenedRefund(true)}
                        >
                          {requestStatusInfo.label}
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Box>
      </Stack>

      <CancelOrderModal
        opened={openedCancel}
        onClose={() => setOpenedCancel(false)}
        orderId={id}
        onSubmit={handleCancelOrder}
      />

      {order && refundAccounts && (
        <RefundModal
          opened={openedRefund}
          onClose={() => setOpenedRefund(false)}
          order={order}
          refundAccounts={refundAccounts}
          onSubmit={handleSubmitRefund}
          isLoadingUpdate={isLoadingUpdateRefundAccount}
          onUpdateRefundAccount={handleUpdateRefundAccount}
        />
      )}
    </Container>
  )
}
