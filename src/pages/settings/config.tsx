import { MRT_ColumnDef } from 'material-react-table'
import { UpdateUserDialog } from './dialogs/user/UpdateUserDialog'
import { DeleteUserDialog } from './dialogs/user/DeleteUserDialog'
import { DeleteFirmwareVersionDialog } from './dialogs/firmware/DeleteFirmwareVersionDialog'
import { Stack } from '@mui/material'
import {
  FirmwareResponseType,
  GroupResponseType,
  UserResponseType
} from 'types/api'
import { FirmwaresSortingColumns, getRoleLabelById } from 'enums'
import { DialogController } from 'components/DialogController'
import { DialogTrigger } from 'components/DialogTrigger'
import { Close, Edit } from '@mui/icons-material'
import { UpdateGroupDialog } from './dialogs/group/UpdateGroupDialog'
import { DeleteGroupDialog } from './dialogs/group/DeleteGroupDialog'
import { formatDate } from 'utils'
import { ThemeContextType } from 'providers/AuthProvider'

enum UsersSortingColumns {
  USERNAME = 'username',
  ALIAS = 'alias',
  ROLE_ID = 'role_id',
  CREATED_AT = 'created_at',
  CREATOR = 'creator',
}

export const userColumns = (
  onRefresh: VoidFunction,
  user: ThemeContextType
): MRT_ColumnDef<UserResponseType>[] => [
  {
    header: '帳號',
    accessorKey: UsersSortingColumns.USERNAME,
    accessorFn: (row) => row.username
  },
  {
    header: '名稱',
    accessorKey: UsersSortingColumns.ALIAS,
    accessorFn: (row) => row.alias
  },
  {
    header: '登入權限',
    accessorKey: UsersSortingColumns.ROLE_ID,
    accessorFn: (row) => getRoleLabelById(row.roleID)
  },
  {
    header: '建立時間',
    accessorKey: UsersSortingColumns.CREATED_AT,
    accessorFn: (row) => formatDate(row.createdAt)
  },
  {
    header: '建立者',
    accessorKey: UsersSortingColumns.CREATOR,
    accessorFn: (row) => row.creator
  },
  ...user.isWrite ? [{
    header: '動作',
    accessorKey: 'action',
    enableSorting: false,
    Cell: ({ row }: { row: { original: UserResponseType } }) => (

      <Stack direction='row'>
        {row.original.username !== 'admin' && // admin 為最高權限不得修改或刪除
          <>
            <DialogController>
              {({ open, onOpen, onClose }) => (
                <>
                  <DialogTrigger
                    buttonTitle='編輯使用者'
                    onOpen={onOpen}
                    icon={<Edit />}
                  />
                  {open && (
                    <UpdateUserDialog
                      open={open}
                      onClose={onClose}
                      data={row.original}
                      onSuccess={onRefresh}
                      // isSelf={row.original.username === user.username}
                      isSelf={false}
                    />
                  )}
                </>
              )}
            </DialogController>
            {user.username !== row.original.username && // 當下使用者不得刪除自己
            <DialogController>
              {({ open, onOpen, onClose }) => (
                <>
                  <DialogTrigger
                    buttonTitle='刪除使用者'
                    onOpen={onOpen}
                    icon={<Close />}
                  />
                  {open && (
                    <DeleteUserDialog
                      open={open}
                      onClose={onClose}
                      data={row.original}
                      onSuccess={onRefresh}
                    />
                  )}
                </>
              )}
            </DialogController>
            }
          </>
        }
      </Stack>
    ),
    size: 50
  }] : []
]

enum GroupsSortingColumns {
  GROUP_NAME = 'group_name',
  THING_COUNT = 'thing_count',
  CREATED_AT = 'created_at',
  CREATOR = 'creator',
}

export const groupColumns = (
  onRefresh: VoidFunction,
  user: ThemeContextType
): MRT_ColumnDef<GroupResponseType>[] => [
  {
    header: '群組名稱',
    accessorKey: GroupsSortingColumns.GROUP_NAME,
    accessorFn: (row) => row.name
  },
  {
    header: '數量',
    accessorKey: GroupsSortingColumns.THING_COUNT,
    accessorFn: (row) => row.thingCount
  },
  {
    header: '建立時間',
    accessorKey: GroupsSortingColumns.CREATED_AT,
    accessorFn: (row) => formatDate(row.createdAt)
  },
  {
    header: '建立者',
    accessorKey: GroupsSortingColumns.CREATOR,
    accessorFn: (row) => row.creatorName
  },
  ...user.isWrite ? [{
    header: '動作',
    accessorKey: 'action',
    enableSorting: false,
    Cell: ({ row }: { row: { original: GroupResponseType } }) => (
      <Stack direction='row'>
        <DialogController>
          {({ open, onOpen, onClose }) => (
            <>
              <DialogTrigger
                buttonTitle='編輯使用者'
                onOpen={onOpen}
                icon={<Edit />}
              />
              {open && (
                <UpdateGroupDialog
                  data={row.original}
                  open={open}
                  onClose={onClose}
                  onSuccess={onRefresh}
                />
              )}
            </>
          )}
        </DialogController>
        <DialogController>
          {({ open, onOpen, onClose }) => (
            <>
              <DialogTrigger
                buttonTitle='刪除群組'
                onOpen={onOpen}
                icon={<Close />}
              />
              {open && (
                <DeleteGroupDialog
                  data={row.original}
                  open={open}
                  onClose={onClose}
                  onSuccess={onRefresh}
                />
              )}
            </>
          )}
        </DialogController>
      </Stack>
    ),
    size: 50
  }] : []
]

export const firmwareColumns = (
  onRefresh: VoidFunction,
  user: ThemeContextType
): MRT_ColumnDef<FirmwareResponseType>[] => [
  {
    header: '韌體版本',
    accessorKey: FirmwaresSortingColumns.FIRMWARE_NAME,
    accessorFn: (row) => row.fileName
  },
  {
    header: '建立時間',
    accessorKey: FirmwaresSortingColumns.CREATED_AT,
    accessorFn: (row) => formatDate(row.createdAt)
  },
  {
    header: '建立者',
    accessorKey: FirmwaresSortingColumns.CREATOR,
    accessorFn: (row) => row.creator.username
  },
  ...(user.isWrite ? [{
    header: '動作',
    accessorKey: 'action',
    enableSorting: false,
    Cell: ({ row }: { row: { original: FirmwareResponseType } }) => (
      <>
        <DialogController>
          {({ open, onOpen, onClose }) => (
            <>
              <DialogTrigger buttonTitle='刪除韌體版本' icon={<Close />} onOpen={onOpen} />
              <DeleteFirmwareVersionDialog
                open={open}
                onClose={onClose}
                data={row.original}
                onSuccess={onRefresh}
              />
            </>
          )}
        </DialogController>
      </>
    ),
    size: 50
  }] : [])
]
