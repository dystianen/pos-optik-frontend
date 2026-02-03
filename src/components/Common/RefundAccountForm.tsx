'use client'

import { RefundAccount } from '@/types/order'
import { Box, Button, Card, Group, Modal, Radio, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit } from '@tabler/icons-react'

export type FormValuesRefundAccount = {
  account_name: string
  bank_name: string
  account_number: string
}

type RefundAccountFormProps = {
  refundAccount: RefundAccount | undefined
  isLoadingFetch: boolean
  isLoadingUpdate: boolean
  onUpdate: (values: FormValuesRefundAccount) => void
  subtitle?: string
  parentForm?: any
}

export function RefundAccountForm({
  refundAccount,
  isLoadingFetch,
  isLoadingUpdate,
  onUpdate,
  subtitle = 'Used only if the order is cancelled!',
  parentForm
}: RefundAccountFormProps) {
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm<FormValuesRefundAccount>({
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

  const handleEditClick = () => {
    if (refundAccount) {
      form.setValues({
        account_name: refundAccount.account_name,
        bank_name: refundAccount.bank_name,
        account_number: refundAccount.account_number
      })
    }
    open()
  }

  const handleSubmit = (values: FormValuesRefundAccount) => {
    onUpdate(values)
    close()
  }

  return (
    <>
      <Box>
        <Text fw={600}>Refund Information</Text>
        <Text size="sm" c="dimmed">
          {subtitle}
        </Text>
      </Box>

      {refundAccount ? (
        <Card
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
              <Button variant="subtle" onClick={handleEditClick}>
                <IconEdit size={28} />
              </Button>
            </Box>
          </Group>
        </Card>
      ) : (
        <Stack gap="sm">
          <TextInput
            label="Account Holder Name"
            placeholder="John Doe"
            {...(parentForm || form).getInputProps('account_name')}
          />

          <TextInput
            label="Bank"
            placeholder="BCA"
            {...(parentForm || form).getInputProps('bank_name')}
          />

          <TextInput
            label="Account Number"
            placeholder="1234567890"
            {...(parentForm || form).getInputProps('account_number')}
          />
        </Stack>
      )}

      <Modal centered opened={opened} onClose={close} title="Update Refund Account">
        <Stack>
          <TextInput
            label="Account Holder Name"
            placeholder="John Doe"
            {...form.getInputProps('account_name')}
          />

          <TextInput label="Bank" placeholder="BCA" {...form.getInputProps('bank_name')} />

          <TextInput
            label="Account Number"
            placeholder="1234567890"
            {...form.getInputProps('account_number')}
          />

          <Group grow>
            <Button type="submit" color="red" radius="xl" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={isLoadingUpdate}
              radius="xl"
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
