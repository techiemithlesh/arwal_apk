import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Colors from '../Module/Constants/Colors';
const Card = ({
  applicationNo,
  wardNo,
  firmType,
  ownerName,
  applyDate,
  address,
  natureOfBusiness,
  onPress,
}) => {
  // Handle both array and string formats for Nature of Business
  let natureOfBusinessDisplay = natureOfBusiness;
  if (Array.isArray(natureOfBusinessDisplay)) {
    natureOfBusinessDisplay = natureOfBusinessDisplay.join(', ');
  }

  return (
    <View style={styles.card}>
      <Row label="Application No.:" value={applicationNo} />
      <Row label="Ward No.:" value={wardNo} />
      <Row label="Firm Type:" value={firmType} />
      <Row label="Owner Name:" value={ownerName} />
      <Row label="Guardian Name:" value={applyDate} />
      <Row label="Address:" value={address} />
      {natureOfBusinessDisplay && (
        <Row label="Nature of Business:" value={natureOfBusinessDisplay} />
      )}

      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reusable row component for label + value
const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: rh(1),
    borderRadius: 8,
    elevation: 3,
    padding: rh(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: rh(0.5),
  },
  label: {
    fontSize: rf(1.7),
    color: '#333',
    fontWeight: '500',
    width: '45%',
  },
  value: {
    fontSize: rf(1.7),
    color: '#555',
    width: '50%',
    textAlign: 'right',
  },
  button: {
    backgroundColor: Colors.primary || '#28a745',
    paddingVertical: rh(1),
    borderRadius: 6,
    marginTop: rh(2),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: rf(1.8),
    fontWeight: '600',
  },
});
