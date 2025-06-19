'use client'
import Cart from '@/components/Common/ShoppingCart'
import { removeCookieToken, removeUser } from '@/utils/auth'
import { Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconPower, IconTruckDelivery, IconUserFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useState } from 'react'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

type TProps = {
  user: {
    username: string
  }
}

const Header: React.FC<TProps> = ({ user }) => {
  const router = useRouter()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

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
    removeCookieToken()
    removeUser()
  }, [])

  const handleRedirectToOrders = useCallback(() => {
    router.push('/orders')
  }, [])

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${
        sticky ? ' shadow-lg py-5' : 'shadow-none py-6'
      }`}
    >
      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          <Group>
            <Cart />
            {user?.username ? (
              <Menu width={200} position="bottom-start">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={'xs'}>
                      <IconUserFilled color="#1a21bc" size={28} />
                      <Text size="lg">{user.username}</Text>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={handleRedirectToOrders}
                    leftSection={<IconTruckDelivery size={14} />}
                  >
                    My Orders
                  </Menu.Item>
                  <Menu.Item onClick={handleLogout} leftSection={<IconPower size={14} />} c={'red'}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
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
              {user?.username ? (
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
                <>
                  <Link
                    href="/signin"
                    className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
