import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactNode } from 'react'

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      <ToastContainer position='top-center' theme='colored' style={{
        minWidth: '300px',
        width: 'auto'
      }} />
      {children}
    </>
  )
}
