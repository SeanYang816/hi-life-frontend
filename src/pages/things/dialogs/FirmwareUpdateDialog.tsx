import {
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { apiUpgradeFirmwares } from 'api'
import { Dialog } from 'components/Dialog'
import { DialogType } from 'enums'
import { useLatestFirmware } from 'hooks/useLatestFirmware'
import { MRT_RowSelectionState } from 'material-react-table'
import { FC } from 'react'
import { toast } from 'react-toastify'

type FirmwareUpdateDialogProp = {
  rowSelection: MRT_RowSelectionState;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

export const FirmwareUpdateDialog: FC<FirmwareUpdateDialogProp> = ({
  rowSelection,
  open,
  onClose,
  onSuccess
}) => {
  const theme = useTheme()
  const { data } = useLatestFirmware()

  // Parsing row selection into a list of selected devices
  const selectedRows = Object.keys(rowSelection).map((item) =>
    JSON.parse(item)
  )

  // Function to handle the firmware upgrade process
  const handleSubmit = async () => {
    try {
      await apiUpgradeFirmwares({
        macAddresses: selectedRows.map((item) => item.id)
      })
      await toast.success('已發送更新指令')
      await onSuccess()
    } catch (err) {
      await toast.error('發送更新指令失敗')
      console.error('Failed to upgrade firmware:', err)
    }
  }

  const isSomeOffline = selectedRows.some((item) => item.onlineStatus === false)

  return (
    <Dialog
      disabled={!data?.fileName}
      open={open}
      onClose={onClose}
      type={DialogType.Edit}
      title='韌體更新'
      content={
        <>
          <Stack mb={2.5}>
            <Typography color={theme.palette.secondary.light}>
                  當前系統上可提供更新的韌體版本 :
            </Typography>
            <Typography color={theme.palette.primary.main} mt={1} fontWeight='bold'>
              {data?.fileName || '無法獲取版本'}
            </Typography>
          </Stack>
          <Stack>
            <Typography color={theme.palette.secondary.light} my={1}>
                  待更新的音樂盒 :
            </Typography>
            <Stack
              direction='row'
              flexWrap='wrap'
              sx={{
                whiteSpace: 'nowrap',
                mb: 3
              }}
            >
              {selectedRows.map((item) => (
                <Typography
                  key={item.id}
                  color={item.onlineStatus ? theme.palette.primary.main : theme.palette.error.main}
                  variant='h5'
                  mr={2}
                >
                  {item.name}
                </Typography>
              ))}
            </Stack>
            {isSomeOffline && (
              <Typography
                color='error'
                sx={{
                  position: 'absolute',
                  bottom: theme.spacing(5),
                  width: { xs: 160, sm: 'auto' } // Responsive width: 100% on xs and 160px on sm+
                }}
              >
                * 離線的音樂盒將不會被韌體更新
              </Typography>
            )}
          </Stack>
        </>
      }
      onConfirm={handleSubmit}
    />
  )
}
