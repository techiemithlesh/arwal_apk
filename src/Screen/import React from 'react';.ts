import React from 'react';
import Header from './Header'; // Capital H
import StaffInformation from './StaffInformation';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const DashBoard = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataWithToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        
        // Get user details from AsyncStorage
        const userDetailsStr = await AsyncStorage.getItem('userDetails');
        const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;
        
        if (userDetails && userDetails.menuTree) {
          // Use menuTree from stored user details
          setMenuItems(userDetails.menuTree);
          setLoading(false);
        } else {
          // Fallback to API call if menuTree not available
          const response = await axios.post(
            `${BASE_URL}/api/menu-list-mobile`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          console.log(response.data.data, 'my data');
          setData(response.data);
          
          // Extract menuTree from response if available
          if (response.data?.data?.userDetails?.menuTree) {
            setMenuItems(response.data.data.userDetails.menuTree);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setLoading(false);
      }
    };

    fetchDataWithToken();
  }, []);

  const handleMenuPress = (menuItem) => {
    switch (menuItem.name) {
      case 'Dashboard':
        // Already on dashboard
        break;
      case 'Property':
        navigation.navigate('Property');
        break;
      case 'Assesment':
        navigation.navigate('Assessment');
        break;
      case 'Inbox':
        navigation.navigate('Inbox');
        break;
      default:
        console.log('Menu item pressed:', menuItem.name);
    }
  };

  const getIconName = (iconName) => {
    // Map icon names to MaterialIcons
    const iconMap = {
      'FaHome': 'home',
      'FaInbox': 'inbox',
      'FaUser': 'person',
      'FaCog': 'settings',
      'FaChartBar': 'bar-chart',
      'FaFileAlt': 'description',
      'FaBuilding': 'business',
      'FaCalculator': 'calculate',
      'FaClipboardList': 'list',
      'FaEnvelope': 'mail',
    };
    
    return iconMap[iconName] || 'dashboard';
  };

  const renderMenuItems = () => {
    console.log('Rendering menu items:', menuItems);
    return menuItems.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.box}
        onPress={() => handleMenuPress(item)}
      >
        <Icon 
          name={getIconName(item.icon)} 
          size={40} 
          color="#4A90E2" 
        />
        <Text style={styles.boxText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  if (loading) {
    return (
      <View style={styles.maindashbaord}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.maindashbaord}>
      <Header />
      {/* ScrollView only for the content part */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {renderMenuItems()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>End of Dashboard</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maindashbaord: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'blue',
    height: responsiveHeight(10),
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#4a90e2',
  },
  boxText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default DashBoard;
