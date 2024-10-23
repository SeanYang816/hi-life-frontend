import { LocalizationProvider } from '@mui/x-date-pickers'
import { ThemeProvider } from 'providers/ThemeProvider'
import { ToastProvider } from 'providers/ToastProvider'
import { RouterProvider } from 'react-router-dom'
import { router } from 'routes'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { AuthProvider } from 'providers/AuthProvider'

function App() {

  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}

export default App
