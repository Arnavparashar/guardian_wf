# Guardian UI

Front-end code base for the Guardian AI SOC wireframe. React, TypeScript, Vite, Tailwind, React Router. Mock data only, no backend.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

Start at `/login`, or open `/home`. The strip under the top bar shows which of the 15 flow-map steps you are on, and each step links to its screen. Hide it with "Hide flow".

## Flow map to routes

| Step | Screen | Route |
|---|---|---|
| 01 | Login | `/login` |
| 02 | Home | `/home` |
| 03 | Alert triage | `/alerts` (and `/investigations`, same queue) |
| 04 | Alert details | `/alerts/:id` |
| 05 | AI investigation | `/investigations/:id/run` |
| 06 | Investigation workspace | `/investigations/:id` |
| 07, 08, 09 | Evidence, Timeline, Entity graph | `/investigations/:id?tab=evidence \| timeline \| graph` |
| 10 | AI findings | `/investigations/:id/findings` |
| 11 | Human approval | `/approvals/:id` |
| 12 | Response actions | `/incidents/:id/response` |
| 13 | Incident | `/incidents/:id` |
| 14 | Resolution | `/incidents/:id/close` |
| 15 | Post-incident report | `/incidents/:id/report` |
| Secondary | Threat hunting, Detection eng., Context memory, Integrations, Reports, Settings | `/hunts`, `/detections`, `/context-memory`, `/integrations`, `/reports`, `/settings` |

## What works

- Queue filters, tabs, search and row selection.
- Simulated live AI investigation (timer). Pause, steer, and open the workspace.
- Workspace: tabs, pin evidence, select recommended actions, log an analyst decision, and a history strip that grows as you act.
- Approval: approve moves to Response, reject returns to the workspace. Response steps progress on a timer.
- Resolution writes to history. Context memory lets you add an item. "Ask Guardian" opens a placeholder chat drawer.
- Theme toggle. Light greyscale wireframe by default, dark theme as a second token set.

## Where to plug in the real thing

- `src/lib/mock.ts` holds every piece of data. Replace each export with an API call.
- `src/store.tsx` holds cross-screen state (history, selected actions, approval status). Move to server state when the backend exists.
- `src/pages/InvestigationRun.tsx` uses a timer. Replace it with a stream (SSE or WebSocket) from the Investigation agent.
- `src/pages/Incident.tsx` `Response` is simulated. In the PoC nothing executes, and v2 hands steps to a SOAR platform.
- Colours live only in `src/index.css` as CSS variables. Reskin there.

## Not included

Auth, a backend, real charts (Home uses simple SVG and divs), tests, RBAC, and the panels the wireframe marked as later (Admin, Users, Tenants, Trace logs, Audit log).
