import { Text } from '@mantine/core'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Text
        fz={{ base: 28, md: 36 }}
        fw={700}
        c="primary"
        style={{
          fontFamily: 'var(--font-logo)',
          fontStyle: 'italic',
          letterSpacing: '1px',
          textShadow: '4px 4px 2px rgba(0,0,0,0.1)'
        }}
      >
        Optikers
      </Text>
    </Link>
  )
}

export default Logo
