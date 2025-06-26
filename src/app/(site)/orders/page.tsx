'use client'

import CardCart from '@/components/Common/CardCart'
import { useOrder } from '@/hooks/useOrder'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  Badge,
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

const Orders = () => {
  const { data: orders, isLoading } = useOrder.orders()
  const [openedIndex, setOpenedIndex] = useState<number | null>(null)

  const toggleCollapse = useCallback((index: number) => {
    setOpenedIndex((prev) => (prev === index ? null : index))
  }, [])

  const renderSkeleton = (count = 3) => {
    return Array.from({ length: count }).map((_, i) => (
      <Card key={i} withBorder>
        <Grid align="center">
          <Grid.Col span={3}>
            <Skeleton height={16} width="80%" />
          </Grid.Col>
          <Grid.Col span={3}>
            <Skeleton height={16} width="60%" />
          </Grid.Col>
          <Grid.Col span={3}>
            <Skeleton height={16} width="40%" />
          </Grid.Col>
          <Grid.Col span={3}>
            <Skeleton height={32} width="100px" radius="xl" />
          </Grid.Col>
        </Grid>
        <Skeleton height={16} mt="sm" />
        <Skeleton height={16} mt="xs" />
      </Card>
    ))
  }

  const renderColor = (value: string) => {
    let color = ''
    switch (value) {
      case 'pending':
        color = 'yellow'
        break
      case 'paid':
        color = 'green'
        break
      case 'shipped':
        color = 'lime'
        break
      case 'cancelled':
        color = 'red'
        break
      default:
        color = 'gray'
    }

    return color
  }

  return (
    <Container size="xl" my={120}>
      <Title order={2} mb={32}>
        My Orders
      </Title>
      <Stack>
        <Card bg="primary.0">
          <Grid>
            <Grid.Col span={3}>
              <Title order={5}>Order Date</Title>
            </Grid.Col>
            <Grid.Col span={3}>
              <Title order={5}>Grand Total</Title>
            </Grid.Col>
            <Grid.Col span={3}>
              <Title order={5}>Status</Title>
            </Grid.Col>
            <Grid.Col span={3}>
              <Title order={5}>Action</Title>
            </Grid.Col>
          </Grid>
        </Card>

        {isLoading ? (
          renderSkeleton(3)
        ) : Number(orders?.length) > 0 ? (
          orders.map((order: any, index: number) => (
            <Card key={index} withBorder>
              <Grid align="center">
                <Grid.Col span={3}>{formatDate(order.order_date)}</Grid.Col>
                <Grid.Col span={3}>{formatCurrency(order.grand_total)}</Grid.Col>
                <Grid.Col span={3}>
                  <Badge color={renderColor(order.status)}>{order.status}</Badge>
                  {}
                </Grid.Col>
                <Grid.Col span={3}>
                  <Button
                    variant="subtle"
                    onClick={() => toggleCollapse(index)}
                    rightSection={
                      openedIndex === index ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )
                    }
                  >
                    {openedIndex === index ? 'Hide Items' : 'Show Items'}
                  </Button>
                </Grid.Col>
              </Grid>

              <Collapse in={openedIndex === index}>
                <Stack mt="sm">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, index: number) => (
                      <CardCart key={index} item={item} hideAction />
                    ))
                  ) : (
                    <Text c="dimmed" size="sm">
                      No items found in this order.
                    </Text>
                  )}
                </Stack>
              </Collapse>
            </Card>
          ))
        ) : (
          <Card withBorder radius="md">
            <Stack>
              <Text>No Orders Found</Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}

export default Orders
