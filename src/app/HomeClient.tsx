'use client'
import SectionCarousel from '@/components/Home/SectionCarousel'
import { useBestSeller, useMyRecommendations, useNewEyeWear } from '@/features/product/hooks'
import { Carousel } from '@mantine/carousel'
import { Container, Image, Stack } from '@mantine/core'
import { hasCookie } from 'cookies-next/client'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

export default function HomeClient() {
  const autoplay = useRef(Autoplay({ delay: 3000 }))
  const isLoggedIn = hasCookie('user')

  const { data: newEyeWear, isLoading: isLoadingNewEyeWear } = useNewEyeWear({
    limit: 10
  })
  const { data: bestSeller, isLoading: isLoadingBestSeller } = useBestSeller({
    limit: 10
  })
  const { data: myRecommendations, isLoading: isLoadingMyRecs } = useMyRecommendations({
    limit: 10
  })

  return (
    <main>
      <Stack gap={'xl'}>
        <Container size={'xl'} mt={{ base: 70, md: 100 }}>
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
            classNames={{
              slide: 'h-[200px] sm:h-[400px]'
            }}
            styles={(theme) => ({
              viewport: {
                borderRadius: 15
              },
              control: {
                color: 'white'
              }
            })}
          >
            <Carousel.Slide>
              <Image src="/images/banner/banner-4.jpg" fit="cover" w={'100%'} h={'100%'} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-1.jpg" fit="cover" w={'100%'} h={'100%'} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-2.jpg" fit="cover" w={'100%'} h={'100%'} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/images/banner/banner-3.jpg" fit="cover" w={'100%'} h={'100%'} />
            </Carousel.Slide>
          </Carousel>
        </Container>
        <SectionCarousel
          title="New Eyewear"
          exploreTo="/new-eyewear"
          data={newEyeWear ?? []}
          isLoading={isLoadingNewEyeWear}
        />
        <SectionCarousel
          title="Best Seller"
          exploreTo="/best-seller"
          data={bestSeller ?? []}
          isLoading={isLoadingBestSeller}
        />
        {isLoggedIn && myRecommendations && myRecommendations.length > 0 && (
          <SectionCarousel
            title="Just For You"
            exploreTo="/recommendations"
            data={myRecommendations}
            isLoading={isLoadingMyRecs}
          />
        )}
      </Stack>
    </main>
  )
}
