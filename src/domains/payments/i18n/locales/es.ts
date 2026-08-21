import type { PaymentsTranslations } from '../types'

export const es: PaymentsTranslations = {
  page: {
    providersTitle: 'Proveedores de pago',
    providersDescription:
      'Configura las credenciales de los proveedores de pago disponibles para la tienda',
  },
  form: {
    isDefault: 'Predeterminado',
    enabled: 'Habilitado',
    secretFieldHint: 'Ya configurado — deja en blanco para no cambiarlo',
    saveProvider: 'Guardar',
  },
  toasts: {
    providerUpdated: 'Proveedor de pago actualizado',
  },
}
