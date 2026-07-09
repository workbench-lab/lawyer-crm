import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Client, ClientStatus, NewClient } from '../types';
import type { ClientsRepo } from './repo';

// Без таймаута зависший/уснувший проект Supabase держал бы первый рендер ~30 с.
const TIMEOUT_MS = 4000;

interface ClientRow {
  id: string;
  name: string;
  phone: string | null;
  status: ClientStatus;
  created_at: string;
}

function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? '',
    status: row.status,
    createdAt: row.created_at,
  };
}

export class SupabaseRepo implements ClientsRepo {
  private db: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.db = createClient(url, anonKey);
  }

  async list(): Promise<Client[]> {
    const { data, error } = await this.db
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) throw error;
    return (data as ClientRow[]).map(toClient);
  }

  async add(input: NewClient): Promise<Client> {
    const { data, error } = await this.db
      .from('clients')
      .insert({ name: input.name, phone: input.phone || null })
      .select()
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS))
      .single();
    if (error) throw error;
    return toClient(data as ClientRow);
  }

  async updateStatus(id: string, status: ClientStatus): Promise<void> {
    const { error } = await this.db
      .from('clients')
      .update({ status })
      .eq('id', id)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) throw error;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.db
      .from('clients')
      .delete()
      .eq('id', id)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) throw error;
  }
}
