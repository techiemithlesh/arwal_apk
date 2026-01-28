import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderNavigation from '../Components/HeaderNavigation';

const Property = ({ navigation }) => {
  const [propertyChildren, setPropertyChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyChildren = async () => {
      try {
        const userDetailsStr = await AsyncStorage.getItem('userDetails');
        const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;
        if (userDetails?.menuTree) {
          const propertyMenu = userDetails.menuTree.find(
            item => item.name === 'Property',
          );
          if (propertyMenu?.children) {
            setPropertyChildren(propertyMenu.children);
          }
        }
      } catch (err) {
        // You can log the error or show a toast/alert here
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyChildren();
  }, []);

  const handleMenuPress = menuItem => {
    switch (menuItem.name) {
      case 'Assesment':
        navigation.navigate('SearchAssesment');
        break;

      case 'Inbox':
        navigation.navigate('FieldVarification');
        break;
      default:
        console.log('Menu item pressed:', menuItem.name);
    }
  };

  const getIconName = iconName => {
    const iconMap = {
      FaHome: 'home',
      FaInbox: 'inbox',
      // Add more mappings as needed
    };
    return iconMap[iconName] || 'dashboard';
  };

  if (loading) {
    return (
      <View style={styles.maindashbaord}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.maindashbaord}>
      <HeaderNavigation />

      <FlatList
        data={propertyChildren}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.scrollContainer}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() => handleMenuPress(item)}
          >
            <Icon name={getIconName(item.icon)} size={40} color="#4A90E2" />
            <Text style={styles.boxText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ApplyAssessment')}>
        <Text>AssesmetApply</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>End of Property</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maindashbaord: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  box: {
    width: '48%',
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#4a90e2',
  },
  boxText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default Property;
