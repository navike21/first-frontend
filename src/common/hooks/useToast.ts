import { EStatusType } from '@Enums/statusType'
import { ExternalToast, toast } from 'sonner'

type TOpenToastProps = {
  title?: string
  message?: string
  type: EStatusType
  toastProps?: ExternalToast
}

/**
 * Custom hook to display toast notifications using the Sonner library.
 * @returns {Object} An object containing the `openToast` function.
 *
 * @property {string} title The title of the toast.
 * @property {string} message The message of the toast.
 * @property {EStatusType} type The type of the toast.
 * @property {ExternalToast} toastProps The toast properties.
 * @see {@link https://sonner.emilkowal.ski/toast#api-reference} for more information on the `toastProps` type.
 *
 * @example
 * // Import
 * import { useToast } from '@Hooks/useToast';
 * import { EStatusType } from '@Enums/statusType';
 *
 * // Use the hook in a component
 * const { openToast } = useToast();
 *
 * // Display a default toast
 * openToast({
 *   title: 'Default Toast',
 *   type: EStatusType.DEFAULT,
 *   message: 'This is a default toast message',
 *   toastProps: { duration: 3000 }
 * });
 *
 * // Display a success toast
 * openToast({
 *   title: 'Success Toast',
 *   type: EStatusType.SUCCESS,
 *   message: 'This is a success toast message',
 *   toastProps: { duration: 3000 }
 * });
 *
 * // Display an error toast
 * openToast({
 *   title: 'Error Toast',
 *   type: EStatusType.ERROR,
 *   message: 'This is an error toast message',
 *   toastProps: { duration: 3000 }
 * });
 *
 * // Display an info toast
 * openToast({
 *   title: 'Info Toast',
 *   type: EStatusType.INFO,
 *   message: 'This is an info toast message',
 *   toastProps: { duration: 3000 }
 * });
 *
 * // Display a warning toast
 * openToast({
 *   title: 'Warning Toast',
 *   type: EStatusType.WARNING,
 *   message: 'This is a warning toast message',
 *   toastProps: { duration: 3000 }
 * });
 *
 *
 */

const openToast = ({ title, type, message, toastProps }: TOpenToastProps) => {
  if (type === EStatusType.DEFAULT) {
    toast(title, {
      description: message,
      ...toastProps,
    })
  }

  if (type === EStatusType.SUCCESS) {
    toast.success(title, {
      description: message,
      ...toastProps,
    })
  }

  if (type === EStatusType.ERROR) {
    toast.error(title, {
      description: message,
      ...toastProps,
    })
  }

  if (type === EStatusType.INFO) {
    toast.info(title, {
      description: message,
      ...toastProps,
    })
  }

  if (type === EStatusType.WARNING) {
    toast.warning(title, {
      description: message,
      ...toastProps,
    })
  }
}

export const useToast = () => ({
  openToast,
})
