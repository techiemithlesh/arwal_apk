import React from 'react';
import Header from './Header';
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

const Inbox = ({ navigation }) => {
  return (
    <View style={styles.maindashbaord}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.box}>
            <Icon name="inbox" size={40} color="#4A90E2" />
            <Text style={styles.boxText}>All Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box}>
            <Icon name="mark-email-unread" size={40} color="#7B61FF" />
            <Text style={styles.boxText}>Unread Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box}>
            <Icon name="mark-email-read" size={40} color="#50E3C2" />
            <Text style={styles.boxText}>Read Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box}>
            <Icon name="delete" size={40} color="#F5A623" />
            <Text style={styles.boxText}>Trash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Inbox Module</Text>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default Inbox;
