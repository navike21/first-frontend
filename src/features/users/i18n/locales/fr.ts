import type { UsersTranslations } from '../types'

export const fr: UsersTranslations = {
  page: {
    listTitle: 'Utilisateurs',
    listDescription: 'Gérer les utilisateurs du système',
    createTitle: 'Nouvel utilisateur',
    createDescription: "Remplissez les champs pour enregistrer un nouvel utilisateur",
    editTitle: "Modifier l'utilisateur",
    editDescription: (name) => `Modifier les données de ${name}`,
  },
  table: {
    noResults: 'Aucun utilisateur trouvé',
    colUser: 'Utilisateur', colEmail: 'E-mail', colStatus: 'Statut',
    colPresence: 'Présence', colActions: 'Actions',
    editUser: "Modifier l'utilisateur", deleteUser: "Supprimer l'utilisateur",
    prevPage: 'Page précédente', nextPage: 'Page suivante',
    totalCount: (n) => `${n} utilisateur${n !== 1 ? 's' : ''} au total`,
  },
  status: { active: 'Actif', inactive: 'Inactif', deleted: 'Supprimé' },
  presence: { available: 'Disponible', busy: 'Occupé', away: 'Absent', offline: 'Hors ligne' },
  form: {
    firstName: 'Prénom', firstNamePlaceholder: 'Jean',
    lastName: 'Nom', lastNamePlaceholder: 'Dupont',
    email: 'E-mail', emailPlaceholder: 'utilisateur@navike21.com',
    password: 'Mot de passe', passwordPlaceholder: '8 caractères minimum',
    phone: 'Téléphone', phonePlaceholder: '+33 6 00 00 00 00',
    gender: 'Genre', genderPlaceholder: 'Sélectionner',
    genderFemale: 'Féminin', genderMale: 'Masculin',
    genderOther: 'Autre', genderPreferNotToSay: 'Je préfère ne pas répondre',
    statusLabel: 'Statut', statusActive: 'Actif', statusInactive: 'Inactif',
    createButton: "Créer l'utilisateur", saveButton: 'Enregistrer', cancelButton: 'Annuler',
  },
  actions: {
    newUser: 'Nouvel utilisateur',
    deactivateTitle: "Désactiver l'utilisateur",
    deactivateDescription: (first, last) =>
      `Confirmer la désactivation de ${first} ${last} ? L'utilisateur perdra l'accès au système.`,
    confirmDeactivate: 'Désactiver',
    cancel: 'Annuler',
  },
  filters: {
    searchLabel: 'Rechercher', searchPlaceholder: 'Nom, prénom ou e-mail…',
    statusLabel: 'Statut', statusAll: 'Tous les statuts',
    statusActive: 'Actifs', statusInactive: 'Inactifs',
  },
  toasts: {
    created: 'Utilisateur créé avec succès',
    updated: 'Utilisateur mis à jour avec succès',
    deactivated: 'Utilisateur désactivé avec succès',
  },
}
