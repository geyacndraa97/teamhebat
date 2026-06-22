import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import semua layar (Pastikan penulisan nama filenya persis sama)
import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/dashboard';
import DataLogScreen from './src/screens/DataLogScreen';
import GrafikScreen from './src/screens/grafik'; 

// IMPORT FILE BARU ANDA (Huruf 'c' kecil sesuai nama file)
import CreateAccountScreen from './src/screens/createAccount'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Halaman Login */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        
        {/* HALAMAN CREATE ACCOUNT (Nama rutenya 'CreateAccount') */}
        <Stack.Screen name="createAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
        
        {/* Halaman Lainnya */}
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="DataLog" component={DataLogScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Grafik" component={GrafikScreen} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}