'use client'

import { useMenu } from '@/features/menu/hooks'
import { TMenu } from '@/features/menu/types'
import { formatSlug } from '@/utils/format'
import {
  Box,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { IconCategory, IconHeart, IconHome, IconShoppingBag, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavigation = () => {
  const pathname = usePathname()
  const theme = useMantineTheme()
  const { data: menuData } = useMenu()

  const navItems = [
    { icon: IconHome, label: 'Home', href: '/' },
    { icon: IconCategory, label: 'Menu', isMenu: true },
    { icon: IconHeart, label: 'Wishlist', href: '/wishlist' },
    { icon: IconShoppingBag, label: 'My Orders', href: '/my-orders' },
    { icon: IconUser, label: 'Profile', href: '/profile' }
  ]

  return (
    <Box className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <Paper shadow="xl" radius="xl" withBorder p="xs" className="bg-white/80 backdrop-blur-md">
        <Group justify="space-around" gap={0} wrap="nowrap">
          {navItems.map((item) => {
            if (item.isMenu) {
              return (
                <Menu
                  key={item.label}
                  position="top"
                  offset={15}
                  shadow="md"
                  width={200}
                  radius="md"
                  withArrow
                >
                  <Menu.Target>
                    <UnstyledButton className="flex-1">
                      <Stack gap={4} align="center">
                        <item.icon size={22} stroke={2} color={theme.colors.gray[6]} />
                        <Text fz={10} fw={500} c="gray.6">
                          {item.label}
                        </Text>
                      </Stack>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Categories</Menu.Label>
                    {menuData?.map((cat: TMenu) => (
                      <Menu.Item
                        key={cat.category_id}
                        component={Link}
                        href={`/product/${formatSlug(cat.category_name)}`}
                      >
                        {cat.category_name}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )
            }

            const isActive = pathname === item.href
            return (
              <UnstyledButton
                key={item.label}
                component={Link}
                href={item.href || '#'}
                className="flex-1"
              >
                <Stack gap={4} align="center">
                  <item.icon
                    size={22}
                    stroke={2}
                    color={isActive ? theme.colors.primary[8] : theme.colors.gray[6]}
                  />
                  <Text fz={10} fw={isActive ? 700 : 500} c={isActive ? 'primary' : 'gray.6'}>
                    {item.label}
                  </Text>
                </Stack>
              </UnstyledButton>
            )
          })}
        </Group>
      </Paper>
    </Box>
  )
}

export default BottomNavigation
