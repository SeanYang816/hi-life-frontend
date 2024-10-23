import { SelectChangeEvent } from '@mui/material'
import { SelectOptionProps } from 'types'

export type UseGroupOptionsReturnType = {
  options: SelectOptionProps[];
  pageSize: number;
  total: number;
  handleLoadMore: () => void;
  value: string | number | null;
  onChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
};
