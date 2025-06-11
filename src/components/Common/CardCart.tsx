'use client'

import { TItem } from '@/types/cart'
import { embedImage, formatCurrency } from '@/utils/util'
import { ActionIcon, Card, Grid, Image, Stack, Text, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

type TCardCart = {
  item: TItem
}

const CardCart = ({ item }: TCardCart) => {
  return (
    <Card shadow="sm" radius="md">
      <Grid>
        <Grid.Col span={1}>
          <Image src={embedImage(item.product_image_url)} alt={item.product_name} w={100} h={100} />
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap={'xs'}>
            <Title order={5}>
              {item.product_name} - {item.model}
            </Title>
            <Text>{item.product_brand}</Text>
            <Text>
              Color: {item.color} // Extra: {item.material}, {item.uv_protection}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap={'xs'} justify="center" h={'100%'}>
            <Title order={5}>{formatCurrency(item.price)}</Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stack gap={'xs'} align="center" justify="center" h={'100%'}>
            <ActionIcon variant="subtle">
              <IconTrash />
            </ActionIcon>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

export default CardCart
