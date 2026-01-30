'use client'

import { FormValuesRefundAccount, RefundAccountForm } from '@/components/Common/RefundAccountForm'
import { Order, RefundAccount, RefundRequest, RefundType } from '@/types/order'
import { formatCurrency } from '@/utils/format'
import {
  Button,
  Card,
  Checkbox,
  Divider,
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
  onSubmit: (payload: RefundRequest) => Promise<void> | void
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

    const payload: RefundRequest = {
      order_id: order.order_id,
      refund_type: refundType,
      refund_amount: finalRefundAmount,
      reason,
      user_refund_account_id: refundAccounts.user_refund_account_id,
      selected_items: refundType === 'partial' ? Array.from(selectedItems) : undefined
    }

    try {
      setLoading(true)
      await onSubmit(payload)
      onClose()
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
          <Card shadow="sm" padding="md" radius="md" withBorder>
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
                  <Card key={item.order_item_id} padding="md" radius="md" withBorder>
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
          <Card shadow="sm" padding="md" radius="md" withBorder bg="blue.0">
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
          <Button variant="default" radius="xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="blue"
            radius="xl"
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
