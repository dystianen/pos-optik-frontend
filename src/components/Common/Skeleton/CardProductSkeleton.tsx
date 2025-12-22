import { Card, Skeleton } from '@mantine/core'

const CardProductSkeleton = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Skeleton height={150} />
      </Card.Section>
      <Skeleton height={16} mt="md" width="60%" />
      <Skeleton height={16} mt="xs" width="80%" />
    </Card>
  )
}

export default CardProductSkeleton
