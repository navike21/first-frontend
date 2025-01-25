import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionPt: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principal',
    items: [
      {
        label: 'Perfil',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Mensagens',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Segurança',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Ajuda e Suporte',
        icon: EIcons.HELP,
      },
      {
        label: 'Informações do Sistema',
        icon: EIcons.INFO,
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
