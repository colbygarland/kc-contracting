import { Ticket } from '@/src/api/ticket'
import { fromTimestamp } from '@/src/utils/date'
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Alert } from './Alert'

export const TicketDetails = ({ currentTicket }: { currentTicket: Ticket }) => {
  return (
    <>
      {currentTicket.rejectedAt && (
        <div className="mb-6">
          <Alert
            title="Ticket Rejected"
            message={`Reason: ${currentTicket.rejectionReason as string}`}
            type="danger"
          />
        </div>
      )}
      <TableContainer mb={4}>
        <Table size="sm" layout="fixed">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{currentTicket?.name}</Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer mb={4}>
        <Table size="sm" layout="fixed">
          <Thead>
            <Tr>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{currentTicket?.phone}</Td>
              <Td>{currentTicket?.email}</Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer mb={4}>
        <Table size="sm" layout="fixed">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Company</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{fromTimestamp(currentTicket?.ticketDate)}</Td>
              <Td>{currentTicket?.company}</Td>
              <Td></Td>
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
                <Td>{e.name}</Td>
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
    </>
  )
}
