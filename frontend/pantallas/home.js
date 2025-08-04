import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { predictImage } from '../config/api';
import { useTheme } from '../config/contextoEstilo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { diagnosticMap } from '../data/diagnostics';
import { useRefresh } from '../config/RefreshContext';
import { API_BASE } from '../config/ip';

import { useApiFetch } from '../config/apiFetch';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const { setRefreshNeeded } = useRefresh();
  const apiFetch = useApiFetch();

  const pickImage = async () => {
  
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Es necessita permís per accedir a la galeria');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
  
    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setResult(null);
    }
  };
  
  const takePhoto = async () => {
  
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Es necessita permís per usar la càmera');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      // mediaTypes: ImagePicker.MediaType.Images, no  funciona be  llibreria actual
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
  
    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
      setResult(null);
    }
  };
  
  


const handlePredict = async () => {
  if (!imageUri) return;

  try {
    const data = await apiFetch(`${API_BASE}/predict/`, { 
      method: 'POST',
      body: (() => {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
        return formData;
      })(),
    });

    let parsedResult = null;

    try {
      if (typeof data.result === 'string') {
        parsedResult = JSON.parse(data.result.replace(/'/g, '"'));
      } else {
        parsedResult = data.result;
      }
    } catch (e) {
      console.error('Error al parsejar result:', e);
      setResult({
        title: 'Error en el format de la resposta',
        recommendation: null,
        confidence: 0,
      });
      return;
    }

    if (parsedResult?.class) {
      const info = diagnosticMap[parsedResult.class] || {};
      setResult({
        original: parsedResult.class,
        title: info.title || parsedResult.class,
        recommendation: info.recommendation || null,
        confidence: parsedResult.confidence,
      });

      setRefreshNeeded(true);
    } else {
      setResult({
        title: 'No s’ha pogut identificar',
        recommendation: null,
        confidence: 0,
      });
    }
  } catch (error) {
    console.error('Error en la predicció:', error.message);
    setResult({
      title: 'Error de connexió o autenticació',
      recommendation: null,
      confidence: 0,
    });
  }
};
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Diagnòstic de plantes</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <MaterialIcons name="image-search" size={48} color={theme.colors.primary} />
          <Text style={{ color: theme.colors.text, opacity: 0.6, marginTop: 10, textAlign: 'center' }}>
            Selecciona o captura una imatge per a diagnosticar
          </Text>
        </View>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
            {result.title}
          </Text>
          {result.recommendation && (
            <Text style={[styles.resultRecommendation, { color: theme.colors.text }]}>
              Recomanació: {result.recommendation}
            </Text>
          )}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={pickImage}
          style={[
            theme.button,
            styles.smallButton,
            { backgroundColor: theme.colors.buttonBackground, alignSelf: 'flex-start' }
          ]}
        >
          <Text style={[theme.buttonText, { color: theme.colors.buttonText }]}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePhoto}
          style={[
            theme.button,
            styles.smallButton,
            { backgroundColor: theme.colors.buttonBackground, alignSelf: 'flex-start' }
          ]}
        >
          <Text style={[theme.buttonText, { color: theme.colors.buttonText }]}>Càmera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handlePredict}
        style={[
          theme.button,
          styles.fullButton,
          {
            backgroundColor: theme.colors.buttonBackground,
            alignSelf: 'center',
            marginTop: 20
          }
        ]}
      >
        <Text style={[theme.buttonText, { color: theme.colors.buttonText }]}>Diagnosticar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholder: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 20,
  },
  resultBox: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#00000020',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  resultRecommendation: {
    fontSize: 14,
  },
  smallButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  fullButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
