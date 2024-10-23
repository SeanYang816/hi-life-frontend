import { SelectChangeEvent } from '@mui/material'
import { useCallback } from 'react'
import { OnChangeFn, PaginationInputType } from 'types'

type UsePaginationProps = {
  onPaginationChange: OnChangeFn<PaginationInputType>;
  pagination: PaginationInputType;
  total: number;
};

export const usePagination = ({ pagination, total, onPaginationChange }: UsePaginationProps) => {
  const handleFirstPageChange = useCallback(() => onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize }), [onPaginationChange, pagination])
  const handlePrevPageChange = useCallback(() => onPaginationChange({ pageIndex: Math.max(0, pagination.pageIndex - 1), pageSize: pagination.pageSize }), [onPaginationChange, pagination])
  const handleNextPageChange = useCallback(() => onPaginationChange({ pageIndex: Math.min(pagination.pageIndex + 1, Math.ceil(total / pagination.pageSize) - 1), pageSize: pagination.pageSize }), [onPaginationChange, pagination, total])
  const handleLastPageChange = useCallback(() => onPaginationChange({ pageIndex: Math.ceil(total / pagination.pageSize) - 1, pageSize: pagination.pageSize }), [onPaginationChange, pagination, total])
  const handleRowsPerPageChange = useCallback((event: SelectChangeEvent<number>) => {
    const value = event.target.value
    onPaginationChange((prev) => ({ pageIndex: prev.pageIndex, pageSize: Number(value) }))
  }, [onPaginationChange])
  const handlePageChange = useCallback((event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value) - 1
    onPaginationChange({ pageIndex: value, pageSize: pagination.pageSize })
  }, [onPaginationChange, pagination])

  return {
    onFirstPageChange: handleFirstPageChange,
    onPrevPageChange: handlePrevPageChange,
    onNextPageChange: handleNextPageChange,
    onLastPageChange: handleLastPageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onPageChange: handlePageChange
  }
}
