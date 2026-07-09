import { CheckCircle2 } from 'lucide-react';

export function Toast({ text }: { text: string }) {
  return (
    <div className="toast" role="status">
      <CheckCircle2 size={17} />
      {text}
    </div>
  );
}
