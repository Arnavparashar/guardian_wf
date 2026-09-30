import { graph } from '../lib/mock'

export default function EntityGraph({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const byId = Object.fromEntries(graph.nodes.map((n) => [n.id, n]))
  return (
    <svg viewBox="0 0 740 300" className="h-full w-full" role="img" aria-label="Entity graph">
      {graph.edges.map(([a, b, label]) => {
        const A = byId[a], B = byId[b]
        return (
          <g key={a + b}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--line-strong)" strokeWidth={1.5} />
            <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 6} textAnchor="middle" fontSize={10} fill="var(--muted)">{label}</text>
          </g>
        )
      })}
      {graph.nodes.map((n) => (
        <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
          <circle cx={n.x} cy={n.y} r={n.r}
            fill={selected === n.id ? 'var(--sel)' : 'var(--surface)'}
            stroke={n.risk === 'High' ? 'var(--ink)' : 'var(--line-strong)'}
            strokeWidth={selected === n.id ? 3 : 1.5}
            strokeDasharray={n.id === 'past' ? '3 3' : undefined} />
          <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fontSize={11} fill="var(--ink-2)" fontFamily="IBM Plex Mono, monospace">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}
