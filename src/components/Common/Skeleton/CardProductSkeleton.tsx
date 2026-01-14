import { Card, Group, Skeleton } from '@mantine/core'

const CardProductSkeleton = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Skeleton height={150} />
      </Card.Section>
      <Skeleton height={16} mt="md" width="60%" />
      <Skeleton height={16} mt="xs" width="80%" />
      <Group mt="xs" wrap="nowrap">
        <Skeleton height={16} width="50%" />
        <Skeleton height={16} width="50%" />
      </Group>
    </Card>
  )
}

export default CardProductSkeleton
