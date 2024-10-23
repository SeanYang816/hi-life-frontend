import { FormikProps, FormikValues, FieldConfig } from 'formik'

type GenericFormikType<T> = FormikProps<T>;

export const formikProps = <T extends FormikValues>(
  fieldKey: keyof T,
  formik: GenericFormikType<T>,
  fieldConfig?: FieldConfig
) => {
  const { getFieldProps, touched, errors } = formik
  const errorText = formik.errors[fieldKey] as string

  return {
    ...getFieldProps({ name: String(fieldKey), ...fieldConfig }),
    error: !!touched[fieldKey] && !!errors[fieldKey],
    helperText: !!touched[fieldKey] && errorText ? errorText : undefined
  }
}
