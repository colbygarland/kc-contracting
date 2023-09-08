import { Alert } from '@/components/Alert'
import { Page } from '@/components/layout/Page'
import { store } from '@/src/store/store'
import { getGreeting } from '@/src/utils/date'
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  MdAssignmentAdd,
  MdAssignmentReturn,
  MdArticle,
  MdSafetyCheck,
  MdEditDocument,
  MdSupervisorAccount,
} from 'react-icons/md'

export default function Index() {
  const { user } = store
  const greeting = getGreeting()

  return (
    <Page title="Dashboard">
      <div className="mb-10">
        <p className="font-bold text-slate-700">
          {greeting}, {user?.displayName}!
        </p>
      </div>
      <div className="lg:grid grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Alert
              title="Warning"
              message="You have 3 tickets that need attention."
              type="warning"
            />
          </div>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Company</Th>
                  <Th>Location</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>2023-09-08</Td>
                  <Td>Birchcliff</Td>
                  <Td>23-23-566-1</Td>
                  <Td>
                    <Button>Edit</Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td>2023-09-08</Td>
                  <Td>CNRL</Td>
                  <Td>23-23-566-1</Td>
                  <Td>
                    <Button>Edit</Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td>2023-09-08</Td>
                  <Td>Birchcliff</Td>
                  <Td>23-23-566-1</Td>
                  <Td>
                    <Button>Edit</Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </div>
        <div className="lg:col-span-1">
          <div className="hidden lg:block">
            <h2 className="mb-4 text-xl text-slate-800 font-bold">
              Quick Actions
            </h2>
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
          </div>
        </div>
      </div>
    </Page>
  )
}
