import { getFromDatabase, writeToDatabase } from '.'
import { objectToArray } from '../utils/arrays'
import { encodeEmail } from '../utils/strings'

export type UserMeta = {
  email: string
  name: string
  phone?: string
  address?: string
  disabledAt: string | null
  lastActive?: number | null
  id?: string
}

const PATH = 'user_meta'

export const upsertUserMeta = async (user: UserMeta): Promise<boolean> => {
  const id = encodeEmail(user.email)
  try {
    await writeToDatabase({ data: user, path: PATH, id })
    return true
  } catch (error) {
    console.error(`Error upserting user meta. Error: ${error}`)
    return false
  }
}

export const getUserMeta = async (email: string): Promise<UserMeta | null> => {
  const id = encodeEmail(email)
  try {
    const meta = await getFromDatabase(`${PATH}/${id}`)
    if (!meta) {
      return null
    }
    return meta as unknown as UserMeta
  } catch (error) {
    console.error(`Error getting usermeta. Error: ${error}`)
    return null
  }
}

export const getAllUserMeta = async (): Promise<Array<UserMeta>> => {
  try {
    const users = await getFromDatabase(PATH)
    if (!users) {
      return []
    }

    return objectToArray<UserMeta>(users, 'name')
  } catch (error) {
    console.error(`Error getting all users. Error: ${error}`)
    return []
  }
}
