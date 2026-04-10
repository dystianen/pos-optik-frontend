import { formatDate } from '@/utils/format'
import {
  Avatar,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Image as MantineImage,
  Modal,
  Pagination,
  Progress,
  Rating,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core'
import { IconPlayerPlay, IconStarFilled } from '@tabler/icons-react'
import { useState } from 'react'
import { useProductReviews } from '../hooks'
import { ReviewSectionSkeleton } from './ReviewSkeleton'

type ReviewSectionProps = {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [page, setPage] = useState(1)
  const [rating, setRating] = useState<number | null>(null)

  const { data, isLoading } = useProductReviews(productId, { page, rating: rating ?? '' })
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(
    null
  )

  if (isLoading) return <ReviewSectionSkeleton />

  const reviews = data?.items || []
  const summary = data?.summary || {
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
  }
  const ratingDistribution = summary.rating_distribution || {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0
  }
  const totalReviewsGlobal = Number(summary.total_reviews || 0)

  const pagination = data?.pagination || { total: 0, per_page: 10, current_page: 1, last_page: 1 }

  return (
    <Box>
      <Title order={3} mb="md">
        Buyer Reviews
      </Title>

      <Card withBorder padding="lg">
        <Group align="center" gap={40} mb="xl">
          <Stack gap={0} align="center">
            <Text fz={56} fw={800} c="primary">
              {Number(summary.average_rating).toFixed(1)}
            </Text>
            <Rating value={Number(summary.average_rating)} readOnly fractions={2} size="lg" />
            <Text size="sm" c="dimmed" mt="xs" fw={500}>
              {totalReviewsGlobal} reviews
            </Text>
          </Stack>

          <Divider orientation="vertical" />

          <Stack gap={6} style={{ flex: 1, maxWidth: 400 }}>
            <Group justify="space-between" align="center" mb={4}>
              <Text size="xs" fw={600} c="dimmed" style={{ textTransform: 'uppercase' }}>
                Filter by Rating
              </Text>
              {rating && (
                <UnstyledButton
                  onClick={() => {
                    setRating(null)
                    setPage(1)
                  }}
                >
                  <Text size="xs" c="primary" fw={600}>
                    Clear filter
                  </Text>
                </UnstyledButton>
              )}
            </Group>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = Number(ratingDistribution[String(star)] || 0)
              const percentage = totalReviewsGlobal > 0 ? (count / totalReviewsGlobal) * 100 : 0
              const isActive = rating === star

              return (
                <UnstyledButton
                  key={star}
                  onClick={() => {
                    setRating(isActive ? null : star)
                    setPage(1)
                  }}
                  style={{ opacity: !rating || isActive ? 1 : 0.5, transition: 'opacity 0.2s' }}
                >
                  <Group gap="md" wrap="nowrap">
                    <Group gap={4} wrap="nowrap" w={40}>
                      <Text size="sm" fw={600}>
                        {star}
                      </Text>
                      <IconStarFilled size={14} color="#fab005" />
                    </Group>
                    <Progress
                      color={'primary'}
                      size="sm"
                      value={percentage}
                      style={{ flex: 1 }}
                      radius="xl"
                    />
                    <Text size="xs" c="dimmed" w={20} ta="right" fw={isActive ? 700 : 400}>
                      {count}
                    </Text>
                  </Group>
                </UnstyledButton>
              )
            })}
          </Stack>
        </Group>

        <Divider mb="xl" />

        <Stack gap="sm">
          {reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <div key={review.review_id}>
                  <Stack gap="sm">
                    <Group justify="space-between" align="start">
                      <Group>
                        <Avatar color="primary" radius="xl" size="md">
                          {review.customer_name?.charAt(0) || 'C'}
                        </Avatar>
                        <Box>
                          <Text fw={600} size="sm">
                            {review.customer_name}
                          </Text>
                          <Rating value={Number(review.rating)} readOnly size="xs" />
                        </Box>
                      </Group>
                      <Text size="xs" c="dimmed" fw={500}>
                        {formatDate(review.created_at)}
                      </Text>
                    </Group>
                    <Text size="sm" pl={56} c="dark.3" style={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Text>
                    {review.media && review.media.length > 0 && (
                      <Group gap="sm" pl={56} wrap="wrap">
                        {review.media.map((media, idx) => (
                          <Card
                            key={idx}
                            withBorder
                            w={80}
                            h={80}
                            p={0}
                            className="cursor-pointer"
                            onClick={() =>
                              setPreviewMedia({ url: media.file_url, type: media.file_type })
                            }
                          >
                            {media.file_type === 'video' ? (
                              <>
                                <video
                                  src={media.file_url}
                                  width="100%"
                                  height="100%"
                                  style={{ objectFit: 'cover' }}
                                  muted
                                />
                                <Center
                                  pos="absolute"
                                  inset={0}
                                  style={{
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(2px)'
                                  }}
                                >
                                  <Box
                                    style={{
                                      backgroundColor: 'rgba(255,255,255,0.9)',
                                      borderRadius: '50%',
                                      padding: 4,
                                      display: 'flex',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                  >
                                    <IconPlayerPlay size={20} color="primary" fill="currentColor" />
                                  </Box>
                                </Center>
                              </>
                            ) : (
                              <MantineImage src={media.file_url} w="100%" h="100%" fit="cover" />
                            )}
                          </Card>
                        ))}
                      </Group>
                    )}
                  </Stack>
                  <Divider variant="dashed" mt="sm" />
                </div>
              ))}

              {pagination.last_page > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    total={pagination.last_page}
                    value={page}
                    onChange={setPage}
                    color="primary"
                    radius="xl"
                  />
                </Group>
              )}
            </>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              {rating
                ? `No reviews with ${rating} stars found.`
                : 'Be the first to review this product.'}
            </Text>
          )}
        </Stack>
      </Card>

      <Modal
        opened={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        centered
        size="auto"
        padding={0}
        withCloseButton={false}
        styles={{
          body: {
            padding: 0
          },
          root: {
            zIndex: 10000
          }
        }}
      >
        <Box pos="relative">
          {previewMedia?.type === 'video' ? (
            <Box
              component="video"
              src={previewMedia.url}
              controls
              autoPlay
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 12,
                display: 'block',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />
          ) : (
            <MantineImage
              src={previewMedia?.url}
              alt="Review preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 12,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  )
}
