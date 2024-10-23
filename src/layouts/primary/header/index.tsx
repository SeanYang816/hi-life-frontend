import { IconButton, Stack, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext } from 'react'
import { UserMenu } from './UserMenu'
// import { ThemeContext } from 'providers/AuthProvider'

type HeaderProps = {
  isDesktop: boolean;
  onClick: () => void;
};

export const Header = ({ isDesktop, onClick }: HeaderProps) => {
  const theme = useTheme()
  // const data = useContext(ThemeContext)

  // const username = data?.username || 'User'

  return (
    <Stack
      width='100%'
      direction='row'
      justifyContent='space-between'
      alignItems='center'
    >
      {isDesktop ? (
        <img src='/src/assets/umedia-logo.png' alt='Umedia Logo' width='140' />
      ) : (
        <IconButton onClick={onClick}>
          <MenuIcon
            sx={{
              ml: theme.spacing(2),
              fontSize: theme.spacing(4.5),
              color: '#FFF'
            }}
          />
        </IconButton>
      )}

      <UserMenu username={'example'} />
    </Stack>
  )
}
