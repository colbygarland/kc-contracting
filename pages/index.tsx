import { H2 } from '@/components/Headings'
import { TicketDetails } from '@/components/TicketDetails'
import { Page } from '@/components/layout/Page'
import {
  Ticket,
  getAllTicketsForApproval,
  updateTicket,
} from '@/src/api/ticket'
import { isAdmin } from '@/src/auth/roles'
import { fromTimestamp, toTimestamp } from '@/src/utils/date'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { useEffect, useState } from 'react'
import { MdEditDocument } from 'react-icons/md'

const TicketsForApproval = ({
  initialTickets,
}: {
  initialTickets: Array<Ticket>
}) => {
  const [tickets, setTickets] = useState<Array<Ticket>>(initialTickets)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    getAllTicketsForApproval().then(t => setTickets(t))
  }, [currentTicket])

  // modal overlay that will show the ticket
  const { isOpen, onOpen, onClose } = useDisclosure()

  const approve = async () => {
    // set the ticket as approved
    await updateTicket({
      ...currentTicket,
      approvedAt: toTimestamp(new Date()),
    })
    setCurrentTicket(null)
    onClose()
  }

  const reject = () => {
    // set the ticket as rejected
    onClose()
  }

  return (
    <>
      <H2>Tickets to be Approved</H2>
      {tickets.length === 0 ? (
        'There are currently no tickets to approve. 🎉'
      ) : (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Date</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tickets.map(t => (
                  <Tr key={t.uid}>
                    <Td>
                      <Button
                        onClick={() => {
                          setCurrentTicket(t)
                          onOpen()
                        }}
                      >
                        <MdEditDocument />
                      </Button>
                    </Td>
                    <Td>{fromTimestamp(t.ticketDate)}</Td>
                    <Td>{t.email}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Approve Ticket</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TicketDetails currentTicket={currentTicket!} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={approve}>
                  Approve
                </Button>
                <Button colorScheme="red" variant="outline" onClick={reject}>
                  Reject
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  )
}

export default function Index({
  approvalTickets,
}: {
  approvalTickets: Array<Ticket>
}) {
  return (
    <Page title="Dashboard">
      <TicketsForApproval initialTickets={approvalTickets} />
    </Page>
  )
}

// @ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, {})
  const adminUser = isAdmin(session?.user?.email)
  const approvalTickets = await getAllTicketsForApproval()

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  if (!adminUser) {
    return {
      redirect: {
        destination: '/daily-time-ticket',
        permanent: false,
      },
    }
  }

  return {
    props: {
      approvalTickets,
      adminUser: isAdmin(session.user?.email),
    },
  }
}

Index.auth = true
