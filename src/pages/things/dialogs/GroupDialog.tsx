import {
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { apiUpdateThingsGroup } from 'api'
import { Dialog } from 'components/Dialog'
import { Select } from 'components/fields/Select'
import { DialogType } from 'enums'
import { useFormik } from 'formik'
import { MRT_RowSelectionState } from 'material-react-table'
import { FC } from 'react'
import { useGroupOptions } from 'hooks/useGroupOptions'
import 'react-toastify/dist/ReactToastify.css'
import { useToastHandler } from 'hooks/useToastHandler'

type Type = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  rowSelection: MRT_RowSelectionState;
};

enum Fields {
  GROUP_ID = 'groupID',
}

export const GroupDialog: FC<Type> = ({
  open,
  onClose,
  rowSelection,
  onSuccess
}) => {
  const theme = useTheme()
  const selectedRows = Object.keys(rowSelection).map((item) =>
    JSON.parse(item)
  )

  // Use the custom hook to fetch group options and manage pagination
  const { options, handleLoadMore } = useGroupOptions(25)
  const updateGroup = useToastHandler(apiUpdateThingsGroup, '更新群組', onSuccess, onClose)

  const formik = useFormik({
    initialValues: {
      [Fields.GROUP_ID]: ''
    },
    onSubmit: async (values) => {
      const payload = {
        [Fields.GROUP_ID]: Number(values[Fields.GROUP_ID]),
        macAddresses: selectedRows.map((item) => item.id)
      }
      await updateGroup(payload)

    }
  })

  return (
    <Dialog
      type={DialogType.Edit}
      width={550}
      open={open}
      onClose={onClose}
      title='群組音樂盒'
      description='在下拉選單中若需新增群組，請先至「設定」的群組分頁中新增。'
      content={
        <>
          <Stack
            direction='row'
            flexWrap='wrap'
            sx={{
              whiteSpace: 'nowrap',
              mb: 3
            }}
          >
            {selectedRows.map((item) => (
              <Typography
                key={item?.id}
                color={theme.palette.primary.main}
                variant='h5'
                mr={2}
              >
                {item?.name}
              </Typography>
            ))}
          </Stack>
          <Select
            {...formik.getFieldProps(Fields.GROUP_ID)}
            options={options}
            isLoadMore={true}
            onLoadMore={handleLoadMore}
          />
        </>
      }
      onConfirm={formik.handleSubmit}
    />
  )
}
