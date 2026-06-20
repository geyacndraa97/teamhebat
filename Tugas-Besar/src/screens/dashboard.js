import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Membaca data real-time dari Firestore (Koleksi: sensors, Dokumen: data_sensor)
    const unsub = onSnapshot(doc(db, "sensors", "data_sensor"), (docSnap) => {
      if (docSnap.exists()) {
        setSensorData(docSnap.data());
      } else {
        console.log("Dokumen tidak ditemukan di Firestore!");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error mengambil data Firestore: ", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Dashboard</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0056b3" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Nilai Ultrasonik:</Text>
          <Text style={styles.value}>
            {sensorData && sensorData.ultrasonik ? sensorData.ultrasonik : "Belum ada data"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
  padding: 30,
  backgroundColor: '#fff',
  borderRadius: 15,
  // Menggunakan boxShadow agar ramah untuk web browser sekaligus mobile
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', 
  elevation: 3, // Tetap biarkan untuk bayangan di Android asli
  alignItems: 'center',
  width: '80%',
},
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0056b3',
    marginTop: 10,
  },
});