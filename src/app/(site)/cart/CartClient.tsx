'use client'

import SectionCarousel from '@/components/Home/SectionCarousel'
import CardCart from '@/components/ui/CardCart'
import CardCartSkeleton from '@/components/ui/Skeleton/CardCartSkeleton'
import { useCart } from '@/features/cart/hooks'
import { useActiveOrder, useCancelOrder } from '@/features/order/hooks'
import { useMyRecommendations } from '@/features/product/hooks'
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
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  rem
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconLock, IconShoppingBag, IconShoppingCart } from '@tabler/icons-react'
import { hasCookie } from 'cookies-next/client'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Cart = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(hasCookie('user'))
  }, [])

  const { data: cart, isLoading } = useCart()
  const [checkingActiveOrder, setCheckingActiveOrder] = useState(false)

  const { refetch: refetchActiveOrder } = useActiveOrder()
  const { mutate: cancelOrder, isPending: isCancellingOrder } = useCancelOrder()

  const [, setActiveStep] = useLocalStorage({
    key: 'step',
    defaultValue: 0
  })

  const [, setCheckoutOrderRaw] = useLocalStorage<string | null>({
    key: 'checkout_order',
    defaultValue: null
  })

  const [activeOrderModalOpened, setActiveOrderModalOpened] = useState(false)
  const [activeOrderFromBackend, setActiveOrderFromBackend] = useState<any>(null)

  const { data: myRecommendations, isLoading: isLoadingMyRecs } = useMyRecommendations({
    limit: 10,
    enabled: isLoggedIn
  })

  const handleCheckout = useCallback(async () => {
    if (!isLoggedIn) {
      router.push('/checkout')
      return
    }

    setCheckingActiveOrder(true)
    try {
      const { data: activeOrderData } = await refetchActiveOrder()
      if (activeOrderData?.hasActivePayment) {
        setActiveOrderFromBackend(activeOrderData.order)
        setActiveOrderModalOpened(true)
      } else {
        setCheckoutOrderRaw(null)
        setActiveStep(0)
        router.push('/checkout')
      }
    } catch (err) {
      console.error(err)
      router.push('/checkout')
    } finally {
      setCheckingActiveOrder(false)
    }
  }, [isLoggedIn, refetchActiveOrder, router])

  const handleConfirmCancelActive = useCallback(() => {
    if (!activeOrderFromBackend) return

    cancelOrder(
      {
        order_id: activeOrderFromBackend.order_id,
        reason: 'Cancelled to start a new checkout flow',
        additional_note: ''
      },
      {
        onSuccess: () => {
          toast.success('Pesanan sebelumnya berhasil dibatalkan.')
          setActiveOrderModalOpened(false)
          setActiveOrderFromBackend(null)
          setCheckoutOrderRaw(null)
          setActiveStep(0)
          router.push('/checkout')
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Gagal membatalkan pesanan sebelumnya.')
        }
      }
    )
  }, [activeOrderFromBackend, cancelOrder, setCheckoutOrderRaw, setActiveStep, router])

  const handleKeepActiveOrder = useCallback(() => {
    if (!activeOrderFromBackend) return

    const payload = {
      order_id: activeOrderFromBackend.order_id,
      grand_total: activeOrderFromBackend.grand_total,
      created_at: new Date(activeOrderFromBackend.created_at.replace(' ', 'T')).getTime()
    }

    setCheckoutOrderRaw(JSON.stringify(payload))
    setActiveStep(2) // Move to Payment step
    setActiveOrderModalOpened(false)
    setActiveOrderFromBackend(null)
    router.push('/checkout')
  }, [activeOrderFromBackend, setCheckoutOrderRaw, setActiveStep, router])

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
                boxShadow: '0 4px 12px rgba(57, 223, 201, 0.25)'
              }}
            >
              <IconShoppingBag size={24} color="white" />
            </Box>
            <Box>
              <Text fw={600} fz={'h3'}>
                Shopping Cart
              </Text>
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
                p="md"
                radius={'md'}
                style={{
                  backgroundColor: 'var(--mantine-color-primary-0)',
                  border: 'none'
                }}
                visibleFrom="sm"
              >
                <Grid align="center">
                  <Grid.Col span={8}>
                    <Text fw={600} size="sm" c="primary.9">
                      Product
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Text fw={600} size="sm" c="primary.9">
                      Subtotal
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Text fw={600} size="sm" c="primary.9" ta="center">
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
                <Card p="xl" shadow="sm">
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
              p="xl"
              withBorder
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
                    <Text fw={700} size="xl" c="primary.8" mt={4}>
                      {formatCurrency(cart?.summary.total_price || '0')}
                    </Text>
                  </Box>
                </Group>

                <Button
                  fullWidth
                  size="md"
                  color="primary"
                  loading={checkingActiveOrder || isCancellingOrder}
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

        {isLoggedIn && myRecommendations && myRecommendations.length > 0 && (
          <SectionCarousel
            title="Just For You"
            exploreTo="/recommendations"
            data={myRecommendations}
            isLoading={isLoadingMyRecs}
          />
        )}
      </Stack>

      <Modal
        opened={activeOrderModalOpened}
        onClose={() => setActiveOrderModalOpened(false)}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={true}
        title={
          <Text fw={700} size="lg">
            Pembayaran Belum Selesai
          </Text>
        }
        centered
        size="lg"
        radius="md"
        padding="xl"
      >
        <Stack gap="md">
          <Text c="dimmed" style={{ lineHeight: 1.5 }}>
            Anda masih memiliki pembayaran pesanan sebelumnya yang belum diselesaikan. Apakah Anda
            ingin membatalkan pesanan sebelumnya dan melanjutkan dengan checkout baru?
          </Text>

          <Group justify="flex-end" mt="md" grow>
            <Button variant="default" onClick={handleKeepActiveOrder} disabled={isCancellingOrder}>
              Lanjutkan Pembayaran Lama
            </Button>
            <Button color="red" onClick={handleConfirmCancelActive} loading={isCancellingOrder}>
              Batalkan dan Buat Baru
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}

export default Cart
