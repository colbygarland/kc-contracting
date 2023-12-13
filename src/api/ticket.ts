import { write } from 'fs'
import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'
import { useSession } from 'next-auth/react'

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
  ticketNumber: number
}

const encodeEmail = (email: string) => {
  return email.replaceAll('.', '_____')
}

const decodeEmail = (email: string) => {
  return email.replaceAll('_____', '.')
}

const PATH = (email: string) => {
  return `tickets/${encodeEmail(email)}`
}

export const createTicket = async (ticket: Ticket): Promise<boolean> => {
  try {
    await writeToDatabase({ data: ticket, path: PATH(ticket.email) })
    // update the last created ticket
    await writeToDatabase({
      data: ticket,
      path: '/lastCreatedTicket',
      id: 'lastCreatedTicket',
    })
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
      path: PATH(ticket.email as string),
      id: ticket.id as string,
    })
    return true
  } catch (error) {
    console.error(`Error updating ticket. Error: ${error}`)
    return false
  }
}

export const deleteTicket = async (ticket: Ticket) => {
  try {
    await writeToDatabase({
      data: null,
      path: PATH(ticket.email),
      id: ticket.id,
    })
    return true
  } catch (error) {
    console.error(`Error deleting ticket. Error: ${error}`)
    return false
  }
}

export const getTicket = async (ticket: Ticket): Promise<Ticket | null> => {
  try {
    const t = await getFromDatabase(`${PATH(ticket.email)}/${ticket.id}`)
    if (!t) {
      return null
    }
    return t as unknown as Ticket
  } catch (error) {
    console.error(`Error creating ticket. Error: ${error}`)
    return null
  }
}

export const getAllTickets = async (email?: string): Promise<Array<Ticket>> => {
  try {
    const path = email ? PATH(email) : 'tickets'
    let ticket = await getFromDatabase(path)
    if (!ticket) {
      return []
    }

    if (!email) {
      ticket = flattenObject(ticket)
    }

    return objectToArray<Ticket>(ticket, 'ticketDate', 'number')
  } catch (error) {
    console.error(`Error getting all tickets. Error: ${error}`)
    return []
  }
}

const flattenObject = (obj: Record<string, any>) => {
  const result = {}

  for (const email in obj) {
    const tickets = obj[email]

    for (const ticketId in tickets) {
      // @ts-expect-error
      result[ticketId] = tickets[ticketId]
    }
  }

  return result
}

// todo: write a more efficient version of this
export const getAllTicketsForApproval = async (): Promise<Array<Ticket>> => {
  const allTickets = await getAllTickets()
  return allTickets.filter(ticket => !ticket.approvedAt)
}

export const getLastTicketCreated = async (): Promise<Ticket | null> => {
  const ticket = await getFromDatabase('lastCreatedTicket/lastCreatedTicket')
  if (ticket) {
    return ticket as unknown as Ticket
  }
  return null
}
