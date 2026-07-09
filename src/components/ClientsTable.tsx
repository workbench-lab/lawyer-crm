import { Trash2, Inbox, Phone } from 'lucide-react';
import type { Client, ClientStatus } from '../types';
import { StatusSelect } from './StatusSelect';
import { Avatar } from './Avatar';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ClientsTable({
  clients,
  highlightId,
  onStatusChange,
  onDeleteRequest,
}: {
  clients: Client[];
  highlightId: string | null;
  onStatusChange: (id: string, status: ClientStatus) => void;
  onDeleteRequest: (client: Client) => void;
}) {
  if (clients.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">
          <Inbox size={26} />
        </span>
        <h3>Клиентов пока нет</h3>
        <p>Добавьте первого клиента через форму выше — он появится в этом списке.</p>
      </div>
    );
  }

  return (
    <div className="card table-card">
      {/* Десктоп: таблица */}
      <table className="clients-table">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Статус дела</th>
            <th>Добавлен</th>
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className={client.id === highlightId ? 'row-flash' : ''}>
              <td>
                <span className="client-cell">
                  <Avatar name={client.name} />
                  <span className="client-name">{client.name}</span>
                </span>
              </td>
              <td className="cell-phone">{client.phone || '—'}</td>
              <td>
                <StatusSelect
                  value={client.status}
                  onChange={(status) => onStatusChange(client.id, status)}
                />
              </td>
              <td className="cell-date">{formatDate(client.createdAt)}</td>
              <td className="cell-actions">
                <button
                  type="button"
                  className="btn-icon btn-icon-danger"
                  title="Удалить клиента"
                  aria-label={`Удалить клиента ${client.name}`}
                  onClick={() => onDeleteRequest(client)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Мобильный: карточки */}
      <ul className="clients-cards">
        {clients.map((client) => (
          <li
            key={client.id}
            className={`client-card ${client.id === highlightId ? 'row-flash' : ''}`}
          >
            <div className="client-card-top">
              <span className="client-cell">
                <Avatar name={client.name} />
                <span>
                  <span className="client-name">{client.name}</span>
                  <span className="client-card-phone">
                    {client.phone ? (
                      <>
                        <Phone size={12} /> {client.phone}
                      </>
                    ) : (
                      <span className="client-card-nophone">телефон не указан</span>
                    )}
                  </span>
                </span>
              </span>
              <button
                type="button"
                className="btn-icon btn-icon-danger"
                aria-label={`Удалить клиента ${client.name}`}
                onClick={() => onDeleteRequest(client)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="client-card-bottom">
              <StatusSelect
                value={client.status}
                onChange={(status) => onStatusChange(client.id, status)}
              />
              <span className="cell-date">{formatDate(client.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
