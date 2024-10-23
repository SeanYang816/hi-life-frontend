import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // Import Axios to handle errors better

export const useToastHandler = <ResultType, DataType extends unknown[]>(
  apiCall: (...data: DataType) => Promise<ResultType>,
  textToDisplay: string = '操作',
  ...onSuccessFns: ((result: ResultType) => Promise<void> | void)[]
) => {
  const navigate = useNavigate() // Initialize navigate for redirecting

  return async (...data: DataType) => { // Spread data as individual parameters
    try {
      const result = await apiCall(...data) // Spread data when calling the API
      toast.success(`${textToDisplay} 成功`)

      for (const fn of onSuccessFns) {
        await fn(result)
      }

      return result
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response?.data // Safely access response data
        const errorCode = response?.errorCode
        switch (errorCode) {
          case '90016': // Unauthorized error code
            toast.error('使用者無權限')
            localStorage.removeItem('access_token')
            navigate('/login')
            break
          case '22002': // 名稱重複
            toast.error('群組名稱重複')
            break
          default:
            toast.error(`${textToDisplay} 失敗: ${response?.message || '發生錯誤'}`)
            break
        }
      } else if (error instanceof Error) {
        // Handle non-Axios errors
        toast.error(`${textToDisplay} 失敗: ${error.message}`)
        throw new Error(`${textToDisplay} 失敗. ${error.message}`)
      } else {
        toast.error(`${textToDisplay} 失敗: 發生未知錯誤`)
        throw new Error(`${textToDisplay} 失敗. 發生未知錯誤`)
      }
    }
  }
}
