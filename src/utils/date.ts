const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const getCurrentDate = () => {
  return formatDate(new Date())
}
