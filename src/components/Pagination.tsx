import React from 'react'
import {
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  SelectChangeEvent
} from '@mui/material'
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material'

export type PaginationProps = {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  rowCount,
  setPageIndex,
  setPageSize
}) => {
  const totalPages = Math.ceil(rowCount / pageSize)

  const handleFirstPage = () => {
    if (pageIndex !== 0) {
      setPageIndex(0)
    }
  }

  const handleLastPage = () => {
    if (pageIndex !== totalPages - 1) {
      setPageIndex(totalPages - 1)
    }
  }

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1)
    }
  }

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1)
    }
  }

  const handlePageChange = (event: SelectChangeEvent<number>) => {
    const newIndex = Number(event.target.value) - 1
    setPageIndex(newIndex)
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 1,
        borderTop: '1px solid rgba(224, 224, 224, 1)'
      }}
    >
      <Typography variant='body2' color='textSecondary' sx={{ marginRight: 2 }}>
        Rows per page:
      </Typography>
      <Select
        value={pageSize}
        onChange={(e: SelectChangeEvent<number>) =>
          setPageSize(Number(e.target.value))
        }
        variant='standard'
        disableUnderline
        sx={{ marginRight: 2 }}
      >
        {[5, 10, 25, 50, 100].map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
      <Typography variant='body2' color='textSecondary' sx={{ marginRight: 2 }}>
        {pageIndex * pageSize + 1}-
        {Math.min((pageIndex + 1) * pageSize, rowCount)} of {rowCount}
      </Typography>
      <Stack direction='row' alignItems='center'>
        <Typography>Page</Typography>
        <Select
          value={pageIndex + 1}
          onChange={handlePageChange}
          variant='standard'
          disableUnderline
          sx={{ marginLeft: 1, marginRight: 1, width: '60px', textAlign: 'center' }} // Increase width to accommodate larger numbers
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <MenuItem
              key={index}
              value={index + 1}
              sx={{ justifyContent: 'center' }}
            >
              <Typography noWrap>{index + 1}</Typography>{' '}
              {/* Ensure full number is shown */}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <IconButton
        onClick={handleFirstPage}
        disabled={pageIndex === 0}
        size='small'
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handlePrevPage}
        disabled={pageIndex === 0}
        size='small'
      >
        <NavigateBefore />
      </IconButton>
      <IconButton
        onClick={handleNextPage}
        disabled={pageIndex >= totalPages - 1}
        size='small'
      >
        <NavigateNext />
      </IconButton>
      <IconButton
        onClick={handleLastPage}
        disabled={pageIndex >= totalPages - 1}
        size='small'
      >
        <LastPage />
      </IconButton>
    </Paper>
  )
}
