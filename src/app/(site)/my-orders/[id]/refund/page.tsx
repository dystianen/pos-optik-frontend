'use client'

import { useRefundStatus, useShipItem } from '@/hooks/useOrder'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Stack,
  Stepper,
  Text,
  Title,
  TextInput,
  Paper,
  Box,
  rem,
  ThemeIcon,
  Alert
} from '@mantine/core'
import {
  IconArrowLeft,
  IconCheck,
  IconTruckDelivery,
  IconReceiptRefund,
  IconClock,
  IconPackageImport,
  IconAlertCircle,
  IconMapPin,
  IconPhone,
  IconMail,
  IconInfoCircle
} from '@tabler/icons-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'

export default function RefundProgressPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [courier, setCourier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const { data: refundStatus, isLoading: isLoadingStatus } = useRefundStatus(id)
  const { mutateAsync: shipItem, isPending: isPendingShip } = useShipItem()

  const activeStep = useMemo(() => {
    if (!refundStatus) return 0
    switch (refundStatus.status) {
      case 'requested':
        return 1
      case 'return_approved':
        return 2
      case 'return_shipped':
        return 3
      case 'return_received':
        return 4
      case 'approved':
        return 5
      case 'refunded':
        return 6
      case 'request_rejected':
      case 'return_rejected':
      case 'expired':
        return -1 // Special case for rejected
      default:
        return 0
    }
  }, [refundStatus])

  const handleShipSubmit = async () => {
    if (!courier || !trackingNumber) {
      toast.error('Please fill in both courier and tracking number')
      return
    }

    try {
      await shipItem({
        refund_id: refundStatus!.refund_id,
        courier,
        tracking_number: trackingNumber
      })
      toast.success('Shipping information submitted successfully')
      setCourier('')
      setTrackingNumber('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit shipping information')
    }
  }


  return (
    <Container size="md" my={100} mih={800} pos="relative">
      <LoadingOverlay visible={isLoadingStatus} loaderProps={{ type: 'bars' }} />

      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            Back to Order
          </Button>
        </Group>

        {refundStatus ? (
          <>
            {/* Status Summary */}
            <Paper shadow="sm" p="lg">
              <Group justify="space-between" align="start">
                <Stack gap={4}>
                  <Text size="sm" c="dimmed">Current Status</Text>
                  <Text fw={700} size="xl" c={activeStep === -1 ? 'red' : 'primary'}>
                    {refundStatus.status.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="sm" c="dimmed">Request At</Text>
                  <Text fw={700} size="xl" c="primary">
                    {formatDate(refundStatus.requested_at)}
                  </Text>
                </Stack>
                <Stack gap={4} align="flex-end">
                  <Text size="sm" c="dimmed">Refund Amount</Text>
                  <Text fw={700} size="xl" c="primary">
                    {formatCurrency(refundStatus.refund_amount)}
                  </Text>
                </Stack>
              </Group>
            </Paper>

            {/* Stepper */}
            {activeStep === -1 ? (
              <Card p="xl" bg="red.0">
                <Group gap="md">
                  <ThemeIcon color="red" size="xl" radius="xl">
                    <IconAlertCircle size={30} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text fw={700} size="lg">Request {refundStatus.status === 'expired' ? 'Expired' : 'Rejected'}</Text>
                    <Text size="sm" c="dimmed">
                      Your refund/cancellation request has been {refundStatus.status.replace(/_/g, ' ').toLowerCase()}.
                      Please contact our support for further assistance.
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ) : (
              <Stepper active={activeStep} size='xs' allowNextStepsSelect={false}>
                <Stepper.Step
                  label="Submitted"
                  description="Request received"
                  icon={<IconClock />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="md">
                    <Paper p="md" bg="blue.0">
                      <Text size="sm">
                        Your refund/cancellation request has been successfully submitted.
                        Our team will review your request and the attached proof.
                      </Text>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Step
                  label="Reviewing"
                  description="Verifying request"
                  icon={<IconReceiptRefund />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="md">
                    <Paper p="md" bg="blue.0">
                      <Text size="sm">
                        We are reviewing the details of your request. This process usually takes 1-2 business days. You will receive a notification when the review is complete.
                      </Text>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Step
                  label="Return Approved"
                  description="Prepare shipping"
                  icon={<IconPackageImport />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="xl">
                    <Paper p="lg" shadow="xs">
                      <Stack gap="md">
                        <Title order={4}>Submit Shipping Details</Title>
                        <Text size="sm" c="dimmed">
                          Please ship your item to our warehouse and provide the tracking information below.
                        </Text>

                        <Alert variant="light" color="yellow" title="Return Address" radius="md" icon={<IconInfoCircle />}>
                          <Stack gap="xs">
                            <Group gap="xs" align="start" wrap="nowrap">
                              <IconMapPin size={18} style={{ marginTop: rem(2) }} />
                              <Text size="sm">
                                Jl. Raya Pacet No.25, Njarum, Pandanarum, Kec. Pacet, Kabupaten Mojokerto, Jawa Timur 61374
                              </Text>
                            </Group>
                            <Group gap="xs" align="center">
                              <IconPhone size={18} />
                              <Text size="sm">+62 822-3237-4041</Text>
                            </Group>
                            <Group gap="xs" align="center">
                              <IconMail size={18} />
                              <Text size="sm">optik.fiqri@gmail.com</Text>
                            </Group>
                          </Stack>
                        </Alert>

                        <Divider label="Shipping Information" labelPosition="center" />
                        <TextInput
                          label="Courier Service"
                          placeholder="e.g. JNE, J&T, Sicepat"
                          value={courier}
                          onChange={(e) => setCourier(e.currentTarget.value)}
                          required
                        />
                        <TextInput
                          label="Tracking Number"
                          placeholder="Enter your receipt/tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.currentTarget.value)}
                          required
                        />
                        <Button
                          fullWidth
                          onClick={handleShipSubmit}
                          loading={isPendingShip}
                          disabled={!courier || !trackingNumber}
                        >
                          Submit Shipping Info
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Step
                  label="Shipped"
                  description="Waiting for receipt"
                  icon={<IconTruckDelivery />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="md">
                    <Paper p="md" bg="blue.0">
                      <Text size="sm">
                        Thank you for providing the shipping information. We are now waiting for your package to arrive at our warehouse for further inspection.
                      </Text>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Step
                  label="Received"
                  description="Final check"
                  icon={<IconPackageImport />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="md">
                    <Paper p="md" bg="blue.0">
                      <Text size="sm">
                        Your package has been received. We are now inspecting the product
                        before processing your refund.
                      </Text>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Step
                  label="Approved"
                  description="Refund processing"
                  icon={<IconReceiptRefund />}
                  completedIcon={<IconCheck />}
                >
                  <Box mt="md">
                    <Paper p="md" bg="blue.0">
                      <Text size="sm">
                        Your refund has been approved by our admin. We are currently processing the refund to your account.
                      </Text>
                    </Paper>
                  </Box>
                </Stepper.Step>
                <Stepper.Completed>
                  <Card p="xl" bg="green.0" mt="xl">
                    <Stack align="center" gap="sm">
                      <ThemeIcon color="green" size="xl" radius="xl">
                        <IconCheck size={30} />
                      </ThemeIcon>
                      <Text fw={700} size="lg">Refund Completed</Text>
                      <Text size="sm" ta="center">
                        The process is finished and your refund has been processed.
                        It might take a few days to appear in your account.
                      </Text>
                    </Stack>
                  </Card>
                </Stepper.Completed>
              </Stepper>
            )}
          </>
        ) : (
          !isLoadingStatus && (
            <Card withBorder p="xl">
              <Text ta="center" c="dimmed">No active refund or cancellation request found for this order.</Text>
            </Card>
          )
        )}
      </Stack>
    </Container>
  )
}
