import { Metadata } from 'next'
import ProductsClient from './ProductsClient'

type Props = {
  params: Promise<{ slug: string }>
}

function formatCategoryName(slug: string) {
  return slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: formatCategoryName(slug)
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ProductsClient slug={slug} />
}
