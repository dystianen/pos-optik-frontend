import { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your profile information.'
}

export default function ProfilePage() {
  return <ProfileClient />
}
