import { Page } from '@/components/layout/Page'
import { UserMeta, getAllUserMeta } from '@/src/api/users'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'

export default function Employees({ users }: { users: Array<UserMeta> }) {
  return (
    <Page title="Employee management">
      <TableContainer>
        <Table layout="fixed">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map(user => (
              <Tr key={user.email}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone || '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
