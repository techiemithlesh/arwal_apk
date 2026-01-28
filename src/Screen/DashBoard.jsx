import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import HeaderNavigation from '../Components/HeaderNavigation';
import MenuTree from '../Components/MenuTree';
import FooterSection from './FooterSection';

import back_15 from '../assets/back_15.jpg';
import Sidebar from './Sidebar';

const DashBoard = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuTree = async () => {
      try {
        const userDetailsStr = await AsyncStorage.getItem('userDetails');
        const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;

        if (userDetails && userDetails.menuTree) {
          setMenuItems(userDetails.menuTree);
        } else {
          setError('Menu data not available. Please login again.');
        }
      } catch (err) {
        setError(
          'Connection failed. If the problem persists, please check your internet connection.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuTree();
  }, []);

  if (loading) {
    return (
      <View style={styles.mainDashboard}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainDashboard}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={back_15} // 🖼️ your background image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <HeaderNavigation />
        <View style={[styles.scrollContainer, { flex: 1 }]}>
          <MenuTree />
        </View>

        <View style={styles.footer}>
          <FooterSection onHomePress={() => navigation.navigate('DashBoard')} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainDashboard: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 2.0, // will fade the whole content
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(255,255,255,0.92)', // Optional: slight white overlay for readability
  },
  scrollContainer: {
    padding: 5,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: 'rgba(224,224,224,0.9)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default DashBoard;
