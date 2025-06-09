'use client'
import Hero from '@/components/Home/Hero'
import Mentor from '@/components/Home/Mentor'
import Newsletter from '@/components/Home/Newsletter'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { useProducts } from '@/hooks/useProducts'
import { Stack } from '@mantine/core'
// import { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'eLearning'
// }

export default function Home() {
  const { data: recommendations } = useProducts.getRecommendations(10)
  const { data: newEyeWear } = useProducts.getNewEyeWear()

  return (
    <main>
      <Stack gap={'xl'}>
        <Hero />
        <SectionCarousel
          title="Recommendations"
          exploreTo="/recommendations"
          data={recommendations ?? []}
        />
        <SectionCarousel title="New Eyewear" exploreTo="/new-eyewear" data={newEyeWear ?? []} />
        <Mentor />
        {/* <Testimonial /> */}
        <Newsletter />
      </Stack>
    </main>
  )
}
