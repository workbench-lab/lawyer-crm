import type { Client, ClientStatus, NewClient } from '../types';
import { LocalStorageRepo } from './localStorageRepo';
import { SupabaseRepo } from './supabaseRepo';

export interface ClientsRepo {
  /** Список клиентов, новые сверху. */
  list(): Promise<Client[]>;
  /** Добавляет клиента, возвращает строку с id из хранилища. */
  add(input: NewClient): Promise<Client>;
  updateStatus(id: string, status: ClientStatus): Promise<void>;
  remove(id: string): Promise<void>;
}

export type StorageMode = 'supabase' | 'local';

/**
 * Обёртка «Supabase → localStorage»: при первой же ошибке основного
 * хранилища навсегда (до перезагрузки страницы) переключается на локальное,
 * повторяет упавшую операцию там и сообщает наверх через onFallback.
 */
class FallbackRepo implements ClientsRepo {
  private active: ClientsRepo;
  private fellBack = false;
  private secondary: ClientsRepo;
  private onFallback: () => void;

  constructor(primary: ClientsRepo, secondary: ClientsRepo, onFallback: () => void) {
    this.active = primary;
    this.secondary = secondary;
    this.onFallback = onFallback;
  }

  private async run<T>(fn: (repo: ClientsRepo) => Promise<T>): Promise<T> {
    try {
      return await fn(this.active);
    } catch (err) {
      if (this.fellBack) throw err;
      this.fellBack = true;
      this.active = this.secondary;
      const result = await fn(this.active);
      this.onFallback();
      return result;
    }
  }

  list() {
    return this.run((r) => r.list());
  }
  add(input: NewClient) {
    return this.run((r) => r.add(input));
  }
  updateStatus(id: string, status: ClientStatus) {
    return this.run((r) => r.updateStatus(id, status));
  }
  remove(id: string) {
    return this.run((r) => r.remove(id));
  }
}

export function createRepo(onFallback: () => void): {
  repo: ClientsRepo;
  initialMode: StorageMode;
} {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !key) {
    return { repo: new LocalStorageRepo(), initialMode: 'local' };
  }
  return {
    repo: new FallbackRepo(new SupabaseRepo(url, key), new LocalStorageRepo(), onFallback),
    initialMode: 'supabase',
  };
}
