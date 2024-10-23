import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { apiUpgradeFirmwares } from 'api'
import { useLatestFirmware } from 'hooks/useLatestFirmware'
import { useToastHandler } from 'hooks/useToastHandler'
import { FC, ReactElement } from 'react'
import { toast } from 'react-toastify'
import { GetThingResponse } from 'types/api'
import { formatDate } from 'utils'

type FirmwareTabProps = {
  data: GetThingResponse;
}

const FirmwareInfo: FC<{ title: string; content: string | ReactElement }> = ({ title, content }) => (
  <Box mb={3.5}>
    <Typography>{title}</Typography>
    <Typography color='primary'>{content}</Typography>
  </Box>
)

export const FirmwareTab: FC<FirmwareTabProps> = ({ data }) => {
  const { data: latestFirmware, loading, error } = useLatestFirmware()

  const firmwareDetails = latestFirmware
    ? [
      { title: '雲端系統上可提供更新的韌體版本', content: latestFirmware.fileName },
      { title: '版本建立時間 :', content: formatDate(latestFirmware.createdAt) },
      { title: '版本建立人員 :', content: latestFirmware.creator.username }
    ]
    : []

  const handleConfirm = async () => {
    try {
      await apiUpgradeFirmwares({
        macAddresses: [data.macAddress]
      })
      toast.success('已發送更新指令')
    } catch (err) {
      toast.error('發送更新指令失敗')
      console.error('Failed to upgrade firmware:', err)
    }
  }

  return (
    <>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={1}>
        <Box display='flex'>
          <Typography width={200}>韌體版本</Typography>
          <Typography>{data.firmwareVersion}</Typography>
        </Box>
        <Button
          sx={{ textDecoration: 'underline' }}
          onClick={handleConfirm}
          disabled={loading}
        >
          立即韌體更新
        </Button>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {error ? (
        <Typography color='error'>Failed to fetch firmware details.</Typography>
      ) : (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#F5F6FA',
            px: 2,
            py: 4
          }}
        >
          {firmwareDetails.map((detail, index) => (
            <FirmwareInfo key={index} title={detail.title} content={detail.content || '---'} />
          ))}
        </Paper>
      )}
    </>
  )
}
