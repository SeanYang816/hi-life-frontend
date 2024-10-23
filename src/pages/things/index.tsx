import { useCallback, useContext, useEffect, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleFiltersButton
} from 'material-react-table'
import { Box, Button, Stack } from '@mui/material'
import { deviceColumns } from './config'
import { apiGetThings } from 'api'
import { DialogController } from 'components/DialogController'
import { GroupDialog } from './dialogs/GroupDialog'
import { GetThingResponse } from 'types/api'
import { useGroupOptions } from 'hooks/useGroupOptions'
import { useTableState } from 'hooks/useTableState'
import { FirmwareUpdateDialog } from './dialogs/FirmwareUpdateDialog'
import { ThemeContext } from 'providers/AuthProvider'
import { AutoRefreshButton } from 'components/RefreshButtonCountdown'

export const Things = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)

  const {
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
    pagination,
    Pagination
  } = useTableState({
    total,
    rowsLength: data.length
  })
  const { isWrite } = useContext(ThemeContext)

  const groupOptionTools = useGroupOptions(25)

  const refreshButtonTitle = (refreshInterval: number) => {
    return `${refreshInterval} 秒後自動刷新`
  }

  const fetchData = useCallback(async () => {
    try {
      const filterFields = columnFilters.reduce((acc, current) => {
        acc[current.id] = current.value
        return acc
      }, {})

      const response = await apiGetThings({
        ...filterFields,
        keyword: globalFilter || '',
        pageNum: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: sorting
      })

      const [things, total] = response
      setData(things)
      setTotal(total)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, globalFilter])

  const handleRefresh = () => {
    fetchData()
  }

  const columns: MRT_ColumnDef<GetThingResponse>[] = deviceColumns(
    handleRefresh,
    groupOptionTools,
    isWrite
  )

  const table = useMaterialReactTable({
    data,
    columns,

    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableRowSelection: isWrite,

    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,

    getRowId: (originalRow) => JSON.stringify({
      id: originalRow.macAddress,
      name: originalRow.storeName,
      onlineStatus: originalRow.onlineStatus
    }),

    muiTableContainerProps: {
      sx: {
        maxHeight: '67.5vh'
      }
    },

    state: {
      rowSelection: rowSelection ?? {},
      sorting,
      globalFilter,
      columnFilters
    }
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='center' marginBottom={2}>
        {isWrite ? <Stack direction='row' gap={2}>
          <DialogController>
            {({ open, onOpen, onClose }) => (
              <>
                <Button
                  onClick={onOpen}
                  variant='contained'
                  sx={{ px: 3.75 }}
                  disabled={Object.keys(rowSelection).length === 0}
                >
                  群組
                </Button>
                {open && (
                  <GroupDialog
                    open={open}
                    onClose={onClose}
                    rowSelection={rowSelection}
                    onSuccess={handleRefresh}
                  />
                )}
              </>
            )}
          </DialogController>
          <DialogController>
            {({ open, onOpen, onClose }) => (
              <>
                <Button
                  onClick={onOpen}
                  variant='contained'
                  sx={{ px: 3.75 }}
                  disabled={Object.keys(rowSelection).length === 0}
                >
                  韌體更新
                </Button>
                {open && (
                  <FirmwareUpdateDialog
                    open={open}
                    onClose={onClose}
                    rowSelection={rowSelection}
                    onSuccess={handleRefresh}
                  />
                )}
              </>
            )}
          </DialogController>
        </Stack> : <Box />}
        <Stack direction='row' spacing={1}>
          <Stack direction='row' alignItems='center' marginLeft='auto'>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleGlobalFilterButton table={table} />
          </Stack>
          <MRT_ToggleFiltersButton table={table} />
          <AutoRefreshButton title={refreshButtonTitle} refreshInterval={300} onRefresh={fetchData} onClick={handleRefresh}/>
        </Stack>
      </Stack>

      <MaterialReactTable table={table} />

      <Pagination />
    </div>
  )
}
