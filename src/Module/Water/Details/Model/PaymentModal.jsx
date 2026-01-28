import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getToken } from '../../../../utils/auth';
import { WATER_API_ROUTES } from '../../../../api/apiRoutes';
import axios from 'axios';

export const PaymentModal = ({
  visible,
  onClose,
  tradeDetails,
  id,
  fetchAllData,
  onShowReceipt,
  onPaymentSuccess,
}) => {
  const [payNowModalVisible, setPayNowModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [amount, setAmount] = useState(tradeDetails?.payableAmount || '0.00');

  const paymentTypeData = [
    { label: 'Full Payment', value: 'full' },
    { label: 'Part Payment', value: 'part' },
  ];
  const paymentModeData = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'DD', value: 'DD' },
    { label: 'Online', value: 'Online' },
  ];

  const [updatedTradeDetails, setUpdatedTradeDetails] = useState(tradeDetails);

  const processPayment = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return { success: false };
      }

      const paymentData = {
        id: id,
        paymentType: paymentType?.toUpperCase() || 'FULL',
        paymentMode: paymentMode?.toUpperCase() || 'CASH',
        chequeNo: paymentMode === 'Cash' ? '' : refNo || '',
        chequeDate:
          paymentMode === 'Cash'
            ? ''
            : chequeDate
            ? chequeDate.toISOString().split('T')[0]
            : '',
        bankName: paymentMode === 'Cash' ? '' : bankName || '',
        branchName: paymentMode === 'Cash' ? '' : branchName || '',
      };

      console.log('Processing payment:', paymentData);

      const response = await axios.post(
        WATER_API_ROUTES.PAY_DEMAND,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Payment Success:', response.data.status);
      if (response.data.status === true) {
        console.log('Payment Success:', response.data.data?.tranId);

        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );

        fetchAllData();

        if (response.data.status === true) {
          setUpdatedTradeDetails(prev => ({
            ...prev,
            demandAmount: 0,
            payableAmount: 0,
            realizationPenalty: 0,
            demandList: prev?.demandList?.map(i => ({
              ...i,
              connFee: 0,
              penalty: 0,
              amount: 0,
            })),
          }));
        }
        if (typeof onShowReceipt === 'function') {
          console.log('Triggering receipt modal with:', response.data.data);
          onShowReceipt(response.data.data);
        }

        return { success: true, tranId: response.data.data?.tranId };
      } else {
        Alert.alert('Payment Error', response.data.message || 'Payment failed');
        return { success: false };
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        error.response?.data?.message ||
          'Failed to process payment. Please try again.',
      );
      return { success: false };
    }
  };

  return (
    <>
      {/* Main Demand Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.mainTitle}>View Demand</Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>#</Text>
                <Text style={[styles.tableHeaderText, { flex: 3 }]}>
                  Charge Type
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Connection Fee
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Penalty
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Total</Text>
              </View>

              {/* Table Row (from demandList[0]) */}
              {tradeDetails?.demandList?.map((item, index) => (
                <View style={styles.tableRow} key={item.id || index}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 3 }]}>
                    {item.chargeFor}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.connFee}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.penalty}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.amount}
                  </Text>
                </View>
              ))}

              {/* Main Demand */}
              <Text style={styles.sectionTitle}>Main Demand</Text>
              <View style={styles.demandBox}>
                <Text style={styles.demandText}>
                  Demand: {tradeDetails?.demandAmount || '0.00'}
                </Text>
                <Text style={styles.penaltyText}>
                  Penalty: {tradeDetails?.realizationPenalty || '0.00'} [
                  {tradeDetails?.description}]
                </Text>
              </View>
              {/* Total */}
              <View style={styles.totalBox}>
                <Text style={styles.totalText}>
                  Total Payable Amount: {tradeDetails?.payableAmount || '0.00'}
                </Text>
              </View>
              {/* Pay Now Button */}
              <View style={styles.totalBox}>
                <TouchableOpacity
                  onPress={() => setPayNowModalVisible(true)}
                  style={styles.confirmButton}
                >
                  <Text>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pay Now Modal */}
      <Modal
        visible={payNowModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPayNowModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle}>💳 Make Payment</Text>

            {/* Payment Type Dropdown */}
            <Text>Payment Type *</Text>
            <Dropdown
              style={styles.dropdown}
              data={paymentTypeData}
              labelField="label"
              valueField="value"
              placeholder="Select Payment Type"
              value={paymentType}
              onChange={item => setPaymentType(item.value)}
            />

            {/* Payment Mode Dropdown */}
            <Text>Payment Mode *</Text>
            <Dropdown
              style={styles.dropdown}
              data={paymentModeData}
              labelField="label"
              valueField="value"
              placeholder="Select Payment Mode"
              value={paymentMode}
              onChange={item => setPaymentMode(item.value)}
            />

            {/* Extra fields if not Cash */}
            {paymentMode && paymentMode !== 'Cash' && (
              <>
                <Text>Cheque/DD/Ref No *</Text>
                <TextInput
                  style={styles.input}
                  value={refNo}
                  onChangeText={setRefNo}
                />

                <Text>Cheque/DD Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text>
                    {chequeDate
                      ? chequeDate.toLocaleDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={chequeDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setChequeDate(selectedDate);
                    }}
                  />
                )}

                <Text>Bank Name *</Text>
                <TextInput
                  style={styles.input}
                  value={bankName}
                  onChangeText={setBankName}
                />

                <Text>Branch Name *</Text>
                <TextInput
                  style={styles.input}
                  value={branchName}
                  onChangeText={setBranchName}
                />
              </>
            )}

            {/* Amount */}
            <Text>Amount *</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              editable={false}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setPayNowModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  if (!paymentType || !paymentMode) {
                    Alert.alert(
                      'Validation Error',
                      'Please fill required fields',
                    );
                    return;
                  }

                  if (
                    paymentMode !== 'Cash' &&
                    (!refNo || !bankName || !branchName)
                  ) {
                    Alert.alert(
                      'Validation Error',
                      'Please fill payment details',
                    );
                    return;
                  }

                  setPayNowModalVisible(false);
                  const paymentResult = await processPayment();

                  if (paymentResult.success) {
                    console.log('Payment Done:', paymentResult.tranId);
                  }
                }}
                style={styles.confirmButton}
              >
                <Text>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 6,
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mainTitle: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 10,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 13,
    color: '#000',
  },
  demandBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  demandText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  penaltyText: {
    fontSize: 13,
    color: 'red',
    marginBottom: 4,
  },
  totalBox: {
    backgroundColor: '#FEF08A',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent1: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
});
