'use client'

import CardCart from '@/components/Common/CardCart'
import CardCartSkeleton from '@/components/Common/Skeleton/CardCartSkeleton'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/format'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  rem
} from '@mantine/core'
import { IconLock, IconShoppingBag, IconShoppingCart } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'

const Cart = () => {
  const router = useRouter()
  const { data: cart, isLoading } = useCart.cart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      router.push('/checkout')
      setLoading(false)
    }, 500)
  }, [router])

  return (
    <Container size="xl" my={100}>
      <Stack gap="xl">
        {/* Header Section */}
        <Group justify="space-between" align="center" mb="md">
          <Group gap="md">
            <Box
              style={{
                width: rem(48),
                height: rem(48),
                borderRadius: rem(12),
                background:
                  'linear-gradient(135deg, var(--mantine-color-primary-6) 0%, var(--mantine-color-primary-8) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(57, 61, 223, 0.25)'
              }}
            >
              <IconShoppingBag size={24} color="white" />
            </Box>
            <Box>
              <Title order={1} fw={700}>
                Shopping Cart
              </Title>
              <Group gap={8} mt={4}>
                <Text size="sm" c="dimmed">
                  {isLoading ? 'Loading...' : `${cart?.items?.length || 0} items`}
                </Text>
                {cart?.items && cart?.items.length > 0 && (
                  <>
                    <Text size="sm" c="dimmed">
                      •
                    </Text>
                    <Badge variant="light" color="primary" size="sm">
                      {cart.items.length} product{cart.items.length > 1 ? 's' : ''}
                    </Badge>
                  </>
                )}
              </Group>
            </Box>
          </Group>
        </Group>

        <Grid gutter="lg">
          {/* Left Column - Cart Items */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              {/* Column Headers - Desktop Only */}
              <Card
                radius="lg"
                p="md"
                style={{
                  backgroundColor: 'var(--mantine-color-primary-0)',
                  border: 'none'
                }}
                visibleFrom="sm"
              >
                <Grid align="center">
                  <Grid.Col span={8}>
                    <Text fw={600} size="sm" c="primary.7">
                      Product
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text fw={600} size="sm" c="primary.7">
                      Subtotal
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Text fw={600} size="sm" c="primary.7" ta="center">
                      Action
                    </Text>
                  </Grid.Col>
                </Grid>
              </Card>

              {/* Cart Items */}
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => <CardCartSkeleton key={i} />)
              ) : cart?.items?.length ? (
                cart.items.map((item) => <CardCart key={item.cart_item_id} item={item} />)
              ) : (
                <Card radius="xl" p="xl" shadow="sm">
                  <Stack align="center" py="xl" gap="md">
                    <Box
                      style={{
                        width: rem(80),
                        height: rem(80),
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-color-gray-1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconShoppingCart size={40} color="var(--mantine-color-gray-5)" />
                    </Box>
                    <Box ta="center">
                      <Title order={4} fw={600} c="dimmed">
                        Your cart is empty
                      </Title>
                      <Text size="sm" c="dimmed" mt={8}>
                        Add items to get started with your order
                      </Text>
                    </Box>
                    <Button
                      variant="light"
                      color="primary"
                      size="md"
                      radius="xl"
                      onClick={() => router.push('/product/kacamata')}
                      mt="sm"
                    >
                      Continue Shopping
                    </Button>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Grid.Col>

          {/* Right Column - Order Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              radius="xl"
              p="xl"
              shadow="sm"
              style={{
                position: 'sticky',
                top: rem(20)
              }}
            >
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Title order={4} fw={700}>
                    Order Summary
                  </Title>
                  {cart?.items && cart.items.length > 0 && (
                    <Badge variant="light" color="primary" size="lg">
                      {cart.items.length} items
                    </Badge>
                  )}
                </Group>

                <Divider />

                <Stack gap="md">
                  <Group justify="space-between">
                    <Text c="dimmed">Subtotal</Text>
                    <Text fw={600} size="lg">
                      {formatCurrency(cart?.summary.total_price || '0')}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text c="dimmed">Shipping</Text>
                    <Text fw={500} size="sm" c="primary">
                      Calculated at checkout
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text c="dimmed">Tax</Text>
                    <Text fw={500} size="sm" c="dimmed">
                      Included
                    </Text>
                  </Group>
                </Stack>

                <Divider />

                <Group justify="space-between" align="center">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Total Price
                    </Text>
                    <Text fw={700} size="xl" c="primary" mt={4}>
                      {formatCurrency(cart?.summary.total_price || '0')}
                    </Text>
                  </Box>
                </Group>

                <Button
                  fullWidth
                  size="lg"
                  radius="xl"
                  color="primary"
                  loading={loading}
                  onClick={handleCheckout}
                  disabled={!cart?.items?.length}
                  variant="gradient"
                  gradient={{ from: 'primary.6', to: 'primary.8', deg: 135 }}
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                  styles={{
                    root: {
                      '&:hover:not(:disabled)': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(57, 61, 223, 0.3)'
                      }
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Group justify="center" gap={6} mt="xs">
                  <IconLock size={14} color="var(--mantine-color-gray-6)" />
                  <Text size="xs" c="dimmed">
                    Secure checkout • SSL encrypted
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

export default Cart
