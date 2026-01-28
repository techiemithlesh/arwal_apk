// PaymentReceiptModal.jsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

const PaymentReceiptModal = ({ visible, onClose, paymentDtls }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.modalTitle}>Payment Receipt</Text>

            {paymentDtls ? (
              <>
                <Text style={styles.itemText}>
                  <Text style={styles.label}>Transaction No: </Text>
                  {paymentDtls.tranNo}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.label}>Date: </Text>
                  {paymentDtls.tranDate}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.label}>Mode: </Text>
                  {paymentDtls.paymentMode}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.label}>Amount: </Text>₹{' '}
                  {paymentDtls.payableAmt}
                </Text>
              </>
            ) : (
              <Text style={styles.itemText}>Loading...</Text>
            )}

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentReceiptModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
