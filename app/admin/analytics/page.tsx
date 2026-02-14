import { readJsonFile } from '../../../lib/server/jsonStore';

interface StoredEvent {
  event: string;
  productId?: number;
  source?: string;
  category?: string;
  pathname?: string;
  timestamp: string;
}

export const dynamic = 'force-dynamic';

export default async function AnalyticsDashboardPage() {
  const store = await readJsonFile<{ events: StoredEvent[] }>('analytics-events.json', { events: [] });

  const totals = store.events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {});

  const topPages = Object.entries(
    store.events.reduce<Record<string, number>>((acc, event) => {
      if (!event.pathname) return acc;
      acc[event.pathname] = (acc[event.pathname] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">KPI baseline for product funnel instrumentation.</p>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{store.events.length}</p>
          </div>
          {Object.entries(totals).slice(0, 3).map(([name, count]) => (
            <div key={name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Breakdown</h2>
          <ul className="space-y-2">
            {Object.entries(totals).map(([name, count]) => (
              <li key={name} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-700 dark:text-gray-200">{name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
              </li>
            ))}
            {Object.keys(totals).length === 0 && <li className="text-gray-500 dark:text-gray-400">No events captured yet.</li>}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h2>
          <ul className="space-y-2">
            {topPages.map(([page, count]) => (
              <li key={page} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-700 dark:text-gray-200">{page}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
              </li>
            ))}
            {topPages.length === 0 && <li className="text-gray-500 dark:text-gray-400">No page data yet.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}
