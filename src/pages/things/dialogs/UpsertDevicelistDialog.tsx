import {  Download } from '@mui/icons-material'
import { DialogType } from 'enums'
import { DialogButton } from 'components/DialogButton'
import { FC } from 'react'
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material'
import { FileUpload } from 'components/FileUpload'

type Props = {
  endpoint: string;
  onSuccess: VoidFunction;
};

const UpdateNotes: FC = () => {

  const theme = useTheme()
  return (
    <Box sx={{ color: theme.palette.secondary.light }}>
      <Typography fontSize={20}>匯入音樂盒注意事項：</Typography>
      <Box component='ol'>
        <li>匯入檔案格式請使用 excel.</li>
        <li> 匯入功能僅供新增音樂盒資料。 </li>
        <li>機碼和MAC 之任一欄位，不能為空白且不可重複。 </li>
        <li>MAC為 12 個16 進位數, ex. 001122334455, 不含 : , -</li>
        <li>支援單一 excel 文件中包含多個工作表(sheets)上傳，請確認每個工作表中欄位規格均符合上述規範。</li>
        <li>Excel 欄位的格式與位置，請遵照下載範例。</li>
      </Box>
    </Box>)
}

export const UpsertDevicelistDialog: FC<Props> = ({ endpoint, onSuccess }) => {
  const clickExport = () => {
    const a = document.createElement('a') // 建立一個<a></a>標籤
    a.href = '/static/player-import-example.xlsx' // 給a標籤的href屬性值加上地址，注意，這裡是絕對路徑，不用加點.
    a.download = 'importExample.xlsx' //設置下載文件文件名，這裡加上.xlsx指定文件類型，pdf文件就指定.fpd即可
    a.click() // 模擬點擊了a標籤，會觸發a標籤的href的讀取，瀏覽器就會自動下載了
    a.remove() // 一次性的，用完就刪除a標籤
  }
  return (
    <DialogButton
      width={1080}
      type={DialogType.Upload}
      icon={<Download />}
      buttonTitle='匯入音樂盒資料'
      dialogTitle='匯入音樂盒資料'
      dialogContent={
        <Grid container columnSpacing={4}>
          <Grid item xs={5}>
            <Stack direction='column' height='100%' justifyContent='space-between'>
              <UpdateNotes />
              <Button variant='contained' color='primary' sx={{ width: 155, fontSize: 18, fontWeight: 100, textTransform: 'none', ml: 5 }} onClick={clickExport}>Excel 範例下載</Button>
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <FileUpload endpoint={endpoint} onSuccess={onSuccess} />
          </Grid>
        </Grid>
      }
    />
  )
}
