// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import { getToken } from '../config/tokenStorage';
// import { API_BASE } from '../config/ip';
// import { useTheme } from '../config/contextoEstilo';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { diagnosticMap } from '../data/diagnostics';
// import { useFocusEffect } from '@react-navigation/native';

// import { useRefresh } from '../config/RefreshContext'; 
// import { useApiFetch } from '../config/apiFetch';

// export default function HistoryScreen() {
//   const [history, setHistory] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasNext, setHasNext] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { theme } = useTheme();

//   const { refreshNeeded, setRefreshNeeded } = useRefresh(); 

  
//   const apiFetch = useApiFetch();

// const fetchHistory = useCallback(async (nextPage = 1) => {
//   if (loading || !hasNext) return;
//   setLoading(true);
//   setError(null);
//   try {
//     const data = await apiFetch(`${API_BASE}/history/?page=${nextPage}`);

//     if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
//       throw new Error('Resposta no vàlida del servidor');
//     }

//     setHistory((prev) => (nextPage === 1 ? data.results : [...prev, ...data.results]));
//     setHasNext(data.next !== null);
//     setPage(nextPage);
//   } catch (err) {
//     setError(err.message || 'Error desconegut');
//     console.error('Error al obtindre historial:', err);
//   } finally {
//     setLoading(false);
//   }
// }, [loading, hasNext, apiFetch]);




//   useEffect(() => {
//     fetchHistory(1);
//   }, [fetchHistory]);


//   useEffect(() => {
//     if (refreshNeeded) {
//       fetchHistory(1);
//       setRefreshNeeded(false);
//     }
//   }, [refreshNeeded, fetchHistory, setRefreshNeeded]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchHistory(1);
//     }, [])
//   );

//   const handleEndReached = () => {
//     if (!loading && hasNext) {
//       fetchHistory(page + 1);
//     }
//   };

//   const renderItem = useCallback(({ item }) => {
//     let parsedResult = null;
//     try {
//       parsedResult = JSON.parse(item.result.replace(/'/g, '"'));
//     } catch (e) {
//       console.error('Error parsejant resultat:', e);
//     }

//     const className = parsedResult?.class || 'Desconegut';
//     const diagnostic = diagnosticMap[className] || {};
//     const title = diagnostic.title || className;

//     return (
//       <View style={[styles.card, { backgroundColor: theme.colors.card || '#fff' }]}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//         <Text style={[styles.text, { color: theme.colors.text, fontWeight: 'bold', fontSize: 16 }]}>
//           {title}
//         </Text>
//         <Text style={[styles.date, { color: theme.colors.subtle || '#666' }]}>
//           {new Date(item.created_at).toLocaleString()}
//         </Text>
//       </View>
//     );
//   }, [theme]);

//   return (
//     <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: theme.colors.text }]}>Historial</Text>
//       </View>

//       {error && (
//         <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
//       )}

//       <FlatList
//         data={history}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={styles.container}
//         onEndReached={handleEndReached}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={loading ? <ActivityIndicator size="large" color={theme.colors.primary} /> : null}
//         ListEmptyComponent={!loading && !error ? (
//           <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: 20 }}>
//             No hi ha registres
//           </Text>
//         ) : null}
//       />
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   wrapper: { flex: 1 },
//   header: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     paddingBottom: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   container: {
//     padding: 10,
//     flexGrow: 1,
//   },
//   card: {
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   image: {
//     height: 200,
//     width: '100%',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   date: {
//     fontSize: 12,
//   },
// });
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../config/contextoEstilo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { diagnosticMap } from '../data/diagnostics';
import { useFocusEffect } from '@react-navigation/native';

import { useRefresh } from '../config/RefreshContext'; 
import { fetchHistory } from '../config/api';  // importes la funció directa

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { refreshNeeded, setRefreshNeeded } = useRefresh();

  const loadHistory = useCallback(async (nextPage = 1) => {
    if (loading || !hasNext) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistory(nextPage);  // crides la funció directa

      if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
        throw new Error('Resposta no vàlida del servidor');
      }

      setHistory(prev => (nextPage === 1 ? data.results : [...prev, ...data.results]));
      setHasNext(data.next !== null);
      setPage(nextPage);
    } catch (err) {
      setError(err.message || 'Error desconegut');
      console.error('Error al obtindre historial:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNext]);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  useEffect(() => {
    if (refreshNeeded) {
      loadHistory(1);
      setRefreshNeeded(false);
    }
  }, [refreshNeeded, setRefreshNeeded, loadHistory]);

  useFocusEffect(
    useCallback(() => {
      loadHistory(1);
    }, [loadHistory])
  );

  const handleEndReached = () => {
    if (!loading && hasNext) {
      loadHistory(page + 1);
    }
  };

  const renderItem = useCallback(({ item }) => {
    let parsedResult = null;
    try {
      parsedResult = JSON.parse(item.result.replace(/'/g, '"'));
    } catch (e) {
      console.error('Error parsejant resultat:', e);
    }

    const className = parsedResult?.class || 'Desconegut';
    const diagnostic = diagnosticMap[className] || {};
    const title = diagnostic.title || className;

    return (
      <View style={[styles.card, { backgroundColor: theme.colors.card || '#fff' }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={[styles.text, { color: theme.colors.text, fontWeight: 'bold', fontSize: 16 }]}>
          {title}
        </Text>
        <Text style={[styles.date, { color: theme.colors.subtle || '#666' }]}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    );
  }, [theme]);

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Historial</Text>
      </View>

      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color={theme.colors.primary} /> : null}
        ListEmptyComponent={!loading && !error ? (
          <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: 20 }}>
            No hi ha registres
          </Text>
        ) : null}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
    flexGrow: 1,
  },
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
  },
});
