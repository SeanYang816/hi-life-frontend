import { Typography, useTheme } from '@mui/material'
import { apiDeleteFirmware } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC } from 'react'
import { FirmwareResponseType } from 'types/api'

type DeleteFirmwareVersionType = {
  data: FirmwareResponseType;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction; // To trigger parent component refresh
};

export const DeleteFirmwareVersionDialog: FC<DeleteFirmwareVersionType> = ({
  data,
  open,
  onClose,
  onSuccess
}) => {
  const theme = useTheme()
  const deleteFirmware = useToastHandler(apiDeleteFirmware, '刪除韌體', onSuccess, onClose)

  const handleDelete = async () => {
    await deleteFirmware(data.id)
  }

  return (
    <Dialog
      width={600}
      open={open}
      onClose={onClose}
      type={DialogType.Delete}
      title='刪除韌體版本'
      content={
        <Typography color={theme.palette.secondary.light}>
          確定要刪除該韌體版本？
        </Typography>
      }
      onConfirm={handleDelete}
    />
  )
}
