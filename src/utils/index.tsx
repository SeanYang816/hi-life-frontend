import { Box } from '@mui/material'

export function camelToSnakeCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export function transformObjectKeysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectKeysToSnakeCase(item))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeCaseKey = camelToSnakeCase(key)
      acc[snakeCaseKey] = transformObjectKeysToSnakeCase(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

export const formatDate = (date: string | Date | null) => {
  // Check if the date is valid
  const parsedDate = new Date(date)
  if (!date || isNaN(parsedDate.getTime())) {
    // Return -- in red if the date is invalid or missing
    return <Box>- -</Box>
  }

  // Format the valid date
  const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(parsedDate)
  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value
  const day = parts.find(part => part.type === 'day')?.value
  const hour = parts.find(part => part.type === 'hour')?.value
  const minute = parts.find(part => part.type === 'minute')?.value
  const second = parts.find(part => part.type === 'second')?.value

  // Return the formatted date as YYYY-MM-DD - HH:MM:SS
  return `${year}-${month}-${day} - ${hour}:${minute}:${second}`
}