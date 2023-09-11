import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'

export type ChargeType = 'PO #' | 'LSD' | 'Job #'
export interface Ticket {
  date: string
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
  ticket: string
  trailer: string
  labourHours: number
  travelHours?: number
  description?: string
  id?: string
  createdAt?: string
  updatedAt?: string
  // If this is set, consider the ticket deleted
  deletedAt?: string | null
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

    return objectToArray<Ticket>(ticket, 'name')
  } catch (error) {
    console.error(`Error getting all ticket. Error: ${error}`)
    return []
  }
}
