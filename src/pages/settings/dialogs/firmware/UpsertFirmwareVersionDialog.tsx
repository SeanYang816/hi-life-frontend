import { DialogType } from 'enums'
import { FC, ReactElement } from 'react'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import { FileUpload } from 'components/FileUpload'
import { Dialog } from 'components/Dialog'
import { useLatestFirmware } from 'hooks/useLatestFirmware'
import { formatDate } from 'utils'

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

const UpdateInfo: FC<{ title: string; content: string | ReactElement }> = ({ title, content }) => (
  <Box>
    <Typography>{title}</Typography>
    <Typography color='primary'>{content}</Typography>
  </Box>
)
const UpdateNotes: FC = () => {

  const theme = useTheme()
  return (
    <Box sx={{ color: theme.palette.secondary.light }}>
      <Typography fontSize={20}>韌體更新注意事項：</Typography>
      <Box component='ol'>
        <li>系統上可提供更新的韌體檔案，由此上傳。分隔且必須以 ".bin" 作為副檔名。</li>
        <li>需要進行韌體更新的音樂盒，建議批次於音樂盒列表進行更新。</li>
        <li>必須以 "FW_" 開頭後接著一個版本號，版本號包含四個數字，數字之間用點 "."</li>
      </Box>
    </Box>)
}

export const UpsertFirmwareVersionDialog: FC<Props> = ({ open, onClose, onSuccess }) => {
  const { data: latestFirmware, loading, error } = useLatestFirmware()

  return (

    <Dialog
      open={open}
      onClose={onClose}
      width={1080}
      type={DialogType.Display}
      title='韌體版本'
      content={
        <Grid container columnSpacing={4}>
          <Grid item xs={5}>
            <Stack direction='column' sx={{ flexGrow: 1 }} height='100%' justifyContent='space-between'>
              <UpdateNotes />
              <Stack spacing={3}>
                <UpdateInfo title='當前系統上可提供更新的韌體版本 :' content={latestFirmware?.fileName} />
                <UpdateInfo title='更新時間 :' content={formatDate((latestFirmware?.createdAt))} />
                <UpdateInfo title='更新人員 :' content={latestFirmware?.creator?.username} />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <FileUpload endpoint='firmwares' onSuccess={onSuccess} onClose={onClose} />
          </Grid>
        </Grid>
      }
      onConfirm={() => {}}
    />
  )

}
