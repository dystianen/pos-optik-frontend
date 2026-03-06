'use client'
import { TMenu } from '@/features/menu/types'
import { formatSlug } from '@/utils/format'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HeaderLink: React.FC<{ item: TMenu }> = ({ item }) => {
  const pathname = usePathname()
  const slug = formatSlug(item.category_name)
  const href = `/product/${slug}`
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`relative py-2 text-base font-medium transition-colors duration-200 hover:text-primary ${
        isActive ? 'text-primary' : 'text-gray-500'
      }`}
    >
      {item.category_name}
      {isActive && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary transition-all duration-300" />
      )}
    </Link>
  )
}

export default HeaderLink
