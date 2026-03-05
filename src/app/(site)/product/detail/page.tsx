import { getProductDetail } from '@/features/product/api'
import { Metadata } from 'next'
import DetailClient from './DetailClient'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams
  const productId = id as string

  if (!productId) {
    return {
      title: 'Product Detail'
    }
  }

  try {
    const product = await getProductDetail({ id: productId })
    return {
      title: product.product_name,
      description: `Buy ${product.product_name} – ${product.product_brand} with the best price at Optikers.`
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
    return {
      title: 'Product Detail'
    }
  }
}

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams
  const productId = id as string

  return <DetailClient productId={productId} />
}
