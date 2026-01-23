import { CancelOrder } from '@/types/order'
import { Button, Group, Modal, Select, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'

type CancelOrderModalProps = {
  opened: boolean
  onClose: () => void
  orderId: string
  onSubmit: (payload: CancelOrder) => Promise<void> | void
}

const CANCEL_REASONS = [
  { value: 'Changed my mind', label: 'Changed my mind' },
  { value: 'Wrong order', label: 'Wrong order' },
  { value: 'Pricing issue', label: 'Pricing issue' },
  { value: 'Payment issue', label: 'Payment issue' },
  { value: 'Other reason', label: 'Other reason' }
]

export function CancelOrderModal({ opened, onClose, orderId, onSubmit }: CancelOrderModalProps) {
  const [reason, setReason] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reason) return

    try {
      setLoading(true)
      await onSubmit({
        order_id: orderId,
        reason,
        additional_note: note
      })
      onClose()
      setReason(null)
      setNote('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Cancel Order Request" centered>
      <Stack>
        <Select
          label="Cancellation reason"
          placeholder="Select a reason"
          data={CANCEL_REASONS}
          value={reason}
          onChange={setReason}
          required
        />

        <Textarea
          label="Additional note (optional)"
          placeholder="Provide more details if needed"
          minRows={3}
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" radius="xl" onClick={onClose}>
            Close
          </Button>
          <Button
            color="red"
            radius="xl"
            onClick={handleSubmit}
            loading={loading}
            disabled={!reason}
          >
            Submit Request
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
