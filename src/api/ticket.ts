import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'

export type ChargeType = 'PO #' | 'LSD' | 'Job #'
export interface Ticket {
  uid: string
  email: string
  ticketDate: string
  company: string
  locations: Array<{
    chargeType: ChargeType
    location: string
    hours?: number
  }>
  equipment: Array<{
    id: string
    hours: number
    attachment?: string
  }>
  truck: string
  trailer: string
  labourHours: number
  travelHours?: number
  description?: string
  id?: string
  createdAt?: string
  updatedAt?: string
  // If this is set, consider the ticket deleted
  deletedAt?: string | null
  // If this is set, consider the ticket approved and don't show it anymore to the user
  approvedAt?: string
}

const PATH = 'tickets'

export const createTicket = async (ticket: Ticket): Promise<boolean> => {
  try {
    await writeToDatabase({ data: ticket, path: PATH })
    return true
  } catch (error) {
    console.error(`Error creating ticket. Error: ${error}`)
    return false
  }
}

export const updateTicket = async (
  ticket: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: ticket,
      path: PATH,
      id: ticket.id as string,
    })
    return true
  } catch (error) {
    console.error(`Error creating ticket. Error: ${error}`)
    return false
  }
}

export const deleteTicket = async (ticketId: string) => {
  try {
    await writeToDatabase({
      data: null,
      path: PATH,
      id: ticketId,
    })
    return true
  } catch (error) {
    console.error(`Error deleting ticket. Error: ${error}`)
    return false
  }
}

export const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const ticket = await getFromDatabase(`${PATH}/${ticketId}`)
    if (!ticket) {
      return null
    }
    return ticket as unknown as Ticket
  } catch (error) {
    console.error(`Error creating ticket. Error: ${error}`)
    return null
  }
}

export const getAllTickets = async (): Promise<Array<Ticket>> => {
  try {
    const ticket = await getFromDatabase(PATH)
    if (!ticket) {
      return []
    }

    return objectToArray<Ticket>(ticket, 'ticketDate', 'number')
  } catch (error) {
    console.error(`Error getting all tickets. Error: ${error}`)
    return []
  }
}

// todo: write a more efficient version of this
export const getAllTicketsForApproval = async (): Promise<Array<Ticket>> => {
  const allTickets = await getAllTickets()
  return allTickets.filter(ticket => !ticket.approvedAt)
}
