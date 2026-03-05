const getImagePrefix = () => {
  return process.env.NODE_ENV === 'production' ? '/E-learning/' : ''
}

const embedImage = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`
}

export { embedImage, getImagePrefix }
