import { Title } from '@mantine/core'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Title order={1}>
        OPTIKERS
        <Title component="span" c="violet.7" order={1}>
          .
        </Title>
      </Title>
    </Link>
  )
}

export default Logo
