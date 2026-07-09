/**
 * Маска российского номера: «+7 (900) 123-45-67».
 * Ввод «8…» и «7…» приводится к +7, максимум 11 цифр.
 */
export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (!d) return '';
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') d = '7' + d;
  d = d.slice(0, 11);

  const p = d.slice(1);
  let out = '+7';
  if (p.length > 0) out += ' (' + p.slice(0, 3);
  if (p.length >= 4) out += ') ' + p.slice(3, 6);
  if (p.length >= 7) out += '-' + p.slice(6, 8);
  if (p.length >= 9) out += '-' + p.slice(8, 10);
  return out;
}

export function isCompletePhone(value: string): boolean {
  return value.replace(/\D/g, '').length === 11;
}

/**
 * Обработка изменения поля с учётом backspace: если пользователь стёр
 * только символ форматирования (скобку/дефис), убираем и последнюю цифру —
 * иначе маска мгновенно вернёт стёртое и поле «залипнет».
 */
export function nextPhoneValue(prev: string, next: string): string {
  const digitsOf = (s: string) => s.replace(/\D/g, '');
  if (next.length < prev.length && digitsOf(next) === digitsOf(prev)) {
    return formatPhone(digitsOf(next).slice(0, -1));
  }
  return formatPhone(next);
}
