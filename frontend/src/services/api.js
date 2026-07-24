import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE,
})

export const uploadAudio = async (audioBlob, filename = 'audio.webm', onProgress) => {
  const formData = new FormData()
  formData.append('audio', audioBlob, filename)

  const response = await api.post('/api/process/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
  return response.data
}

export const recordAudio = async (audioBlob) => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await api.post('/api/process/record', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getPdfDownloadUrl = (path) => {
  return `${API_BASE}${path}`
}
