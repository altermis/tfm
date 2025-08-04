// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import AppNavigator from './navegacion/AppNavigator'; 
// import { ThemeProvider } from './config/contextoEstilo';


// export default function App() {
//   return (
//     <ThemeProvider>
//     <>
//       <StatusBar style="auto" />
//       <AppNavigator />
      
//     </>
//     </ThemeProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import AppNavigator from './navegacion/AppNavigator'; 
import { ThemeProvider } from './config/contextoEstilo';
import { RefreshProvider } from './config/RefreshContext';  
import { AuthProvider } from './config/AuthContext';

export default function App() {
  return (
  <AuthProvider>
    <ThemeProvider>
      <RefreshProvider>        
        <>
          <StatusBar style="auto" />
          <AppNavigator />
        </>
      </RefreshProvider>
    </ThemeProvider>
  </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
