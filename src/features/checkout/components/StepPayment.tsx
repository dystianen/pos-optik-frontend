'use client'
import { FormValuesRefundAccount, RefundAccountForm } from '@/components/ui/RefundAccountForm'
import { PaymentCountdown, getRemainingSeconds, DEADLINE_HOURS } from '@/features/order/components/PaymentCountdown'
import { usePayment, useRefundAccount, useUpdateRefundAccount } from '@/features/order/hooks'
import { formatCurrency } from '@/utils/format'
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  FileInput,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Tooltip,
  Modal,
  ThemeIcon
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard, useLocalStorage } from '@mantine/hooks'
import { IconAlertCircle, IconAlertTriangle, IconCheck, IconClipboard } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type FormValues = {
  proof: File | null
  account_name: string
  bank_name: string
  account_number: string
}

export type FormValuesUpdate = {
  account_name: string
  bank_name: string
  account_number: string
}

const StepPayment = ({ nextStep }: { nextStep: () => void }) => {
  const router = useRouter()
  const clipboard = useClipboard({ timeout: 1500 })
  const [checkoutOrderRaw, , removeCheckoutOrder] = useLocalStorage<string | null>({
    key: 'checkout_order',
    defaultValue: null
  })
  const [, setStep] = useLocalStorage({
    key: 'step',
    defaultValue: 0
  })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null
  const [isExpired, setIsExpired] = useState(() => {
    if (checkoutOrder?.created_at) {
      return getRemainingSeconds(checkoutOrder.created_at, DEADLINE_HOURS) === 0
    }
    return false
  })

  const { mutate: payment, isPending: isLoadingSubmit } = usePayment()
  const { data: refundAccount, isLoading: isLoadingRefundAccount } = useRefundAccount()
  const { mutate: updateRefundAccount, isPending: isLoadingUpdateRefundAccount } =
    useUpdateRefundAccount()

  const form = useForm<FormValues>({
    initialValues: {
      proof: null,
      account_name: '',
      bank_name: '',
      account_number: ''
    },

    validate: (values) => {
      const errors: Record<string, string | null> = {}

      // proof SELALU wajib
      if (!values.proof) {
        errors.proof = 'Payment proof is required'
      }

      // refund account BELUM ADA → wajib isi
      if (!refundAccount) {
        if (!values.account_name) {
          errors.account_name = 'Account name is required'
        }
        if (!values.bank_name) {
          errors.bank_name = 'Bank is required'
        }
        if (!values.account_number) {
          errors.account_number = 'Account number is required'
        }
      }

      return errors
    }
  })

  // Sync refundAccount to form if it exists
  useEffect(() => {
    if (refundAccount) {
      form.setValues({
        account_name: refundAccount.account_name,
        bank_name: refundAccount.bank_name,
        account_number: refundAccount.account_number
      })
    }
  }, [refundAccount])


  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (!values.proof) return

      if (isExpired) {
        toast.error('Payment time has expired. This order has been automatically cancelled.')
        return
      }

      if (!checkoutOrder) {
        toast.error('Order expired, please checkout again')
        return
      }

      const { order_id, grand_total } = checkoutOrder

      const formData = new FormData()
      formData.append('order_id', order_id)
      formData.append('payment_method_id', 'e2914263-7e0f-4e3c-9425-0958c9581215') // MANUAL TRANSFER
      formData.append('amount', String(grand_total))
      formData.append('proof', values.proof)
      formData.append('account_name', values.account_name)
      formData.append('bank_name', (values.bank_name || '').toUpperCase())
      formData.append('account_number', values.account_number)

      payment(formData, {
        onSuccess: () => {
          toast.success('Payment submitted')
          nextStep()
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Upload failed')
        }
      })
    },
    [checkoutOrder, payment, nextStep, isExpired]
  )

  const handleEditRefundAccount = useCallback(
    (values: FormValuesRefundAccount) => {
      updateRefundAccount(values, {
        onSuccess: () => {
          toast.success('Update refund account successfully')
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Update refund account failed')
        }
      })
    },
    [updateRefundAccount]
  )

  const accountNumber = '0901952680'
  const bankLabel = 'BCA'

  return (
    <>
      <Modal
        opened={isExpired}
        onClose={() => {}}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        radius="lg"
        size="md"
        padding="xl"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 8,
        }}
      >
        <Stack align="center" gap="lg" py="md">
          <ThemeIcon color="red" size={60} radius="xl" variant="light">
            <IconAlertTriangle size={36} />
          </ThemeIcon>

          <Stack gap="xs" align="center">
            <Text fw={700} size="xl" ta="center" c="red.8">
              Payment Time Expired
            </Text>
            <Text size="sm" c="dimmed" ta="center" px="md" style={{ lineHeight: 1.5 }}>
              The time limit to complete your payment has passed. Unfortunately, this order has been automatically cancelled.
            </Text>
          </Stack>

          <Button
            color="red"
            size="md"
            radius="md"
            fullWidth
            onClick={() => {
              setStep(0)
              removeCheckoutOrder()
              router.push('/cart')
            }}
            mt="md"
          >
            Back to Cart
          </Button>
        </Stack>
      </Modal>

      <Card shadow="md" p="xl">
        <Stack align="center" gap="lg">
          {/* Payment Countdown */}
          {checkoutOrder?.order_id && checkoutOrder?.created_at && !isExpired && (
            <PaymentCountdown
              orderId={checkoutOrder.order_id}
              createdAt={checkoutOrder.created_at}
              onExpired={() => {
                setIsExpired(true)
                toast.error('Payment time has expired. This order has been automatically cancelled.')
              }}
            />
          )}

          {isExpired && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              title="Payment Cannot Be Continued"
              w="100%"
            >
              The order has expired. Please place a new order.
            </Alert>
          )}

        <Image src="/images/payment.svg" h={360} fit="contain" />

        {checkoutOrder?.grand_total !== undefined && (
          <Card withBorder p="md" radius="md" style={{ width: '100%', borderLeftWidth: 4, borderLeftColor: 'var(--mantine-color-blue-6)' }}>
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Amount to Pay:
              </Text>
              <Group gap="xs" align="baseline">
                <Text size="xl" fw={800} c="blue.6">
                  {formatCurrency(checkoutOrder.grand_total)}
                </Text>
                <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy Amount'}>
                  <ActionIcon
                    variant="light"
                    size="sm"
                    color={clipboard.copied ? 'teal' : 'blue'}
                    onClick={() => clipboard.copy(String(checkoutOrder.grand_total))}
                  >
                    {clipboard.copied ? <IconCheck size={14} /> : <IconClipboard size={14} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Stack>
          </Card>
        )}

        <Group gap="xs">
          <Text fw={500} size="lg">
            {bankLabel}: {accountNumber}
          </Text>
          <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy'}>
            <ActionIcon
              variant="light"
              color={clipboard.copied ? 'teal' : 'blue'}
              onClick={() => clipboard.copy(accountNumber)}
            >
              {clipboard.copied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack>
            <Card>
              <FileInput
                label="Upload Proof of Payment"
                placeholder="Select image"
                accept="image/png,image/jpeg,image/webp"
                radius="md"
                disabled={isExpired}
                {...form.getInputProps('proof')}
              />
            </Card>

            <Card>
              <LoadingOverlay
                visible={isLoadingRefundAccount}
                zIndex={1000}
                overlayProps={{ radius: 'lg', blur: 5 }}
                loaderProps={{ type: 'bars' }}
              />

              <Stack gap="sm">
                <RefundAccountForm
                  refundAccount={refundAccount}
                  isLoadingFetch={isLoadingRefundAccount}
                  isLoadingUpdate={isLoadingUpdateRefundAccount}
                  onUpdate={handleEditRefundAccount}
                  parentForm={form}
                  subtitle="Used only if the order is cancelled, only input once!"
                />
              </Stack>
            </Card>

            <Group>
              <Button type="submit" loading={isLoadingSubmit} disabled={isExpired}>
                Submit Payment
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Card>
  </>
  )
}

export default StepPayment
