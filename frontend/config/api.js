import { getToken } from './tokenStorage';
import { API_BASE } from './ip';

const buildHeaders = async (body) => {
  const token = await getToken();
  const isFormData = body instanceof FormData;

  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error de xarxa');
    } else {
      const text = await res.text();
      throw new Error(text || 'Error desconegut');
    }
  }

  if (contentType.includes('application/json')) {
    return await res.json();
  } else {
    return await res.text();
  }
};

const apiFetch = async (url, options = {}) => {
  try {
    const headers = await buildHeaders(options.body);
    const res = await fetch(url, { ...options, headers });
    return await handleResponse(res);
  } catch (err) {
    console.error('apiFetch error:', err);
    throw err;
  }
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Error en el login');
  }

  return await res.json();
};

export const predictImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });

  return apiFetch(`${API_BASE}/predict/`, {
    method: 'POST',
    body: formData,
  });
};

export const fetchHistory = async (page = 1) => {
  return apiFetch(`${API_BASE}/history/?page=${page}`);
};
