
// import React from 'react';
// import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
// import { useTheme } from '../config/contextoEstilo';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function AjustesScreen({ onLogout }) {
//   const { isDark, toggleTheme, theme } = useTheme();

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
//     <View style={styles.header}>
//         <Text style={[styles.title, { color: theme.colors.text }]}>Perfil</Text>
//       </View>
      
//       <Text style={[styles.sectionTitle, { marginTop: 25, color: theme.colors.text }]}>
//         Configuració de l'aplicació
//       </Text>
//       <View style={styles.settingRow}>
//         <Text style={[styles.settingText, { color: theme.colors.text }]}>Mode fosc</Text>
//         <Switch
//           value={isDark}
//           onValueChange={toggleTheme}
//           trackColor={{ false: '#aaa', true: theme.colors.primary }}
//           thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
//         />
//       </View>

//       <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Usuari</Text>
//       <View style={styles.logout}>
//         <TouchableOpacity onPress={onLogout}>
//           <Text style={[styles.logoutText, { color: theme.colors.primary }]}>Tancar sessió</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Suport</Text>
//       <View style={styles.supportBox}>
//         <Text style={[styles.settingText, { color: theme.colors.text }]}>
//           Tens algun problema o dubte?
//         </Text>
//         <Text style={[styles.supportText, { color: theme.colors.primary }]}>
//           Contacta amb nosaltres: suport@tfm.com
//         </Text>
//       </View>

//     </SafeAreaView>
//   );
// }

import React, { useContext } from 'react';
import { AuthContext } from '../config/AuthContext';  // ruta segons la teva estructura
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../config/contextoEstilo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AjustesScreen() {
  const { isDark, toggleTheme, theme } = useTheme();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Perfil</Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 25, color: theme.colors.text }]}>
        Configuració de l'aplicació
      </Text>
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: theme.colors.text }]}>Mode fosc</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#aaa', true: theme.colors.primary }}
          thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Usuari</Text>
      <View style={styles.logout}>
        <TouchableOpacity onPress={logout}>
          <Text style={[styles.logoutText, { color: theme.colors.primary }]}>Tancar sessió</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Suport</Text>
      <View style={styles.supportBox}>
        <Text style={[styles.settingText, { color: theme.colors.text }]}>
          Tens algun problema o dubte?
        </Text>
        <Text style={[styles.supportText, { color: theme.colors.primary }]}>
          Contacta amb nosaltres: suport@tfm.com
        </Text>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  logout: {
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportBox: {
    marginBottom: 20,
  },
  supportText: {
    fontSize: 16,
    marginTop: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
