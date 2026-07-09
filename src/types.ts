export type ClientStatus = 'new' | 'in_progress' | 'closed';

export interface Client {
  id: string;
  name: string;
  phone: string; // '' если не указан
  status: ClientStatus;
  createdAt: string; // ISO 8601
}

export type NewClient = Pick<Client, 'name' | 'phone'>;

export const STATUS_ORDER: ClientStatus[] = ['new', 'in_progress', 'closed'];

export const STATUS_META: Record<
  ClientStatus,
  { label: string; accent: string; badgeBg: string; badgeText: string }
> = {
  new: { label: 'Новый', accent: '#2e90fa', badgeBg: '#e8f2fe', badgeText: '#175cd3' },
  in_progress: { label: 'В работе', accent: '#f79009', badgeBg: '#fdf1df', badgeText: '#b54708' },
  closed: { label: 'Закрыт', accent: '#12b76a', badgeBg: '#e3f8ec', badgeText: '#067647' },
};
