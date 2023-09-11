import { getDatabase, ref, push, get, child, set } from 'firebase/database'
import { generateId } from '../utils/strings'
import { toTimestamp } from '../utils/date'

const db = getDatabase()

// Handles creating, updating, and deleting.
// Send `null` data to delete.
// Send an id to update/delete.
export const writeToDatabase = async ({
  data,
  path,
  id,
}: {
  data: any
  path: string
  id?: string
}): Promise<void> => {
  const now = toTimestamp(new Date())
  const generatedId = id ? id : generateId(JSON.stringify(data))
  set(ref(db, `/data/${path}/${generatedId}`), {
    ...data,
    ...(data && {
      updatedAt: now,
      deletedAt: null,
      id: generatedId,
    }),
    ...(!id && {
      createdAt: now,
    }),
  })
}

export const getFromDatabase = async (
  key: string,
): Promise<Record<string, unknown> | null> => {
  const snapshot = await get(child(ref(db), `/data/${key}`))
  if (snapshot.exists()) {
    return snapshot.val()
  } else {
    return null
  }
}
