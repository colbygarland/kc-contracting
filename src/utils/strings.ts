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

export const encodeEmail = (email: string) => {
  return email.replaceAll('.', '_____')
}

export const decodeEmail = (email: string) => {
  return email.replaceAll('_____', '.')
}
