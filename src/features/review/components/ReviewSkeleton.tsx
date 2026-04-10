import {
  Avatar,
  Box,
  Card,
  Divider,
  Group,
  Progress,
  Rating,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { IconStarFilled } from '@tabler/icons-react'

export function ReviewSummarySkeleton() {
  return (
    <Group align="center" gap={40} mb="xl">
      <Stack gap={0} align="center">
        <Skeleton height={60} width={80} mb={4} />
        <Skeleton height={20} width={120} />
        <Skeleton height={14} width={60} mt="xs" />
      </Stack>

      <Divider orientation="vertical" />

      <Stack gap={6} style={{ flex: 1, maxWidth: 400 }}>
        <Group justify="space-between" align="center" mb={4}>
          <Skeleton height={14} width={100} />
        </Group>
        {[5, 4, 3, 2, 1].map((star) => (
          <Group key={star} gap="md" wrap="nowrap">
            <Group gap={4} wrap="nowrap" w={40}>
              <Text size="sm" fw={600}>
                {star}
              </Text>
              <IconStarFilled size={14} color="#e9ecef" />
            </Group>
            <Skeleton height={8} radius="xl" style={{ flex: 1 }} />
            <Skeleton height={14} width={20} />
          </Group>
        ))}
      </Stack>
    </Group>
  )
}

export function ReviewItemSkeleton() {
  return (
    <Box>
      <Stack gap="sm">
        <Group justify="space-between" align="start">
          <Group>
            <Skeleton circle height={38} />
            <Box>
              <Skeleton height={14} width={100} mb={6} />
              <Skeleton height={12} width={60} />
            </Box>
          </Group>
          <Skeleton height={12} width={80} />
        </Group>
        <Stack gap={6} pl={56}>
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="70%" />
        </Stack>
        <Group gap="sm" pl={56} wrap="wrap" mt="xs">
          {[1, 2].map((i) => (
            <Skeleton key={i} h={80} w={80} radius="md" />
          ))}
        </Group>
      </Stack>
      <Divider variant="dashed" mt="sm" mb="md" />
    </Box>
  )
}

export function ReviewSectionSkeleton() {
  return (
    <Box>
      <Title order={3} mb="md">
        Buyer Reviews
      </Title>

      <Card withBorder padding="lg">
        <ReviewSummarySkeleton />
        <Divider mb="xl" />
        <Stack gap="sm">
          {[1, 2, 3].map((i) => (
            <ReviewItemSkeleton key={i} />
          ))}
        </Stack>
      </Card>
    </Box>
  )
}
