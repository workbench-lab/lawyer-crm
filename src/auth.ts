/**
 * Демо-авторизация для прототипа: один предустановленный аккаунт,
 * сессия в localStorage. В проде здесь был бы Supabase Auth.
 */
const SESSION_KEY = 'lawyer-crm:session:v1';

export const DEMO_EMAIL = 'demo@lawyer.ru';
export const DEMO_PASSWORD = 'demo1234';

export function login(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
  if (ok) localStorage.setItem(SESSION_KEY, JSON.stringify({ email: DEMO_EMAIL, at: Date.now() }));
  return ok;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthed(): boolean {
  return localStorage.getItem(SESSION_KEY) !== null;
}
