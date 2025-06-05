'use client'
import Signin from '@/components/Auth/SignIn'
import SignUp from '@/components/Auth/SignUp'
import { useProducts } from '@/hooks/useProducts'
import { removeCookieToken, removeUser } from '@/utils/auth'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconPower, IconUserFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'

const Header: React.FC = () => {
  const router = useRouter()
  const pathUrl = usePathname()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [user, setUser] = useState<{ username?: string }>({}) // safer default

  const { data: menu } = useProducts.getProductCategory()

  // Safely read localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('user')
      setUser(userString ? JSON.parse(userString) : {})
    }
  }, [router])

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
    router.refresh()
  }, [])

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${
        sticky ? ' shadow-lg py-5' : 'shadow-none py-6'
      }`}
    >
      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          {user.username ? (
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={'xs'}>
                    <IconUserFilled color="#6556FF" size={28} />
                    <Text size="lg">{user.username}</Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={handleLogout} leftSection={<IconPower size={14} />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
              >
                Sign In
              </Link>
              {isSignInOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                  <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white">
                    <button
                      onClick={() => setIsSignInOpen(false)}
                      className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                      aria-label="Close Sign In Modal"
                    >
                      <Icon
                        icon="tabler:currency-xrp"
                        className="text-black hover:text-primary text-24 inline-block me-2"
                      />
                    </button>
                    <Signin />
                  </div>
                </div>
              )}
              <Link
                href="/signup"
                className="hidden lg:block bg-primary/15 hover:bg-primary text-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
              >
                Sign Up
              </Link>
              {isSignUpOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                  <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center">
                    <button
                      onClick={() => setIsSignUpOpen(false)}
                      className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                      aria-label="Close Sign Up Modal"
                    >
                      <Icon
                        icon="tabler:currency-xrp"
                        className="text-black hover:text-primary text-24 inline-block me-2"
                      />
                    </button>
                    <SignUp />
                  </div>
                </div>
              )}
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
              {user.username ? (
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
