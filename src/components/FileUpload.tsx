import React, { useMemo, useEffect } from 'react'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { axiosInstance } from 'api'
import { toast } from 'react-toastify'

type FileUploadProps = {
  endpoint: string;
  onClose?: VoidFunction;
  onSuccess?: VoidFunction;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onSuccess = () => {},
  onClose = () => {}
}) => {
  const token = localStorage.getItem('access_token')

  console.info('Base URL:', axiosInstance.defaults.baseURL)
  console.info('Upload Endpoint:', `${axiosInstance.defaults.baseURL}/${endpoint}`)

  const uppy = useMemo(() => {
    const uppyInstance = new Uppy({
      autoProceed: false,
      allowMultipleUploadBatches: false,
      restrictions: {
        maxFileSize: 1024 * 1024 * 1024 * 4, // 4GB
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1
      }
    }).use(XHRUpload, {
      endpoint: `${axiosInstance.defaults.baseURL}/${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 0,
      formData: true,
      method: 'POST',
      fieldName: 'file',
      responseType: 'json'
    })

    // Debugging Uppy events and tracking state
    uppyInstance.on('upload-success', (file, response) => {
      console.info('Upload Success:', file, response)

      if (response && response.body) {
        console.info('Server Response Body:', response.body)
      } else {
        console.error('No response body detected from the server.')
      }

      toast.success('新增韌體版本 成功')
    })

    uppyInstance.on('upload-error', (file, error, response) => {
      console.error('Upload Error:', error)
      if (response && response.body) {
        console.error('Response Body:', response.body)
      } else {
        console.error('No response body detected from the server.')
      }
      if (response && response.status) {
        console.error('Response Status Code:', response.status)
      } else {
        console.error('No response status detected.')
      }

      toast.error('上傳失敗')
    })

    // Track file added event
    uppyInstance.on('file-added', () => {
      uppyInstance.setState({ error: null })
    })

    // Track complete event
    // Track complete event
    // Track complete event
    uppyInstance.on('complete', (result) => {
      toast.success('文件已成功上傳')

      // Call onSuccess and onClose if defined
      onSuccess()
      onClose()

      // Use cancelAll to reset Uppy and clear the files
      uppyInstance.clear() // This will clear the uploaded files and reset the state
    })

    // Log progress during upload
    uppyInstance.on('progress', (progress) => {
    })

    // Catch all Uppy errors globally
    uppyInstance.on('error', (error) => {
      console.error('Uppy encountered an error:', error)
    })

    return uppyInstance
  }, [endpoint, token, onClose, onSuccess])

  // Cleanup Uppy instance on component unmount
  useEffect(() => {
    return () => {
      uppy.cancelAll()
    }
  }, [uppy])

  return (
    <div>
      <Dashboard
        uppy={uppy}
        id='Dashboard'
        width='100%'
        height='462px'
        hideProgressAfterFinish={true}
        showLinkToFileUploadResult={true}
        showRemoveButtonAfterComplete={true}
        proudlyDisplayPoweredByUppy={false}
        locale={{
          strings: {
            dropPasteFiles: '將文件拖放到此處 或 %{browseFiles}',
            browseFiles: '瀏覽文件'
          },
          pluralize: (count: number) => (count !== 1 ? 1 : 0)
        }}
      />
    </div>
  )
}
