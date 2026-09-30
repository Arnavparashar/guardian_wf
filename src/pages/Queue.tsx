import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { alerts, Verdict, QueueStatus } from '../lib/mock'
import { useStore } from '../store'
import { Btn, Card, Chip, Input, PageHeader, Tabs, cx, verdictTone } from '../components/ui'

type Tab = 'review' | 'reviewed' | 'all'
const VERDICTS: Verdict[] = ['Malicious', 'Suspicious', 'Inconclusive', 'Benign']

// Dropzone-style queue: verdict first, one row per alert, agent state (Queued / Running) at the right.
export default function Queue({ mode }: { mode: 'alerts' | 'investigations' }) {
  const nav = useNavigate()
  const { d } = useStore()
  const [tab, setTab] = useState<Tab>('review')
  const [verdict, setVerdict] = useState<Verdict | 'All'>('All')
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string[]>([])

  const rows = useMemo(() => alerts.filter((a) => {
    const t = tab === 'all' || (tab === 'review' ? a.status !== 'Reviewed' : a.status === 'Reviewed')
    const v = verdict === 'All' || a.verdict === verdict
    const s = !q || (a.title + a.rule + a.entities.join(' ')).toLowerCase().includes(q.toLowerCase())
    return t && v && s
  }), [tab, verdict, q])

  const count = (s: QueueStatus) => alerts.filter((a) => a.status === s).length
  const open = (id: string) => nav((mode === 'alerts' ? '/alerts/' : '/investigations/') + id)
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <>
      <PageHeader title={mode === 'alerts' ? 'Alerts' : 'Investigations'} sub="Every alert gets an AI investigation. Analysts review the conclusions."
        right={<><Chip>Queued {count('Queued')}</Chip><Chip tone="ai">Running {count('Running')}</Chip></>} />
      <Tabs<Tab> value={tab} onChange={setTab} tabs={[
        { id: 'review', label: 'In review ' + alerts.filter((a) => a.status !== 'Reviewed').length },
        { id: 'reviewed', label: 'Reviewed ' + count('Reviewed') },
        { id: 'all', label: 'All ' + alerts.length },
      ]} />
      <div className="my-3 flex flex-wrap items-center gap-2">
        <select value={verdict} onChange={(e) => setVerdict(e.target.value as Verdict | 'All')} className="h-7 rounded border border-line bg-surface px-2 text-ink" aria-label="Conclusion filter">
          <option value="All">Conclusion: All</option>
          {VERDICTS.map((v) => <option key={v}>{v}</option>)}
        </select>
        <Input className="w-64" placeholder="Search alert, rule or entity" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="ml-auto text-muted">{rows.length} shown</span>
      </div>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-header text-[10px] uppercase tracking-[0.1em] text-muted">
              <th className="w-8 p-2" /><th className="p-2">Conclusion</th><th className="p-2">Alert time</th><th className="p-2">ID</th>
              <th className="p-2">Alert</th><th className="p-2">Entities</th><th className="p-2">Source</th><th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} onClick={() => open(a.id)} className={cx('cursor-pointer border-b border-line hover:bg-sel', picked.includes(a.id) && 'bg-sel')}>
                <td className="p-2" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} aria-label={'Select ' + a.id} /></td>
                <td className="p-2"><Chip tone={verdictTone(a.verdict)}>{a.verdict}</Chip></td>
                <td className="p-2 text-muted">{a.time}</td>
                <td className="p-2"><Chip>{a.id}</Chip></td>
                <td className="p-2"><div>{a.title}</div><div className="font-mono text-[10px] text-muted">{a.rule}</div>{a.tag && <Chip className="mt-1">{a.tag}</Chip>}</td>
                <td className="p-2 font-mono text-[11px]">{a.entities.slice(0, 2).map((e) => <div key={e}>{e}</div>)}{a.entities.length > 2 && <div className="text-muted">+{a.entities.length - 2} more</div>}</td>
                <td className="p-2 text-muted">{a.source}</td>
                <td className="p-2"><Chip tone={a.status === 'Running' ? 'ai' : 'default'}>{a.status}</Chip></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted">Nothing matches these filters.</td></tr>}
          </tbody>
        </table>
      </Card>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-surface-2 p-2">
        <span className="text-muted">{picked.length} selected. Investigations start automatically when an alert lands.</span>
        <Btn className="ml-auto" disabled={!picked.length} onClick={() => { picked.forEach((id) => d({ type: 'log', actor: 'Analyst', text: 'Marked ' + id + ' reviewed' })); setPicked([]) }}>Mark reviewed</Btn>
        <Btn variant="primary" disabled={!picked.length} onClick={() => nav('/investigations/' + picked[0])}>Open investigation</Btn>
      </div>
    </>
  )
}
