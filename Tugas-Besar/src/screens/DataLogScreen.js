import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MainLayout from './MainLayout';

// IMPORT FUNGSI AXIOS KITA
import { fetchSensorData } from '../services/apiService';

const DataLogScreen = ({ navigation }) => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const result = await fetchSensorData();
      
      if (isMounted) {
        if (result.success) {
          const now = new Date();
          // Format waktu misal 16:37:05
          const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          // Mengubah data tunggal API menjadi array format log
          const newLogs = [
            {
              id: `ultrasonic-${now.getTime()}`,
              time: formattedTime,
              sensor: 'Ultrasonic',
              value: `${result.data.ultrasonic.distance} cm`
            },
            {
              id: `tcrt-${now.getTime()}`,
              time: formattedTime,
              sensor: 'Infrared (TCRT)',
              value: result.data.tcrt.value.toString()
            },
            {
              id: `mpu-${now.getTime()}`,
              time: formattedTime,
              sensor: 'MPU (AccX)',
              value: result.data.mpu.accX.toString()
            }
          ];

          // Menambahkan log baru ke log lama, dibatasi maksimal 100 log agar memori tidak penuh
          setLogData(prevLogs => {
            const updatedLogs = [...newLogs, ...prevLogs];
            return updatedLogs.slice(0, 100); 
          });
        }
        setLoading(false);
      }
    };

    // Panggil pertama kali
    loadData();

    // Polling setiap 3 detik
    const intervalId = setInterval(() => {
      loadData();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const downloadCSV = async () => {
    if (logData.length === 0) {
      Alert.alert('Peringatan', 'Tidak ada data untuk diunduh.');
      return;
    }

    try {
      let csvString = 'Waktu,Nama Sensor,Nilai Pembacaan\n';
      
      logData.forEach((item) => {
        // PENCEGAHAN CRASH: Pastikan semua data dikonversi ke String terlebih dahulu
        const safeTime = item.time ? String(item.time) : '-';
        const safeSensor = item.sensor ? String(item.sensor).replace(/,/g, ' ') : '-';
        const safeValue = item.value ? String(item.value).replace(/,/g, '.') : '-';
        
        csvString += `${safeTime},${safeSensor},${safeValue}\n`;
      });

      // Gunakan nama file unik dengan timestamp agar tidak bentrok dengan cache file lama
      const fileName = `Log_Sensor_Gateway_${Date.now()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Menulis string menjadi file CSV di penyimpanan lokal aplikasi
      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Memeriksa apakah fitur sharing tersedia di perangkat
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Membuka jendela pop-up unduh / berbagi bawaan HP
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Unduh Data Log Sensor',
          UTI: 'public.comma-separated-values-text', // Format khusus untuk iOS
        });
      } else {
        Alert.alert('Error', 'Fitur unduh/berbagi tidak didukung di perangkat ini.');
      }
    } catch (error) {
      console.error("Detail Error CSV:", error);
      Alert.alert('Error', 'Gagal membuat atau mengunduh file CSV.');
    }
  };

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cellText, styles.colTime]}>{item.time}</Text>
      <Text style={[styles.cellText, styles.colSensor]}>{item.sensor}</Text>
      <Text style={[styles.cellValue, styles.colValue]}>{item.value}</Text>
    </View>
  );

  return (
    <MainLayout navigation={navigation} activeMenu="DataLog">
      <View style={styles.headerContainer}>
        <View style={styles.eyebrowContainer}>
          <Text style={styles.eyebrowDot}>•</Text>
          <Text style={styles.eyebrowText}>SESSION DATA LOG</Text>
        </View>
        <Text style={styles.mainTitle}>Data Log</Text>
        <Text style={styles.subTitleText}>Riwayat pembacaan sensor sesi ini</Text>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={downloadCSV} activeOpacity={0.8}>
        <Text style={styles.downloadButtonText}>Unduh File CSV (.csv)</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colTime]}>Waktu</Text>
          <Text style={[styles.headerText, styles.colSensor]}>Sensor</Text>
          <Text style={[styles.headerText, styles.colValue]}>Nilai</Text>
        </View>
        
        {loading && logData.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CF4500" />
            <Text style={styles.loadingText}>Menarik data dari server...</Text>
          </View>
        ) : (
          <FlatList
            data={logData}
            keyExtractor={(item) => item.id}
            renderItem={renderTableRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada data log yang tersimpan.</Text>
            }
          />
        )}
      </View>
    </MainLayout>
  );
};

// Desain UI Stylesheet dikembalikan sesuai versi lama
const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    marginTop: 65, 
    marginBottom: 20,
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  downloadButton: {
    backgroundColor: '#141413',
    marginHorizontal: 24,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  downloadButtonText: {
    color: '#F3F0EE',
    fontSize: 15,
    fontWeight: '600',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 19, 0.05)',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 20, 19, 0.05)',
  },
  headerText: {
    fontSize: 12,
    color: '#696969',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 20, 19, 0.02)',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#696969',
    textTransform: 'capitalize', 
  },
  cellValue: {
    fontSize: 15,
    color: '#141413',
    fontWeight: '600',
  },
  colTime: { flex: 1 },
  colSensor: { flex: 1.5 },
  colValue: { flex: 1, textAlign: 'right' },
  listContent: { paddingBottom: 24 },
  emptyText: {
    textAlign: 'center',
    color: '#696969',
    marginTop: 40,
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#696969',
    fontSize: 14,
  }
});

export default DataLogScreen;