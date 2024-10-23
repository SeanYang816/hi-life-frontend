import { Stack, Tab, Tabs } from '@mui/material'
import { useTabs } from 'hooks/useTabs'
import { useTheme } from '@mui/material/styles'
import { BasicInfoTab } from 'pages/things/tabs/BasicInfoTab'
import { DeviceStatusTab } from '../tabs/DeviceStatusTab'
import { DeviceLogsTab } from '../tabs/DeviceLogsTab'
import { FirmwareTab } from '../tabs/FirmwareTab'
import { FC, useCallback, useMemo } from 'react'
import { GetThingResponse } from 'types/api'
import { DialogType } from 'enums'
import ErrorBoundary from 'components/ErrorBoundary'
import { Dialog } from 'components/Dialog'

enum InfoTab {
  BasicInfo = 0,
  DeviceStatus = 1,
  DeviceRecord = 2,
  DeviceFirmware = 3,
}

const tabLabels = {
  [InfoTab.BasicInfo]: '基本資料',
  [InfoTab.DeviceStatus]: '音樂盒狀態',
  [InfoTab.DeviceRecord]: '音樂盒紀錄',
  [InfoTab.DeviceFirmware]: '音樂盒韌體'
}

type InfoDialogProps = {
  data: GetThingResponse;
  onSuccess: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
};

export const InfoDialog: FC<InfoDialogProps> = ({ open, onClose, data, onSuccess }) => {
  const theme = useTheme()
  const [currentTab, handleTabChange] = useTabs<InfoTab>(InfoTab.BasicInfo)

  const selectedBackgroundColor = '#7E84A3'
  const unselectedBackgroundColor = '#F5F6FA'
  const selectedTextColor = '#FFFFFF'

  // Tab style callback to apply styles dynamically based on the current tab
  const getTabStyles = useCallback((tab: InfoTab) => ({
    marginBottom: theme.spacing(1),
    color: theme.palette.secondary.light,
    backgroundColor: currentTab === tab ? selectedBackgroundColor : unselectedBackgroundColor,
    borderRadius: theme.spacing(1.25),
    '&.Mui-selected': {
      color: selectedTextColor
    }
  }), [currentTab, theme])

  // Render the tab components dynamically
  const renderedTabs = useMemo(() => (
    Object.values(InfoTab)
      .filter((value) => typeof value === 'number')  // Ensure we only deal with numbers (tab indexes)
      .map((tab) => (
        <Tab
          key={tab}
          tabIndex={tab as InfoTab}
          label={tabLabels[tab as InfoTab]}  // Make sure the label matches the enum value
          sx={getTabStyles(tab as InfoTab)}
          disableRipple
        />
      ))
  ), [getTabStyles])

  // Dynamically render tab content based on the current tab
  const renderTabContent = useMemo(() => {
    switch (currentTab) {
      case InfoTab.BasicInfo:
        return <BasicInfoTab data={data} onSuccess={onSuccess} />
      case InfoTab.DeviceStatus:
        return <DeviceStatusTab data={data} />
      case InfoTab.DeviceRecord:
        return <DeviceLogsTab data={data} />
      case InfoTab.DeviceFirmware:
        return <FirmwareTab data={data} />
      default:
        return null  // Ensure we return null for invalid tab cases
    }
  }, [currentTab, data, onSuccess])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={1080}
      type={DialogType.Display}
      title='音樂盒詳細資訊'
      content={
        <Stack direction='row'>
          <Tabs
            TabIndicatorProps={{ style: { display: 'none' } }}
            orientation='vertical'
            variant='scrollable'
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              minWidth: 156,
              mr: 7,
              position: 'sticky',
              top: 0,
              alignSelf: 'flex-start',
              maxHeight: '100vh',
              overflowY: 'auto'
            }}
          >
            {renderedTabs}
          </Tabs>
          <Stack sx={{ width: '100%', overflowY: 'auto', maxHeight: '100vh' }}>
            <ErrorBoundary>
              {renderTabContent}
            </ErrorBoundary>
          </Stack>
        </Stack>
      }
    />
  )
}
