export { ClientsPage } from './pages/ClientsPage'
export { CreateClientPage } from './pages/CreateClientPage'
export { EditClientPage } from './pages/EditClientPage'
export { ClientsTrashPage } from './pages/ClientsTrashPage'
export { ClientTable } from './components/ClientTable/ClientTable'
export {
  useClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useSoftDeleteClient,
  useClientsTrash,
  useRestoreClient,
  usePurgeClient,
  useBulkSoftDeleteClients,
  useBulkRestoreClients,
  useBulkPurgeClients,
  clientKeys,
} from './api/clients.queries'
export type {
  Client,
  ClientStatus,
  ClientType,
  DocumentType,
  ClientListParams,
} from './model/client.types'
export type {
  CreateClientFormData,
  UpdateClientFormData,
} from './model/client.schema'
