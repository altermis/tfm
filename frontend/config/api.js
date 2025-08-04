import { apiFetch } from './apiFetch';
import { API_BASE } from './ip';

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

export const predictImage = async (imageUri, logout) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });

  return apiFetch(`${API_BASE}/predict/`, {
    method: 'POST',
    body: formData,
  }, logout);
};

export const fetchHistory = async (page = 1, logout) => {
  return apiFetch(`${API_BASE}/history/?page=${page}`, {}, logout);
};
