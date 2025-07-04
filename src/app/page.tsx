'use client'
import Hero from '@/components/Home/Hero'
import Mentor from '@/components/Home/Mentor'
import Newsletter from '@/components/Home/Newsletter'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { useProducts } from '@/hooks/useProducts'
import { Stack } from '@mantine/core'

export default function Home() {
  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useProducts.getRecommendations(10)
  const { data: newEyeWear, isLoading: isLoadingNewEyeWear } = useProducts.getNewEyeWear(10)

  return (
    <main>
      <Stack gap={'xl'}>
        <Hero />
        <SectionCarousel
          title="Recommendations"
          exploreTo="/recommendations"
          data={recommendations ?? []}
          isLoading={isLoadingRecommendations}
        />
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
