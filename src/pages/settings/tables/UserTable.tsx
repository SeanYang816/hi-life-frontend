import { useCallback, useContext, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table'
import { apiGetUsers } from 'api'
import { userColumns } from '../config'
import { UserResponseType } from 'types/api'
import { Stack } from '@mui/material'
import { RefreshButton } from 'components/RefreshButton'
import { DialogController } from 'components/DialogController'
import { DialogTrigger } from 'components/DialogTrigger'
import { Add } from '@mui/icons-material'
import { CreateUserDialog } from '../dialogs/user/CreateUserDialog'
import { useTableState } from 'hooks/useTableState'
import { ThemeContext } from 'providers/AuthProvider'

export const UserTable = () => {
  const [data, setData] = useState<UserResponseType[]>([])
  const [total, setTotal] = useState(0)

  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    Pagination
  } = useTableState({
    total,
    rowsLength: data.length
  })
  const user = useContext(ThemeContext)

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const response = await apiGetUsers({
        keyword: globalFilter || '',
        pageNum: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: sorting
      })
      const [fetchedData, fetchedTotal] = response
      setData(fetchedData)
      setTotal(fetchedTotal)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter])

  const handleRefresh = () => {
    fetchData()
    console.info('Table refreshed')
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns: MRT_ColumnDef<UserResponseType>[] = userColumns(handleRefresh, user)

  const table = useMaterialReactTable({
    columns,
    data,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,

    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    onGlobalFilterChange: setGlobalFilter,  // Handle global filter changes (and clearing)
    onSortingChange: setSorting,

    state: {
      globalFilter,
      sorting
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '70vh'
      }
    }
  })

  return (
    <>
      <Stack direction='row' spacing={2} alignItems='center' justifyContent='flex-end' marginBottom={2}>
        <Stack direction='row'>
          <MRT_GlobalFilterTextField table={table} />
          <MRT_ToggleGlobalFilterButton table={table} />
        </Stack>
        {user.isWrite &&
        <DialogController>
          {({ open, onOpen, onClose }) =>
            <>
              <DialogTrigger buttonTitle='新增使用者' icon={<Add />} onOpen={onOpen} />
              {open &&
          <CreateUserDialog open={open} onClose={onClose} onSuccess={handleRefresh} />
              }
            </>}
        </DialogController>}
        <RefreshButton title='刷新' onClick={handleRefresh} />
      </Stack>
      <MaterialReactTable table={table} />
      <Pagination />
    </>
  )
}
