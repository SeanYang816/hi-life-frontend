import React, { useContext, useState } from 'react'
import {
  Stack,
  Typography,
  Button,
  useTheme,
  Box,
  useMediaQuery,
  Theme,
  InputAdornment,
  IconButton,
  TextField
} from '@mui/material'
import { FormikErrors, FormikValues, useFormik } from 'formik'
import * as Yup from 'yup'
import { DialogController } from 'components/DialogController'
// import { apiGetAuthToken } from 'api'
import { useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { apiGetAuthToken } from 'api'
import { ThemeContext } from 'providers/AuthProvider'
// import { ThemeContext } from 'providers/AuthProvider'

enum FieldKey {
  Email = 'email',
  Password = 'password',
}

export const Login = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const [showPassword, setShowPassword] = useState(false)
  const { updateAuthContext } = useContext(ThemeContext)

  const formik = useFormik({
    initialValues: {
      [FieldKey.Email]: '',
      [FieldKey.Password]: ''
    },
    validationSchema: Yup.object().shape({
      [FieldKey.Email]: Yup.string().required().min(1).max(255),
      [FieldKey.Password]: Yup.string().required().min(1).max(255)
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const token = await apiGetAuthToken(values[FieldKey.Email], values[FieldKey.Password])

        if (token) {
          localStorage.setItem('access_token', token)

          updateAuthContext()

          navigate('/overview')
        }
      } catch (error) {
        setErrors(error as FormikErrors<FormikValues>)
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  return (
    <Stack
      component='form'
      direction='row'
      height='100vh'
      justifyContent='center'
      alignItems='center'
      onSubmit={formik.handleSubmit}
    >
      {isMedium && (
        <Box
          sx={{
            backgroundColor: '#EFF3F3',
            height: '100vh', // Set the height to cover the viewport height
            width: '60vw',
            display: 'block',
            position: 'absolute',
            left: 0
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src='src/assets/login-banner.png'
              width='100%'
              height='100%'
              style={{
                objectFit: 'cover'
              }}
            />
          </Box>
        </Box>
      )}

      <Stack
        justifyContent='center'
        alignItems='center'
        sx={{
          height: '100vh',
          width: isMedium ? '50vw' : '100vw',
          clipPath: isMedium
            ? 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'none',
          background: '#393939',
          position: 'absolute',
          right: 0
        }}
      >
        <Stack
          maxWidth={isMedium ? theme.spacing(100) : '80vw'}
          height='100%'
          justifyContent='center'
          px='20%'
        >
          <Stack>
            <Stack justifyContent='center' alignItems='center'>
              <img src='src/assets/umedia-logo.png' width='226x' />
            </Stack>

            <Typography
              variant='h1'
              color='#D5D7E3'
              textAlign='center'
              mt={4.5}
            >
              公播音樂盒雲端管理系統
            </Typography>
            <Typography
              variant='h3'
              color='#D5D7E3'
              textAlign='center'
              mb={4.5}>
              UPA2000
            </Typography>
          </Stack>

          <Stack>
            <TextField
              label='帳號'
              {...formik.getFieldProps(FieldKey.Email)}
              autoComplete='new-password'
              variant='outlined'
              fullWidth
              error={Boolean(
                formik.errors[FieldKey.Email] && formik.touched[FieldKey.Email]
              )}
              helperText={
                formik.errors[FieldKey.Email] && formik.touched[FieldKey.Email]
                  ? formik.errors[FieldKey.Email]
                  : ''
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFFFFF' // Border color when no error (white)
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFFFFF' // Border color when hovered and no error (white)
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFFFFF' // Border color when focused and no error (white)
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF' // Text color inside the input field (white)
                  }
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: '#FF9090' // Border color when error
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: '#FF9090' // Helper text color when error
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#FF9090' // Label color when error
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF' // Label color when no error (white)
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FFFFFF' // Label color when focused and no error (white)
                }
              }}
            />

            <Box mt={4} mb={3}>
              <TextField
                label='密碼'
                {...formik.getFieldProps(FieldKey.Password)}
                autoComplete='new-password'
                variant='outlined'
                fullWidth
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                error={Boolean(
                  formik.errors[FieldKey.Password] &&
                    formik.touched[FieldKey.Password]
                )}
                helperText={
                  formik.errors[FieldKey.Password] &&
                  formik.touched[FieldKey.Password]
                    ? formik.errors[FieldKey.Password]
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? (
                          <VisibilityOff htmlColor='#FF9090' fontSize='small' />
                        ) : (
                          <Visibility htmlColor='white' fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFFFFF' // Border color when no error (white)
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFFFFF' // Border color when hovered and no error (white)
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFFFFF' // Border color when focused and no error (white)
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF' // Text color inside the input field (white)
                    }
                  },
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: '#FF9090' // Border color when error
                    },
                  '& .MuiFormHelperText-root.Mui-error': {
                    color: '#FF9090' // Helper text color when error
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#FF9090' // Label color when error
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFFFFF' // Label color when no error (white)
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#FFFFFF' // Label color when focused and no error (white)
                  }
                }}
              />
              <DialogController>
                {({ open, onOpen, onClose }) => (
                  <>
                    <Typography
                      color='#D5D7E3'
                      variant='subtitle2'
                      onClick={onOpen}
                      textAlign='right'
                      width='100%'
                      sx={{
                        textDecoration: 'underline',
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        textTransform: 'none'
                      }}
                      pt={1}
                    >
                      Forgot Password?
                    </Typography>
                    {/* <ForgotPasswordDialog open={open} onClose={onClose} /> */}
                  </>
                )}
              </DialogController>
            </Box>

            <Button fullWidth type='submit' variant='contained' disabled={formik.isSubmitting}
              sx={{
                bgColor: '#09CEF6'
              }}
            >
              登入
            </Button>
          </Stack>

          <Stack id='footer'>
            <Typography variant='subtitle1' textAlign='center' color='#F5F6FA' mt={3}>
              Cloud: v {import.meta.env.VITE_VERSION}
            </Typography>
            <Typography textAlign='center' color='#F5F6FA' mt={3}>
              Powered by U-MEDIA Communications, Inc.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
