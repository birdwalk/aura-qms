// ============================================================
// AURA QMS — Microsoft Foundry Agent Service Client
// Connects directly to Azure Foundry Agent Service API.
// Falls back to demo mode if credentials not configured.
// ============================================================

import { FOUNDRY_CONFIG, isLiveMode } from '../config/foundry';

export interface AgentResponse {
  text: string;
  threadId: string;
  agentUsed: string;
  sources?: string;
  isDemo: boolean;
}

// Active thread store — persists conversation context per session
const threadStore: Record<string, string> = {};

// ── Core Foundry API call ──────────────────────────────────
async function callFoundryAgent(
  userMessage: string,
  agentId: string,
  sessionKey: string = 'default'
): Promise<AgentResponse> {
  const { endpoint, apiKey, apiVersion } = FOUNDRY_CONFIG;
  const baseUrl = `${endpoint}openai/v1`;

  // Step 1: Create or reuse thread
  let threadId = threadStore[sessionKey];
  if (!threadId) {
    const threadRes = await fetch(`${baseUrl}/threads?api-version=${apiVersion}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({}),
    });
    if (!threadRes.ok) throw new Error(`Thread creation failed: ${threadRes.status}`);
    const thread = await threadRes.json();
    threadId = thread.id;
    threadStore[sessionKey] = threadId;
  }

  // Step 2: Add user message to thread
  await fetch(`${baseUrl}/threads/${threadId}/messages?api-version=${apiVersion}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ role: 'user', content: userMessage }),
  });

  // Step 3: Run the agent
  const runRes = await fetch(`${baseUrl}/threads/${threadId}/runs?api-version=${apiVersion}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ assistant_id: agentId }),
  });
  if (!runRes.ok) throw new Error(`Run creation failed: ${runRes.status}`);
  const run = await runRes.json();

  // Step 4: Poll until complete (max 30s)
  let status = run.status;
  let runId = run.id;
  let attempts = 0;
  while ((status === 'queued' || status === 'in_progress') && attempts < 30) {
    await new Promise((r) => setTimeout(r, 1000));
    const pollRes = await fetch(
      `${baseUrl}/threads/${threadId}/runs/${runId}?api-version=${apiVersion}`,
      { headers: { 'api-key': apiKey } }
    );
    const pollData = await pollRes.json();
    status = pollData.status;
    attempts++;
  }

  if (status !== 'completed') throw new Error(`Agent run ended with status: ${status}`);

  // Step 5: Retrieve latest assistant message
  const msgRes = await fetch(
    `${baseUrl}/threads/${threadId}/messages?api-version=${apiVersion}&order=desc&limit=1`,
    { headers: { 'api-key': apiKey } }
  );
  const msgData = await msgRes.json();
  const latest = msgData.data?.find((m: any) => m.role === 'assistant');
  const text = latest?.content?.[0]?.text?.value || 'No response from agent.';

  // Extract citations if present
  const annotations = latest?.content?.[0]?.text?.annotations || [];
  const sources = annotations.length > 0
    ? 'Sources: ' + annotations.map((a: any) => a.file_citation?.file_id || a.text).join(' · ')
    : undefined;

  return { text, threadId, agentUsed: agentId, sources, isDemo: false };
}

// ── Route intent to correct agent ─────────────────────────
function routeToAgent(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('learn') || q.includes('training') || q.includes('study') || q.includes('module'))
    return FOUNDRY_CONFIG.agents.learning;
  if (q.includes('document') || q.includes('doc') || q.includes('procedure') || q.includes('manual'))
    return FOUNDRY_CONFIG.agents.document;
  if (q.includes('audit') || q.includes('finding') || q.includes('nonconformity') || q.includes('risk'))
    return FOUNDRY_CONFIG.agents.audit;
  if (q.includes('quiz') || q.includes('assess') || q.includes('question') || q.includes('test'))
    return FOUNDRY_CONFIG.agents.assessment;
  if (q.includes('clause') || q.includes('compliance') || q.includes('iso') || q.includes('requirement'))
    return FOUNDRY_CONFIG.agents.compliance;
  if (q.includes('insight') || q.includes('manager') || q.includes('dashboard') || q.includes('report'))
    return FOUNDRY_CONFIG.agents.insights;
  // Default: orchestrator handles everything else
  return FOUNDRY_CONFIG.agents.orchestrator;
}

// ── Demo fallback responses ────────────────────────────────
function getDemoResponse(query: string): AgentResponse {
  const q = query.toLowerCase();
  let text = '';
  let sources = '';
  let agentUsed = 'Orchestrator Agent (Demo)';

  if (q.includes('risk') || q.includes('audit') || q.includes('ready')) {
    agentUsed = 'Audit Readiness Agent (Demo)';
    text = `Based on current readiness data, two departments present HIGH audit risk:\n\n🔴 Operations (DEPT-004) — Score: 61%\n• Major nonconformity AF-001: No Operational Control Plan (Clause 8.1)\n• Process owner PO-004 training incomplete\n• Recommendation: Immediate corrective action required — 47 days to audit\n\n🔴 Procurement (DEPT-006) — Score: 55%\n• Major nonconformity AF-002: Supplier evaluations 18 months overdue (Clause 8.4.1)\n• Document DOC-005 overdue for review\n• Recommendation: Escalate to top management this week\n\nFour other departments are at medium risk or better. Overall organisational readiness: 76%.`;
    sources = 'Sources: readiness_scores.json · audit_findings.json · ISO 9001:2015 §8.1, §8.4.1';
  } else if (q.includes('document') || q.includes('doc')) {
    agentUsed = 'Document Control Agent (Demo)';
    text = `Document Control Agent identified 3 documents requiring immediate action:\n\n• DOC-007 is MISSING entirely — Operational Control Plan (Clause 8.1, DEPT-004). This is a critical audit prerequisite.\n• DOC-005 review is 6 months overdue — Supplier Evaluation Procedure (Clause 8.4.1, DEPT-006).\n• DOC-003 remains in draft status — IT Security Policy (Clause 7.5, DEPT-002).\n\nPriority: DOC-007 must be drafted and approved before the external audit. Assign to PO-004 with immediate effect.`;
    sources = 'Sources: documents.json · clause_mapping · ISO 9001:2015 §8.1, §7.5, §8.4.1';
  } else if (q.includes('train') || q.includes('learn') || q.includes('study')) {
    agentUsed = 'ISO Learning Path Agent (Demo)';
    text = `Work IQ signals analysis for the team:\n\n⚠️ PO-004 (Operations) — OVERLOADED: 35 meeting hrs/week, 4 focus hrs available. Training capacity: none this week.\nRecommendation: Block Thursday 08:00–10:00 (lowest meeting density). 6-week ISO 9001 Clause 8 learning plan prepared.\n\n⚠️ PO-006 (Procurement) — CONSTRAINED: 29 meeting hrs/week. Recommended slot: Thursday afternoon.\n\n✅ PO-003 (HSE) — AVAILABLE: 8 meeting hrs, 32 focus hrs. Optimal for advanced Clause 9 study this week.`;
    sources = 'Sources: workload_signals.json · training_records.json · ISO 9001:2015 §7.2';
  } else if (q.includes('score') || q.includes('readiness') || q.includes('percent')) {
    agentUsed = 'Audit Readiness Agent (Demo)';
    text = `Current ISO 9001:2015 organisational readiness scores:\n\n✅ HSE: 91% — Ready (Low Risk)\n✅ Quality Management: 87% — Ready (Low Risk)\n🟡 Human Resources: 79% — On Track (Medium Risk)\n🟡 Information Technology: 73% — At Risk (Medium Risk)\n🔴 Operations: 61% — Not Ready (High Risk)\n🔴 Procurement: 55% — Not Ready (High Risk)\n\nGlobal Readiness: 76% | External audit in 47 days\n\nWeighted scoring formula: Documents (30%) + Training (25%) + Audit history (25%) + Process maturity (20%). Major NCs apply −15pt penalty.`;
    sources = 'Sources: readiness_scores.json · departments.json · scoring_formula';
  } else if (q.includes('quiz') || q.includes('assess') || q.includes('question')) {
    agentUsed = 'Assessment Agent (Demo)';
    text = `Assessment Agent — ISO 9001:2015 Clause 8.1 Sample Questions:\n\n1. What must an organisation establish under Clause 8.1 Operational Planning and Control?\n   → Criteria for processes and product/service acceptance.\n\n2. Which document is currently missing for the Operations department?\n   → DOC-007 Operational Control Plan — flagged as Major Nonconformity AF-001.\n\n3. What is the consequence of not having an Operational Control Plan at the time of external audit?\n   → Major nonconformity likely to result in certification failure.\n\nGenerate a full graded assessment for any role — connect Foundry IQ for cited, grounded questions.`;
    sources = 'Sources: knowledge_base/iso_9001_guidance.md · assessment_agent · ISO 9001:2015 §8.1';
  } else if (q.includes('clause') || q.includes('iso') || q.includes('compliance')) {
    agentUsed = 'Compliance Intelligence Agent (Demo)';
    text = `Compliance Intelligence Agent — ISO 9001:2015 Clause Mapping:\n\nHigh-risk clauses based on current gap analysis:\n\n• Clause 8.1 (Operational Planning): DEPT-004 — Missing control plan. CRITICAL.\n• Clause 8.4.1 (External Providers): DEPT-006 — Supplier audits 18 months overdue. CRITICAL.\n• Clause 7.5 (Documented Information): DEPT-002 — IT Security Policy in draft. MINOR.\n• Clause 9.1.1 (Monitoring & Measurement): DEPT-002 — KPIs not reported. MINOR.\n\nRecommended priority order: 8.1 → 8.4.1 → 7.5 → 9.1.1`;
    sources = 'Sources: audit_findings.json · clause_mapping · ISO 9001:2015';
  } else {
    text = `AURA QMS multi-agent system is active and monitoring your compliance posture.\n\nCurrent status: Organisational readiness at 76% with the external audit in 47 days. Two departments (Operations, Procurement) carry open major nonconformities requiring immediate attention.\n\nTry asking:\n• "Which departments are at risk for the audit?"\n• "Show me all open document gaps"\n• "What is the training status for each process owner?"\n• "Generate an ISO 9001 quiz for the Operations Manager"\n• "Explain Clause 8.1 requirements"`;
    sources = 'Sources: AURA QMS · Microsoft Foundry (Demo Mode)';
  }

  return { text, threadId: 'demo-thread', agentUsed, sources, isDemo: true };
}

// ── Public API ─────────────────────────────────────────────
export async function sendMessageToAura(
  userMessage: string,
  sessionKey: string = 'default'
): Promise<AgentResponse> {
  if (!isLiveMode()) {
    // Simulate realistic agent thinking delay
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600));
    return getDemoResponse(userMessage);
  }

  try {
    const agentId = routeToAgent(userMessage);
    return await callFoundryAgent(userMessage, agentId, sessionKey);
  } catch (error) {
    console.error('Foundry agent call failed, falling back to demo:', error);
    return getDemoResponse(userMessage);
  }
}

export function clearThread(sessionKey: string = 'default') {
  delete threadStore[sessionKey];
}
