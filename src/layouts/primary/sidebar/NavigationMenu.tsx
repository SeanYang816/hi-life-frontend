import {
  List,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routes } from 'routes'

export const NavigationMenu = () => {
  const theme = useTheme()
  const { spacing, palette } = theme

  const [isSelect, setIsSelect] = useState<string | null>(null)

  const handleSelect = (path: string | null) => setIsSelect(path)

  const selectedBackgroundColor = '#D9F2FB'
  const selectedButtonLineColor = '#12AEE7'

  const getStyles = (selected: boolean) => ({
    height: spacing(6.5),
    marginRight: spacing(3),
    backgroundColor: selected ? alpha(selectedBackgroundColor, 0.15) : 'inherit',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      height: spacing(6.5),
      width: spacing(0.5),
      borderRadius: spacing(0.5),
      backgroundColor: selectedButtonLineColor,
      display: selected ? 'block' : 'none'
    }
  })

  return (
    <Stack justifyContent='space-between'>
      {routes[1].children?.map((item) => {
        const selected = item.path === isSelect

        return (
          <List key={item.path} dense disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={selected}
              onClick={() => handleSelect(item.path)}
              sx={getStyles(selected)}
            >

              <ListItemIcon sx={{ color: selected ? palette.secondary.main : palette.secondary.light }}>
                {item?.icon}
              </ListItemIcon>

              <Typography variant='h4' color={selected ? '#333' : palette.secondary.light}>
                {item?.label}
              </Typography>

            </ListItemButton>
          </List>
        )
      })}
    </Stack>
  )
}