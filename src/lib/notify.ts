import type { Client } from '../types';

/**
 * Fire-and-forget уведомление юристу о новом клиенте.
 * UI никогда не блокируется и не показывает ошибку: под `vite dev`
 * роута /api/notify нет (404), в проде без Telegram-ключей функция
 * отвечает {skipped: true} — оба случая молча игнорируются.
 */
export function notifyNewClient(client: Client): void {
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: client.name, phone: client.phone }),
  }).catch(() => {});
}
