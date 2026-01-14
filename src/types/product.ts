import { GeneralResponse } from './general'

export interface Gallery {
  product_image_id: string
  product_id: string
  url: string
  alt_text: string
  sort_order: string
  is_primary: string
  mime_type: string
  size_bytes: string
  created_at: Date
  updated_at: Date
  deleted_at: null
}

export type TProduct = {
  product_id: string
  category_id: string
  product_name: string
  product_price: string
  product_stock: string
  product_brand: string
  total_sold: string
  gallery: Gallery[]
  variant_image: Gallery[]
  product_image_url: string
  model: string
  duration: null
  material: string
  base_curve: null
  diameter: null
  power_range: null
  water_content: null
  uv_protection: string
  color: null
  coating: string
  created_at: Date
  updated_at: Date
  score: number
  is_wishlist: string
}

export type TResProducts = GeneralResponse<TProduct[]>

export interface TGalleryDetail {
  product_image_id: string
  url: string
  alt_text: string
  is_primary: number
}

export interface Variant {
  variant_id: string
  variant_name: string
  price: string
  stock: string
  image: TGalleryDetail
}

export interface TDetailProduct {
  product_id: string
  category_id: string
  product_name: string
  product_price: string
  product_stock: string
  product_brand: string
  created_at: Date
  updated_at: Date
  deleted_at: null
  gallery: TGalleryDetail[]
  variants: Variant[]
}

export type TResDetailProduct = GeneralResponse<TDetailProduct>

export type TCategory = {
  category_id: string
  category_name: string
  category_description: string
}
export type TResCategories = GeneralResponse<TCategory[]>

export type TAttribute = {
  attribute_id: string
  attribute_name: string
  values: string[]
}
export type TResAttribute = GeneralResponse<TAttribute[]>
