'use client'
import CardProduct from '@/components/Common/CardProduct'
import CardProductSkeleton from '@/components/Common/Skeleton/CardProductSkeleton'
import { TProduct } from '@/types/product'
import { Carousel } from '@mantine/carousel'
import { Container } from '@mantine/core'
import Link from 'next/link'

type TSectionCarousel = {
  title: string
  data: TProduct[]
  exploreTo: string
  isLoading: boolean
}

const SectionCarousel = ({ title, data, exploreTo, isLoading }: TSectionCarousel) => {
  const skeletonCount = 5

  return (
    <Container size={'xl'} mt={'xl'} w="100%">
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
          {title}.
        </h2>
        {exploreTo && (
          <Link
            href={exploreTo}
            className="text-primary text-lg font-medium hover:tracking-widest duration-500"
          >
            Explore &nbsp;&gt;&nbsp;
          </Link>
        )}
      </div>

      <Carousel
        slideSize={{ base: '80%', sm: '50%', md: '33.333333%', lg: '20%' }}
        slideGap="md"
        emblaOptions={{ align: 'start', slidesToScroll: 1 }}
        withControls={false}
        styles={{
          viewport: {
            padding: '10px 0'
          }
        }}
      >
        {(isLoading ? Array.from({ length: skeletonCount }) : data).map((item, index: number) => (
          <Carousel.Slide key={index}>
            {isLoading ? <CardProductSkeleton /> : <CardProduct item={item as TProduct} />}
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  )
}

export default SectionCarousel
