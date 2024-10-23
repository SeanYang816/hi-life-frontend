import { Theme } from '@mui/material/styles'

export const createPalette = (theme: Theme) => ({
  primary: {
    main: '#09CEF6',
    contrastText: theme.palette.common.white
  },
  secondary: {
    main: '#5A607F',
    light: '#888',
    contrastText: theme.palette.common.white
  },
  warning: {
    main: theme.palette.warning.main,
    contrastText: theme.palette.common.white
  },
  info: {
    main: theme.palette.info.main,
    contrastText: theme.palette.common.white
  },
  success: {
    main: '#00B925',
    contrastText: theme.palette.common.white
  },
  error: {
    main: '#F0142F',
    contrastText: theme.palette.common.white
  }
})
