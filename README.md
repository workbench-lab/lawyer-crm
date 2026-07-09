# ⚖️ CRM юриста

Одностраничный дашборд для учёта клиентов юриста: таблица клиентов, добавление, смена статуса дела («Новый» → «В работе» → «Закрыт»), счётчики по статусам и Telegram-уведомление о каждом новом клиенте.

**Живое демо:** https://lawyer-crm-workbench-labs-projects.vercel.app · **Код:** https://github.com/workbench-lab/lawyer-crm

## Возможности

- Таблица клиентов: имя, телефон, статус дела, дата добавления, удаление.
- Добавление клиента с валидацией (имя обязательно, телефон проверяется по маске).
- Смена статуса прямо в таблице — цветной селект.
- Счётчики: всего клиентов и по каждому статусу, обновляются мгновенно.
- 🔔 **Бонус:** при добавлении клиента юристу приходит уведомление в Telegram.
- Отказоустойчивость: если Supabase недоступен, приложение автоматически переключается на localStorage — демо работает всегда (бейдж в шапке показывает текущий режим).

## Стек и архитектура

- **Vite + React 19 + TypeScript** — быстрый старт, типобезопасность, ноль лишних зависимостей (без роутера и стейт-менеджеров — им тут нечего делать).
- **Supabase (Postgres)** — реальная общая база без собственного бэкенда.
- **Слой данных — паттерн «репозиторий»** (`src/data/repo.ts`): интерфейс `ClientsRepo` с двумя реализациями (Supabase / localStorage) и обёрткой `FallbackRepo`, которая при первой же ошибке облака переключается на локальное хранилище и повторяет упавшую операцию — действие пользователя не теряется.
- **Vercel** — статика и serverless-функция `api/notify.ts` (Telegram) в одном деплое. Токен бота живёт только в серверных env-переменных и в клиентский бандл не попадает.

## Запуск локально

```bash
npm install
npm run dev
```

Работает сразу, без ключей и аккаунтов — в локальном режиме (localStorage + демо-данные). Чтобы подключить облако, создайте `.env.local` по образцу `.env.example`.

## Настройка Supabase

Создайте проект на [supabase.com](https://supabase.com) и выполните в SQL Editor:

```sql
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  status     text not null default 'new' check (status in ('new','in_progress','closed')),
  created_at timestamptz not null default now()
);

-- RLS включён, но политики намеренно открыты для anon-ключа:
-- это прототип без аутентификации. В проде — политики по auth.uid().
alter table public.clients enable row level security;
create policy "anon can select" on public.clients for select to anon using (true);
create policy "anon can insert" on public.clients for insert to anon with check (true);
create policy "anon can update" on public.clients for update to anon using (true) with check (true);
create policy "anon can delete" on public.clients for delete to anon using (true);
```

## Telegram-уведомления

1. Создайте бота через [@BotFather](https://t.me/BotFather) (`/newbot`) — получите токен.
2. Напишите боту любое сообщение (боты не могут писать первыми).
3. Узнайте свой chat_id: `https://api.telegram.org/bot<ТОКЕН>/getUpdates` → `result[0].message.chat.id`.
4. Проверить локально без деплоя: `node --env-file=.env.local scripts/notify-smoke.mjs`.

## Переменные окружения

| Переменная | Где действует | Назначение |
|---|---|---|
| `VITE_SUPABASE_URL` | клиент (вшивается при сборке) | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | клиент (вшивается при сборке) | публичный anon/publishable-ключ |
| `TELEGRAM_BOT_TOKEN` | только сервер (`api/notify`) | токен бота — секрет |
| `TELEGRAM_CHAT_ID` | только сервер (`api/notify`) | чат юриста |

## Деплой на Vercel

1. Импортируйте репозиторий (framework определится как Vite) или используйте `vercel` CLI.
2. **До первого билда** добавьте все 4 переменные окружения — `VITE_*` вшиваются в бандл на этапе сборки, после изменения нужен Redeploy.
3. Deploy. Функция `/api/notify` подхватится автоматически.

## Структура проекта

```
api/notify.ts            — serverless-функция Telegram-уведомлений
src/types.ts             — модель Client, статусы, подписи и цвета
src/data/repo.ts         — интерфейс ClientsRepo + FallbackRepo (ядро архитектуры)
src/data/supabaseRepo.ts — реализация на Supabase (таймаут 4 с на вызов)
src/data/localStorageRepo.ts — реализация на localStorage + демо-данные
src/hooks/useClients.ts  — состояние, optimistic updates с откатом
src/components/          — StatCards, AddClientForm, ClientsTable, StatusSelect, …
scripts/notify-smoke.mjs — локальный смоук-тест Telegram-функции
```
