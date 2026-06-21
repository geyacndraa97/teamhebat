import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainLayout from './MainLayout'; // Pastikan path import benar

const DashboardScreen = ({ navigation }) => {
  const systemStatus = {
    broker: "Connected (HiveMQ)",
    sync: "Up to date (Firebase)",
    latency: "42ms",
  };

  const dummySensorData = {
    ultrasonic: { distance: "24.7 cm", status: "Object Detected" },
    tcrt: { value: "842", condition: "Line Tracking Active" },
    mpu: { accX: "0.04g", accY: "-0.15g", accZ: "0.98g", gyroX: "1.2°/s" }
  };

  return (
    <MainLayout 
      navigation={navigation} 
      activeMenu="Dashboard" 
      systemStatus={systemStatus.broker}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Dashboard */}
        <View style={styles.headerSection}>
          <View style={styles.eyebrowContainer}>
            <Text style={styles.eyebrowDot}>•</Text>
            <Text style={styles.eyebrowText}>GATEWAY CONSOLE</Text>
          </View>
          <Text style={styles.mainTitle}>System Overview</Text>
          <Text style={styles.subTitleText}>Firebase Sync: {systemStatus.sync} • Latency: {systemStatus.latency}</Text>
        </View>

        {/* Sensor Cards Section */}
        <View style={styles.cardsContainer}>
          <View style={styles.sensorCard}>
            <View style={styles.cardEyebrowRow}>
              <Text style={styles.cardDot}>•</Text>
              <Text style={styles.cardEyebrow}>HC-SR04 ULTRASONIC</Text>
            </View>
            <Text style={styles.sensorValue}>{dummySensorData.ultrasonic.distance}</Text>
            <Text style={styles.sensorSubText}>Status: {dummySensorData.ultrasonic.status}</Text>
          </View>

          <View style={styles.sensorCard}>
            <View style={styles.cardEyebrowRow}>
              <Text style={styles.cardDot}>•</Text>
              <Text style={styles.cardEyebrow}>TCRT5000 INFRARED</Text>
            </View>
            <Text style={styles.sensorValue}>{dummySensorData.tcrt.value}</Text>
            <Text style={styles.sensorSubText}>Condition: {dummySensorData.tcrt.condition}</Text>
          </View>

          <View style={styles.sensorCard}>
            <View style={styles.cardEyebrowRow}>
              <Text style={styles.cardDot}>•</Text>
              <Text style={styles.cardEyebrow}>MPU6050 GYRO & ACCEL</Text>
            </View>
            <View style={styles.mpuGridRow}>
              <View style={styles.mpuGridItem}>
                <Text style={styles.mpuLabel}>ACCEL X</Text>
                <Text style={styles.mpuValue}>{dummySensorData.mpu.accX}</Text>
              </View>
              <View style={styles.mpuGridItem}>
                <Text style={styles.mpuLabel}>ACCEL Y</Text>
                <Text style={styles.mpuValue}>{dummySensorData.mpu.accY}</Text>
              </View>
              <View style={styles.mpuGridItem}>
                <Text style={styles.mpuLabel}>ACCEL Z</Text>
                <Text style={styles.mpuValue}>{dummySensorData.mpu.accZ}</Text>
              </View>
            </View>
            <Text style={styles.sensorSubText}>Gyroscope Rotation X: {dummySensorData.mpu.gyroX}</Text>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 65, // <--- Tambahkan baris ini
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
});

export default DashboardScreen;