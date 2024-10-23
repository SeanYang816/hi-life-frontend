import { OpenInNew } from '@mui/icons-material'
import { Paper, Stack, Typography, useTheme } from '@mui/material'
import { Dialog } from 'components/Dialog'
import { DialogController } from 'components/DialogController'
import { DialogTrigger } from 'components/DialogTrigger'
import { LinearChart } from '../charts/LinearChart'
import { DialogType } from 'enums'
import { TopologyChart } from '../charts/TopologyChart'

export const ThingConnectionStatusCard = ({ online, offline }: { online: number, offline: number }) => {
  const theme = useTheme()
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4'>音樂盒連線狀態 (已綁定)</Typography>
        <DialogController>
          {({ open, onOpen, onClose }) =>
            <>
              <DialogTrigger buttonTitle='IP Topology' onOpen={onOpen} iconText='樹狀圖' icon={<OpenInNew />}  iconColor={theme.palette.secondary.light}/>
              {open &&
              <Dialog
                width={1500}
                type={DialogType.Display}
                title='IP 樹狀圖'
                open={open}
                onClose={onClose}
                content={<TopologyChart />}
              />}
            </>}
        </DialogController>
      </Stack>
      <LinearChart onlineCount={online} offlineCount={offline} />
    </Paper>
  )
}
