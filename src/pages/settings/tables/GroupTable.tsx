import { useCallback, useContext, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table'
import { apiGetGroups } from 'api'
import { groupColumns } from '../config'
import { Stack } from '@mui/material'
import { RefreshButton } from 'components/RefreshButton'
import { GroupResponseType } from 'types/api'
import { DialogController } from 'components/DialogController'
import { DialogTrigger } from 'components/DialogTrigger'
import { Add } from '@mui/icons-material'
import { CreateGroupDialog } from '../dialogs/group/CreateGroupDialog'
import { useTableState } from 'hooks/useTableState'
import { ThemeContext } from 'providers/AuthProvider'

export const GroupTable = () => {
  const [data, setData] = useState<GroupResponseType[]>([])
  const [total, setTotal] = useState(0)
  const user = useContext(ThemeContext)

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

  const fetchData = useCallback(async () => {
    try {
      const response = await apiGetGroups({
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

  const columns: MRT_ColumnDef<GroupResponseType>[] = groupColumns(handleRefresh, user)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const table = useMaterialReactTable({
    columns,
    data,
    manualPagination: true,
    manualSorting: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,

    onGlobalFilterChange: setGlobalFilter,
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
        { user.isWrite && <DialogController>
          {({ open, onOpen, onClose }) =>
            <>
              <DialogTrigger buttonTitle='新增群組' icon={<Add />} onOpen={onOpen} />
              {open && <CreateGroupDialog open={open} onClose={onClose} onSuccess={handleRefresh} />}
            </>}
        </DialogController>}
        <RefreshButton title='刷新' onClick={handleRefresh} />
      </Stack>
      <MaterialReactTable table={table} />
      <Pagination />
    </>
  )
}
