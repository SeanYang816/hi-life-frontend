import { useState, useCallback, useEffect } from 'react'
import { apiGetGroups } from 'api'
import { SelectOptionProps } from 'types'
import { UseGroupOptionsReturnType } from 'types/hooks'
import { SelectChangeEvent } from '@mui/material'

export const useGroupOptions = (initialPageSize = 25): UseGroupOptionsReturnType => {
  const [options, setOptions] = useState<SelectOptionProps[]>([])
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)
  const [value, setValue] = useState<number | null>(null)

  const fetchData = useCallback(async (size: number) => {
    try {
      const [groups, total] = await apiGetGroups({
        pageNum: 0,
        pageSize: size
      })

      const options = groups.map((item) => ({
        label: item.name,
        value: item.id
      }))

      setTotal(total)
      setOptions(options)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }, [])

  useEffect(() => {
    fetchData(pageSize)
  }, [fetchData, pageSize])

  const handleLoadMore = () => {
    setPageSize((prevSize) => prevSize + initialPageSize)
  }

  const handleChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    const newValue = event.target.value as number
    setValue(newValue)
  }

  return {
    options,
    pageSize,
    total,
    handleLoadMore,
    value,
    onChange: handleChange
  }
}
