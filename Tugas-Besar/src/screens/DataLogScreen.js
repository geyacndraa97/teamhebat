import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import DateTimePicker from '@react-native-community/datetimepicker';
// IMPORT ASYNC STORAGE UNTUK SIMPAN DATA PERMANEN
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainLayout from './MainLayout';
import { fetchSensorData } from '../services/apiService';

const STORAGE_KEY = '@sensor_logs_v1';

const DataLogScreen = ({ navigation }) => {
  const [ultrasonicLogs, setUltrasonicLogs] = useState([]);
  const [tcrtLogs, setTcrtLogs] = useState([]);
  const [mpuLogs, setMpuLogs] = useState([]);
  
  // STATE UNTUK HALAMAN MASING-MASING TABEL (PAGINATION)
  const [pageUltra, setPageUltra] = useState(0);
  const [pageTcrt, setPageTcrt] = useState(0);
  const [pageMpu, setPageMpu] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const lastDataRef = useRef(null);

  // EFEK 1: AMBIL DATA LOKAL & MULAI POLLING API
  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const initializeData = async () => {
      // 1. Tarik riwayat data yang tersimpan di HP agar tidak hilang saat pindah menu
      try {
        const savedLogs = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLogs && isMounted) {
          const parsed = JSON.parse(savedLogs);
          setUltrasonicLogs(parsed.ultra || []);
          setTcrtLogs(parsed.tcrt || []);
          setMpuLogs(parsed.mpu || []);
        }
      } catch (error) {
        console.error("Gagal memuat data lokal:", error);
      }

      // 2. Fungsi penarikan dari server
      const loadData = async () => {
        const result = await fetchSensorData();
        
        if (isMounted) {
          if (result.success) {
            const currentDataString = JSON.stringify(result.data);
            if (lastDataRef.current === currentDataString) {
              setLoading(false);
              return;
            }
            lastDataRef.current = currentDataString;

            const now = new Date();
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const formattedDate = now.toISOString().split('T')[0];
            const timestamp = now.getTime();

            // Simpan riwayat maksimal 100 data agar memori HP tidak penuh
            setUltrasonicLogs(prev => [
              { id: `ultrasonic-${timestamp}`, date: formattedDate, time: formattedTime, timestamp, value: `${result.data.ultrasonic.distance} cm` },
              ...prev
            ].slice(0, 100));

            setTcrtLogs(prev => [
              { id: `tcrt-${timestamp}`, date: formattedDate, time: formattedTime, timestamp, value: result.data.tcrt.value.toString() },
              ...prev
            ].slice(0, 100));

            setMpuLogs(prev => [
              { id: `mpu-${timestamp}`, date: formattedDate, time: formattedTime, timestamp, value: result.data.mpu.accX.toString() },
              ...prev
            ].slice(0, 100));
          }
          setLoading(false);
        }
      };

      // Mulai jalankan Polling setelah data lokal berhasil dimuat
      if (isMounted) {
        loadData();
        intervalId = setInterval(loadData, 3000);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // EFEK 2: SIMPAN KE MEMORI HP SETIAP KALI ADA DATA BARU MASUK
  useEffect(() => {
    const saveToLocal = async () => {
      if (ultrasonicLogs.length > 0 || tcrtLogs.length > 0 || mpuLogs.length > 0) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
            ultra: ultrasonicLogs,
            tcrt: tcrtLogs,
            mpu: mpuLogs
          }));
        } catch (error) {
          console.error("Gagal menyimpan data lokal:", error);
        }
      }
    };
    saveToLocal();
  }, [ultrasonicLogs, tcrtLogs, mpuLogs]);


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate && event.type !== 'dismissed') {
      setDateObj(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFilterDate(formattedDate);
    } else {
      setShowDatePicker(false);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime && event.type !== 'dismissed') {
      setDateObj(selectedTime);
      const formattedTime = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
      setFilterTime(formattedTime); 
    } else {
      setShowTimePicker(false);
    }
  };

  const resetFilters = () => {
    setFilterDate('');
    setFilterTime('');
    setDateObj(new Date());
  };

  const processDownloadCSV = async () => {
    setIsModalVisible(false);

    let allLogs = [
      ...ultrasonicLogs.map(item => ({ ...item, sensor: 'Ultrasonic' })),
      ...tcrtLogs.map(item => ({ ...item, sensor: 'TCRT5000' })),
      ...mpuLogs.map(item => ({ ...item, sensor: 'MPU6050 (AccX)' }))
    ];

    if (allLogs.length === 0) {
      Alert.alert('Peringatan', 'Tidak ada data untuk diunduh.');
      return;
    }

    let filteredLogs = allLogs.filter(log => {
      let matchDate = true;
      let matchTime = true;
      if (filterDate !== '') matchDate = log.date === filterDate;
      if (filterTime !== '') matchTime = log.time.startsWith(filterTime);
      return matchDate && matchTime;
    });

    if (filteredLogs.length === 0) {
      Alert.alert('Hasil Kosong', 'Tidak ada data yang cocok dengan tanggal/jam tersebut.');
      return;
    }

    filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

    try {
      let csvString = 'Tanggal,Waktu,Nama Sensor,Nilai Pembacaan\n';
      filteredLogs.forEach((item) => {
        const safeDate = item.date || '-';
        const safeTime = item.time || '-';
        const safeSensor = item.sensor ? String(item.sensor).replace(/,/g, ' ') : '-';
        const safeValue = item.value ? String(item.value).replace(/,/g, '.') : '-';
        csvString += `${safeDate},${safeTime},${safeSensor},${safeValue}\n`;
      });

      const fileName = `SensorLog_${Date.now()}.csv`;

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const uri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'text/csv');
          await FileSystem.writeAsStringAsync(uri, csvString, { encoding: 'utf8' });
          Alert.alert('Sukses', `Data (${filteredLogs.length} baris) berhasil disimpan!`);
        }
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: 'utf8' });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Download File CSV',
            UTI: 'public.comma-separated-values-text',
          });
        }
      }
    } catch (error) {
      Alert.alert('Error Sistem', `Gagal memproses download: ${error.message}`);
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 50 && !isScrolled) setIsScrolled(true);
    else if (offsetY <= 50 && isScrolled) setIsScrolled(false);
  };

  // KOMPONEN RENDER TABEL DENGAN PAGINATION (10 DATA PER HALAMAN)
  const renderSensorTable = (title, dataList, currentPage, setCurrentPage) => {
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(dataList.length / ITEMS_PER_PAGE);
    
    // Potong data sesuai halaman saat ini
    const paginatedData = dataList.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableTitleWrapper}>
          <Text style={styles.tableTitle}>{title}</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colTime]}>Waktu</Text>
          <Text style={[styles.headerText, styles.colValue]}>Nilai</Text>
        </View>
        
        {dataList.length === 0 ? (
          <Text style={styles.emptyText}>Menunggu data...</Text>
        ) : (
          <View>
            {paginatedData.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.colTime]}>{item.time}</Text>
                <Text style={[styles.cellValue, styles.colValue]}>{item.value}</Text>
              </View>
            ))}

            {/* NAVIGASI HALAMAN (KIRI KANAN) */}
            <View style={styles.paginationRow}>
              <TouchableOpacity 
                style={[styles.pageBtn, currentPage === 0 && styles.pageBtnDisabled]} 
                onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <Text style={styles.pageBtnText}>&lt; Sebelumnya</Text>
              </TouchableOpacity>
              
              <Text style={styles.pageInfo}>Hal {currentPage + 1} / {totalPages || 1}</Text>
              
              <TouchableOpacity 
                style={[styles.pageBtn, currentPage >= totalPages - 1 && styles.pageBtnDisabled]} 
                onPress={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                <Text style={styles.pageBtnText}>Berikutnya &gt;</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <MainLayout navigation={navigation} activeMenu="DataLog" hideTopBar={isScrolled}>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Opsi Unduh CSV</Text>
              {(filterDate !== '' || filterTime !== '') && (
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.modalSubtitle}>Kosongkan form untuk mengunduh semua data sesi ini.</Text>
            
            <Text style={styles.inputLabel}>Tanggal (Opsional)</Text>
            <TouchableOpacity style={styles.pickerBox} onPress={() => setShowDatePicker(true)}>
              <Text style={filterDate ? styles.pickerTextActive : styles.pickerTextPlaceholder}>
                {filterDate ? filterDate : 'Pilih Tanggal...'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Jam (Opsional)</Text>
            <TouchableOpacity style={styles.pickerBox} onPress={() => setShowTimePicker(true)}>
              <Text style={filterTime ? styles.pickerTextActive : styles.pickerTextPlaceholder}>
                {filterTime ? filterTime : 'Pilih Jam...'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnDownload} onPress={processDownloadCSV}>
                <Text style={styles.modalBtnDownloadText}>Unduh CSV</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker value={dateObj} mode="date" display="default" onChange={onChangeDate} />
      )}
      {showTimePicker && (
        <DateTimePicker value={dateObj} mode="time" display="default" onChange={onChangeTime} />
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.headerContainer}>
          <View style={styles.eyebrowContainer}>
            <Text style={styles.eyebrowDot}>•</Text>
            <Text style={styles.eyebrowText}>SESSION DATA LOG</Text>
          </View>
          <Text style={styles.mainTitle}>Data Log</Text>
          <Text style={styles.subTitleText}>Riwayat pembacaan 3 sensor utama</Text>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={() => setIsModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.downloadButtonText}>Unduh File CSV (.csv)</Text>
        </TouchableOpacity>

        {loading && ultrasonicLogs.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CF4500" />
            <Text style={styles.loadingText}>Menarik data dari server...</Text>
          </View>
        ) : (
          <View style={styles.allTablesWrapper}>
            {/* Memanggil komponen tabel dengan state halaman masing-masing */}
            {renderSensorTable("HC-SR04 ULTRASONIC", ultrasonicLogs, pageUltra, setPageUltra)}
            {renderSensorTable("TCRT5000 INFRARED", tcrtLogs, pageTcrt, setPageTcrt)}
            {renderSensorTable("MPU6050 (ACCEL X)", mpuLogs, pageMpu, setPageMpu)}
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 48 },
  headerContainer: { paddingHorizontal: 24, paddingTop: 80, marginBottom: 20 },
  eyebrowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  eyebrowDot: { color: '#CF4500', fontSize: 14, fontWeight: '700', marginRight: 6 },
  eyebrowText: { color: '#696969', fontSize: 13, fontWeight: '700', letterSpacing: 0.52, textTransform: 'uppercase' },
  mainTitle: { color: '#141413', fontSize: 36, fontWeight: '500', letterSpacing: -0.72, lineHeight: 44 },
  subTitleText: { color: '#696969', fontSize: 14, marginTop: 6, fontWeight: '400' },
  downloadButton: { backgroundColor: '#141413', marginHorizontal: 24, marginBottom: 24, paddingVertical: 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  downloadButtonText: { color: '#F3F0EE', fontSize: 15, fontWeight: '600' },
  allTablesWrapper: { gap: 24 },
  
  // GAYA TABEL DAN PAGINATION (BARU)
  tableContainer: { backgroundColor: '#FFFFFF', marginHorizontal: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(20, 20, 19, 0.05)', overflow: 'hidden' },
  tableTitleWrapper: { backgroundColor: '#141413', paddingVertical: 14, paddingHorizontal: 20 },
  tableTitle: { color: '#F3F0EE', fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#FAFAFA', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(20, 20, 19, 0.05)' },
  headerText: { fontSize: 12, color: '#696969', fontWeight: '700', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(20, 20, 19, 0.02)', alignItems: 'center' },
  cellText: { fontSize: 14, color: '#696969' },
  cellValue: { fontSize: 15, color: '#141413', fontWeight: '600' },
  colTime: { flex: 1 },
  colValue: { flex: 1, textAlign: 'right' },
  emptyText: { textAlign: 'center', color: '#696969', marginVertical: 24, fontSize: 14, fontStyle: 'italic' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 12, color: '#696969', fontSize: 14 },
  
  // GAYA TOMBOL NEXT/PREV
  paginationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderColor: 'rgba(20, 20, 19, 0.05)' },
  pageBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#F3F0EE' },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { color: '#141413', fontSize: 13, fontWeight: '600' },
  pageInfo: { color: '#696969', fontSize: 13, fontWeight: '500' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(20, 20, 19, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContainer: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#141413' },
  resetText: { fontSize: 14, color: '#CF4500', fontWeight: '600' },
  modalSubtitle: { fontSize: 13, color: '#696969', marginBottom: 20, lineHeight: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#141413', marginBottom: 8, textTransform: 'uppercase' },
  pickerBox: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: 'rgba(20, 20, 19, 0.1)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  pickerTextPlaceholder: { fontSize: 15, color: '#A0A0A0' },
  pickerTextActive: { fontSize: 15, color: '#141413', fontWeight: '500' },
  modalActionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtnCancel: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: '#F3F0EE' },
  modalBtnCancelText: { color: '#696969', fontSize: 15, fontWeight: '600' },
  modalBtnDownload: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: '#CF4500' },
  modalBtnDownloadText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default DataLogScreen;