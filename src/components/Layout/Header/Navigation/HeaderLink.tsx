'use client'
import { TMenu } from '@/features/menu/types'
import { formatSlug } from '@/utils/format'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconChevronDown } from '@tabler/icons-react'

interface HeaderLinkProps {
  item: TMenu
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ item, onMouseEnter, onMouseLeave }) => {
  const pathname = usePathname()
  const slug = formatSlug(item.category_name)
  const href = `/product/${slug}`
  const isActive = pathname === href

  const hasSubmenu = ['sunglasses', 'accessories', 'contact lens'].includes(item.category_name.toLowerCase())

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative py-2 text-base font-medium flex items-center gap-1 transition-colors duration-200 hover:text-primary ${
        isActive ? 'text-primary' : 'text-gray-500'
      }`}
    >
      <span>{item.category_name}</span>
      {hasSubmenu && (
        <IconChevronDown size={14} className="transition-transform duration-200" />
      )}
      {isActive && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary transition-all duration-300" />
      )}
    </Link>
  )
}

export default HeaderLink
