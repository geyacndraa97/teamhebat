import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

// IMPORT ASYNC STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainLayout = ({ children, navigation, activeMenu, systemStatus, hideTopBar = false }) => {
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  
  // State untuk menyimpan nama dari AsyncStorage
  const [profileName, setProfileName] = useState("Memuat...");

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const topBarAnim = useRef(new Animated.Value(0)).current;

  // Efek untuk mengambil data Username dari AsyncStorage saat layout dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@logged_in_username');
        if (storedName !== null) {
          setProfileName(storedName); 
        } else {
          setProfileName("Admin Gateway"); // Jika entah bagaimana data kosong
        }
      } catch (error) {
        console.error("Gagal menarik data dari AsyncStorage:", error);
        setProfileName("User"); 
      }
    };

    fetchUserData();
  }, []);

  // Efek untuk menyembunyikan/menampilkan Top Bar (Hamburger Menu) saat di-scroll
  useEffect(() => {
    Animated.timing(topBarAnim, {
      toValue: hideTopBar ? -100 : 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [hideTopBar]);

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setIsOpen(false));
  };

  const navigateTo = (routeName) => {
    closeDrawer();
    if (navigation) {
      navigation.navigate(routeName);
    }
  };

  // Fungsi Logout Menggunakan Reset & Menghapus Sesi
  const handleLogout = async () => {
    closeDrawer();
    
    try {
      // Hapus data sesi user yang sedang login agar benar-benar keluar
      await AsyncStorage.removeItem('@logged_in_username');
      
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], 
        });
      }
    } catch (error) {
      console.error("Gagal menghapus sesi login:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Konten Utama Layar */}
      <View style={styles.contentContainer}>
        {children}
      </View>

      {/* Top Floating Navigation Bar dengan Animasi Geser */}
      <Animated.View 
        style={[styles.topBar, { transform: [{ translateY: topBarAnim }] }]} 
        pointerEvents={hideTopBar ? 'none' : 'box-none'}
      >
        <TouchableOpacity 
          style={styles.hamburgerButton} 
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, { width: 18 }]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        
        {systemStatus && (
          <View style={styles.systemBadgeContainer}>
            <Text style={styles.systemBadgeText}>{systemStatus}</Text>
          </View>
        )}
      </Animated.View>

      {/* Overlay Gelap */}
      {isOpen && (
        <Animated.View style={[styles.drawerOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={closeDrawer} 
          />
        </Animated.View>
      )}

      {/* Drawer Menu */}
      <Animated.View style={[styles.drawerMenu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Informasi Akun */}
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            {/* Menampilkan huruf pertama dari username */}
            <Text style={styles.avatarText}>
              {profileName !== "Memuat..." ? profileName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            {/* Teks Username yang dinamis */}
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profileEmail}>Administrator</Text>
          </View>
        </View>

        {/* Daftar Menu */}
        <View style={styles.menuItemsContainer}>
          <TouchableOpacity style={[styles.menuItem, activeMenu === 'Dashboard' && styles.menuItemActive]} onPress={() => navigateTo('Dashboard')}>
            <Text style={[styles.menuItemText, activeMenu === 'Dashboard' && styles.menuItemTextActive]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, activeMenu === 'DataLog' && styles.menuItemActive]} onPress={() => navigateTo('DataLog')}>
            <Text style={[styles.menuItemText, activeMenu === 'DataLog' && styles.menuItemTextActive]}>Data Log</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, activeMenu === 'Grafik' && styles.menuItemActive]} onPress={() => navigateTo('Grafik')}>
            <Text style={[styles.menuItemText, activeMenu === 'Grafik' && styles.menuItemTextActive]}>Grafik</Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Logout di Bawah */}
        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F0EE',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 40, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 5,
  },
  hamburgerButton: { width: 40, height: 40, justifyContent: 'center' },
  hamburgerLine: {
    width: 24,
    height: 2.5,
    backgroundColor: '#141413',
    marginBottom: 5,
    borderRadius: 2,
  },
  systemBadgeContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(20, 20, 19, 0.1)',
  },
  systemBadgeText: { fontSize: 12, color: '#696969', fontWeight: '500' },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 19, 0.4)',
    zIndex: 10,
  },
  drawerMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300, 
    backgroundColor: '#141413',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    zIndex: 20,
  },
  drawerHeader: { alignItems: 'flex-end', marginBottom: 20 },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#F3F0EE', fontSize: 24 },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 240, 238, 0.1)',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F37338',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { color: '#F3F0EE', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  profileEmail: { color: '#696969', fontSize: 13 },

  menuItemsContainer: { flex: 1, gap: 16 },
  menuItem: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999 },
  menuItemActive: { backgroundColor: '#F3F0EE' },
  menuItemText: { color: '#D1CDC7', fontSize: 18, fontWeight: '400' },
  menuItemTextActive: { color: '#141413', fontSize: 18, fontWeight: '500' },
  
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(243, 240, 238, 0.1)',
    paddingTop: 24,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(207, 69, 0, 0.1)',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(207, 69, 0, 0.3)',
  },
  logoutButtonText: { color: '#CF4500', fontSize: 16, fontWeight: '600' },
});

export default MainLayout;