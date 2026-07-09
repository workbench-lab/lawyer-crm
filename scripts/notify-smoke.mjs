// Локальный смоук-тест api/notify.ts без vercel CLI (Node 22 понимает TS нативно).
// Запуск: node --env-file=.env.local scripts/notify-smoke.mjs
const { POST } = await import('../api/notify.ts');

const request = new Request('http://localhost/api/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Тестовый Клиент', phone: '+7 900 000-00-00' }),
});

const response = await POST(request);
console.log(response.status, await response.json());
