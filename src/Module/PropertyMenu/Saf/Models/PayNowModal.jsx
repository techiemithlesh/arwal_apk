import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

export const PayNowModal = ({
  visible,
  onClose,
  paymentType,
  setPaymentType,
  paymentMode,
  setPaymentMode,
  amount,
  setAmount,
  refNo,
  setRefNo,
  chequeDate,
  setChequeDate,
  showDatePicker,
  setShowDatePicker,
  bankName,
  setBankName,
  branchName,
  setBranchName,
  onProceed,
}) => {
  const paymentTypeData = [{label: 'Full', value: 'Full'}];

  const paymentModeData = [
    {label: 'DD', value: 'DD'},
    {label: 'Cash', value: 'Cash'},
    {label: 'NEFT', value: 'NEFT'},
    {label: 'Cheque', value: 'ChEQUE'},
  ];

  const handleProceed = () => {
    // Validate required fields
    if (!paymentType || !paymentMode) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    if (paymentMode !== 'Cash' && (!refNo || !bankName || !branchName)) {
      Alert.alert('Validation Error', 'Please fill all payment details');
      return;
    }

    onProceed();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>💳 Make Payment</Text>

          {/* Payment Type Dropdown */}
          <Text style={styles.label}>Payment Type *</Text>
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
          <Text style={styles.label}>Payment Mode *</Text>
          <Dropdown
            style={styles.dropdown}
            data={paymentModeData}
            labelField="label"
            valueField="value"
            placeholder="Select Payment Mode"
            value={paymentMode}
            onChange={item => setPaymentMode(item.value)}
          />

          {paymentMode && paymentMode !== 'Cash' && (
            <>
              {/* Cheque/DD/Ref No */}
              <Text style={styles.label}>Cheque/DD/Ref No *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Cheque/DD/Ref No"
                value={refNo}
                onChangeText={setRefNo}
              />

              {/* Cheque/DD Date */}
              <Text style={styles.label}>Cheque/DD Date *</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text>
                  {chequeDate
                    ? `${chequeDate.getDate().toString().padStart(2, '0')}/${(
                        chequeDate.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, '0')}/${chequeDate
                        .getFullYear()
                        .toString()
                        .slice(-2)}`
                    : 'Select Cheque/DD Date'}
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

              {/* Bank Name */}
              <Text style={styles.label}>Bank Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Bank Name"
                value={bankName}
                onChangeText={setBankName}
              />

              {/* Branch Name */}
              <Text style={styles.label}>Branch Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Branch Name"
                value={branchName}
                onChangeText={setBranchName}
              />
            </>
          )}
          {/* Amount Input */}
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            editable={false}
          />

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleProceed}
              style={styles.confirmButton}
            >
              <Text>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
