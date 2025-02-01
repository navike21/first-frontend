import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionPt: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principal',
    items: [
      {
        label: 'Perfil',
        icon: EIcons.PROFILE,
        urlPath: 'perfil',
      },
      {
        label: 'Mensagens',
        icon: EIcons.MESSAGES,
        urlPath: 'mensagens',
      },
      {
        label: 'Segurança',
        icon: EIcons.SECURITY,
        urlPath: 'seguranca',
      },
      {
        label: 'Ajuda e Suporte',
        icon: EIcons.HELP,
        urlPath: 'ajuda-e-suporte',
      },
      {
        label: 'Informações do Sistema',
        icon: EIcons.INFO,
        urlPath: 'informacoes-do-sistema',
      },
    ],
  },
  logOut: {
    title: 'Sair',
    modalConfirm: {
      title: 'Sair',
      content: 'Tem certeza de que deseja sair?',
      actions: {
        cancel: 'Não, cancelar',
        confirm: 'Sim, sair',
      },
    },
  },
}
