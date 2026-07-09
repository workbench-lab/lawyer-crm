import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { STATUS_META, STATUS_ORDER, type ClientStatus } from '../types';

export function StatusSelect({
  value,
  onChange,
}: {
  value: ClientStatus;
  onChange: (status: ClientStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[value];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="status-select" ref={rootRef}>
      <button
        type="button"
        className="status-trigger"
        style={{ background: meta.badgeBg, color: meta.badgeText }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="status-dot" style={{ background: meta.accent }} />
        {meta.label}
        <ChevronDown size={13} className={`status-chevron ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <ul className="status-menu" role="listbox" aria-label="Статус дела">
          {STATUS_ORDER.map((status) => {
            const m = STATUS_META[status];
            const selected = status === value;
            return (
              <li key={status} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`status-option ${selected ? 'is-selected' : ''}`}
                  onClick={() => {
                    setOpen(false);
                    if (!selected) onChange(status);
                  }}
                >
                  <span className="status-dot" style={{ background: m.accent }} />
                  {m.label}
                  {selected && <Check size={14} className="status-check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
