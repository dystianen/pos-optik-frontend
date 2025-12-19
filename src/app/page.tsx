'use client'
import Hero from '@/components/Home/Hero'
import Mentor from '@/components/Home/Mentor'
import Newsletter from '@/components/Home/Newsletter'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { useProducts } from '@/hooks/useProducts'
import { Stack } from '@mantine/core'

export default function Home() {
  const { data: newEyeWear, isLoading: isLoadingNewEyeWear } = useProducts.getNewEyeWear({
    limit: 10
  })

  return (
    <main>
      <Stack gap={'xl'}>
        <Hero />
        <SectionCarousel
          title="New Eyewear"
          exploreTo="/new-eyewear"
          data={newEyeWear ?? []}
          isLoading={isLoadingNewEyeWear}
        />
        <Mentor />
        {/* <Testimonial /> */}
        <Newsletter />
      </Stack>
    </main>
  )
}
