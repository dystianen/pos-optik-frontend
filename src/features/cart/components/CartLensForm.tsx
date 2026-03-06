import { PrescriptionPayload } from '@/features/cart/types'
import { Card, Group, Radio, Stack, Text, TextInput } from '@mantine/core'

type PrescriptionType = 'none' | 'manual'

type CartLensFormProps = {
  value: PrescriptionPayload
  onChange: (value: PrescriptionPayload) => void
}

export default function CartLensForm({ value, onChange }: CartLensFormProps) {
  const update = (patch: Partial<PrescriptionPayload>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <Card withBorder padding="lg">
      <Text fw={600} fz="lg" mb="sm">
        Prescription
      </Text>

      <Radio.Group
        value={value.type}
        onChange={(type) => {
          console.log({ type })
          update({
            type: type as PrescriptionType,
            ...(type === 'none' ? {} : {})
          })
        }}
      >
        <Group mt="xs">
          <Radio value="none" label="Without Prescription" />
          <Radio value="manual" label="Manual Input" />
        </Group>
      </Radio.Group>

      {value.type === 'manual' && (
        <Stack mt="lg" gap="sm">
          <Text fw={600}>OD (Right Eye)</Text>
          <Group grow>
            <TextInput
              placeholder="SPH"
              value={value.right?.sph ?? ''}
              onChange={(e) =>
                update({
                  right: {
                    ...value.right,
                    sph: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="CYL"
              value={value.right?.cyl ?? ''}
              onChange={(e) =>
                update({
                  right: {
                    ...value.right,
                    cyl: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="Axis"
              value={value.right?.axis ?? ''}
              onChange={(e) =>
                update({
                  right: {
                    ...value.right,
                    axis: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="PD"
              value={value.right?.pd ?? ''}
              onChange={(e) =>
                update({
                  right: {
                    ...value.right,
                    pd: e.currentTarget.value
                  }
                })
              }
            />
          </Group>

          <Text fw={600}>OS (Left Eye)</Text>
          <Group grow>
            <TextInput
              placeholder="SPH"
              value={value.left?.sph ?? ''}
              onChange={(e) =>
                update({
                  left: {
                    ...value.left,
                    sph: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="CYL"
              value={value.left?.cyl ?? ''}
              onChange={(e) =>
                update({
                  left: {
                    ...value.left,
                    cyl: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="Axis"
              value={value.left?.axis ?? ''}
              onChange={(e) =>
                update({
                  left: {
                    ...value.left,
                    axis: e.currentTarget.value
                  }
                })
              }
            />
            <TextInput
              placeholder="PD"
              value={value.left?.pd ?? ''}
              onChange={(e) =>
                update({
                  left: {
                    ...value.left,
                    pd: e.currentTarget.value
                  }
                })
              }
            />
          </Group>
        </Stack>
      )}
    </Card>
  )
}
