import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  // State untuk mengontrol visibilitas Hamburger Menu (Drawer)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Kredensial & status fiktif sistem IoT untuk data realistis
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
    <SafeAreaView style={styles.safeArea}>
      {/* --- Top Floating Navigation Bar --- */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.hamburgerButton} 
          onPress={() => setIsDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, { width: 18 }]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        
        <View style={styles.systemBadgeContainer}>
          <Text style={styles.systemBadgeText}>{systemStatus.broker}</Text>
        </View>
      </View>

      {/* --- Main Dashboard Content --- */}
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

        {/* --- 3 Sensor Cards Section --- */}
        <View style={styles.cardsContainer}>
          
          {/* Card 1: Ultrasonic Sensor */}
          <View style={styles.sensorCard}>
            <View style={styles.cardEyebrowRow}>
              <Text style={styles.cardDot}>•</Text>
              <Text style={styles.cardEyebrow}>HC-SR04 ULTRASONIC</Text>
            </View>
            <Text style={styles.sensorValue}>{dummySensorData.ultrasonic.distance}</Text>
            <Text style={styles.sensorSubText}>Status: {dummySensorData.ultrasonic.status}</Text>
          </View>

          {/* Card 2: TCRT5000 Sensor */}
          <View style={styles.sensorCard}>
            <View style={styles.cardEyebrowRow}>
              <Text style={styles.cardDot}>•</Text>
              <Text style={styles.cardEyebrow}>TCRT5000 INFRARED</Text>
            </View>
            <Text style={styles.sensorValue}>{dummySensorData.tcrt.value}</Text>
            <Text style={styles.sensorSubText}>Condition: {dummySensorData.tcrt.condition}</Text>
          </View>

          {/* Card 3: MPU6050 Sensor */}
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

      {/* --- Hamburger Side Menu Overlay (Drawer) --- */}
      {isDrawerOpen && (
        <View style={styles.drawerOverlay}>
          {/* Sisi Luar Menu untuk Menutup Drawer */}
          <TouchableOpacity 
            style={styles.drawerCloseTrigger} 
            onPress={() => setIsDrawerOpen(false)} 
            activeOpacity={1}
          />
          
          {/* Konten Menu Utama (Ink Black Surface) */}
          <View style={styles.drawerMenu}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setIsDrawerOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity style={[styles.menuItem, styles.menuItemActive]} onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.menuItemTextActive}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Navigasi ke Data Log")}>
                <Text style={styles.menuItemText}>Data Log</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Navigasi ke Grafik")}>
                <Text style={styles.menuItemText}>Grafik</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>Node Gateway v1.0.2</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Base Layout
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0EE', // Canvas Cream
  },
  topBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#F3F0EE',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  // Hamburger Icon Styling
  hamburgerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#141413', // Ink Black
    marginBottom: 5,
    borderRadius: 2,
  },
  systemBadgeContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999, // Pill Shape
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 19, 0.1)',
  },
  systemBadgeText: {
    fontSize: 12,
    color: '#696969', // Slate Gray
    fontWeight: '500',
  },

  // Header Typography
  headerSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyebrowDot: {
    color: '#CF4500', // Signal Orange
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
    fontSize: 36, // H2 Scale
    fontWeight: '500',
    letterSpacing: -0.72, // -2% letter-spacing
    lineHeight: 44,
  },
  subTitleText: {
    color: '#696969',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '400',
  },

  // Sensor Cards Styling (40px Radius Scale)
  cardsContainer: {
    gap: 24,
  },
  sensorCard: {
    backgroundColor: '#FFFFFF', // White Surface
    borderRadius: 40, // Extreme Container Radius
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
    color: '#F37338', // Light Signal Orange untuk penanda internal card
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
    fontSize: 40, // Ukuran data menonjol
    fontWeight: '500',
    letterSpacing: -0.8,
    marginVertical: 4,
  },
  sensorSubText: {
    color: '#696969',
    fontSize: 14,
    marginTop: 4,
  },

  // MPU Custom Sub-Grid
  mpuGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    backgroundColor: '#F3F0EE', // Ditampung di atas permukaan cream lembut
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

  // Hamburger Side Menu Overlay (Drawer)
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 9999,
  },
  drawerCloseTrigger: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 19, 0.4)', // Meredupkan latar belakang dengan halus
  },
  drawerMenu: {
    width: width * 0.75, // Mengambil 75% lebar layar hp
    backgroundColor: '#141413', // Dark Warm-Black Surface
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#F3F0EE',
    fontSize: 20,
  },
  menuItemsContainer: {
    flex: 1,
    gap: 16,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999, // Bentuk pil untuk navigasi item aktif/terpilih
  },
  menuItemActive: {
    backgroundColor: '#F3F0EE', // Latar belakang cream saat aktif
  },
  menuItemText: {
    color: '#D1CDC7', // Muted text pada mode gelap
    fontSize: 18,
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#141413', // Teks hitam pekat di atas pill cream
    fontSize: 18,
    fontWeight: '500',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(243, 240, 238, 0.1)',
    paddingTop: 16,
  },
  drawerFooterText: {
    color: '#696969',
    fontSize: 12,
  },
});

export default DashboardScreen;