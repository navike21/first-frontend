import type { ProductReviewTranslations } from '../types'

export const de: ProductReviewTranslations = {
  page: {
    listTitle: 'Produktbewertungen',
    listDescription: 'Moderiere Kundenbewertungen zu deinen Produkten',
    trashTitle: 'Papierkorb der Bewertungen',
    trashDescription:
      'In den Papierkorb verschobene Bewertungen. Wiederherstellen oder endgültig löschen.',
    trashEmpty: 'Keine Bewertungen im Papierkorb',
    trashEmptyDescription: 'Gelöschte Bewertungen erscheinen hier.',
  },
  table: {
    noResults: 'Keine Bewertungen gefunden',
    colProduct: 'Produkt',
    colReviewer: 'Verfasser',
    colRating: 'Bewertung',
    colStatus: 'Status',
    colDate: 'Datum',
    colActions: 'Aktionen',
    viewReview: 'Bewertung ansehen',
    approveReview: 'Genehmigen',
    rejectReview: 'Ablehnen',
    deleteReview: 'Bewertung löschen',
    restoreReview: 'Wiederherstellen',
    purgeReview: 'Endgültig löschen',
    prevPage: 'Zurück',
    nextPage: 'Weiter',
    totalCount: (count) => `Gesamt: ${count}`,
    deletedAt: 'Gelöscht',
    selectAll: 'Alle auswählen',
    selectRow: 'Zeile auswählen',
  },
  filters: {
    searchLabel: 'Suchen',
    searchPlaceholder: 'Nach Kommentar, Titel oder Namen suchen…',
    statusLabel: 'Status',
    statusAll: 'Alle',
  },
  status: {
    pending: 'Ausstehend',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
  },
  actions: {
    viewTrash: 'Papierkorb ansehen',
    cancel: 'Abbrechen',
    selectedCount: (count) => `${count} ausgewählt`,
    clearSelection: 'Auswahl aufheben',
    bulkDelete: 'Löschen',
    bulkRestore: 'Wiederherstellen',
    bulkPurge: 'Endgültig löschen',
    deleteTitle: 'Bewertung löschen',
    deleteDescription: (reviewer) =>
      `Möchtest du die Bewertung von ${reviewer} wirklich löschen? Du kannst sie aus dem Papierkorb wiederherstellen.`,
    confirmDelete: 'Löschen',
    bulkDeleteDescription: (count) =>
      `${count} Bewertungen löschen? Du kannst sie aus dem Papierkorb wiederherstellen.`,
    restoreTitle: 'Bewertung wiederherstellen',
    restoreDescription: (reviewer) =>
      `Die Bewertung von ${reviewer} in die aktive Liste zurückholen?`,
    confirmRestore: 'Wiederherstellen',
    bulkRestoreDescription: (count) =>
      `${count} Bewertungen in die aktive Liste zurückholen?`,
    purgeTitle: 'Endgültig löschen',
    purgeDescription: (reviewer) =>
      `Dies löscht die Bewertung von ${reviewer} endgültig. Diese Aktion ist UNWIDERRUFLICH.`,
    confirmPurge: 'Löschen',
    bulkPurgeDescription: (count) =>
      `Dies löscht ${count} Bewertungen endgültig. Diese Aktion ist UNWIDERRUFLICH.`,
  },
  detail: {
    title: 'Bewertungsdetails',
    product: 'Produkt',
    reviewer: 'Verfasser',
    email: 'E-Mail',
    rating: 'Bewertung',
    comment: 'Kommentar',
    status: 'Status',
    submittedAt: 'Eingereicht',
    close: 'Schließen',
  },
  toasts: {
    approved: 'Bewertung genehmigt',
    rejected: 'Bewertung abgelehnt',
    deleted: 'Bewertung gelöscht',
    restored: 'Bewertung wiederhergestellt',
    purged: 'Bewertung endgültig gelöscht',
    bulkDeleted: 'Bewertungen gelöscht',
    bulkRestored: 'Bewertungen wiederhergestellt',
    bulkPurged: 'Bewertungen endgültig gelöscht',
  },
}
