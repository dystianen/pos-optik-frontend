'use client'

import StepPayment from '@/components/Order/StepPayment'
import StepPaymentConfirmation from '@/components/Order/StepPaymentConfirmation'
import StepSuccessPayment from '@/components/Order/StepSuccessPayment'
import StepSummaryOrder from '@/components/Order/StepSummaryOrder'
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
import { IconEdit, IconInfoCircle } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRouter as useRouterBar } from 'nextjs-toploader/app'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Orders = () => {
  const router = useRouter()
  const routerBar = useRouterBar()
  const searchParams = useSearchParams()
  const csaId = searchParams.get('id') as string
  const stepParam = Number(searchParams.get('step') ?? 0)

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

  const { data: shippingAddresses, isLoading: isLoadingShippingAddresses } =
    useShipping.getAllShippingAddress()
  const { data: shippingAddress } = useShipping.getShippingAddress(csaId)
  const { mutate: saveShippingAddress, isPending: isLoadingSave } =
    useShipping.saveCustomerShipping()
  const { mutate: summary, isPending: isLoadingSummary } = useOrder.summaryOrders()

  const [active, setActive] = useState(stepParam)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(csaId)
  const [showForm, setShowForm] = useState(false)
  const [summaryOrder, setSummaryOrder] = useState<TSummaryOrders | null>(null)

  const [loading, setLoading] = useState(false)

  const { mutate: payment } = useOrder.payment()

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
    if (csaId) {
      setSelectedAddressId(csaId)
    }
  }, [csaId])

  useEffect(() => {
    if (csaId && shippingAddress) {
      form.setValues(shippingAddress)
    }
  }, [csaId, shippingAddress])

  useEffect(() => {
    setActive(stepParam)
  }, [stepParam])

  useEffect(() => {
    if (stepParam === 1 && csaId) {
      summary(csaId, {
        onSuccess: (res) => {
          setSummaryOrder(res)
        }
      })
    }
  }, [stepParam, csaId])

  useEffect(() => {
    setActive(Number(stepParam) || 0)
  }, [stepParam])

  const handleSaveAddress = (values: TReqCustomerShipping) => {
    const payload = selectedAddressId ? { ...values, id: selectedAddressId } : { ...values }

    saveShippingAddress(payload, {
      onSuccess: (res) => {
        const id = res?.data?.id ?? selectedAddressId

        setSelectedAddressId(id)
        setShowForm(false)
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  const goToStep = (step: number) => {
    router.push(`?step=${step}${csaId ? `&id=${csaId}` : ''}`)
  }

  const prevStep = () => {
    const current = Number(stepParam) || 0
    const prev = Math.max(current - 1, 0)

    goToStep(prev)
  }

  const nextStep = () => {
    const next = (Number(stepParam) || 0) + 1
    goToStep(next)
  }

  const nextToSummaryOrder = () => {
    const id = selectedAddressId

    if (id) {
      summary(id, {
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
      setSelectedAddressId(null)
      form.reset()
      setShowForm(true)
      router.replace('?step=0')
      return
    }

    setSelectedAddressId(address.csa_id)
    form.setValues(address)
    setShowForm(false)
    router.replace(`?step=0&id=${address.csa_id}`)
  }

  const handleEditAddress = (address: any) => {
    setSelectedAddressId(address.csa_id)
    form.setValues(address)
    setShowForm(true)
    router.replace(`?step=0&id=${address.csa_id}`)
  }

  const handleBackOrCancel = () => {
    if (!hasAddress) {
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
      <Stepper active={active} size="sm">
        <Stepper.Step label="Delivery">
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

                    <Radio.Group value={selectedAddressId ?? ''}>
                      <Stack gap="sm">
                        {shippingAddresses.map((address) => (
                          <Card
                            key={address.csa_id}
                            withBorder
                            radius="md"
                            p="md"
                            style={{
                              borderColor:
                                selectedAddressId === address.csa_id
                                  ? 'var(--mantine-color-blue-6)'
                                  : undefined,
                              backgroundColor:
                                selectedAddressId === address.csa_id
                                  ? 'var(--mantine-color-blue-0)'
                                  : undefined
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
                      <Button variant="default" radius="xl" size="lg" onClick={handleBackOrCancel}>
                        Back
                      </Button>

                      <Button
                        type="submit"
                        radius="xl"
                        size="lg"
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
                        {selectedAddressId ? 'Update Address' : 'Save Address'}
                      </Button>
                    </Group>
                  </form>
                )}
              </Card>
            </Stack>
          </Card>
        </Stepper.Step>
        <Stepper.Step label="Summary Orders">
          <StepSummaryOrder
            isLoadingSummary={isLoadingSummary}
            summaryOrder={summaryOrder}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        </Stepper.Step>
        <Stepper.Step label="Payment">
          <StepPayment prevStep={prevStep} />
        </Stepper.Step>
        <Stepper.Step label="Payment Confirmation">
          <StepPaymentConfirmation nextStep={nextStep} />
        </Stepper.Step>
        <Stepper.Completed>
          <StepSuccessPayment />
        </Stepper.Completed>
      </Stepper>
    </Container>
  )
}

export default Orders
