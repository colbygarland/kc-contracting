import { TicketDetails } from '@/components/TicketDetails'
import { Page } from '@/components/layout/Page'
import { Ticket, getAllTickets } from '@/src/api/ticket'
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
} from '@chakra-ui/react'
import { reject } from 'cypress/types/bluebird'
import { useState } from 'react'
import { MdEditDocument } from 'react-icons/md'

export default function Tickets({ tickets }: { tickets: Array<Ticket> }) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Page title="Tickets">
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
                <Td>{ticket.ticketNumber}</Td>
                <Td>{ticket.ticketDate}</Td>
                <Td>{ticket.company}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      setCurrentTicket(ticket)
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
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TicketDetails currentTicket={currentTicket!} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export async function getServerSideProps() {
  const tickets = await getAllTickets()
  return {
    props: {
      tickets,
    },
  }
}
