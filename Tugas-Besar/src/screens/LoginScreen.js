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
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State untuk fitur Remember Me
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Fungsi dummy: Logika otentikasi Firebase/MQTT diabaikan sesuai instruksi
    console.log("Tombol Masuk Ditekan");
    console.log("Mencoba koneksi ke Node / Broker dengan kredensial:", email);
    console.log("Status Remember Me:", rememberMe ? "Aktif" : "Tidak Aktif");
  };

  const handleForgotPassword = () => {
    console.log("Navigasi ke layar Lupa Kata Sandi");
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
              placeholder="Email"
              placeholderTextColor="#696969"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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

            {/* Remember Me Section (Rata Kanan Bawah) */}
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
            >
              <Text style={styles.buttonPrimaryText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={handleForgotPassword}
            >
              {/* Tempat untuk link lupa password jika ingin ditambahkan nanti */}
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Surface & Background
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0EE', // Canvas Cream
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32, // Skala ruang 32px
    justifyContent: 'center',
  },

  // Typography & Headers
  headerContainer: {
    marginBottom: 64, // Whitespace editorial yang luas
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrowDot: {
    color: '#CF4500', // Signal Orange untuk aksen dot
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  eyebrowText: {
    color: '#696969', // Slate Gray
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.56, // +4% tracking
    textTransform: 'uppercase', //
  },
  title: {
    color: '#141413', // Ink Black
    fontSize: 36, // Skala H2
    fontWeight: '500', //
    letterSpacing: -0.72, // -2% negative letter-spacing khas editorial
    lineHeight: 44, //
  },

  // Inputs & Forms (999px Radius)
  formContainer: {
    marginBottom: 16, // PERBAIKAN DI SINI: Dikurangi dari 32px menjadi 16px untuk menaikkan tombol Sign In.
  },
  input: {
    backgroundColor: '#FFFFFF', //
    borderColor: 'rgba(20, 20, 19, 0.3)', // Garis transparan halus dari Ink Black
    borderWidth: 1, //
    borderRadius: 999, // Pil Penuh
    paddingVertical: 16, //
    paddingHorizontal: 24, //
    fontSize: 16, //
    color: '#141413', // Ink Black
    fontWeight: '400', // Pengganti weight 450
    marginBottom: 24, //
  },
  inputPassword: {
    marginBottom: 12, // Margin lebih kecil agar checkbox menempel dengan input password
  },

  // Custom Checkbox ("Remember Me")
  rememberMeContainer: {
    alignItems: 'flex-end', // Rata kanan
    marginBottom: 12, //
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, //
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5, //
    borderColor: '#141413', // Ink Black
    borderRadius: 4, // Radius kecil untuk elemen mikro
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: '#141413', //
  },
  checkmark: {
    color: '#F3F0EE', // Canvas Cream
    fontSize: 12, //
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: '#696969', // Slate Gray
    fontSize: 14, //
    fontWeight: '500',
  },

  // Buttons & Links (20px Radius)
  actionContainer: {
    marginTop: 8, //
  },
  buttonPrimary: {
    backgroundColor: '#141413', // Ink Black
    borderColor: '#141413', //
    borderWidth: 1.5, //
    borderRadius: 20, // Radius khas tombol
    paddingVertical: 16, //
    paddingHorizontal: 24, //
    alignItems: 'center',
    marginBottom: 32, //
  },
  buttonPrimaryText: {
    color: '#F3F0EE', // Canvas Cream, bukan putih murni
    fontSize: 16, //
    fontWeight: '500', //
    letterSpacing: -0.32, // -3% tightening
  },
  linkContainer: {
    alignItems: 'center',
    paddingVertical: 8, //
  },
  linkText: {
    color: '#696969', // Slate Gray
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;