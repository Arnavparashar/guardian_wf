import { FormEvent, useState } from 'react'
import { detections, hunts, integrations, memory, reportLibrary } from '../lib/mock'
import { useStore } from '../store'
import { Btn, Card, Chip, Input, Label, PageHeader, Row, Tabs, cx } from '../components/ui'

export function Hunts() {
  const [tab, setTab] = useState<'hypothesis' | 'ioc' | 'saved'>('hypothesis')
  return (
    <>
      <PageHeader title="Threat hunting" sub="Proactive only. Per-alert IOC sweeps belong to Investigation." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'hypothesis', label: 'Hypothesis hunt' }, { id: 'ioc', label: 'IOC sweep' }, { id: 'saved', label: 'Saved hunts' }]} />
      <div className="my-3 flex gap-2"><Input className="flex-1" defaultValue="Hypothesis: lateral movement from the guest VLAN" /><Btn variant="primary">Run hunt</Btn></div>
      <Card ai className="mb-3">AI plan: three read-only queries across SIEM and EDR.</Card>
      <div className="flex flex-col gap-2">{hunts.map((h) => <Row key={h.q}><span className="flex-1">{h.q}</span><span className="font-mono text-muted">{h.hits} hits</span><Chip tone={h.status === 'Running' ? 'ai' : 'default'}>{h.status}</Chip></Row>)}</div>
      <div className="mt-3 flex items-center"><span className="text-muted">Hunt hits become alerts.</span><Btn variant="primary" className="ml-auto">Promote to investigation</Btn></div>
    </>
  )
}

export function Detections() {
  return (
    <>
      <PageHeader title="Detection engineering" />
      <div className="grid grid-cols-[1fr_320px] gap-3">
        <div className="flex flex-col gap-3">
          <Card title="Rules"><div className="flex flex-col gap-2">{detections.map((r) => <Row key={r.name}><span className="flex-1">{r.name}</span><Chip tone={r.status === 'Enabled' ? 'ok' : 'default'}>{r.status}</Chip></Row>)}</div></Card>
          <Card title="ATT&CK coverage"><div className="grid grid-cols-10 gap-1">{Array.from({ length: 40 }, (_, i) => <i key={i} className="h-3 rounded-sm" style={{ background: ['var(--line)', 'var(--ink-2)', 'var(--muted)'][(i * 7 + Math.floor(i / 5)) % 3] }} />)}</div></Card>
        </div>
        <Card title="AI-suggested rule" ai>
          <pre className="m-0 font-mono text-[11px]">{'title: guest scan then C2\nlogsource: firewall\ndetection:\n  udp deny to ti_c2_list'}</pre>
          <div className="mt-3 flex gap-2"><Btn>Test on history</Btn><Btn variant="primary">Deploy</Btn></div>
        </Card>
      </div>
    </>
  )
}

export function Integrations() {
  return (
    <>
      <PageHeader title="Integrations" right={<Chip tone="ok">Read-only by default</Chip>} />
      <div className="grid grid-cols-3 gap-3">
        {integrations.map((i) => (
          <Card key={i.name}><div className="flex items-center"><b>{i.name}</b><Chip tone={i.status === 'Connected' ? 'ok' : 'default'} className="ml-auto">{i.status}</Chip></div><div className="my-1 text-muted">{i.kind}</div><Btn>{i.status === 'Connected' ? 'Configure' : i.status === 'Later' ? 'Plan' : 'Connect'}</Btn></Card>
        ))}
      </div>
    </>
  )
}

export function Reports() {
  return (
    <>
      <PageHeader title="Reports" right={<Btn variant="primary">New report</Btn>} />
      <div className="flex max-w-2xl flex-col gap-2">{reportLibrary.map((r) => <Row key={r.name}><span className="flex-1">{r.name}</span><Chip>{r.cadence}</Chip><span className="text-muted">›</span></Row>)}</div>
    </>
  )
}

export function Settings() {
  const [mode, setMode] = useState('Recommend')
  const modes = [['Observe', 'AI triages and investigates, no suggestions'], ['Recommend', 'AI proposes actions, analysts decide'], ['Act with approval', 'Actions run after a signed approval']]
  return (
    <>
      <PageHeader title="Settings" sub="Autonomy level" />
      <div className="flex max-w-2xl flex-col gap-2">
        {modes.map(([n, dsc]) => (
          <Row key={n} selected={mode === n} onClick={() => setMode(n)}><input type="radio" readOnly checked={mode === n} aria-label={n} /><div><b>{n}</b><div className="text-muted">{dsc}</div></div></Row>
        ))}
        <label className="mt-2 flex items-center gap-2"><input type="checkbox" defaultChecked /> Two-person rule for disruptive actions</label>
        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Log every AI tool call to the audit trail</label>
      </div>
    </>
  )
}

export function ContextMemory() {
  const { d } = useStore()
  const [items, setItems] = useState(memory)
  const [txt, setTxt] = useState('')
  const add = (e: FormEvent) => {
    e.preventDefault()
    if (!txt.trim()) return
    setItems((m) => [{ id: m[0].id + 1, updated: 'Today', content: txt, type: 'User submission', ref: 'admin' }, ...m])
    d({ type: 'log', actor: 'Analyst', text: 'Added a context memory item' })
    setTxt('')
  }
  return (
    <>
      <PageHeader title="Context memory" sub="Facts learned from past investigations and added by analysts. Triage and Investigation read them." />
      <form onSubmit={add} className="mb-3 flex gap-2"><Input className="flex-1" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Add a fact the AI should know" /><Btn variant="primary" type="submit">+ Create new item</Btn></form>
      <Card className="!p-0 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead><tr className="border-b border-line bg-header text-[10px] uppercase tracking-[0.1em] text-muted"><th className="p-2">ID</th><th className="p-2">Updated</th><th className="p-2">Content</th><th className="p-2">Source</th></tr></thead>
          <tbody>{items.map((m) => <tr key={m.id} className="border-b border-line"><td className="p-2 font-mono text-muted">{m.id}</td><td className="p-2 text-muted">{m.updated}</td><td className="p-2">{m.content}</td><td className="p-2"><Chip>{m.type}</Chip> <Chip>{m.ref}</Chip></td></tr>)}</tbody>
        </table>
      </Card>
    </>
  )
}
