import React, { FC } from 'react'

import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  useTheme
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'

type UserMenuProps = {
  username: string;
};

export const UserMenu: FC<UserMenuProps> = ({ username }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
    handleClose()
  }

  const avatarText = username.slice(0, 2).charAt(0).toUpperCase() + username.slice(1, 2).toLowerCase()

  return (
    <>
      <Button
        disableRipple
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {avatarText}
          </Avatar>
        }
      >
        <ExpandMoreIcon color={open ? 'primary' : 'secondary'} />
      </Button>

      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <List sx={{ width: theme.spacing(30), padding: theme.spacing(2) }}>
          <Typography variant='subtitle2' mb={1}>帳號：{username}</Typography>

          <Divider />

          <ListItem onClick={handleLogout}
            sx={{
              cursor: 'pointer'
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>
              <Typography>登出</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Popover>
    </>
  )
}
