import { Toaster, ToasterProps } from 'sonner'

export const ToasterContent = ({
  richColors,
  position = 'top-center',
  className,
  ...props
}: ToasterProps) => (
  <Toaster
    key={'toast'}
    richColors={richColors}
    position={position}
    className={className}
    {...props}
  />
)
