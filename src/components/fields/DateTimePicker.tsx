import React, { useState, useEffect } from 'react'
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimeValidationError,
  PickerChangeHandlerContext
} from '@mui/x-date-pickers'
import { Moment } from 'moment-timezone'
import { TextFieldVariants } from '@mui/material'

type DateTimePickerProps = {
  initialValue?: Moment | null; // Use this as the initial value flag
  disabled?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  label?: string;
  variant?: TextFieldVariants;
  onChange?: (date: Date | null) => void;
  format?: string;
  closeOnSelect?: boolean;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  initialValue = null,
  label = '',
  variant = 'outlined',
  format = 'YYYY-MM-DD',
  disabled = false,
  disablePast = false,
  disableFuture = false,
  closeOnSelect = false,
  onChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(initialValue)

  // Ensure the initialValue is only used on the initial render
  useEffect(() => {
    if (initialValue) {
      setSelectedDate(initialValue)
    }
  }, []) // Empty dependency array ensures this effect only runs on mount

  const handleDateChange = (
    value: Moment | null,
    _context: PickerChangeHandlerContext<DateTimeValidationError>
  ) => {
    setSelectedDate(value) // Update state with the selected date
    if (value !== null && onChange) {
      onChange(value.toDate())
    } else if (onChange) {
      onChange(null)
    }
  }

  return (
    <MuiDateTimePicker
      value={selectedDate} // Controlled by selectedDate state
      closeOnSelect={closeOnSelect}
      disabled={disabled}
      format={format}
      disablePast={disablePast}
      disableFuture={disableFuture}
      onChange={handleDateChange}
      slotProps={{
        textField: { variant: variant, label, sx: { mt: variant === 'outlined' ? 2 : 0 } },
        field: { clearable: true, onClear: () => setSelectedDate(null) }
      }}
    />
  )
}
