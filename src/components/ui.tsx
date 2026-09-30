import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')

export type Tone = 'default' | 'critical' | 'high' | 'ai' | 'ok' | 'note'
const tones: Record<Tone, string> = {
  default: 'border-line-strong text-ink-2 bg-surface',
  critical: 'bg-accent text-on-accent border-accent',
  high: 'border-ink text-ink font-semibold bg-surface',
  ai: 'border-dashed border-ink-2 text-ink bg-surface',
  ok: 'border-ink-2 text-ink bg-bg',
  note: 'bg-sel border-ink-2 text-ink',
}

export function Chip({ tone = 'default', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex items-center whitespace-nowrap rounded border px-1.5 font-mono text-[10px] leading-4', tones[tone], className)}>{children}</span>
}

export const verdictTone = (v: string): Tone =>
  v === 'Malicious' ? 'critical' : v === 'Suspicious' ? 'high' : v === 'Inconclusive' ? 'ai' : 'ok'
export const severityTone = (s: string): Tone =>
  s === 'CRITICAL' ? 'critical' : s === 'HIGH' ? 'high' : 'default'

export function Btn({ variant = 'ghost', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  return (
    <button
      {...p}
      className={cx(
        'inline-flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 text-[11px] font-medium disabled:opacity-40',
        variant === 'primary' ? 'border border-accent bg-accent text-on-accent' : 'border border-line-strong bg-transparent text-ink hover:bg-sel',
        className,
      )}
    />
  )
}

export function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={cx('h-7 min-w-0 rounded border border-line bg-surface px-2 text-[12px] text-ink placeholder:text-muted outline-none focus:border-ink', p.className)} />
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('text-[10px] font-semibold uppercase leading-[14px] tracking-[0.1em] text-muted', className)}>{children}</div>
}

export function Card({ title, right, ai, children, className }: { title?: ReactNode; right?: ReactNode; ai?: boolean; children: ReactNode; className?: string }) {
  return (
    <section className={cx('min-w-0 rounded-md border bg-surface-2 p-3', ai ? 'border-dashed border-ink-2' : 'border-line', className)}>
      {(title || right) && (
        <div className="mb-2 flex items-center gap-2">
          {title && <Label>{title}</Label>}
          <div className="ml-auto flex items-center gap-2">{right}</div>
        </div>
      )}
      {children}
    </section>
  )
}

export function Bar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className={cx('relative h-[5px] w-full overflow-hidden rounded bg-line', className)}>
      <i className="absolute inset-y-0 left-0 bg-ink-2" style={{ width: pct + '%' }} />
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-0.5 border-b border-line">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={cx('-mb-px border-b-2 px-3 py-1.5 text-[12px]', value === t.id ? 'border-ink font-semibold text-ink' : 'border-transparent text-muted')}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function PageHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end gap-3">
      <div>
        <h1 className="m-0 text-[18px] font-bold leading-6">{title}</h1>
        {sub && <div className="text-muted">{sub}</div>}
      </div>
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  )
}

export function Row({ children, selected, className, onClick }: { children: ReactNode; selected?: boolean; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cx('flex min-w-0 items-center gap-2 rounded-md border px-2 py-1.5', selected ? 'border-ink-2 bg-sel' : 'border-line bg-surface', onClick && 'cursor-pointer', className)}>
      {children}
    </div>
  )
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line py-1 last:border-0">
      <span className="text-muted">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  )
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="font-mono text-[18px] font-semibold leading-6">{value}</div>
    </div>
  )
}
