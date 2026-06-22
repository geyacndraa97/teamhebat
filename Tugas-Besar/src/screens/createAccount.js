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

// REVISI IMPORT: Tambahkan doc dan setDoc
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

const CreateAccount = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validasi Input Kosong
    if (!username || !password || !confirmPassword) {
      Alert.alert('Perhatian', 'Semua kolom formulir harus diisi!');
      return;
    }

    // 2. Validasi Kecocokan Password
    if (password !== confirmPassword) {
      Alert.alert('Gagal', 'Konfirmasi password tidak cocok dengan password utama.');
      return;
    }

    setLoading(true);

    try {
      const formattedUsername = username.trim();

      // 3. Validasi apakah username sudah terpakai di Firestore
      const checkQuery = query(
        collection(db, 'users'),
        where('username', '==', formattedUsername)
      );
      const querySnapshot = await getDocs(checkQuery);

      if (!querySnapshot.empty) {
        setLoading(false);
        Alert.alert('Gagal', 'Username sudah terdaftar! Gunakan nama lain.');
        return;
      }

      // 4. Menyimpan data user baru ke koleksi 'users' di Firestore
      // REVISI: Menggunakan setDoc agar ID dokumen sama dengan username
      // Format di Firestore akan menjadi: users/{username}
      const userDocRef = doc(db, 'users', formattedUsername);
      
      await setDoc(userDocRef, {
        username: formattedUsername,
        password: password, 
        createdAt: new Date().toISOString()
      });

      setLoading(false);
      Alert.alert('Sukses', 'Akun berhasil dibuat! Silakan masuk.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      setLoading(false);
      console.error("Firebase Register Error: ", error);
      Alert.alert('Error', 'Gagal mendaftarkan akun. Periksa koneksi atau konfigurasi Firebase Anda.');
    }
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back to Sign In</Text>
            </TouchableOpacity>
            
            <View style={styles.eyebrowContainer}>
              <Text style={styles.eyebrowDot}>•</Text>
              <Text style={styles.eyebrowText}>REGISTRATION</Text>
            </View>
            <Text style={styles.title}>Create New Console Account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Choose Username"
              placeholderTextColor="#696969"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#696969"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#696969"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Action Section */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading} 
            >
              {loading ? (
                <ActivityIndicator size="small" color="#F3F0EE" />
              ) : (
                <Text style={styles.buttonPrimaryText}>Register Account</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F0EE' },
  keyboardAvoid: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  headerContainer: { marginBottom: 40 },
  // REVISI BUG: selfAlign diubah menjadi alignSelf
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  backButtonText: { color: '#CF4500', fontSize: 14, fontWeight: '600' },
  eyebrowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  eyebrowDot: { color: '#CF4500', fontSize: 16, fontWeight: '700', marginRight: 8 },
  eyebrowText: { color: '#696969', fontSize: 14, fontWeight: '700', letterSpacing: 0.56, textTransform: 'uppercase' },
  title: { color: '#141413', fontSize: 32, fontWeight: '500', letterSpacing: -0.64, lineHeight: 40 },
  formContainer: { marginBottom: 16 },
  input: { backgroundColor: '#FFFFFF', borderColor: 'rgba(20, 20, 19, 0.3)', borderWidth: 1, borderRadius: 999, paddingVertical: 16, paddingHorizontal: 24, fontSize: 16, color: '#141413', marginBottom: 20 },
  actionContainer: { marginTop: 8 },
  buttonPrimary: { backgroundColor: '#141413', borderRadius: 20, paddingVertical: 16, alignItems: 'center', height: 56, justifyContent: 'center' },
  buttonPrimaryText: { color: '#F3F0EE', fontSize: 16, fontWeight: '500', letterSpacing: -0.32 },
});

export default CreateAccount;