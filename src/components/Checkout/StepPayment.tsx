'use client'
import { FormValuesRefundAccount, RefundAccountForm } from '@/components/Common/RefundAccountForm'
import { useOrder } from '@/hooks/useOrder'
import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard, useLocalStorage } from '@mantine/hooks'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { useCallback, useEffect } from 'react'
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
  const clipboard = useClipboard({ timeout: 1500 })
  const [checkoutOrderRaw] = useLocalStorage({ key: 'checkout_order' })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null

  const { mutate: payment, isPending: isLoadingSubmit } = useOrder.payment()
  const { data: refundAccount, isLoading: isLoadingRefundAccount } = useOrder.refundAccount()
  const { mutate: updateRefundAccount, isPending: isLoadingUpdateRefundAccount } =
    useOrder.updateRefundAccount()

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

  console.log('🚀 ~ StepPayment ~ form:', form.errors)

  const handleSubmit = useCallback(
    (values: FormValues) => {
      console.log("🚀 ~ StepPayment ~ values:", values)
      if (!values.proof) return

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
    [checkoutOrder, payment, nextStep]
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
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image src="/images/payment.svg" h={360} fit="contain" />

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
              <Button type="submit" radius="xl" loading={isLoadingSubmit}>
                Submit Payment
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}

export default StepPayment
