import { Typography, useTheme } from '@mui/material'
import { apiArchiveThing } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC, useState } from 'react'
import { GetThingResponse } from 'types/api'

type ArchiveDeviceDialogType = {
  data: GetThingResponse;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

export const ArchiveDeviceDialog: FC<ArchiveDeviceDialogType> = ({
  data,
  open,
  onClose,
  onSuccess
}) => {
  const theme = useTheme()
  const [error, setError] = useState<string | null>(null)
  const archiveThing = useToastHandler(apiArchiveThing, '封存音樂盒', onSuccess, onClose)

  const handleArchiveThing = async () => {
    try {
      await archiveThing(data.macAddress)
      onSuccess() // Trigger success callback
      onClose() // Close dialog after successful delete
    } catch (err) {
      setError('Failed to archive the item. Please try again.')
    }
  }

  return (
    <Dialog
      width={608}
      open={open}
      onClose={onClose}
      type={DialogType.Delete}
      title='封存音樂盒'
      content={
        <>

          <Typography variant='h4' color='primary' mb={3}>
            {data.storeName}
          </Typography>
          <Typography color={theme.palette.secondary.light} mb={2}>
            確定要封存此音樂盒資料嗎？<br />
            提醒您，封存的音樂盒將不列入總覽的各項統計數量中。
          </Typography>
        </>
      }
      onConfirm={handleArchiveThing}
    />
  )
}
