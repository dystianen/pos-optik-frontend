import { Card, Skeleton } from '@mantine/core'

const CardProductSkeleton = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Skeleton height={200} />
      </Card.Section>
      <Skeleton height={16} mt="md" width="60%" />
      <Skeleton height={16} mt="xs" width="80%" />
      <Skeleton height={14} mt="md" width="40%" />
      <Skeleton height={14} mt="xs" width="40%" />
      <Skeleton height={36} mt="md" radius="xl" />
    </Card>
  )
}

export default CardProductSkeleton
