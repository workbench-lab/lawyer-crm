import { useState, type FormEvent } from 'react';
import { User, Phone, Plus } from 'lucide-react';
import type { NewClient } from '../types';
import { isCompletePhone, nextPhoneValue } from '../lib/phone';

export function AddClientForm({
  onAdd,
  pending,
}: {
  onAdd: (input: NewClient) => Promise<void>;
  pending: boolean;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim().replace(/\s+/g, ' ');

    const nextErrors: typeof errors = {};
    if (!trimmedName) nextErrors.name = 'Укажите имя клиента';
    else if (trimmedName.length < 2) nextErrors.name = 'Слишком короткое имя';
    if (phone && !isCompletePhone(phone)) nextErrors.phone = 'Введите номер полностью';

    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    try {
      await onAdd({ name: trimmedName, phone });
      setName('');
      setPhone('');
    } catch {
      // ошибка показана баннером; значения полей сохраняем
    }
  }

  return (
    <form className="card add-form" onSubmit={handleSubmit} noValidate>
      <div className="add-form-fields">
        <label className="field">
          <span className="field-label">Имя клиента</span>
          <span className={`input-wrap ${errors.name ? 'has-error' : ''}`}>
            <User size={16} className="input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
              }}
              placeholder="Петрова Мария"
              disabled={pending}
            />
          </span>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label className="field">
          <span className="field-label">
            Телефон <span className="field-hint">· необязательно</span>
          </span>
          <span className={`input-wrap ${errors.phone ? 'has-error' : ''}`}>
            <Phone size={16} className="input-icon" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(nextPhoneValue(phone, e.target.value));
                if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
              }}
              placeholder="+7 (900) 000-00-00"
              disabled={pending}
              inputMode="tel"
            />
          </span>
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>

        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <>
              <Plus size={17} strokeWidth={2.4} />
              Добавить
            </>
          )}
        </button>
      </div>
    </form>
  );
}
