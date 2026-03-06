import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  FileButton,
  Group,
  Image as MantineImage,
  Modal,
  Rating,
  Stack,
  Text,
  Textarea
} from '@mantine/core'
import { IconPhoto, IconPlayerPlay, IconTrash, IconVideo } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useCreateReview } from '../hooks'

type ReviewModalProps = {
  opened: boolean
  onClose: () => void
  order: any // Should be TOrderDetail from order types
}

interface ItemReviewState {
  rating: number
  comment: string
  files: File[]
}

export function ReviewModal({ opened, onClose, order }: ReviewModalProps) {
  const { mutateAsync: createReview, isPending } = useCreateReview()
  const [reviews, setReviews] = useState<Record<string, ItemReviewState>>({})

  // Deduplicate items based on product_id
  const uniqueItems = useMemo(() => {
    if (!order?.items) return []
    const seen = new Set()
    return order.items.filter((item: any) => {
      const duplicate = seen.has(item.product_id)
      seen.add(item.product_id)
      return !duplicate
    })
  }, [order?.items])

  const handleRatingChange = (productId: string, value: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating: value, comment: prev[productId]?.comment || '', files: prev[productId]?.files || [] }
    }))
  }

  const handleCommentChange = (productId: string, value: string) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment: value, rating: prev[productId]?.rating || 0, files: prev[productId]?.files || [] }
    }))
  }

  const handleFileAdd = (productId: string, newFiles: File[]) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: prev[productId]?.rating || 0,
        comment: prev[productId]?.comment || '',
        files: [...(prev[productId]?.files || []), ...newFiles]
      }
    }))
  }

  const handleFileRemove = (productId: string, index: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        files: prev[productId].files.filter((_, i) => i !== index)
      }
    }))
  }

  const handleSubmit = async () => {
    const itemsToReview = uniqueItems.filter((item: any) => reviews[item.product_id]?.rating > 0)

    if (itemsToReview.length === 0) {
      toast.warning('Please provide a rating for at least one product')
      return
    }

    try {
      await Promise.all(
        itemsToReview.map((item: any) => {
          const review = reviews[item.product_id]
          const formData = new FormData()
          formData.append('product_id', item.product_id)
          formData.append('rating', String(review.rating))
          formData.append('comment', review.comment || '')
          review.files.forEach((file) => {
            formData.append('media[]', file)
          })

          return createReview({
            payload: formData,
            productId: item.product_id
          })
        })
      )
      toast.success('Thank you for your reviews!')
      onClose()
      setReviews({})
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit reviews')
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Rate Your Order" size="lg" centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          How was your experience with the products you bought?
        </Text>

        {uniqueItems.map((item: any, index: number) => (
          <Stack key={item.product_id} gap="xs">
            {index > 0 && <Divider variant="dashed" />}
            <Group align="start" wrap="nowrap">
              <MantineImage
                src={item.image}
                alt={item.product_name}
                w={60}
                h={60}
                radius="md"
                fit="cover"
              />
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {item.product_name}
                </Text>
                <Rating
                  value={reviews[item.product_id]?.rating || 0}
                  onChange={(val) => handleRatingChange(item.product_id, val)}
                  size="md"
                />
              </Stack>
            </Group>

            <Textarea
              placeholder="Write your review here (optional)"
              value={reviews[item.product_id]?.comment || ''}
              onChange={(e) => handleCommentChange(item.product_id, e.currentTarget.value)}
              minRows={2}
            />

            <Stack gap={8}>
              <Group gap="xs">
                <FileButton
                  onChange={(files) => handleFileAdd(item.product_id, files)}
                  accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
                  multiple
                >
                  {(props) => (
                    <Button {...props} variant="light" size="compact-xs" leftSection={<IconPhoto size={14} />}>
                      Add Media
                    </Button>
                  )}
                </FileButton>
                <Text size="xs" c="dimmed">
                  PNG, JPG, WebP or MP4
                </Text>
              </Group>

              {reviews[item.product_id]?.files?.length > 0 && (
                <Group gap="xs" wrap="wrap">
                  {reviews[item.product_id].files.map((file, fileIdx) => (
                    <Box key={fileIdx} pos="relative">
                      {file.type.startsWith('video/') ? (
                        <Box
                          w={60}
                          h={60}
                          style={{
                            borderRadius: 8,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <video
                            src={URL.createObjectURL(file)}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover' }}
                            muted
                          />
                          <Center
                            pos="absolute"
                            inset={0}
                            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                          >
                            <IconPlayerPlay size={16} color="white" fill="white" />
                          </Center>
                        </Box>
                      ) : (
                        <MantineImage src={URL.createObjectURL(file)} w={60} h={60} radius="md" fit="cover" />
                      )}
                      <ActionIcon
                        size="xs"
                        color="red"
                        variant="filled"
                        pos="absolute"
                        top={-5}
                        right={-5}
                        radius="xl"
                        onClick={() => handleFileRemove(item.product_id, fileIdx)}
                      >
                        <IconTrash size={10} />
                      </ActionIcon>
                    </Box>
                  ))}
                </Group>
              )}
            </Stack>
          </Stack>
        ))}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            Close
          </Button>
          <Button color="primary" onClick={handleSubmit} loading={isPending}>
            Submit Review
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
