import { Link, useLocation } from 'react-router-dom'
import { cx } from './ui'

// The 15 steps of the Guardian flow map. Shows where the current screen sits in the flow.
export const STEPS = [
  ['01', 'Login'], ['02', 'Home'], ['03', 'Alert triage'], ['04', 'Alert details'], ['05', 'AI investigation'],
  ['06', 'Workspace'], ['07', 'Evidence'], ['08', 'Timeline'], ['09', 'Entity graph'], ['10', 'AI findings'],
  ['11', 'Approval'], ['12', 'Response'], ['13', 'Incident'], ['14', 'Resolution'], ['15', 'Report'],
] as const

export function stepFor(path: string, search: string): string {
  const tab = new URLSearchParams(search).get('tab')
  if (path === '/login') return '01'
  if (path === '/home') return '02'
  if (path === '/alerts') return '03'
  if (/^\/alerts\/[^/]+$/.test(path)) return '04'
  if (/^\/investigations\/[^/]+\/run$/.test(path)) return '05'
  if (/^\/investigations\/[^/]+\/findings$/.test(path)) return '10'
  if (/^\/investigations\/[^/]+$/.test(path)) return tab === 'evidence' ? '07' : tab === 'timeline' ? '08' : tab === 'graph' ? '09' : '06'
  if (path.startsWith('/approvals/')) return '11'
  if (/^\/incidents\/[^/]+\/response$/.test(path)) return '12'
  if (/^\/incidents\/[^/]+\/close$/.test(path)) return '14'
  if (/^\/incidents\/[^/]+\/report$/.test(path)) return '15'
  if (/^\/incidents\/[^/]+$/.test(path)) return '13'
  return ''
}

const TARGETS: Record<string, string> = {
  '02': '/home', '03': '/alerts', '04': '/alerts/INV-101', '05': '/investigations/INV-101/run', '06': '/investigations/INV-101',
  '07': '/investigations/INV-101?tab=evidence', '08': '/investigations/INV-101?tab=timeline', '09': '/investigations/INV-101?tab=graph',
  '10': '/investigations/INV-101/findings', '11': '/approvals/INV-101', '12': '/incidents/INC-101/response',
  '13': '/incidents/INC-101', '14': '/incidents/INC-101/close', '15': '/incidents/INC-101/report',
}

export default function FlowStepper() {
  const { pathname, search } = useLocation()
  const cur = stepFor(pathname, search)
  return (
    <nav aria-label="Flow position" className="flex items-center gap-1 overflow-x-auto border-b border-line bg-header px-4 py-1.5">
      {STEPS.map(([n, label]) => {
        const to = TARGETS[n]
        const cls = cx('whitespace-nowrap rounded border px-1.5 font-mono text-[10px] leading-4', cur === n ? 'border-accent bg-accent text-on-accent' : 'border-line text-muted')
        return to ? <Link key={n} to={to} className={cls}>{n} {label}</Link> : <span key={n} className={cls}>{n} {label}</span>
      })}
    </nav>
  )
}
