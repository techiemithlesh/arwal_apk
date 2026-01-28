import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './sharedStyles';

export const PaymentReceiptModal = ({ visible, onClose, paymentDtls }) => (
  <Modal
    visible={visible}
    transparent={false}
    animationType="slide"
    onRequestClose={onClose}
  >
    <ScrollView style={styles.modalContainer}>
      <Text style={styles.header}>View Receipt</Text>

      <View style={styles.logoWrapper}>
        <Text style={styles.logoCircle}>🏛️</Text>
      </View>

      <Text style={styles.corpName}>
        {paymentDtls?.ulbDtl?.ulbName || 'Ranchi Municipal Corporation'}
      </Text>

      <Text style={styles.receiptType}>
        {paymentDtls?.description || 'HOLDING TAX RECEIPT'}
      </Text>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelFixed}>
            Receipt No.: <Text style={styles.bold}>{paymentDtls?.tranNo}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            Department:{' '}
            <Text style={styles.bold}>{paymentDtls?.department}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            Account:{' '}
            <Text style={styles.bold}>{paymentDtls?.accountDescription}</Text>
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelFixed}>
            Date: <Text style={styles.bold}>{paymentDtls?.tranDate}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            Ward No: <Text style={styles.bold}>{paymentDtls?.wardNo}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            SAF No: <Text style={styles.bold}>{paymentDtls?.safNo}</Text>
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.labelFixed}>
          Received From:{' '}
          <Text style={styles.bold}>{paymentDtls?.ownerName}</Text>
        </Text>
        <Text style={styles.labelFixed}>
          Address: <Text style={styles.bold}>{paymentDtls?.address}</Text>
        </Text>
        <Text style={styles.labelFixed}>
          A Sum of Rs.: <Text style={styles.bold}>{paymentDtls?.amount}</Text>
        </Text>
        <Text style={styles.labelFixed}>
          (In words):{' '}
          <Text style={styles.bold}>{paymentDtls?.amountInWords}</Text>
        </Text>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  </Modal>
);
