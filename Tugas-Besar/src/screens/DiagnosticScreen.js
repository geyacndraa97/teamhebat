import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import MainLayout from './MainLayout'; // Pastikan path import ini sama seperti di DashboardScreen

const ESP32_URL = 'http://192.168.13.124/api/sensors';

const DiagnosticScreen = ({ navigation }) => {
  const [status, setStatus] = useState('IDLE');
  const [rawData, setRawData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const testLocalConnection = async () => {
    setStatus('LOADING');
    setRawData(null);
    setErrorMessage('');

    try {
      const response = await axios.get(ESP32_URL, { timeout: 3000 });
      setRawData(response.data);
      setStatus('SUCCESS');
    } catch (error) {
      setStatus('ERROR');
      if (error.code === 'ECONNABORTED') {
        setErrorMessage('TIMEOUT: Robot tidak merespons dalam 3 detik.');
      } else if (error.response) {
        setErrorMessage(`ERROR: Robot menolak request (Status: ${error.response.status})`);
      } else {
        setErrorMessage(`NETWORK ERROR: Tidak ada jalur koneksi ke robot.`);
      }
    }
  };

  return (
    // Membungkus layar dengan MainLayout agar UI konsisten
    <MainLayout navigation={navigation} activeMenu="Diagnostics">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DIRECT DEVICE DIAGNOSTICS</Text>
          <Text style={styles.headerSub}>Axios Local API Fetching</Text>
        </View>

        <View style={styles.controlPanel}>
          <Text style={styles.targetText}>Target URL: {ESP32_URL}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={testLocalConnection}
            disabled={status === 'LOADING'}
          >
            <Text style={styles.buttonText}>
              {status === 'LOADING' ? 'MENGIRIM REQUEST...' : 'TARIK DATA RAW (AXIOS)'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.consoleBox}>
          {status === 'IDLE' && <Text style={styles.consoleTextWaiting}>Menunggu eksekusi...</Text>}
          {status === 'LOADING' && <ActivityIndicator size="large" color="#F37338" />}
          
          {status === 'SUCCESS' && rawData && (
            <View>
              <Text style={styles.consoleTextSuccess}>[200 OK] Respons Diterima:</Text>
              <Text style={styles.consoleTextJson}>{JSON.stringify(rawData, null, 2)}</Text>
            </View>
          )}

          {status === 'ERROR' && (
            <View>
              <Text style={styles.consoleTextError}>[REQUEST GAGAL]</Text>
              <Text style={styles.consoleTextError}>{errorMessage}</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
  header: { marginBottom: 20 },
  headerTitle: { color: '#141413', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#696969', fontSize: 14 },
  controlPanel: { backgroundColor: '#F3F0EE', padding: 15, borderRadius: 15, marginBottom: 20 },
  targetText: { color: '#696969', fontSize: 12, marginBottom: 15, fontFamily: 'monospace' },
  button: { backgroundColor: '#F37338', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  consoleBox: { backgroundColor: '#141413', padding: 15, borderRadius: 15, minHeight: 150 },
  consoleTextWaiting: { color: '#696969', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  consoleTextSuccess: { color: '#00ff00', fontWeight: 'bold', marginBottom: 10, fontFamily: 'monospace' },
  consoleTextJson: { color: '#00ff00', fontFamily: 'monospace', fontSize: 14 },
  consoleTextError: { color: '#ff4444', fontWeight: 'bold', marginBottom: 5, fontFamily: 'monospace' }
});

export default DiagnosticScreen;