/**
 * Vercel serverless-функция: уведомление юристу в Telegram о новом клиенте.
 * Токен и chat_id живут только в серверных env (без префикса VITE_ —
 * значит, в клиентский бандл не попадают).
 */
export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ ok: true, skipped: true, reason: 'telegram env not configured' });
  }

  let payload: { name?: unknown; phone?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid JSON' }, { status: 400 });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim().slice(0, 200) : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim().slice(0, 50) : '';
  if (!name) {
    return Response.json({ ok: false, error: 'name is required' }, { status: 400 });
  }

  // HTML-режим: экранировать нужно только & < > (в отличие от MarkdownV2,
  // где любой неэкранированный символ из ~18 роняет всё сообщение).
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const when = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const appUrl = host ? `https://${host}` : null;

  const text = [
    '<b>Новый клиент в CRM</b>',
    '',
    `Имя — <b>${esc(name)}</b>`,
    `Телефон — ${phone ? `<code>${esc(phone)}</code>` : '<i>не указан</i>'}`,
    `Статус — Новый`,
    '',
    `<i>${esc(when)} (МСК)</i>${appUrl ? ` · <a href="${appUrl}">Открыть CRM</a>` : ''}`,
  ].join('\n');

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return Response.json({ ok: r.ok, skipped: false }, { status: r.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: 'telegram unreachable' }, { status: 502 });
  }
}
