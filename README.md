# ⚖️ Balance Bot Monitoring

<div align="center">

![Balance Bot](https://img.shields.io/badge/Project-Balance%20Bot%20Monitoring-blue?style=for-the-badge&logo=robot)
![JavaScript](https://img.shields.io/badge/JavaScript-87.5%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![C++](https://img.shields.io/badge/C++-12.5%25-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Sistem monitoring real-time untuk robot penyeimbang (balance bot) berbasis sensor dengan dashboard web interaktif.**

</div>

---

## 📋 Deskripsi Proyek

**Balance Bot Monitoring** adalah sistem pemantauan berbasis web yang dirancang untuk memonitor data sensor dari sebuah robot penyeimbang (balance bot) secara **real-time**. Sistem ini mengintegrasikan firmware robot berbasis **C++**, backend **Firebase** untuk penyimpanan dan sinkronisasi data, serta antarmuka web yang dibangun dengan **JavaScript** dan **Axios** untuk komunikasi API.

Proyek ini dikembangkan sebagai **Tugas Besar** dan mencakup tiga tahap pengembangan API:
- 🔌 `API_Sensor` — Koneksi langsung ke sensor fisik
- 🧪 `API_SensorDummy` — Simulasi data sensor untuk pengujian
- 🔥 `API_SensorDummyFB` — Simulasi sensor terintegrasi dengan Firebase

---

## ✨ Fitur Utama

- 📡 **Monitoring Real-Time** — Data sensor balance bot ditampilkan secara langsung di dashboard
- 🔥 **Integrasi Firebase** — Penyimpanan dan sinkronisasi data sensor menggunakan Firebase Realtime Database
- 🌐 **REST API** — Endpoint API untuk membaca dan mengirim data sensor
- 🧪 **Mode Dummy** — Simulasi data sensor untuk keperluan pengujian tanpa hardware fisik
- 📊 **Dashboard Interaktif** — Visualisasi data sensor yang mudah dibaca
- ⚡ **Axios HTTP Client** — Komunikasi API yang cepat dan efisien

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **JavaScript** | Frontend & Backend (Node.js) |
| **C++** | Firmware / Kode mikrokontroler balance bot |
| **Firebase** | Realtime Database & Hosting |
| **Axios** | HTTP Client untuk komunikasi API |
| **Node.js** | Runtime JavaScript |

---

## 📁 Struktur Proyek

```
teamhebat/
├── 📂 API_Sensor/           # API untuk koneksi sensor fisik langsung
├── 📂 API_SensorDummy/      # API simulasi data sensor (tanpa hardware)
├── 📂 API_SensorDummyFB/    # API simulasi sensor + integrasi Firebase
└── 📂 Tugas-Besar/          # Source utama proyek lengkap
```

---

## ⚙️ Instalasi & Menjalankan

### Prasyarat

Pastikan sudah terinstal:
- [Node.js](https://nodejs.org/) v16 atau lebih baru
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Akun [Firebase](https://firebase.google.com/) (untuk fitur database)

### Langkah Instalasi

**1. Clone repository**
```bash
git clone https://github.com/geyacndraa97/teamhebat.git
cd teamhebat
```

**2. Masuk ke folder yang diinginkan**
```bash
# Untuk API dengan Firebase
cd API_SensorDummyFB

# Atau untuk Tugas Besar
cd Tugas-Besar
```

**3. Install dependencies**
```bash
npm install
```

**4. Konfigurasi Firebase**

Buat file `.env` di root folder dan isi dengan konfigurasi Firebase kamu:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

**5. Jalankan aplikasi**
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 🚀 Cara Penggunaan

### Mode API Dummy (Tanpa Hardware)
```bash
cd API_SensorDummy
npm install
npm start
```
Gunakan mode ini untuk pengujian dashboard tanpa perlu hardware balance bot.

### Mode API dengan Firebase
```bash
cd API_SensorDummyFB
npm install
npm start
```
Data sensor akan otomatis tersinkronisasi ke Firebase Realtime Database.

### Contoh Request API
```javascript
// Mengambil data sensor menggunakan Axios
import axios from 'axios';

const response = await axios.get('http://localhost:3000/api/sensor');
console.log(response.data);
// Output: { roll: 0.5, pitch: 1.2, yaw: 0.0, timestamp: "..." }
```

---

## 👥 Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| **Moch Nuril Mukarrom** | 0923040031 | 🔌 Axios (HTTP Client & API Integration) |
| **Geya Candra Putra D.** | 0923040050 | 🎨 UI/UX (Desain Antarmuka & Dashboard) |
| **Wisnu Wardhana** | 0923040054 | 🔥 Firebase (Database & Backend Integration) |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik — **Tugas Besar**

---

<div align="center">

Dibuat dengan ❤️ oleh **Team Hebat**

</div>
