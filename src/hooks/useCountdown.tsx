import { useEffect, useState } from 'react'

export const useCountdown = (initialCountdown: number, onCountdownEnd?: () => void) => {
  const [countdown, setCountdown] = useState(initialCountdown)

  useEffect(() => {
    const countdownIntervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onCountdownEnd) onCountdownEnd()
          return initialCountdown
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownIntervalId)
    }
  }, [initialCountdown, onCountdownEnd])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return { countdown, formatTime }
}
