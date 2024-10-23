import { useEffect, useState } from 'react'
import { AppBar, Box, Toolbar, useMediaQuery, useTheme } from '@mui/material'
// import { Sidebar } from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'

export const PrimaryLayout = () => {
  const theme = useTheme()
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const navigate = useNavigate()
  const isMdUp = useMediaQuery('(min-width:600px)')

  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const handleDrawerButtonClick = () => setIsDrawerOpen((prev) => !prev)

  const headerHeight = 88
  const drawerWidth = 250
  const sidePadding = 20

  const headerBgColor = '#393939'
  const sidebarBgColor = '#FFF'
  const contentBgColor = '#F5F6FA'

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('access_token'))
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <>
      {/** Header */}
      <AppBar
        position='fixed'
        sx={{
          bgcolor: headerBgColor,
          height: `${headerHeight}px`,
          boxShadow: 'none'
        }}
      >
        <Toolbar disableGutters sx={{ padding: `${sidePadding}px` }}>
          <Header isDesktop={isMdUp} onClick={handleDrawerButtonClick} />
        </Toolbar>
      </AppBar>

      <Sidebar
        open={isMdUp ? true : isDrawerOpen}
        variant={isMdUp ? 'permanent' : 'persistent'}
        onClose={handleDrawerButtonClick}
        sx={{
          '.MuiDrawer-paper': {
            width: `${drawerWidth}px`,
            mt: `${headerHeight}px`,
            pt: theme.spacing(3),
            backgroundColor: sidebarBgColor
          }
        }}
      />

      {/** Contents */}
      <Box
        sx={{
          backgroundColor: contentBgColor,
          marginTop: `${headerHeight}px`,
          marginLeft: isMdUp ? `${drawerWidth}px` : 0,
          width: isMdUp ? `calc(100% - ${drawerWidth}px)` : '100%',
          minHeight: `calc(100vh - ${headerHeight}px)`,
          padding: `${sidePadding}px`
        }}
      >
        <Outlet />
      </Box>
    </>
  )
}
