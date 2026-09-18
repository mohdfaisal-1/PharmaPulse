const API_BASE_URL = '';

export async function uploadComplaintDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload API failed [${response.status}]: ${errorText}`);
  }

  return await response.json();
}

export async function extractComplaintText(text) {
  const response = await fetch(`${API_BASE_URL}/api/extract-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Text extraction API failed [${response.status}]: ${errorText}`);
  }

  return await response.json();
}

export async function sendCopilotMessage(query, context = {}) {
  const response = await fetch(`${API_BASE_URL}/api/copilot-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Copilot chat API failed [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return {
    reply: data.response || data.reply || 'Copilot processed your request.',
    model: data.model || 'llama-3.1-8b-instant',
  };
}

export async function saveComplaintRecord(formData, riskAssessment = {}) {
  const response = await fetch(`${API_BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formData, riskAssessment }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Save complaint API failed [${response.status}]: ${errorText}`);
  }

  return await response.json();
}

export async function fetchRecentComplaints() {
  const response = await fetch(`${API_BASE_URL}/api/complaints`);
  if (!response.ok) {
    throw new Error(`Fetch complaints failed [${response.status}]`);
  }
  return await response.json();
}
