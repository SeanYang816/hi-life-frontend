import { Theme } from '@mui/material/styles'

export const createComponents = (theme: Theme) => ({
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: `${theme.spacing(3)} ${theme.spacing(6)}`
      }
    }
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: `${theme.spacing(3)} ${theme.spacing(6)}`
      }
    }
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: `${theme.spacing(3)} ${theme.spacing(6)}`
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        fontSize: theme.spacing(3),
        boxShadow: 'none'
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        width: '45px',
        height: '45px',
        '> svg': {
          width: '36px',
          height: '36px'
        }
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontSize: '20px',
        color: theme.palette.secondary.light,
        fontWeight: 600
      }
    }
  }
})
