import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { Bar, Btn, Card, Chip, Label, PageHeader } from '../components/ui'

export default function Findings() {
  const { id } = useParams()
  const nav = useNavigate()
  const { d } = useStore()
  return (
    <>
      <PageHeader title={'AI findings · ' + id} right={<><Chip tone="critical">TRUE POSITIVE</Chip><Chip tone="ok">Evidence-backed</Chip></>} />
      <div className="grid max-w-4xl gap-3">
        <Card title="What happened">
          <p className="m-0 leading-5">A guest-network device scanned the internal subnet and then sent outbound UDP traffic to two destinations that threat intel lists as C2 infrastructure. The traffic used a non-standard port at a steady cadence. Blast radius is limited to the guest VLAN so far.</p>
          <div className="mt-3 flex items-center gap-3"><Label>Confidence</Label><div className="w-40"><Bar pct={88} /></div><span className="font-mono">88%</span></div>
        </Card>
        <Card title="Verdict gate · code overrides the LLM" ai>
          <ul className="m-0 list-none space-y-1 p-0">
            {['Three or more independent evidence sources', 'Threat intel corroborates the destination', 'No contradicting evidence found'].map((t) => <li key={t}>✓ {t}</li>)}
          </ul>
          <div className="mt-2"><Chip tone="ok">Gate passed</Chip></div>
          <div className="mt-2 text-muted">If evidence is insufficient the verdict reads Undetermined and the case escalates to Tier-2 with a parent job link.</div>
        </Card>
        <Card title="Scope">
          <div className="flex flex-wrap gap-2"><Chip>Guest VLAN</Chip><Chip>2 IOCs</Chip><Chip tone="ai">T1046</Chip><Chip tone="ai">T1095</Chip><Chip tone="ai">T1571</Chip></div>
        </Card>
        <div className="flex">
          <Btn onClick={() => nav('/investigations/' + id)}>Return to workspace</Btn>
          <Btn variant="primary" className="ml-auto" onClick={() => { d({ type: 'setApproval', value: 'pending' }); d({ type: 'log', actor: 'Analyst', text: 'Requested approval from findings' }); nav('/approvals/' + id) }}>Request approval</Btn>
        </div>
      </div>
    </>
  )
}
