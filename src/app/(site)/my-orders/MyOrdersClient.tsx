'use client'
import { useOrders } from '@/features/order/hooks'
import {
  Box,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Tabs,
  Text,
  Title
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconCircleCheck,
  IconPackage,
  IconReceiptRefund,
  IconTruck,
  IconX
} from '@tabler/icons-react'
import dynamic from 'next/dynamic'

const OrderCard = dynamic(
  () => import('@/features/order/components/OrderCard').then((mod) => mod.OrderCard),
  { ssr: false }
)

const MyOrdersClient = () => {
  const [orderTab, setOrderTab] = useLocalStorage<string | null>({
    key: 'orderTab',
    defaultValue: 'all'
  })

  const { data, isLoading } = useOrders({ statusId: orderTab })

  return (
    <Container size="xl" py="xl" mt={60}>
      <Stack gap="lg">
        {/* Header */}
        <Title order={2}>My Orders</Title>

        <Tabs
          value={orderTab}
          onChange={setOrderTab}
          styles={{
            list: {
              flexWrap: 'nowrap',
              overflowX: 'auto'
            }
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="all">
              <Group justify="center">
                <IconTruck size={20} />
                <Text>All</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="cc46d2a8-436c-42fc-96a1-ffb537dbabed">
              <Group justify="center">
                <IconTruck size={20} />
                <Text>Shipping</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="4d609622-8392-469b-acd1-c7859424633a">
              <Group justify="center">
                <IconPackage size={20} />
                <Text>Delivery</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="0ab780fe-49da-4a95-ad73-56c3c74f2416">
              <Group justify="center">
                <IconX size={20} />
                <Text>Cancelled</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="ae12a448-98b3-4dc1-9c71-87468abc7bb5">
              <Group justify="center">
                <IconReceiptRefund size={20} />
                <Text>Refunded</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="8d434de4-ba22-4698-8438-8318ef3f6d8f">
              <Group justify="center">
                <IconCircleCheck size={20} />
                <Text>Completed</Text>
              </Group>
            </Tabs.Tab>
          </Tabs.List>

          {/* SHIPPING */}
          <Tabs.Panel value={`${orderTab}`}>
            <Box pos="relative" mih={400} mt={'lg'}>
              <LoadingOverlay visible={isLoading} loaderProps={{ type: 'bars' }} />

              {data?.length === 0 ? (
                <Center h="30vh">
                  <Stack align="center" gap="md">
                    <IconAlertCircle size={48} color="gray" />
                    <Text c="dimmed" size="lg">
                      No orders found
                    </Text>
                  </Stack>
                </Center>
              ) : (
                <Stack gap="md">
                  {data?.map((order, index) => (
                    <OrderCard key={index} order={order} />
                  ))}
                </Stack>
              )}
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}

export default MyOrdersClient
