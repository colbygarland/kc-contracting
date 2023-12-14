import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'

export interface Equipment {
  name: string
  isTrailer?: boolean
  isAttachment?: boolean
  rate: number
  rateType: 'hourly' | 'daily'
  id?: string
  createdAt?: string
  updatedAt?: string
  // If this is set, consider the equipment deleted
  deletedAt?: string | null
}

const PATH = 'equipment'

export const createEquipment = async (
  equipment: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({ data: equipment, path: PATH })
    return true
  } catch (error) {
    console.error(`Error creating equipment. Error: ${error}`)
    return false
  }
}

export const updateEquipment = async (
  equipment: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: equipment,
      path: PATH,
      id: equipment.id as string,
    })
    return true
  } catch (error) {
    console.error(`Error creating equipment. Error: ${error}`)
    return false
  }
}

export const deleteEquipment = async (equipmentId: string) => {
  try {
    await writeToDatabase({
      data: null,
      path: PATH,
      id: equipmentId,
    })
    return true
  } catch (error) {
    console.error(`Error deleting equipment. Error: ${error}`)
    return false
  }
}

export const getEquipment = async (
  equipmentId: string,
): Promise<Equipment | null> => {
  try {
    const equipment = await getFromDatabase(`${PATH}/${equipmentId}`)
    if (!equipment) {
      return null
    }
    return equipment as unknown as Equipment
  } catch (error) {
    console.error(`Error creating equipment. Error: ${error}`)
    return null
  }
}

export const getAllEquipment = async (): Promise<Array<Equipment>> => {
  try {
    const equipment = await getFromDatabase(PATH)
    if (!equipment) {
      return []
    }

    return objectToArray<Equipment>(equipment, 'name')
  } catch (error) {
    console.error(`Error getting all equipment. Error: ${error}`)
    return []
  }
}
