import { format } from 'date-fns'
import { useSessionStore } from '@/shared/model'
import { useDashboardTranslation } from '../i18n'
import { KPI_CARDS, RECENT_ACTIVITY } from '../lib/dashboard.constants'

export const DashboardPage = () => {
  const { firstName = '' } = useSessionStore((state) => state.user) ?? {}
  const { t } = useDashboardTranslation()

  const today = format(new Date(), t.dateFormat, { locale: t.dateLocale })

  return (
    <div className="w-full space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-(--text-primary)">
          {t.welcome(firstName)}
        </h1>
        <p className="mt-1 text-sm text-(--text-muted)">{today}</p>
      </header>

      <section aria-labelledby="kpi-heading">
        <h2
          id="kpi-heading"
          className="mb-4 text-sm font-semibold tracking-widest text-(--text-muted) uppercase"
        >
          {t.summary}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.key}
              className="flex items-center gap-4 rounded-xl border border-(--border-subtle) bg-(--surface) p-5 shadow-sm"
            >
              <div>
                <p className="text-2xl font-bold text-(--text-primary)">{kpi.value}</p>
                <p className="text-xs text-(--text-secondary)">{t.kpi[kpi.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="mb-4 text-sm font-semibold tracking-widest text-(--text-muted) uppercase"
        >
          {t.recentActivity}
        </h2>
        {RECENT_ACTIVITY.length === 0 ? (
          <p className="text-sm text-(--text-muted)">{t.noRecentActivity}</p>
        ) : (
          <ul className="space-y-2">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.timestamp} className="text-sm text-(--text-secondary)">
                <span className="mr-2 text-(--text-muted)">{item.timestamp}</span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
