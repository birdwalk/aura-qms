// ============================================================
// AURA QMS — Microsoft Foundry Configuration
// All agent endpoints and IQ layer connections configured here.
// Set VITE_APP_MODE=live in .env.local to connect to Foundry.
// ============================================================

export const FOUNDRY_CONFIG = {
  endpoint: import.meta.env.VITE_AZURE_FOUNDRY_ENDPOINT || '',
  apiKey: import.meta.env.VITE_AZURE_API_KEY || '',
  apiVersion: import.meta.env.VITE_AZURE_API_VERSION || '2024-05-01-preview',
  modelDeployment: import.meta.env.VITE_MODEL_DEPLOYMENT || 'gpt-4o',
  appMode: (import.meta.env.VITE_APP_MODE || 'demo') as 'demo' | 'live',

  agents: {
    orchestrator: import.meta.env.VITE_ORCHESTRATOR_AGENT_ID || '',
    learning:     import.meta.env.VITE_LEARNING_AGENT_ID || '',
    document:     import.meta.env.VITE_DOCUMENT_AGENT_ID || '',
    audit:        import.meta.env.VITE_AUDIT_AGENT_ID || '',
    assessment:   import.meta.env.VITE_ASSESSMENT_AGENT_ID || '',
    compliance:   import.meta.env.VITE_COMPLIANCE_AGENT_ID || '',
    insights:     import.meta.env.VITE_INSIGHTS_AGENT_ID || '',
  },

  knowledgeBaseId: import.meta.env.VITE_KNOWLEDGE_BASE_ID || '',
};

export const isLiveMode = (): boolean =>
  FOUNDRY_CONFIG.appMode === 'live' &&
  !!FOUNDRY_CONFIG.endpoint &&
  !!FOUNDRY_CONFIG.apiKey &&
  !!FOUNDRY_CONFIG.agents.orchestrator;
