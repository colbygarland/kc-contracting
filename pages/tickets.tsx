import { Loader } from '@/components/Loader'
import { TicketDetails } from '@/components/TicketDetails'
import { Page } from '@/components/layout/Page'
import { Ticket, getAllTickets, getTicket } from '@/src/api/ticket'
import {
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  ModalHeader,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  List,
  ListItem,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { useState } from 'react'
import { MdEditDocument } from 'react-icons/md'

const Pill = ({
  status,
  children,
}: {
  status: 'approved' | 'rejected' | 'pending'
  children: React.ReactNode
}) => {
  const bg = {
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
    pending: '',
  }[status]
  return (
    <span
      className={`text-xs text-white px-4 py-2 rounded-full shadow inline-block ml-2 ${bg}`}
    >
      {children}
    </span>
  )
}

const getCallBackground = (ticket: Ticket) => {
  if (ticket.approvedAt) {
    return 'approved'
  }
  if (ticket.rejectedAt) {
    return 'rejected'
  }

  return 'pending'
}

export default function Tickets({ tickets }: { tickets: Array<Ticket> }) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cellBackground = (
    status: 'approved' | 'rejected' | 'pending' | undefined,
  ) => {
    if (!status) {
      return ''
    }
    return {
      approved: 'bg-emerald-50',
      rejected: 'bg-red-50',
      pending: '',
    }[status]
  }

  return (
    <Page title="Tickets">
      {loading && <Loader />}
      {tickets.length === 0 ? (
        <>
          <div className="mb-4">You currently have no tickets created.</div>
          <Link href="/daily-time-ticket">
            <Button>Create Ticket</Button>
          </Link>
        </>
      ) : (
        <>
          <div className="lg:hidden">
            <List>
              {tickets.map(ticket => (
                <ListItem key={ticket.id} mb={4}>
                  <div className={cellBackground(ticket.status)}>
                    <div>
                      <strong>Ticket #{ticket.ticketNumber}</strong>
                    </div>
                    <div>
                      <strong>Date:</strong> {ticket.ticketDate}
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <div className="hidden lg:block">
            <TableContainer>
              <Table layout="fixed">
                <Thead>
                  <Tr>
                    <Th>Ticket Number</Th>
                    <Th>Date</Th>
                    <Th>Company</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tickets.map(ticket => (
                    <Tr key={ticket.id}>
                      <Td className={cellBackground(ticket.status)}>
                        {ticket.ticketNumber}
                        {ticket.rejectedAt && (
                          <Pill status="rejected">REJECTED</Pill>
                        )}
                        {ticket.approvedAt && (
                          <Pill status="approved">APPROVED</Pill>
                        )}
                      </Td>
                      <Td className={cellBackground(ticket.status)}>
                        {ticket.ticketDate}
                      </Td>
                      <Td className={cellBackground(ticket.status)}>
                        {ticket.company}
                      </Td>
                      <Td className={cellBackground(ticket.status)}>
                        <Button
                          onClick={async () => {
                            setLoading(true)
                            const t = await getTicket(ticket)
                            setCurrentTicket(t)
                            setLoading(false)
                            onOpen()
                          }}
                        >
                          <MdEditDocument />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Ticket #{currentTicket?.ticketNumber}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TicketDetails currentTicket={currentTicket!} />
              </ModalBody>
              <ModalFooter>
                {!currentTicket?.approvedAt && (
                  <Link href={`/daily-time-ticket?id=${currentTicket?.id}`}>
                    <Button colorScheme="green" mr={4}>
                      Update Ticket
                    </Button>
                  </Link>
                )}
                <Button colorScheme="blue" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Page>
  )
}

// @ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, {})
  const tickets = await getAllTickets(session?.user?.email as string)
  return {
    props: {
      tickets,
    },
  }
}
