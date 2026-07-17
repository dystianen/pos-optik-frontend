'use client'

import { useDeleteCart as useDeleteItemCart, useUpdateCart } from '@/features/cart/hooks'
import { TItemCart } from '@/features/order/types'
import { useAvailableCoupons } from '@/features/order/hooks'
import { formatCurrency } from '@/utils/format'
import { toast } from 'react-toastify'

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Collapse,
  Grid,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
  rem
} from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconEye, IconTrash } from '@tabler/icons-react'
import Image from 'next/image'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

type TCardCart = {
  item: TItemCart
  hideAction?: boolean
}

const CardCart = memo(({ item, hideAction = false }: TCardCart) => {
  const [openRx, setOpenRx] = useState(false)
  const [localQty, setLocalQty] = useState(item.quantity)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { mutate: deleteItem, isPending } = useDeleteItemCart()
  const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCart()

  const { data: coupons } = useAvailableCoupons()
  const isExplicitlyNotNewUser = coupons !== undefined && !coupons.some(c => c.code === 'NEWUSER' && c.is_eligible)
  const showNewUserPrice = !isExplicitlyNotNewUser

  const originalPrice = Number(item.price)
  const newUserPrice = originalPrice * 0.85
  const originalSubtotal = originalPrice * localQty
  const discountAmount = showNewUserPrice ? Math.min(originalSubtotal * 0.15, 100000) : 0
  const discountedSubtotal = originalSubtotal - discountAmount
 
  // Sync localQty if item.quantity changes from outside (refetch)
  useEffect(() => {
    setLocalQty(item.quantity)
  }, [item.quantity])

  const handleChangeQty = useCallback(
    (delta: number) => {
      const next = Math.max(1, localQty + delta)
      setLocalQty(next)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        updateCartItem(
          {
            cart_item_id: item.cart_item_id,
            quantity: next
          },
          {
            onError: (err: any) => {
              setLocalQty(item.quantity)
              toast.error(err?.response?.data?.message || err?.message || 'Gagal mengubah jumlah barang.')
            }
          }
        )
      }, 400)
    },
    [localQty, item.cart_item_id, item.quantity, updateCartItem]
  )

  const prescription = item.prescription

  return (
    <Card
      withBorder
      style={{
        transition: 'all 0.3s ease'
      }}
    >
      <Grid align="center" gutter="lg">
        {/* LEFT - Product Info */}
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Group align="center" gap="lg" wrap="nowrap">
            {/* Product Image */}
            <div style={{ position: 'relative', width: 120, height: 80, borderRadius: '8px', overflow: 'hidden' }}>
              <Image
                src={item.image || '/images/placeholder.png'}
                alt={item.product_name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Product Details */}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5} fw={600} lineClamp={2}>
                {item.product_name}
              </Title>

              {item.variant_name && (
                <Badge
                  variant="light"
                  color="blue"
                  size="md"
                  w="fit-content"
                  styles={{
                    root: {
                      fontWeight: 500,
                      textTransform: 'none'
                    }
                  }}
                >
                  {item.variant_name}
                </Badge>
              )}

              <Group gap={8} align="center">
                {/* Quantity Stepper */}
                {!hideAction && (
                  <Group gap={0} style={{ border: '1.5px solid var(--mantine-color-default-border)', borderRadius: 6, overflow: 'hidden' }}>
                    <ActionIcon
                      id={`cart-qty-decrease-${item.cart_item_id}`}
                      variant="subtle"
                      color="gray"
                      size="sm"
                      radius={0}
                      onClick={() => handleChangeQty(-1)}
                      disabled={localQty <= 1}
                      style={{ width: 28, height: 28 }}
                    >
                      <Text fw={700} size="md">−</Text>
                    </ActionIcon>
                    <Box
                      style={{
                        width: 36,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: '1px solid var(--mantine-color-default-border)',
                        borderRight: '1px solid var(--mantine-color-default-border)',
                        fontWeight: 700,
                        fontSize: 13,
                        animation: isUpdating ? 'qty-blink 0.8s ease-in-out infinite' : 'none'
                      }}
                    >
                      <style>{`
                        @keyframes qty-blink {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.25; }
                        }
                      `}</style>
                      {localQty}
                    </Box>
                    <ActionIcon
                      id={`cart-qty-increase-${item.cart_item_id}`}
                      variant="subtle"
                      color="gray"
                      size="sm"
                      radius={0}
                      onClick={() => handleChangeQty(1)}
                      style={{ width: 28, height: 28 }}
                    >
                      <Text fw={700} size="md">+</Text>
                    </ActionIcon>
                  </Group>
                )}
                {hideAction && (
                  <Text size="sm" c="dimmed" fw={500}>
                    Qty: {localQty}
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  •
                </Text>
                {showNewUserPrice ? (
                  <Stack gap={1} style={{ minWidth: 100 }}>
                    <Group gap="xs" align="baseline" wrap="nowrap">
                      <Text size="sm" fw={600} c="primary">
                        {formatCurrency(newUserPrice)} each
                      </Text>
                      <Text size="xs" c="dimmed" td="line-through" style={{ flexShrink: 0 }}>
                        {formatCurrency(originalPrice)}
                      </Text>
                    </Group>
                    <Text size="10px" fw={700} c="teal.6">
                      New User Promo (15% off)
                    </Text>
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    {formatCurrency(item.price)} each
                  </Text>
                )}
              </Group>

              {/* Prescription Toggle */}
              {prescription && (
                <Box mt={4}>
                  <UnstyledButton
                    onClick={() => setOpenRx((v) => !v)}
                    style={{
                      padding: `${rem(6)} ${rem(12)}`,
                      borderRadius: rem(8),
                      backgroundColor: openRx ? 'var(--mantine-color-gray-1)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Group gap={6}>
                      <IconEye size={16} color="var(--mantine-color-blue-6)" />
                      <Text size="sm" fw={600} c="blue">
                        Prescription Details
                      </Text>
                      {openRx ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </Group>
                  </UnstyledButton>

                  <Collapse in={openRx}>
                    <Paper
                      mt="md"
                      p="md"
                      style={{
                        backgroundColor: 'var(--mantine-color-gray-0)'
                      }}
                    >
                      <Table
                        horizontalSpacing="md"
                        verticalSpacing="sm"
                        withTableBorder
                        withColumnBorders
                        highlightOnHover
                        styles={{
                          table: {
                            borderRadius: rem(8),
                            overflow: 'hidden',
                            backgroundColor: 'white'
                          }
                        }}
                      >
                        <Table.Thead
                          style={{
                            backgroundColor: 'var(--mantine-color-gray-1)'
                          }}
                        >
                          <Table.Tr>
                            <Table.Th fw={600}>Eye</Table.Th>
                            <Table.Th fw={600}>SPH</Table.Th>
                            <Table.Th fw={600}>CYL</Table.Th>
                            <Table.Th fw={600}>AXIS</Table.Th>
                            <Table.Th fw={600}>PD</Table.Th>
                            <Table.Th fw={600}>ADD</Table.Th>
                          </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                          <Table.Tr>
                            <Table.Td fw={600} c="blue">
                              Right
                            </Table.Td>
                            <Table.Td>{prescription.right?.sph ?? '-'}</Table.Td>
                            <Table.Td>{prescription.right?.cyl ?? '-'}</Table.Td>
                            <Table.Td>{prescription.right?.axis ?? '-'}</Table.Td>
                            <Table.Td>{prescription.right?.pd ?? '-'}</Table.Td>
                            <Table.Td>{prescription.right?.add ?? '-'}</Table.Td>
                          </Table.Tr>

                          <Table.Tr>
                            <Table.Td fw={600} c="blue">
                              Left
                            </Table.Td>
                            <Table.Td>{prescription.left?.sph ?? '-'}</Table.Td>
                            <Table.Td>{prescription.left?.cyl ?? '-'}</Table.Td>
                            <Table.Td>{prescription.left?.axis ?? '-'}</Table.Td>
                            <Table.Td>{prescription.left?.pd ?? '-'}</Table.Td>
                            <Table.Td>{prescription.left?.add ?? '-'}</Table.Td>
                          </Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Paper>
                  </Collapse>
                </Box>
              )}
            </Stack>
          </Group>
        </Grid.Col>

        {/* RIGHT - Subtotal */}
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Subtotal
            </Text>
            {showNewUserPrice ? (
              <Stack gap={1}>
                <Text fw={700} size="lg" c="primary.8"
                  style={{
                    animation: isUpdating ? 'qty-blink 0.8s ease-in-out infinite' : 'none'
                  }}
                >
                  {formatCurrency(discountedSubtotal)}
                </Text>
                <Text size="xs" c="dimmed" td="line-through">
                  {formatCurrency(originalSubtotal)}
                </Text>
              </Stack>
            ) : (
              <Text fw={700} size="lg" c="primary.8"
                style={{
                  animation: isUpdating ? 'qty-blink 0.8s ease-in-out infinite' : 'none'
                }}
              >
                {formatCurrency(originalSubtotal)}
              </Text>
            )}
          </Stack>
        </Grid.Col>

        {/* ACTION - Delete Button */}
        {!hideAction && (
          <Grid.Col span={{ base: 12, sm: 1 }}>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="md"
              onClick={() => deleteItem(item.cart_item_id)}
              loading={isPending}
              style={{
                transition: 'all 0.2s ease'
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }
              }}
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Grid.Col>
        )}
      </Grid>
    </Card>
  )
})

export default CardCart
