'use client'

import { PrescriptionPayload } from '@/types/cart'
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'

type CheckoutSummary = {
  address: {
    recipient_name: string
    phone: string
    address: string
    city: string
    province: string
    postal_code: string
  }
  items: {
    product_name: string
    variant_name: string
    quantity: number
    price: number
    prescription?: PrescriptionPayload
  }[]
  shipping: {
    method: 'Reguler'
    destination: string
    cost: number
    estimated_days: string
  }
}

const Orders = () => {
  const router = useRouter()

  const [active, setActive] = useState(0)
  const nextStep = () => {
    setActive((current) => {
      const step = current < 3 ? current + 1 : current
      router.push(`?step=${step + 1}`)
      return step
    })
  }
  const prevStep = () => {
    setActive((current) => {
      const step = current > 0 ? current - 1 : current
      router.push(`?step=${step + 1}`)
      return step
    })
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  })

  const handleSubmitCheckout = () => {
    console.log('masuk')
  }

  return (
    <Container size={'sm'} my={120}>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Input Address">
          <Card shadow="md" radius="lg">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <Stack>
                <TextInput
                  withAsterisk
                  label="Recipient Name"
                  placeholder="eg: Dystian En Yusgiantoro"
                  key={form.key('recipient_name')}
                  {...form.getInputProps('recipient_name')}
                />
                <TextInput
                  withAsterisk
                  label="Phone"
                  placeholder="eg: +62 813-3647-2725"
                  key={form.key('phone')}
                  {...form.getInputProps('phone')}
                />
                <Textarea
                  withAsterisk
                  label="Address"
                  placeholder="eg: Tebet Barat Dalam X E No.12, RT.12/RW.5, Tebet Bar., Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12810"
                  key={form.key('address')}
                  {...form.getInputProps('address')}
                />
                <TextInput
                  withAsterisk
                  label="City"
                  placeholder="eg: Jakarta Selatan"
                  key={form.key('city')}
                  {...form.getInputProps('city')}
                />
                <TextInput
                  withAsterisk
                  label="Province"
                  placeholder="eg: Jakarta"
                  key={form.key('province')}
                  {...form.getInputProps('province')}
                />
                <TextInput
                  withAsterisk
                  label="Postal Code"
                  placeholder="eg: 12810"
                  key={form.key('postal_code')}
                  {...form.getInputProps('postal_code')}
                />
              </Stack>

              <Group grow justify="center" mt="xl">
                <Button variant="default" radius={'xl'} onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} radius={'xl'}>
                  Next step
                </Button>
              </Group>
            </form>
          </Card>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Detail Orders">
          <Card shadow="md" radius="lg">
            <Stack gap="md">
              {/* 📦 Shipping Address */}
              <Box>
                <Text fw={600} mb={4}>
                  Shipping Address
                </Text>
                <Text size="sm">{'checkoutAddress.recipient_name'}</Text>
                <Text size="sm">{'checkoutAddress.phone'}</Text>
                <Text size="sm">{'checkoutAddress.address'}</Text>
              </Box>

              <Divider />

              {/* 🛒 Items */}
              <Box>
                <Text fw={600} mb="sm">
                  Order Items
                </Text>

                {/* {cartItems.map((item, index) => (
                  <Card key={index} withBorder radius="md" mb="sm">
                    <Group justify="space-between" align="flex-start">
                      <Box>
                        <Text fw={500}>{item.product_name}</Text>
                        <Text size="sm" c="dimmed">
                          Variant: {item.variant_name}
                        </Text>
                        {item.prescription && (
                          <Text size="xs" c="dimmed">
                            Resep: R({item.prescription.right}) / L({item.prescription.left})
                          </Text>
                        )}
                      </Box>

                      <Box ta="right">
                        <Text size="sm">
                          {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                        </Text>
                        <Text fw={600}>
                          Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                        </Text>
                      </Box>
                    </Group>
                  </Card>
                ))} */}
              </Box>

              <Divider />

              {/* 🚚 Shipping */}
              <Box>
                <Text fw={600}>Shipping</Text>
                <Text size="sm">Reguler -</Text>
                <Text size="sm">Destination: -</Text>
              </Box>

              <Divider />

              {/* 💰 Total */}
              <Box>
                <Group justify="space-between">
                  <Text>Subtotal</Text>
                  <Text>Rp 0</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Shipping</Text>
                  <Text>Rp 0</Text>
                </Group>
                <Group justify="space-between" mt="xs">
                  <Text fw={600}>Total</Text>
                  <Text fw={600}>Rp 0</Text>
                </Group>
              </Box>

              <Group grow justify="center" mt="xl">
                <Button variant="default" radius="xl" onClick={prevStep}>
                  Back
                </Button>
                <Button radius="xl" onClick={handleSubmitCheckout}>
                  Submit Order
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>
    </Container>
  )
}

export default Orders
