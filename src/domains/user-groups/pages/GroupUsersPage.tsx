import {
  PageContent,
  InputField,
  Button,
  ButtonGroup,
  Avatar,
  Chip,
  Spinner,
  DataTable,
  IconButton,
  Tooltip,
  Modal,
  FadeCollapse,
  type DataTableColumn,
} from '@/shared/ui'
import { useGroupUsersPage } from './GroupUsersPage.hooks'
import type { GroupMember } from '../model/userGroup.types'

const StatusBadge = ({
  status,
  label,
}: {
  status: 'active' | 'inactive'
  label: string
}) => {
  const variant = status === 'active' ? 'success' : 'default'
  return (
    <Chip size="small" variant={variant}>
      {label}
    </Chip>
  )
}
export const GroupUsersPage = () => {
  const {
    t,
    group,
    data,
    isLoading,
    page,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    hasSearchTerm,
    adding,
    selectedIds,
    setSelectedIds,
    removingUser,
    setRemovingUser,
    bulkRemoveOpen,
    setBulkRemoveOpen,
    removeMember,
    removeBulk,
    handleAdd,
    handleConfirmRemove,
    handleConfirmBulkRemove,
    handlePageChange,
    goBack,
  } = useGroupUsersPage()

  const columns: DataTableColumn<GroupMember>[] = [
    {
      id: 'member',
      header: t.members.colMember,
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={`${member.firstName} ${member.lastName}`}
            src={member.profilePictureUrl}
            name={`${member.firstName} ${member.lastName}`}
            size="sm"
          />
          <span className="text-foreground font-medium">
            {member.firstName} {member.lastName}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: t.members.colEmail,
      cellClassName: 'text-secondary',
      cell: (member) => member.email,
    },
    {
      id: 'status',
      header: t.members.colStatus,
      cell: (member) => (
        <StatusBadge status={member.status} label={t.status[member.status]} />
      ),
    },
    {
      id: 'actions',
      header: t.members.colActions,
      align: 'right',
      cell: (member) => (
        <Tooltip heading={t.members.removeMember} position="top" size="small">
          <IconButton
            icon="RiCloseLine"
            variant="text"
            size="small"
            aria-label={t.members.removeMember}
            onClick={() => setRemovingUser(member)}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <PageContent
      title={t.page.usersTitle(group?.name ?? '')}
      description={t.page.usersDescription}
      actions={[
        {
          type: 'button',
          label: t.members.backLabel,
          variant: 'secondary',
          onClick: goBack,
          size: 'small',
        },
      ]}
    >
      {/* Add members */}
      <div className="border-border bg-surface flex flex-col gap-2 rounded-xl border p-4">
        <InputField
          label={t.members.searchLabel}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {hasSearchTerm && (
          <div className="border-border bg-surface-subtle rounded-lg border">
            {isSearching && (
              <div className="flex items-center justify-center py-6">
                <Spinner size="small" />
              </div>
            )}
            {!isSearching && searchResults.length === 0 && (
              <p className="text-muted px-4 py-4 text-sm">
                {t.members.noSearchResults}
              </p>
            )}
            {!isSearching && searchResults.length > 0 && (
              <ul className="divide-border-subtle divide-y">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-3 px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        alt={`${user.firstName} ${user.lastName}`}
                        src={user.profilePictureUrl}
                        name={`${user.firstName} ${user.lastName}`}
                        size="sm"
                      />
                      <div className="flex flex-col">
                        <span className="text-foreground text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-secondary text-xs">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      type="button"
                      disabled={adding}
                      onClick={() => handleAdd(user.id)}
                    >
                      {t.members.addAction}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Bulk toolbar */}
      <div>
        <FadeCollapse show={selectedIds.length > 0}>
          <div className="border-border bg-surface-subtle mb-6 flex items-center justify-between gap-3 rounded-lg border px-4 py-2">
            <span className="text-foreground text-sm font-medium">
              {t.members.selectedCount(selectedIds.length)}
            </span>
            <ButtonGroup>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setSelectedIds([])}
              >
                {t.members.clearSelection}
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => setBulkRemoveOpen(true)}
              >
                {t.members.bulkRemove}
              </Button>
            </ButtonGroup>
          </div>
        </FadeCollapse>

        {/* Members table */}
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          getRowKey={(member) => member.id}
          isLoading={isLoading}
          emptyIcon="RiGroupLine"
          emptyLabel={t.members.empty}
          totalLabel={t.members.totalCount(data?.total ?? 0)}
          pagination={{
            page,
            pages: data?.pages ?? 1,
            onPageChange: handlePageChange,
            prevLabel: t.table.prevPage,
            nextLabel: t.table.nextPage,
          }}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          selectAllLabel={t.table.selectAll}
          selectRowLabel={t.table.selectRow}
        />
      </div>

      {/* Single remove confirmation */}
      <Modal
        isOpen={!!removingUser}
        onClose={() => setRemovingUser(null)}
        size="sm"
        title={t.members.removeTitle}
        description={t.members.removeDescription(1)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRemovingUser(null)}
              disabled={removeMember.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={removeMember.isPending}
              onClick={handleConfirmRemove}
            >
              {t.members.confirmRemove}
            </Button>
          </>
        }
      />

      {/* Bulk remove confirmation */}
      <Modal
        isOpen={bulkRemoveOpen}
        onClose={() => setBulkRemoveOpen(false)}
        size="sm"
        title={t.members.removeTitle}
        description={t.members.removeDescription(selectedIds.length)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setBulkRemoveOpen(false)}
              disabled={removeBulk.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={removeBulk.isPending}
              onClick={handleConfirmBulkRemove}
            >
              {t.members.confirmRemove}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
