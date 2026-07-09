import { useMemo } from 'react';
import { STATUS_META, STATUS_ORDER, type Client, type ClientStatus } from '../types';

export function StatCards({ clients }: { clients: Client[] }) {
  const counts = useMemo(() => {
    const acc: Record<ClientStatus, number> = { new: 0, in_progress: 0, closed: 0 };
    for (const c of clients) acc[c.status]++;
    return acc;
  }, [clients]);

  return (
    <section className="stat-grid" aria-label="Счётчики по статусам">
      <div className="stat-card">
        <div className="stat-value">{clients.length}</div>
        <div className="stat-label">
          <span className="stat-dot" style={{ background: '#898781' }} />
          Всего клиентов
        </div>
      </div>
      {STATUS_ORDER.map((status) => (
        <div className="stat-card" key={status}>
          <div className="stat-value">{counts[status]}</div>
          <div className="stat-label">
            <span className="stat-dot" style={{ background: STATUS_META[status].accent }} />
            {STATUS_META[status].label}
          </div>
        </div>
      ))}
    </section>
  );
}
