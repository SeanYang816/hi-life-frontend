import React from 'react'
import {
  DatePicker as MuiDatePicker
} from '@mui/x-date-pickers'
import moment from 'moment-timezone' // Import Moment for type checking
import { TextFieldVariants } from '@mui/material'

type DatePickerProps = {
  label?: string;
  variant?: TextFieldVariants;
  onChange: (date: Date | null) => void;
  format?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label = '',
  variant = 'outlined',
  format = 'YYYY-MM-DD',
  onChange
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      if (moment.isMoment(date)) {
        const selectedDate = date.toDate()
        if (onChange) {
          onChange(selectedDate)
        }
      } else {
        // Handle the case where date is not a moment object
        console.error('Invalid date format')
      }
    } else {
      // Handle the case where date is null
      if (onChange) {
        onChange(null)
      }
    }
  }

  return (
    <MuiDatePicker
      format={format}
      onChange={handleDateChange}
      slotProps={{
        textField: { variant: variant, label, sx: {
          mt: variant === 'outlined' ? 2 : 0
        } },
        field: { clearable: true, onClear: () => onChange(null) }
      }}
    />
  )
}
