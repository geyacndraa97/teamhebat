import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Import modul Firestore dan konfigurasi database Anda
import { collection, query, where, getDocs } from 'firebase/firestore';
// REVISI 1: Jalur import db sesuai yang Anda minta
import { db } from '../firebaseConfig'; 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validasi Input Kosong
    if (!username || !password) {
      Alert.alert('Perhatian', 'Username dan password tidak boleh kosong!');
      return;
    }

    setLoading(true); 

    try {
      // Hilangkan spasi berlebih jika pengguna tidak sengaja mengetik spasi
      const formattedUsername = username.trim();

      // Query ke Firebase: Mencari berdasarkan field 'username' dan 'password'
      const q = query(
        collection(db, 'users'),
        where('username', '==', formattedUsername),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      setLoading(false); 

      // Jika data ditemukan (login berhasil)
      if (!querySnapshot.empty) {
        console.log("Login sukses. Status Remember Me:", rememberMe ? "Aktif" : "Tidak Aktif");
        
        // Langsung navigasi ke Dashboard 
        navigation.replace('Dashboard'); 
        
      } else {
        Alert.alert('Gagal', 'Username atau Password salah! Periksa kembali data akun Anda.');
      }
    } catch (error) {
      setLoading(false); 
      console.error("Firebase Auth Error: ", error);
      Alert.alert('Error', 'Gagal terhubung ke database Firebase. Periksa koneksi internet Anda atau konfigurasi Firebase.');
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.eyebrowContainer}>
              <Text style={styles.eyebrowDot}>•</Text>
              <Text style={styles.eyebrowText}>SECURE ACCESS</Text>
            </View>
            <Text style={styles.title}>Device Management Console</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username" 
              placeholderTextColor="#696969"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={[styles.input, styles.inputPassword]}
              placeholder="Password"
              placeholderTextColor="#696969"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Remember Me Section */}
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                style={styles.checkboxWrapper}
                onPress={toggleRememberMe}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading} 
            >
              {loading ? (
                <ActivityIndicator size="small" color="#F3F0EE" />
              ) : (
                <Text style={styles.buttonPrimaryText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* REVISI 2 & 3: Menghapus Forgot Password & menambah tombol Create Account (English) */}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => navigation.navigate('createAccount')}
            >
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkTextBold}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0EE', 
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32, 
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 64, 
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrowDot: {
    color: '#CF4500', 
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  eyebrowText: {
    color: '#696969', 
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.56, 
    textTransform: 'uppercase', 
  },
  title: {
    color: '#141413', 
    fontSize: 36, 
    fontWeight: '500', 
    letterSpacing: -0.72, 
    lineHeight: 44, 
  },
  formContainer: {
    marginBottom: 16, 
  },
  input: {
    backgroundColor: '#FFFFFF', 
    borderColor: 'rgba(20, 20, 19, 0.3)', 
    borderWidth: 1, 
    borderRadius: 999, 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    fontSize: 16, 
    color: '#141413', 
    fontWeight: '400', 
    marginBottom: 24, 
  },
  inputPassword: {
    marginBottom: 12, 
  },
  rememberMeContainer: {
    alignItems: 'flex-end', 
    marginBottom: 12, 
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, 
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5, 
    borderColor: '#141413', 
    borderRadius: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: '#141413', 
  },
  checkmark: {
    color: '#F3F0EE', 
    fontSize: 12, 
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: '#696969', 
    fontSize: 14, 
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 8, 
  },
  buttonPrimary: {
    backgroundColor: '#141413', 
    borderColor: '#141413', 
    borderWidth: 1.5, 
    borderRadius: 20, 
    paddingVertical: 16, 
    paddingHorizontal: 24, 
    alignItems: 'center',
    marginBottom: 22, 
    height: 56, 
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: '#F3F0EE', 
    fontSize: 16, 
    fontWeight: '500', 
    letterSpacing: -0.32, 
  },
  linkContainer: {
    alignItems: 'center',
    paddingVertical: 8, 
  },
  linkText: {
    color: '#696969', 
    fontSize: 14,
    fontWeight: '500',
  },
  linkTextBold: {
    color: '#141413',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;