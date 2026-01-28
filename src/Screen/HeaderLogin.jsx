import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const HeaderLogin = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="home-outline" size={24} color="white" />
        <Text style={styles.headerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="arrow-back-outline" size={24} color="white" />
        <Text style={styles.headerText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLogin;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'blue',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
