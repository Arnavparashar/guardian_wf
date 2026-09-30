import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { actions, alerts, entities, evidence, graph, hypotheses, timeline, toolCalls } from '../lib/mock'
import { useStore } from '../store'
import EntityGraph from '../components/EntityGraph'
import { Bar, Btn, Card, Chip, Input, KV, Label, Row, Tabs, cx, severityTone, verdictTone } from '../components/ui'

type Tab = 'timeline' | 'evidence' | 'graph' | 'related'
const DECISIONS = ['Agree', 'Override', 'Need more evidence'] as const

// The centerpiece: alert context, entities, timeline, evidence, graph, AI analysis, tool calls,
// recommended actions, analyst decision and the full history strip.
export default function Workspace() {
  const { id = 'INV-101' } = useParams()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'timeline'
  const { s, d } = useStore()
  const a = alerts.find((x) => x.id === id) ?? alerts[0]
  const [node, setNode] = useState('host')
  const [choice, setChoice] = useState<(typeof DECISIONS)[number] | ''>('')
  const [why, setWhy] = useState('')
  const sel = graph.nodes.find((n) => n.id === node)!

  const submit = () => {
    if (!choice) return
    d({ type: 'decide', value: choice })
    d({ type: 'log', actor: 'Analyst', text: choice + (why ? ': ' + why : '') })
    setWhy('')
  }
  const sendForApproval = () => {
    d({ type: 'setApproval', value: 'pending' })
    d({ type: 'log', actor: 'Analyst', text: 'Sent ' + s.selected.length + ' action(s) for approval' })
    nav('/approvals/' + id)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted">Investigations /</span>
        <h1 className="m-0 text-[16px] font-bold">{a.id} · {a.title}</h1>
        <Chip tone={severityTone(a.severity)}>{a.severity}</Chip><Chip tone="ai">AI investigating</Chip>
        <div className="ml-auto flex items-center gap-2">
          <Btn>Pause AI</Btn><Btn>Add note</Btn><Btn>Escalate Tier-2</Btn>
          <Btn variant="primary" onClick={() => nav('/investigations/' + id + '/findings')}>Generate findings</Btn>
        </div>
      </div>

      <div className="grid grid-cols-[300px_minmax(0,1fr)_360px] gap-3">
        {/* left */}
        <div className="flex flex-col gap-3">
          <Card title="Alert context">
            <KV k="Rule" v={<span className="font-mono">{a.rule}</span>} /><KV k="Source" v={a.source} />
            <KV k="Severity" v={<Chip tone={severityTone(a.severity)}>{a.severity}</Chip>} />
            <KV k="Triage verdict" v={<Chip tone={verdictTone(a.verdict)}>{a.verdict}</Chip>} />
          </Card>
          <Card title="Affected entities">
            <div className="flex flex-col gap-2">
              {entities.map((e) => (
                <Row key={e.name}><div className="min-w-0 flex-1"><div className="truncate font-mono">{e.name}</div><div className="truncate text-[11px] text-muted">{e.sub}</div></div><div className="w-14"><Bar pct={e.risk} /></div><Chip tone={e.level === 'High' ? 'critical' : 'default'}>{e.level}</Chip></Row>
              ))}
            </div>
          </Card>
          <Card title="Related events">
            {['Same host · last 24h', 'Same IOC across tenant', 'Same segment · 7d', 'Similar past cases (graph recall)'].map((t) => <Row key={t} className="mb-1.5">{t}<span className="ml-auto text-muted">›</span></Row>)}
          </Card>
        </div>

        {/* center */}
        <div className="flex min-w-0 flex-col gap-3">
          <Tabs<Tab> value={tab} onChange={(t) => setParams({ tab: t })} tabs={[
            { id: 'timeline', label: 'Timeline' }, { id: 'evidence', label: 'Evidence' }, { id: 'graph', label: 'Entity graph' }, { id: 'related', label: 'Related events' },
          ]} />
          {tab === 'timeline' && (
            <Card title="Timeline · AI-annotated">
              {timeline.map((e) => (
                <div key={e.t} className="flex items-start gap-3 border-b border-line py-2 last:border-0">
                  <span className="w-12 flex-none font-mono text-muted">{e.t}</span><i className="mt-1 h-2 w-2 flex-none rounded-full bg-ink-2" />
                  <div className="flex-1"><div>{e.text}</div><div className="text-ink-2">{e.note}</div></div>
                  <Chip>{e.source}</Chip>{e.technique && <Chip tone="ai">{e.technique}</Chip>}
                </div>
              ))}
            </Card>
          )}
          {tab === 'evidence' && (
            <Card title="Evidence · pinned and cited">
              <div className="flex flex-col gap-2">
                {evidence.map((e) => (
                  <Row key={e.id} selected={s.pinned.includes(e.id)}>
                    <div className="min-w-0 flex-1"><div className="truncate">{e.title}</div><div className="truncate font-mono text-[11px] text-muted">{e.detail}</div></div>
                    <Chip>{e.source}</Chip><Chip tone={e.by === 'AI' ? 'ai' : 'note'}>{e.by}</Chip><div className="w-16"><Bar pct={e.relevance} /></div>
                    <Btn className="!h-6" onClick={() => d({ type: 'pin', id: e.id })}>{s.pinned.includes(e.id) ? 'Pinned' : 'Pin'}</Btn>
                  </Row>
                ))}
              </div>
            </Card>
          )}
          {tab === 'graph' && (
            <div className="grid grid-cols-[1fr_230px] gap-3">
              <Card className="h-[340px]"><EntityGraph selected={node} onSelect={setNode} /></Card>
              <Card title="Node inspector">
                <div className="mb-2 font-mono text-[14px] font-semibold">{sel.label}</div>
                <KV k="Type" v={sel.kind} /><KV k="Risk" v={<Chip tone={sel.risk === 'High' ? 'critical' : 'default'}>{sel.risk}</Chip>} />
                <div className="mt-3 flex flex-wrap gap-2"><Btn>Pivot: hunt</Btn><Btn>Add to case</Btn></div>
              </Card>
            </div>
          )}
          {tab === 'related' && (
            <Card title="Related events">
              {alerts.map((x) => <Row key={x.id} className="mb-1.5"><Chip tone={severityTone(x.severity)}>{x.severity}</Chip>{x.title}<span className="ml-auto text-muted">{x.time}</span></Row>)}
            </Card>
          )}
        </div>

        {/* right */}
        <div className="flex flex-col gap-3">
          <Card title="AI analysis" ai>
            <div className="flex flex-col gap-2">
              {hypotheses.map((h) => (
                <div key={h.id} className="flex items-center gap-2"><b className="font-mono">{h.id}</b><span className="flex-1">{h.text}</span><div className="w-14"><Bar pct={h.pct} /></div><Chip tone={h.status === 'Supported' ? 'ok' : 'default'}>{h.status}</Chip></div>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5"><Chip tone="ai">T1046</Chip><Chip tone="ai">T1571</Chip><Chip tone="ai">T1095</Chip></div>
            <div className="mt-2 text-muted">✓ Verdict gate: needs three independent evidence sources</div>
          </Card>
          <Card title="Tool calls · read-only">
            {toolCalls.map((t) => (
              <div key={t.name} className="flex items-center gap-2 border-b border-line py-1 last:border-0"><span className="w-28 font-mono">{t.name}</span><span className="flex-1 truncate text-muted">{t.args}</span><Chip tone={t.status === 'running' ? 'ai' : 'default'}>{t.status}</Chip></div>
            ))}
          </Card>
          <Card title="Recommended actions · ordered by reversibility">
            <div className="flex flex-col gap-2">
              {actions.map((x) => (
                <Row key={x.id} selected={s.selected.includes(x.id)} onClick={() => d({ type: 'toggleAction', id: x.id })}>
                  <input type="checkbox" readOnly checked={s.selected.includes(x.id)} aria-label={'Select action ' + x.id} />
                  <span className="flex-1">{x.text}</span><Chip tone="ai">{x.confidence}</Chip><Chip tone="ok">{x.reversible}</Chip>
                </Row>
              ))}
            </div>
            <div className="mt-2 flex"><Btn variant="primary" className="ml-auto" disabled={!s.selected.length} onClick={sendForApproval}>Send for approval</Btn></div>
          </Card>
          <Card title="Analyst decision">
            <div className="mb-2 flex flex-wrap gap-2">
              {DECISIONS.map((x) => <button key={x} onClick={() => setChoice(x)} className={cx('rounded border px-2 py-0.5 font-mono text-[10px]', choice === x ? 'border-accent bg-accent text-on-accent' : 'border-line-strong')}>{x}</button>)}
            </div>
            <Input className="w-full" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Add rationale (logged to history)" />
            <div className="mt-2 flex items-center"><span className="text-muted">{s.decision ? 'Last decision: ' + s.decision : ''}</span><Btn className="ml-auto" disabled={!choice} onClick={submit}>Submit decision</Btn></div>
          </Card>
        </div>
      </div>

      <Card title="Investigation history · every step, tool call and decision" right={<><Chip>Export audit trail</Chip><Chip>Replay investigation</Chip></>}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
          {s.history.map((h, i) => (
            <div key={i} className="flex items-center gap-2"><span className="w-12 font-mono text-muted">{h.t}</span><Chip tone={h.actor === 'AI' ? 'ai' : h.actor === 'Analyst' ? 'note' : 'default'}>{h.actor}</Chip><span className="truncate">{h.text}</span></div>
          ))}
        </div>
      </Card>
    </div>
  )
}
