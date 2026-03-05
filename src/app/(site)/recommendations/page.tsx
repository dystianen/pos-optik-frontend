import { Metadata } from 'next'
import RecommendationClient from './RecommendationClient'

export const metadata: Metadata = {
  title: 'Recommendation',
  description: 'Your recommendation at Optikers.'
}

const Recommendation = () => {
  return <RecommendationClient />
}

export default Recommendation