const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const getCurrentDate = () => {
  return formatDate(new Date())
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
  const date = new Date(Number(timestamp))
  // Hours part from the timestamp
  const hours = date.getHours()
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes()
  // Seconds part from the timestamp
  const seconds = '0' + date.getSeconds()
  // Will display time in 10:30:23 format
  return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2)
}
