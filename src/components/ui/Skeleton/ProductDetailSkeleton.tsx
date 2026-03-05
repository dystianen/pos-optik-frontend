import { Box, Card, Grid, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core'

export function ProductDetailSkeleton() {
  return (
    <>
      {/* Title */}
      <Skeleton height={32} width={200} mb="sm" />

      <Grid>
        {/* LEFT */}
        <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" w="100%">
            {/* Image Section */}
            <Card.Section>
              <Grid>
                {/* Thumbnails */}
                <Grid.Col span={{ md: 2 }}>
                  <Stack mt="sm" mx="sm" w="max-content">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} height={80} width={80} radius="md" />
                    ))}
                  </Stack>
                </Grid.Col>

                {/* Main Image */}
                <Grid.Col span={{ md: 10 }}>
                  <Skeleton height={400} radius="md" />
                </Grid.Col>
              </Grid>
            </Card.Section>

            {/* Product Info */}
            <Box mt="md">
              <Group justify="space-between">
                <Box>
                  <Skeleton height={14} width={120} mb={8} />
                  <Skeleton height={18} width={260} />
                </Box>

                <Skeleton height={40} width={140} radius="xl" />
              </Group>

              {/* Price */}
              <Group justify="space-between" mt="md">
                <Skeleton height={24} width={160} />
              </Group>

              {/* Description */}
              <Stack mt="lg" gap="xs">
                <Skeleton height={14} width={160} />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={12} width="80%" />
                ))}
              </Stack>
            </Box>
          </Card>
        </Grid.Col>

        {/* RIGHT */}
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
          <Card shadow="sm">
            <Skeleton height={24} width={200} mb="md" />

            <SimpleGrid cols={{ base: 3, sm: 5, md: 3 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} shadow="sm" p="xs">
                  <Skeleton height={80} mb={6} />
                  <Skeleton height={10} width="70%" mb={6} />
                  <Skeleton height={10} width="50%" />
                </Card>
              ))}
            </SimpleGrid>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}
