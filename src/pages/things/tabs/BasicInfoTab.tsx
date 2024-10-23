import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { FC } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'  // Import Yup for validation
import { GetThingResponse } from 'types/api'
import { TextField } from 'components/fields/Textfield'
import { apiUpdateThing } from 'api'
import { getMemberLevelLabel } from 'enums'
import { useGroupOptions } from 'hooks/useGroupOptions'
import { SelectOptionProps } from 'types'
import { Select } from 'components/fields/Select'

enum Fields {
  STORE_NAME = 'storeName',
  GROUP_ID = 'groupID',
}

type BasicInfoTabType = {
  data: GetThingResponse;
  onSuccess: VoidFunction;
}

export const BasicInfoTab: FC<BasicInfoTabType> = ({ data, onSuccess = () => {} }) => {
  const { options, handleLoadMore } = useGroupOptions(5)

  const modelType = (type: string) => {
    switch (type) {
      case '0x020322':
      default:
        return 'FunPlay 第三代'
    }
  }

  const infoList = [
    { label: '機碼', value: data.machineCode },
    { label: 'MAC', value: data.macAddress },
    { label: '型號', value: modelType(data.model) },
    { label: '會員等級', value: getMemberLevelLabel(data.memberLevel) }
  ]

  const formik = useFormik({
    initialValues: {
      [Fields.GROUP_ID]: data.groupID,
      [Fields.STORE_NAME]: data.storeName
    },
    validationSchema: Yup.object().shape({
      [Fields.STORE_NAME]: Yup.string()
        .required('Store name is required')
    }),
    onSubmit: async (values) => {
      await apiUpdateThing(data.macAddress, values)
      await onSuccess()
    }
  })

  const handleReset = () => {
    formik.resetForm()
  }

  return (
    <Stack width='100%'>
      <Stack width='100%'>
        {infoList.map((item) => (
          <React.Fragment key={item.label}>
            <Box display='flex' py={2}>
              <Typography width={160}>{item.label}</Typography>
              <Typography>{item?.value}</Typography>
            </Box>
            <Divider />
          </React.Fragment>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: 2.5, backgroundColor: '#F5F6FA', px: 4, py: 2, mt: 1.5 }}>
        <Stack>
          <Box display='flex' alignItems='center' py={1}>
            <Typography width={100} mt={2}>
              識別名稱
            </Typography>
            <TextField
              {...formik.getFieldProps(Fields.STORE_NAME)}
              error={Boolean(formik.errors[Fields.STORE_NAME] && formik.touched[Fields.STORE_NAME])}
              helperText={formik.errors[Fields.STORE_NAME]}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff'
                }
              }}
            />
          </Box>

          <Box display='flex' alignItems='center'>
            <Typography width={100} mt={2}>
              群組
            </Typography>
            <Select
              clearable
              initialOption={{ label: data.groupName, value: data.groupID } as SelectOptionProps}
              options={options}
              isLoadMore
              onLoadMore={handleLoadMore}
              {...formik.getFieldProps(Fields.GROUP_ID)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff'
                },
                '& .MuiSelect-select': {
                  backgroundColor: '#fff'
                }
              }}
            />
          </Box>

          <Box display='flex' justifyContent='flex-end' mt={2}>
            <Button onClick={handleReset} sx={{ color: '#888', fontWeight: 500 }}>清除</Button>
            <Button onClick={() => formik.handleSubmit()}>
              儲存
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  )
}
