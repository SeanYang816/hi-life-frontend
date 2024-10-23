import React, { useState } from 'react'

export type TabsFunction<T> = (_event: React.ChangeEvent<object>, newValue: T) => void;

export const useTabs = <T extends number>(initialIndex: T) => {
  const [tabIndex, setTabIndex] = useState(initialIndex)

  const handleTabChange: TabsFunction<T> = (_event, newValue) => {
    setTabIndex(newValue)
  }

  return [tabIndex, handleTabChange] as const
}
