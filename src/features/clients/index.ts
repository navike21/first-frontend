export {
  useClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  clientKeys,
} from './api'
export type { Client, CreateClientInput, UpdateClientInput, ClientStatus } from './model/types'
export { createClientSchema, updateClientSchema } from './model/types'
export { ClientStatusBadge } from './components/ClientStatusBadge'
