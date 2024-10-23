import { PrimaryLayout } from 'layouts/primary'
import { Login } from 'pages/login'
import { Overview } from 'pages/overview'
import {
  createBrowserRouter
} from 'react-router-dom'
import { LeaderboardOutlined, HomeOutlined, SettingsOutlined } from '@mui/icons-material'
import { Things } from 'pages/things'
import { Settings } from 'pages/settings'

export const routes =  [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <PrimaryLayout />,
    children: [
      {
        label: '總覽',
        path: '/overview',
        element: <Overview />,
        icon: <HomeOutlined />
      },
      {
        label: '音樂盒列表',
        path: '/things',
        element: <Things />,
        icon: <LeaderboardOutlined />
      },
      {
        label: '設定',
        path: '/settings',
        element: <Settings />,
        icon: <SettingsOutlined />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
