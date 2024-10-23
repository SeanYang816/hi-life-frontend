import { Typography, useTheme } from '@mui/material'
import { apiDeleteUser } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC } from 'react'
import { UserResponseType } from 'types/api'

type DeleteUserDialogType = {
  data: UserResponseType;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

export const DeleteUserDialog: FC<DeleteUserDialogType> = ({ data, open, onClose, onSuccess }) => {
  const theme = useTheme()
  const deleteUser = useToastHandler(apiDeleteUser, '刪除使用者', onSuccess, onClose)

  const handleDelete = async () => {
    await deleteUser(data.username)
  }

  return (
    <Dialog
      width={600}
      open={open}
      onClose={onClose}
      type={DialogType.Delete}
      title='刪除使用者'
      content={
        <>
          <Typography color='primary' variant='h3' mb={2.5}>{data.username}</Typography>
          <Typography color={theme.palette.secondary.light} variant='h5'>確定要刪除該帳號的使用者資料嗎？</Typography>
        </>
      }
      onConfirm={handleDelete}
    />
  )
}
