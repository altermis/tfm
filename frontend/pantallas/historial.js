import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../config/contextoEstilo';
import { diagnosticMap } from '../data/diagnostics';
import { useFocusEffect } from '@react-navigation/native';

import { useRefresh } from '../config/RefreshContext';
import { fetchHistory } from '../config/api';

const HistoryItem = React.memo(({ item, theme }) => {
  const className = item.result?.class || 'Desconegut';
  const diagnostic = diagnosticMap[className] || {};
  const title = diagnostic.title || className;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={[styles.text, { color: theme.colors.text, fontWeight: 'bold', fontSize: 16 }]}>
        {title}
      </Text>
      <Text style={[styles.date, { color: theme.colors.subtle }]}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );
});

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { refreshNeeded, setRefreshNeeded } = useRefresh();

  const loadingRef = useRef(loading);
  const hasNextRef = useRef(hasNext);
  const pageRef = useRef(page);

  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasNextRef.current = hasNext; }, [hasNext]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const loadHistory = useCallback(async (nextPage = 1) => {
    if (loadingRef.current || (nextPage !== 1 && !hasNextRef.current)) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistory(nextPage);

      if (!data || !Array.isArray(data.results)) {
        throw new Error('Resposta no vàlida del servidor');
      }

      setHistory(prev => {
        if (nextPage === 1) {
          return data.results;
        }

        const existingIds = new Set(prev.map(p => p.id));
        const newFiltered = data.results.filter(n => !existingIds.has(n.id));
        return [...prev, ...newFiltered];
      });

      const nextExists = data.next !== null;
      setHasNext(nextExists);
      setPage(nextPage);
    } catch (err) {
      setError(err.message || 'Error desconegut');
      console.error('Error al carregar historial:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshNeeded) {
      loadHistory(1);
      setRefreshNeeded(false);
    }
  }, [refreshNeeded, loadHistory, setRefreshNeeded]);

  useFocusEffect(
    useCallback(() => {
      loadHistory(1);
    }, [loadHistory])
  );

  const handleEndReached = useCallback(() => {
    if (!loadingRef.current && hasNextRef.current) {
      const next = pageRef.current + 1;
      loadHistory(next);
    }
  }, [loadHistory]);

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
        renderItem={({ item }) => <HistoryItem item={item} theme={theme} />}
        contentContainerStyle={styles.container}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={6}
        windowSize={5}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color={theme.colors.primary} /> : null
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: 20 }}>
              No hi ha registres
            </Text>
          ) : null
        }
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
