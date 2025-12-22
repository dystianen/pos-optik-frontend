'use client'
import { TMenu } from '@/types/menu'
import { formatSlug } from '@/utils/format'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HeaderLink: React.FC<{ item: TMenu }> = ({ item }) => {
  const path = usePathname()

  const isActive = path === formatSlug(item.category_name)

  return (
    <Link
      href={`/product/${formatSlug(item.category_name)}`}
      className={`text-lg hover:text-black relative ${
        isActive
          ? 'text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1'
          : 'text-grey'
      }`}
    >
      {item.category_name}
    </Link>
  )
}

export default HeaderLink
