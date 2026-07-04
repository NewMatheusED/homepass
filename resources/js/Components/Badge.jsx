const PALETTE = [
    'bg-brand-500/15 text-brand-300 ring-brand-500/30',
    'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    'bg-sky-500/15 text-sky-300 ring-sky-500/30',
    'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    'bg-rose-500/15 text-rose-300 ring-rose-500/30',
    'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30',
];

function colorFor(text) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }

    return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function Badge({ children, className = '' }) {
    const colors = colorFor(String(children));

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors} ${className}`}
        >
            {children}
        </span>
    );
}
