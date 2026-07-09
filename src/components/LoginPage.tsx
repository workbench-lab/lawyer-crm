import { useState, type FormEvent } from 'react';
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { login, DEMO_EMAIL, DEMO_PASSWORD } from '../auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [shake, setShake] = useState(0);

  function fail(message: string) {
    setError(message);
    setShake((s) => s + 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return fail('Введите e-mail');
    if (!EMAIL_RE.test(email.trim())) return fail('Похоже, в e-mail опечатка');
    if (!password) return fail('Введите пароль');

    setError(null);
    setPending(true);
    // небольшая пауза — имитация запроса, чтобы состояние загрузки было заметно
    await new Promise((r) => setTimeout(r, 450));
    if (login(email, password)) {
      onSuccess();
    } else {
      setPending(false);
      fail('Неверный e-mail или пароль');
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <div className="login-screen">
      <div className="login-blob login-blob-a" aria-hidden="true" />
      <div className="login-blob login-blob-b" aria-hidden="true" />

      <div className="login-card" key={shake} data-shake={shake > 0 ? '' : undefined}>
        <div className="brand brand-login">
          <span className="brand-mark">
            <Scale size={22} strokeWidth={2.2} />
          </span>
          <span className="brand-name">CRM юриста</span>
        </div>

        <h1 className="login-title">Добро пожаловать</h1>
        <p className="login-sub">Войдите, чтобы управлять клиентами и делами</p>

        <button type="button" className="demo-chip" onClick={fillDemo}>
          <Sparkles size={14} />
          <span>
            Демо-доступ: <b>{DEMO_EMAIL}</b> · <b>{DEMO_PASSWORD}</b> — нажмите, чтобы заполнить
          </span>
        </button>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field-label">E-mail</span>
            <span className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lawfirm.ru"
                autoComplete="username"
                disabled={pending}
              />
            </span>
          </label>

          <label className="field">
            <span className="field-label">Пароль</span>
            <span className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={pending}
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="btn-primary btn-block" disabled={pending}>
            {pending ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <>
                Войти <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
