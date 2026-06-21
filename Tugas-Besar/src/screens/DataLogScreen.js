import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MainLayout from './MainLayout'; // Pastikan path import benar

const DataLogScreen = ({ navigation }) => {
  const [logData, setLogData] = useState([
    { id: '1', time: '10:45:02', sensor: 'Ultrasonic', value: '24.7 cm' },
    { id: '2', time: '10:45:05', sensor: 'Infrared', value: '842' },
    { id: '3', time: '10:45:08', sensor: 'MPU (AccX)', value: '0.04g' },
    { id: '4', time: '10:46:12', sensor: 'Ultrasonic', value: '18.2 cm' },
    { id: '5', time: '10:46:15', sensor: 'Infrared', value: '910' },
    { id: '6', time: '10:47:01', sensor: 'MPU (GyroZ)', value: '1.5°/s' },
  ]);

  const downloadCSV = async () => {
    if (logData.length === 0) {
      Alert.alert('Peringatan', 'Tidak ada data untuk diunduh.');
      return;
    }
    let csvString = 'Waktu,Nama Sensor,Nilai Pembacaan\n';
    logData.forEach((item) => {
      const safeValue = item.value.replace(/,/g, '.');
      csvString += `${item.time},${item.sensor},${safeValue}\n`;
    });
    const fileUri = FileSystem.documentDirectory + 'Log_Sensor_Gateway.csv';
    try {
      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Unduh Data Log Sensor',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Error', 'Fitur unduh tidak didukung di perangkat ini.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal membuat file CSV.');
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
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.eyebrowContainer}>
          <Text style={styles.eyebrowDot}>•</Text>
          <Text style={styles.eyebrowText}>FIRESTORE DATABASE</Text>
        </View>
        <Text style={styles.mainTitle}>Data Log</Text>
        <Text style={styles.subTitleText}>Riwayat pembacaan sensor secara real-time</Text>
      </View>

      {/* Tombol Unduh CSV */}
      <TouchableOpacity style={styles.downloadButton} onPress={downloadCSV} activeOpacity={0.8}>
        <Text style={styles.downloadButtonText}>Unduh File CSV (.csv)</Text>
      </TouchableOpacity>

      {/* Tabel Log */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colTime]}>Waktu</Text>
          <Text style={[styles.headerText, styles.colSensor]}>Sensor</Text>
          <Text style={[styles.headerText, styles.colValue]}>Nilai</Text>
        </View>
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
      </View>
    </MainLayout>
  );
};

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
});

export default DataLogScreen;