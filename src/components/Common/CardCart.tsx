'use client'

import { useCart } from '@/hooks/useCart'
import { TItem } from '@/types/cart'
import { formatCurrency } from '@/utils/format'
import { embedImage } from '@/utils/util'
import { ActionIcon, Card, Grid, Group, Image, Stack, Text, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useCallback } from 'react'

type TCardCart = {
  item: TItem
  hideAction?: boolean
}

const CardCart = ({ item, hideAction = false }: TCardCart) => {
  const { mutate: deleteItem } = useCart.deleteItemCart()

  const handleDeleteItemCart = useCallback(() => {
    deleteItem(item.order_item_id)
  }, [])

  return (
    <Card withBorder radius="md">
      <Grid>
        <Grid.Col span={8}>
          <Group>
            <Image
              src={embedImage(item.product_image_url)}
              alt={item.product_name}
              w={100}
              h={100}
              radius={'md'}
            />
            <Stack gap={'xs'}>
              <Title order={5}>
                {item.product_name} - {item.model}
              </Title>
              <Text>{item.product_brand}</Text>
              <Text>
                Color: {item.color} // Material: {item.material} // UV Protection:{' '}
                {item.uv_protection === '1' ? 'Yes' : 'No'}
              </Text>
            </Stack>
          </Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={'xs'} justify="center" h={'100%'}>
            <Title order={5}>{formatCurrency(item.price)}</Title>
          </Stack>
        </Grid.Col>
        {!hideAction && (
          <Grid.Col span={1}>
            <Stack gap={'xs'} align="center" justify="center" h={'100%'}>
              <ActionIcon variant="subtle" onClick={handleDeleteItemCart}>
                <IconTrash color="#797de9" />
              </ActionIcon>
            </Stack>
          </Grid.Col>
        )}
      </Grid>
    </Card>
  )
}

export default CardCart
