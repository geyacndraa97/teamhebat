import axios from 'axios';

// URL target dokumen tetap sama
const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/eas-mobile-computting/databases/(default)/documents/sensors/data_sensor';

const api = axios.create({
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchSensorData = async () => {
  try {
    const response = await api.get(FIREBASE_URL);
    
    // Parsing JSON dari REST API Firestore
    const dataFields = response.data.fields;
    
    // Mengambil data dari Firestore (menggunakan fallback || 0 jika data kosong)
    // Kita cek doubleValue dan integerValue karena Firebase kadang mengubah tipe angka secara otomatis
    const ultraDist = dataFields?.ultra_dist?.doubleValue || dataFields?.ultra_dist?.integerValue || 0;
    const tcrtVal = dataFields?.tcrt_val?.integerValue || dataFields?.tcrt_val?.doubleValue || 0;
    const mpuAccX = dataFields?.mpu_x?.doubleValue || dataFields?.mpu_x?.integerValue || 0;
    const mpuAccY = dataFields?.mpu_y?.doubleValue || dataFields?.mpu_y?.integerValue || 0;
    const mpuAccZ = dataFields?.mpu_z?.doubleValue || dataFields?.mpu_z?.integerValue || 0;
    const mpuGyroX = dataFields?.gyro_x?.doubleValue || dataFields?.gyro_x?.integerValue || 0;

    // KEMBALIKAN DATA SESUAI FORMAT YANG DIMINTA DASHBOARD
    return {
      success: true,
      data: {
        ultrasonic: {
          distance: ultraDist,
          // Logika sederhana: jika jarak di bawah 20cm, status "Terlalu Dekat"
          status: ultraDist > 0 && ultraDist < 20 ? 'Terlalu Dekat' : 'Aman' 
        },
        tcrt: {
          value: tcrtVal,
          // Logika sederhana: nilai 1 biasanya berarti garis hitam (tergantung sensor fisik)
          condition: tcrtVal === 1 ? 'Hitam' : 'Putih'
        },
        mpu: {
          accX: mpuAccX,
          accY: mpuAccY,
          accZ: mpuAccZ,
          gyroX: mpuGyroX
        }
      },
      message: 'Berhasil menarik data dari Firebase REST API'
    };
    
  } catch (error) {
    console.error('API Error:', error.message);
    return {
      success: false,
      data: null,
      message: 'Gagal menghubungi server Firebase.'
    };
  }
};