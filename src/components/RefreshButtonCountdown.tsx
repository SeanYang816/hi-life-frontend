import React, { useEffect, useState } from 'react'
import { Tooltip, IconButton } from '@mui/material'
import { Refresh } from '@mui/icons-material'

type AutoRefreshButtonProps = {
  title: (refreshInterval: number) => string;
  refreshInterval: number;
  onRefresh: () => void;
  onClick: () => void;
}

export const AutoRefreshButton: React.FC<AutoRefreshButtonProps> = ({ title, refreshInterval, onRefresh, onClick }) => {
  const [delay, setDelay] = useState(refreshInterval)

  useEffect(() => {
    onRefresh()

    const interval = setInterval(() => {
      onRefresh()
    }, refreshInterval * 1000)

    const remainDelay = setInterval(() => {
      setDelay(prev => {
        if (prev <= 1) {
          return refreshInterval
        }
        return prev - 1
      })
    }, 1 * 1000)

    return () => {
      clearInterval(interval)
      clearInterval(remainDelay)
    }
  }, [])

  return (
    <Tooltip title={title(delay)}>
      <IconButton onClick={onClick}>
        <Refresh />
      </IconButton>
    </Tooltip>
  )
}
