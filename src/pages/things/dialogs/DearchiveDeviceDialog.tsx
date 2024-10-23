import { Typography, useTheme } from '@mui/material'
import { apiDearchiveThing } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC, useState } from 'react'
import { GetThingResponse } from 'types/api'

type DearchiveDeviceDialogType = {
  data: GetThingResponse;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

export const DearchiveDeviceDialog: FC<DearchiveDeviceDialogType> = ({
  data,
  open,
  onClose,
  onSuccess
}) => {
  const theme = useTheme()
  const [error, setError] = useState<string | null>(null)
  const dearchiveThing = useToastHandler(apiDearchiveThing, '解封音樂盒', onSuccess, onClose)

  const handleDearchive = async () => {
    try {
      await dearchiveThing(data.macAddress)
      onSuccess()
      onClose()
    } catch (err) {
      setError('Failed to dearchive the item. Please try again.')
    }
  }

  return (
    <Dialog
      width={608}
      open={open}
      onClose={onClose}
      type={DialogType.Delete}
      title='解封音樂盒'
      content={
        <>

          <Typography variant='h4' color='primary' mb={3}>
            {data.storeName}
          </Typography>
          <Typography color={theme.palette.secondary.light} mb={2}>
            確定要解封該音樂盒資料嗎？<br />
            提醒您，解封存的音樂盒請將會重新進入總覽的各項統計數量中。
          </Typography>
        </>
      }
      onConfirm={handleDearchive}
    />
  )
}
