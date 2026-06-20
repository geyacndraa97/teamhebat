#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// ==================== KONEKSI WI-FI ====================
const char* ssid = "NAMA_WIFI_KAMU";         // Ganti dengan SSID WiFi/Hotspot HP
const char* password = "PASSWORD_WIFI_KAMU"; // Ganti dengan Password WiFi

// ==================== KONFIGURASI PIN ====================
// Sensor Ultrasonik HC-SR04
#define TRIG_PIN 5
#define ECHO_PIN 18

// Sensor TCRT5000 (Pendeteksi Garis)
#define TCRT_PIN 19

// Sensor MPU6050 menggunakan pin I2C default ESP32:
// SDA = GPIO 21, SCL = GPIO 22

// ==================== INISIALISASI OBJEK ====================
WebServer server(80); // API Server berjalan di port default HTTP (80)
Adafruit_MPU6050 mpu;

// ==================== FUNGSI MEMBACA ULTRASONIK ====================
int getUltrasonicDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // Timeout 30ms jika tidak ada halangan
  if (duration == 0) return 999;                  // Jika di luar jangkauan
  
  int distance = duration * 0.034 / 2;            // Hitung jarak dalam cm
  return distance;
}

void setup() {
  Serial.begin(115200);

  // 1. Inisialisasi Pin Sensor
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(TCRT_PIN, INPUT);

  // 2. Inisialisasi Sensor MPU6050 (I2C)
  if (!mpu.begin()) {
    Serial.println("Gagal menemukan chip MPU6050! Periksa kabel!");
    while (1) { delay(10); }
  }
  Serial.println("MPU6050 ditemukan dan siap.");
  
  // Mengatur rentang sensor (opsional, sesuaikan kebutuhan robot balancing)
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // 3. Menghubungkan ke Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nBerhasil Terhubung!");
  Serial.print("IP Address ESP32 (Gunakan IP ini di Axios): ");
  Serial.println(WiFi.localIP());

  // 4. MEMBUAT ENDPOINT API UNTUK AXIOS
  // Endpoint ini akan merespons HTTP GET Request pada alamat: http://<IP_ESP32>/api/sensors
  server.on("/api/sensors", HTTP_GET, []() {
    
    // a. Baca data dari MPU6050
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    // Hitung sudut kemiringan (Pitch & Roll) sederhana dari akselerometer
    float pitch = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z)) * 180 / M_PI;
    float roll  = atan2(a.acceleration.y, a.acceleration.z) * 180 / M_PI;

    // b. Baca data dari Ultrasonik
    int distance = getUltrasonicDistance();

    // c. Baca data dari TCRT5000
    int tcrtVal = digitalRead(TCRT_PIN);
    // Sesuaikan logika HIGH/LOW dengan sensor kamu (apakah aktif saat melihat hitam atau putih)
    String lineStatus = (tcrtVal == HIGH) ? "OFF_TRACK" : "ON_TRACK"; 

    // d. Kemas semua data ke dalam format JSON menggunakan ArduinoJson
    StaticJsonDocument<200> doc;
    doc["pitch"] = round(pitch * 100) / 100.0; // Dibulatkan 2 angka di belakang koma
    doc["roll"] = round(roll * 100) / 100.0;
    doc["ultrasonic_distance_cm"] = distance;
    doc["line_status"] = lineStatus;

    // e. Konversi JSON objek menjadi String
    String responseBody;
    serializeJson(doc, responseBody);

    // f. Kirimkan HTTP Response ke React Native (Axios)
    server.send(200, "application/json", responseBody);
  });

  // 5. Jalankan API Server
  server.begin();
  Serial.println("API Server ESP32 aktif.");
}

void loop() {
  // Selalu jalankan fungsi ini di loop agar server terus mendengarkan request masuk
  server.handleClient();
  
  // ====================================================================
  // Tempatkan logika kalkulasi PID / pergerakan motor robot balancing-mu
  // di bawah sini agar tidak mengganggu kinerja server API.
  // ====================================================================
}