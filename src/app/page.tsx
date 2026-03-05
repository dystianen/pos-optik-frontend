import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Optikers - Kacamata & Lensa',
  description: 'Temukan koleksi kacamata dan lensa terbaik di Optikers.'
}

export default function Home() {
  return <HomeClient />
}
