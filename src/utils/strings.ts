import MurmurHash3 from 'imurmurhash'

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}

export const generateId = (seed: string) => {
  return MurmurHash3(seed).result().toString()
}
