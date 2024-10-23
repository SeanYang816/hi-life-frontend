import { TextField } from 'components/fields/Textfield'
import { useFormik } from 'formik'
import { DialogType } from 'enums'
import { apiCreateGroup, apiUpdateGroup } from 'api'
import { Dialog } from 'components/Dialog'
import * as Yup from 'yup'
import { FC } from 'react'
import { useToastHandler } from 'hooks/useToastHandler'

enum CreateGroupFormFields {
  NAME = 'name',
}

type CreateGroupDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

export const CreateGroupDialog: FC<CreateGroupDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const createGroup = useToastHandler(apiCreateGroup, '新增群組', onSuccess, onClose)

  const formik = useFormik({
    initialValues: {
      [CreateGroupFormFields.NAME]: ''
    },
    validationSchema: Yup.object({
      [CreateGroupFormFields.NAME]: Yup.string().required('Group name is required')
    }),
    onSubmit: async (values) => {
      await createGroup(values)
    }
  })

  return (
    <Dialog
      width={600}
      open={open}
      onClose={onClose}
      type={DialogType.Create}
      title='新增群組'
      content={
        <TextField
          label='群組名稱'
          placeholder='群組名稱'
          {...formik.getFieldProps(CreateGroupFormFields.NAME)}
          error={Boolean(
            formik.errors[CreateGroupFormFields.NAME] && formik.touched[CreateGroupFormFields.NAME]
          )}
          helperText={
            formik.touched[CreateGroupFormFields.NAME] && formik.errors[CreateGroupFormFields.NAME]
          }
        />
      }
      onConfirm={formik.submitForm}
    />
  )
}
