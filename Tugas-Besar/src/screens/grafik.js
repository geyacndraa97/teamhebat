import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MainLayout from './MainLayout'; 

// Import konfigurasi database Firebase Anda
import { db } from '../firebaseConfig'; 
import { doc, onSnapshot } from "firebase/firestore"; 

const { width } = Dimensions.get('window');

const GrafikScreen = ({ navigation }) => {
  // State untuk menyimpan antrean riwayat data grafik (maksimal 5 titik data)
  const [labelsTime, setLabelsTime] = useState(["-", "-", "-", "-", "-"]);
  const [ultrasonicHistory, setUltrasonicHistory] = useState([0, 0, 0, 0, 0]);
  const [infraredHistory, setInfraredHistory] = useState([0, 0, 0, 0, 0]);
  const [accXHistory, setAccXHistory] = useState([0, 0, 0, 0, 0]);
  const [accYHistory, setAccYHistory] = useState([0, 0, 0, 0, 0]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Referensi ke dokumen 'data sensor' di Firestore
    const docRef = doc(db, 'sensors', 'data sensor');

    // Berlangganan data Firestore secara Real-time
    const unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();

        // 1. Dapatkan waktu saat ini untuk label X-Axis (Format HH:mm:ss)
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        // 2. Ekstrak nilai angka dari string database (misal "24.7 cm" -> 24.7 atau "0.04g" -> 0.04)
        const rawDistance = data.ultrasonic?.distance || "0";
        const distanceVal = parseFloat(rawDistance);

        const rawInfrared = data.tcrt?.value || "0";
        const infraredVal = parseFloat(rawInfrared);

        const rawAccX = data.mpu?.accX || "0";
        const accXVal = parseFloat(rawAccX);

        const rawAccY = data.mpu?.accY || "0";
        const accYVal = parseFloat(rawAccY);

        // 3. Masukkan data baru ke dalam array state dan buang data terlama (Rolling FIFO Buffer)
        setLabelsTime((prev) => [...prev.slice(1), timeString]);
        setUltrasonicHistory((prev) => [...prev.slice(1), distanceVal]);
        setInfraredHistory((prev) => [...prev.slice(1), infraredVal]);
        setAccXHistory((prev) => [...prev.slice(1), accXVal]);
        setAccYHistory((prev) => [...prev.slice(1), accYVal]);
      } else {
        console.log('Dokumen tidak ditemukan di Firestore!');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching grafik data: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Format data objek untuk dimasukkan ke komponen LineChart kit
  const dataUltrasonic = {
    labels: labelsTime,
    datasets: [{ data: ultrasonicHistory }]
  };

  const dataInfrared = {
    labels: labelsTime,
    datasets: [{ data: infraredHistory }]
  };

  const dataMPU = {
    labels: labelsTime,
    datasets: [
      {
        data: accXHistory,
        color: (opacity = 1) => `rgba(207, 69, 0, ${opacity})`, // Signal Orange
      },
      {
        data: accYHistory,
        color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`, // Ink Black
      }
    ],
    legend: ["AccX (g)", "AccY (g)"]
  };

  // Konfigurasi desain grafik asli Anda
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(105, 105, 105, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#CF4500",
    },
    decimalPlaces: 1,
  };

  const chartWidth = width - 48 - 48; 

  return (
    <MainLayout navigation={navigation} activeMenu="Grafik">
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.eyebrowContainer}>
            <Text style={styles.eyebrowDot}>•</Text>
            <Text style={styles.eyebrowText}>VISUALISASI DATA</Text>
          </View>
          <Text style={styles.mainTitle}>Grafik Sensor</Text>
          <Text style={styles.subTitleText}>Tren data dari Firebase secara real-time</Text>
        </View>

        {/* Cek status loading saat aplikasi pertama kali membaca data Firebase */}
        {loading ? (
          <ActivityIndicator size="large" color="#CF4500" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.cardsContainer}>
            
            {/* Chart 1: Ultrasonic */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Jarak Ultrasonik (cm)</Text>
              <LineChart
                data={dataUltrasonic}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chartStyle}
              />
            </View>

            {/* Chart 2: Infrared */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Pembacaan Inframerah (Analog)</Text>
              <LineChart
                data={dataInfrared}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chartStyle}
              />
            </View>

            {/* Chart 3: MPU6050 */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Akselerometer MPU6050</Text>
              <LineChart
                data={dataMPU}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chartStyle}
              />
            </View>

          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

// Stylesheet desain asli milik Anda
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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 19, 0.05)',
    alignItems: 'center',
  },
  chartTitle: {
    color: '#141413',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  }
});

export default GrafikScreen;