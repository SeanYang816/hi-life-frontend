import { MRT_ColumnDef } from 'material-react-table'
import { InfoDialog } from './dialogs/InfoDialog'
import { ArchiveDeviceDialog } from './dialogs/ArchiveDeviceDialog'
import { OnlineStatus, ThingsSortingColumns } from 'enums'
import { Box, Stack, Tooltip } from '@mui/material'
import { GetThingResponse } from 'types/api'
import { UseGroupOptionsReturnType } from 'types/hooks'
import { Select } from 'components/fields/Select'
import { DialogController } from 'components/DialogController'
import { DialogTrigger } from 'components/DialogTrigger'
import { InfoRounded } from '@mui/icons-material'
import { formatDate } from 'utils'
import Archive from 'assets/archive.svg?react'
import { DearchiveDeviceDialog } from './dialogs/DearchiveDeviceDialog'
import Circle from '@mui/icons-material/Circle'

export const deviceColumns = (
  onRefresh: VoidFunction,
  groupOptionTools: UseGroupOptionsReturnType,
  isWrite: boolean
): MRT_ColumnDef<GetThingResponse>[] => [
  {
    header: '群組',
    accessorKey: ThingsSortingColumns.GROUP_NAME,
    accessorFn: (row) => row.groupName,
    Filter: () => {
      const { value, options, onChange, handleLoadMore } = groupOptionTools
      return (
        <Select
          placeholder='Filter by 群組'
          clearable
          name='group'
          variant='standard'
          value={value}
          options={options}
          onChange={onChange}
          isLoadMore
          onLoadMore={handleLoadMore}
        />
      )
    }
  },
  {
    header: '識別名稱',
    accessorKey: ThingsSortingColumns.STORE_NAME,
    accessorFn: (row) => row.storeName,
    Cell: ({ row }) => {
      const isArchived = !!row.original.isArchived
      const value = isArchived ? row.original.macAddress : row.original.storeName
      return (
        <Tooltip title={row.original.machineCode ? row.original.machineCode : '無機碼'} placement='top-start'>
          <Box>{value}</Box>
        </Tooltip>
      )
    }
  },
  {
    header: '現正播放來源與曲目',
    accessorKey: ThingsSortingColumns.PLAYING_INFO,
    accessorFn: (row) => !row.isArchived ? row.playingInfo : '- -'
  },
  {
    header: '連線狀態',
    accessorKey: ThingsSortingColumns.ONLINE_STATUS,
    accessorFn: (row) => row.onlineStatus,
    filterVariant: 'select',
    filterSelectOptions: [
      { label: '連線', value: OnlineStatus.ONLINE },
      { label: '未連線', value: OnlineStatus.OFFLINE }
    ],
    Cell: ({ row, cell }) => {
      return !row.original.isArchived ? <Circle color={cell.getValue() ? 'success' : 'error'} /> : ''
    },
    size: 50
  },
  {
    header: '韌體',
    accessorKey: ThingsSortingColumns.FIRMWARE_VERSION,
    accessorFn: (row) => !row.isArchived ? row.firmwareVersion : '- -'
  },
  {
    header: '最近回報時間',
    accessorKey: ThingsSortingColumns.LAST_MESSAGE_TIME,
    accessorFn: (row) => formatDate(row.lastContactedAt),
    enableColumnFilter: false
  },
  ...isWrite ? [{
    header: '動作',
    Cell: ({ row }: { row: { original: GetThingResponse } }) => (
      <Stack direction='row' justifyContent='flex-end' width={100}>
        {!row.original.isArchived && <DialogController>
          {({ open, onOpen, onClose }) =>
            <>
              <DialogTrigger onOpen={onOpen} buttonTitle='音樂盒詳細資訊' icon={<InfoRounded />}/>
              {open && <InfoDialog open={open} onClose={onClose} data={row.original} onSuccess={onRefresh} />}
            </>}
        </DialogController>}
        <DialogController>
          {({ open, onOpen, onClose }) => (
            row.original.isArchived ? (
              <>
                <DialogTrigger onOpen={onOpen} buttonTitle='解封' icon={<Archive />} iconHoverColor='#09CEF6' />
                {open && <DearchiveDeviceDialog open={open} onClose={onClose} data={row.original} onSuccess={onRefresh} />}
              </>
            ) : (
              <>
                <DialogTrigger onOpen={onOpen} buttonTitle='封存' icon={<Archive />} iconHoverColor='#CE0000' />
                {open && <ArchiveDeviceDialog open={open} onClose={onClose} data={row.original} onSuccess={onRefresh} />}
              </>
            )
          )}
        </DialogController>
      </Stack>
    ),
    size: 50
  }] : []
]
