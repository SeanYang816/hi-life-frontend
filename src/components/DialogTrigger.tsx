import React from 'react'
import { Tooltip, IconButton, Typography, Stack, useTheme } from '@mui/material'

interface DialogTriggerProps {
  buttonTitle: string;
  icon: React.ReactNode;
  iconText?: string;
  iconColor?: string;
  iconHoverColor?: string; // New prop for hover color
  onOpen: () => void; // Callback to handle opening the dialog
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  buttonTitle,
  icon,
  iconText,
  iconColor,
  iconHoverColor, // Destructure the new hover color prop
  onOpen
}) => {
  const theme = useTheme()

  return (
    <Tooltip title={buttonTitle}>
      <Stack direction='row' alignItems='center'>
        {iconText && (
          <Typography
            variant='h6'
            fontWeight={600}
            color={theme.palette.secondary.light}
            onClick={onOpen}
            sx={{ cursor: 'pointer' }}
          >
            {iconText}
          </Typography>
        )}
        <IconButton
          onClick={onOpen}
          sx={{
            color: iconColor, // Initial icon color
            '&:hover': {
              color: iconHoverColor || iconColor // Change icon color on hover if hover color is provided
            }
          }}
        >
          {icon}
        </IconButton>
      </Stack>
    </Tooltip>
  )
}
