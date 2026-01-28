import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_ROUTES } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import { styles } from './sharedStyles';

export const PaymentModal = ({
  visible,
  onClose,
  tradeDetails,
  demandDetails,
  onPaymentSuccess,
  setUpdatedTradeDetails,
}) => {
  const [year, setYear] = useState(null);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(new Date());
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [paymentType, setPaymentType] = useState('FULL');

  const processPayment = async () => {
    let response = null;

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return { success: false };
      }

      console.log('tradeDetails', tradeDetails);

      const paymentData = {
        id: tradeDetails?.id,
        paymentType: paymentType?.toUpperCase(),
        paymentMode: paymentMode?.toUpperCase(),
        chequeNo: paymentMode?.toUpperCase() === 'CASH' ? '' : refNo,
        chequeDate:
          paymentMode?.toUpperCase() === 'CASH'
            ? ''
            : chequeDate?.toISOString().split('T')[0],
        bankName: paymentMode?.toUpperCase() === 'CASH' ? '' : bankName,
        branchName: paymentMode?.toUpperCase() === 'CASH' ? '' : branchName,
      };

      console.log('paymentData', paymentData);

      try {
        response = await axios.post(API_ROUTES.TRADE_PAY_DEMAND, paymentData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(
          'Payment API Error:',
          error.response?.data || error.message,
        );
        response = error.response;
      }

      const tranId =
        response?.data?.data && typeof response.data.data === 'object'
          ? response.data.data.id
          : null;

      console.log('Transaction ID:', tranId);

      if (response?.data?.status === true) {
        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );

        // Reset local trade amounts to 0
        if (setUpdatedTradeDetails) {
          setUpdatedTradeDetails(prev => ({
            ...prev,
            demandAmount: 0,
            payableAmount: 0,
            realizationPenalty: 0,
            demandList: prev?.demandList?.map(item => ({
              ...item,
              connFee: 0,
              penalty: 0,
              amount: 0,
            })),
          }));
        }

        // Trigger refresh callback in parent
        if (onPaymentSuccess) onPaymentSuccess();

        // Close modal
        onClose();

        return { success: true, tranId };
      } else {
        Alert.alert(
          'Payment Error',
          response?.data?.message || 'Payment failed. Please try again.',
        );
        return { success: false };
      }
    } catch (error) {
      console.error('Unexpected Payment Error:', error);
      Alert.alert(
        'Payment Error',
        error?.response?.data?.message ||
          'Failed to process payment. Please try again later.',
      );
      return { success: false };
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Licence Required for the Year</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Charge Applied*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.totalCharge?.toString() || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Penalty*</Text>
              <TextInput style={styles.input} value="0" editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Denial Amount*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.latePenalty || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Charge*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.totalCharge?.toString() || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Mode*</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'CASH', value: 'CASH' },
                  { label: 'CHEQUE', value: 'CHEQUE' },
                  { label: 'ONLINE', value: 'ONLINE' },
                  { label: 'DD', value: 'DD' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Choose Payment Mode"
                value={paymentMode}
                onChange={item => setPaymentMode(item.value)}
              />
            </View>

            {paymentMode !== 'CASH' && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Ref No*</Text>
                  <TextInput
                    style={styles.input}
                    value={refNo}
                    onChangeText={setRefNo}
                    placeholder="Enter Reference Number"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Cheque Date*</Text>
                  <TextInput
                    style={styles.input}
                    value={chequeDate.toISOString().split('T')[0]}
                    onChangeText={text => setChequeDate(new Date(text))}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Bank Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Enter Bank Name"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Branch Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={branchName}
                    onChangeText={setBranchName}
                    placeholder="Enter Branch Name"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={async () => {
                if (!paymentMode) {
                  Alert.alert('Validation Error', 'Please select Payment Mode');
                  return;
                }

                if (
                  paymentMode !== 'CASH' &&
                  (!refNo || !bankName || !branchName)
                ) {
                  Alert.alert(
                    'Validation Error',
                    'Please fill all payment details',
                  );
                  return;
                }

                const paymentResult = await processPayment();

                if (paymentResult.success) {
                  console.log('✅ Payment Done:', paymentResult.tranId);
                }
              }}
            >
              <Text style={styles.submitText}>Pay Now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
