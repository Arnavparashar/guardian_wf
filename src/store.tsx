import { createContext, useContext, useReducer, ReactNode } from 'react'
import { HistoryEntry, seedHistory } from './lib/mock'

export type Approval = 'none' | 'pending' | 'approved' | 'rejected'

interface State {
  history: HistoryEntry[]
  selected: number[]          // recommended action ids the analyst picked
  approval: Approval
  decision: string | null
  pinned: string[]            // evidence ids
  theme: 'light' | 'dark'
  showFlow: boolean
}

type Action =
  | { type: 'log'; actor: HistoryEntry['actor']; text: string }
  | { type: 'toggleAction'; id: number }
  | { type: 'setApproval'; value: Approval }
  | { type: 'decide'; value: string }
  | { type: 'pin'; id: string }
  | { type: 'theme' }
  | { type: 'flow' }

const stamp = (n: number) => '+' + String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0')

const initial: State = {
  history: seedHistory, selected: [1, 2], approval: 'none', decision: null, pinned: ['e2', 'e4'], theme: 'light', showFlow: true,
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'log':
      return { ...s, history: [...s.history, { t: stamp(34 + s.history.length), actor: a.actor, text: a.text }] }
    case 'toggleAction':
      return { ...s, selected: s.selected.includes(a.id) ? s.selected.filter((x) => x !== a.id) : [...s.selected, a.id] }
    case 'setApproval':
      return { ...s, approval: a.value }
    case 'decide':
      return { ...s, decision: a.value }
    case 'pin':
      return { ...s, pinned: s.pinned.includes(a.id) ? s.pinned.filter((x) => x !== a.id) : [...s.pinned, a.id] }
    case 'theme':
      return { ...s, theme: s.theme === 'light' ? 'dark' : 'light' }
    case 'flow':
      return { ...s, showFlow: !s.showFlow }
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, initial)
  return <Ctx.Provider value={{ s, d }}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
