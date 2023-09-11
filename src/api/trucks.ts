import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'

export interface Truck {
  name: string
  id?: string
  createdAt?: string
  updatedAt?: string
  // If this is set, consider the truck deleted
  deletedAt?: string | null
}

const PATH = 'trucks'

export const createTruck = async (
  truck: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({ data: truck, path: PATH })
    return true
  } catch (error) {
    console.error(`Error creating truck. Error: ${error}`)
    return false
  }
}

export const updateTruck = async (
  truck: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: truck,
      path: PATH,
      id: truck.id as string,
    })
    return true
  } catch (error) {
    console.error(`Error creating truck. Error: ${error}`)
    return false
  }
}

export const deleteTruck = async (truckId: string) => {
  try {
    await writeToDatabase({
      data: null,
      path: PATH,
      id: truckId,
    })
    return true
  } catch (error) {
    console.error(`Error deleting truck. Error: ${error}`)
    return false
  }
}

export const getTruck = async (truckId: string): Promise<Truck | null> => {
  try {
    const truck = await getFromDatabase(`${PATH}/${truckId}`)
    if (!truck) {
      return null
    }
    return truck as unknown as Truck
  } catch (error) {
    console.error(`Error creating truck. Error: ${error}`)
    return null
  }
}

export const getAllTrucks = async (): Promise<Array<Truck>> => {
  try {
    const truck = await getFromDatabase(PATH)
    if (!truck) {
      return []
    }

    return objectToArray<Truck>(truck, 'name')
  } catch (error) {
    console.error(`Error getting all truck. Error: ${error}`)
    return []
  }
}
