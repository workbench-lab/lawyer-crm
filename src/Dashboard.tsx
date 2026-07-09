import { useEffect, useRef, useState } from 'react';
import { Scale, LogOut } from 'lucide-react';
import { useClients } from './hooks/useClients';
import type { Client, NewClient } from './types';
import { StatCards } from './components/StatCards';
import { AddClientForm } from './components/AddClientForm';
import { ClientsTable } from './components/ClientsTable';
import { ErrorBanner } from './components/ErrorBanner';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { logout } from './auth';

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { clients, loading, pending, error, addClient, setStatus, removeClient, dismissError } =
    useClients();

  const [confirmTarget, setConfirmTarget] = useState<Client | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function showToast(text: string) {
    setToast({ id: Date.now(), text });
    timers.current.push(window.setTimeout(() => setToast(null), 2600));
  }

  async function handleAdd(input: NewClient) {
    await addClient(input);
    showToast('Клиент добавлен');
  }

  // подсветка самой свежей строки после добавления
  const prevCount = useRef(clients.length);
  useEffect(() => {
    if (clients.length === prevCount.current + 1) {
      const newest = clients[0];
      if (newest) {
        setHighlightId(newest.id);
        timers.current.push(window.setTimeout(() => setHighlightId(null), 1800));
      }
    }
    prevCount.current = clients.length;
  }, [clients]);

  function handleDeleteConfirmed() {
    if (!confirmTarget) return;
    removeClient(confirmTarget.id);
    setConfirmTarget(null);
    showToast('Клиент удалён');
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark">
            <Scale size={20} strokeWidth={2.2} />
          </span>
          <span>
            <h1 className="brand-name">CRM юриста</h1>
            <p className="subtitle">Клиенты и дела под контролем</p>
          </span>
        </div>
        <button
          type="button"
          className="btn-ghost btn-logout"
          onClick={() => {
            logout();
            onLogout();
          }}
        >
          <LogOut size={16} />
          <span className="btn-logout-label">Выйти</span>
        </button>
      </header>

      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      <StatCards clients={clients} />
      <AddClientForm onAdd={handleAdd} pending={pending} />

      {loading ? (
        <div className="card loading">
          <span className="spinner spinner-dark" aria-hidden="true" />
          Загружаем клиентов…
        </div>
      ) : (
        <ClientsTable
          clients={clients}
          highlightId={highlightId}
          onStatusChange={setStatus}
          onDeleteRequest={setConfirmTarget}
        />
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        title="Удалить клиента?"
        description={
          confirmTarget
            ? `${confirmTarget.name} будет удалён из списка вместе с историей статуса. Это действие нельзя отменить.`
            : ''
        }
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmTarget(null)}
      />

      {toast && <Toast key={toast.id} text={toast.text} />}
    </div>
  );
}
