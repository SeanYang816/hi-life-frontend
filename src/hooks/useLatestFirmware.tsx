import { useState, useEffect } from 'react'
import { apiGetFirmwares } from 'api'
import { GetFirmwareResponseType } from 'types/api'

type UseLatestFirmwareReturnType = {
  data: GetFirmwareResponseType;
  error: string | null;
  loading: boolean;
}

export const useLatestFirmware = (): UseLatestFirmwareReturnType => {
  const [data, setData] = useState<GetFirmwareResponseType>({
    id: 0,
    fileName: '',
    createdAt: new Date(),
    creator: {
      username: ''
    }
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchLatestFirmwareVersion = async () => {
    setLoading(true)
    try {
      const response = await apiGetFirmwares({
        sort: [{ id: 'createdAt', desc: true }],
        page_num: 0,
        page_size: 1
      })
      setData(response[0][0]) // Assuming the API response structure fits
      setError(null) // Clear any previous errors
    } catch (err) {
      setError('Failed to fetch the latest firmware version.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestFirmwareVersion() // Fetch firmware version when the hook is used
  }, [])

  return { data, error, loading }
}
