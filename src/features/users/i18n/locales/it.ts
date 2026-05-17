import type { UsersTranslations } from '../types'

export const it: UsersTranslations = {
  page: {
    listTitle: 'Utenti',
    listDescription: 'Gestisci gli utenti del sistema',
    createTitle: 'Nuovo utente',
    createDescription: 'Compila i campi per registrare un nuovo utente nel sistema',
    editTitle: 'Modifica utente',
    editDescription: (name) => `Modifica i dati di ${name}`,
  },
  table: {
    noResults: 'Nessun utente trovato',
    colUser: 'Utente', colEmail: 'Email', colStatus: 'Stato',
    colPresence: 'Presenza', colActions: 'Azioni',
    editUser: 'Modifica utente', deleteUser: 'Elimina utente',
    prevPage: 'Pagina precedente', nextPage: 'Pagina successiva',
    totalCount: (n) => `${n} utent${n !== 1 ? 'i' : 'e'} in totale`,
  },
  status: { active: 'Attivo', inactive: 'Inattivo', deleted: 'Eliminato' },
  presence: { available: 'Disponibile', busy: 'Occupato', away: 'Assente', offline: 'Offline' },
  form: {
    firstName: 'Nome', firstNamePlaceholder: 'Mario',
    lastName: 'Cognome', lastNamePlaceholder: 'Rossi',
    email: 'Email', emailPlaceholder: 'utente@navike21.com',
    password: 'Password', passwordPlaceholder: 'Minimo 8 caratteri',
    phone: 'Telefono', phonePlaceholder: '+39 999 999 9999',
    gender: 'Genere', genderPlaceholder: 'Seleziona',
    genderFemale: 'Femminile', genderMale: 'Maschile',
    genderOther: 'Altro', genderPreferNotToSay: 'Preferisco non rispondere',
    statusLabel: 'Stato', statusActive: 'Attivo', statusInactive: 'Inattivo',
    createButton: 'Crea utente', saveButton: 'Salva modifiche', cancelButton: 'Annulla',
  },
  actions: {
    newUser: 'Nuovo utente',
    deactivateTitle: 'Disattiva utente',
    deactivateDescription: (first, last) =>
      `Confermi la disattivazione di ${first} ${last}? L'utente perderà l'accesso al sistema.`,
    confirmDeactivate: 'Disattiva',
    cancel: 'Annulla',
  },
  filters: {
    searchLabel: 'Cerca', searchPlaceholder: 'Nome, cognome o email…',
    statusLabel: 'Stato', statusAll: 'Tutti gli stati',
    statusActive: 'Attivi', statusInactive: 'Inattivi',
  },
  toasts: {
    created: 'Utente creato con successo',
    updated: 'Utente aggiornato con successo',
    deactivated: 'Utente disattivato con successo',
  },
}
