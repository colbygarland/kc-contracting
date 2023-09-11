const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const getCurrentDate = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return formatDate(new Date(now.getTime() - offset * 60 * 1000))
}

export const getGreeting = () => {
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 12) {
    return 'Good morning'
  } else if (curHr < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

export const toTimestamp = (date: Date) => {
  return Math.floor(date.getTime())
}

export const fromTimestamp = (timestamp: number | string) => {
  return new Date(timestamp).toLocaleString()
}
