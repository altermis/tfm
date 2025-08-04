// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getToken, clearToken, storeToken } from './tokenStorage';
// import { decode as atob } from 'base-64';


// export const AuthContext = createContext(null);

// const TOKEN_KEY = 'userToken';

// export const AuthProvider = ({ children }) => {
//   const [userToken, setUserToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = async (token) => {
//     setUserToken(token);
//     await storeToken(token);
//   };

//   const logout = async () => {
//     await clearToken();      
//     setUserToken(null); 
//     // resetToLogin();     
//   };
//   const isTokenExpired = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const now = Math.floor(Date.now() / 1000);
//       return payload.exp < now;
//     } catch (e) {
//       console.error('Error decodificant el token', e);
//       return true;
//     }
//   };

//   useEffect(() => {
//     const checkToken = async () => {
//       const storedToken = await getToken();
//       if (storedToken && !isTokenExpired(storedToken)) {
//         setUserToken(storedToken);
//       } else {
//         await logout();
//       }
//       setLoading(false);
//     };
//     checkToken();
//   }, []);

//   useEffect(() => {
//     const checkTokenInterval = setInterval(async () => {
//       const token = await getToken();
//       if (token && isTokenExpired(token)) {
//         console.log('Token caducat (interval), fent logout...');
//         await logout();
//       }
//     }, 5000); // Comprova cada 5 segons
  
//     return () => clearInterval(checkTokenInterval);
//   }, []);
  

//   return (
//     <AuthContext.Provider value={{ userToken, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';
import { getToken, clearToken, storeToken } from './tokenStorage';
import { decode as atob } from 'base-64';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token) => {
    setUserToken(token);
    await storeToken(token);
  };

  const logout = async () => {
    await clearToken();
    setUserToken(null);
  };

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      console.error('Error decodificant el token', e);
      return true;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getToken();
      if (storedToken && !isTokenExpired(storedToken)) {
        setUserToken(storedToken);
      } else {
        await logout();
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  useEffect(() => {
    const checkTokenInterval = setInterval(async () => {
      const token = await getToken();
      if (token && isTokenExpired(token)) {
        console.log('Token caducat (interval), fent logout...');
        await logout();
      }
    }, 5000);

    return () => clearInterval(checkTokenInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
