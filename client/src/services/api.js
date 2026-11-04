const request = async (url, options = {}) => {
  const token = localStorage.getItem('escapeverse_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const rawText = await response.text();
    const clean = rawText.replace(/<[^>]*>/g, '').trim().slice(0, 120);
    throw new Error(clean || `Server error (${response.status})`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
};

export default api;
