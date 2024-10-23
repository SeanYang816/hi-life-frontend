import { ChangeEvent, ReactNode } from 'react'
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps, FormControl, FormHelperText } from '@mui/material'

type TextFieldProps = {
  name: string;
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: ReactNode | undefined;
  isMargin?: boolean;
} & MuiTextFieldProps

export const TextField = ({
  variant = 'outlined',
  fullWidth = true,
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  ...props
}: TextFieldProps) => {
  return (
    <FormControl fullWidth={fullWidth} variant={variant} error={error}
      sx={{
        mt: variant === 'outlined' ? 2 : 0
      }}>
      <MuiTextField
        autoComplete='new-password'
        fullWidth={fullWidth}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        variant={variant}
        error={!!error} // Convert the error value to a boolean for MUI
        InputLabelProps={{ shrink: true }} // Ensure the label is always shrunk
        sx={{
          mt: 2
        }}
        {...props}
      />
      {helperText && <FormHelperText>{error ? <>* {helperText}</> : undefined}</FormHelperText>}
    </FormControl>
  )
}
