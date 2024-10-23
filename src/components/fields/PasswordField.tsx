import { ChangeEvent, useState } from 'react'
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  TextFieldVariants,
  useTheme
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

type PasswordFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  variant?: TextFieldVariants;
  eyeMode?: 'light' | 'dark';
} & MuiTextFieldProps;

export const PasswordField = ({
  eyeMode = 'light',
  fullWidth = true,
  label,
  variant = 'outlined',
  ...props
}: PasswordFieldProps) => {
  const theme = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  const handleVisibilityToggle = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <MuiTextField
      autoComplete='new-password'
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      type={isVisible ? 'text' : 'password'}
      InputLabelProps={{ shrink: true }} // Ensure the label is always shrunk
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleVisibilityToggle}
              edge='end'
            >
              {isVisible ?
                <VisibilityOffIcon color='error' /> :
                <VisibilityIcon
                  sx={{
                    color: eyeMode === 'light' ? theme.palette.primary.main : theme.palette.grey[100]
                  }}
                  color='primary'
                />
              }
            </IconButton>
          </InputAdornment>
        )
      }}
      sx={{
        marginTop: variant === 'outlined' ? 2.5 : 0
      }}
      {...props}
    />
  )
}
