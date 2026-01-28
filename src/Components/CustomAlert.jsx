// Components/CustomAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../Module/Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const CustomAlert = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: Colors.background,
    padding: responsiveHeight(3),
    width: '80%',
    borderRadius: responsiveWidth(3),
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: responsiveHeight(1.5),
  },
  message: {
    fontSize: responsiveFontSize(1.9),
    color: '#333',
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(2),
  },
  buttonText: {
    color: Colors.background,
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
