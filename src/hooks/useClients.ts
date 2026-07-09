import { useCallback, useEffect, useRef, useState } from 'react';
import type { Client, ClientStatus, NewClient } from '../types';
import { createRepo, type ClientsRepo, type StorageMode } from '../data/repo';
import { notifyNewClient } from '../lib/notify';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [mode, setMode] = useState<StorageMode>('local');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repoRef = useRef<ClientsRepo | null>(null);

  useEffect(() => {
    const { repo, initialMode } = createRepo(() => {
      // Supabase упал — FallbackRepo уже повторил операцию на localStorage.
      setMode('local');
      setError(
        'Supabase недоступен — приложение работает в локальном режиме, данные сохраняются в этом браузере.',
      );
      repo.list().then(setClients).catch(() => {});
    });
    repoRef.current = repo;
    setMode(initialMode);

    repo
      .list()
      .then(setClients)
      .catch(() => setError('Не удалось загрузить список клиентов.'))
      .finally(() => setLoading(false));
  }, []);

  const addClient = useCallback(async (input: NewClient) => {
    const repo = repoRef.current;
    if (!repo) return;
    setPending(true);
    try {
      const client = await repo.add(input);
      // Дедуп по id: при фоллбэке список мог обновиться целиком и уже содержать клиента.
      setClients((prev) => [client, ...prev.filter((c) => c.id !== client.id)]);
      notifyNewClient(client);
    } catch {
      setError('Не удалось добавить клиента. Попробуйте ещё раз.');
      throw new Error('add failed'); // форма не очищает поля при ошибке
    } finally {
      setPending(false);
    }
  }, []);

  const setStatus = useCallback(async (id: string, status: ClientStatus) => {
    const repo = repoRef.current;
    if (!repo) return;
    let prev: Client[] = [];
    setClients((cur) => {
      prev = cur;
      return cur.map((c) => (c.id === id ? { ...c, status } : c));
    });
    try {
      await repo.updateStatus(id, status);
    } catch {
      setClients(prev);
      setError('Не удалось сохранить изменение — статус возвращён.');
    }
  }, []);

  const removeClient = useCallback(async (id: string) => {
    const repo = repoRef.current;
    if (!repo) return;
    let prev: Client[] = [];
    setClients((cur) => {
      prev = cur;
      return cur.filter((c) => c.id !== id);
    });
    try {
      await repo.remove(id);
    } catch {
      setClients(prev);
      setError('Не удалось удалить клиента.');
    }
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return { clients, mode, loading, pending, error, addClient, setStatus, removeClient, dismissError };
}
