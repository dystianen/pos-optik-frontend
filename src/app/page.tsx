'use client'
import Mentor from '@/components/Home/Mentor'
import Newsletter from '@/components/Home/Newsletter'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { useProducts } from '@/hooks/useProducts'
import { Carousel } from '@mantine/carousel'
import { Container, Image, Stack } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 3000 }))
  const { data: newEyeWear, isLoading: isLoadingNewEyeWear } = useProducts.getNewEyeWear({
    limit: 10
  })

  return (
    <main>
      <Stack gap={'xl'}>
        <Container size={'xl'} mt={100}>
          <Carousel
            withIndicators
            w="100%"
            controlSize={40}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={() => autoplay.current.play()}
            emblaOptions={{
              loop: true
            }}
            styles={{
              viewport: {
                borderRadius: 15
              },
              control: {
                color: 'white'
              },
              slide: {
                height: 400
              }
            }}
          >
            <Carousel.Slide>
              <Image src="/images/banner/banner-4.jpg" />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-1.jpg" />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-2.jpg" />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-3.jpg" />
            </Carousel.Slide>
          </Carousel>
        </Container>
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
