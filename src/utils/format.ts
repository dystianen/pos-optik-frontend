import dayjs from 'dayjs'

export const formatDate = (date: string) => {
  return dayjs(date).format('DD MMMM YYYY HH:mm')
}

export const formatCurrency = (data: string) => {
  const price = Number(data)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}
