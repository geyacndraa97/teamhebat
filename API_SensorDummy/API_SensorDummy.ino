#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// ==================== KONEKSI WI-FI ====================
const char* ssid = "smart";         // Ganti dengan SSID WiFi/Hotspot HP
const char* password = "smart123"; // Ganti dengan Password WiFi

// ==================== INISIALISASI OBJEK ====================
WebServer server(80); // API Server berjalan di port default HTTP (80)

void setup() {
  Serial.begin(115200);

  // Inisialisasi seed untuk fungsi random agar hasilnya selalu berbeda tiap kali ESP32 dinyalakan
  randomSeed(analogRead(0));

  // 1. Menghubungkan ke Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nBerhasil Terhubung!");
  Serial.print("IP Address ESP32 (Gunakan IP ini di Axios): ");
  Serial.println(WiFi.localIP());

  // 2. MEMBUAT ENDPOINT API UNTUK AXIOS
  // Endpoint ini akan merespons HTTP GET Request pada alamat: http://<IP_ESP32>/api/sensors
  server.on("/api/sensors", HTTP_GET, []() {
    
    // a. Buat data MPU6050 secara acak
    // Menghasilkan nilai acak antara -90.00 hingga 90.00 derajat
    float pitch = random(-9000, 9000) / 100.0; 
    float roll  = random(-9000, 9000) / 100.0;

    // b. Buat data Ultrasonik secara acak
    // Menghasilkan jarak acak antara 2 cm hingga 100 cm
    int distance = random(2, 100);

    // c. Buat data TCRT5000 secara acak
    // Menghasilkan angka 0 atau 1 untuk menentukan status ON_TRACK atau OFF_TRACK
    String lineStatus = (random(0, 2) == 1) ? "OFF_TRACK" : "ON_TRACK"; 

    // d. Kemas semua data ke dalam format JSON menggunakan ArduinoJson
    StaticJsonDocument<200> doc;
    doc["pitch"] = pitch; 
    doc["roll"] = roll;
    doc["ultrasonic_distance_cm"] = distance;
    doc["line_status"] = lineStatus;

    // e. Konversi JSON objek menjadi String
    String responseBody;
    serializeJson(doc, responseBody);

    // f. Kirimkan HTTP Response ke React Native (Axios)
    server.send(200, "application/json", responseBody);
    
    // Log ke Serial Monitor untuk melihat data yang dikirim
    Serial.println("Data dikirim: " + responseBody);
  });

  // 3. Jalankan API Server
  server.begin();
  Serial.println("API Server ESP32 aktif. Menunggu request...");
}

void loop() {
  // Selalu jalankan fungsi ini di loop agar server terus mendengarkan request masuk
  server.handleClient();
}