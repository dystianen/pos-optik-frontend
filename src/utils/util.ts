const getImagePrefix = () => {
  return process.env.NODE_ENV === 'production' ? '/E-learning/' : ''
}

const embedImage = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`
}

const formatCurrency = (data: string) => {
  const price = Number(data)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

export { embedImage, formatCurrency, getImagePrefix }
