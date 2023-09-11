import { useEffect, useState } from 'react'

export const useData = <T>(func: () => Promise<Array<T>>) => {
  const [data, setData] = useState<Array<T>>([])

  useEffect(() => {
    func().then(resp => {
      setData(resp)
    })
  }, [func])

  return data
}
