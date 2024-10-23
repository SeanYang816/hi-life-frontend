import React, { ReactNode } from 'react'
import { CssBaseline, ThemeProvider as Provider, createTheme, GlobalStyles } from '@mui/material'
import { createPalette, createTypography, createComponents, breakpoints } from '../themes'

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Step 1: Create a base theme to pass to the palette and typography functions
  const baseTheme = createTheme()

  // Step 2: Create the custom palette and typography
  const palette = createPalette(baseTheme)
  const typography = createTypography(baseTheme)

  // Step 3: Create a theme with the custom palette and typography
  const intermediateTheme = createTheme({
    palette,
    typography,
    breakpoints
  })

  // Step 4: Create components with the fully created intermediate theme
  const components = createComponents(intermediateTheme)

  // Step 5: Create the final theme with components included
  const theme = createTheme({
    ...intermediateTheme,
    components
  })

  // Apply global styles to set the html font size
  const globalStyles = <GlobalStyles styles={{ html: { fontSize: '18px' } }} />

  return (
    <Provider theme={theme}>
      {globalStyles}
      <CssBaseline />
      {children}
    </Provider>
  )
}
