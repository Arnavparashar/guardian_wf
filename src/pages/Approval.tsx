import { useNavigate, useParams } from 'react-router-dom'
import { actions } from '../lib/mock'
import { useStore } from '../store'
import { Btn, Card, Chip, PageHeader } from '../components/ui'

export default function Approval() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, d } = useStore()
  const list = actions.filter((a) => s.selected.includes(a.id))
  const approve = () => { d({ type: 'setApproval', value: 'approved' }); d({ type: 'log', actor: 'Analyst', text: 'Approved ' + list.length + ' action(s)' }); nav('/incidents/INC-101/response') }
  const reject = () => { d({ type: 'setApproval', value: 'rejected' }); d({ type: 'log', actor: 'Analyst', text: 'Rejected the action set, back to workspace' }); nav('/investigations/' + id) }
  return (
    <>
      <PageHeader title={'Approval request · ' + id} right={<Chip tone="ai">{s.approval === 'pending' ? 'Awaiting SOC lead' : s.approval}</Chip>} />
      <div className="grid max-w-4xl gap-3">
        <Card title="Actions to approve">
          {list.length === 0 && <div className="text-muted">No actions selected. Pick actions in the workspace first.</div>}
          <div className="flex flex-col gap-2">
            {list.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-md border border-line bg-surface px-3 py-2">
                <span className="flex-1">{a.text}</span><Chip tone={a.risk === 'Med' ? 'high' : 'default'}>Risk {a.risk}</Chip><Chip tone="ok">{a.reversible}</Chip><Chip>Approval: {a.approval}</Chip>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Predicted impact" ai>Blast radius: guest VLAN only. Rollback is available for every action.</Card>
        <div className="text-muted">Human in the loop: nothing executes without a signed approval decision, and every decision is audited. In the PoC this hands off to a SOAR platform in v2.</div>
        <div className="flex gap-2"><Btn onClick={reject}>Reject</Btn><Btn>Approve with edits</Btn><Btn variant="primary" className="ml-auto" disabled={!list.length} onClick={approve}>Approve</Btn></div>
      </div>
    </>
  )
}
