import { Box, Stack } from '@mui/material'
import { apiGetDeviceLogsByMacAddress } from 'api'
import { RefreshButton } from 'components/RefreshButton'
import { DateTimePicker } from 'components/fields/DateTimePicker'
import { KKBOXLogsSortingColumns } from 'enums'
import { MaterialReactTable, useMaterialReactTable, MRT_ColumnDef } from 'material-react-table'
import moment from 'moment-timezone'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { formatDate } from 'utils'
import { DeviceLogsResponseType, GetThingResponse } from 'types/api'
import { TextField } from 'components/fields/Textfield'
import { useTableState } from 'hooks/useTableState'

type DeviceRecordTabProps = {
  data: GetThingResponse;
}

export const DeviceLogsTab: FC<DeviceRecordTabProps> = ({ data }) => {

  const [logs, setLogs] = useState<DeviceLogsResponseType[]>([])
  const [total, setTotal] = useState(0)
  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
    pagination,
    Pagination
  } = useTableState({
    pageSize: 25,
    pageIndex: 0,
    total,
    rowsLength: logs.length
  })

  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const columns: MRT_ColumnDef<DeviceLogsResponseType>[] = useMemo(
    () => [
      { header: '內容',
        accessorKey: KKBOXLogsSortingColumns.CONTENT,
        accessorFn: (row) => row.content,
        Cell: ({ cell }) =>  <Box maxWidth={500}>{cell.getValue() as string}</Box>

      },
      {
        header: '時間戳記',
        accessorKey: KKBOXLogsSortingColumns.DEVICE_LOGGED_AT,
        accessorFn: (row) => (
          <Box sx={{ whiteSpace: 'nowrap' }}>{formatDate(row.deviceLoggedAt)}</Box>
        )
      }
    ],
    []
  )

  const table = useMaterialReactTable({
    columns: columns,
    data: logs,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableSorting: false,
    enableStickyHeader: true,

    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    muiTablePaperProps: { sx: { backgroundColor: '#F4F7FC' } },
    muiTableBodyProps: { sx: { '& .MuiTableCell-root': { backgroundColor: '#F4F7FC' } } },
    muiTableHeadCellProps: { sx: { backgroundColor: '#F4F7FC' } },

    muiTableContainerProps: {
      sx: {
        maxHeight: '45vh'
      }
    },

    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination
    }
  })

  const nowDate = useMemo(() => new Date().getTime(), [])
  const sevenDaysBefore = useMemo(
    () => new Date(nowDate - 7 * 24 * 60 * 60 * 1000).getTime(),
    [nowDate]
  )

  const fetchData = useCallback(async () => {
    try {
      const response = await apiGetDeviceLogsByMacAddress(data.macAddress, {
        keyword: keyword,
        start_time: startDate?.getTime() ?? sevenDaysBefore,
        end_time: endDate?.getTime() ?? nowDate,
        sort: sorting,
        page_num: pagination.pageIndex,
        page_size: pagination.pageSize
      })
      const [logs, total] = await response
      setLogs(logs)
      setTotal(total)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }, [data, keyword, startDate, sevenDaysBefore, endDate, nowDate, sorting, pagination])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='flex-end' marginBottom={2}>
        <Box>
          <TextField
            label='搜索'
            name={KKBOXLogsSortingColumns.CONTENT}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Stack direction='row' gap={2}>
            <DateTimePicker
              label='起始'
              initialValue={moment().subtract(7, 'days')}
              onChange={setStartDate}
            />
            <DateTimePicker
              label='結束'
              initialValue={moment()}
              onChange={setEndDate} />
          </Stack>
        </Box>
        <RefreshButton title='refresh' onClick={fetchData} />
      </Stack>
      <MaterialReactTable table={table} />
      <Pagination />
    </>
  )
}
