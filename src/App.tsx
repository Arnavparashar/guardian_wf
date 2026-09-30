import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './store'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Queue from './pages/Queue'
import AlertDetail from './pages/AlertDetail'
import InvestigationRun from './pages/InvestigationRun'
import Workspace from './pages/Workspace'
import Findings from './pages/Findings'
import Approval from './pages/Approval'
import { Incidents, IncidentDetail, Response, Resolution, Report } from './pages/Incident'
import { Hunts, Detections, Integrations, Reports, Settings, ContextMemory } from './pages/Secondary'

export default function App() {
  const { s } = useStore()
  useEffect(() => { document.documentElement.dataset.theme = s.theme }, [s.theme])
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/alerts" element={<Queue mode="alerts" />} />
        <Route path="/alerts/:id" element={<AlertDetail />} />
        <Route path="/investigations" element={<Queue mode="investigations" />} />
        <Route path="/investigations/:id/run" element={<InvestigationRun />} />
        <Route path="/investigations/:id" element={<Workspace />} />
        <Route path="/investigations/:id/findings" element={<Findings />} />
        <Route path="/approvals/:id" element={<Approval />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/incidents/:id/response" element={<Response />} />
        <Route path="/incidents/:id/close" element={<Resolution />} />
        <Route path="/incidents/:id/report" element={<Report />} />
        <Route path="/hunts" element={<Hunts />} />
        <Route path="/detections" element={<Detections />} />
        <Route path="/context-memory" element={<ContextMemory />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
