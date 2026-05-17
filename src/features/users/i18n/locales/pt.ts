import type { UsersTranslations } from '../types'

export const pt: UsersTranslations = {
  page: {
    listTitle: 'Usuários',
    listDescription: 'Gerencie os usuários do sistema',
    createTitle: 'Novo usuário',
    createDescription: 'Preencha os campos para registrar um novo usuário no sistema',
    editTitle: 'Editar usuário',
    editDescription: (name) => `Modifique os dados de ${name}`,
  },
  table: {
    noResults: 'Nenhum usuário encontrado',
    colUser: 'Usuário', colEmail: 'Email', colStatus: 'Status',
    colPresence: 'Presença', colActions: 'Ações',
    editUser: 'Editar usuário', deleteUser: 'Excluir usuário',
    prevPage: 'Página anterior', nextPage: 'Próxima página',
    totalCount: (n) => `${n} usuário${n !== 1 ? 's' : ''} no total`,
  },
  status: { active: 'Ativo', inactive: 'Inativo', deleted: 'Excluído' },
  presence: { available: 'Disponível', busy: 'Ocupado', away: 'Ausente', offline: 'Offline' },
  form: {
    firstName: 'Nome', firstNamePlaceholder: 'João',
    lastName: 'Sobrenome', lastNamePlaceholder: 'Silva',
    email: 'Email', emailPlaceholder: 'usuario@navike21.com',
    password: 'Senha', passwordPlaceholder: 'Mínimo 8 caracteres',
    phone: 'Telefone', phonePlaceholder: '+55 99 99999-9999',
    gender: 'Gênero', genderPlaceholder: 'Selecionar',
    genderFemale: 'Feminino', genderMale: 'Masculino',
    genderOther: 'Outro', genderPreferNotToSay: 'Prefiro não informar',
    statusLabel: 'Status', statusActive: 'Ativo', statusInactive: 'Inativo',
    createButton: 'Criar usuário', saveButton: 'Salvar alterações', cancelButton: 'Cancelar',
  },
  actions: {
    newUser: 'Novo usuário',
    deactivateTitle: 'Desativar usuário',
    deactivateDescription: (first, last) =>
      `Confirma a desativação de ${first} ${last}? O usuário perderá o acesso ao sistema.`,
    confirmDeactivate: 'Desativar',
    cancel: 'Cancelar',
  },
  filters: {
    searchLabel: 'Buscar', searchPlaceholder: 'Nome, sobrenome ou email…',
    statusLabel: 'Status', statusAll: 'Todos os status',
    statusActive: 'Ativos', statusInactive: 'Inativos',
  },
  toasts: {
    created: 'Usuário criado com sucesso',
    updated: 'Usuário atualizado com sucesso',
    deactivated: 'Usuário desativado com sucesso',
  },
  validation: {
    emailInvalid: 'Email inválido',
    passwordMin: 'Mínimo 8 caracteres',
    passwordUppercase: 'Deve conter pelo menos uma letra maiúscula',
    passwordNumber: 'Deve conter pelo menos um número',
    fieldMin2: 'Mínimo 2 caracteres',
    dateFormat: 'Formato AAAA-MM-DD',
    urlInvalid: 'URL inválido',
  },
}
