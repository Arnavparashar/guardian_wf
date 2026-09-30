import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { actions, incidents } from '../lib/mock'
import { useStore } from '../store'
import { Btn, Card, Chip, Input, KV, Label, PageHeader, Row, Stat, cx, severityTone } from '../components/ui'

export function Incidents() {
  return (
    <>
      <PageHeader title="Incidents" sub="Case queue. Every incident links back to its investigation and its report." right={<Btn variant="primary">New incident</Btn>} />
      <div className="flex flex-col gap-2">
        {incidents.map((i) => (
          <Link key={i.id} to={'/incidents/' + i.id} className="no-underline">
            <Row><span className="w-20 font-mono text-muted">{i.id}</span><span className="flex-1">{i.title}</span><Chip tone={severityTone(i.severity)}>{i.severity}</Chip><Chip>{i.status}</Chip><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-line font-mono text-[10px]">{i.owner}</span></Row>
          </Link>
        ))}
      </div>
    </>
  )
}

export function IncidentDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s } = useStore()
  const [tasks, setTasks] = useState([true, true, false, false])
  const labels = ['Verdict confirmed', 'Case created', 'Approve containment', 'Verify actions']
  return (
    <>
      <PageHeader title={id ?? 'INC-101'} sub="Guest device beaconing to C2" right={<><Chip tone="critical">CRITICAL</Chip><Chip tone="ai">In progress</Chip><Btn onClick={() => nav('/incidents/' + id + '/response')}>Response actions</Btn><Btn variant="primary" onClick={() => nav('/incidents/' + id + '/close')}>Resolve</Btn></>} />
      <div className="grid grid-cols-[1.4fr_1fr] gap-3">
        <div className="flex flex-col gap-3">
          <Card title="Summary">A guest-network device beaconed to two threat-intel-listed C2 IPs. Investigation INV-101 confirmed a true positive at 88% confidence. Approval status: <b>{s.approval}</b>.</Card>
          <Card title="Linked alerts"><Link to="/investigations/INV-101" className="text-link">INV-101 · Outbound scanning to TI-listed IPs</Link></Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card title="Tasks">
            {labels.map((l, i) => <label key={l} className="flex items-center gap-2 py-0.5"><input type="checkbox" checked={tasks[i]} onChange={() => setTasks((t) => t.map((v, j) => (j === i ? !v : v)))} />{l}</label>)}
          </Card>
          <Card title="Notifications">
            {['Teams channel', 'Slack channel'].map((n) => <div key={n} className="flex items-center gap-2 py-0.5"><i className="h-2 w-2 rounded-full bg-ink" />{n}</div>)}
            <div className="flex items-center gap-2 py-0.5 text-muted"><i className="h-2 w-2 rounded-full bg-line" />Paging (later)</div>
          </Card>
        </div>
      </div>
    </>
  )
}

// Simulated execution. In the PoC nothing runs; v2 hands these steps to a SOAR platform.
export function Response() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s } = useStore()
  const list = actions.filter((a) => s.selected.includes(a.id))
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= list.length * 2) return
    const t = setTimeout(() => setN((x) => x + 1), 1200)
    return () => clearTimeout(t)
  }, [n, list.length])
  const state = (i: number) => (n >= (i + 1) * 2 ? 'Done' : n >= i * 2 + 1 ? 'Running' : 'Queued')
  return (
    <>
      <PageHeader title="Response actions" sub={'Execution tracker · ' + id} right={<Chip tone="ai">Via SOAR hand-off (v2)</Chip>} />
      <div className="grid max-w-3xl gap-3">
        {list.map((a, i) => (
          <Card key={a.id}><div className="flex items-center gap-3"><b className="font-mono text-muted">{i + 1}</b><span className="flex-1">{a.text}</span><Chip tone={state(i) === 'Running' ? 'ai' : state(i) === 'Done' ? 'ok' : 'default'}>{state(i)}</Chip></div>
            <div className="mt-1 pl-6 text-muted">{state(i) === 'Done' ? 'Verified: change applied and confirmed' : state(i) === 'Running' ? 'Verification pending' : 'Starts after the previous step'}</div></Card>
        ))}
        {list.length === 0 && <div className="text-muted">No approved actions yet. Approve actions first.</div>}
        <div className="flex gap-2"><Chip>Rollback ready</Chip><Chip tone="ok">Audit entry written</Chip><Chip>Teams updated</Chip></div>
        <div className="flex"><Btn>Roll back step</Btn><Btn variant="primary" className="ml-auto" onClick={() => nav('/incidents/' + id)}>Open incident</Btn></div>
      </div>
    </>
  )
}

export function Resolution() {
  const { id } = useParams()
  const nav = useNavigate()
  const { d } = useStore()
  const [outcome, setOutcome] = useState('True positive, contained')
  const [fb, setFb] = useState('Verdict was correct')
  const [note, setNote] = useState('')
  const opts = ['True positive, contained', 'False positive', 'Benign true positive', 'Duplicate']
  const close = () => { d({ type: 'log', actor: 'Analyst', text: 'Closed ' + id + ': ' + outcome + '. AI feedback: ' + fb }); nav('/incidents/' + id + '/report') }
  return (
    <>
      <PageHeader title="Resolution" sub={id} />
      <div className="grid max-w-3xl gap-3">
        <Card title="Outcome"><div className="flex flex-wrap gap-2">{opts.map((o) => <button key={o} onClick={() => setOutcome(o)} className={cx('rounded border px-2 py-0.5 font-mono text-[10px]', outcome === o ? 'border-accent bg-accent text-on-accent' : 'border-line-strong')}>{o}</button>)}</div></Card>
        <Card title="Actions verified">{['IP blocked', 'Host isolated', 'Guest VLAN sweep reviewed'].map((t, i) => <label key={t} className="flex items-center gap-2 py-0.5"><input type="checkbox" defaultChecked={i < 2} />{t}</label>)}</Card>
        <Card title="Lessons learned"><Input className="w-full" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a short note" /></Card>
        <Card title="Feedback to the AI"><div className="flex flex-wrap gap-2">{['Verdict was correct', 'Verdict was wrong', 'Actions helped'].map((o) => <button key={o} onClick={() => setFb(o)} className={cx('rounded border px-2 py-0.5 font-mono text-[10px]', fb === o ? 'border-accent bg-accent text-on-accent' : 'border-line-strong')}>{o}</button>)}</div></Card>
        <div className="flex"><Btn>Reopen</Btn><Btn variant="primary" className="ml-auto" onClick={close}>Close incident</Btn></div>
      </div>
    </>
  )
}

export function Report() {
  const { id } = useParams()
  const secs = ['Executive summary', 'Timeline', 'Root cause', 'Impact', 'Response', 'Recommendations']
  return (
    <>
      <PageHeader title={'Post-incident report · ' + id} right={<><Btn>Export PDF</Btn><Btn>Share</Btn><Btn variant="primary">Publish to Reports</Btn></>} />
      <div className="grid grid-cols-[1fr_200px] gap-3">
        <Card><div className="grid grid-cols-2 gap-6">{secs.map((t) => <div key={t}><Label>{t}</Label><p className="mt-1 text-muted">Generated from the investigation history and the analyst decisions. Edit before publishing.</p></div>)}</div></Card>
        <Card title="Metrics"><div className="flex flex-col gap-3"><Stat label="MTTD" value="##m" /><Stat label="MTTR" value="##m" /><Stat label="AI-assisted steps" value="##" /><Chip tone="ai">Recommendations go to Detection eng.</Chip></div></Card>
      </div>
    </>
  )
}
