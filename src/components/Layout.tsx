import { FormEvent, useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Bell, Search, FolderOpen, Crosshair, ShieldCheck, Brain, Plug, FileText, Settings as Cog, Sun, Moon, X } from 'lucide-react'
import { useStore } from '../store'
import FlowStepper from './FlowStepper'
import { Btn, Chip, Input, cx } from './ui'

const NAV = [
  { to: '/home', label: 'Home', icon: LayoutDashboard },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/investigations', label: 'Investigations', icon: Search },
  { to: '/incidents', label: 'Incidents', icon: FolderOpen },
  { to: '/hunts', label: 'Threat hunting', icon: Crosshair },
  { to: '/detections', label: 'Detection eng.', icon: ShieldCheck },
  { to: '/context-memory', label: 'Context memory', icon: Brain },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Cog },
]

function AskDrawer({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<{ who: 'you' | 'guardian'; text: string }[]>([
    { who: 'guardian', text: 'Ask about an alert, an entity or an incident.' },
  ])
  const [q, setQ] = useState('')
  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    setMsgs((m) => [...m, { who: 'you', text: q }, { who: 'guardian', text: 'Placeholder reply. Connect this box to the orchestrator API.' }])
    setQ('')
  }
  return (
    <aside className="flex w-80 flex-none flex-col border-l border-line bg-surface">
      <div className="flex items-center border-b border-line bg-header px-3 py-2 font-semibold">
        Ask Guardian
        <button aria-label="Close" onClick={onClose} className="ml-auto text-muted"><X size={14} /></button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3">
        {msgs.map((m, i) => (
          <div key={i} className={cx('max-w-[90%] rounded-md border px-2 py-1.5', m.who === 'you' ? 'self-end border-accent bg-sel' : 'self-start border-dashed border-ink-2')}>{m.text}</div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
        <Input className="flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question" />
        <Btn variant="primary" type="submit">Send</Btn>
      </form>
    </aside>
  )
}

export default function Layout() {
  const { s, d } = useStore()
  const [ask, setAsk] = useState(false)
  return (
    <div className="flex h-full">
      <aside className="flex w-[190px] flex-none flex-col border-r border-line bg-surface-2 p-3">
        <Link to="/home" className="mb-4 block text-[18px] font-bold tracking-[0.16em] text-ink no-underline">GUARDIAN</Link>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cx('flex items-center gap-2 rounded px-2 py-1.5 no-underline', isActive ? 'bg-sel font-semibold text-ink' : 'text-ink-2 hover:bg-sel')}>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto text-[11px] text-muted">Actions need a signed human approval.</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-line bg-header px-4 py-2">
          <Input className="max-w-md flex-1" placeholder="Search (Ctrl+E)" />
          <Btn variant="primary" onClick={() => setAsk(true)}>Ask Guardian</Btn>
          <Chip>client-01</Chip>
          <Btn onClick={() => d({ type: 'flow' })}>{s.showFlow ? 'Hide' : 'Show'} flow</Btn>
          <Btn aria-label="Toggle theme" onClick={() => d({ type: 'theme' })}>{s.theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}</Btn>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-line font-mono text-[10px]">AS</span>
        </header>
        {s.showFlow && <FlowStepper />}
        <main className="min-h-0 flex-1 overflow-auto p-4"><Outlet /></main>
      </div>
      {ask && <AskDrawer onClose={() => setAsk(false)} />}
    </div>
  )
}
