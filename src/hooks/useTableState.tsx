import { useEffect, useState } from 'react'
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState
} from 'material-react-table'
import { Pagination } from 'components/Pagination'

// Define the return type of the hook
interface ManualStateKitReturn {
  globalFilter: string;
  sorting: MRT_SortingState;
  columnFilters: MRT_ColumnFiltersState;
  pagination: MRT_PaginationState;
  rowSelection: MRT_RowSelectionState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setColumnFilters: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  Pagination: () => JSX.Element;
}

// Make pageIndex and pageSize optional in the function argument
type TableStateProps = {
  pageIndex?: number;
  pageSize?: number;
  total: number;
  rowsLength: number;
};

export const useTableState = ({
  pageIndex = 0,
  pageSize = 25,
  total,
  rowsLength
}: TableStateProps): ManualStateKitReturn => {
  // Default empty object as argument
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex,
    pageSize
  })
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  // Reset pagination to page 0 when filters change
  useEffect(() => {
    setPagination((prev) => ({ pageIndex: 0, pageSize: prev.pageSize }))
  }, [globalFilter, columnFilters])

  useEffect(() => {
    if(rowsLength === 0 && total > 0) {
      setPagination((prev) => ({ pageIndex: prev.pageIndex - 1, pageSize }))
    }
  }, [pageSize, rowsLength, total])

  return {
    globalFilter,
    sorting,
    columnFilters,
    pagination,
    rowSelection,
    setSorting,
    setGlobalFilter,
    setColumnFilters,
    setPagination,
    setRowSelection,
    Pagination: () =>
      <Pagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={total}
        setPageIndex={(index) =>
          setPagination({
            pageIndex: index,
            pageSize: pagination.pageSize
          })
        }
        setPageSize={(size) =>
          setPagination({
            pageIndex: pagination.pageIndex,
            pageSize: size
          })
        }
      />
  }
}
