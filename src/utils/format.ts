import dayjs from 'dayjs'

export const formatDate = (date: string) => {
  return dayjs(date).format('DD MMMM YYYY HH:mm')
}

export const formatCurrency = (data: string | number) => {
  const price = Number(data)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

export const formatLabel = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const formatSlug = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-')
