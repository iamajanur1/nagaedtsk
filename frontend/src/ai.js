export async function suggestUsernames(interests) {
  let response;

  try {
    response = await fetch('/ai/api/suggest-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests })
    });
  } catch {
    throw new Error('Cannot reach the AI service. Please check that FastAPI is running.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = typeof data?.detail === 'string'
      ? data.detail
      : response.status === 422
        ? 'Please enter valid interests and try again.'
        : 'Could not generate usernames. Please try again.';
    throw new Error(detail);
  }

  if (!Array.isArray(data?.suggestions) || data.suggestions.length !== 3) {
    throw new Error('The AI service returned an unexpected response.');
  }

  return data.suggestions;
}
