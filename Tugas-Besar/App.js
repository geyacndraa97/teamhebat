import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/dashboard';
import DataLogScreen from './src/screens/DataLogScreen';
import GrafikScreen from './src/screens/grafik'; // <--- TAMBAHKAN IMPORT INI

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="DataLog" component={DataLogScreen} options={{ headerShown: false }} />
        {/* TAMBAHKAN SCREEN GRAFIK DI SINI */}
        <Stack.Screen name="Grafik" component={GrafikScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}