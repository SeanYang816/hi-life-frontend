import { Stack, Tabs, Tab, Box } from '@mui/material'
import { useTabs } from 'hooks/useTabs'
import { FirmwareTable, GroupTable, UserTable } from './tables'

enum CurrentTab {
  User = 0,
  Group = 1,
  Firmware = 2,
}

export const Settings = () => {
  const [currentTab, handleTabChange] = useTabs<CurrentTab>(CurrentTab.User)

  return (
    <>
      <Stack
        direction='row'
        spacing={2}
        justifyContent='space-between'
        alignItems='center'
        marginBottom={2}
      >
        <Tabs
          orientation='horizontal'
          variant='scrollable'
          value={currentTab}
          onChange={handleTabChange}
        >
          <Tab label='使用者' value={CurrentTab.User} />
          <Tab label='群組' value={CurrentTab.Group} />
          <Tab label='音樂盒韌體' value={CurrentTab.Firmware} />
        </Tabs>
      </Stack>
      <Box mt={-8}>
        {currentTab === CurrentTab.User && <UserTable />}
        {currentTab === CurrentTab.Group && <GroupTable />}
        {currentTab === CurrentTab.Firmware && <FirmwareTable />}
      </Box>
    </>
  )
}
