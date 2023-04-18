import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

export const handleRequestFulfilled = (config: InternalAxiosRequestConfig) => {
  return config
}

export const handleRequestRejected = (error: AxiosError) => {
  return Promise.reject(error)
}

export const handleResponseFulfilled = (success: AxiosResponse) => {
  return success
}

export const handleResponseRejected = (error: AxiosError) => {
  return Promise.reject(error)
}
