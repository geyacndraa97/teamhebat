import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';

// Mengimpor komponen LoginScreen dari folder src/screens
import LoginScreen from './src/screens/LoginScreen'; 

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Menampilkan Layar Login */}
      <LoginScreen />
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background dasar aplikasi menggunakan Canvas Cream dari pedoman desain
    backgroundColor: '#F3F0EE', 
  },
});