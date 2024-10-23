import { Theme } from '@mui/material/styles'

export const createTypography = (_theme: Theme) => ({
  fontFamily: 'Poppins, Source Han Sans TW, Helvetica, Arial',

  h1: {
    fontSize: '32px',
    fontWeight: 600
  },
  h2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '28px',
    fontWeight: 600
  },
  h3: {
    fontSize: '24px',
    fontWeight: 500
  },
  h4: {
    fontSize: '20px',
    fontWeight: 600
  },
  h5: {
    fontSize: '18px',
    fontWeight: 500
  },
  h6: {
    fontSize: '16px',
    fontWeight: 500
  },
  body1: {
    fontSize: '1rem', // This will be 18px since 1rem is set to 18px
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.9rem', // This will be 16.2px since 1rem is set to 18px
    lineHeight: 1.4
  },
  subtitle1: {
    fontSize: '0.9rem', // This will be 16.2px since 1rem is set to 18px
    fontWeight: 400
  },
  subtitle2: {
    fontSize: '0.8rem', // This will be 14.4px since 1rem is set to 18px
    fontWeight: 400
  },
  caption: {
    fontSize: '0.7rem', // This will be 12.6px since 1rem is set to 18px
    fontWeight: 400
  },
  overline: {
    fontSize: '0.7rem', // This will be 12.6px since 1rem is set to 18px
    fontWeight: 500
  }
})
