export const set = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const get = (key: string): any | null => {
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  return null
}
