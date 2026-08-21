import type { PaymentsTranslations } from '../types'

export const en: PaymentsTranslations = {
  page: {
    providersTitle: 'Payment providers',
    providersDescription:
      'Configure the credentials for the payment providers available to the store',
  },
  form: {
    isDefault: 'Default',
    enabled: 'Enabled',
    secretFieldHint: 'Already configured — leave blank to keep it unchanged',
    saveProvider: 'Save',
  },
  toasts: {
    providerUpdated: 'Payment provider updated',
  },
}
