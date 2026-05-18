import { toast } from 'sonner'
import { HttpError } from '@/shared/api'
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

function getLang(): Language {
  return useLanguageStore.getState().language
}

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),

  queryError: (error: unknown) => {
    const lang = getLang()
    if (error instanceof HttpError) {
      if (error.status === 401) return
      const message =
        HTTP_MESSAGES[lang][error.status] ?? error.message
      toast.error(message)
    } else {
      toast.error(NETWORK_MESSAGES[lang])
    }
  },
}
