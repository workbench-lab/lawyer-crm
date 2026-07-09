export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button type="button" className="banner-close" onClick={onDismiss} aria-label="Скрыть">
        ✕
      </button>
    </div>
  );
}
