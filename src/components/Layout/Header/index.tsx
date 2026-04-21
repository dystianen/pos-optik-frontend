'use client'
import { TUser } from '@/features/auth/types'
import { useMenu } from '@/features/menu/hooks'
import { removeTokens } from '@/utils/auth-server'
import { Group, Menu, Skeleton, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
import { IconPower, IconTruckDelivery, IconUser } from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { memo, useCallback, useEffect, useState } from 'react'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

const Search = dynamic(() => import('@/components/ui/Search'), { ssr: false })
const Cart = dynamic(() => import('@/components/ui/ShoppingCart'), { ssr: false })
const Wishlist = dynamic(() => import('@/components/ui/Wishlist'), { ssr: false })

const Header = ({ user }: { user: TUser | null }) => {
  const theme = useMantineTheme()
  const router = useRouter()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

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

  return (
    <header
      className={`fixed top-0 z-[99] w-full md:pb-5 px-3 transition-all duration-300 bg-white ${
        sticky ? ' shadow-lg py-3' : 'shadow-none py-3 md:py-4'
      }`}
    >
      <div>
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
                  <HeaderLink key={index} item={item} />
                ))}
              </>
            )}
          </nav>

          {user?.name ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Search />
                <Wishlist />
              </div>
              <Cart />

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
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:block">
                <Search />
              </div>
              <Link
                href="/signin"
                className="hidden bg-primary px-6 py-2.5 text-base font-medium text-white hover:bg-primary/90 rounded-full lg:block transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
