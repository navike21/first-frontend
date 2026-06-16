import clsx from 'clsx'
import {
  Avatar,
  Button,
  DataTable,
  IconButton,
  InputField,
  Spinner,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { useGroupMembersManager } from './GroupMembers.hooks'
import type { GroupMember } from '../../model/userGroup.types'

interface GroupMembersProps {
  groupId: string
}

const StatusBadge = ({
  status,
  label,
}: {
  status: 'active' | 'inactive'
  label: string
}) => (
  <span
    className={clsx(
      'rounded-full px-2 py-0.5 text-xs font-medium',
      status === 'active'
        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
    )}
  >
    {label}
  </span>
)

export const GroupMembers = ({ groupId }: GroupMembersProps) => {
  const {
    t,
    data,
    isLoading,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    hasSearchTerm,
    adding,
    handleAdd,
    handleRemove,
  } = useGroupMembersManager(groupId)

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
          <span className="font-medium text-(--text-primary)">
            {member.firstName} {member.lastName}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: t.members.colEmail,
      cellClassName: 'text-(--text-secondary)',
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
        <Tooltip
          heading={t.members.removeMember}
          icon="RiDeleteBinLine"
          position="top"
          size="small"
        >
          <IconButton
            icon="RiCloseLine"
            variant="text"
            size="small"
            aria-label={t.members.removeMember}
            onClick={() => handleRemove(member.id)}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-(--border) bg-(--surface) p-6">
      {/* Add members */}
      <div className="flex flex-col gap-2">
        <InputField
          label={t.members.searchLabel}
          placeholder={t.members.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {hasSearchTerm && (
          <div className="rounded-lg border border-(--border) bg-(--surface-subtle)">
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Spinner size="small" />
              </div>
            ) : searchResults.length === 0 ? (
              <p className="px-4 py-4 text-sm text-(--text-muted)">
                {t.members.noSearchResults}
              </p>
            ) : (
              <ul className="divide-y divide-(--border-subtle)">
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
                        <span className="text-sm font-medium text-(--text-primary)">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-(--text-secondary)">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
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

      {/* Current members */}
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
          onPageChange: setPage,
          prevLabel: t.table.prevPage,
          nextLabel: t.table.nextPage,
        }}
      />
    </div>
  )
}
