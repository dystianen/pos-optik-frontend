'use client'
import { TUser } from '@/features/auth/types'
import { useMenu } from '@/features/menu/hooks'
import { removeTokens } from '@/utils/auth-server'
import { Group, Menu, Skeleton, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
import {
  IconPower,
  IconTruckDelivery,
  IconUser,
  IconGenderMale,
  IconGenderFemale,
  IconMoodKid,
  IconRun,
  IconSpray,
  IconBox,
  IconSparkles,
  IconLink,
  IconSun,
  IconCalendar,
  IconCalendarStats,
  IconPalette
} from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

const Search = dynamic(() => import('@/components/ui/Search'), { ssr: false })
const Cart = dynamic(() => import('@/components/ui/ShoppingCart'), { ssr: false })
const Wishlist = dynamic(() => import('@/components/ui/Wishlist'), { ssr: false })

const IconMap: Record<string, React.FC<any>> = {
  IconGenderMale,
  IconGenderFemale,
  IconMoodKid,
  IconRun,
  IconSpray,
  IconBox,
  IconSparkles,
  IconLink,
  IconSun,
  IconCalendar,
  IconCalendarStats,
  IconPalette
}

const MEGA_MENU_ITEMS: Record<
  string,
  {
    title: string
    items: { label: string; href: string; desc: string; icon: string }[]
    featured?: { title: string; desc: string; image: string; href: string }
  }
> = {
  'sunglasses': {
    title: 'Sunglasses Collection',
    items: [
      { label: 'Men', href: '/product/sunglasses?search=Men', desc: 'Sleek frames and sport styles for men', icon: 'IconGenderMale' },
      { label: 'Women', href: '/product/sunglasses?search=Women', desc: 'Chic, oversized, and elegant designs', icon: 'IconGenderFemale' },
      { label: 'Kids', href: '/product/sunglasses?search=Kids', desc: 'Lightweight, durable, and fun styles', icon: 'IconMoodKid' },
      { label: 'Sports', href: '/product/sunglasses?search=Sports', desc: 'High performance frames for active use', icon: 'IconRun' }
    ],
    featured: {
      title: 'Active Eyewear',
      desc: 'Discover our top high-performance sport sunglasses.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop',
      href: '/product/sunglasses?search=Sports'
    }
  },
  'accessories': {
    title: 'Eyewear Accessories',
    items: [
      { label: 'Lens Cleaner', href: '/product/accessories?search=Lens+Cleaner', desc: 'Streak-free sprays for crystal clear sight', icon: 'IconSpray' },
      { label: 'Lens Case', href: '/product/accessories?search=Lens+Case', desc: 'Durable and leak-proof contact lens cases', icon: 'IconBox' },
      { label: 'Cleaning Cloth', href: '/product/accessories?search=Cleaning+Cloth', desc: 'Premium microfiber cloth for daily cleaning', icon: 'IconSparkles' },
      { label: 'Eyeglass Chain', href: '/product/accessories?search=Eyeglass+Chain', desc: 'Fashionable straps keeping your frames secure', icon: 'IconLink' }
    ],
    featured: {
      title: 'Premium Lens Care',
      desc: 'Proper maintenance tools for pristine lens life.',
      image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=400&auto=format&fit=crop',
      href: '/product/accessories?search=Cleaner'
    }
  },
  'contact lens': {
    title: 'Contact Lens Solutions',
    items: [
      { label: 'Daily', href: '/product/contact-lens?search=Daily', desc: 'Convenient daily disposables for active life', icon: 'IconSun' },
      { label: 'Monthly', href: '/product/contact-lens?search=Monthly', desc: 'Breathable, cost-effective monthly wear', icon: 'IconCalendar' },
      { label: 'Yearly', href: '/product/contact-lens?search=Yearly', desc: 'Highly durable, long-term use lenses', icon: 'IconCalendarStats' },
      { label: 'Colored Lens', href: '/product/contact-lens?search=Colored', desc: 'Enhance your eyes with beautiful, natural shades', icon: 'IconPalette' }
    ],
    featured: {
      title: 'Colored Contacts',
      desc: 'Add vibrancy and charm to your natural look.',
      image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&auto=format&fit=crop',
      href: '/product/contact-lens?search=Colored'
    }
  }
}

const Header = ({ user }: { user: TUser | null }) => {
  const theme = useMantineTheme()
  const router = useRouter()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { data: menu, isLoading: isLoadingMenu } = useMenu()

  // sticky nav
  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = useCallback(() => {
    removeTokens()
    router.push('/signin')
  }, [])

  const handleRedirectToOrders = useCallback(() => {
    router.push('/my-orders')
  }, [])

  const handleRedirectToProfile = useCallback(() => {
    router.push('/profile')
  }, [])

  const handleMouseEnter = (category: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const normalized = category.toLowerCase()
    if (MEGA_MENU_ITEMS[normalized]) {
      setActiveMenu(normalized)
    } else {
      setActiveMenu(null)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handlePanelMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  return (
    <header
      className={`fixed top-0 z-[99] w-full md:pb-5 transition-all duration-300 bg-white ${
        sticky ? ' shadow-sm pb-3' : 'shadow-none pb-3 md:pb-4'
      }`}
    >
      {/* 📣 Announcement Banner for Guests / New Users */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 relative w-full mb-3 shadow-sm">
        <span>🎉 New User Special: Get 15% Off Your First Order & Free Shipping! Code: <strong className="underline">NEWUSER</strong> or <strong className="underline">FREESHIP</strong></span>
      </div>
      <div className="px-3">
        <div className="container mx-auto flex items-center justify-between gap-4 lg:max-w-screen-xl">
          <div className="hidden md:block">
            <Logo />
          </div>

          <div className="flex-grow md:hidden">
            <Search />
          </div>

          <nav className="hidden flex-grow items-center justify-center gap-8 lg:flex">
            {isLoadingMenu ? (
              <>
                <Skeleton height={24} width={100} radius="sm" />
                <Skeleton height={24} width={100} radius="sm" />
                <Skeleton height={24} width={100} radius="sm" />
                <Skeleton height={24} width={100} radius="sm" />
              </>
            ) : (
              <>
                {menu?.map((item, index) => (
                  <HeaderLink
                    key={index}
                    item={item}
                    onMouseEnter={() => handleMouseEnter(item.category_name)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Search />
              <Wishlist isLoggedIn={!!user?.name} />
            </div>
            <Cart isLoggedIn={!!user?.name} />

            {user?.name ? (
              <div className="hidden md:block">
                <Menu
                  width={200}
                  position="bottom-end"
                  shadow="md"
                  styles={{ dropdown: { borderRadius: 12 } }}
                >
                  <Menu.Target>
                    <UnstyledButton className="p-1">
                      <Group gap="xs">
                        <IconUser color={theme.colors.primary[8]} size={25} />
                        <Text className="hidden md:block font-medium">{user.name}</Text>
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={handleRedirectToProfile}
                      leftSection={<IconUser size={16} />}
                    >
                      My Profile
                    </Menu.Item>
                    <Menu.Item
                      onClick={handleRedirectToOrders}
                      leftSection={<IconTruckDelivery size={16} />}
                    >
                      My Orders
                    </Menu.Item>
                    <Menu.Item onClick={handleLogout} leftSection={<IconPower size={16} />} c="red">
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={(e) => {
                  e.preventDefault()
                  if (typeof window !== 'undefined') {
                    const redirectTo = encodeURIComponent(window.location.pathname + window.location.search)
                    router.push(`/signin?redirectTo=${redirectTo}`)
                  } else {
                    router.push('/signin')
                  }
                }}
                className="hidden bg-primary px-6 py-2.5 text-base font-medium text-white hover:bg-primary/90 rounded-full lg:block transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mega Menu Panel */}
      <div
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md border-t border-b border-gray-100 shadow-xl transition-all duration-300 transform z-[98] origin-top ${
          activeMenu
            ? 'opacity-100 translate-y-0 scale-y-100 pointer-events-auto visible'
            : 'opacity-0 -translate-y-2 scale-y-95 pointer-events-none invisible'
        }`}
      >
        <div className="container mx-auto lg:max-w-screen-xl py-8 px-6 grid grid-cols-12 gap-8">
          {activeMenu && MEGA_MENU_ITEMS[activeMenu] && (
            <>
              {/* Left Column: Menu items */}
              <div className="col-span-8">
                <Text fw={700} fz={18} c="midnight_text" mb="lg" className="tracking-wide">
                  {MEGA_MENU_ITEMS[activeMenu].title}
                </Text>
                <div className="grid grid-cols-2 gap-4">
                  {MEGA_MENU_ITEMS[activeMenu].items.map((subItem, idx) => {
                    const IconComponent = IconMap[subItem.icon]
                    return (
                      <Link
                        key={idx}
                        href={subItem.href}
                        onClick={() => setActiveMenu(null)}
                        className="group/item flex gap-4 p-3 rounded-xl hover:bg-teal-50/50 transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                          {IconComponent && <IconComponent size={20} stroke={2} />}
                        </div>
                        <div>
                          <Text fw={600} fz={15} c="midnight_text" className="group-hover/item:text-primary transition-colors">
                            {subItem.label}
                          </Text>
                          <Text fz={12} c="dimmed" className="mt-0.5 line-clamp-2">
                            {subItem.desc}
                          </Text>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Featured item */}
              {MEGA_MENU_ITEMS[activeMenu].featured && (
                <div className="col-span-4 border-l border-gray-100 pl-8">
                  <div className="relative h-[200px] w-full rounded-xl overflow-hidden group/card shadow-sm border border-gray-100 bg-gray-50 flex flex-col justify-end p-4">
                    <Image
                      src={MEGA_MENU_ITEMS[activeMenu].featured.image}
                      alt={MEGA_MENU_ITEMS[activeMenu].featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 1024px) 30vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative z-10 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">Featured</span>
                      <h4 className="font-semibold text-base mt-0.5">{MEGA_MENU_ITEMS[activeMenu].featured.title}</h4>
                      <p className="text-xs text-gray-200 mt-1 line-clamp-2">{MEGA_MENU_ITEMS[activeMenu].featured.desc}</p>
                      <Link
                        href={MEGA_MENU_ITEMS[activeMenu].featured.href}
                        onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center text-xs font-semibold text-teal-300 hover:text-teal-200 mt-3 gap-1 group/btn"
                      >
                        Shop Collection
                        <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
