import { Grid2 as Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { apiGetLoginStatus, apiGetOverview } from 'api'
import { GetLoginStatusLogsType, OverviewResponseType } from 'types/api'
import { useCountdown } from 'hooks/useCountdown'
import { ThingConnectionStatusCard } from './cards/ThingConnectionStatusCard'
import { ThingTotalCard } from './cards/ThingTotalCard'
import { ThingStreamingStatusCard } from './cards/ThingStreamingStatusCard'

export const Overview = () => {
  const INITIAL_COUNTDOWN_SECOND = 600

  const [data, setData] = useState<OverviewResponseType>()
  const [statusData, setStatusData] = useState<GetLoginStatusLogsType[]>([])

  const fetchData = async () => {
    try {
      const overviewData: OverviewResponseType = await apiGetOverview()
      setData(overviewData)

      const loginStatusData: GetLoginStatusLogsType[] = await apiGetLoginStatus()
      setStatusData(loginStatusData.reverse())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Use the custom countdown hook to fetch data when the countdown ends
  const { countdown, formatTime } = useCountdown(INITIAL_COUNTDOWN_SECOND, fetchData)

  return (
    <>
      <Typography variant='h2' mb={5.5}>
        總覽
      </Typography>
      <Typography variant='subtitle1' mb={1} color='secondary'>
        每10分鐘自動刷新 ({formatTime(countdown)})
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ lg: 4, sm: 12 }}>
          <ThingConnectionStatusCard
            online={data?.onlineCnt ?? 70}
            offline={data?.offlineCnt ?? 30}
          />
        </Grid>
        <Grid size={{ lg: 4, md: 6, sm: 12 }}>
          <ThingStreamingStatusCard
            backupCnt={10}
            stoppedCnt={20}
            streamingCnt={30}
          />
        </Grid>

        <Grid size={{ lg: 4, md: 6, sm: 12 }}>
          <ThingTotalCard
            backupCnt={20}
            stoppedCnt={25}
            streamingCnt={12}
          />
        </Grid>
      </Grid>
    </>
  )
}
