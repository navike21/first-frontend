import { EStatusType } from '@Enums/statusType'

export const getStatusType = (status: number): EStatusType => {
  if (status >= 200 && status < 300) {
    return EStatusType.SUCCESS
  }

  if (status >= 300 && status < 400) {
    return EStatusType.INFO
  }

  if (status >= 400 && status < 500) {
    return EStatusType.WARNING
  }

  if (status >= 500 && status < 600) {
    return EStatusType.ERROR
  }
  return EStatusType.ERROR
}
