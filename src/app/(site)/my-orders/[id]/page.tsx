'use client'

import { useOrder } from '@/hooks/useOrder'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
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

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    Paid: 'green',
    Processing: 'blue',
    'Waiting Confirmation': 'orange',
    Shipped: 'cyan',
    Delivered: 'teal',
    Cancelled: 'red'
  }
  return statusColors[status] || 'gray'
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const clipboard = useClipboard({ timeout: 1500 })

  const { data: order, isLoading } = useOrder.detailOrder(id)

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
                <Badge size="lg" color={getStatusColor(order.status)} variant="filled">
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
                  </Stack>
                </Grid.Col>
              </Grid>
            </>
          )}
        </Box>
      </Stack>
    </Container>
  )
}
