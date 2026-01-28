// TradeModels.jsx
import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { WebView } from 'react-native-webview';
import RNBlobUtil from 'react-native-blob-util';
import PrintButton from '../../../Components/PrintButton';
import Toast from 'react-native-toast-message';
import { showToast } from '../../../utils/toast';
import { toastConfig } from '../../../utils/toastConfig';
import { CUSTOMER_API } from '../../../api/apiRoutes';

import Colors from '../../Constants/Colors';
import { getToken } from '../../../utils/auth';
import axios from 'axios';
// 1. View Trade License Modal
export const ViewTradeLicenseModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>
            Municipal Trade Licence Approval Certificate
          </Text>

          <Text style={styles.mainTitle}>Municipal License</Text>

          <Text style={styles.subTitle}>RANCHI MUNICIPAL CORPORATION</Text>
          <Text style={styles.tinyText}>
            (This certificate relates to Section 455(J) Jharkhand Municipal Act
            2011)
          </Text>

          {[
            [
              'Municipal Trade Licence No:',
              tradeDetails?.licenseNo || 'RAN55020319162233',
            ],
            ['Issue Date:', tradeDetails?.issueDate || '03-02-2019'],
            ['Validity:', tradeDetails?.validUpto || '23-01-2020'],
            [
              'Owner/Entity Name:',
              tradeDetails?.firmName || 'GOPAL GENERAL STORE',
            ],
            [
              'Owner Name:',
              tradeDetails?.owners?.[0]?.ownerName || 'ARVIND KUMAR',
            ],
            ['Nature of Entity:', tradeDetails?.firmType || 'GENERAL STORE'],
            [
              'Nature of Business:',
              tradeDetails?.natureOfBusiness ||
                'GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PARCHING',
            ],
            ['Business Code:', tradeDetails?.businessCode || '(83)'],
            ['Date of Application:', tradeDetails?.applyDate || '24-01-2019'],
            ['Ward No.:', tradeDetails?.wardNo || '55'],
            ['Holding No.:', tradeDetails?.holdingNo || 'N/A'],
            [
              'Street Address:',
              tradeDetails?.address ||
                'NEW NAGAR BANDHGARI DIPATOLI RANCHI834001',
            ],
            [
              'Application No.:',
              tradeDetails?.applicationNo || '162233240119104140',
            ],
            [
              'Mobile No.:',
              tradeDetails?.owners?.[0]?.mobileNo || '9709226782',
            ],
          ].map(([label, value], index) => (
            <View style={styles.rowContainer} key={index}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}

          <Text style={styles.declaration}>
            This is to declare that{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.firmName || 'GOPAL GENERAL STORE'}
            </Text>{' '}
            having application number{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.applicationNo || '162233240119104140'}
            </Text>{' '}
            has been successfully registered with satisfactory compliance of
            registration criteria.
          </Text>

          <View style={{ marginTop: 10 }}>
            {[
              '1. The business will run according to the license issued.',
              '2. Prior permission from the local body is necessary if the business is changed.',
              '3. Information to the local body is necessary for extension of the area.',
              '4. Prior intimation to local body regarding winding off business is necessary.',
              '5. Renewal is necessary one month before expiry.',
              '6. Penalty may be levied under Section 459.',
              '7. Illegal parking in front of the firm is non-permissible.',
              '8. Dustbins must be available at premises and adhere to waste disposal rules.',
              '9. SWM & Plastic Waste Management Rules 2016 shall be adhered to.',
            ].map((term, i) => (
              <Text style={styles.term} key={i}>
                {term}
              </Text>
            ))}
          </View>

          <Text style={styles.note}>
            Note: This is a computer-generated license. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export const ViewDemandModal = ({
  visible,
  onClose,
  customerDue,
  customerDeuDetails,
}) => {
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.rowContainer,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
      ]}
    >
      <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.demandFrom}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.demandUpto}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.amount}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        ₹ {item.totalTax || 0}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.balance}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.fromReading}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        {item.currentMeterReading}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.unitAmount}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.latePenalty}</Text>
      <Text
        style={[
          styles.tableCell,
          { flex: 1, color: item.paidStatus ? 'green' : 'red' },
        ]}
      >
        {item.paidStatus ? 'Paid' : 'Pending'}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Demand Details</Text>

            {/* Table Section */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ minWidth: 700 }}>
                {/* Table Header */}
                <View style={[styles.rowContainer, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>#</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    Demand From
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Demand To</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Tax</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Balance</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    From Reading
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    Current Reading
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    Unit Amount
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    Late Penalty
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Paid</Text>
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

            <View style={styles.paymentSummarySection}>
              <Text style={styles.paymentTitle}>Main Demand</Text>

              <View style={styles.paymentDetailsContainer}>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentItem}>
                    <Text style={styles.paymentLabel}>Demand:</Text>
                    <Text style={styles.paymentValue}>
                      ₹{customerDeuDetails?.demandAmount || '0.00'}
                    </Text>
                  </View>

                  <View style={styles.paymentItem}>
                    <Text style={[styles.paymentLabel, styles.penaltyText]}>
                      Penalty:
                    </Text>
                    <Text style={[styles.paymentValue, styles.penaltyText]}>
                      ₹{customerDeuDetails?.penaltyAmount || '0.00'}
                    </Text>
                  </View>

                  <View style={styles.paymentItem}>
                    <Text style={[styles.paymentLabel, styles.penaltyText]}>
                      Other Penalty:
                    </Text>
                    <Text style={[styles.paymentValue, styles.penaltyText]}>
                      ₹{customerDeuDetails?.otherPenalty || '0.00'}
                    </Text>
                  </View>

                  <View style={styles.paymentItem}>
                    <Text style={[styles.paymentLabel, styles.advanceText]}>
                      Advance:
                    </Text>
                    <Text style={[styles.paymentValue, styles.advanceText]}>
                      ₹{customerDeuDetails?.advanceAmount || '0.00'}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalSection}>
                  <Text style={styles.totalSectionText}>Total</Text>
                </View>

                <View style={styles.totalPayableContainer}>
                  <Text style={styles.totalPayableLabel}>
                    Total Payable Amount:
                  </Text>
                  <Text style={styles.totalPayableValue}>
                    ₹{customerDeuDetails.payableAmount || '0.00'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

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
        styles.rowContainer,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
      ]}
    >
      <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.demandFrom}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.demandUpto}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.amount}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        ₹ {item.totalTax || 0}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.balance}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.fromReading}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>
        {item.currentMeterReading}
      </Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.unitAmount}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>₹ {item.latePenalty}</Text>
      <Text
        style={[
          styles.tableCell,
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
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>

              <Text style={styles.mainTitle}>Demand Details</Text>

              {/* Table Section */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 700 }}>
                  {/* Table Header */}
                  <View style={[styles.rowContainer, styles.tableHeader]}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>#</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      Demand From
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      Demand To
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Tax</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Balance</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      From Reading
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      Current Reading
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      Unit Amount
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      Late Penalty
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Paid</Text>
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

              <View style={styles.paymentSummarySection}>
                <Text style={styles.paymentTitle}>Main Demand</Text>

                <View style={styles.paymentDetailsContainer}>
                  <View style={styles.paymentRow}>
                    <View style={styles.paymentItem}>
                      <Text style={styles.paymentLabel}>Demand:</Text>
                      <Text style={styles.paymentValue}>
                        ₹{customerDeuDetails?.demandAmount || '0.00'}
                      </Text>
                    </View>

                    <View style={styles.paymentItem}>
                      <Text style={[styles.paymentLabel, styles.penaltyText]}>
                        Penalty:
                      </Text>
                      <Text style={[styles.paymentValue, styles.penaltyText]}>
                        ₹{customerDeuDetails?.penaltyAmount || '0.00'}
                      </Text>
                    </View>

                    <View style={styles.paymentItem}>
                      <Text style={[styles.paymentLabel, styles.penaltyText]}>
                        Other Penalty:
                      </Text>
                      <Text style={[styles.paymentValue, styles.penaltyText]}>
                        ₹{customerDeuDetails?.otherPenalty || '0.00'}
                      </Text>
                    </View>

                    <View style={styles.paymentItem}>
                      <Text style={[styles.paymentLabel, styles.advanceText]}>
                        Advance:
                      </Text>
                      <Text style={[styles.paymentValue, styles.advanceText]}>
                        ₹{customerDeuDetails?.advanceAmount || '0.00'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.totalSection}>
                    <Text style={styles.totalSectionText}>Total</Text>
                  </View>

                  <View style={styles.totalPayableContainer}>
                    <Text style={styles.totalPayableLabel}>
                      Total Payable Amount:
                    </Text>
                    <Text style={styles.totalPayableValue}>
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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Payment Type</Text>
              <CustomDropdown
                options={paymentTypeOptions}
                selectedValue={paymentType}
                onSelect={setPaymentType}
                placeholder="Select Payment Type"
                showDropdown={showPaymentTypeDropdown}
                setShowDropdown={setShowPaymentTypeDropdown}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Payment Mode</Text>
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
// export const PaymentModal = ({
//   visible,
//   onClose,
//   tradeDetails,
//   demandDetails,
//   setUpdatedTradeDetails,
// }) => {
//   const [year, setYear] = useState(null);
//   const [paymentMode, setPaymentMode] = useState(null);
//   const [refNo, setRefNo] = useState('');
//   const [chequeDate, setChequeDate] = useState(new Date());
//   const [bankName, setBankName] = useState('');
//   const [branchName, setBranchName] = useState('');
//   const [paymentType, setPaymentType] = useState('FULL');
//   const processPayment = async () => {
//     let response = null; // declare here
//     try {
//       const token = await getToken();
//       if (!token) {
//         Alert.alert('Error', 'Token not found');
//         return { success: false };
//       }

//       console.log('tradeDetails', tradeDetails);
//       const paymentData = {
//         id: tradeDetails?.id,
//         paymentType: paymentType.toUpperCase(),
//         paymentMode: paymentMode.toUpperCase(),
//         chequeNo: paymentMode.toUpperCase() === 'CASH' ? '' : refNo,
//         chequeDate:
//           paymentMode.toUpperCase() === 'CASH'
//             ? ''
//             : chequeDate.toISOString().split('T')[0],
//         bankName: paymentMode.toUpperCase() === 'CASH' ? '' : bankName,
//         branchName: paymentMode.toUpperCase() === 'CASH' ? '' : branchName,
//       };

//       console.log('paymentData', paymentData);

//       try {
//         response = await axios.post(API_ROUTES.TRADE_PAY_DEMAND, paymentData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         console.log('Full API Response:', response.data);
//         console.log('Status:', response.data.status);
//         console.log('Message:', response.data.message);
//         console.log('Data:', response.data.data);
//       } catch (error) {
//         console.error(
//           'Payment API Error:',
//           error.response?.data || error.message,
//         );
//         response = error.response; // capture the error response to avoid ReferenceError
//       }

//       const tranId =
//         response?.data?.data && typeof response.data.data === 'object'
//           ? response.data.data.id
//           : null;

//       console.log('Transaction ID:', tranId);

//       if (response?.data?.status === true) {
//         Alert.alert(
//           'Success',
//           response.data.message || 'Payment Successfully Done',
//         );

//         setUpdatedTradeDetails(prev => ({
//           ...prev,
//           demandAmount: 0,
//           payableAmount: 0,
//           realizationPenalty: 0,
//           demandList: prev?.demandList?.map(i => ({
//             ...i,
//             connFee: 0,
//             penalty: 0,
//             amount: 0,
//           })),
//         }));

//         return { success: true, tranId };
//       } else {
//         Alert.alert(
//           'Payment Error',
//           response?.data?.message || 'Payment failed',
//         );
//         return { success: false };
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       Alert.alert(
//         'Payment Error',
//         error.response?.data?.message ||
//           'Failed to process payment. Please try again.',
//       );
//       return { success: false };
//     }
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.overlay}>
//         <View style={styles.modalContent}>
//           <ScrollView contentContainerStyle={styles.scrollContent}>
//             <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//               <Text style={styles.closeText}>✕</Text>
//             </TouchableOpacity>

//             <Text style={styles.mainTitle}>Licence Required for the Year</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>License For*</Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 data={[
//                   { label: 'Year 1', value: 1 },
//                   { label: 'Year 2', value: 2 },
//                   { label: 'Year 3', value: 3 },
//                   { label: 'Year 4', value: 4 },
//                   { label: 'Year 5', value: 5 },
//                   { label: 'Year 6', value: 6 },
//                   { label: 'Year 7', value: 7 },
//                   { label: 'Year 8', value: 8 },
//                   { label: 'Year 9', value: 9 },
//                   { label: 'Year 10', value: 10 },
//                 ]}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Choose Year"
//                 value={year}
//                 onChange={item => setYear(item.value)}
//               />
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Charge Applied*</Text>
//               <TextInput
//                 style={styles.input}
//                 value={demandDetails?.totalCharge?.toString() || '0'}
//                 editable={false}
//               />
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Penalty*</Text>
//               <TextInput style={styles.input} value="0" editable={false} />
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Denial Amount*</Text>
//               <TextInput
//                 style={styles.input}
//                 value={demandDetails?.latePenalty || '0'}
//                 editable={false}
//               />
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Total Charge*</Text>
//               <TextInput
//                 style={styles.input}
//                 value={demandDetails?.totalCharge?.toString() || '0'}
//                 editable={false}
//               />
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Payment Mode*</Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 data={[
//                   { label: 'CASH', value: 'CASH' },
//                   { label: 'CHEQUE', value: 'CHEQUE' },
//                   { label: 'ONLINE', value: 'ONLINE' },
//                   { label: 'DD', value: 'DD' },
//                 ]}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Choose Payment Mode"
//                 value={paymentMode}
//                 onChange={item => setPaymentMode(item.value)}
//               />
//             </View>

//             {paymentMode !== 'CASH' && (
//               <>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Ref No*</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={refNo}
//                     onChangeText={setRefNo}
//                     placeholder="Enter Reference Number"
//                   />
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Cheque Date*</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={chequeDate.toISOString().split('T')[0]}
//                     onChangeText={text => setChequeDate(new Date(text))}
//                     placeholder="YYYY-MM-DD"
//                   />
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Bank Name*</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={bankName}
//                     onChangeText={setBankName}
//                     placeholder="Enter Bank Name"
//                   />
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Branch Name*</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={branchName}
//                     onChangeText={setBranchName}
//                     placeholder="Enter Branch Name"
//                   />
//                 </View>
//               </>
//             )}

//             <TouchableOpacity
//               style={styles.submitBtn}
//               onPress={async () => {
//                 if (!year || !paymentMode) {
//                   Alert.alert(
//                     'Validation Error',
//                     'Please fill required fields',
//                   );
//                   return;
//                 }

//                 if (
//                   paymentMode !== 'CASH' &&
//                   (!refNo || !bankName || !branchName)
//                 ) {
//                   Alert.alert(
//                     'Validation Error',
//                     'Please fill all payment details',
//                   );
//                   return;
//                 }

//                 const paymentResult = await processPayment();

//                 if (paymentResult.success) {
//                   console.log('Payment Done:', paymentResult.tranId);
//                   onClose();
//                   // Add additional actions if needed
//                 }
//               }}
//             >
//               <Text style={styles.submitText}>Pay Now</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// };

const { width, height } = Dimensions.get('window');
const downloadPDF = async url => {
  try {
    const { fs } = RNBlobUtil;
    const dir = fs.dirs.DownloadDir; // Downloads folder
    const path = `${dir}/document_${Date.now()}.pdf`;

    const res = await RNBlobUtil.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading PDF...',
      },
    }).fetch('GET', url);

    showToast('success', '📄 Success', 'PDF Downloaded Successfully!');
    console.log('PDF saved to:', res.path());
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', 'Download failed!');
  }
};

export const DocumentModal = ({ visible, onClose, documents }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const openPreview = index => {
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const renderPreviewItem = ({ item }) => {
    const isPDF = item.docPath?.toLowerCase().endsWith('.pdf');

    return (
      <View
        style={{
          width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPDF ? (
          <View style={{ alignItems: 'center' }}>
            {/* PDF Preview via Google Docs viewer */}
            <WebView
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                  item.docPath,
                )}`,
              }}
              style={{
                width: width * 0.95,
                height: height * 0.75,
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            />

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => downloadPDF(item.docPath)}
            >
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
            <View style={{ padding: 20 }}>
              <Text style={{}}>Trade Documents</Text>
              <PrintButton fileUrl={item.docPath} title="Print" />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.docPath }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        {/* Document List Modal */}
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Uploaded Documents</Text>

            <View style={styles.sectionContainer}>
              {documents?.length > 0 ? (
                documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.documentName}>
                        {doc.docName} ({doc.ownerName || 'N/A'})
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded By: {doc.uploadedBy || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Owner: {doc.ownerName || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded At: {doc.createdAt?.split('T')[0] || 'N/A'}
                      </Text>
                      {doc.verifiedAt && (
                        <Text style={styles.documentDate}>
                          Verified At: {doc.verifiedAt}
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={[
                          styles.documentStatus,
                          {
                            color:
                              doc.verifiedStatus === 1
                                ? 'green'
                                : doc.verifiedStatus === 2
                                ? 'red'
                                : 'orange',
                          },
                        ]}
                      >
                        {doc.verifiedStatus === 1
                          ? 'Verified'
                          : doc.verifiedStatus === 2
                          ? 'Rejected'
                          : 'Pending'}
                      </Text>

                      {/* View Button */}
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => openPreview(index)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#666' }}>
                  No Documents Uploaded
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View style={styles.previewOverlay}>
            <TouchableOpacity
              style={styles.previewCloseBtn}
              onPress={() => setPreviewVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={documents}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentIndex}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPreviewItem}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 300);
              }}
            />
            {/* Toast inside modal to ensure it appears above modal content */}
            <Toast config={toastConfig} position="top" topOffset={60} />
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

// 5. Payment Receipt Modal
export const PaymentReceiptModal1 = ({ visible, onClose, receiptData }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>Payment Receipt</Text>
          <Text style={styles.subTitle}>
            {receiptData?.ulbDtl?.ulbName || 'Municipal Corporation'}
          </Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Receipt Info</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Receipt No:</Text>
              <Text style={styles.value}>{receiptData?.tranNo || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{receiptData?.tranDate || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Application No:</Text>
              <Text style={styles.value}>
                {receiptData?.applicationNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Account:</Text>
              <Text style={styles.value}>
                {receiptData?.accountDescription || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Owner Details</Text>
            {receiptData?.ownerDtl?.map((o, i) => (
              <View style={styles.rowContainer} key={i}>
                <Text style={styles.label}>Owner {i + 1}:</Text>
                <Text style={styles.value}>
                  {o.ownerName} ({o.mobileNo})
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Mode:</Text>
              <Text style={styles.value}>
                {receiptData?.paymentMode || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      receiptData?.paymentStatus === 'Clear' ? 'green' : 'red',
                  },
                ]}
              >
                {receiptData?.paymentStatus || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.amount || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>In Words:</Text>
              <Text style={styles.value}>
                {receiptData?.amountInWords || ''}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Transaction</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Payable Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.payableAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Demand Amount:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.demandAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Penalty:</Text>
              <Text style={styles.value}>
                ₹ {receiptData?.tranDtl?.penaltyAmt || '0.00'}
              </Text>
            </View>
          </View>

          {receiptData?.fineRebate?.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Fine / Rebate</Text>
              {receiptData.fineRebate.map((f, i) => (
                <View style={styles.rowContainer} key={i}>
                  <Text style={styles.label}>{f.headName}:</Text>
                  <Text style={styles.value}>₹ {f.amount}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.note}>
            Note: This is a computer-generated receipt. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Download / Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => {
  if (!receiptData) return null;
  console.log('recipt data', receiptData);

  const data = receiptData;

  const qrCodeUrl = data.qrCode || '';
  const purpose = data.description || 'Water Connection';
  const mode = data.paymentMode || 'CASH';

  const lineItems = data.collection?.map(item => ({
    description: data.description || 'Water Connection',
    fromQTR: item.demandFrom || '',
    fromFY: item.fromDate || '',
    toQTR: item.uptoDate || '',
    toFY: item.uptoDate || '',
    amount: item.amount || '0',
  })) || [];

  const totalAmount = lineItems
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    .toFixed(2);

  const totalPaid = parseFloat(data.amount || 0).toFixed(2);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.receiptContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header with Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Payment Receipt</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Receipt Info */}
          <View style={styles.receiptInfo}>
            <Text>
              Trans No: <Text style={styles.bold}>{data.tranNo || 'N/A'}</Text>
            </Text>
            <Text>
              Received From:{' '}
              <Text style={styles.bold}>
                {data.ownerDtl?.[0]?.ownerName || 'N/A'}
              </Text>
            </Text>
            <Text>
              Address: <Text style={styles.bold}>{data.address || 'N/A'}</Text>
            </Text>
            <Text>
              A Sum of Rs.:{' '}
              <Text style={styles.bold}>{data.amount || '0.00'}</Text>
            </Text>
            <Text>
              In Words:{' '}
              <Text style={styles.bold}>{data.amountInWords || 'N/A'}</Text>
            </Text>
            <Text>
              Towards: <Text style={styles.bold}>{purpose}</Text> Vide:{' '}
              <Text style={styles.bold}>{mode}</Text>
            </Text>
          </View>

          {/* Table */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              {[
                'Description',
                'From QTR',
                'From FY',
                'To QTR',
                'To FY',
                'Amount',
              ].map((header, idx) => (
                <Text
                  key={idx}
                  style={[styles.tableCell, styles.tableHeaderCell]}
                >
                  {header}
                </Text>
              ))}
            </View>

            {/* Table Body */}
            {lineItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.fromQTR}</Text>
                <Text style={styles.tableCell}>{item.fromFY}</Text>
                <Text style={styles.tableCell}>{item.toQTR}</Text>
                <Text style={styles.tableCell}>{item.toFY}</Text>
                <Text style={styles.tableCell}>₹ {item.amount}</Text>
              </View>
            ))}

            {/* Table Footer */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.bold]}>Total Amount</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={[styles.tableCell, styles.bold]}>
                ₹ {totalAmount}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.bold]}>
                Total Paid Amount
              </Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={[styles.tableCell, styles.bold]}>₹ {totalPaid}</Text>
            </View>
          </View>

          {/* QR & Contact Info */}
          <View style={styles.qrAndContact}>
            {qrCodeUrl && (
              <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} />
            )}
            <View style={styles.contactInfo}>
              <Text>Visit:</Text>
              <Text>Call: 8002158818</Text>
              <Text>In collaboration with Uinfo Technology PVT LTD.</Text>
            </View>
          </View>

          <Text style={styles.footerNote}>
            ** This is a computer-generated receipt and does not require
            signature. **
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
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
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 18,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  tinyText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
    flex: 1,
    color: '#555',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  declaration: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  term: {
    fontSize: 12,
    marginVertical: 2,
    color: '#444',
  },
  note: {
    marginTop: 12,
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  printBtn: {
    marginTop: 18,
    backgroundColor: '#0c3c78',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  row: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#b30000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 6,
    backgroundColor: 'white',
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentModalContent: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  paymentTitle: {
    color: '#1e40af',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentDetailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  penaltyText: {
    color: '#ef4444',
  },
  advanceText: {
    color: '#10b981',
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 10,
    marginBottom: 10,
  },
  totalSectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPayableContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPayableLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  totalPayableValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  payNowButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payNowButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentSummarySection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
  },
  tableCell: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 12,
    color: '#374151',
  },
  rowEven: {
    backgroundColor: '#f9fafb',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b30000',
  },
  payButton: {
    backgroundColor: '#b30000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 18,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Preview styles
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  // Preview Modal
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  previewImage: {
    width: '95%',
    height: '75%',
    borderRadius: 10,
  },
  downloadBtn: {
    marginTop: 15,
    backgroundColor: '#0c3c78',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: 120,
    flexDirection: 'row',
    justifyContent: 'flex-end', // Right-align content
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receiptContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#f44336',
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  printBtn: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  receiptInfo: {
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableHeaderRow: {
    backgroundColor: '#f1f1f1',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 2,
    fontSize: 10,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
  qrAndContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  qrImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
