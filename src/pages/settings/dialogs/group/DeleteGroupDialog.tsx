import { Typography, useTheme } from '@mui/material'
import { apiDeleteGroup } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC } from 'react'
import { GroupResponseType } from 'types/api'

type DeleteGroupDialogType = {
  data: GroupResponseType;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

export const DeleteGroupDialog: FC<DeleteGroupDialogType> = ({ data, open, onClose, onSuccess }) => {
  const theme = useTheme()
  const deleteGroup = useToastHandler(apiDeleteGroup, '刪除群組', onSuccess, onClose)

  const handleDelete = async () => {
    await deleteGroup(data.id)
  }

  return (
    <Dialog
      width={600}
      open={open}
      onClose={onClose}
      type={DialogType.Delete}
      title='刪除群組'
      content={
        <>
          <Typography color='primary' variant='h3' mb={2.5}>{data.name}</Typography>
          <Typography color={theme.palette.secondary.light} variant='h5'>確定要刪除此群組名稱嗎？<br /> 此刪除動作僅刪除群組與音樂盒關聯，並不影響音樂盒運作。</Typography>
        </>
      }
      onConfirm={handleDelete}
    />
  )
}
