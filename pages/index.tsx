import { H2 } from '@/components/Headings'
import { Page } from '@/components/layout/Page'
import {
  Ticket,
  getAllTicketsForApproval,
  updateTicket,
} from '@/src/api/ticket'
import { isAdmin } from '@/src/auth/roles'
import { store } from '@/src/store/store'
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
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  MdAssignmentAdd,
  MdAssignmentReturn,
  MdArticle,
  MdSafetyCheck,
  MdEditDocument,
  MdSupervisorAccount,
} from 'react-icons/md'

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
                <TableContainer mb={4}>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Company</Th>
                        <Th>Email</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{fromTimestamp(currentTicket?.ticketDate)}</Td>
                        <Td>{currentTicket?.company}</Td>
                        <Td>{currentTicket?.email}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer mb={4}>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Location</Th>
                        <Th>Type</Th>
                        <Th>Hours</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentTicket?.locations.map(location => (
                        <Tr key={location.location}>
                          <Td>{location.location}</Td>
                          <Td>{location.chargeType}</Td>
                          <Td>{location.hours}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer mb={4}>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Equipment</Th>
                        <Th>Attachment</Th>
                        <Th>Hours</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentTicket?.equipment.map(e => (
                        <Tr key={e.id}>
                          <Td>{e.id}</Td>
                          <Td>{e.attachment || '-'}</Td>
                          <Td>{e.hours}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer mb={4}>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Truck</Th>
                        <Th>Trailer</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{currentTicket?.truck || '-'}</Td>
                        <Td>{currentTicket?.trailer || '-'}</Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer mb={4}>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Labour Hours</Th>
                        <Th>Travel Hours</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{currentTicket?.labourHours}</Td>
                        <Td>{currentTicket?.travelHours}</Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <Table size="sm" layout="fixed">
                    <Thead>
                      <Tr>
                        <Th>Description</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{currentTicket?.description || '-'}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
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
  const session = useSession()
  const adminUser = isAdmin(session.data?.user?.email)

  return (
    <Page title="Dashboard">
      <div className="lg:grid grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 mb-12 lg:mb-0">
          {adminUser ? (
            <TicketsForApproval initialTickets={approvalTickets} />
          ) : null}
        </div>
        <div className="lg:col-span-1">
          <div className="hidden lg:block">
            <H2>Quick Actions</H2>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b-2 border-b-slate-50">
            <Button>
              <MdAssignmentAdd className="mr-2" /> Create Ticket
            </Button>
            <Button>
              <MdAssignmentReturn className="mr-2" /> Edit Ticket
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b-2 border-b-slate-50">
            <Button>
              <MdArticle className="mr-2" /> Equipment List
            </Button>
            <Button>
              <MdArticle className="mr-2" /> Truck / Trailer
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b-2 border-b-slate-50">
            <Button>
              <MdSafetyCheck className="mr-2" /> Safety Sheets
            </Button>
            <Button>
              <MdEditDocument className="mr-2" /> Permits
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b-2 border-b-slate-50">
            <Button>
              <MdSupervisorAccount className="mr-2" /> Employee Info
            </Button>
            <Button>
              <MdSupervisorAccount className="mr-2" /> Practice Ticket
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}

export async function getServerSideProps() {
  const approvalTickets = await getAllTicketsForApproval()
  return {
    props: {
      approvalTickets,
    },
  }
}

Index.auth = true
