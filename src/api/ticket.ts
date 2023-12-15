import { write } from 'fs'
import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'
import { useSession } from 'next-auth/react'
import { getCompany } from './companies'
import { getEquipment } from './equipment'
import { getTruck } from './trucks'
import { encodeEmail } from '../utils/strings'
import { getUserMeta } from './users'
import { toTimestamp } from '../utils/date'

export type ChargeType = 'PO #' | 'LSD' | 'Job #'
export interface Ticket {
  uid: string
  email: string
  name?: string
  phone?: string
  ticketDate: string
  company: string
  locations: Array<{
    chargeType: ChargeType
    location: string
    hours?: number
  }>
  equipment: Array<{
    name?: string
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
  // admin users can reject a ticket with a reason
  rejectedAt?: string
  rejectionReason?: string
  ticketNumber: number
  status?: 'approved' | 'rejected' | 'pending'
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

export const approveTicket = async (ticket: Ticket): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: {
        approvedAt: ticket.approvedAt,
        rejectedAt: '',
        rejectionReason: '',
      },
      path: PATH(ticket.email as string),
      id: ticket.id as string,
      forceUpdate: true,
    })
    return true
  } catch (error) {
    console.error(`Error approving ticket. Error: ${error}`)
    return false
  }
}

export const rejectTicket = async (ticket: Ticket): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: {
        rejectedAt: ticket.rejectedAt,
        rejectionReason: ticket.rejectionReason,
      },
      path: PATH(ticket.email as string),
      id: ticket.id as string,
      forceUpdate: true,
    })
    return true
  } catch (error) {
    console.error(`Error rejecting ticket. Error: ${error}`)
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
    let t = await getFromDatabase(`${PATH(ticket.email)}/${ticket.id}`)
    if (!t) {
      return null
    }

    // go through and map the keys to their proper names for equipment, company, etc.
    let index = 0
    // @ts-ignore
    for (const equipment of t.equipment) {
      const [eq, attachment] = await Promise.all([
        getEquipment(equipment.id),
        getEquipment(equipment.attachment),
      ])
      // @ts-ignore
      t.equipment[index].name = eq.name
      // @ts-ignore
      t.equipment[index].attachment = attachment.name ?? ''
      index++
    }

    const [company, truck, trailer, userMeta] = await Promise.all([
      getCompany(t.company as string),
      getTruck(t.truck as string),
      getEquipment(t.trailer as string),
      getUserMeta(t.email as string),
    ])
    t.company = company?.name
    t.truck = truck?.name
    t.trailer = trailer?.name
    t.name = userMeta?.name
    t.phone = userMeta?.phone

    t.status = t.approvedAt ? 'approved' : t.rejectedAt ? 'rejected' : 'pending'

    return t as unknown as Ticket
  } catch (error) {
    console.error(`Error creating ticket. Error: ${error}`)
    return null
  }
}

export const getAllTickets = async (email?: string): Promise<Array<Ticket>> => {
  try {
    const path = email ? PATH(email) : 'tickets'
    let tickets = await getFromDatabase(path)
    if (!tickets) {
      return []
    }

    if (!email) {
      tickets = flattenObject(tickets)
    }

    const ticketsAsArray = objectToArray<Ticket>(
      tickets,
      'ticketNumber',
      'number',
    )

    let index = 0
    for (const ticket of ticketsAsArray) {
      const comp = await getCompany(ticket.company)
      ticketsAsArray[index].company = comp?.name || '-'
      ticketsAsArray[index].status = ticket.approvedAt
        ? 'approved'
        : ticket.rejectedAt
        ? 'rejected'
        : 'pending'

      index++
    }

    return ticketsAsArray
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
