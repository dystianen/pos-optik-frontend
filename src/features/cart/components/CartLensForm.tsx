import { useProfile } from '@/features/auth/hooks'
import { PrescriptionPayload } from '@/features/cart/types'
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Radio,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core'
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconEye,
  IconHistory,
  IconInfoCircle,
  IconLock,
  IconPencil,
  IconSparkles
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect } from 'react'

type CartLensFormProps = {
  value: PrescriptionPayload
  onChange: (value: PrescriptionPayload) => void
  onAuthRequired?: () => void
}

export default function CartLensForm({ value, onChange, onAuthRequired }: CartLensFormProps) {
  const { data: profile, isLoading } = useProfile()
  const eyeHistory = profile?.preferences_history?.eye_history
  const isLoggedIn = !!profile?.personal_info
  const hasHistory = !!eyeHistory

  // Auto fallback if user was on 'history' but no history exists or user is not logged in
  useEffect(() => {
    if (!isLoading && value.type === 'history' && !hasHistory) {
      onChange({ type: 'none' })
    }
  }, [isLoading, hasHistory, value.type, onChange])

  const update = (patch: Partial<PrescriptionPayload>) => {
    onChange({ ...value, ...patch })
  }

  const handleSelectType = (selectedType: 'none' | 'manual' | 'history') => {
    if (selectedType === 'history') {
      if (!isLoggedIn) {
        onAuthRequired?.()
        return
      }
      if (!hasHistory) {
        return
      }

      onChange({
        type: 'history',
        right: {
          sph: eyeHistory.right_eye.sph !== undefined ? String(eyeHistory.right_eye.sph) : '',
          cyl: eyeHistory.right_eye.cyl !== undefined ? String(eyeHistory.right_eye.cyl) : '',
          axis: eyeHistory.right_eye.axs !== undefined ? String(eyeHistory.right_eye.axs) : '',
          pd: value.right?.pd || '62'
        },
        left: {
          sph: eyeHistory.left_eye.sph !== undefined ? String(eyeHistory.left_eye.sph) : '',
          cyl: eyeHistory.left_eye.cyl !== undefined ? String(eyeHistory.left_eye.cyl) : '',
          axis: eyeHistory.left_eye.axs !== undefined ? String(eyeHistory.left_eye.axs) : '',
          pd: value.left?.pd || '62'
        },
        examination_date: eyeHistory.last_check,
        diagnosis: eyeHistory.diagnosis
      })
    } else if (selectedType === 'manual') {
      onChange({
        type: 'manual',
        right: {
          sph: value.right?.sph ?? '',
          cyl: value.right?.cyl ?? '',
          axis: value.right?.axis ?? '',
          pd: value.right?.pd ?? '62',
          add: value.right?.add ?? ''
        },
        left: {
          sph: value.left?.sph ?? '',
          cyl: value.left?.cyl ?? '',
          axis: value.left?.axis ?? '',
          pd: value.left?.pd ?? '62',
          add: value.left?.add ?? ''
        }
      })
    } else {
      onChange({
        type: 'none'
      })
    }
  }

  const formatOpticValue = (val: number | string | undefined) => {
    if (val === undefined || val === null || val === '') return '-'
    const num = Number(val)
    if (isNaN(num)) return String(val)
    return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2)
  }

  const isHistoryDisabled = !isLoggedIn || !hasHistory

  return (
    <Card withBorder radius="md" padding="lg" className="border-gray-200">
      <Group justify="space-between" mb="md" align="center">
        <Group gap="xs">
          <IconEye size={20} className="text-primary" />
          <Text fw={600} fz="md" className="text-midnight_text">
            Lens Prescription
          </Text>
        </Group>
        {hasHistory && (
          <Badge variant="light" color="blue" size="sm" leftSection={<IconSparkles size={12} />}>
            Clinic Record Available
          </Badge>
        )}
      </Group>

      {/* ─── Mode Selector ─────────────────────────────── */}
      <Radio.Group
        value={value.type}
        onChange={(val) => handleSelectType(val as 'none' | 'manual' | 'history')}
      >
        <Stack gap="xs">
          {/* Option 1: Saved History */}
          <PaperRadioOption
            value="history"
            currentValue={value.type}
            disabled={isHistoryDisabled}
            onDisabledClick={() => {
              if (!isLoggedIn) {
                onAuthRequired?.()
              }
            }}
            icon={
              <IconHistory
                size={18}
                className={isHistoryDisabled ? 'text-gray-400' : 'text-blue-600'}
              />
            }
            title="Use Latest Prescription"
            description={
              !isLoggedIn
                ? 'Sign in to use your saved eye examination results'
                : !hasHistory
                ? 'No examination history recorded from our clinic yet'
                : 'Automatically use eye examination results from clinic record'
            }
            badge={
              !isLoggedIn ? (
                <Badge size="xs" color="gray" variant="light" leftSection={<IconLock size={10} />}>
                  Sign In Required
                </Badge>
              ) : !hasHistory ? (
                <Badge size="xs" color="gray" variant="light">
                  No Record
                </Badge>
              ) : (
                <Badge size="xs" color="teal" variant="light">
                  Recommended
                </Badge>
              )
            }
          />

          {/* Option 2: Manual Input */}
          <PaperRadioOption
            value="manual"
            currentValue={value.type}
            icon={<IconPencil size={18} className="text-orange-600" />}
            title="Manual Input"
            description="Enter SPH, CYL, and Axis values manually from your prescription"
          />

          {/* Option 3: None / Plano */}
          <PaperRadioOption
            value="none"
            currentValue={value.type}
            icon={<IconCheck size={18} className="text-gray-500" />}
            title="Non-Prescription / Plano (0.00)"
            description="Standard clear lenses without power (no minus, plus, or cylinder)"
          />
        </Stack>
      </Radio.Group>

      {/* ─── History Mode Content ──────────────────────── */}
      {value.type === 'history' && (
        <Box mt="md">
          {isLoading ? (
            <Stack gap="xs">
              <Skeleton h={35} />
              <Skeleton h={80} />
            </Stack>
          ) : !isLoggedIn ? (
            <Alert
              icon={<IconLock size={18} />}
              title="Sign In to Load Saved Prescription"
              color="blue"
              variant="light"
              radius="md"
            >
              <Text fz="xs" mb="xs">
                Please sign in to your account so we can load your optical examination history.
              </Text>
              {onAuthRequired && (
                <Button size="xs" variant="filled" color="blue" onClick={onAuthRequired}>
                  Sign In to Account
                </Button>
              )}
            </Alert>
          ) : !eyeHistory ? (
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="No Examination Record Found"
              color="yellow"
              variant="light"
              radius="md"
            >
              <Text fz="xs" mb="xs">
                Your account does not have an eye examination history recorded at our clinic yet. You can use <b>Manual Input</b> or visit our store for an eye check.
              </Text>
              <Button
                size="xs"
                variant="light"
                color="orange"
                onClick={() => handleSelectType('manual')}
              >
                Switch to Manual Input
              </Button>
            </Alert>
          ) : (
            <Card withBorder radius="sm" p="sm" bg="var(--mantine-color-blue-0)">
              <Stack gap="xs">
                <Group justify="space-between" align="center">
                  <Group gap={6}>
                    <IconCalendar size={15} className="text-blue-600" />
                    <Text fz="xs" fw={600} c="blue.8">
                      Exam Date: {dayjs(eyeHistory.last_check).format('DD MMM YYYY')}
                    </Text>
                  </Group>
                  <Badge size="xs" color="teal" variant="filled">
                    Verified
                  </Badge>
                </Group>

                {eyeHistory.diagnosis && (
                  <Text fz="xs" c="dimmed">
                    Diagnosis: <span className="font-medium text-gray-700">{eyeHistory.diagnosis}</span>
                  </Text>
                )}

                <Divider variant="dashed" />

                {/* Compact Prescription Table */}
                <Table
                  withTableBorder
                  withColumnBorders
                  horizontalSpacing="xs"
                  verticalSpacing="xs"
                  bg="white"
                  className="rounded overflow-hidden"
                >
                  <Table.Thead bg="var(--mantine-color-gray-1)">
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>Eye</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>SPH</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>CYL</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>AXIS</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td fw={600} c="blue.7" style={{ fontSize: '11px' }}>
                        OD (Right)
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {formatOpticValue(eyeHistory.right_eye.sph)}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {formatOpticValue(eyeHistory.right_eye.cyl)}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {eyeHistory.right_eye.axs ? `${eyeHistory.right_eye.axs}°` : '-'}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={600} c="blue.7" style={{ fontSize: '11px' }}>
                        OS (Left)
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {formatOpticValue(eyeHistory.left_eye.sph)}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {formatOpticValue(eyeHistory.left_eye.cyl)}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center', fontSize: '12px', fontWeight: 500 }}>
                        {eyeHistory.left_eye.axs ? `${eyeHistory.left_eye.axs}°` : '-'}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>

                {/* PD Input in history mode */}
                <Group gap="xs" align="center" mt={4}>
                  <Text fz="xs" fw={500} c="dimmed">
                    Pupillary Distance (PD):
                  </Text>
                  <TextInput
                    size="xs"
                    w={80}
                    placeholder="62"
                    value={value.right?.pd ?? '62'}
                    onChange={(e) => {
                      const pdVal = e.currentTarget.value
                      update({
                        right: { ...value.right, pd: pdVal },
                        left: { ...value.left, pd: pdVal }
                      })
                    }}
                  />
                  <Text fz="xs" c="dimmed">
                    mm
                  </Text>
                  <Tooltip label="Distance between the centers of the pupils in millimeters (adult average: 60-64mm)" withArrow>
                    <IconInfoCircle size={14} className="text-gray-400 cursor-pointer" />
                  </Tooltip>
                </Group>
              </Stack>
            </Card>
          )}
        </Box>
      )}

      {/* ─── Manual Mode Content ───────────────────────── */}
      {value.type === 'manual' && (
        <Stack mt="md" gap="md">
          {/* OD / Right Eye */}
          <Box p="xs" className="bg-gray-50 rounded-md border border-gray-100">
            <Group justify="space-between" mb={4}>
              <Text fw={600} fz="xs" c="blue.8">
                OD (Right Eye)
              </Text>
            </Group>
            <Group grow gap="xs">
              <TextInput
                label="SPH (-/+)"
                placeholder="-1.50"
                size="xs"
                value={value.right?.sph ?? ''}
                onChange={(e) =>
                  update({
                    right: { ...value.right, sph: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="CYL (Cylinder)"
                placeholder="-0.50"
                size="xs"
                value={value.right?.cyl ?? ''}
                onChange={(e) =>
                  update({
                    right: { ...value.right, cyl: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="AXIS (Degrees)"
                placeholder="180"
                size="xs"
                value={value.right?.axis ?? ''}
                onChange={(e) =>
                  update({
                    right: { ...value.right, axis: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="PD (mm)"
                placeholder="62"
                size="xs"
                value={value.right?.pd ?? ''}
                onChange={(e) =>
                  update({
                    right: { ...value.right, pd: e.currentTarget.value }
                  })
                }
              />
            </Group>
          </Box>

          {/* OS / Left Eye */}
          <Box p="xs" className="bg-gray-50 rounded-md border border-gray-100">
            <Group justify="space-between" mb={4}>
              <Text fw={600} fz="xs" c="blue.8">
                OS (Left Eye)
              </Text>
            </Group>
            <Group grow gap="xs">
              <TextInput
                label="SPH (-/+)"
                placeholder="-1.50"
                size="xs"
                value={value.left?.sph ?? ''}
                onChange={(e) =>
                  update({
                    left: { ...value.left, sph: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="CYL (Cylinder)"
                placeholder="-0.50"
                size="xs"
                value={value.left?.cyl ?? ''}
                onChange={(e) =>
                  update({
                    left: { ...value.left, cyl: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="AXIS (Degrees)"
                placeholder="180"
                size="xs"
                value={value.left?.axis ?? ''}
                onChange={(e) =>
                  update({
                    left: { ...value.left, axis: e.currentTarget.value }
                  })
                }
              />
              <TextInput
                label="PD (mm)"
                placeholder="62"
                size="xs"
                value={value.left?.pd ?? ''}
                onChange={(e) =>
                  update({
                    left: { ...value.left, pd: e.currentTarget.value }
                  })
                }
              />
            </Group>
          </Box>
        </Stack>
      )}

      {/* ─── None Mode Content ─────────────────────────── */}
      {value.type === 'none' && (
        <Box mt="xs" p="xs" className="bg-gray-50 rounded text-xs text-gray-500">
          💡 The ordered lenses will be standard plano (non-prescription / 0.00).
        </Box>
      )}
    </Card>
  )
}

function PaperRadioOption({
  value,
  currentValue,
  icon,
  title,
  description,
  badge,
  disabled,
  onDisabledClick
}: {
  value: string
  currentValue: string
  icon: React.ReactNode
  title: string
  description: string
  badge?: React.ReactNode
  disabled?: boolean
  onDisabledClick?: () => void
}) {
  const isSelected = currentValue === value

  return (
    <Card
      withBorder
      p="sm"
      radius="sm"
      className={`transition-all ${
        disabled
          ? 'opacity-60 bg-gray-50/70 border-gray-200 cursor-not-allowed border-dashed'
          : isSelected
          ? 'border-blue-500 bg-blue-50/30 shadow-xs cursor-pointer'
          : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
      }`}
      onClick={() => {
        if (disabled) {
          onDisabledClick?.()
          return
        }
        const input = document.getElementById(`radio-lens-${value}`) as HTMLInputElement | null
        input?.click()
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="center">
        <Group gap="sm" wrap="nowrap">
          <Radio id={`radio-lens-${value}`} value={value} size="xs" disabled={disabled} />
          <Box>{icon}</Box>
          <Box>
            <Group gap="xs">
              <Text
                fz="sm"
                fw={isSelected ? 600 : 500}
                className={disabled ? 'text-gray-500 leading-tight' : 'text-gray-900 leading-tight'}
              >
                {title}
              </Text>
              {badge}
            </Group>
            <Text fz="xs" c="dimmed" className="leading-tight mt-0.5">
              {description}
            </Text>
          </Box>
        </Group>
      </Group>
    </Card>
  )
}
