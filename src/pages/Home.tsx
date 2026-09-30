import { Link } from 'react-router-dom'
import { alerts, homeStats, Verdict } from '../lib/mock'
import { Card, Chip, Label, PageHeader, Stat, Row, Bar, verdictTone } from '../components/ui'

const SHADE: Record<Verdict, string> = { Malicious: 'var(--ink)', Suspicious: 'var(--ink-2)', Inconclusive: 'var(--muted)', Benign: 'var(--line)' }

function Donut() {
  const total = Object.values(homeStats.byVerdict).reduce((a, b) => a + b, 0)
  const C = 2 * Math.PI * 30
  let off = 0
  return (
    <svg viewBox="0 0 80 80" className="h-[88px] w-[88px] flex-none">
      <circle cx={40} cy={40} r={30} fill="none" stroke="var(--line)" strokeWidth={10} opacity={0.4} />
      {(Object.keys(homeStats.byVerdict) as Verdict[]).map((k) => {
        const len = (homeStats.byVerdict[k] / total) * C
        const el = <circle key={k} cx={40} cy={40} r={30} fill="none" stroke={SHADE[k]} strokeWidth={10} strokeDasharray={len + ' ' + (C - len)} strokeDashoffset={-off} transform="rotate(-90 40 40)" />
        off += len
        return el
      })}
      <text x={40} y={39} textAnchor="middle" fontSize={13} fontFamily="IBM Plex Mono, monospace" fill="var(--ink)">{total}</text>
      <text x={40} y={51} textAnchor="middle" fontSize={8} fill="var(--muted)">Total</text>
    </svg>
  )
}

export default function Home() {
  const max = Math.max(...homeStats.perDay)
  const unreviewed = alerts.filter((a) => a.status === 'In review')
  return (
    <>
      <PageHeader title="Home" sub="The signals, outcomes and decisions that need attention now."
        right={<div className="flex gap-6"><Stat label="Investigations" value={homeStats.investigations} /><Stat label="Median time to conclusion" value={homeStats.medianTtc} /><Stat label="Analyst time saved" value={homeStats.timeSaved} /></div>} />
      <div className="grid grid-cols-[1fr_320px] gap-3">
        <div className="flex flex-col gap-3">
          <Card title="Investigations by conclusion">
            <div className="flex items-center gap-6">
              <Donut />
              <div className="flex flex-col gap-1">
                {(Object.keys(homeStats.byVerdict) as Verdict[]).map((k) => (
                  <div key={k} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: SHADE[k] }} />{k}<span className="ml-2 font-mono text-muted">{homeStats.byVerdict[k]}</span></div>
                ))}
              </div>
              <div className="flex h-24 flex-1 items-end gap-1.5 border-b border-line">
                {homeStats.perDay.map((n, i) => <div key={i} className="flex-1 rounded-t bg-ink-2" style={{ height: (n / max) * 100 + '%' }} title={n + ' investigations'} />)}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Card title="Top assets" right={<span className="text-muted">View all</span>}>
              <div className="flex flex-col gap-2">
                {homeStats.topAssets.map((a) => (
                  <div key={a.name} className="flex items-center gap-2"><span className="w-28 truncate font-mono">{a.name}</span><Bar pct={(a.n / 35) * 100} /><span className="w-6 text-right font-mono text-muted">{a.n}</span></div>
                ))}
              </div>
            </Card>
            <Card title="Response metrics" right={<span className="text-muted">View details</span>}>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="To detect" value={homeStats.response.detect} />
                <Stat label="To acknowledge" value={homeStats.response.acknowledge} />
                <Stat label="To investigate" value={homeStats.response.investigate} />
                <Stat label="To conclusion" value={homeStats.response.conclusion} />
              </div>
            </Card>
          </div>
        </div>
        <Card title="Unreviewed investigations" right={<Link to="/alerts" className="text-link">View all</Link>}>
          <div className="flex flex-col gap-2">
            {unreviewed.map((a) => (
              <Link key={a.id} to={'/alerts/' + a.id} className="no-underline">
                <Row className="flex-col items-stretch !gap-1">
                  <div className="flex items-center"><Chip tone={verdictTone(a.verdict)}>{a.verdict}</Chip><Chip className="ml-auto">{a.id}</Chip></div>
                  <div>{a.title}</div>
                  <Label>{a.time}</Label>
                </Row>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
