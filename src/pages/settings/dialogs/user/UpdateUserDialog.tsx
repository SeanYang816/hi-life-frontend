import { FC } from 'react'
import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { UserRoleId, DialogType } from 'enums'
import { SelectOptionProps } from 'types'
import { PasswordField } from 'components/fields/PasswordField'
import Radios from 'components/fields/Radios'
import { TextField } from 'components/fields/Textfield'
import { apiUpdateUser } from 'api'
import { Dialog } from 'components/Dialog'
import { UserResponseType } from 'types/api'
import { useToastHandler } from 'hooks/useToastHandler'

enum UpdateUserFormFields {
  USERNAME = 'username',
  ALIAS = 'alias',
  PASSWORD = 'password',
  ROLEID = 'roleID',
}

type UpdateUserDialogProps = {
  data: UserResponseType;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  isSelf: boolean;
};

export const UpdateUserDialog: FC<UpdateUserDialogProps> = ({
  data,
  open,
  onClose,
  onSuccess,
  isSelf
}) => {
  const updateUser = useToastHandler(apiUpdateUser, '更新使用者', onSuccess, onClose)
  const formik = useFormik({
    initialValues: {
      [UpdateUserFormFields.USERNAME]: data.username,
      [UpdateUserFormFields.ALIAS]: data.alias,
      [UpdateUserFormFields.PASSWORD]: '',
      [UpdateUserFormFields.ROLEID]: data.roleID
    },
    validationSchema: Yup.object({
      [UpdateUserFormFields.ALIAS]: Yup.string().required('Alias is required'),
      [UpdateUserFormFields.PASSWORD]: Yup.string(),
      [UpdateUserFormFields.ROLEID]: Yup.number()
        .oneOf(
          [
            UserRoleId.ADMIN,
            UserRoleId.VIEWER,
            UserRoleId.INSTALLATION_TECHNICIAN
          ],
          'Invalid permission'
        )
        .required('Permission is required')
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        [UpdateUserFormFields.ROLEID]: Number(
          values[UpdateUserFormFields.ROLEID]
        )
      }

      // Remove the password field if it is an empty string or only contains whitespace
      if (!values[UpdateUserFormFields.PASSWORD]?.trim()) {
        delete (payload as any)[UpdateUserFormFields.PASSWORD]
      }
      await updateUser(data.username, payload)
    }
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      type={DialogType.Create}
      title='編輯使用者'
      description='以下欄位均為必填。帳號為系統登入之電子郵件帳號，並輸入易識別之使用者名稱。'
      content={
        <Grid container columnSpacing={5}>
          <Grid item xs={8}>
            <TextField
              disabled
              label='帳號 *'
              placeholder='email'
              {...formik.getFieldProps(UpdateUserFormFields.USERNAME)}
            />
            <TextField
              label='使用者名稱 *'
              placeholder='中文或英文20字以內'
              {...formik.getFieldProps(UpdateUserFormFields.ALIAS)}
              error={Boolean(
                formik.errors[UpdateUserFormFields.ALIAS] &&
                  formik.touched[UpdateUserFormFields.ALIAS]
              )}
              helperText={
                formik.touched[UpdateUserFormFields.ALIAS] &&
                formik.errors[UpdateUserFormFields.ALIAS]
              }
            />
            <PasswordField
              label='密碼 *'
              placeholder='8 位字元任意英數字、符號的組合'
              {...formik.getFieldProps(UpdateUserFormFields.PASSWORD)}
              error={Boolean(
                formik.errors[UpdateUserFormFields.PASSWORD] &&
                  formik.touched[UpdateUserFormFields.PASSWORD]
              )}
              helperText={
                formik.touched[UpdateUserFormFields.PASSWORD] &&
                formik.errors[UpdateUserFormFields.PASSWORD]
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Radios
              disabled={isSelf}
              label='登入權限 *'
              {...formik.getFieldProps(UpdateUserFormFields.ROLEID)}
              onChange={(event) => {
                formik.setFieldValue(
                  UpdateUserFormFields.ROLEID,
                  Number(event.target.value)
                )
              }}
              options={
                [
                  { label: '管理權限', value: UserRoleId.ADMIN },
                  { label: '監看權限', value: UserRoleId.VIEWER }
                ] as SelectOptionProps[]
              }
            />
          </Grid>
        </Grid>
      }
      onConfirm={formik.submitForm}
    />
  )
}
