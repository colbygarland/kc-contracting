import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { UserMeta, getAllUserMeta } from '@/src/api/users'
import {
  fromTimestamp,
  fromTimestampWithTime,
  toTimestamp,
} from '@/src/utils/date'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'

const onClick = async (type: 'enable' | 'disable', user: UserMeta) => {
  console.log(`${type} user ${user.email}`)
}

export default function Employees({ users }: { users: Array<UserMeta> }) {
  const [currentUser, setCurrentUser] = useState<UserMeta | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Page title="Employee management">
      <TableContainer>
        <Table layout="fixed">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Last Active</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map(user => (
              <Tr key={user.email}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone || '-'}</Td>
                <Td>
                  {user.lastActive
                    ? fromTimestampWithTime(user.lastActive)
                    : '-'}
                </Td>
                <Td>
                  {user.disabledAt ? (
                    <Button
                      colorScheme="green"
                      onClick={() => {
                        setCurrentUser(user)
                        onOpen()
                        onClick('enable', user)
                      }}
                    >
                      Enable
                    </Button>
                  ) : (
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        setCurrentUser(user)
                        onOpen()
                        onClick('disable', user)
                      }}
                    >
                      Disable
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update user {currentUser?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <form onSubmit={rejectConfirm}>
              <input
                type="hidden"
                name="rejectedAt"
                value={toTimestamp(new Date())}
              />
              <FormGroup label="Reason for rejection" required>
                <Textarea name="rejectionReason" required></Textarea>
              </FormGroup>
              <Button colorScheme="red" mb={2} type="submit">
                Reject ticket
              </Button>
            </form> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export async function getServerSideProps() {
  const users = await getAllUserMeta()
  return {
    props: {
      users,
    },
  }
}
