export interface AgentFormValues {
  agentName: string;
  description: string;
  endpointUrl: string;
  capabilities: string[];
  skills: string[];
  community: string;
}

function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function normalizeAgentForm(values: AgentFormValues) {
  return {
    agent_name: values.agentName.trim(),
    description: values.description.trim(),
    endpoint_url: values.endpointUrl.trim(),
    capabilities: normalizeTags(values.capabilities),
    skills: normalizeTags(values.skills),
    community: values.community.trim(),
  };
}

export function validateAgentForm(values: AgentFormValues) {
  const normalized = normalizeAgentForm(values);

  if (normalized.agent_name.length < 3 || normalized.agent_name.length > 50) {
    return "Agent name must be between 3 and 50 characters.";
  }

  if (normalized.description.length < 10 || normalized.description.length > 500) {
    return "Description must be between 10 and 500 characters.";
  }

  if (
    !normalized.endpoint_url.startsWith("http://") &&
    !normalized.endpoint_url.startsWith("https://")
  ) {
    return "Endpoint URL must start with http:// or https://.";
  }

  if (normalized.endpoint_url.length > 500) {
    return "Endpoint URL must be no more than 500 characters.";
  }

  if (normalized.capabilities.length < 1 || normalized.capabilities.length > 20) {
    return "Add between 1 and 20 capabilities.";
  }

  if (normalized.skills.length < 1 || normalized.skills.length > 20) {
    return "Add between 1 and 20 skills.";
  }

  if (
    normalized.community.length > 0 &&
    (normalized.community.length < 2 || normalized.community.length > 100)
  ) {
    return "Community must be between 2 and 100 characters or left blank.";
  }

  return null;
}
