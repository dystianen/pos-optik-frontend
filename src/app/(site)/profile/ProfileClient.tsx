'use client'

import { useLogout, useProfile } from '@/features/auth/hooks'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip
} from '@mantine/core'
import {
  IconCalendar,
  IconEye,
  IconGenderFemale,
  IconGenderMale,
  IconLogout,
  IconMail,
  IconPhone,
  IconTable,
  IconUser
} from '@tabler/icons-react'
import dayjs from 'dayjs'

const ProfileClient = () => {
  const { data: profile, isLoading } = useProfile()
  const { logout } = useLogout()

  const personal = profile?.personal_info
  const eyeHistory = profile?.preferences_history?.eye_history

  const getGenderIcon = (gender: string) => {
    if (gender?.toLowerCase() === 'male') return <IconGenderMale size={18} />
    if (gender?.toLowerCase() === 'female') return <IconGenderFemale size={18} />
    return <IconUser size={18} />
  }

  if (isLoading) {
    return (
      <Container size="md" mt={{ base: 70, md: 100 }} py="xl">
        <Stack gap="xl">
          <Skeleton h={150} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Skeleton h={300} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Skeleton h={300} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="md" mt={{ base: 70, md: 100 }} py="xl">
      <Stack gap="xl">
        {/* Header / Banner Card */}
        <Paper
          withBorder
          p="xl"
          className="bg-gradient-to-r from-primary/5 to-primary/10 relative overflow-hidden"
        >
          <Group justify="space-between" align="flex-start">
            <Group gap="xl">
              <Avatar
                size={120}
                radius={120}
                src={null}
                color="primary"
                variant="filled"
                className="border-4 border-white shadow-lg"
              >
                {personal?.customer_name?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack gap={5}>
                <Text fz={32} fw={700} className="text-midnight_text">
                  {personal?.customer_name}
                </Text>
                <Group gap="xs">
                  <Badge color="primary" variant="light">
                    Customer
                  </Badge>
                  <Text fz="sm" c="dimmed">
                    Member since {dayjs(personal?.created_at).format('MMMM YYYY')}
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Tooltip label="Logout">
              <ActionIcon
                variant="light"
                color="red"
                size="xl"
                onClick={logout}
                className="hover:scale-110 transition-transform"
              >
                <IconLogout size={24} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Paper>

        <Grid gutter="xl">
          {/* Contact Info */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Text fw={600} fz="lg">
                Personal Information
              </Text>
              <Card withBorder p="md">
                <Stack gap="lg">
                  <Group wrap="nowrap">
                    <ThemeIcon color="blue" />
                    <Stack gap={1}>
                      <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
                        Email Address
                      </Text>
                      <Text fz="sm" fw={500}>
                        {personal?.customer_email}
                      </Text>
                    </Stack>
                  </Group>

                  <Group wrap="nowrap">
                    <ThemeIcon color="green" icon={<IconPhone size={18} />} />
                    <Stack gap={1}>
                      <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
                        Phone Number
                      </Text>
                      <Text fz="sm" fw={500}>
                        {personal?.customer_phone}
                      </Text>
                    </Stack>
                  </Group>

                  <Group wrap="nowrap">
                    <ThemeIcon color="violet" icon={<IconCalendar size={18} />} />
                    <Stack gap={1}>
                      <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
                        Birth Date
                      </Text>
                      <Text fz="sm" fw={500}>
                        {dayjs(personal?.customer_dob).format('DD MMMM YYYY')}
                      </Text>
                    </Stack>
                  </Group>

                  <Group wrap="nowrap">
                    <ThemeIcon
                      color="orange"
                      icon={getGenderIcon(personal?.customer_gender || '')}
                    />
                    <Stack gap={1}>
                      <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
                        Gender
                      </Text>
                      <Text fz="sm" fw={500} className="capitalize">
                        {personal?.customer_gender}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Eye History Info */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Text fw={600} fz="lg">
                Last Eye Examination
              </Text>
              <Card withBorder p="xl">
                {eyeHistory ? (
                  <Stack gap="xl">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon color="red" icon={<IconEye size={20} />} />
                        <Stack gap={0}>
                          <Text fw={600}>{eyeHistory.diagnosis}</Text>
                          <Text fz="xs" c="dimmed">
                            Last Check: {dayjs(eyeHistory.last_check).format('DD MMM YYYY, HH:mm')}
                          </Text>
                        </Stack>
                      </Group>
                      <Badge variant="light" color="red">
                        Prescription
                      </Badge>
                    </Group>

                    <Divider variant="dashed" label="Prescription Details" labelPosition="center" />

                    <Table withTableBorder withColumnBorders variant="simple">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Eye</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>SPH</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>CYL</Table.Th>
                          <Table.Th style={{ textAlign: 'center' }}>AXS</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td fw={500}>Left (L)</Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.left_eye.sph}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.left_eye.cyl}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.left_eye.axs}
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td fw={500}>Right (R)</Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.right_eye.sph}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.right_eye.cyl}
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'center' }}>
                            {eyeHistory.right_eye.axs}
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>

                    <Text fz="xs" c="dimmed" ta="center">
                      * This prescription is recorded from your last visit to our clinic.
                    </Text>
                  </Stack>
                ) : (
                  <Stack align="center" py="xl" gap="sm">
                    <IconTable size={48} color="gray" opacity={0.3} />
                    <Text c="dimmed" fz="sm">
                      No eye examination history found.
                    </Text>
                    <Button variant="light" size="compact-xs">
                      Book an Appointment
                    </Button>
                  </Stack>
                )}
              </Card>

              <Button
                variant="light"
                color="red"
                fullWidth
                leftSection={<IconLogout size={18} />}
                mt="md"
                onClick={logout}
                className="sm:hidden"
              >
                Logout Account
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

const ThemeIcon = ({
  color,
  icon = <IconMail size={18} />
}: {
  color: string
  icon?: React.ReactNode
}) => (
  <Paper
    color={color}
    shadow="sm"
    p={8}
    className={`bg-${color}-50 text-${color}-600 flex items-center justify-center`}
    style={{
      backgroundColor: `var(--mantine-color-${color}-light)`,
      color: `var(--mantine-color-${color}-filled)`
    }}
  >
    {icon}
  </Paper>
)

export default ProfileClient
