import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { Btn, Card, Chip, Input, PageHeader, cx } from '../components/ui'

const STEPS = ['Plan', 'Collect', 'Correlate', 'Hypothesize', 'Verdict']
const LOG = ['plan.create · 5 steps', 'siem.search · src=10.0.0.100', 'ti.lookup · 175.107.208.219', 'edr.process_tree · host', 'graph.recall · similar cases', 'ndr.flow_query · guest VLAN']

// Simulated live run. Replace the timer with a stream (SSE / websocket) from the Investigation agent.
export default function InvestigationRun() {
  const { id } = useParams()
  const nav = useNavigate()
  const { d } = useStore()
  const [n, setN] = useState(1)
  const [paused, setPaused] = useState(false)
  const [note, setNote] = useState('')
  const done = n >= LOG.length

  useEffect(() => {
    if (paused || done) return
    const t = setTimeout(() => setN((x) => x + 1), 1100)
    return () => clearTimeout(t)
  }, [n, paused, done])

  const stepIdx = done ? STEPS.length : Math.min(STEPS.length - 1, Math.floor((n / LOG.length) * STEPS.length))
  const steer = (e: FormEvent) => { e.preventDefault(); if (!note.trim()) return; d({ type: 'log', actor: 'Analyst', text: 'Steered: ' + note }); setNote('') }

  return (
    <>
      <PageHeader title={'AI investigation · ' + id} sub="Read-only, bounded tool budget. The analyst can steer or pause at any time."
        right={<><Chip tone="ok">Read-only</Chip><Chip tone={done ? 'ok' : 'ai'}>{done ? 'Complete' : paused ? 'Paused' : 'Streaming live'}</Chip></>} />
      <div className="mb-3 flex items-center gap-2">
        {STEPS.map((s, i) => <Chip key={s} tone={i < stepIdx ? 'ok' : i === stepIdx ? 'ai' : 'default'}>{i + 1} {s}{i < stepIdx ? ' ✓' : ''}</Chip>)}
      </div>
      <div className="grid grid-cols-[1fr_280px] gap-3">
        <Card title="Live agent log" ai>
          <div className="space-y-1 font-mono text-[12px]">
            {LOG.map((l, i) => (
              <div key={l} className={cx(i >= n && 'opacity-40')}>&gt; {l} {i < n - 1 || done ? '✓' : i === n - 1 ? 'running' : 'queued'}</div>
            ))}
          </div>
        </Card>
        <Card title="Steer the AI">
          <form onSubmit={steer} className="flex flex-col gap-2">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an instruction" />
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Stay read-only</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Ask before a new data source</label>
            <Btn type="submit">Send instruction</Btn>
            <Btn type="button" onClick={() => setPaused((p) => !p)} disabled={done}>{paused ? 'Resume' : 'Pause'}</Btn>
            <Btn type="button" variant="primary" onClick={() => nav('/investigations/' + id)}>Open workspace</Btn>
          </form>
        </Card>
      </div>
    </>
  )
}
