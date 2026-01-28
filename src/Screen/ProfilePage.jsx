import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'; // 🌈 For background
import { usrProfileApi } from '../api/apiRoutes';
import { getToken } from '../utils/auth';
import Colors from '../Module/Constants/Colors';
import HeaderNavigation from '../Components/HeaderNavigation';
import FooterSection from '../Screen/FooterSection';
import back_15 from '../assets/back_15.jpg';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          usrProfileApi,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUserData(response.data.data);
        console.log('User Data:', response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary || '#007bff'} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.noDataText}>No user data found</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={back_15} // 🖼️ your background image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <HeaderNavigation />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.headerSection}>
            <Image
              source={{
                uri: userData.userImg,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.nameText}>{userData.name}</Text>
            <Text style={styles.designationText}>
              {userData.designation || userData.userFor || 'Employee'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Employee Code:</Text>
            <Text style={styles.value}>{userData.employeeCode || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{userData.userName || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ulb ID:</Text>
            <Text style={styles.value}>{userData.ulbId || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>roleName:</Text>
            <Text style={styles.value}>{userData.roles.roleName || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Created:</Text>
            <Text style={styles.value}>
              {new Date(userData.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
      <FooterSection />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e6f0',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary || '#3f51b5',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary || '#3f51b5',
  },
  designationText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e6f0',
    width: '90%',
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 15,
    color: '#666',
    textAlign: 'right',
    flexShrink: 1,
  },
});

export default ProfilePage;
