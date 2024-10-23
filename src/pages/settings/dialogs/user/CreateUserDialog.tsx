import { FC } from 'react'
import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { UserRoleId, DialogType } from 'enums'
import { SelectOptionProps } from 'types'
import { PasswordField } from 'components/fields/PasswordField'
import Radios from 'components/fields/Radios'
import { TextField } from 'components/fields/Textfield'
import { apiCreateUser } from 'api'
import { Dialog } from 'components/Dialog'
import { useToastHandler } from 'hooks/useToastHandler'

enum CreateUserFormFields {
  USERNAME = 'username',
  ALIAS = 'alias',
  PASSWORD = 'password',
  ROLEID = 'roleID',
}

type CreateUserDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

export const CreateUserDialog: FC<CreateUserDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {

  const createUser = useToastHandler(apiCreateUser, '新增使用者', onSuccess, onClose)
  const formik = useFormik({
    initialValues: {
      [CreateUserFormFields.USERNAME]: '',
      [CreateUserFormFields.ALIAS]: '',
      [CreateUserFormFields.PASSWORD]: '',
      [CreateUserFormFields.ROLEID]: null
    },
    validationSchema: Yup.object({
      [CreateUserFormFields.USERNAME]: Yup.string()
        .email('Invalid email format') // Must be a valid email
        .required('Username is required'),

      [CreateUserFormFields.ALIAS]: Yup.string()
        .max(20, 'Alias must be 20 characters or less') // Max 20 characters
        .required('Alias is required'),

      [CreateUserFormFields.PASSWORD]: Yup.string()
        .min(8, 'Password must be at least 8 characters') // At least 8 characters
        .matches(
          /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/,
          'Password must contain only letters, numbers, and special characters'
        ) // Combination of letters, numbers, and special characters
        .required('Password is required'),

      [CreateUserFormFields.ROLEID]: Yup.number()
        .oneOf(
          [UserRoleId.ADMIN, UserRoleId.VIEWER, UserRoleId.INSTALLATION_TECHNICIAN],
          'Invalid permission'
        )
        .required('Permission is required')
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        [CreateUserFormFields.ROLEID]: Number(values[CreateUserFormFields.ROLEID])
      }
      await createUser(payload)
    }
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      type={DialogType.Create}
      title='新增使用者'
      description='以下欄位均為必填。帳號為系統登入之電子郵件帳號，並輸入易識別之使用者名稱。'
      content={
        <Grid container columnSpacing={5}>
          <Grid item xs={8}>
            <TextField
              label='帳號 *'
              placeholder='email'
              {...formik.getFieldProps(CreateUserFormFields.USERNAME)}
              error={Boolean(
                formik.errors[CreateUserFormFields.USERNAME] &&
                  formik.touched[CreateUserFormFields.USERNAME]
              )}
              helperText={
                formik.touched[CreateUserFormFields.USERNAME] &&
                formik.errors[CreateUserFormFields.USERNAME]
              }
            />
            <TextField
              label='使用者名稱 *'
              placeholder='中文或英文20字以內'
              {...formik.getFieldProps(CreateUserFormFields.ALIAS)}
              error={Boolean(
                formik.errors[CreateUserFormFields.ALIAS] &&
                  formik.touched[CreateUserFormFields.ALIAS]
              )}
              helperText={
                formik.touched[CreateUserFormFields.ALIAS] &&
                formik.errors[CreateUserFormFields.ALIAS]
              }
            />
            <PasswordField
              label='密碼 *'
              placeholder='8 位字元任意英數字、符號的組合'
              {...formik.getFieldProps(CreateUserFormFields.PASSWORD)}
              error={Boolean(
                formik.errors[CreateUserFormFields.PASSWORD] &&
                  formik.touched[CreateUserFormFields.PASSWORD]
              )}
              helperText={
                formik.touched[CreateUserFormFields.PASSWORD] &&
                formik.errors[CreateUserFormFields.PASSWORD]
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Radios
              label='登入權限 *'
              {...formik.getFieldProps(CreateUserFormFields.ROLEID)}
              onChange={(event) => {
                formik.setFieldValue(
                  CreateUserFormFields.ROLEID,
                  Number(event.target.value)
                )
              }}
              options={[
                { label: '管理權限', value: UserRoleId.ADMIN },
                { label: '監看權限', value: UserRoleId.VIEWER }
              ] as SelectOptionProps[]}
            />
          </Grid>
        </Grid>
      }
      onConfirm={formik.submitForm}
    />
  )
}
