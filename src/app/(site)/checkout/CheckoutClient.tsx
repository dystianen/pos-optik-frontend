'use client'
import { useActiveOrder, useSummaryOrders, useAvailableCoupons } from '@/features/order/hooks'
import { TSummaryOrders } from '@/features/order/types'
import {
  useAllShippingAddress,
  useGetShippingAddress,
  useSaveCustomerShipping,
  useProvinces,
  useCities,
  useCalculateShippingCost,
  useDistricts
} from '@/features/shipping/hooks'
import { TCustomerShipping, TReqCustomerShipping } from '@/features/shipping/types'
import {
  Alert,
  Box,
  Breadcrumbs,
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
  TextInput,
  Select,
  Divider
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import { IconEdit, IconInfoCircle } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const StepPayment = dynamic(() => import('@/features/checkout/components/StepPayment'), {
  ssr: false
})
const StepPaymentConfirmation = dynamic(
  () => import('@/features/checkout/components/StepPaymentConfirmation'),
  { ssr: false }
)
const StepResultPayment = dynamic(
  () => import('@/features/checkout/components/StepResultPayment'),
  { ssr: false }
)
const StepSummaryOrder = dynamic(() => import('@/features/checkout/components/StepSummaryOrder'), {
  ssr: false
})

const Orders = () => {
  const router = useRouter()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      recipient_name: '',
      phone: '',
      address: '',
      city: '',
      city_id: '',
      district: '',
      district_id: '',
      province: '',
      province_id: '',
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

  const [checkoutOrderRaw, setCheckoutOrderRaw] = useLocalStorage<string | null>({
    key: 'checkout_order',
    defaultValue: null
  })

  const [selectedCourier, setSelectedCourier] = useLocalStorage<string>({ key: 'checkout_courier', defaultValue: 'jne' })
  const [selectedService, setSelectedService] = useLocalStorage<string>({ key: 'checkout_service', defaultValue: 'REG' })

  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [isLoadingShippingOptions, setIsLoadingShippingOptions] = useState(false)
  const { mutate: calculateCost } = useCalculateShippingCost()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('')
  const [selectedCityId, setSelectedCityId] = useState<string>('')
  const { data: provinces } = useProvinces()
  const { data: cities } = useCities(selectedProvinceId)
  const { data: districts } = useDistricts(selectedCityId)

  const { data: activeOrderData, isLoading: isLoadingActiveOrder } = useActiveOrder()

  const { data: shippingAddresses, isLoading: isLoadingShippingAddresses } = useAllShippingAddress()
  const { data: shippingAddress } = useGetShippingAddress(csaId)
  const { mutate: saveShippingAddress, isPending: isLoadingSave } = useSaveCustomerShipping()
  const { mutate: summary, isPending: isLoadingSummary } = useSummaryOrders()
  const { data: availableCoupons } = useAvailableCoupons()

  const [showForm, setShowForm] = useState(false)
  const [summaryOrder, setSummaryOrder] = useState<TSummaryOrders | null>(null)
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('')

  const hasAddress = (shippingAddresses?.length ?? 0) > 0

  useEffect(() => {
    // Kalau user BELUM punya alamat → langsung tampilkan form
    if (shippingAddresses && !hasAddress) {
      setShowForm(true)
      setCsaId('')
      form.reset()
      setSelectedProvinceId('')
      setSelectedCityId('')
    }

    // Kalau user SUDAH punya alamat → tampilkan list
    if (shippingAddresses && hasAddress) {
      setShowForm(false)
      
      // Auto select the first address if csaId is empty or not in shippingAddresses
      const exists = shippingAddresses.some((address) => address.csa_id === csaId)
      if (!csaId || !exists) {
        const topAddress = shippingAddresses[0]
        setCsaId(topAddress.csa_id)
        form.setValues(topAddress)
        setSelectedProvinceId(topAddress.province_id || '')
        setSelectedCityId(topAddress.city_id || '')
      }
    }
  }, [shippingAddresses, hasAddress, csaId])

  useEffect(() => {
    if (csaId && shippingAddress) {
      form.setValues(shippingAddress)
      setSelectedProvinceId(shippingAddress.province_id || '')
      setSelectedCityId(shippingAddress.city_id || '')
    }
  }, [csaId, shippingAddress])

  useEffect(() => {
    if (csaId) {
      setIsLoadingShippingOptions(true)
      calculateCost(csaId, {
        onSuccess: (res) => {
          setShippingOptions(res || [])
          setIsLoadingShippingOptions(false)
          if (res && res.length > 0) {
            const stillExists = res.some(
              (opt: any) => opt.courier === selectedCourier && opt.service === selectedService
            )
            if (!stillExists) {
              const defaultOpt = res.find((opt: any) => opt.courier === 'jne' && opt.service === 'REG') || res[0]
              setSelectedCourier(defaultOpt.courier)
              setSelectedService(defaultOpt.service)
            }
          }
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to load shipping rates')
          setIsLoadingShippingOptions(false)
        }
      })
    }
  }, [csaId, calculateCost, refreshTrigger])

  useEffect(() => {
    if (activeStep === 1 && csaId) {
      summary({ addressId: csaId, couponCode: appliedCouponCode, courier: selectedCourier, service: selectedService }, {
        onSuccess: (res) => {
          setSummaryOrder(res)
        }
      })
    }
  }, [activeStep, csaId, appliedCouponCode, selectedCourier, selectedService])

  // Auto-apply NEWUSER coupon for first-time checkout flows
  useEffect(() => {
    if (activeStep === 1 && availableCoupons && !appliedCouponCode) {
      const isEligibleForNewUser = availableCoupons.some(
        (c) => c.code === 'NEWUSER' && c.is_eligible
      )
      if (isEligibleForNewUser) {
        setAppliedCouponCode('NEWUSER')
      }
    }
  }, [activeStep, availableCoupons, appliedCouponCode])

  const handleSaveAddress = (values: TReqCustomerShipping) => {
    const payload = csaId ? { ...values, id: csaId } : { ...values }

    saveShippingAddress(payload, {
      onSuccess: (res) => {
        const id = res?.csa_id ?? csaId

        setCsaId(id)
        setShowForm(false)
        setRefreshTrigger((prev) => prev + 1) // Force refresh shipping rates after save/update
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
      summary({ addressId: csaId, couponCode: appliedCouponCode, courier: selectedCourier, service: selectedService }, {
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
      setSelectedProvinceId('')
      setSelectedCityId('')
      setShowForm(true)
      return
    }

    setCsaId(address.csa_id)
    form.setValues(address)
    setSelectedProvinceId(address.province_id || '')
    setSelectedCityId(address.city_id || '')
    setShowForm(false)
    setRefreshTrigger((prev) => prev + 1) // Force refresh shipping rates after selecting address
  }

  const handleEditAddress = (address: any) => {
    setCsaId(address.csa_id)
    form.setValues(address)
    setSelectedProvinceId(address.province_id || '')
    setSelectedCityId(address.city_id || '')
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

  if (isLoadingActiveOrder) {
    return (
      <Container my={120} style={{ position: 'relative', minHeight: '400px' }}>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'lg', blur: 5 }}
          loaderProps={{ type: 'bars' }}
        />
      </Container>
    )
  }

  const breadcrumbItems = [
    <Link key="home" href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Text size="sm" c="dimmed">Home</Text>
    </Link>,
    <Link key="cart" href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Text size="sm" c="dimmed">Cart</Text>
    </Link>,
    <Text key="current" size="sm" fw={500}>
      Checkout
    </Text>
  ]

  return (
    <Container my={120}>
      <Breadcrumbs mb="md" separatorMargin={6} styles={{ separator: { color: 'var(--mantine-color-dimmed)' } }}>
        {breadcrumbItems}
      </Breadcrumbs>
      <Stepper active={activeStep} size="sm">
        <Stepper.Step label="Shipping">
          <Card withBorder p="xl">
            <Stack gap={'xl'}>
              <Alert
                variant="light"
                color="yellow"
                title="Shipping Information"
                icon={<IconInfoCircle />}
              >
                Currently, only <strong>Regular</strong> shipping service is available. Delivery
                time and shipping costs will follow the regular service terms.
              </Alert>

              <Card withBorder p="xl">
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
                      <Button size="xs" variant="light" onClick={() => handleSelectAddress(null)}>
                        + Add New Address
                      </Button>
                    </Group>

                    <Radio.Group value={csaId ?? ''}>
                      <Stack gap="sm">
                        {shippingAddresses.map((address) => (
                          <Card
                            key={address.csa_id}
                            withBorder
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
                                    {address.district ? `${address.district}, ` : ''}{address.city}, {address.province} {address.postal_code}
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

                    {csaId && (
                      <Stack gap="sm" mt="xl" style={{ position: 'relative' }}>
                        <Divider label="Select Courier & Service" labelPosition="center" />
                        <LoadingOverlay
                          visible={isLoadingShippingOptions}
                          zIndex={1000}
                          overlayProps={{ radius: 'lg', blur: 3 }}
                        />
                        {shippingOptions && shippingOptions.length > 0 ? (
                          <Radio.Group
                            value={`${selectedCourier}|${selectedService}`}
                            onChange={(val) => {
                              if (val) {
                                const [cour, serv] = val.split('|')
                                setSelectedCourier(cour)
                                setSelectedService(serv)
                              }
                            }}
                          >
                            <Stack gap="xs" mt="xs">
                              {shippingOptions.map((opt: any, idx: number) => (
                                <Card
                                  key={idx}
                                  withBorder
                                  p="sm"
                                  style={{
                                    borderColor:
                                      selectedCourier === opt.courier && selectedService === opt.service
                                        ? 'var(--mantine-color-blue-6)'
                                        : undefined,
                                    backgroundColor:
                                      selectedCourier === opt.courier && selectedService === opt.service
                                        ? 'var(--mantine-color-blue-0)'
                                        : undefined,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    setSelectedCourier(opt.courier)
                                    setSelectedService(opt.service)
                                  }}
                                >
                                  <Group justify="space-between" wrap="nowrap">
                                    <Group gap="sm" wrap="nowrap">
                                      <Radio value={`${opt.courier}|${opt.service}`} />
                                      <Stack gap={2}>
                                        <Text fw={600} size="sm">
                                          {opt.courier_name} - {opt.service}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {opt.description} {opt.etd ? `(Estimated: ${opt.etd} days)` : ''}
                                        </Text>
                                      </Stack>
                                    </Group>
                                    <Text fw={700} size="sm" c="blue" style={{ whiteSpace: 'nowrap' }}>
                                      Rp {opt.cost.toLocaleString('id-ID')}
                                    </Text>
                                  </Group>
                                </Card>
                              ))}
                            </Stack>
                          </Radio.Group>
                        ) : (
                          <Alert title="No Shipping Rates Found" color="red">
                            No shipping services are available for the selected address. Please check if your city and province match RajaOngkir IDs.
                          </Alert>
                        )}
                      </Stack>
                    )}

                    <Group grow justify="center" mt="xl">
                      <Button variant="default" onClick={handleBackOrCancel}>
                        Back
                      </Button>

                      <Button type="submit" loading={isLoadingSummary} onClick={nextToSummaryOrder} disabled={!csaId || shippingOptions.length === 0}>
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
                      <Select
                        withAsterisk
                        label="Province"
                        placeholder="Select Province"
                        data={(provinces || []).map((p: any) => ({
                          value: p.province_id,
                          label: p.province
                        }))}
                        searchable
                        key={form.key('province_id')}
                        {...form.getInputProps('province_id')}
                        onChange={(val) => {
                          form.setFieldValue('province_id', val || '')
                          const provName = provinces?.find((p: any) => p.province_id === val)?.province || ''
                          form.setFieldValue('province', provName)
                          setSelectedProvinceId(val || '')
                          form.setFieldValue('city_id', '')
                          form.setFieldValue('city', '')
                        }}
                      />
                      <Select
                        withAsterisk
                        label="City"
                        placeholder="Select City"
                        data={(cities || []).map((c: any) => ({
                          value: c.city_id,
                          label: `${c.type} ${c.city_name}`
                        }))}
                        searchable
                        disabled={!selectedProvinceId}
                        key={form.key('city_id')}
                        {...form.getInputProps('city_id')}
                        onChange={(val) => {
                          form.setFieldValue('city_id', val || '')
                          const cityObj = cities?.find((c: any) => c.city_id === val)
                          const cityName = cityObj ? `${cityObj.type} ${cityObj.city_name}` : ''
                          form.setFieldValue('city', cityName)
                          setSelectedCityId(val || '')
                          form.setFieldValue('district_id', '')
                          form.setFieldValue('district', '')
                          if (cityObj?.postal_code) {
                            form.setFieldValue('postal_code', cityObj.postal_code)
                          }
                        }}
                      />
                      <Select
                        withAsterisk
                        label="District (Kecamatan)"
                        placeholder="Select District"
                        data={(districts || []).map((d: any) => ({
                          value: d.subdistrict_id,
                          label: d.subdistrict_name
                        }))}
                        searchable
                        disabled={!selectedCityId}
                        key={form.key('district_id')}
                        {...form.getInputProps('district_id')}
                        onChange={(val) => {
                          form.setFieldValue('district_id', val || '')
                          const distObj = districts?.find((d: any) => d.subdistrict_id === val)
                          const distName = distObj ? distObj.subdistrict_name : ''
                          form.setFieldValue('district', distName)
                        }}
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
                      <Button variant="default" size="lg" onClick={handleBackOrCancel}>
                        {hasAddress ? 'Cancel' : 'Back'}
                      </Button>

                      <Button type="submit" size="lg" loading={isLoadingSave}>
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
            setSummaryOrder={setSummaryOrder}
            appliedCouponCode={appliedCouponCode}
            setAppliedCouponCode={setAppliedCouponCode}
            summaryMutation={summary}
            prevStep={prevStep}
            nextStep={nextStep}
            courier={selectedCourier}
            service={selectedService}
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
