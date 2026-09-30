// MOCK DATA ONLY. Every number and name here is a placeholder for the wireframe.
// Replace these imports with real API calls when the backend exists.

export type Verdict = 'Malicious' | 'Suspicious' | 'Inconclusive' | 'Benign'
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type QueueStatus = 'Queued' | 'Running' | 'In review' | 'Reviewed'

export interface AlertItem {
  id: string; title: string; rule: string; verdict: Verdict; severity: Severity
  confidence: number; entities: string[]; source: string; status: QueueStatus; time: string; tag?: string
}

export const alerts: AlertItem[] = [
  { id: 'INV-101', title: 'Outbound scanning to TI-listed IPs', rule: 'FW_DENY_udp_out', verdict: 'Malicious', severity: 'CRITICAL', confidence: 88, entities: ['10.0.0.100', '175.107.208.219', '217.118.253.123'], source: 'Splunk', status: 'In review', time: '2 min ago', tag: 'Guest network' },
  { id: 'INV-102', title: 'Directory traversal on web tier', rule: 'WEB_PATH_TRAVERSAL', verdict: 'Suspicious', severity: 'HIGH', confidence: 61, entities: ['10.47.17.99', 'web-tier-01'], source: 'Splunk', status: 'In review', time: '8 min ago' },
  { id: 'INV-103', title: 'Anomalous DNS SERVFAIL response', rule: 'DNS_SERVFAIL_ANOM', verdict: 'Inconclusive', severity: 'HIGH', confidence: 34, entities: ['srv-dns-02'], source: 'Splunk', status: 'Running', time: '14 min ago', tag: 'Potential misconfiguration' },
  { id: 'INV-104', title: 'Failed logins then internal scan', rule: 'AUTH_FAIL_THEN_SCAN', verdict: 'Suspicious', severity: 'MEDIUM', confidence: 48, entities: ['192.168.10.45', 'svc-backup'], source: 'Splunk', status: 'Queued', time: '21 min ago' },
  { id: 'INV-105', title: 'Proxy policy violation', rule: 'PROXY_POLICY', verdict: 'Benign', severity: 'LOW', confidence: 20, entities: ['user-entity'], source: 'Splunk', status: 'Reviewed', time: '40 min ago' },
]

export const homeStats = {
  investigations: 72, medianTtc: '9.5 min', timeSaved: '93 hrs',
  byVerdict: { Malicious: 24, Suspicious: 26, Inconclusive: 7, Benign: 15 } as Record<Verdict, number>,
  perDay: [6, 3, 2, 5, 4, 1, 9, 2, 7, 1, 2, 3, 2, 8],
  topAssets: [{ name: '10.0.0.100', n: 35 }, { name: 'srv-dns-02', n: 22 }, { name: '10.47.17.99', n: 18 }, { name: 'svc-backup', n: 12 }],
  response: { detect: '0 s', acknowledge: '1.4 s', investigate: '9.5 min', conclusion: '9.5 min' },
}

export interface TimelineEvent { t: string; text: string; source: string; technique?: string; note: string }
export const timeline: TimelineEvent[] = [
  { t: '+00:00', text: 'Guest device joins the network', source: 'NAC', note: 'AI: first time this device is seen' },
  { t: '+00:04', text: 'Port scan across internal subnet', source: 'Firewall', technique: 'T1046', note: 'AI: sequential destination ports' },
  { t: '+00:09', text: 'Outbound UDP to 175.107.208.219', source: 'Firewall', technique: 'T1095', note: 'AI: destination is on a TI C2 list' },
  { t: '+00:12', text: 'Traffic on a non-standard port', source: 'NDR', technique: 'T1571', note: 'AI: does not match the protocol expected on that port' },
  { t: '+00:31', text: 'Second destination joins the beacon pattern', source: 'Firewall', technique: 'T1095', note: 'AI: same cadence as the first IP' },
  { t: '+01:05', text: 'Both IPs match a C2 campaign feed', source: 'Threat intel', note: 'AI: attribution confidence rising' },
  { t: '+02:10', text: 'Blast radius limited to the guest VLAN', source: 'Graph', note: 'AI: related alerts still uninvestigated' },
  { t: '+02:20', text: 'Recommendations drafted for analyst decision', source: 'AI', note: 'AI: waiting on analyst' },
]

export interface EvidenceItem { id: string; title: string; source: string; by: 'AI' | 'Analyst'; relevance: number; detail: string }
export const evidence: EvidenceItem[] = [
  { id: 'e1', title: 'EDR process tree · host lookup', source: 'EDR', by: 'AI', relevance: 92, detail: 'edr.process_tree host=10.0.0.100 (no agent found, network telemetry only)' },
  { id: 'e2', title: 'Firewall log · UDP deny to C2 IP', source: 'Firewall', by: 'AI', relevance: 88, detail: 'firewall.deny src=10.0.0.100 dst=175.107.208.219 proto=udp zone=guest-wifi' },
  { id: 'e3', title: 'NDR flow · non-standard port', source: 'NDR', by: 'AI', relevance: 74, detail: 'ndr.flow src=10.0.0.100 dst_port=non-standard bytes_out=elevated' },
  { id: 'e4', title: 'TI report · C2 campaign match', source: 'Threat intel', by: 'AI', relevance: 95, detail: 'ti.lookup 175.107.208.219 verdict=malicious sources=multiple freshness=recent' },
  { id: 'e5', title: 'Analyst note · other guest devices', source: 'Manual', by: 'Analyst', relevance: 40, detail: 'Also check other devices on the guest VLAN.' },
]

export const entities = [
  { name: '10.0.0.100', sub: 'Host · Android · guest Wi-Fi', risk: 80, level: 'High' },
  { name: '175.107.208.219', sub: 'External IP · TI: malicious', risk: 95, level: 'High' },
  { name: '217.118.253.123', sub: 'External IP · TI: malicious', risk: 90, level: 'High' },
  { name: 'Guest VLAN', sub: 'Network segment', risk: 45, level: 'Med' },
  { name: 'Neighbour devices', sub: 'Not yet assessed', risk: 20, level: 'Low' },
]

export const toolCalls = [
  { name: 'siem.search', args: 'index=fw src=10.0.0.100 · 24h', status: 'done' },
  { name: 'ti.lookup', args: '175.107.208.219', status: 'done' },
  { name: 'ndr.flow_query', args: 'guest VLAN · 24h', status: 'done' },
  { name: 'graph.recall', args: 'similar past cases', status: 'done' },
  { name: 'edr.process_tree', args: 'host lookup', status: 'running' },
  { name: 'iam.user_history', args: 'not needed for this host', status: 'skipped' },
]

export const hypotheses = [
  { id: 'H1', text: 'Compromised guest device beaconing to C2', pct: 88, status: 'Supported' },
  { id: 'H2', text: 'Benign network scanner', pct: 9, status: 'Ruled out' },
  { id: 'H3', text: 'Misconfigured application', pct: 14, status: 'Weak' },
]

export interface ActionItem { id: number; text: string; confidence: string; reversible: string; risk: 'Low' | 'Med'; approval: string }
export const actions: ActionItem[] = [
  { id: 1, text: 'Block 175.107.208.219 at the perimeter firewall', confidence: 'High confidence', reversible: 'Reversible', risk: 'Low', approval: 'Auto' },
  { id: 2, text: 'Isolate 10.0.0.100 from the guest VLAN', confidence: 'Medium confidence', reversible: 'Reversible', risk: 'Med', approval: 'Analyst' },
  { id: 3, text: 'Sweep the guest VLAN for the same IOCs', confidence: 'Recommend hunt', reversible: 'Read-only', risk: 'Low', approval: 'Analyst' },
]

export interface HistoryEntry { t: string; actor: 'System' | 'AI' | 'Analyst'; text: string }
export const seedHistory: HistoryEntry[] = [
  { t: '+00:00', actor: 'System', text: 'Alert ingested, deduplicated, no fingerprint match' },
  { t: '+00:02', actor: 'AI', text: 'Triage: likely true positive, priority high' },
  { t: '+00:05', actor: 'AI', text: 'Investigation plan created, five steps' },
  { t: '+00:07', actor: 'AI', text: 'Tool calls run: siem.search, ti.lookup, ndr.flow_query' },
  { t: '+00:24', actor: 'AI', text: 'Graph recall returned similar past cases' },
  { t: '+00:33', actor: 'AI', text: 'Recommendations drafted, awaiting analyst decision' },
]

export const graph = {
  nodes: [
    { id: 'vlan', label: 'guest VLAN', x: 110, y: 155, r: 22, kind: 'Segment', risk: 'Med' },
    { id: 'host', label: '10.0.0.100', x: 300, y: 155, r: 30, kind: 'Host · Android', risk: 'High' },
    { id: 'ip1', label: '175.107.208.219', x: 500, y: 90, r: 24, kind: 'External IP', risk: 'High' },
    { id: 'ip2', label: '217.118.253.123', x: 500, y: 220, r: 24, kind: 'External IP', risk: 'High' },
    { id: 'c2', label: 'C2 campaign', x: 665, y: 155, r: 26, kind: 'Campaign', risk: 'High' },
    { id: 'past', label: 'past case', x: 300, y: 45, r: 20, kind: 'Similar past case', risk: 'Low' },
  ],
  edges: [['vlan', 'host', 'member of'], ['host', 'ip1', 'udp to'], ['host', 'ip2', 'udp to'], ['ip1', 'c2', 'matches'], ['ip2', 'c2', 'matches'], ['host', 'past', 'similar to']] as [string, string, string][],
}

export const incidents = [
  { id: 'INC-101', title: 'Guest device beaconing to C2', severity: 'CRITICAL' as Severity, status: 'In progress', owner: 'AS' },
  { id: 'INC-102', title: 'Directory traversal on web tier', severity: 'HIGH' as Severity, status: 'Triaged', owner: 'AS' },
  { id: 'INC-103', title: 'Repeated failed logins', severity: 'MEDIUM' as Severity, status: 'Monitoring', owner: 'RK' },
  { id: 'INC-104', title: 'Proxy policy violation', severity: 'LOW' as Severity, status: 'Closed', owner: 'RK' },
]

export const hunts = [
  { q: 'Guest VLAN to internal SMB', hits: 3, status: 'Done' },
  { q: 'Same beacon cadence, other hosts', hits: 1, status: 'Running' },
  { q: 'New devices contacting C2 IPs', hits: 0, status: 'Queued' },
]

export const detections = [
  { name: 'Outbound UDP to TI-listed IP', status: 'Enabled' },
  { name: 'Guest VLAN scan burst', status: 'Testing' },
  { name: 'Non-standard port beacon', status: 'Draft' },
]

export const integrations = [
  { name: 'SIEM', kind: 'Splunk adapter first', status: 'Connected' },
  { name: 'EDR', kind: 'Endpoint telemetry', status: 'Not set' },
  { name: 'Identity', kind: 'Directory and IAM', status: 'Not set' },
  { name: 'Threat intel', kind: 'Feeds and service', status: 'Connected' },
  { name: 'SOAR', kind: 'Response hand-off', status: 'Later' },
  { name: 'Messaging', kind: 'Teams and Slack', status: 'Connected' },
]

export const memory = [
  { id: 68, updated: 'Sep 12', content: 'Guest VLAN devices are not expected to reach external UDP services.', type: 'Investigation review', ref: 'INV-101' },
  { id: 67, updated: 'Sep 10', content: 'The perimeter firewall allows outbound DNS to approved resolvers only.', type: 'User submission', ref: 'admin' },
  { id: 66, updated: 'Sep 08', content: 'Web tier path traversal alerts from the internal scanner are expected on Tuesdays.', type: 'Investigation review', ref: 'INV-088' },
]

export const reportLibrary = [
  { name: 'Executive incident summary', cadence: 'On demand' },
  { name: 'Weekly SOC report', cadence: 'Weekly' },
  { name: 'MTTD and MTTR trends', cadence: 'Monthly' },
  { name: 'Analyst workload', cadence: 'Weekly' },
]
