import { FC, ReactNode } from 'react'
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  IconButton
} from '@mui/material'
import { DialogType } from 'enums'
import { Close } from '@mui/icons-material'

type ReusableDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  type: DialogType; // Type to determine the dialog's appearance and behavior
  title: string;
  description?: string;
  content: ReactNode; // Content of the dialog (e.g., form fields)
  onConfirm?: VoidFunction; // Action on confirm button click
  confirmText?: string; // Text for the confirm button
  cancelText?: string; // Text for the cancel button
  width?: number | string; // Width of the dialog
  disabled?: boolean;
};

export const Dialog: FC<ReusableDialogProps> = ({
  disabled,
  open,
  onClose,
  type,
  title,
  description,
  content,
  onConfirm,
  confirmText = '確定',
  cancelText = '取消',
  width = 'md'
}) => {
  const theme = useTheme()

  return (
    <MuiDialog fullWidth open={open} onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          borderRadius: theme.spacing(1),
          minWidth: width,
          maxWidth: width
        }
      }}
    >
      <DialogTitle
        textAlign='center'
        variant='h2'
        color={
          type === DialogType.Delete ? 'error' : theme.palette.secondary.main
        }
      >
        {title}
        {description && (
          <Typography color={theme.palette.secondary.light} mt={2} textAlign='left'>
            {description}
          </Typography>
        )}
        {type === DialogType.Display && <IconButton title='Close' onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Close fontSize='large' />
        </IconButton>}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      {type !== DialogType.Display &&
      <DialogActions>
        <Button onClick={onClose} sx={{ color: theme.palette.secondary.light, fontWeight: 300 }} >
          {cancelText}
        </Button>
        {!disabled && onConfirm && (
          <Button
            onClick={onConfirm}
            color={type === DialogType.Delete ? 'error' : 'primary'}
            sx={{ fontWeight: 600 }}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
      }
    </MuiDialog>
  )
}
