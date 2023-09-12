export const objectToArray = <T>(
  obj: Record<string, unknown>,
  sortKey: string,
): Array<T> => {
  const array = Object.values(obj)
  // sort alphabetically
  // @ts-expect-error
  const sortedArray = array.sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
  return sortedArray as unknown as Array<T>
}
