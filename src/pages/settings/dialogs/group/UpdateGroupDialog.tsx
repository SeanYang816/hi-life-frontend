import { TextField } from 'components/fields/Textfield'
import { useFormik } from 'formik'
import { DialogType } from 'enums'
import { apiCreateGroup, apiUpdateGroup } from 'api'
import { Dialog } from 'components/Dialog'
import * as Yup from 'yup'
import { FC } from 'react'
import { GroupResponseType } from 'types/api'
import { useToastHandler } from 'hooks/useToastHandler'

enum UpdateGroupFormFields {
  NAME = 'name',
}

type UpdateGroupDialogProps = {
  data: GroupResponseType;
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
};

export const UpdateGroupDialog: FC<UpdateGroupDialogProps> = ({
  data,
  open,
  onClose,
  onSuccess
}) => {
  const updateGroup = useToastHandler(apiUpdateGroup, '更新群組', onSuccess, onClose)
  const formik = useFormik({
    initialValues: {
      [UpdateGroupFormFields.NAME]: data.name
    },
    validationSchema: Yup.object({
      [UpdateGroupFormFields.NAME]: Yup.string().required('Group name is required')
    }),
    onSubmit: async (values) => {
      await updateGroup(data.id, values)
    }
  })

  return (
    <Dialog
      width={600}
      open={open}
      onClose={onClose}
      type={DialogType.Create}
      title='更新群組'
      content={
        <TextField
          label='群組名稱'
          placeholder='群組名稱'
          {...formik.getFieldProps(UpdateGroupFormFields.NAME)}
          error={Boolean(
            formik.errors[UpdateGroupFormFields.NAME] && formik.touched[UpdateGroupFormFields.NAME]
          )}
          helperText={
            formik.touched[UpdateGroupFormFields.NAME] && formik.errors[UpdateGroupFormFields.NAME]
          }
        />
      }
      onConfirm={formik.submitForm}
    />
  )
}
