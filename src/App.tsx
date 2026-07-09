import { useClients } from './hooks/useClients';
import { StatCards } from './components/StatCards';
import { AddClientForm } from './components/AddClientForm';
import { ClientsTable } from './components/ClientsTable';
import { StorageBadge } from './components/StorageBadge';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const {
    clients,
    mode,
    loading,
    pending,
    error,
    addClient,
    setStatus,
    removeClient,
    dismissError,
  } = useClients();

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>⚖️ CRM юриста</h1>
          <p className="subtitle">Учёт клиентов и статусов дел</p>
        </div>
        <StorageBadge mode={mode} />
      </header>

      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      <StatCards clients={clients} />
      <AddClientForm onAdd={addClient} pending={pending} />

      {loading ? (
        <div className="card loading">Загрузка…</div>
      ) : (
        <ClientsTable clients={clients} onStatusChange={setStatus} onRemove={removeClient} />
      )}

      <footer className="page-footer">
        Прототип за один вечер · React + Supabase + Vercel · Telegram-уведомления о новых клиентах
      </footer>
    </div>
  );
}
