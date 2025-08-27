import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../pantallas/login';
import HomeScreen from '../pantallas/home';
import HistoryScreen from '../pantallas/historial';
import UsuarioScreen from '../pantallas/usuario';
import RegisterScreen from '../pantallas/registro';

import NoRippleButton from './NoRippleButton';
import { useTheme } from '../config/contextoEstilo';

import { PlantDefaultTheme, PlantDarkTheme } from '../config/estilo';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../config/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { logout } = useContext(AuthContext);
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <NoRippleButton {...props} />,
        tabBarShowLabel: true,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        },
        tabBarStyle: {
          backgroundColor: isDark ? PlantDarkTheme.colors.card : PlantDefaultTheme.colors.card,
          borderTopWidth: 1,
          borderTopColor: isDark ? PlantDarkTheme.colors.border : PlantDefaultTheme.colors.border,
          height: 85,
        },
        tabBarItemStyle: {
          borderRightWidth: 1,
          borderRightColor: isDark ? PlantDarkTheme.colors.border : PlantDefaultTheme.colors.border,
        },
        tabBarActiveTintColor: isDark ? PlantDarkTheme.colors.text : PlantDefaultTheme.colors.text,
        tabBarInactiveTintColor: isDark ? '#87E2B4' : '#5C9E7C',
      }}
    >
      <Tab.Screen name="Diagnòstic" component={HomeScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
      <Tab.Screen name="Perfil">
        {(props) => <UsuarioScreen {...props} onLogout={logout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const { userToken, loading } = useContext(AuthContext);
  const { isDark } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDark ? PlantDarkTheme : PlantDefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userToken ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
