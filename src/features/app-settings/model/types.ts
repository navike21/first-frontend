import { z } from 'zod'

export const updateAppSettingsSchema = z.object({
  siteName: z.string().min(2).optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().optional(),
  defaultLanguage: z.string().optional(),
  allowedFileTypes: z.array(z.string()).optional(),
  maxFileSizeMb: z.number().positive().optional(),
})

export type UpdateAppSettingsInput = z.infer<typeof updateAppSettingsSchema>

export interface AppSettings {
  id: string
  siteName: string
  siteDescription?: string
  contactEmail?: string
  maintenanceMode: boolean
  defaultLanguage: string
  allowedFileTypes: string[]
  maxFileSizeMb: number
  updatedAt: string
}
