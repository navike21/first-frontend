import { authService } from '@/shared/api'
import type { ResetPasswordRequest, ResetPasswordResponse } from './types'

export const resetPasswordApi = (
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> =>
  authService.resetPassword(body.token, body.password)
