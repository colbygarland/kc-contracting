import { H2 } from '@/components/Headings'
import { Loader } from '@/components/Loader'
import { TicketDetails } from '@/components/TicketDetails'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { Ticket, getAllTicketsForApproval, getTicket } from '@/src/api/ticket'
import { isAdmin } from '@/src/auth/roles'
import { toTimestamp, fromTimestamp } from '@/src/utils/date'
import {
  useDisclosure,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { useState, useEffect, ChangeEvent } from 'react'
import { MdEditDocument } from 'react-icons/md'

export default function ApproveTickets({
  approvalTickets,
}: {
  approvalTickets: Array<Ticket>
}) {
  const [tickets, setTickets] = useState<Array<Ticket>>(approvalTickets)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllTicketsForApproval().then(t => setTickets(t))
  }, [currentTicket])

  // modal overlay that will show the ticket
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: rejectIsOpen,
    onOpen: rejectOnOpen,
    onClose: rejectOnClose,
  } = useDisclosure()

  const approve = async () => {
    // set the ticket as approved
    currentTicket!.approvedAt = toTimestamp(new Date()) as unknown as string
    // @ts-ignore
    await approveTicket(currentTicket)
    setCurrentTicket(null)
    onClose()
  }

  const rejectConfirm = async (e: ChangeEvent<HTMLFormElement>) => {
    // set the ticket rejected in the db
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    currentTicket!.rejectionReason = formJson['rejectionReason'] as string
    currentTicket!.rejectedAt = formJson['rejectedAt'] as string
    // @ts-ignore
    await rejectTicket(currentTicket)
    rejectOnClose()
    onClose()
  }

  return (
    <Page title="Approve Tickets">
      {loading && <Loader />}
      {tickets.length === 0 ? (
        'There are currently no tickets to approve. 🎉'
      ) : (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Ticket Number</Th>
                  <Th>Date</Th>
                  <Th>Email</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {tickets.map(t => (
                  <Tr key={t.uid}>
                    <Td>{t.ticketNumber}</Td>
                    <Td>{fromTimestamp(t.ticketDate)}</Td>
                    <Td>{t.email}</Td>
                    <Td>
                      <Button
                        onClick={async () => {
                          setLoading(true)
                          const ticket = await getTicket(t)
                          setCurrentTicket(ticket)
                          onOpen()
                          setLoading(false)
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
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Approve Ticket #{currentTicket?.ticketNumber}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TicketDetails currentTicket={currentTicket!} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={approve}>
                  Approve
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={rejectOnOpen}
                >
                  Reject
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={rejectIsOpen} onClose={rejectOnClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Reject Ticket #{currentTicket?.ticketNumber}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={rejectConfirm}>
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
                </form>
              </ModalBody>
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
