import { TMenu } from '@/features/menu/types'
import { formatSlug } from '@/utils/format'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MobileHeaderLink: React.FC<{ item: TMenu }> = ({ item }) => {
  const pathname = usePathname()
  const slug = formatSlug(item.category_name)
  const href = `/product/${slug}`
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ${
        isActive ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span>{item.category_name}</span>
      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
    </Link>
  )
}

export default MobileHeaderLink
