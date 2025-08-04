import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { loginUser } from '../config/api';
import { AuthContext } from '../config/AuthContext';
import { useTheme } from '../config/contextoEstilo';

const screenWidth = Dimensions.get('window').width;

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      if (data.access) {
        await login(data.access);
      } else {
        setError(data.detail || 'Credencials incorrectes');
      }
    } catch {
      setError('Error de connexió');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Iniciar sessió</Text>

      <TextInput
        placeholder="Usuari"
        onChangeText={setUsername}
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        autoCapitalize="none"
        value={username}
        placeholderTextColor={theme.colors.primary}
      />
      <TextInput
        placeholder="Contrasenya"
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
        value={password}
        placeholderTextColor={theme.colors.primary}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[theme.button, styles.button, { backgroundColor: theme.colors.buttonBackground }]}
      >
        <Text style={[theme.buttonText, { color: theme.colors.buttonText }]}>Inicia sessió</Text>
      </TouchableOpacity>

      {error ? <Text style={[styles.error, { color: 'red' }]}>{error}</Text> : null}

      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() => navigation.navigate('Register')}
      >
        No tens compte? Registra’t
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
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
});
