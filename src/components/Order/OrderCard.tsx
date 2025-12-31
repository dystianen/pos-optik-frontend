import { Order } from '@/types/order'
import { formatCurrency, formatDate } from '@/utils/format'
import { Badge, Button, Card, Divider, Group, Image, Stack, Text } from '@mantine/core'
import { IconCalendar, IconPackage, IconTruck } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'

interface OrderCardProps {
  order: Order
}

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

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="xs">
            <IconCalendar size={16} />
            <Text size="sm" c="dimmed">
              {formatDate(order.order_date)}
            </Text>
          </Group>
          <Badge color={getStatusColor(order.status)} variant="filled">
            {order.status}
          </Badge>
        </Group>

        <Divider />

        {/* Items */}
        <Stack gap="sm">
          {order.items.map((item) => (
            <Group key={item.order_item_id} gap="md" wrap="nowrap">
              <Image
                src={item.image}
                alt={item.product_name}
                w={60}
                h={60}
                radius="md"
                fit="cover"
              />
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {item.product_name}
                </Text>
                {item.variant_name && (
                  <Text size="xs" c="dimmed">
                    {item.variant_name}
                  </Text>
                )}
                <Group gap="xs">
                  <Text size="sm">{formatCurrency(item.price)}</Text>
                  <Text size="sm" c="dimmed">
                    × {item.quantity}
                  </Text>
                </Group>
              </Stack>
              <Text size="sm" fw={500}>
                {formatCurrency(item.subtotal)}
              </Text>
            </Group>
          ))}
        </Stack>

        {order.items.length > 1 && (
          <Text size="xs" c="dimmed">
            +{order.items.length - 1} more item(s)
          </Text>
        )}

        <Divider />

        {/* Summary */}
        <Group justify="space-between">
          <Stack gap={4}>
            <Group gap="xs">
              <IconPackage size={16} />
              <Text size="sm" c="dimmed">
                {order.summary.total_items} item(s)
              </Text>
            </Group>
            {order.shipping.method && (
              <Group gap="xs">
                <IconTruck size={16} />
                <Text size="sm" c="dimmed">
                  {order.shipping.method}
                  {order.shipping.estimated_days && ` (${order.shipping.estimated_days})`}
                </Text>
              </Group>
            )}
          </Stack>

          <Stack gap={4} align="flex-end">
            <Text size="xs" c="dimmed">
              Total Payment
            </Text>
            <Text size="lg" fw={700} c="primary">
              {formatCurrency(order.summary.grand_total)}
            </Text>
          </Stack>
        </Group>

        <Divider />

        {/* Actions */}
        <Group justify="space-between">
          <Group gap="xs">
            {order.payment.method && (
              <Badge variant="light" color="gray">
                {order.payment.method}
              </Badge>
            )}
          </Group>
          <Button
            variant="light"
            size="sm"
            radius="md"
            onClick={() => router.push(`/my-orders/${order.order_id}`)}
          >
            View Details
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
