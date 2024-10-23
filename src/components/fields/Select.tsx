import {
  FormControl,
  InputLabel,
  SelectChangeEvent,
  SelectProps,
  Select as MuiSelect,
  MenuItem,
  Tooltip,
  IconButton,
  FormHelperText,
  Box
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { isNil } from 'lodash'
import React, { FC } from 'react'
import { SelectOptionProps } from 'types'

type Props = {
  initialOption?: SelectOptionProps;
  options: SelectOptionProps[];
  label?: string;
  isLoadMore?: boolean;
  onLoadMore?: VoidFunction;
  clearable?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
} & SelectProps;

export const Select: FC<Props> = ({
  name,
  value,
  onChange,
  onBlur,
  clearable = false,
  label,
  options,
  initialOption,
  isLoadMore,
  onLoadMore,
  error,
  helperText,
  placeholder = '',
  ...props
}) => {
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    const isBottomReached = target.scrollHeight - target.scrollTop === target.clientHeight

    if (isLoadMore && isBottomReached) {
      onLoadMore?.()
    }
  }

  const handleClear = () => {
    // Ensure to pass the 'name' attribute when calling onChange
    onChange?.({ target: { value: null, name } } as SelectChangeEvent<string | number | null>, null)
  }

  // Add the initialOption if it's not in the options list based on value
  const enhancedOptions = React.useMemo(() => {
    if (initialOption?.value && !options.some((opt) => opt.value === initialOption.value)) {
      return [initialOption, ...options]
    }
    return options
  }, [initialOption, options])

  return (
    <FormControl
      fullWidth
      error={error}
      sx={{
        position: 'relative',
        '& .MuiInputBase-root': {
          marginTop: props.variant === 'outlined' ? 2 : 0
        }
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        displayEmpty={!!placeholder}
        label={label}
        value={value ?? ''} // Ensure value is empty string when undefined
        onChange={onChange}
        onBlur={onBlur}
        name={name} // Pass name to ensure Formik works correctly
        MenuProps={{
          onScrollCapture: handleScroll,
          sx: { height: 300 }
        }}

        {...props}
      >
        {placeholder && (
          <MenuItem value='' disabled>
            <Box sx={{ opacity: 0.5 }}>
              {placeholder}
            </Box>
          </MenuItem>
        )}
        {enhancedOptions.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {clearable && (
        <Tooltip title='Clear filter' placement='right-end'>
          <IconButton
            disabled={isNil(value) || !value}
            onClick={handleClear}
            size='small'
            sx={{
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              '> svg': {
                width: '32px',
                height: '32px'
              }
            }}
          >
            <ClearIcon
              fontSize='small'
              htmlColor={
                isNil(value) || !value
                  ? 'rgba(0, 0, 0, 0.26)'
                  : 'rgba(0, 0, 0, 0.54)'
              }
            />
          </IconButton>
        </Tooltip>
      )}

      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
