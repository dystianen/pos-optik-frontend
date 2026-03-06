'use client'

import { FormValuesRefundAccount, RefundAccountForm } from '@/components/ui/RefundAccountForm'
import { Order, RefundAccount, RefundType } from '@/features/order/types'
import { formatCurrency } from '@/utils/format'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  FileInput,
  Group,
  Image,
  Modal,
  Radio,
  Select,
  Stack,
  Text,
  Textarea
} from '@mantine/core'
import { useMemo, useState } from 'react'

type RefundModalProps = {
  opened: boolean
  onClose: () => void
  order: Order
  refundAccounts: RefundAccount
  onSubmit: (payload: FormData) => Promise<void> | void
  isLoadingUpdate?: boolean
  onUpdateRefundAccount?: (values: FormValuesRefundAccount) => void
}

const REFUND_REASONS = [
  { value: 'Defective product', label: 'Defective product' },
  { value: 'Wrong product received', label: 'Wrong product received' },
  { value: 'Product not as described', label: 'Product not as described' },
  { value: 'Changed my mind', label: 'Changed my mind' },
  { value: 'Better price elsewhere', label: 'Better price elsewhere' },
  { value: 'Other reason', label: 'Other reason' }
]

export function RefundModal({
  opened,
  onClose,
  order,
  refundAccounts,
  onSubmit,
  isLoadingUpdate = false,
  onUpdateRefundAccount
}: RefundModalProps) {
  const [refundType, setRefundType] = useState<RefundType>('full')
  const [reason, setReason] = useState<string | null>(null)
  const [refundNote, setRefundNote] = useState('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [evidence, setEvidence] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Calculate max refund amount based on refund type
  const maxRefundAmount = useMemo(() => {
    if (refundType === 'full') {
      return order.summary.grand_total
    } else {
      // For partial refund, calculate based on selected items
      if (selectedItems.size === 0) return 0
      return order.items
        .filter((item) => selectedItems.has(item.order_item_id))
        .reduce((sum, item) => sum + item.subtotal, 0)
    }
  }, [refundType, selectedItems, order])

  const handleToggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.size === order.items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(order.items.map((item) => item.order_item_id)))
    }
  }

  const handleSubmit = async () => {
    if (!reason) return

    const finalRefundAmount = refundType === 'full' ? order.summary.grand_total : maxRefundAmount

    const formData = new FormData()
    formData.append('order_id', order.order_id)
    formData.append('refund_type', refundType)
    formData.append('refund_amount', finalRefundAmount.toString())
    formData.append('reason', reason)
    formData.append('additional_note', refundNote)
    formData.append('user_refund_account_id', refundAccounts.user_refund_account_id)

    if (evidence) {
      formData.append('evidence', evidence)
    }

    if (refundType === 'partial') {
      Array.from(selectedItems).forEach((item) => {
        formData.append('selected_items[]', item)
      })
    }

    try {
      setLoading(true)
      await onSubmit(formData)
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRefundType('full')
    setReason(null)
    setRefundNote('')
    setSelectedItems(new Set())
    setEvidence(null)
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Request Refund" centered size="lg">
      <Stack gap="md">
        {/* Refund Type Selection */}
        <div>
          <Text fw={600} mb="xs">
            Refund Type
          </Text>
          <Radio.Group value={refundType} onChange={(value) => setRefundType(value as RefundType)}>
            <Stack gap="xs">
              <Radio
                value="full"
                label="Full Refund"
                description="Refund the entire order amount"
              />
              <Radio
                value="partial"
                label="Partial Refund"
                description="Refund specific items only"
              />
            </Stack>
          </Radio.Group>
        </div>

        {/* Partial Refund - Item Selection */}
        {refundType === 'partial' && (
          <Card shadow="sm" padding="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Select Items to Refund</Text>
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={handleSelectAll}
                  color={selectedItems.size === order.items.length ? 'red' : 'blue'}
                >
                  {selectedItems.size === order.items.length ? 'Deselect All' : 'Select All'}
                </Button>
              </Group>
              <Divider />

              <Stack gap="md">
                {order.items.map((item) => (
                  <Card key={item.order_item_id} padding="md" withBorder>
                    <Group gap="md" align="start">
                      <Checkbox
                        checked={selectedItems.has(item.order_item_id)}
                        onChange={() => handleToggleItem(item.order_item_id)}
                      />
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        w={60}
                        h={60}
                        radius="md"
                        fit="cover"
                      />
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {item.product_name}
                        </Text>
                        {item.variant_name && (
                          <Text size="xs" c="dimmed">
                            {item.variant_name}
                          </Text>
                        )}
                        <Group gap="xs">
                          <Text size="sm">{formatCurrency(item.price)}</Text>
                          <Text size="sm" c="dimmed">
                            × {item.quantity}
                          </Text>
                        </Group>
                      </Stack>
                      <Text size="sm" fw={600}>
                        {formatCurrency(item.subtotal)}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>

              <Divider />
              <Group justify="space-between">
                <Text fw={600}>Refund Amount for Selected Items:</Text>
                <Text fw={600} c="primary">
                  {formatCurrency(maxRefundAmount)}
                </Text>
              </Group>
            </Stack>
          </Card>
        )}

        {/* Full Refund - Summary */}
        {refundType === 'full' && (
          <Card
            withBorder
            p="md"
            style={{
              borderColor: 'var(--mantine-color-primary-6)',
              backgroundColor: 'var(--mantine-color-primary-0)'
            }}
          >
            <Group justify="space-between">
              <Text fw={500}>Total Refund Amount:</Text>
              <Text fw={700} size="lg" c="primary">
                {formatCurrency(order.summary.grand_total)}
              </Text>
            </Group>
          </Card>
        )}

        <Divider />

        {/* Refund Reason */}
        <Select
          label="Refund Reason"
          placeholder="Select a reason"
          data={REFUND_REASONS}
          value={reason}
          onChange={setReason}
          required
          searchable
        />

        {/* Evidence Upload */}
        <FileInput
          label="Evidence (Optional)"
          placeholder="Upload photo/video evidence"
          description="Max size 5MB"
          clearable
          value={evidence}
          onChange={setEvidence}
          accept="image/*,video/*"
        />

        {/* Additional Note */}
        <Textarea
          label="Additional Information"
          placeholder="Provide details about your refund request (minimum 10 characters)"
          minRows={3}
          value={refundNote}
          onChange={(e) => setRefundNote(e.currentTarget.value)}
          required
        />

        {/* Refund Account Display */}
        <RefundAccountForm
          refundAccount={refundAccounts}
          isLoadingFetch={false}
          isLoadingUpdate={isLoadingUpdate}
          onUpdate={onUpdateRefundAccount || (() => {})}
          subtitle="Bank account for refund"
        />

        <Divider />

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={handleSubmit}
            loading={loading}
            disabled={
              !reason ||
              (refundType === 'partial' && selectedItems.size === 0) ||
              !refundNote ||
              refundNote.length < 10
            }
          >
            Submit Refund Request
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
