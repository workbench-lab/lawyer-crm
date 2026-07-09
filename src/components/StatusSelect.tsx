import { STATUS_META, STATUS_ORDER, type ClientStatus } from '../types';

export function StatusSelect({
  value,
  onChange,
}: {
  value: ClientStatus;
  onChange: (status: ClientStatus) => void;
}) {
  const meta = STATUS_META[value];
  return (
    <select
      className="status-select"
      value={value}
      onChange={(e) => onChange(e.target.value as ClientStatus)}
      style={{ background: meta.badgeBg, color: meta.badgeText }}
      aria-label="Статус дела"
    >
      {STATUS_ORDER.map((status) => (
        <option key={status} value={status}>
          {STATUS_META[status].label}
        </option>
      ))}
    </select>
  );
}
