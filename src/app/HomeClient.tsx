'use client'
import SectionCarousel from '@/components/Home/SectionCarousel'
import Mentor from '@/components/Home/Mentor'
import Testimonial from '@/components/Home/Testimonials'
import Newsletter from '@/components/Home/Newsletter'
import { useBestSeller, useMyRecommendations, useNewEyeWear } from '@/features/product/hooks'
import { Carousel } from '@mantine/carousel'
import { Container, Image, Stack } from '@mantine/core'
import { IconShieldCheck, IconEye, IconTruck, IconUserCheck } from '@tabler/icons-react'
import { hasCookie } from 'cookies-next/client'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HomeClient() {
  const autoplay = useRef(Autoplay({ delay: 3000 }))
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(hasCookie('user'))
  }, [])

  const { data: newEyeWear, isLoading: isLoadingNewEyeWear } = useNewEyeWear({
    limit: 10
  })
  const { data: bestSeller, isLoading: isLoadingBestSeller } = useBestSeller({
    limit: 10
  })
  const { data: myRecommendations, isLoading: isLoadingMyRecs } = useMyRecommendations({
    limit: 10,
    enabled: isLoggedIn
  })

  return (
    <main className="overflow-hidden bg-slateGray/35 min-h-screen">
      <Stack gap={80} className="pb-24">
        {/* HERO SECTION */}
        <Container size={'xl'} mt={{ base: 70, md: 100 }} w="100%">
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
              slide: 'h-[250px] sm:h-[450px]'
            }}
            styles={(theme) => ({
              viewport: {
                borderRadius: 16,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)'
              },
              control: {
                color: 'white',
                backgroundColor: 'rgba(13, 148, 136, 0.4)',
                border: 'none',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(13, 148, 136, 0.8)'
                }
              }
            })}
          >
            <Carousel.Slide className="relative">
              <Image src="/images/banner/banner-4.jpg" fit="cover" w={'100%'} h={'100%'} />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight_text/70 via-midnight_text/40 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white">
                <span className="text-teal-300 font-bold uppercase tracking-wider text-xs sm:text-sm mb-1 sm:mb-2">New Arrival</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-[280px] sm:max-w-md md:max-w-xl leading-tight mb-2 sm:mb-4">
                  Sophisticated Eyewear
                </h2>
                <p className="text-xs sm:text-sm md:text-lg text-white/80 max-w-[260px] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 font-medium line-clamp-2">
                  Discover beauty in every detail with our latest premium frames combining aesthetics and comfort.
                </p>
                <Link href="/new-eyewear" className="bg-primary hover:bg-secondary hover:scale-105 transition-all duration-300 px-5 py-2 sm:px-8 sm:py-3.5 rounded-full text-white text-xs sm:text-sm font-semibold w-max shadow-lg">
                  Shop Now
                </Link>
              </div>
            </Carousel.Slide>

            <Carousel.Slide className="relative">
              <Image src="/images/banner/banner-1.jpg" fit="cover" w={'100%'} h={'100%'} />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight_text/70 via-midnight_text/40 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white">
                <span className="text-teal-300 font-bold uppercase tracking-wider text-xs sm:text-sm mb-1 sm:mb-2">Special Offer</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-[280px] sm:max-w-md md:max-w-xl leading-tight mb-2 sm:mb-4">
                  Clarify Your Vision
                </h2>
                <p className="text-xs sm:text-sm md:text-lg text-white/80 max-w-[260px] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 font-medium line-clamp-2">
                  High-precision anti-radiation lenses and UV filters for all-day digital comfort.
                </p>
                <Link href="/product/sunglasses" className="bg-primary hover:bg-secondary hover:scale-105 transition-all duration-300 px-5 py-2 sm:px-8 sm:py-3.5 rounded-full text-white text-xs sm:text-sm font-semibold w-max shadow-lg">
                  View Products
                </Link>
              </div>
            </Carousel.Slide>

            <Carousel.Slide className="relative">
              <Image src="/images/banner/banner-2.jpg" fit="cover" w={'100%'} h={'100%'} />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight_text/70 via-midnight_text/40 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white">
                <span className="text-teal-300 font-bold uppercase tracking-wider text-xs sm:text-sm mb-1 sm:mb-2">Total Protection</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-[280px] sm:max-w-md md:max-w-xl leading-tight mb-2 sm:mb-4">
                  Blue Light Glasses
                </h2>
                <p className="text-xs sm:text-sm md:text-lg text-white/80 max-w-[260px] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 font-medium line-clamp-2">
                  Protect your eyes from digital screen strain with modern, trendy frame styles.
                </p>
                <Link href="/new-eyewear" className="bg-primary hover:bg-secondary hover:scale-105 transition-all duration-300 px-5 py-2 sm:px-8 sm:py-3.5 rounded-full text-white text-xs sm:text-sm font-semibold w-max shadow-lg">
                  Explore Collection
                </Link>
              </div>
            </Carousel.Slide>

            <Carousel.Slide className="relative">
              <Image src="/images/banner/banner-3.jpg" fit="cover" w={'100%'} h={'100%'} />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight_text/70 via-midnight_text/40 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20 text-white">
                <span className="text-teal-300 font-bold uppercase tracking-wider text-xs sm:text-sm mb-1 sm:mb-2">Outdoor & Sports</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-[280px] sm:max-w-md md:max-w-xl leading-tight mb-2 sm:mb-4">
                  Active Sunglasses
                </h2>
                <p className="text-xs sm:text-sm md:text-lg text-white/80 max-w-[260px] sm:max-w-md md:max-w-lg mb-4 sm:mb-8 font-medium line-clamp-2">
                  Maximum sun protection sunglasses collection built for your active lifestyle.
                </p>
                <Link href="/product/sunglasses" className="bg-primary hover:bg-secondary hover:scale-105 transition-all duration-300 px-5 py-2 sm:px-8 sm:py-3.5 rounded-full text-white text-xs sm:text-sm font-semibold w-max shadow-lg">
                  Shop Sunglasses
                </Link>
              </div>
            </Carousel.Slide>
          </Carousel>
        </Container>

        {/* USP / TRUST BADGES SECTION */}
        <Container size={'xl'} w="100%">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 px-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center text-center p-3 hover:translate-y-[-2px] transition duration-300">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary mb-3">
                <IconShieldCheck size={26} />
              </div>
              <h3 className="font-bold text-midnight_text text-sm sm:text-base">1-Year Warranty</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-[180px]">Official warranty for all frames & lenses</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 hover:translate-y-[-2px] transition duration-300">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary mb-3">
                <IconEye size={26} />
              </div>
              <h3 className="font-bold text-midnight_text text-sm sm:text-base">High-Precision Lenses</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-[180px]">Anti-radiation, blue light filter & UV protection</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 hover:translate-y-[-2px] transition duration-300">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary mb-3">
                <IconTruck size={26} />
              </div>
              <h3 className="font-bold text-midnight_text text-sm sm:text-base">Secure Shipping</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-[180px]">Insured and trackable delivery nationwide</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 hover:translate-y-[-2px] transition duration-300">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary mb-3">
                <IconUserCheck size={26} />
              </div>
              <h3 className="font-bold text-midnight_text text-sm sm:text-base">Free Consultation</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-[180px]">Eye exams and prescriptions by certified optometrists</p>
            </div>
          </div>
        </Container>

        {/* SHOP BY CATEGORY SECTION */}
        <Container size={'xl'} w="100%">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-midnight_text text-xl sm:text-4xl font-semibold">Popular Categories.</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/new-eyewear" className="group relative h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <Image src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop" fit="cover" w={'100%'} h={'100%'} className="group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white animate-fade-in">
                <h3 className="font-bold text-base sm:text-lg">Premium Frames</h3>
                <p className="text-[11px] sm:text-xs text-teal-300">New Arrivals</p>
              </div>
            </Link>
            <Link href="/product/sunglasses" className="group relative h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <Image src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop" fit="cover" w={'100%'} h={'100%'} className="group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-base sm:text-lg">Sunglasses</h3>
                <p className="text-[11px] sm:text-xs text-teal-300">Style & UV Protection</p>
              </div>
            </Link>
            <Link href="/product/contact-lens" className="group relative h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <Image src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&auto=format&fit=crop" fit="cover" w={'100%'} h={'100%'} className="group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-base sm:text-lg">Contact Lenses</h3>
                <p className="text-[11px] sm:text-xs text-teal-300">Daily & Monthly</p>
              </div>
            </Link>
            <Link href="/product/accessories" className="group relative h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <Image src="https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=600&auto=format&fit=crop" fit="cover" w={'100%'} h={'100%'} className="group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-base sm:text-lg">Accessories</h3>
                <p className="text-[11px] sm:text-xs text-teal-300">Cleaners & Cases</p>
              </div>
            </Link>
          </div>
        </Container>

        {/* NEW EYEWEAR CAROUSEL */}
        <SectionCarousel
          title="New Eyewear"
          exploreTo="/new-eyewear"
          data={newEyeWear ?? []}
          isLoading={isLoadingNewEyeWear}
        />

        {/* BEST SELLER CAROUSEL */}
        <SectionCarousel
          title="Best Seller"
          exploreTo="/best-seller"
          data={bestSeller ?? []}
          isLoading={isLoadingBestSeller}
        />

        {/* JUST FOR YOU (RECOMMENDATIONS) */}
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
