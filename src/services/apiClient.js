import api from "../config/axios"

export const postRequest = async (url, data) => {
  try {
    return await api.post(url, data)
  } catch {
    return false
  }
}

export const getRequest = async (url, params) => {
  try {
    return await api.get(url, { params })
  } catch {
    return false
  }
}
