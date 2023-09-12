import { Page } from '@/components/layout/Page'
import { getAllEquipment, Equipment } from '@/src/api/equipment'
import { useData } from '@/src/hooks/useData'
import { fromTimestamp } from '@/src/utils/date'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react'

export default function Equipment() {
  const allEquipment = useData<Equipment>(getAllEquipment)
  const equipment = allEquipment.filter(e => !e.isTrailer && !e.isAttachment)
  const attachments = allEquipment.filter(e => e.isAttachment)
  const trailers = allEquipment.filter(e => e.isTrailer)

  return (
    <Page title="Equipment">
      <div className="mb-6 lg:mb-12">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Equipment</Th>
                <Th>Last Updated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {equipment.map(equipment => (
                <Tr key={equipment.id}>
                  <Td>{equipment.name}</Td>
                  <Td>{fromTimestamp(equipment.updatedAt!)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      <div className="mb-6 lg:mb-12">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Attachment</Th>
                <Th>Last Updated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attachments.map(attachment => (
                <Tr key={attachment.id}>
                  <Td>{attachment.name}</Td>
                  <Td>{fromTimestamp(attachment.updatedAt!)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Trailer</Th>
              <Th>Last Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trailers.map(equipment => (
              <Tr key={equipment.id}>
                <Td>{equipment.name}</Td>
                <Td>{fromTimestamp(equipment.updatedAt!)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Page>
  )
}
