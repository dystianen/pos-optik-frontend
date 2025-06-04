import Hero from '@/components/Home/Hero'
import Mentor from '@/components/Home/Mentor'
import Newsletter from '@/components/Home/Newsletter'
import SectionCarousel from '@/components/Home/SectionCarousel'
import Testimonial from '@/components/Home/Testimonials'
import { Stack } from '@mantine/core'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'eLearning'
}

export default function Home() {
  return (
    <main>
      <Stack gap={'xl'}>
        <Hero />
        <SectionCarousel title="Recommendations" exploreTo="/recommendations" />
        <SectionCarousel title="New Eyewear" exploreTo="/new-eyewear" />
        <Mentor />
        <Testimonial />
        <Newsletter />
      </Stack>
    </main>
  )
}
