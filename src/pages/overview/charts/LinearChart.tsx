import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'

type LinearGraphProps = {
  onlineCount: number;
  offlineCount: number;
}

export const LinearChart: React.FC<LinearGraphProps> = ({ onlineCount, offlineCount }) => {
  const theme = useTheme()
  const totalCount = onlineCount + offlineCount
  const onlinePercentage = (onlineCount / totalCount) * 100
  const offlinePercentage = (offlineCount / totalCount) * 100

  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Numbers on top */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
        <Typography textAlign='left' variant='h4'>{onlineCount}</Typography>
        <Typography textAlign='right' variant='h4'>{offlineCount}</Typography>
      </Box>

      {/* Bar */}
      <Box
        sx={{
          display: 'flex',
          height: 20,
          borderRadius: theme.spacing(0.5),
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: `${onlinePercentage}%`,
            backgroundColor: theme.palette.success.main,
            borderRadius: 1
          }}
        />
        <Box
          sx={{
            width: `${offlinePercentage}%`,
            backgroundColor: theme.palette.error.main,
            borderRadius: 1
          }}
        />
      </Box>

      {/* Labels below the bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
        <Typography textAlign='left'>連線</Typography>
        <Typography textAlign='right'>離線</Typography>
      </Box>
    </Box>
  )
}
