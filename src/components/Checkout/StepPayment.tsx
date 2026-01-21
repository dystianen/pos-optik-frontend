'use client'
import { useOrder } from '@/hooks/useOrder'
import {
  ActionIcon,
  Box,
  Button,
  Card,
  FileInput,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Radio,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard, useDisclosure, useLocalStorage } from '@mantine/hooks'
import { IconCheck, IconClipboard, IconEdit } from '@tabler/icons-react'
import { useCallback } from 'react'
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
  const [opened, { open, close }] = useDisclosure(false)

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

  const formUpdate = useForm<FormValuesUpdate>({
    initialValues: {
      account_name: '',
      bank_name: '',
      account_number: ''
    },
    validate: {
      account_name: (v) => (!v ? 'Account name is required' : null),
      bank_name: (v) => (!v ? 'Bank is required' : null),
      account_number: (v) => (!v ? 'Account number is required' : null)
    }
  })

  const handleSubmit = useCallback(
    (values: FormValues) => {
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
      formData.append('bank_name', values.bank_name.toUpperCase())
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

  const handleEditRefundAccount = useCallback((values: FormValuesUpdate) => {
    updateRefundAccount(values, {
      onSuccess: () => {
        toast.success('Update refund account successfully')
        close()
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Update refund account failed')
      }
    })
  }, [])

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
                {refundAccount ? (
                  <>
                    <Box>
                      <Text fw={600}>Refund Information</Text>
                      <Text size="sm" c="dimmed">
                        Used only if the order is cancelled!
                      </Text>
                    </Box>
                    <Card
                      key={refundAccount.user_refund_account_id}
                      withBorder
                      radius="md"
                      p="md"
                      style={{
                        borderColor: 'var(--mantine-color-blue-6)',
                        backgroundColor: 'var(--mantine-color-blue-0)'
                      }}
                    >
                      <Group align="center" justify="space-between" wrap="nowrap">
                        {/* LEFT */}
                        <Group align="flex-start">
                          <Radio checked mt={5} />

                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text fw={600}>Account Name: {refundAccount.account_name}</Text>
                            <Text size="sm" c="dimmed">
                              Bank Name: {refundAccount.bank_name}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Account Number: {refundAccount.account_number}
                            </Text>
                          </Stack>
                        </Group>

                        {/* RIGHT */}
                        <Box>
                          <Button
                            variant="subtle"
                            onClick={(e) => {
                              e.stopPropagation()
                              formUpdate.setValues(refundAccount)
                              open()
                            }}
                          >
                            <IconEdit size={28} />
                          </Button>
                        </Box>
                      </Group>
                    </Card>

                    <Modal centered opened={opened} onClose={close} title="Update Refund Account">
                      <Stack>
                        <TextInput
                          label="Account Holder Name"
                          placeholder="John Doe"
                          {...formUpdate.getInputProps('account_name')}
                        />

                        <TextInput
                          label="Bank"
                          placeholder="BCA"
                          {...formUpdate.getInputProps('bank_name')}
                        />

                        <TextInput
                          label="Account Number"
                          placeholder="1234567890"
                          {...formUpdate.getInputProps('account_number')}
                        />

                        <Group grow>
                          <Button type="submit" color="red" radius="xl" onClick={close}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => formUpdate.onSubmit(handleEditRefundAccount)()}
                            loading={isLoadingUpdateRefundAccount}
                            radius="xl"
                          >
                            Submit
                          </Button>
                        </Group>
                      </Stack>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Box>
                      <Text fw={600}>Refund Information</Text>
                      <Text size="sm" c="dimmed">
                        Used only if the order is cancelled, only input once!
                      </Text>
                    </Box>

                    <TextInput
                      label="Account Holder Name"
                      placeholder="John Doe"
                      {...form.getInputProps('account_name')}
                    />

                    <TextInput
                      label="Bank"
                      placeholder="BCA"
                      {...form.getInputProps('bank_name')}
                    />

                    <TextInput
                      label="Account Number"
                      placeholder="1234567890"
                      {...form.getInputProps('account_number')}
                    />
                  </>
                )}
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
