import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { SelectOptionProps } from 'types'

type RadiosProps = {
  label?: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: SelectOptionProps[];
  disabled?: boolean;
};

const Radios: React.FC<RadiosProps> = ({ label, name, value, onChange, options, disabled }) => {
  return (
    <FormControl component='fieldset'>
      <Typography variant='subtitle1' mb={2}>{label}</Typography>
      <RadioGroup aria-label='radio-group' name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            disabled={disabled}
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option?.label ?? ''}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default Radios
