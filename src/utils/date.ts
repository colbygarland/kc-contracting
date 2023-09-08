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
