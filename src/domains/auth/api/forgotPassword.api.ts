import { authService } from '@/shared/api'
import type { ForgotPasswordRequest, ForgotPasswordResponse } from './types'

export const forgotPasswordApi = (
  body: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => authService.forgotPassword(body.email)
