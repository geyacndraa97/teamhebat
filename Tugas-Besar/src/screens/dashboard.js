import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import MainLayout from './MainLayout'; 

// Import fungsi Axios (Pastikan path-nya sudah benar)
import { fetchSensorData } from '../services/apiService'; 

const DashboardScreen = ({ navigation }) => {
  const systemStatus = {
    broker: "Connected (Axios Polling)", 
    sync: "Up to date (REST API)",
    latency: "42ms",
  };

  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 

    // Fungsi untuk menarik data via Axios
    const loadData = async () => {
      const result = await fetchSensorData();
      
      if (isMounted) {
        if (result.success) {
          setSensorData(result.data);
        } else {
          console.log(result.message);
        }
        setLoading(false);
      }
    };

    // 1. Panggil pertama kali saat layar dibuka
    loadData();

    // 2. Buat interval untuk memanggil data setiap 3 detik
    const intervalId = setInterval(() => {
      loadData();
    }, 3000);

    // 3. Bersihkan interval saat pindah layar
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <MainLayout 
      navigation={navigation} 
      activeMenu="Dashboard" 
      systemStatus={systemStatus.broker}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.eyebrowContainer}>
            <Text style={styles.eyebrowDot}>•</Text>
            <Text style={styles.eyebrowText}>GATEWAY CONSOLE</Text>
          </View>
          <Text style={styles.mainTitle}>System Overview</Text>
          <Text style={styles.subTitleText}>
            REST API Sync: {systemStatus.sync} • Latency: {systemStatus.latency}
          </Text>
        </View>

        {/* Render Konten Berdasarkan Status Loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#F37338" style={{ marginTop: 50 }} />
        ) : sensorData ? (
          <View style={styles.cardsContainer}>
            
            {/* CARD 1: HC-SR04 ULTRASONIC */}
            <View style={styles.sensorCard}>
              <View style={styles.cardEyebrowRow}>
                <Text style={styles.cardDot}>•</Text>
                <Text style={styles.cardEyebrow}>HC-SR04 ULTRASONIC</Text>
              </View>
              <Text style={styles.sensorValue}>
                {sensorData.ultrasonic?.distance || '0'} cm
              </Text>
              <Text style={styles.sensorSubText}>
                Status: {sensorData.ultrasonic?.status || 'Unknown'}
              </Text>
            </View>

            {/* CARD 2: TCRT5000 INFRARED */}
            <View style={styles.sensorCard}>
              <View style={styles.cardEyebrowRow}>
                <Text style={styles.cardDot}>•</Text>
                <Text style={styles.cardEyebrow}>TCRT5000 INFRARED</Text>
              </View>
              <Text style={styles.sensorValue}>
                {sensorData.tcrt?.value || '0'}
              </Text>
              <Text style={styles.sensorSubText}>
                Condition: {sensorData.tcrt?.condition || 'Unknown'}
              </Text>
            </View>

            {/* CARD 3: MPU6050 GYRO & ACCEL */}
            <View style={styles.sensorCard}>
              <View style={styles.cardEyebrowRow}>
                <Text style={styles.cardDot}>•</Text>
                <Text style={styles.cardEyebrow}>MPU6050 GYRO & ACCEL</Text>
              </View>
              <View style={styles.mpuGridRow}>
                <View style={styles.mpuGridItem}>
                  <Text style={styles.mpuLabel}>ACCEL X</Text>
                  <Text style={styles.mpuValue}>{sensorData.mpu?.accX || '0'}</Text>
                </View>
                <View style={styles.mpuGridItem}>
                  <Text style={styles.mpuLabel}>ACCEL Y</Text>
                  <Text style={styles.mpuValue}>{sensorData.mpu?.accY || '0'}</Text>
                </View>
                <View style={styles.mpuGridItem}>
                  <Text style={styles.mpuLabel}>ACCEL Z</Text>
                  <Text style={styles.mpuValue}>{sensorData.mpu?.accZ || '0'}</Text>
                </View>
              </View>
              <Text style={styles.sensorSubText}>
                Gyroscope Rotation X: {sensorData.mpu?.gyroX || '0'}
              </Text>
            </View>

          </View>
        ) : (
          <Text style={styles.noDataText}>Data tidak tersedia di database</Text>
        )}
      </ScrollView>
    </MainLayout>
  );
};

// Desain UI Stylesheet dikembalikan ke sini
const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 48,
  },
  headerSection: {
    marginTop: 10,
    marginBottom: 40,
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyebrowDot: {
    color: '#CF4500',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  eyebrowText: {
    color: '#696969',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.52,
    textTransform: 'uppercase',
  },
  mainTitle: {
    color: '#141413',
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: -0.72,
    lineHeight: 44,
  },
  subTitleText: {
    color: '#696969',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '400',
  },
  cardsContainer: {
    gap: 24,
  },
  sensorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 19, 0.05)',
  },
  cardEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDot: {
    color: '#F37338',
    fontSize: 12,
    marginRight: 6,
  },
  cardEyebrow: {
    color: '#696969',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.48,
  },
  sensorValue: {
    color: '#141413',
    fontSize: 40,
    fontWeight: '500',
    letterSpacing: -0.8,
    marginVertical: 4,
  },
  sensorSubText: {
    color: '#696969',
    fontSize: 14,
    marginTop: 4,
  },
  mpuGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    backgroundColor: '#F3F0EE',
    borderRadius: 20,
    padding: 16,
  },
  mpuGridItem: {
    flex: 1,
  },
  mpuLabel: {
    fontSize: 10,
    color: '#696969',
    fontWeight: '700',
    marginBottom: 2,
  },
  mpuValue: {
    fontSize: 16,
    color: '#141413',
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center', 
    marginTop: 20, 
    color: '#696969', 
    fontSize: 16
  }
});

export default DashboardScreen;