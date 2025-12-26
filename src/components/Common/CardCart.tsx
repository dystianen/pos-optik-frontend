'use client'

import { useCart } from '@/hooks/useCart'
import { TItemCart } from '@/types/order'
import { formatCurrency } from '@/utils/format'

import {
  ActionIcon,
  Badge,
  Card,
  Collapse,
  Divider,
  Grid,
  Group,
  Image,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton
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
    <Card withBorder radius="lg" p="md">
      <Grid align="center">
        {/* LEFT */}
        <Grid.Col span={8}>
          <Group align="flex-start" gap="md" wrap="nowrap">
            <Image
              src={item.image || '/images/placeholder.png'}
              alt={item.product_name}
              w={90}
              h={90}
              radius="md"
              fit="cover"
            />

            <Stack gap={6} w="100%">
              <Title order={6}>{item.product_name}</Title>

              {item.variant_name && (
                <Badge variant="light" color="gray" w="fit-content">
                  {item.variant_name}
                </Badge>
              )}

              <Text size="sm" c="dimmed">
                {item.quantity} × {formatCurrency(item.price)}
              </Text>

              {/* 👓 COLLAPSE TOGGLE */}
              {prescription && (
                <>
                  <UnstyledButton
                    onClick={() => setOpenRx((v) => !v)}
                    style={{ width: 'fit-content' }}
                  >
                    <Group gap={4}>
                      <IconEye size={16} />
                      <Text size="sm" fw={500}>
                        View Prescription
                      </Text>
                      {openRx ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    </Group>
                  </UnstyledButton>

                  <Collapse in={openRx}>
                    <Divider my="xs" />

                    <Table fz="xs" withTableBorder>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th />
                          <Table.Th>SPH</Table.Th>
                          <Table.Th>CYL</Table.Th>
                          <Table.Th>AXIS</Table.Th>
                          <Table.Th>PD</Table.Th>
                          <Table.Th>ADD</Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td fw={500}>Right</Table.Td>
                          <Table.Td>{prescription.right?.sph ?? '-'}</Table.Td>
                          <Table.Td>{prescription.right?.cyl ?? '-'}</Table.Td>
                          <Table.Td>{prescription.right?.axis ?? '-'}</Table.Td>
                          <Table.Td>{prescription.right?.pd ?? '-'}</Table.Td>
                          <Table.Td>{prescription.right?.add ?? '-'}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Td fw={500}>Left</Table.Td>
                          <Table.Td>{prescription.left?.sph ?? '-'}</Table.Td>
                          <Table.Td>{prescription.left?.cyl ?? '-'}</Table.Td>
                          <Table.Td>{prescription.left?.axis ?? '-'}</Table.Td>
                          <Table.Td>{prescription.left?.pd ?? '-'}</Table.Td>
                          <Table.Td>{prescription.left?.add ?? '-'}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </Collapse>
                </>
              )}
            </Stack>
          </Group>
        </Grid.Col>

        {/* SUBTOTAL */}
        <Grid.Col span={3}>
          <Text fw={600}>{formatCurrency(item.subtotal)}</Text>
        </Grid.Col>

        {/* ACTION */}
        {!hideAction && (
          <Grid.Col span={1}>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={handleDeleteItemCart}
              loading={isPending}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Grid.Col>
        )}
      </Grid>
    </Card>
  )
}

export default CardCart
