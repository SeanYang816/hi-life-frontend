import axios from 'axios'
import { getUrl } from 'config'
import {
  ThingsTopologyType,
  FirmwareResponseType,
  GroupResponseType,
  OverviewResponseType,
  UserResponseType,
  GetLoginStatusLogsType
} from 'types/api'
import { CreateGroupPayload, CreateUserPayload, UpdateGroupPayload, UpdateThingPayload, UpdateThingsGroupPayload, UpdateUserPayload, UpsertFirmwarePayload } from 'types/payload'
import { camelToSnakeCase, transformObjectKeysToSnakeCase } from 'utils'

export const axiosInstance = axios.create({
  baseURL: getUrl()
})

// 拿token用
export const apiGetAuthToken = async (username: string, password: string) => {
  const url = '/auth/login'

  try {
    const response = await axiosInstance.post(url, { username, password })
    const token = response.data.access_token

    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      console.error('Token not found in the response')
    }

    return token
  } catch (error) {
    console.error('Error:', error)
    throw error // Re-throw the error if needed
  }
}

// 拿音樂盒列表用
export const apiGetThings = async ({ ...params }) => {
  const customizedParams = { ...params }

  if (customizedParams?.sort?.length) {
    // Replace 'specialKey' with the actual key you want to format differently
    customizedParams.sort = `${camelToSnakeCase(customizedParams.sort[0].id)}:${
      customizedParams.sort[0].desc ? 'desc' : 'asc'
    }`
  }

  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('/things', {
      params: transformObjectKeysToSnakeCase(customizedParams),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { things, total } = response.data
    return [things, total]
  } catch (error) {
    console.error('Error fetching things:', error)
    throw error
  }
}

// 拿音樂盒紀錄用
export const apiGetDeviceLogsByMacAddress = async (id: string, {
  ...params
})=> {
  const customizedParams = { ...params }

  if (customizedParams?.sort?.length) {
    // Replace 'specialKey' with the actual key you want to format differently
    customizedParams.sort = `${camelToSnakeCase(customizedParams.sort[0].id)}:${
      customizedParams.sort[0].desc ? 'desc' : 'asc'
    }`
  }

  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get(`/things/${id}/kkbox-logs`, {
      params: transformObjectKeysToSnakeCase(customizedParams),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { logs, total } = response.data
    return [logs, total]
  } catch (error) {
    console.error('Error fetching firmwares:', error)
    throw error
  }
}
// 拿總覽 音樂盒連線狀態 和 音樂盒播放來源與狀態 資料用
export const apiGetOverview = async (): Promise<OverviewResponseType> => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('overview', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}

// 拿樹狀圖用
export const apiGetThingsTopology = async (ids: number[]): Promise<[{ things : ThingsTopologyType}]> => {
  try {
    const token = localStorage.getItem('access_token')

    // Build query parameters with the array of ids
    const params = new URLSearchParams()
    ids.forEach(id => params.append('group_ids[]', id.toString()))

    const response = await axiosInstance.get(`overview/things-topology?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data.things
  } catch (error) {
    console.error('Error fetching device topology:', error)
    throw error
  }
}

// 拿登入狀況圖用
export const apiGetLoginStatus = async (): Promise<GetLoginStatusLogsType[]> => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('overview/login-status', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.logs
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}

// 使用者 users
export const apiGetUsers = async ({
  ...params
}): Promise<[UserResponseType[], number]> => {
  const customizedParams = { ...params }

  if (customizedParams?.sort?.length) {
    // Replace 'specialKey' with the actual key you want to format differently
    customizedParams.sort = `${camelToSnakeCase(customizedParams.sort[0].id)}:${
      customizedParams.sort[0].desc ? 'desc' : 'asc'
    }`
  }

  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('/users', {
      params: transformObjectKeysToSnakeCase(customizedParams),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { users, total } = response.data
    return [users, total] // Return an array (tuple) with two elements
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const apiCreateUser = async ({ ...params }: CreateUserPayload) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axiosInstance.post('/users', params, config)

    return response.data
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}

export const apiUpdateUser = async (username: string, { ...params }: UpdateUserPayload) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axiosInstance.patch(`/users/${username}`, params, config)

    return response.data
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error // Re-throw the error to be handled by the caller
  }
}

export const apiDeleteUser = async (name: string) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    // Make the DELETE request to /users/:name
    const response = await axiosInstance.delete(
      `/users/${encodeURIComponent(name)}`,
      config
    )

    return response.data
  } catch (error) {
    // Handle any errors (e.g., log them, throw them, etc.)
    console.error('Failed to delete user:', error)
    throw error // Re-throw the error to be handled by the caller
  }
}

// 使用者 groups
export const apiGetGroups = async ({
  ...params
}): Promise<[GroupResponseType[], total: number]> => {
  const customizedParams = { ...params }

  if (customizedParams?.sort?.length) {
    // Replace 'specialKey' with the actual key you want to format differently
    customizedParams.sort = `${camelToSnakeCase(customizedParams.sort[0].id)}:${
      customizedParams.sort[0].desc ? 'desc' : 'asc'
    }`
  }

  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('/groups', {
      params: transformObjectKeysToSnakeCase(customizedParams),

      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { groups, total } = response.data
    return [groups, total]
    return response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}

export const apiCreateGroup = async ({ ...params }: CreateGroupPayload) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axiosInstance.post('/groups', params, config)

    return response.data
  } catch (error) {
    console.error('Failed to create group:', error)
    throw error
  }
}

export const apiUpdateGroup = async (id: number, { ...params }: UpdateGroupPayload) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axiosInstance.patch(`/groups/${id}`, params, config)

    return response.data
  } catch (error) {
    console.error('Failed to update group:', error)
    throw error
  }
}

export const apiDeleteGroup = async (id: number) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      throw new Error('No access token found')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    // Make the DELETE request to /users/:id
    const response = await axiosInstance.delete(
      `/groups/${encodeURIComponent(id)}`,
      config
    )

    return response.data
  } catch (error) {
    console.error('Failed to delete group:', error)
    throw error
  }
}

export const apiGetFirmwares = async ({
  ...params
}): Promise<[FirmwareResponseType[], total: number]> => {
  const customizedParams = { ...params }

  if (customizedParams?.sort?.length) {
    // Replace 'specialKey' with the actual key you want to format differently
    customizedParams.sort = `${camelToSnakeCase(customizedParams.sort[0].id)}:${
      customizedParams.sort[0].desc ? 'desc' : 'asc'
    }`
  }

  try {
    const token = localStorage.getItem('access_token')
    const response = await axiosInstance.get('/firmwares', {
      params: transformObjectKeysToSnakeCase(customizedParams),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { firmwares, total } = response.data
    return [firmwares, total]
  } catch (error) {
    console.error('Error fetching firmwares:', error)
    throw error
  }
}

// 韌體 firmwares
export const apiDeleteFirmware = async(id: number) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.delete(`/firmwares/${id}`, config)

    return response.data
  } catch (error) {
    console.error('Error fetching firmwares:', error)
    throw error
  }
}

// things
export const apiUpdateThing = async(id: string, { ...params }: UpdateThingPayload) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.patch(`/things/${id}`, params, config)

    return response.data
  } catch (error) {
    console.error('Error update thing:', error)
    throw error
  }
}

export const apiUpdateThingsGroup = async({ ...params }: UpdateThingsGroupPayload) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.put('/things/group', params, config)

    return response.data
  } catch (error) {
    console.error('Error update things\' group:', error)
    throw error
  }
}

export const apiArchiveThing = async(id: string) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.post(`/things/${id}/archive`, {}, config)

    return response.data
  } catch (error) {
    console.error('Error arhive thing:', error)
    throw error
  }
}

export const apiDearchiveThing = async(id: string) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.post(`/things/${id}/dearchive`, {}, config)

    return response.data
  } catch (error) {
    console.error('Error dearhive thing:', error)
    throw error
  }
}

export const apiDeleteThing = async(id: string) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.delete(`/things/${id}`, config)

    return response.data
  } catch (error) {
    console.error('Error fetching firmwares:', error)
    throw error
  }
}

export const apiUpgradeFirmwares = async({ ...params }: { macAddresses: string[]}) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    throw new Error('No access token found')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axiosInstance.put('/things/firmware', params, config)

    return response.data
  } catch (error) {
    console.error('Error upgrade group:', error)
    throw error
  }
}
