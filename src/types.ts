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
  new: { label: 'Новый', accent: '#2a78d6', badgeBg: '#e7f0fb', badgeText: '#1c5cab' },
  in_progress: { label: 'В работе', accent: '#eda100', badgeBg: '#faf0d2', badgeText: '#8a5a00' },
  closed: { label: 'Закрыт', accent: '#008300', badgeBg: '#e3f2e3', badgeText: '#006300' },
};
