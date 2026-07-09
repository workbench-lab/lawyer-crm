import type { StorageMode } from '../data/repo';

export function StorageBadge({ mode }: { mode: StorageMode }) {
  const isCloud = mode === 'supabase';
  return (
    <span
      className={`storage-badge ${isCloud ? 'storage-badge-cloud' : 'storage-badge-local'}`}
      title={
        isCloud
          ? 'Данные хранятся в облачной базе Supabase'
          : 'Данные хранятся в localStorage этого браузера'
      }
    >
      <span className="storage-dot" />
      {isCloud ? 'Supabase' : 'Локальный режим'}
    </span>
  );
}
