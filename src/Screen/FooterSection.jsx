import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook
import Colors from '../Module/Constants/Colors';

const FooterSection = () => {
  const navigation = useNavigation(); // ✅ Initialize navigation

  return (
    <View style={styles.footerContainer}>
      {/* Navigation Icons */}
      <View style={styles.iconRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DashBoard')} // 👈 navigate to Home
          style={styles.iconButton}
        >
          <Icon name="home" size={24} color="#E8F5E9" />
          <Text style={styles.iconLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProfilePage')} // 👈 navigate to Profile
          style={styles.iconButton}
        >
          <Icon name="user" size={24} color="#E8F5E9" />
          <Text style={styles.iconLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Report')} // 👈 navigate to Report
          style={styles.iconButton}
        >
          <Icon name="file-text" size={24} color="#E8F5E9" />
          <Text style={styles.iconLabel}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#00FF99',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    color: '#E8F5E9',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
});

export default FooterSection;
