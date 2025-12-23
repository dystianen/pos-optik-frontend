'use client'

import { useCart } from '@/hooks/useCart'
import { TCartItem } from '@/types/cart'
import { formatCurrency } from '@/utils/format'
import { ActionIcon, Badge, Card, Grid, Group, Image, Stack, Text, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useCallback } from 'react'

type TCardCart = {
  item: TCartItem
  hideAction?: boolean
}

const CardCart = ({ item, hideAction = false }: TCardCart) => {
  const { mutate: deleteItem, isPending } = useCart.deleteItemCart()

  const handleDeleteItemCart = useCallback(() => {
    deleteItem(item.cart_item_id)
  }, [deleteItem, item.cart_item_id])

  return (
    <Card withBorder radius="lg" p="md">
      <Grid align="center">
        {/* LEFT - Product Info */}
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

            <Stack gap={6}>
              <Title order={6}>{item.product_name}</Title>

              {item.variant_name && (
                <Badge variant="light" color="gray" w="fit-content">
                  {item.variant_name}
                </Badge>
              )}

              <Text size="sm" c="dimmed">
                {item.quantity} × {formatCurrency(item.price)}
              </Text>
            </Stack>
          </Group>
        </Grid.Col>

        {/* MIDDLE - Subtotal */}
        <Grid.Col span={3}>
          <Stack justify="center">
            <Text fw={600}>{formatCurrency(item.subtotal)}</Text>
          </Stack>
        </Grid.Col>

        {/* RIGHT - Action */}
        {!hideAction && (
          <Grid.Col span={1}>
            <Stack align="center" justify="center" h="100%">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={handleDeleteItemCart}
                loading={isPending}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Stack>
          </Grid.Col>
        )}
      </Grid>
    </Card>
  )
}

export default CardCart
