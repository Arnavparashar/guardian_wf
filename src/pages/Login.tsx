import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Input, Label } from '../components/ui'

export default function Login() {
  const nav = useNavigate()
  const go = (e: FormEvent) => { e.preventDefault(); nav('/home') }
  return (
    <div className="flex h-full items-center justify-center gap-4 p-6">
      <form onSubmit={go} className="flex w-[300px] flex-col gap-2.5 rounded-md border border-line-strong bg-surface p-5">
        <div className="text-[22px] font-bold tracking-[0.16em]">GUARDIAN</div>
        <div className="text-muted">AI-native security operations center</div>
        <Btn type="button" onClick={() => nav('/home')} className="h-8">Continue with SSO</Btn>
        <div className="text-center text-muted">or</div>
        <Input placeholder="Work email" type="email" />
        <Input placeholder="Password" type="password" />
        <div className="flex items-center gap-1.5"><Label>MFA</Label>{[0, 1, 2, 3, 4, 5].map((i) => <Input key={i} maxLength={1} className="w-6 px-0 text-center" aria-label={'MFA digit ' + (i + 1)} />)}</div>
        <Input placeholder="Tenant: client-01" />
        <Btn type="submit" variant="primary" className="h-8">Sign in</Btn>
      </form>
      <div className="flex w-52 flex-col gap-2 self-stretch rounded-md border border-line bg-surface p-4">
        <Label>System status</Label>
        {['Triage agent', 'Investigation agent', 'IR agent', 'Threat intel service', 'SIEM connection'].map((n) => (
          <div key={n} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ink" />{n}</div>
        ))}
        <div className="mt-auto text-muted">Sessions are audited. Access follows role-based permissions.</div>
      </div>
    </div>
  )
}
