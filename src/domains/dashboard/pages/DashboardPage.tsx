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
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
          {t.welcome(firstName)}
        </h1>
        <p className="text-muted mt-1 text-sm">{today}</p>
      </header>

      <section aria-labelledby="kpi-heading">
        <h2
          id="kpi-heading"
          className="text-muted mb-4 text-sm font-semibold tracking-widest uppercase"
        >
          {t.summary}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.key}
              className="border-border-subtle bg-surface flex items-center gap-4 rounded-xl border p-5 shadow-sm"
            >
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {kpi.value}
                </p>
                <p className="text-secondary text-xs">{t.kpi[kpi.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="text-muted mb-4 text-sm font-semibold tracking-widest uppercase"
        >
          {t.recentActivity}
        </h2>
        {RECENT_ACTIVITY.length === 0 ? (
          <p className="text-muted text-sm">{t.noRecentActivity}</p>
        ) : (
          <ul className="space-y-2">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.timestamp} className="text-secondary text-sm">
                <span className="text-muted mr-2">{item.timestamp}</span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
