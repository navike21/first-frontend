import type { ProductReviewTranslations } from '../types'

export const it: ProductReviewTranslations = {
  page: {
    listTitle: 'Recensioni prodotto',
    listDescription: 'Modera le recensioni inviate dai clienti sui tuoi prodotti',
    trashTitle: 'Cestino recensioni',
    trashDescription:
      'Recensioni spostate nel cestino. Ripristinale o eliminale definitivamente.',
    trashEmpty: 'Nessuna recensione nel cestino',
    trashEmptyDescription: 'Le recensioni eliminate appariranno qui.',
  },
  table: {
    noResults: 'Nessuna recensione trovata',
    colProduct: 'Prodotto',
    colReviewer: 'Autore',
    colRating: 'Valutazione',
    colStatus: 'Stato',
    colDate: 'Data',
    colActions: 'Azioni',
    viewReview: 'Visualizza recensione',
    approveReview: 'Approva',
    rejectReview: 'Rifiuta',
    deleteReview: 'Elimina recensione',
    restoreReview: 'Ripristina',
    purgeReview: 'Elimina definitivamente',
    prevPage: 'Precedente',
    nextPage: 'Successivo',
    totalCount: (count) => `Totale: ${count}`,
    deletedAt: 'Eliminato',
    selectAll: 'Seleziona tutto',
    selectRow: 'Seleziona riga',
  },
  filters: {
    searchLabel: 'Cerca',
    searchPlaceholder: 'Cerca per commento, titolo o nome…',
    statusLabel: 'Stato',
    statusAll: 'Tutti',
  },
  status: {
    pending: 'In attesa',
    approved: 'Approvata',
    rejected: 'Rifiutata',
  },
  actions: {
    viewTrash: 'Vedi cestino',
    cancel: 'Annulla',
    selectedCount: (count) => `${count} selezionati`,
    clearSelection: 'Deseleziona',
    bulkDelete: 'Elimina',
    bulkRestore: 'Ripristina',
    bulkPurge: 'Elimina definitivamente',
    deleteTitle: 'Elimina recensione',
    deleteDescription: (reviewer) =>
      `Vuoi davvero eliminare la recensione di ${reviewer}? Potrai ripristinarla dal cestino.`,
    confirmDelete: 'Elimina',
    bulkDeleteDescription: (count) =>
      `Eliminare ${count} recensioni? Potrai ripristinarle dal cestino.`,
    restoreTitle: 'Ripristina recensione',
    restoreDescription: (reviewer) =>
      `Ripristinare la recensione di ${reviewer} nell'elenco attivo?`,
    confirmRestore: 'Ripristina',
    bulkRestoreDescription: (count) =>
      `Ripristinare ${count} recensioni nell'elenco attivo?`,
    purgeTitle: 'Elimina definitivamente',
    purgeDescription: (reviewer) =>
      `Questo eliminerà definitivamente la recensione di ${reviewer}. Questa azione è IRREVERSIBILE.`,
    confirmPurge: 'Elimina',
    bulkPurgeDescription: (count) =>
      `Questo eliminerà definitivamente ${count} recensioni. Questa azione è IRREVERSIBILE.`,
  },
  detail: {
    title: 'Dettagli recensione',
    product: 'Prodotto',
    reviewer: 'Autore',
    email: 'Email',
    rating: 'Valutazione',
    comment: 'Commento',
    status: 'Stato',
    submittedAt: 'Inviata',
    close: 'Chiudi',
  },
  toasts: {
    approved: 'Recensione approvata',
    rejected: 'Recensione rifiutata',
    deleted: 'Recensione eliminata',
    restored: 'Recensione ripristinata',
    purged: 'Recensione eliminata definitivamente',
    bulkDeleted: 'Recensioni eliminate',
    bulkRestored: 'Recensioni ripristinate',
    bulkPurged: 'Recensioni eliminate definitivamente',
  },
}
