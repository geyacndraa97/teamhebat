import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const MainLayout = ({ children, navigation, activeMenu, systemStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- Konten Layar Utama (Sekarang memenuhi layar) --- */}
      <View style={styles.contentContainer}>
        {children}
      </View>

      {/* --- Top Floating Navigation Bar (Melayang) --- */}
      <View style={styles.topBar} pointerEvents="box-none">
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
      </View>

      {/* --- Drawer Overlay & Menu --- */}
      {isOpen && (
        <Animated.View style={[styles.drawerOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={closeDrawer} 
          />
        </Animated.View>
      )}

      <Animated.View style={[styles.drawerMenu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.drawerFooter}>
          <Text style={styles.drawerFooterText}>Node Gateway v1.0.2</Text>
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
  contentContainer: {
    flex: 1,
  },
  // REVISI: Dibuat melayang (absolute) dan posisinya ditarik lebih ke atas
  topBar: {
    position: 'absolute',
    top: 40, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 5, // Tetap di atas konten scroll
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
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
  systemBadgeText: {
    fontSize: 12,
    color: '#696969',
    fontWeight: '500',
  },
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
    width: width * 0.75,
    height: height,
    backgroundColor: '#141413',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    zIndex: 20,
  },
  drawerHeader: { alignItems: 'flex-end', marginBottom: 40 },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#F3F0EE', fontSize: 24 },
  menuItemsContainer: { flex: 1, gap: 16 },
  menuItem: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999 },
  menuItemActive: { backgroundColor: '#F3F0EE' },
  menuItemText: { color: '#D1CDC7', fontSize: 18, fontWeight: '400' },
  menuItemTextActive: { color: '#141413', fontSize: 18, fontWeight: '500' },
  drawerFooter: { borderTopWidth: 1, borderTopColor: 'rgba(243, 240, 238, 0.1)', paddingTop: 16 },
  drawerFooterText: { color: '#696969', fontSize: 12 },
});

export default MainLayout;