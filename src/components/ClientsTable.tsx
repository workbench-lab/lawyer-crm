import type { Client, ClientStatus } from '../types';
import { StatusSelect } from './StatusSelect';

export function ClientsTable({
  clients,
  onStatusChange,
  onRemove,
}: {
  clients: Client[];
  onStatusChange: (id: string, status: ClientStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="card table-wrap">
      <table className="clients-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Статус дела</th>
            <th>Добавлен</th>
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-state">
                Клиентов пока нет — добавьте первого через форму выше.
              </td>
            </tr>
          )}
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="cell-name">{client.name}</td>
              <td className="cell-phone">{client.phone || '—'}</td>
              <td>
                <StatusSelect
                  value={client.status}
                  onChange={(status) => onStatusChange(client.id, status)}
                />
              </td>
              <td className="cell-date">
                {new Date(client.createdAt).toLocaleDateString('ru-RU')}
              </td>
              <td className="cell-actions">
                <button
                  type="button"
                  className="btn-delete"
                  title="Удалить клиента"
                  onClick={() => {
                    if (window.confirm(`Удалить клиента «${client.name}»?`)) {
                      onRemove(client.id);
                    }
                  }}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
