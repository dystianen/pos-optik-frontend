"use client"
import { useMenu } from '@/features/menu/hooks'
import { formatSlug } from '@/utils/format'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Box, Container, Grid, Group, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import Logo from '../Header/Logo'

const footer = () => {
  const { data: menu } = useMenu()

  return (
    <footer className="bg-deepSlate py-10 pb-32 lg:pb-10 mt-10">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-8">
          {/* Logo Section */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-center lg:items-start">
            <Logo />
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="hover:text-primary text-black transition-colors">
                <Icon icon="tabler:brand-facebook" width="24" />
              </Link>
              <Link href="#" className="hover:text-primary text-black transition-colors">
                <Icon icon="tabler:brand-twitter" width="24" />
              </Link>
              <Link
                href="https://www.instagram.com/optik_fiqri/"
                className="hover:text-primary text-black transition-colors"
                target="_blank"
              >
                <Icon icon="tabler:brand-instagram" width="24" />
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-span-1 lg:col-span-2">
            <Text fw={600} fz="lg" mb="md" className="text-black text-center lg:text-left">
              Links
            </Text>
            <Stack gap={8} align="center" className="lg:items-start">
              {menu?.map((item, index) => (
                <Link
                  key={index}
                  href={`/product/${formatSlug(item.category_name)}`}
                  className="text-black/60 hover:text-primary text-sm transition-colors text-center lg:text-left"
                >
                  {item.category_name}
                </Link>
              ))}
            </Stack>
          </div>

          {/* Other Section */}
          <div className="col-span-1 lg:col-span-2">
            <Text fw={600} fz="lg" mb="md" className="text-black text-center lg:text-left">
              Other
            </Text>
            <Stack gap={8} align="center" className="lg:items-start">
              {['About Us', 'Our Team', 'Career', 'Services', 'Contact'].map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-black/60 hover:text-primary text-sm transition-colors text-center lg:text-left"
                >
                  {label}
                </Link>
              ))}
            </Stack>
          </div>

          {/* Contact Section */}
          <div className="col-span-2 lg:col-span-4 mt-4 lg:mt-0">
            <Stack gap="md" align="center" className="lg:items-start text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start gap-2">
                <Icon icon="tabler:brand-google-maps" className="text-primary text-2xl" />
                <Text fz="sm" c="dimmed" maw={300}>
                  Jl. Raya Pacet No.25, Njarum, Pandanarum, Kec. Pacet, Kabupaten Mojokerto, Jawa Timur 61374
                </Text>
              </div>
              
              <Group gap="xs" wrap="nowrap">
                <Icon icon="tabler:phone" className="text-primary text-xl" />
                <Text fz="sm" c="dimmed">
                  +62 822-3237-4041
                </Text>
              </Group>

              <Group gap="xs" wrap="nowrap">
                <Icon icon="tabler:mail" className="text-primary text-xl" />
                <Text fz="sm" c="dimmed">
                  optik.fiqri@gmail.com
                </Text>
              </Group>
            </Stack>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <Text fz="xs" c="dimmed">
            &copy; 2025 Optik Fiqri. All Rights Reserved
          </Text>
          
          <Group gap="xl">
            <Link href="#" className="text-black/40 hover:text-primary text-xs transition-colors">
              Privacy policy
            </Link>
            <Link href="#" className="text-black/40 hover:text-primary text-xs transition-colors">
              Terms & conditions
            </Link>
          </Group>

          <Text fz="xs" c="dimmed">
            Developed by{' '}
            <Link href="https://dystianen.vercel.app/" target="_blank" className="hover:text-primary transition-colors">
              Devyus
            </Link>
          </Text>
        </div>
      </div>
    </footer>
  )
}

export default footer
