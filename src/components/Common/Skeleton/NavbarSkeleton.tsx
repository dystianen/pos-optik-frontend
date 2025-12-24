'use client'

import { Group, Skeleton } from '@mantine/core'

export function NavbarSkeleton() {
  return (
    <header className="fixed top-0 z-40 w-full pb-5 px-3 bg-white shadow-none py-4">
      <div>
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between">
          {/* Logo Skeleton */}
          <Skeleton height={40} width={120} radius="md" />

          {/* Menu Navigation Skeleton - Desktop */}
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            <Skeleton height={24} width={80} radius="sm" />
            <Skeleton height={24} width={100} radius="sm" />
            <Skeleton height={24} width={90} radius="sm" />
            <Skeleton height={24} width={110} radius="sm" />
          </nav>

          {/* User Section Skeleton - Desktop */}
          <Group gap="sm" className="hidden lg:flex">
            {/* Cart Icon Skeleton */}
            <Skeleton height={32} width={32} circle />

            {/* User Profile Skeleton */}
            <Group gap="xs">
              <Skeleton height={28} width={28} circle />
              <Skeleton height={20} width={150} radius="sm" className="hidden md:block" />
            </Group>
          </Group>

          {/* Mobile Menu Button Skeleton */}
          <Skeleton height={40} width={40} radius="md" className="block lg:hidden" />
        </div>
      </div>
    </header>
  )
}
