'use client'
import CardProduct from '@/components/Common/CardProduct'
import { TProduct } from '@/types/product'
import { Carousel } from '@mantine/carousel'
import { Container } from '@mantine/core'
import Link from 'next/link'

type TSectionCarousel = {
  title: string
  data: TProduct[]
  exploreTo: string
}

const SectionCarousel = ({ title, data, exploreTo }: TSectionCarousel) => {
  return (
    <Container size={'xl'} my={'xl'} w={'100%'}>
      <div className="sm:flex justify-between items-center mb-10">
        <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
          {title}.
        </h2>
        <Link
          href={exploreTo}
          className="text-primary text-lg font-medium hover:tracking-widest duration-500"
        >
          Explore &nbsp;&gt;&nbsp;
        </Link>
      </div>

      <Carousel
        slideSize={'25%'}
        slideGap="md"
        emblaOptions={{ align: 'start', slidesToScroll: 1 }}
        withControls={false}
        styles={{
          viewport: {
            padding: '10px 0'
          }
        }}
      >
        {data.map((item, index: number) => (
          <Carousel.Slide key={index}>
            <CardProduct item={item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  )
}

export default SectionCarousel
