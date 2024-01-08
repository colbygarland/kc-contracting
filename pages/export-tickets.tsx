import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import {
  Button,
  ButtonGroup,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Ticket, getAllTickets } from '@/src/api/ticket'
import { UserMeta, getAllUserMeta } from '@/src/api/users'
import { formatDate } from '@/src/utils/date'
import { Loader } from '@/components/Loader'
import download from 'downloadjs'
import { createPDF } from '@/src/utils/pdf'

export default function ExportTickets({
  employees,
}: {
  employees: Array<UserMeta>
}) {
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<Array<Ticket>>([])
  const [emptyMessage, setEmptyMessage] = useState(
    'Select a date range to export tickets.',
  )
  const [dates, setDates] = useState<Record<string, Date | null>>({
    startDate: null,
    endDate: null,
  })
  const now = new Date()
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const onSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    console.log(formJson)

    const allTickets = await getAllTickets(
      formJson['employee'] === '*'
        ? undefined
        : (formJson['employee'] as string),
    )

    // filter by date range selected
    const start = new Date(formJson['start_date'] as string)
    const end = new Date(formJson['end_date'] as string)
    // set the dates to be used later by the export button
    setDates({
      startDate: start,
      endDate: end,
    })
    const filteredTickets = allTickets.filter(ticket => {
      const dateCheck = formatDate(new Date(ticket.ticketDate))

      const d1 = formatDate(start).split('-')
      const d2 = formatDate(end).split('-')
      const c = dateCheck.split('-')

      const from = new Date(
        parseInt(d1[2]),
        parseInt(d1[1]) - 1,
        parseInt(d1[0]),
      ) // -1 because months are from 0 to 11
      const to = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]))
      const check = new Date(parseInt(c[2]), parseInt(c[1]) - 1, parseInt(c[0]))

      return check >= from && check < to
    })

    setTickets(filteredTickets)
    if (filteredTickets.length === 0) {
      setEmptyMessage('No tickets found with that criteria.')
    }
    setLoading(false)
  }

  const exportTickets = async () => {
    const start = formatDate(dates!.startDate!)
    const end = formatDate(dates!.endDate!)
    const pdf = await createPDF(tickets, start, end)
    download(pdf, `tickets-${start}-${end}.pdf`, 'application/pdf')
  }

  return (
    <Page title="Export Tickets">
      {loading && <Loader />}
      <div className="lg:grid grid-cols-3 gap-10">
        <div className="col-span-2">
          {tickets.length > 0 ? (
            <TableContainer>
              <Table layout="fixed">
                <Thead>
                  <Tr>
                    <Th>Ticket Number</Th>
                    <Th>Date</Th>
                    <Th>Company</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tickets.map(ticket => (
                    <Tr key={ticket.id}>
                      <Td>{ticket.ticketNumber}</Td>
                      <Td>{ticket.ticketDate}</Td>
                      <Td>{ticket.company}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            emptyMessage
          )}
        </div>
        <div className="">
          <form onSubmit={onSubmit}>
            <FormGroup label="Start date" required>
              <Input
                type="date"
                name="start_date"
                defaultValue={formatDate(defaultStartDate)}
                required
              />
            </FormGroup>
            <FormGroup label="End date" required>
              <Input
                type="date"
                name="end_date"
                defaultValue={formatDate(defaultEndDate)}
                required
              />
            </FormGroup>
            <FormGroup label="Employee(s)" required>
              <Select name="employee" required>
                <option value="*">All employees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <ButtonGroup>
              <Button type="submit" colorScheme="green">
                Submit
              </Button>
              {tickets.length > 0 && (
                <Button
                  type="button"
                  colorScheme="blue"
                  onClick={exportTickets}
                >
                  Export Tickets
                </Button>
              )}
            </ButtonGroup>
          </form>
        </div>
      </div>
    </Page>
  )
}

export async function getServerSideProps() {
  const employees = await getAllUserMeta()
  return {
    props: {
      employees,
    },
  }
}
