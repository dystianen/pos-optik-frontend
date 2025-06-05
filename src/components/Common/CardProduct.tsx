'use client'
import { TProduct } from '@/types/product'
import { embedImage, formatCurrency } from '@/utils/util'
import { Box, Button, Card, Group, Image, Text } from '@mantine/core'

const CardProduct = ({ item }: { item: TProduct }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Card.Section>
        <Image src={embedImage(item.product_image_url)} alt="Norway" h={200} fit="inherit" />
      </Card.Section>

      <Box mt={'md'}>
        <Text fw={500} c="primary">
          {item.product_brand}
        </Text>
        <Text fw={500}>{item.product_name}</Text>

        <Group justify="space-between" mt={'md'}>
          <Text size="sm" c="dimmed">
            {item.model}
          </Text>
          <Text size="sm" c="dimmed">
            {formatCurrency(item.product_price)}
          </Text>
        </Group>

        <Button fullWidth mt="md" radius="xl">
          Add to Cart
        </Button>
      </Box>
    </Card>
  )
}

export default CardProduct
