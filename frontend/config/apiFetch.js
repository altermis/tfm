// import { useContext } from 'react';
// import { AuthContext } from './AuthContext';
// import { getToken } from './tokenStorage';

// export const useApiFetch = () => {
//   const { logout } = useContext(AuthContext);

//   return async (url, options = {}) => {
//     try {
//       const token = await getToken();

//       const isFormData = options.body instanceof FormData;

//       const headers = {
//         ...(options.headers || {}),
//         ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
//         Authorization: `Bearer ${token}`,
//       };

//       const res = await fetch(url, {
//         ...options,
//         headers,
//       });

//       if (res.status === 401) {
//         console.warn('Sessió expirada, fent logout...');
//         await logout();
//         throw new Error('Sessió caducada');
//       }

//       const contentType = res.headers.get('content-type') || '';

//       if (!res.ok) {
//         if (contentType.includes('application/json')) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(errorData.detail || 'Error de xarxa');
//         } else {
//           const text = await res.text();
//           throw new Error(text || 'Error desconegut');
//         }
//       }

//       if (contentType.includes('application/json')) {
//         return await res.json();
//       } else {
//         return await res.text();
//       }
//     } catch (err) {
//       console.error('apiFetch error:', err);
//       throw err;
//     }
//   };
// };
