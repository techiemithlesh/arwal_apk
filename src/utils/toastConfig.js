import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={[styles.toast, styles.successToast]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={[styles.toast, styles.errorToast]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={[styles.toast, styles.infoToast]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  toast: {
    borderLeftWidth: 5,
    width: '90%',
    zIndex: 99999,
    elevation: 99999,
  },
  successToast: {
    borderLeftColor: '#28a745',
  },
  errorToast: {
    borderLeftColor: '#dc3545',
  },
  infoToast: {
    borderLeftColor: '#17a2b8',
  },
  text1: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  text2: {
    fontSize: 13,
    color: '#666',
  },
});