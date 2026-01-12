'use client'
import StepPayment from '@/components/Checkout/StepPayment'
import StepPaymentConfirmation from '@/components/Checkout/StepPaymentConfirmation'
import StepResultPayment from '@/components/Checkout/StepResultPayment'
import StepSummaryOrder from '@/components/Checkout/StepSummaryOrder'
import { useOrder } from '@/hooks/useOrder'
import { useShipping } from '@/hooks/useShipping'
import { TSummaryOrders } from '@/types/order'
import { TCustomerShipping, TReqCustomerShipping } from '@/types/shipping'
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Radio,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import { IconEdit, IconInfoCircle } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Orders = () => {
  const router = useRouter()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      recipient_name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postal_code: ''
    }
  })

  const [activeStep, setActiveStep] = useLocalStorage({
    key: 'step',
    defaultValue: 0
  })

  const [csaId, setCsaId] = useLocalStorage({
    key: 'csaId',
    defaultValue: ''
  })

  const { data: shippingAddresses, isLoading: isLoadingShippingAddresses } =
    useShipping.getAllShippingAddress()
  const { data: shippingAddress } = useShipping.getShippingAddress(csaId)
  const { mutate: saveShippingAddress, isPending: isLoadingSave } =
    useShipping.saveCustomerShipping()
  const { mutate: summary, isPending: isLoadingSummary } = useOrder.summaryOrders()

  const [showForm, setShowForm] = useState(false)
  const [summaryOrder, setSummaryOrder] = useState<TSummaryOrders | null>(null)

  const hasAddress = (shippingAddresses?.length ?? 0) > 0

  useEffect(() => {
    // Kalau user BELUM punya alamat → langsung tampilkan form
    if (shippingAddresses && !hasAddress) {
      setShowForm(true)
    }

    // Kalau user SUDAH punya alamat → tampilkan list
    if (shippingAddresses && hasAddress) {
      setShowForm(false)
    }
  }, [shippingAddresses, hasAddress])

  useEffect(() => {
    if (csaId && shippingAddress) {
      form.setValues(shippingAddress)
    }
  }, [csaId, shippingAddress])

  useEffect(() => {
    if (activeStep === 1 && csaId) {
      summary(csaId, {
        onSuccess: (res) => {
          setSummaryOrder(res)
        }
      })
    }
  }, [activeStep, csaId])

  const handleSaveAddress = (values: TReqCustomerShipping) => {
    const payload = csaId ? { ...values, id: csaId } : { ...values }

    saveShippingAddress(payload, {
      onSuccess: (res) => {
        const id = res?.data?.id ?? csaId

        setCsaId(id)
        setShowForm(false)
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  const prevStep = () => {
    const prev = Math.max(activeStep - 1, 0)
    setActiveStep(prev)
  }

  const nextStep = () => {
    const next = activeStep + 1
    setActiveStep(next)
  }

  const nextToSummaryOrder = () => {
    if (csaId) {
      summary(csaId, {
        onSuccess: (res) => {
          setSummaryOrder(res)
          nextStep()
        }
      })
    }
  }

  const handleSelectAddress = (address: TCustomerShipping | null) => {
    if (!address) {
      // ➕ New address
      form.reset()
      setShowForm(true)
      return
    }

    setCsaId(address.csa_id)
    form.setValues(address)
    setShowForm(false)
  }

  const handleEditAddress = (address: any) => {
    setCsaId(address.csa_id)
    form.setValues(address)
    setShowForm(true)
  }

  const handleBackOrCancel = () => {
    if (!showForm) {
      // 🔙 User belum punya alamat → balik ke halaman sebelumnya
      router.back()
      return
    }

    // ❌ User sudah punya alamat → cancel form
    setShowForm(false)
    form.reset()
  }

  return (
    <Container my={120}>
      <Stepper active={activeStep} size="sm">
        <Stepper.Step label="Shipping">
          <Card shadow="md" radius="lg" p="xl">
            <Stack gap={'xl'}>
              <Alert
                variant="light"
                color="yellow"
                radius="lg"
                title="Shipping Information"
                icon={<IconInfoCircle />}
              >
                Currently, only <strong>Regular</strong> shipping service is available. Delivery
                time and shipping costs will follow the regular service terms.
              </Alert>

              <Card withBorder radius="lg" p="xl">
                <LoadingOverlay
                  visible={isLoadingShippingAddresses}
                  zIndex={1000}
                  overlayProps={{ radius: 'lg', blur: 5 }}
                  loaderProps={{ type: 'bars' }}
                />
                {!showForm && shippingAddresses && shippingAddresses.length > 0 ? (
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Text fw={600} size="lg">
                        Choose Shipping Address
                      </Text>
                      <Button
                        size="xs"
                        variant="light"
                        radius={'xl'}
                        onClick={() => handleSelectAddress(null)}
                      >
                        + Add New Address
                      </Button>
                    </Group>

                    <Radio.Group value={csaId ?? ''}>
                      <Stack gap="sm">
                        {shippingAddresses.map((address) => (
                          <Card
                            key={address.csa_id}
                            withBorder
                            radius="md"
                            p="md"
                            style={{
                              borderColor:
                                csaId === address.csa_id
                                  ? 'var(--mantine-color-blue-6)'
                                  : undefined,
                              backgroundColor:
                                csaId === address.csa_id ? 'var(--mantine-color-blue-0)' : undefined
                            }}
                          >
                            <Group align="flex-start" justify="space-between" wrap="nowrap">
                              {/* LEFT */}
                              <Group
                                align="flex-start"
                                onClick={() => handleSelectAddress(address)}
                                style={{ cursor: 'pointer' }}
                              >
                                <Radio value={address.csa_id} />

                                <Stack gap={2} style={{ flex: 1 }}>
                                  <Group gap="xs">
                                    <Text fw={600}>{address.recipient_name}</Text>
                                    <Text size="xs" c="dimmed">
                                      ({address.phone})
                                    </Text>
                                  </Group>

                                  <Text size="sm" c="dimmed">
                                    {address.address}
                                  </Text>

                                  <Text size="sm">
                                    {address.city}, {address.province} {address.postal_code}
                                  </Text>
                                </Stack>
                              </Group>

                              {/* RIGHT */}
                              <Box>
                                <Button
                                  variant="subtle"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditAddress(address)
                                  }}
                                >
                                  <IconEdit size={28} />
                                </Button>
                              </Box>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    </Radio.Group>

                    <Text size="xs" c="dimmed">
                      Select an existing address or add a new one.
                    </Text>

                    <Group grow justify="center" mt="xl">
                      <Button variant="default" radius="xl" onClick={handleBackOrCancel}>
                        Back
                      </Button>

                      <Button
                        type="submit"
                        radius="xl"
                        loading={isLoadingSummary}
                        onClick={nextToSummaryOrder}
                      >
                        Next
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <form onSubmit={form.onSubmit(handleSaveAddress)}>
                    <Stack>
                      <Text fw={600} size="lg">
                        Input Shipping Address
                      </Text>

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
                        placeholder="eg: Tebet Barat Dalam X E No.12..."
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
                      <Button variant="default" radius="xl" size="lg" onClick={handleBackOrCancel}>
                        {hasAddress ? 'Cancel' : 'Back'}
                      </Button>

                      <Button type="submit" radius="xl" size="lg" loading={isLoadingSave}>
                        {csaId ? 'Update Address' : 'Save Address'}
                      </Button>
                    </Group>
                  </form>
                )}
              </Card>
            </Stack>
          </Card>
        </Stepper.Step>
        <Stepper.Step label="Order Summary">
          <StepSummaryOrder
            isLoadingSummary={isLoadingSummary}
            summaryOrder={summaryOrder}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        </Stepper.Step>
        <Stepper.Step label="Payment">
          <StepPayment nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Step label="Confirmation">
          <StepPaymentConfirmation nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Completed>
          <StepResultPayment />
        </Stepper.Completed>
      </Stepper>
    </Container>
  )
}

export default Orders
