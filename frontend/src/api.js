async function request(path, { token, ...options } = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }

  return data;
}

export function registerUser(details) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(details)
  });
}

export function loginUser(details) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(details)
  });
}

export function getUser(id, token) {
  return request(`/users/${id}`, { token });
}
