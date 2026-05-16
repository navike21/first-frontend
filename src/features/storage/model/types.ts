export interface StorageFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  folder?: string
  createdAt: string
  updatedAt: string
}

export interface UploadResult {
  files: StorageFile[]
}
