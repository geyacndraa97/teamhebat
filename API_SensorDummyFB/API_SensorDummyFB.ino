#include <WiFi.h>
#include <HTTPClient.h>

// --- KONFIGURASI WIFI ---
const char* ssid = "smart";      // Ganti dengan nama WiFi
const char* password = "smart123";   // Ganti dengan password WiFi

// --- KONFIGURASI FIREBASE REST API ---
// PERHATIKAN: URL updateMask sudah disesuaikan dengan nama sensor yang dipakai di React Native
const char* firebaseUrl = "https://firestore.googleapis.com/v1/projects/eas-mobile-computting/databases/(default)/documents/sensors/data_sensor?updateMask.fieldPaths=ultra_dist&updateMask.fieldPaths=tcrt_val&updateMask.fieldPaths=mpu_x&updateMask.fieldPaths=mpu_y&updateMask.fieldPaths=mpu_z&updateMask.fieldPaths=gyro_x";

void setup() {
  Serial.begin(115200);
  
  Serial.print("Menghubungkan ke ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Terhubung!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // --- MEMBUAT DUMMY DATA UNTUK PENGUJIAN ---
    // 1. Ultrasonik (Jarak dalam cm, misal 5.0 s/d 100.0 cm)
    float ultra_dist = random(50, 1000) / 10.0;       
    
    // 2. TCRT5000 (0 atau 1 untuk Putih/Hitam)
    int tcrt_val = random(0, 2); 
    
    // 3. MPU6050 Accelerometer (Nilai G, misal -2.0 s/d 2.0)
    float mpu_x = random(-20, 20) / 10.0; 
    float mpu_y = random(-20, 20) / 10.0;
    float mpu_z = random(80, 120) / 10.0; // Z biasanya sekitar 1.0 (9.8 m/s2) saat diam
    
    // 4. MPU6050 Gyroscope X (Rotasi derajat/detik)
    float gyro_x = random(-90, 90) / 1.0;
    
    // --- FORMAT JSON FIRESTORE ---
    // Aturan Firestore: Float/Desimal pakai "doubleValue", Integer/Bulat pakai "integerValue" (dengan string "")
    String jsonPayload = "{\"fields\": {"
                         "\"ultra_dist\": { \"doubleValue\": " + String(ultra_dist) + " },"
                         "\"tcrt_val\": { \"integerValue\": \"" + String(tcrt_val) + "\" },"
                         "\"mpu_x\": { \"doubleValue\": " + String(mpu_x) + " },"
                         "\"mpu_y\": { \"doubleValue\": " + String(mpu_y) + " },"
                         "\"mpu_z\": { \"doubleValue\": " + String(mpu_z) + " },"
                         "\"gyro_x\": { \"doubleValue\": " + String(gyro_x) + " }"
                         "}}";

    Serial.println("Mengirim data ke Firebase...");
    Serial.println(jsonPayload);

    // Memulai koneksi HTTP PATCH
    http.begin(firebaseUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.PATCH(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.print("Sukses [Kode: ");
      Serial.print(httpResponseCode);
      Serial.println("]");
    } else {
      Serial.print("Error [Kode: ");
      Serial.print(httpResponseCode);
      Serial.println("]");
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  delay(3000); // Kirim data setiap 3 detik agar sinkron dengan interval aplikasi
}