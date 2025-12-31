'use client'
import { OrderCard } from '@/components/Order/OrderCard'
import { useOrder } from '@/hooks/useOrder'
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
import {
  IconAlertCircle,
  IconCircleCheck,
  IconPackage,
  IconTruck,
  IconX
} from '@tabler/icons-react'
import { useState } from 'react'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string | null>('4d609622-8392-469b-acd1-c7859424633a')

  const { data, isLoading } = useOrder.orders({ statusId: activeTab })

  return (
    <Container size="xl" py="xl" mt={60}>
      <Stack gap="lg">
        {/* Header */}
        <Title order={2}>My Orders</Title>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="4d609622-8392-469b-acd1-c7859424633a">
              <Group justify="center">
                <IconTruck size={20} />
                <Text>Shipping</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="cc46d2a8-436c-42fc-96a1-ffb537dbabed">
              <Group justify="center">
                <IconPackage size={20} />
                <Text>Delivered</Text>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab value="0ab780fe-49da-4a95-ad73-56c3c74f2416">
              <Group justify="center">
                <IconX size={20} />
                <Text>Cancelled</Text>
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
          <Tabs.Panel value={`${activeTab}`}>
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
                  {data?.map((order) => (
                    <OrderCard key={order.order_id} order={order} />
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
