const PALETTES = [
  'linear-gradient(135deg, #5b4fe9, #8b5cf6)',
  'linear-gradient(135deg, #2e90fa, #2cc9e8)',
  'linear-gradient(135deg, #f79009, #f5b93c)',
  'linear-gradient(135deg, #12b76a, #3ccf8e)',
  'linear-gradient(135deg, #e5484d, #f0708a)',
  'linear-gradient(135deg, #6938ef, #b452e8)',
];

function hashOf(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span className="avatar" style={{ background: PALETTES[hashOf(name) % PALETTES.length] }}>
      {initials || '•'}
    </span>
  );
}
