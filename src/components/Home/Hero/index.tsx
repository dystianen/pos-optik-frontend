import { getImagePrefix } from '@/utils/util'
import { Icon } from '@iconify/react/dist/iconify.js'
import { hasCookie } from 'cookies-next/client'
import Image from 'next/image'

const Hero = () => {
  const isLoggedIn = hasCookie('user')
  return (
    <section id="home-section" className="bg-slateGray">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center">
          <div className="col-span-6 flex flex-col gap-8 ">
            <div className="flex gap-2 mx-auto lg:mx-0">
              <Icon
                icon="solar:verified-check-bold"
                className="text-success text-xl inline-block me-2"
              />
              <p className="text-success text-sm font-semibold text-center lg:text-start">
                Get 30% off on new account
              </p>
            </div>
            <h1 className="text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0">
              Boost your confidence with the perfect eyewear
            </h1>
            <h3 className="text-black/70 text-lg pt-5 lg:pt-0">
              Discover eyewear that blends style, comfort, and productivity, "Look sharp. Feel
              confident. Work smarter".
            </h3>
            <button className="bg-secondary text-white p-5 rounded-full right-2 top-2 w-max px-20">
              Get 30% off — Register Now!
            </button>
            <div className="flex items-center justify-between pt-10 lg:pt-4">
              <div className="flex gap-2">
                <Image
                  src={`${getImagePrefix()}images/banner/check-circle.svg`}
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">Comfortable</p>
              </div>
              <div className="flex gap-2">
                <Image
                  src={`${getImagePrefix()}images/banner/check-circle.svg`}
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">Recommended</p>
              </div>
              <div className="flex gap-2">
                <Image
                  src={`${getImagePrefix()}images/banner/check-circle.svg`}
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">Stylish</p>
              </div>
            </div>
          </div>
          <div className="col-span-6 flex justify-center">
            <Image
              src={`${getImagePrefix()}images/banner/mahila.png`}
              alt="nothing"
              width={1000}
              height={805}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
