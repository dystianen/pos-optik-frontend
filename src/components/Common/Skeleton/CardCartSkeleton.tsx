'use client'

import { Card, Grid, Group, Skeleton, Stack } from '@mantine/core'

const CardCartSkeleton = () => {
  return (
    <Card withBorder radius="md">
      <Grid>
        <Grid.Col span={8}>
          <Group wrap="nowrap">
            <Skeleton height={100} width={100} radius="md" />
            <Stack gap="xs" w="100%">
              <Skeleton height={20} width="70%" />
              <Skeleton height={16} width="50%" />
              <Skeleton height={14} width="80%" />
            </Stack>
          </Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack justify="center" h="100%">
            <Skeleton height={20} width="60%" />
          </Stack>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stack justify="center" align="center" h="100%">
            <Skeleton height={24} width={24} circle />
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

export default CardCartSkeleton
