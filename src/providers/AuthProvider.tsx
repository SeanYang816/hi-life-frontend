import { isAdmin, UserRoleId } from 'enums'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState, useCallback } from 'react'
import { DecodedToken } from 'types'

export type ThemeContextType = {
  username: string;
  isWrite: boolean;
  updateAuthContext: () => void;
};

// Default context value
const defaultContextValue: ThemeContextType = {
  username: 'User',
  isWrite: false,
  updateAuthContext: () => {}
}

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [contextData, setContextData] = useState<ThemeContextType>(defaultContextValue)

  // Function to update context data from the token
  const updateContextData = useCallback(() => {
    const token = localStorage.getItem('access_token')

    if (token) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token)
      const data: ThemeContextType = {
        username: decoded?.username || 'User',
        isWrite: isAdmin(decoded?.roleID as UserRoleId),
        updateAuthContext: updateContextData
      }
      setContextData(data)
    } else {
      setContextData({ ...defaultContextValue, updateAuthContext: updateContextData })
    }
  }, [])

  useEffect(() => {
    updateContextData()
  }, [updateContextData])

  return (
    <ThemeContext.Provider value={contextData}>
      {children}
    </ThemeContext.Provider>
  )
}
