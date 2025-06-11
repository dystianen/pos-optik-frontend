import { Button, Modal, Text, Title } from '@mantine/core'

type TModalAuthentication = {
  opened: boolean
  onClose: () => void
  onLogin: () => void
}

const ModalAuthentication = ({ opened, onClose, onLogin }: TModalAuthentication) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      styles={{
        content: {
          padding: '10px'
        }
      }}
    >
      <Title order={3} ta={'center'}>
        Authentication Required
      </Title>
      <Text mb="md" ta={'center'}>
        You need to log in to continue. Please log in to access this feature.
      </Text>
      <Button fullWidth radius={'xl'} mt={32} onClick={onLogin}>
        Log In
      </Button>
    </Modal>
  )
}

export default ModalAuthentication
