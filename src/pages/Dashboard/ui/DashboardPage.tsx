import { format } from 'date-fns'
import { useSessionStore } from '@/shared/model'
import { useDashboardTranslation } from '../i18n'
import { KPI_CARDS, RECENT_ACTIVITY } from '../lib/dashboard.constants'

export const DashboardPage = () => {
  const { name = '' } = useSessionStore((state) => state.user) ?? {}
  const { t } = useDashboardTranslation()

  const today = format(new Date(), t.dateFormat, { locale: t.dateLocale })

  return (
    <div className="w-full space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {t.welcome(name)}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{today}</p>
      </header>

      <section aria-labelledby="kpi-heading">
        <h2
          id="kpi-heading"
          className="mb-4 text-sm font-semibold tracking-widest text-slate-400 uppercase"
        >
          {t.summary}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.key}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                <p className="text-xs text-slate-500">{t.kpi[kpi.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="mb-4 text-sm font-semibold tracking-widest text-slate-400 uppercase"
        >
          {t.recentActivity}
        </h2>
        {RECENT_ACTIVITY.length === 0 ? (
          <p className="text-sm text-slate-400">{t.noRecentActivity}</p>
        ) : (
          <ul className="space-y-2">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.timestamp} className="text-sm text-slate-600">
                <span className="mr-2 text-slate-400">{item.timestamp}</span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
