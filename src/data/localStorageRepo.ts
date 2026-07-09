import type { Client, ClientStatus, NewClient } from '../types';
import type { ClientsRepo } from './repo';

const KEY = 'lawyer-crm:clients:v1';

function seed(): Client[] {
  const hour = 60 * 60 * 1000;
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      name: 'Иванов Пётр',
      phone: '+7 900 123-45-67',
      status: 'new',
      createdAt: new Date(now - 2 * hour).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Смирнова Анна',
      phone: '+7 911 222-33-44',
      status: 'in_progress',
      createdAt: new Date(now - 26 * hour).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Кузнецов Олег',
      phone: '+7 921 555-66-77',
      status: 'closed',
      createdAt: new Date(now - 70 * hour).toISOString(),
    },
  ];
}

export class LocalStorageRepo implements ClientsRepo {
  private read(): Client[] {
    const raw = localStorage.getItem(KEY);
    // Сидим демо-данные только при самом первом запуске: пустой список ('[]')
    // после удаления всех клиентов должен пережить перезагрузку.
    if (raw === null) {
      const demo = seed();
      this.write(demo);
      return demo;
    }
    try {
      return JSON.parse(raw) as Client[];
    } catch {
      return [];
    }
  }

  private write(clients: Client[]): void {
    localStorage.setItem(KEY, JSON.stringify(clients));
  }

  async list(): Promise<Client[]> {
    return [...this.read()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async add(input: NewClient): Promise<Client> {
    const client: Client = {
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.write([client, ...this.read()]);
    return client;
  }

  async updateStatus(id: string, status: ClientStatus): Promise<void> {
    this.write(this.read().map((c) => (c.id === id ? { ...c, status } : c)));
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((c) => c.id !== id));
  }
}
