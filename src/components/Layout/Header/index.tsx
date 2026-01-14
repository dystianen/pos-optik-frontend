'use client'
import Search from '@/components/Common/Search'
import Cart from '@/components/Common/ShoppingCart'
import Wishlist from '@/components/Common/Wishlist'
import { useMenu } from '@/hooks/useMenu'
import { TUser } from '@/types/auth'
import { removeTokens } from '@/utils/auth-server'
import { Group, Menu, Skeleton, Text, UnstyledButton } from '@mantine/core'
import { IconPower, IconTruckDelivery, IconUserFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

const Header = ({ user }: { user: TUser | null }) => {
  const router = useRouter()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  const { data: menu, isLoading: isLoadingMenu } = useMenu.menu()

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
  }, [])

  const handleRedirectToOrders = useCallback(() => {
    router.push('/my-orders')
  }, [])

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 px-3 transition-all duration-300 bg-white ${
        sticky ? ' shadow-lg py-3' : 'shadow-none py-4'
      }`}
    >
      <div>
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
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

          <Group>
            {user?.name ? (
              <>
                <Group gap={0}>
                  <Search />
                  <Wishlist />
                  <Cart />
                </Group>
                <Menu width={200} position="bottom-start">
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap={'xs'}>
                        <IconUserFilled color="#1a21bc" size={28} />
                        <Text size="lg" className="hidden md:block">
                          {user.name}
                        </Text>
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <button
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className="block lg:hidden p-2 rounded-lg"
                    aria-label="Toggle mobile menu"
                  >
                    <span className="block w-6 h-0.5 bg-black"></span>
                    <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                    <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                  </button>

                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={handleRedirectToOrders}
                      leftSection={<IconTruckDelivery size={14} />}
                    >
                      My Orders
                    </Menu.Item>
                    <Menu.Item
                      onClick={handleLogout}
                      leftSection={<IconPower size={14} />}
                      c={'red'}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/signin"
                  className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-8 py-3 rounded-full text-lg font-medium"
                >
                  Sign In/Sign Up
                </Link>
                <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className="block lg:hidden p-2 rounded-lg"
                  aria-label="Toggle mobile menu"
                >
                  <span className="block w-6 h-0.5 bg-black"></span>
                  <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                  <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
                </button>
              </div>
            )}
          </Group>
        </div>
        {navbarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-40" />
        )}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}
        >
          <div className="flex items-center justify-between p-4">
            <Logo />
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5"
              aria-label="Close menu"
            ></button>
          </div>
          <nav className="flex flex-col items-start p-4">
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className="mt-4 flex flex-col space-y-4 w-full">
              {user?.name ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout()
                      setNavbarOpen(false)
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="bg-primary text-white hover:bg-primary/15 hover:text-primary w-max px-6 py-3 rounded-full text-lg font-medium text-center"
                >
                  Sign In/Sign Up
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
