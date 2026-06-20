import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Menyembunyikan header atas saat login
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ title: 'IoT Console Dashboard' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}