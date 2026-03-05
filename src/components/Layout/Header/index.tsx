'use client'
import dynamic from 'next/dynamic'

const Search = dynamic(() => import('@/components/ui/Search'), { ssr: false })
const Cart = dynamic(() => import('@/components/ui/ShoppingCart'), { ssr: false })
const Wishlist = dynamic(() => import('@/components/ui/Wishlist'), { ssr: false })
import { useMenu } from '@/features/menu/hooks'
import { TUser } from '@/features/auth/types'
import { removeTokens } from '@/utils/auth-server'
import { Group, Menu, Skeleton, Text, UnstyledButton } from '@mantine/core'
import { IconPower, IconTruckDelivery, IconUserFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { memo, useCallback, useEffect, useState } from 'react'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

const Header = ({ user }: { user: TUser | null }) => {
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

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 px-3 transition-all duration-300 bg-white ${sticky ? ' shadow-lg py-3' : 'shadow-none py-4'
        }`}
    >
      <div>
        <div className="container mx-auto flex items-center justify-between lg:max-w-screen-xl">
          <Logo />
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

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center">
              <Search />
              <Wishlist />
              <Cart />
            </div>

            {user?.name ? (
              <Menu width={200} position="bottom-end" shadow="md">
                <Menu.Target>
                  <UnstyledButton className="p-1">
                    <Group gap="xs">
                      <IconUserFilled color="#1a21bc" size={24} className="md:w-[28px] md:h-[28px]" />
                      <Text size="sm" className="hidden md:block font-medium">
                        {user.name}
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={handleRedirectToOrders}
                    leftSection={<IconTruckDelivery size={16} />}
                  >
                    My Orders
                  </Menu.Item>
                  <Menu.Item
                    onClick={handleLogout}
                    leftSection={<IconPower size={16} />}
                    c="red"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link
                href="/signin"
                className="hidden bg-primary px-6 py-2.5 text-base font-medium text-white hover:bg-primary/90 rounded-full lg:block transition-all"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="flex lg:hidden flex-col items-center justify-center w-10 h-10 gap-1.5 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${navbarOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${navbarOpen ? 'opacity-0' : ''
                  }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${navbarOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
              ></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-40" />
        )}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
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
            {menu?.map((item, index) => (
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

export default memo(Header)
