'use client'

import CardCart from '@/components/Common/CardCart'
import { useCart } from '@/hooks/useCart'
import { Card, Container, Grid, Stack, Text, Title } from '@mantine/core'

const Cart = () => {
  const { data: cart } = useCart.cart()

  return (
    <Container size={'xl'} my={120}>
      <Title order={2} mb={32}>
        My Cart
      </Title>
      <Stack>
        <Card bg="primary.0">
          <Grid>
            <Grid.Col span={8}>
              <Title order={5}>Product</Title>
            </Grid.Col>
            <Grid.Col span={3}>
              <Title order={5}>Price</Title>
            </Grid.Col>
            <Grid.Col span={1}>
              <Title order={5}>Action</Title>
            </Grid.Col>
          </Grid>
        </Card>
        {Number(cart?.items.length) > 0 ? (
          cart?.items.map((item) => <CardCart key={item.order_item_id} item={item} />)
        ) : (
          <Card withBorder radius="md">
            <Stack>
              <Text>No Items Cart Found</Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}

export default Cart
