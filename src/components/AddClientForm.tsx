import { useState, type FormEvent } from 'react';
import type { NewClient } from '../types';

const PHONE_RE = /^\+?[\d\s()-]{5,20}$/;

export function AddClientForm({
  onAdd,
  pending,
}: {
  onAdd: (input: NewClient) => Promise<void>;
  pending: boolean;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setFieldError('Укажите имя клиента');
      return;
    }
    if (trimmedPhone && !PHONE_RE.test(trimmedPhone)) {
      setFieldError('Телефон выглядит некорректно');
      return;
    }
    setFieldError(null);

    try {
      await onAdd({ name: trimmedName, phone: trimmedPhone });
      setName('');
      setPhone('');
    } catch {
      // ошибка уже показана баннером; поля сохраняем, чтобы не перенабирать
    }
  }

  return (
    <form className="card add-form" onSubmit={handleSubmit} noValidate>
      <div className="add-form-fields">
        <label className="field">
          <span className="field-label">Имя клиента *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Петрова Мария"
            disabled={pending}
          />
        </label>
        <label className="field">
          <span className="field-label">Телефон</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 900 000-00-00"
            disabled={pending}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Добавление…' : 'Добавить клиента'}
        </button>
      </div>
      {fieldError && <p className="field-error">{fieldError}</p>}
    </form>
  );
}
