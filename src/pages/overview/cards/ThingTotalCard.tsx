import { Paper, Stack, Typography, Box, Grid2 as Grid, useTheme } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { StreamingSourceType } from 'types/api'

interface DataNode {
  name: string;
  value: number;
  color: string;
}

export const ThingTotalCard = ({
  stoppedCnt,
  backupCnt,
  streamingCnt
}: StreamingSourceType) => {
  const theme = useTheme()
  const data: DataNode[] = [
    { name: '已綁定', value: backupCnt, color: '#5470C6' },
    { name: '未裝機', value: stoppedCnt, color: '#FAC858' },
    { name: '待綁定', value: streamingCnt, color: '#80C0DB' }
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Streaming Source',
        type: 'pie',
        radius: ['40%', '70%'],
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        label: {
          show: false
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h4'>音樂盒播放來源與狀態</Typography>
        </Stack>

        <Grid container justifyContent='center' alignItems='center'>
          {data.map((item) => (
            <Grid size={4} key={item.name} >
              <Stack direction='row' alignItems='center' spacing={1}>
                <Box data-name='color-box'
                  sx={{
                    width: 24,
                    height: 16,
                    backgroundColor: item.color,
                    borderRadius: 1
                  }}
                />
                <Stack direction='row' justifyContent='space-between' width={theme.spacing(10)}>
                  <Typography variant='body1' noWrap>{item.name}</Typography>
                  <Typography variant='h4' noWrap>{item.value}</Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <ReactECharts option={option} style={{ height: 300, width: '100%' }} />
        <Typography fontSize={12} color='secondary' textAlign='center'>*「待綁定」表示雲端尚未匯入新裝機的MAC和地址資料</Typography>
      </Stack>
    </Paper>
  )
}
