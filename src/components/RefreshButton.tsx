import React from 'react'
import { Tooltip, IconButton } from '@mui/material'
import { Refresh } from '@mui/icons-material'

type RefreshButtonProps = {
  title: string;
  onClick: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ title, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick}>
        <Refresh />
      </IconButton>
    </Tooltip>
  )
}
