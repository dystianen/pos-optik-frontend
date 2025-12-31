'use client'

import { useCart } from '@/hooks/useCart'
import { TItemCart } from '@/types/order'
import { formatCurrency } from '@/utils/format'

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Collapse,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
  rem
} from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconEye, IconTrash } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

type TCardCart = {
  item: TItemCart
  hideAction?: boolean
}

const CardCart = ({ item, hideAction = false }: TCardCart) => {
  const [openRx, setOpenRx] = useState(false)
  const { mutate: deleteItem, isPending } = useCart.deleteItemCart()

  const handleDeleteItemCart = useCallback(() => {
    deleteItem(item.cart_item_id)
  }, [deleteItem, item.cart_item_id])

  const prescription = item.prescription

  return (
    <Card
      radius="lg"
      withBorder
      style={{
        transition: 'all 0.3s ease'
      }}
    >
      <Grid align="center" gutter="lg">
        {/* LEFT - Product Info */}
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Group align="flex-start" gap="lg" wrap="nowrap">
            {/* Product Image */}
            <Image
              src={item.image || '/images/placeholder.png'}
              alt={item.product_name}
              w={120}
              h={120}
              radius="md"
              fit="cover"
            />

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
                  radius="md"
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

              <Group gap={8}>
                <Text size="sm" c="dimmed" fw={500}>
                  Qty: {item.quantity}
                </Text>
                <Text size="sm" c="dimmed">
                  •
                </Text>
                <Text size="sm" c="dimmed">
                  {formatCurrency(item.price)} each
                </Text>
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
                      radius="lg"
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
            <Text fw={700} size="lg" c="primary.4">
              {formatCurrency(item.subtotal)}
            </Text>
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
              onClick={handleDeleteItemCart}
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
}

export default CardCart
