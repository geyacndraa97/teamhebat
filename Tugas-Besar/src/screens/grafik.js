import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MainLayout from './MainLayout'; // Sesuaikan path jika berbeda

const { width } = Dimensions.get('window');

const GrafikScreen = ({ navigation }) => {
  // Dummy data array (Nantinya diganti dengan data dari Firebase)
  const labelsTime = ["10:00", "10:05", "10:10", "10:15", "10:20"];

  const dataUltrasonic = {
    labels: labelsTime,
    datasets: [{ data: [24.7, 22.1, 18.5, 15.0, 12.4] }] // Jarak dalam cm
  };

  const dataInfrared = {
    labels: labelsTime,
    datasets: [{ data: [842, 850, 910, 420, 210] }] // Nilai analog
  };

  const dataMPU = {
    labels: labelsTime,
    datasets: [
      {
        data: [0.04, 0.06, 0.02, -0.01, 0.05], // AccX
        color: (opacity = 1) => `rgba(207, 69, 0, ${opacity})`, // Signal Orange
      },
      {
        data: [-0.15, -0.12, -0.10, -0.14, -0.16], // AccY
        color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`, // Ink Black
      }
    ],
    legend: ["AccX (g)", "AccY (g)"]
  };

  // Konfigurasi desain grafik
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`, // Ink Black untuk garis default
    labelColor: (opacity = 1) => `rgba(105, 105, 105, ${opacity})`, // Slate Gray untuk teks
    strokeWidth: 2, // Ketebalan garis
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#CF4500", // Signal Orange untuk titik
    },
    decimalPlaces: 1, // Angka di belakang koma
  };

  // Lebar grafik dikurangi padding kiri-kanan layar dan card
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

        {/* Chart Container */}
        <View style={styles.cardsContainer}>
          
          {/* Chart 1: Ultrasonic */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Jarak Ultrasonik (cm)</Text>
            <LineChart
              data={dataUltrasonic}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier // Membuat garis melengkung halus
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

          {/* Chart 3: MPU6050 (Multi-line) */}
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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32, // Sesuai dengan bahasa desain aplikasi Anda
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