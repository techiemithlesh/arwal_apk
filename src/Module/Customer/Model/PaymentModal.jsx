import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { CUSTOMER_API } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import { sharedStyles } from './sharedStyles';

export const PaymentModal = ({
  visible,
  onClose,
  customerDue,
  customerDeuDetails,
  id,
}) => {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState('Full Payment');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amount, setAmount] = useState(
    customerDeuDetails?.payableAmount || '0.00',
  );
  const [demandData, setDemandData] = useState(null);

  // Dropdown states
  const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);
  const [showPaymentModeDropdown, setShowPaymentModeDropdown] = useState(false);
  const [recitpdata, setReceiptData] = useState('');

  const paymentTypeOptions = ['Full Payment', 'Partial Payment'];
  const paymentModeOptions = ['Cash', 'Credit Card', 'Bank Transfer'];

  // Custom Dropdown Component
  const CustomDropdown = ({
    options,
    selectedValue,
    onSelect,
    placeholder,
    showDropdown,
    setShowDropdown,
  }) => (
    <View style={{ position: 'relative', zIndex: showDropdown ? 1000 : 1 }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 4,
          padding: 12,
          backgroundColor: '#fff',
          marginBottom: showDropdown ? 0 : 15,
        }}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text>{selectedValue || placeholder}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View
          style={{
            position: 'absolute',
            top: 45,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            borderTopWidth: 0,
            borderRadius: 4,
            marginBottom: 15,
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 12,
                borderBottomWidth: index < options.length - 1 ? 1 : 0,
                borderBottomColor: '#eee',
              }}
              onPress={() => {
                onSelect(option);
                setShowDropdown(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const handleProceedPayment = async () => {
    try {
      const token = await getToken();

      console.log('Customer Due ID:', customerDeuDetails?.id || 0);

      const requestBody = {
        paymentMode: paymentMode.toUpperCase().replace(' ', '_'), // e.g., "CASH"
        paymentType: paymentType === 'Full Payment' ? 'FULL' : 'PART',
        id: id, // Should be defined in your component state
        amount: parseFloat(amount),
      };

      console.log('Request Body:', requestBody);

      const response = await axios.post(
        CUSTOMER_API.CUSTOMER_PAY_DUE_API,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response Data:', response.data);

      if (response.status >= 200 && response.status < 300) {
        setReceiptData(response.data);
        Alert.alert('Success', response?.data?.message);
        const updatedData = customerDue.map(item => ({
          ...item,
          amount: 0,
          totalTax: 0,
          balance: 0,
          unitAmount: 0,
          latePenalty: 0,
        }));

        setDemandData(updatedData);
        // Close modals
        setPaymentModalVisible(false);
        onClose();
      } else {
        console.error('Payment failed:', response.data);
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment API Exception:', error.response || error.message);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderItem = ({ item, index }) => (
    <View
      style={[
        sharedStyles.rowContainer,
        index % 2 === 0 ? sharedStyles.rowEven : sharedStyles.rowOdd,
      ]}
    >
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 2 }]}>{item.demandFrom}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 2 }]}>{item.demandUpto}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>₹ {item.amount}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
        ₹ {item.totalTax || 0}
      </Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>₹ {item.balance}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>{item.fromReading}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
        {item.currentMeterReading}
      </Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>₹ {item.unitAmount}</Text>
      <Text style={[sharedStyles.tableCell, { flex: 1 }]}>₹ {item.latePenalty}</Text>
      <Text
        style={[
          sharedStyles.tableCell,
          { flex: 1, color: item.paidStatus ? 'green' : 'red' },
        ]}
      >
        {item.paidStatus ? 'Paid' : 'Pending'}
      </Text>
    </View>
  );

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={sharedStyles.overlay}>
          <View style={sharedStyles.modalContent}>
            <ScrollView>
              <TouchableOpacity style={sharedStyles.closeBtn} onPress={onClose}>
                <Text style={sharedStyles.closeText}>Close</Text>
              </TouchableOpacity>

              <Text style={sharedStyles.mainTitle}>Demand Details</Text>

              {/* Table Section */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 700 }}>
                  {/* Table Header */}
                  <View style={[sharedStyles.rowContainer, sharedStyles.tableHeader]}>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>#</Text>
                    <Text style={[sharedStyles.tableCell, { flex: 2 }]}>
                      Demand From
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 2 }]}>
                      Demand To
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>Amount</Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>Tax</Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>Balance</Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
                      From Reading
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
                      Current Reading
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
                      Unit Amount
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>
                      Late Penalty
                    </Text>
                    <Text style={[sharedStyles.tableCell, { flex: 1 }]}>Paid</Text>
                  </View>

                  {/* Table Data */}
                  <FlatList
                    data={customerDue}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>

              <View style={sharedStyles.paymentSummarySection}>
                <Text style={sharedStyles.paymentTitle}>Main Demand</Text>

                <View style={sharedStyles.paymentDetailsContainer}>
                  <View style={sharedStyles.paymentRow}>
                    <View style={sharedStyles.paymentItem}>
                      <Text style={sharedStyles.paymentLabel}>Demand:</Text>
                      <Text style={sharedStyles.paymentValue}>
                        ₹{customerDeuDetails?.demandAmount || '0.00'}
                      </Text>
                    </View>

                    <View style={sharedStyles.paymentItem}>
                      <Text style={[sharedStyles.paymentLabel, sharedStyles.penaltyText]}>
                        Penalty:
                      </Text>
                      <Text style={[sharedStyles.paymentValue, sharedStyles.penaltyText]}>
                        ₹{customerDeuDetails?.penaltyAmount || '0.00'}
                      </Text>
                    </View>

                    <View style={sharedStyles.paymentItem}>
                      <Text style={[sharedStyles.paymentLabel, sharedStyles.penaltyText]}>
                        Other Penalty:
                      </Text>
                      <Text style={[sharedStyles.paymentValue, sharedStyles.penaltyText]}>
                        ₹{customerDeuDetails?.otherPenalty || '0.00'}
                      </Text>
                    </View>

                    <View style={sharedStyles.paymentItem}>
                      <Text style={[sharedStyles.paymentLabel, sharedStyles.advanceText]}>
                        Advance:
                      </Text>
                      <Text style={[sharedStyles.paymentValue, sharedStyles.advanceText]}>
                        ₹{customerDeuDetails?.advanceAmount || '0.00'}
                      </Text>
                    </View>
                  </View>

                  <View style={sharedStyles.totalSection}>
                    <Text style={sharedStyles.totalSectionText}>Total</Text>
                  </View>

                  <View style={sharedStyles.totalPayableContainer}>
                    <Text style={sharedStyles.totalPayableLabel}>
                      Total Payable Amount:
                    </Text>
                    <Text style={sharedStyles.totalPayableValue}>
                      ₹{customerDeuDetails.payableAmount || '0.00'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    backgroundColor: '#28a745',
                    padding: 12,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                  onPress={() => setPaymentModalVisible(true)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Pay Now
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={paymentModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000088',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
            >
              Process Payment
            </Text>

            <View style={sharedStyles.fieldContainer}>
              <Text style={sharedStyles.label}>Payment Type</Text>
              <CustomDropdown
                options={paymentTypeOptions}
                selectedValue={paymentType}
                onSelect={setPaymentType}
                placeholder="Select Payment Type"
                showDropdown={showPaymentTypeDropdown}
                setShowDropdown={setShowPaymentTypeDropdown}
              />
            </View>

            <View style={sharedStyles.fieldContainer}>
              <Text style={sharedStyles.label}>Payment Mode</Text>
              <CustomDropdown
                options={paymentModeOptions}
                selectedValue={paymentMode}
                onSelect={setPaymentMode}
                placeholder="Select Payment Mode"
                showDropdown={showPaymentModeDropdown}
                setShowDropdown={setShowPaymentModeDropdown}
              />
            </View>

            <Text>Amount:</Text>
            <TextInput
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 8, marginBottom: 15 }}
              value={amount}
              onChangeText={setAmount}
            />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#ccc',
                  padding: 12,
                  borderRadius: 6,
                }}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#28a745',
                  padding: 12,
                  borderRadius: 6,
                }}
                onPress={handleProceedPayment}
              >
                <Text style={{ color: '#fff' }}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PaymentModal;
