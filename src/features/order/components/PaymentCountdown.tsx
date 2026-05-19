'use client'

import { useExpireOrder } from '@/features/order/hooks'
import { Alert, Badge, Group, Progress, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconAlertTriangle, IconClock, IconX } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

interface PaymentCountdownProps {
  orderId: string
  /** ISO date string from server API (e.g. "2024-05-19 10:00:00")
   *  OR unix timestamp in ms from localStorage (e.g. Date.now()) */
  createdAt: string | number
  deadlineHours?: number
  onExpired?: () => void
}

const DEADLINE_HOURS = 12

function getRemainingSeconds(createdAt: string | number, deadlineHours: number): number {
  let createdMs: number
  if (typeof createdAt === 'number') {
    createdMs = createdAt
  } else {
    // Handle both "2024-05-19 10:00:00" and "2024-05-19T10:00:00" formats
    createdMs = new Date(createdAt.replace(' ', 'T')).getTime()
  }
  const deadlineMs = createdMs + deadlineHours * 60 * 60 * 1000
  const remaining = Math.floor((deadlineMs - Date.now()) / 1000)
  return Math.max(0, remaining)
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

export function PaymentCountdown({
  orderId,
  createdAt,
  deadlineHours = DEADLINE_HOURS,
  onExpired
}: PaymentCountdownProps) {
  const { mutate: expireOrder, isPending: isExpiring } = useExpireOrder()
  const hasExpiredRef = useRef(false)
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(createdAt, deadlineHours))

  const totalSeconds = deadlineHours * 3600
  const progressValue = ((totalSeconds - remaining) / totalSeconds) * 100
  const time = formatTime(remaining)
  const isExpired = remaining === 0
  const isUrgent = remaining <= 3600 && remaining > 0 // less than 1 hour

  useEffect(() => {
    // Immediately recalculate in case of SSR mismatch
    setRemaining(getRemainingSeconds(createdAt, deadlineHours))

    const interval = setInterval(() => {
      const secs = getRemainingSeconds(createdAt, deadlineHours)
      setRemaining(secs)

      if (secs === 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        clearInterval(interval)
        expireOrder(orderId, {
          onSuccess: () => {
            onExpired?.()
          }
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [createdAt, deadlineHours, orderId, expireOrder, onExpired])

  if (isExpired) {
    return (
      <Alert
        icon={<IconX size={16} />}
        color="red"
        variant="light"
        title="Payment Deadline Expired"
      >
        <Text size="sm">Waktu pembayaran telah habis. Pesanan ini telah otomatis dibatalkan.</Text>
      </Alert>
    )
  }

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon color={isUrgent ? 'orange' : 'blue'} variant="light" size="sm">
          <IconClock size={14} />
        </ThemeIcon>
        <Text size="sm" fw={600} c={isUrgent ? 'orange' : 'dimmed'}>
          Batas Waktu Pembayaran
        </Text>
        {isUrgent && (
          <Badge color="orange" variant="light" size="xs">
            Segera!
          </Badge>
        )}
      </Group>

      {/* Countdown digits */}
      <Group gap="xs" justify="center">
        <Stack gap={2} align="center">
          <Text
            size="xl"
            fw={700}
            ff="monospace"
            c={isUrgent ? 'orange.6' : 'blue.6'}
            style={{ lineHeight: 1 }}
          >
            {time.hours}
          </Text>
          <Text size="xs" c="dimmed">
            Jam
          </Text>
        </Stack>
        <Text size="xl" fw={700} c="dimmed" style={{ lineHeight: 1 }}>
          :
        </Text>
        <Stack gap={2} align="center">
          <Text
            size="xl"
            fw={700}
            ff="monospace"
            c={isUrgent ? 'orange.6' : 'blue.6'}
            style={{ lineHeight: 1 }}
          >
            {time.minutes}
          </Text>
          <Text size="xs" c="dimmed">
            Menit
          </Text>
        </Stack>
        <Text size="xl" fw={700} c="dimmed" style={{ lineHeight: 1 }}>
          :
        </Text>
        <Stack gap={2} align="center">
          <Text
            size="xl"
            fw={700}
            ff="monospace"
            c={isUrgent ? 'orange.6' : 'blue.6'}
            style={{ lineHeight: 1 }}
          >
            {time.seconds}
          </Text>
          <Text size="xs" c="dimmed">
            Detik
          </Text>
        </Stack>
      </Group>

      {/* Progress bar - shows how much time has elapsed */}
      <Progress
        value={progressValue}
        color={isUrgent ? 'orange' : 'blue'}
        size="xs"
        radius="xl"
        animated={isUrgent}
      />

      {isUrgent && (
        <Group gap="xs">
          <IconAlertTriangle size={14} color="orange" />
          <Text size="xs" c="orange">
            Segera lakukan pembayaran sebelum waktu habis
          </Text>
        </Group>
      )}

      <Text size="xs" c="dimmed" ta="center">
        Pesanan akan otomatis dibatalkan jika pembayaran tidak diterima dalam {deadlineHours} jam
        sejak order dibuat
      </Text>

      {isExpiring && (
        <Text size="xs" c="dimmed" ta="center">
          Memproses expiry...
        </Text>
      )}
    </Stack>
  )
}
