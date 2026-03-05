import { Metadata } from 'next'
import NewEyewearClient from './NewEyewearClient'

export const metadata: Metadata = {
  title: 'New Eyewear',
  description: 'Find the latest and most stylish eyewear collection at Optikers.'
}

export default function Page() {
  return <NewEyewearClient />
}
