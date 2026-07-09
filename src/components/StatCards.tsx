import { useMemo } from 'react';
import { Users, UserPlus, Briefcase, CheckCircle2 } from 'lucide-react';
import { STATUS_META, type Client, type ClientStatus } from '../types';

const CARDS: {
  key: 'total' | ClientStatus;
  label: string;
  icon: typeof Users;
}[] = [
  { key: 'total', label: 'Всего клиентов', icon: Users },
  { key: 'new', label: 'Новые', icon: UserPlus },
  { key: 'in_progress', label: 'В работе', icon: Briefcase },
  { key: 'closed', label: 'Закрытые', icon: CheckCircle2 },
];

export function StatCards({ clients }: { clients: Client[] }) {
  const counts = useMemo(() => {
    const acc: Record<ClientStatus, number> = { new: 0, in_progress: 0, closed: 0 };
    for (const c of clients) acc[c.status]++;
    return acc;
  }, [clients]);

  return (
    <section className="stat-grid" aria-label="Счётчики по статусам">
      {CARDS.map(({ key, label, icon: Icon }) => {
        const value = key === 'total' ? clients.length : counts[key];
        const accent = key === 'total' ? 'var(--brand)' : STATUS_META[key].accent;
        const tint = key === 'total' ? 'var(--brand-tint)' : STATUS_META[key].badgeBg;
        return (
          <div className="stat-card" key={key}>
            <span className="stat-icon" style={{ background: tint, color: accent }}>
              <Icon size={19} strokeWidth={2.1} />
            </span>
            <div>
              <div className="stat-value">
                <span key={value} className="stat-value-num">
                  {value}
                </span>
              </div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
