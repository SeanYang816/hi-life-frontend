import React, { useEffect, useState } from 'react'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import useWebSocket from 'react-use-websocket'
import { GetThingResponse } from 'types/api'
import { formatBigIntWithDecimals, maxBigInt } from 'utils/math-utils'
import Circle from '@mui/icons-material/Circle'

const ACTIONS = {
  GET_THING_TX_RX_BYTES_LOGS: 'thing:get-thing-tx-rx-bytes-logs'
}

type LogType = {
  id: number;
  txBytes: string;
  rxBytes: string;
  txDiff: string;
  rxDiff: string;
  loggedAt: Date;
};

// Helper function to determine the unit and factor for conversion
const determineUnit = (maxValue: bigint) => {
  if (maxValue >= 1_000_000_000n) {
    return { unit: 'Gbps', factor: 1_000_000_000n }
  } else if (maxValue >= 1_000_000n) {
    return { unit: 'Mbps', factor: 1_000_000n }
  } else if (maxValue >= 1_000n) {
    return { unit: 'Kbps', factor: 1_000n }
  } else {
    return { unit: 'bps', factor: 1n }
  }
}

export const DeviceStatusTab = ({ data }: { data: GetThingResponse }) => {
  const [logsData, setLogsData] = useState<LogType[]>([])

  // WebSocket connection
  const { sendJsonMessage } = useWebSocket(
    `ws://${import.meta.env.VITE_APP_BACKEND_URI}:${import.meta.env.VITE_IP_WEBSOCKET_PORT}`,
    {
      heartbeat: {
        message: JSON.stringify({ event: 'pong' }),
        returnMessage: JSON.stringify({ event: 'ping' }),
        timeout: 60000,
        interval: 30000
      },
      queryParams: {
        token: localStorage.getItem('access_token') as string
      },
      onOpen: () => {
        console.info('Connection established.')
      },
      onMessage: (e) => {
        try {
          const data = JSON.parse(e.data)
          const event = data?.event

          switch (event) {
            case ACTIONS.GET_THING_TX_RX_BYTES_LOGS:
              setLogsData(data.logs)
              break
            default:
              console.error('Unexpected action.')
              break
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      },
      onClose: () => {
        console.info('Connection terminated.')
      },
      onError: () => {
        throw new Error('Something is wrong.')
      }
    }
  )

  useEffect(() => {
    // Define the function to send the message
    const sendMessage = () => {
      sendJsonMessage({
        event: ACTIONS.GET_THING_TX_RX_BYTES_LOGS,
        data: {
          macAddress: data.macAddress,
          logCount: 60
        }
      })
    }

    // Call sendMessage immediately
    sendMessage()

    // Set up the interval to call sendMessage every 10 minutes (600,000 milliseconds)
    const intervalId = setInterval(sendMessage, 10 * 60 * 1000)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [sendJsonMessage, data.macAddress])

  // Extracting time data and determining the max value for tx and rx separately
  const timeData = logsData.map((log) => new Date(log.loggedAt).toLocaleTimeString())

  const maxTxDiff = maxBigInt(logsData.map((log) => BigInt(log.txDiff)))
  const maxRxDiff = maxBigInt(logsData.map((log) => BigInt(log.rxDiff)))

  // Determine the units and factors for tx and rx separately
  const { unit: txUnit, factor: txFactor } = determineUnit(maxTxDiff)
  const { unit: rxUnit, factor: rxFactor } = determineUnit(maxRxDiff)

  // Convert the tx and rx data using their respective units
  const txRateData = logsData.map((log) => (BigInt(log.txDiff) * 8n) / txFactor)
  const rxRateData = logsData.map((log) => (BigInt(log.rxDiff) * 8n) / rxFactor)

  // Get the latest Tx and Rx rates for display
  const latestTxRate = BigInt(logsData[logsData.length - 1]?.txBytes || 0n)
  const latestRxRate = BigInt(logsData[logsData.length - 1]?.rxBytes || 0n)

  // ECharts options for Tx
  const txRateOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `TX Rate: ${formatBigIntWithDecimals(params[0].value, 3)} ${txUnit}`
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '5%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeData,
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      name: `TX Rate (${txUnit})`
    },
    series: [
      {
        name: 'TX Rate',
        data: txRateData,
        type: 'bar'
      }
    ]
  }

  // ECharts options for Rx
  const rxRateOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `RX Rate: ${formatBigIntWithDecimals(params[0].value, 3)} ${rxUnit}`
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '5%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeData,
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      name: `RX Rate (${rxUnit})`
    },
    series: [
      {
        name: 'RX Rate',
        data: rxRateData,
        type: 'bar'
      }
    ]
  }

  const list = [
    {
      label: '連線狀態',
      value: (
        <Stack direction='row' alignItems='center'>
          <Circle color={data.onlineStatus ? 'success'  : 'error' } />
          {data.onlineStatus ? 'Online' : 'Offline'}
        </Stack>
      )
    },
    {
      label: '播放來源與曲目',
      value: data.playingInfo
    },
    {
      label: 'Up Time',
      value: data.uptime
    },
    {
      label: 'Traffic',
      value: `Tx ${formatBigIntWithDecimals(latestTxRate, 3)} ${txUnit} / Rx ${formatBigIntWithDecimals(latestRxRate, 3)} ${rxUnit}`
    }
  ]

  return (
    <Stack width={'100%'}>
      <Stack width={'100%'}>
        {list.map((item, index) => (
          <React.Fragment key={index}>
            <Box component='section' display='flex' py={2}>
              <Typography width={160}>{item.label}</Typography>
              <Typography>{item.value}</Typography>
            </Box>
            <Divider />
          </React.Fragment>
        ))}
      </Stack>
      <Paper sx={{ borderRadius: 2.5, backgroundColor: '#F5F6FA', mt: 1.5 }}>
        <Stack spacing={2}>
          <ReactECharts option={txRateOption} style={{ height: '200px' }} />
          <ReactECharts option={rxRateOption} style={{ height: '200px' }} />
        </Stack>
      </Paper>
    </Stack>
  )
}
