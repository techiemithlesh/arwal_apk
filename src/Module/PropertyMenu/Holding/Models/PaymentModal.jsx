import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './sharedStyles';

export const PaymentModal = ({
  visible,
  onClose,
  paymentTypeData,
  paymentModeData,
  paymentType,
  setPaymentType,
  paymentMode,
  setPaymentMode,
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
  amount,
  setAmount,
  onProceed,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>💳 Make Payment</Text>

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
            <Text style={styles.label}>Cheque/DD/Ref No *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Cheque/DD/Ref No"
              value={refNo}
              onChangeText={setRefNo}
            />

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

            <Text style={styles.label}>Bank Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Bank Name"
              value={bankName}
              onChangeText={setBankName}
            />

            <Text style={styles.label}>Branch Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Branch Name"
              value={branchName}
              onChangeText={setBranchName}
            />
          </>
        )}

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          editable={false}
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onProceed} style={styles.confirmButton}>
            <Text>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
