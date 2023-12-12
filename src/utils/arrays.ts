const sortArray = <T>(
  array: Array<any>,
  sortKey: string,
  keyType: 'number' | 'string',
) => {
  if (keyType === 'number') {
    const sortedArray = array.sort((a, b) => b[sortKey] - a[sortKey])
    return sortedArray as unknown as Array<T>
  } else {
    const sortedArray = array.sort((a, b) =>
      a[sortKey].localeCompare(b[sortKey]),
    )
    return sortedArray as unknown as Array<T>
  }
}

export const objectToArray = <T>(
  obj: Record<string, unknown>,
  sortKey: string,
  keyType: 'number' | 'string' = 'string',
): Array<T> => {
  const array = Object.values(obj)
  // sort alphabetically or numerically
  const sortedArray = sortArray(array, sortKey, keyType)
  return sortedArray as unknown as Array<T>
}
