import { Link, useNavigate, useParams } from 'react-router-dom'
import { alerts } from '../lib/mock'
import { Bar, Btn, Card, Chip, KV, PageHeader, severityTone, verdictTone } from '../components/ui'

export default function AlertDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const a = alerts.find((x) => x.id === id) ?? alerts[0]
  return (
    <>
      <PageHeader title={a.title} sub={a.id + ' · ' + a.source + ' · ' + a.time}
        right={<><Chip tone={severityTone(a.severity)}>{a.severity}</Chip><Chip tone={verdictTone(a.verdict)}>{a.verdict}</Chip><Btn variant="primary" onClick={() => nav('/investigations/' + a.id + '/run')}>Investigate with AI</Btn></>} />
      <div className="grid grid-cols-[1.6fr_1fr] gap-3">
        <div className="flex flex-col gap-3">
          <Card title="AI triage summary" ai>
            <div className="mb-2 flex items-center gap-3"><Chip tone="ai">{a.verdict}</Chip><div className="w-40"><Bar pct={a.confidence} /></div><span className="font-mono text-muted">{a.confidence}% confidence</span></div>
            <ul className="m-0 list-none space-y-1 p-0">
              {['Outbound UDP to a TI-listed IP', 'Host sits on the guest Wi-Fi segment', 'No prior baseline for this destination'].map((t) => <li key={t}>✓ {t}</li>)}
            </ul>
          </Card>
          <Card title="Alert">
            <KV k="Rule" v={<span className="font-mono">{a.rule}</span>} />
            <KV k="Entities" v={<span className="font-mono">{a.entities.join(' · ')}</span>} />
            <KV k="Priority" v="High, AI-ranked" />
          </Card>
          <Card title="Raw event">
            <pre className="m-0 overflow-auto font-mono text-[11px] text-muted">{JSON.stringify({ src: a.entities[0], dst: a.entities[1] ?? null, proto: 'udp', action: 'deny', zone: 'guest-wifi' }, null, 2)}</pre>
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card title="Related alerts">
            {alerts.filter((x) => x.id !== a.id).slice(0, 3).map((x) => (
              <Link key={x.id} to={'/alerts/' + x.id} className="flex items-center gap-2 py-1 text-ink no-underline"><Chip tone={severityTone(x.severity)}>{x.severity}</Chip><span className="truncate">{x.title}</span></Link>
            ))}
          </Card>
          <Card title="Threat intel">
            {a.entities.slice(1).map((e) => <div key={e} className="flex items-center gap-2 py-1"><span className="flex-1 font-mono">{e}</span><Chip tone="critical">malicious</Chip></div>)}
            <div className="mt-2 text-muted">Source detail and freshness shown on hover.</div>
          </Card>
        </div>
      </div>
    </>
  )
}
