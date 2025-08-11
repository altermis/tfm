import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { API_BASE } from '../config/ip';
import { AuthContext } from '../config/AuthContext';
import { useTheme } from '../config/contextoEstilo';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access) {
        await login(data.access);
      } else {
        setError(data.error || 'Error en el registre');
      }
    } catch {
      setError('Error de connexió');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Registra't</Text>

      <TextInput
        placeholder="Nom d'usuari"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholderTextColor={theme.colors.primary}
      />
      <TextInput
        placeholder="Contrasenya"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        placeholderTextColor={theme.colors.primary}
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={[theme.button, styles.button, { backgroundColor: theme.colors.buttonBackground }]}
      >
        <Text style={[theme.buttonText, { color: theme.colors.buttonText }]}>Registrar-se</Text>
      </TouchableOpacity>
      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        Ja tens compte? Inicia sessió
      </Text>
      {error ? <Text style={[styles.error, { color: 'red' }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    width: '70%',
    alignSelf: 'center',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  error: {
    marginTop: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});
