import { toast } from 'sonner'
import { HttpError, OfflineQueuedError } from '@/shared/api'
import { useLanguageStore } from '@/shared/model/language.store'
import type { Language } from '@/shared/types/languages'

type HttpMessages = Partial<Record<number, string>>

const HTTP_MESSAGES: Record<Language, HttpMessages> = {
  es: {
    400: 'Solicitud incorrecta.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'El recurso solicitado no existe.',
    409: 'Conflicto con el estado actual del recurso.',
    422: 'Los datos enviados no son válidos.',
    429: 'Demasiadas solicitudes. Espera un momento.',
    500: 'Error interno del servidor.',
    502: 'El servidor no está disponible en este momento.',
    503: 'Servicio temporalmente no disponible.',
  },
  en: {
    400: 'Bad request.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource does not exist.',
    409: 'Conflict with the current state of the resource.',
    422: 'The submitted data is not valid.',
    429: 'Too many requests. Please wait a moment.',
    500: 'Internal server error.',
    502: 'The server is currently unavailable.',
    503: 'Service temporarily unavailable.',
  },
  de: {
    400: 'Ungültige Anfrage.',
    403: 'Sie haben keine Berechtigung für diese Aktion.',
    404: 'Die angeforderte Ressource existiert nicht.',
    409: 'Konflikt mit dem aktuellen Zustand der Ressource.',
    422: 'Die übermittelten Daten sind ungültig.',
    429: 'Zu viele Anfragen. Bitte warten Sie einen Moment.',
    500: 'Interner Serverfehler.',
    502: 'Der Server ist derzeit nicht verfügbar.',
    503: 'Dienst vorübergehend nicht verfügbar.',
  },
  fr: {
    400: 'Requête incorrecte.',
    403: "Vous n'avez pas la permission d'effectuer cette action.",
    404: "La ressource demandée n'existe pas.",
    409: "Conflit avec l'état actuel de la ressource.",
    422: 'Les données soumises ne sont pas valides.',
    429: 'Trop de requêtes. Veuillez patienter.',
    500: 'Erreur interne du serveur.',
    502: "Le serveur n'est pas disponible pour le moment.",
    503: 'Service temporairement indisponible.',
  },
  pt: {
    400: 'Pedido incorreto.',
    403: 'Não tem permissão para realizar esta ação.',
    404: 'O recurso solicitado não existe.',
    409: 'Conflito com o estado atual do recurso.',
    422: 'Os dados enviados não são válidos.',
    429: 'Demasiados pedidos. Aguarde um momento.',
    500: 'Erro interno do servidor.',
    502: 'O servidor não está disponível de momento.',
    503: 'Serviço temporariamente indisponível.',
  },
  it: {
    400: 'Richiesta errata.',
    403: 'Non hai i permessi per eseguire questa azione.',
    404: 'La risorsa richiesta non esiste.',
    409: 'Conflitto con lo stato attuale della risorsa.',
    422: 'I dati inviati non sono validi.',
    429: 'Troppe richieste. Attendi un momento.',
    500: 'Errore interno del server.',
    502: 'Il server non è disponibile al momento.',
    503: 'Servizio temporaneamente non disponibile.',
  },
  ja: {
    400: 'リクエストが正しくありません。',
    403: 'この操作を行う権限がありません。',
    404: '要求されたリソースが存在しません。',
    409: 'リソースの現在の状態と競合しています。',
    422: '送信されたデータが無効です。',
    429: 'リクエストが多すぎます。しばらくお待ちください。',
    500: 'サーバー内部エラー。',
    502: 'サーバーは現在利用できません。',
    503: 'サービスは一時的に利用できません。',
  },
  ko: {
    400: '잘못된 요청입니다.',
    403: '이 작업을 수행할 권한이 없습니다.',
    404: '요청한 리소스가 존재하지 않습니다.',
    409: '리소스의 현재 상태와 충돌합니다.',
    422: '제출된 데이터가 유효하지 않습니다.',
    429: '요청이 너무 많습니다. 잠시 기다려 주세요.',
    500: '서버 내부 오류.',
    502: '서버를 현재 사용할 수 없습니다.',
    503: '서비스를 일시적으로 사용할 수 없습니다.',
  },
  zh: {
    400: '请求错误。',
    403: '您没有执行此操作的权限。',
    404: '请求的资源不存在。',
    409: '与资源当前状态冲突。',
    422: '提交的数据无效。',
    429: '请求过多，请稍候。',
    500: '服务器内部错误。',
    502: '服务器暂时不可用。',
    503: '服务暂时不可用。',
  },
  ru: {
    400: 'Неверный запрос.',
    403: 'У вас нет прав для выполнения этого действия.',
    404: 'Запрашиваемый ресурс не существует.',
    409: 'Конфликт с текущим состоянием ресурса.',
    422: 'Отправленные данные недействительны.',
    429: 'Слишком много запросов. Подождите немного.',
    500: 'Внутренняя ошибка сервера.',
    502: 'Сервер в данный момент недоступен.',
    503: 'Сервис временно недоступен.',
  },
}

const NETWORK_MESSAGES: Record<Language, string> = {
  es: 'Error de red. Verifica tu conexión e intenta nuevamente.',
  en: 'Network error. Check your connection and try again.',
  de: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  fr: 'Erreur réseau. Vérifiez votre connexion et réessayez.',
  pt: 'Erro de rede. Verifique a sua ligação e tente novamente.',
  it: 'Errore di rete. Controlla la connessione e riprova.',
  ja: 'ネットワークエラー。接続を確認して再試行してください。',
  ko: '네트워크 오류. 연결을 확인하고 다시 시도하세요.',
  zh: '网络错误，请检查连接后重试。',
  ru: 'Ошибка сети. Проверьте подключение и повторите попытку.',
}

interface OfflineMessages {
  /** Persistent warning shown the moment the connection drops. */
  connectionLost: string
  /** Shown when a mutation is queued because there is no connection. */
  queued: string
  /** All queued changes replayed successfully. */
  syncOk: (synced: number) => string
  /** Some changes synced, others were rejected and dropped. */
  syncPartial: (synced: number, failed: number) => string
}

const OFFLINE_MESSAGES: Record<Language, OfflineMessages> = {
  es: {
    connectionLost: 'Sin conexión — los cambios se guardarán automáticamente.',
    queued: 'Guardado sin conexión. Se sincronizará al reconectar.',
    syncOk: (n) => `Conexión restaurada — ${n} cambio(s) sincronizado(s).`,
    syncPartial: (s, f) => `${s} sincronizado(s), ${f} no se pudieron sincronizar.`,
  },
  en: {
    connectionLost: 'No connection — your changes will be saved automatically.',
    queued: 'Saved offline. It will sync when you reconnect.',
    syncOk: (n) => `Connection restored — ${n} change(s) synced.`,
    syncPartial: (s, f) => `${s} synced, ${f} could not be synced.`,
  },
  de: {
    connectionLost: 'Keine Verbindung — Ihre Änderungen werden automatisch gespeichert.',
    queued: 'Offline gespeichert. Wird bei erneuter Verbindung synchronisiert.',
    syncOk: (n) => `Verbindung wiederhergestellt — ${n} Änderung(en) synchronisiert.`,
    syncPartial: (s, f) => `${s} synchronisiert, ${f} konnten nicht synchronisiert werden.`,
  },
  fr: {
    connectionLost: 'Pas de connexion — vos modifications seront enregistrées automatiquement.',
    queued: 'Enregistré hors ligne. La synchronisation se fera à la reconnexion.',
    syncOk: (n) => `Connexion rétablie — ${n} modification(s) synchronisée(s).`,
    syncPartial: (s, f) => `${s} synchronisée(s), ${f} n'ont pas pu être synchronisées.`,
  },
  pt: {
    connectionLost: 'Sem ligação — as suas alterações serão guardadas automaticamente.',
    queued: 'Guardado sem ligação. Será sincronizado ao reconectar.',
    syncOk: (n) => `Ligação restaurada — ${n} alteração(ões) sincronizada(s).`,
    syncPartial: (s, f) => `${s} sincronizada(s), ${f} não puderam ser sincronizadas.`,
  },
  it: {
    connectionLost: 'Nessuna connessione — le modifiche verranno salvate automaticamente.',
    queued: 'Salvato offline. Verrà sincronizzato alla riconnessione.',
    syncOk: (n) => `Connessione ripristinata — ${n} modifica(che) sincronizzata(e).`,
    syncPartial: (s, f) => `${s} sincronizzate, ${f} non è stato possibile sincronizzarle.`,
  },
  ja: {
    connectionLost: '接続がありません — 変更は自動的に保存されます。',
    queued: 'オフラインで保存しました。再接続時に同期されます。',
    syncOk: (n) => `接続が回復しました — ${n}件の変更を同期しました。`,
    syncPartial: (s, f) => `${s}件を同期、${f}件は同期できませんでした。`,
  },
  ko: {
    connectionLost: '연결 없음 — 변경사항이 자동으로 저장됩니다.',
    queued: '오프라인으로 저장되었습니다. 다시 연결되면 동기화됩니다.',
    syncOk: (n) => `연결이 복구되었습니다 — ${n}개의 변경사항을 동기화했습니다.`,
    syncPartial: (s, f) => `${s}개 동기화됨, ${f}개는 동기화할 수 없습니다.`,
  },
  zh: {
    connectionLost: '无连接 — 您的更改将自动保存。',
    queued: '已离线保存，重新连接后将同步。',
    syncOk: (n) => `连接已恢复 — 已同步 ${n} 项更改。`,
    syncPartial: (s, f) => `已同步 ${s} 项，${f} 项无法同步。`,
  },
  ru: {
    connectionLost: 'Нет соединения — ваши изменения будут сохранены автоматически.',
    queued: 'Сохранено офлайн. Синхронизируется при восстановлении связи.',
    syncOk: (n) => `Соединение восстановлено — синхронизировано изменений: ${n}.`,
    syncPartial: (s, f) => `Синхронизировано: ${s}, не удалось синхронизировать: ${f}.`,
  },
}

function getLang(): Language {
  return useLanguageStore.getState().language
}

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),

  queryError: (error: unknown) => {
    // A queued offline mutation is not a failure — the global MutationCache
    // already shows the "saved offline" toast, so don't paint a red error.
    if (error instanceof OfflineQueuedError) return
    const lang = getLang()
    if (error instanceof HttpError) {
      if (error.status === 401) return
      const message = HTTP_MESSAGES[lang][error.status] ?? error.message
      toast.error(message)
    } else {
      toast.error(NETWORK_MESSAGES[lang])
    }
  },

  /** Persistent warning when the connection drops. */
  connectionLost: () => toast.warning(OFFLINE_MESSAGES[getLang()].connectionLost),

  /** Info toast shown when a mutation is saved to the offline queue. */
  offlineQueued: () => toast.info(OFFLINE_MESSAGES[getLang()].queued),

  /**
   * Summary toast after replaying the offline queue. Success when everything
   * synced, warning when some items were rejected. No-ops when nothing ran.
   */
  syncResult: (synced: number, failed: number) => {
    if (synced === 0 && failed === 0) return
    const msg = OFFLINE_MESSAGES[getLang()]
    if (failed === 0) toast.success(msg.syncOk(synced))
    else toast.warning(msg.syncPartial(synced, failed))
  },
}
