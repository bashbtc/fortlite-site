export function validContact(raw) {
  const value = raw.trim();
  if (value.startsWith('@')) return /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value);
  if (!/^\+?[\d()\s-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function parseAmount(raw) {
  const value = raw.trim().replace(/\s/g, '');
  if (!value) return { value: null };
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) {
    return { error: 'Укажите сумму в рублях, например 50 000 или 50 000,50.' };
  }
  const number = Number(value.replace(',', '.'));
  if (!Number.isFinite(number) || !Number.isSafeInteger(Math.round(number * 100))) {
    return { error: 'Проверьте сумму: число слишком большое для корректного расчёта.' };
  }
  if (number < 50000) return { error: 'Укажите сумму от 50 000 ₽.' };
  return { value: number };
}

export function formatAmount(raw) {
  const result = parseAmount(raw);
  return result.value === null || result.error
    ? 'Уточнить с менеджером'
    : `${result.value.toLocaleString('ru-RU', { minimumFractionDigits: result.value % 1 ? 2 : 0, maximumFractionDigits: 2 })} ₽`;
}

export function validateInquiry({ amount, contact, consent }) {
  const parsed = parseAmount(amount);
  if (parsed.error) return { field: 'amount', message: parsed.error };
  if (!validContact(contact)) return { field: 'contact', message: 'Укажите телефон без лишних букв или Telegram в формате @username.' };
  if (!consent) return { field: 'consent', message: 'Подтвердите согласие на обработку данных.' };
  return null;
}

export function visitSummary(visit) {
  return `FortLite Capital — запрос на встречу\nИмя: ${visit.name.trim()}\nКонтакт: ${visit.contact.trim()}\nУдобное время: ${visit.time}\nГород: Уфа\nВремя и адрес встречи требуют подтверждения менеджером.`;
}
