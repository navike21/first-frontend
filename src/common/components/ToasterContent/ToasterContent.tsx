import { Toaster, ToasterProps } from 'sonner'

export const ToasterContent = ({
  richColors = true,
  position = 'top-center',
  ...props
}: ToasterProps) => (
  <Toaster richColors={richColors} position={position} {...props} />
)
