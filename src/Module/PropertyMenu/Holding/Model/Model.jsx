import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../Constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    return storedToken ? JSON.parse(storedToken) : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const PayNowModal = ({
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

export const ViewDemandModal = ({
  visible,
  onClose,
  demandlist,
  maindata,
  showPayNow,
  onPayNowPress,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <ScrollView>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>📄 View Demand</Text>

          {demandlist ? (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                  paddingRight: 10,
                }}
              >
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.headerText]}>#</Text>
                    <Text style={[styles.tableCell, styles.headerText]}>
                      Fyear/Qtr
                    </Text>
                    <Text style={[styles.tableCell, styles.headerText]}>
                      Due Date
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { minWidth: 700 },
                      ]}
                    >
                      Tax
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.headerText,
                        { minWidth: 700 },
                      ]}
                    >
                      Due
                    </Text>
                    <Text style={[styles.tableCell, styles.headerText]}>
                      Month Deference
                    </Text>
                    <Text style={[styles.tableCell, styles.headerText]}>
                      Penalty
                    </Text>
                    <Text style={[styles.tableCell, styles.headerText]}>
                      Total Due
                    </Text>
                  </View>

                  {/* Sub Header */}
                  <View style={[styles.tableRow, styles.tableSubHeader]}>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}>Holding Tax</Text>
                    <Text style={styles.tableCell}>Latrine Tax</Text>
                    <Text style={styles.tableCell}>Water Tax</Text>
                    <Text style={styles.tableCell}>HealthCess Tax</Text>
                    <Text style={styles.tableCell}>EducationCess Tax</Text>
                    <Text style={styles.tableCell}>RWH Tax</Text>
                    <Text style={styles.tableCell}>Total Tax</Text>
                    <Text style={styles.tableCell}>Holding Tax</Text>
                    <Text style={styles.tableCell}>Latrine Tax</Text>
                    <Text style={styles.tableCell}>Water Tax</Text>
                    <Text style={styles.tableCell}>HealthCess Tax</Text>
                    <Text style={styles.tableCell}>EducationCess Tax</Text>
                    <Text style={styles.tableCell}>RWH Tax</Text>
                    <Text style={styles.tableCell}>Total Tax</Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}></Text>
                  </View>

                  {demandlist?.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                      <Text style={styles.tableCell}>{item.fyear || ''}</Text>
                      <Text style={styles.tableCell}>{item.dueDate || ''}</Text>
                      <Text style={styles.tableCell}>
                        {item.holdingTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.latrineTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.waterTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.healthCessTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.educationCessTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>{item.rwhTax || '0'}</Text>
                      <Text style={styles.tableCell}>
                        {item.totalTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueHoldingTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueLatrineTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueWaterTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueHealthCessTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueEducationCessTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.dueRwhTax || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {(
                          parseFloat(item.dueHoldingTax || 0) +
                          parseFloat(item.dueLatrineTax || 0) +
                          parseFloat(item.dueWaterTax || 0) +
                          parseFloat(item.dueHealthCessTax || 0) +
                          parseFloat(item.dueEducationCessTax || 0) +
                          parseFloat(item.dueRwhTax || 0)
                        ).toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.monthDiff || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.monthlyPenalty || '0'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {(
                          parseFloat(item.dueHoldingTax || 0) +
                          parseFloat(item.dueLatrineTax || 0) +
                          parseFloat(item.dueWaterTax || 0) +
                          parseFloat(item.dueHealthCessTax || 0) +
                          parseFloat(item.dueEducationCessTax || 0) +
                          parseFloat(item.dueRwhTax || 0) +
                          parseFloat(item.monthlyPenalty || 0)
                        ).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.sectionHeader}>Main Demand</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Current Demand:</Text>
                <Text style={styles.value}>
                  ₹ {maindata?.currentDemandAmount || '0.00'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Arrear Demand:</Text>
                <Text style={styles.value}>
                  ₹ {maindata?.arrearDemandAmount || '0.00'}
                </Text>
              </View>

              <Text style={styles.sectionHeader}>Penalties</Text>
              <View style={styles.penaltyBox}>
                <Text>
                  Late Assessment Penalty: ₹{' '}
                  {maindata?.lateAssessmentPenalty || '0.00'}
                </Text>
              </View>
              <View style={styles.penaltyBox}>
                <Text>
                  Monthly Penalty: ₹ {maindata?.monthlyPenalty || '0.00'}
                </Text>
              </View>
              <View style={styles.penaltyBox}>
                <Text>Other Penalty: ₹ {maindata?.otherPenalty || '0.00'}</Text>
              </View>

              <Text style={styles.sectionHeader}>Rebates</Text>
              <View style={styles.rebateBox}>
                <Text>Special Rebate: ₹ {maindata.specialRebate}</Text>
              </View>
              <View style={styles.rebateBox}>
                <Text>JSK Rebate: ₹ {maindata.jskRebate}</Text>
              </View>
              <View style={styles.rebateBox}>
                <Text>Online Rebate: ₹ {maindata.onlineRebate}</Text>
              </View>
              <View style={styles.rebateBox}>
                <Text>First Qtr Rebate: ₹ {maindata.firstQuatreRebate}</Text>
              </View>

              <View style={styles.totalPayableBox}>
                <Text style={styles.totalPayableLabel}>
                  Total Payable Amount:
                </Text>
                <Text style={styles.totalPayableAmount}>
                  ₹ {maindata?.totalPayableAmount}
                </Text>
              </View>

              {showPayNow && (
                <TouchableOpacity
                  style={styles.payNowButton}
                  onPress={onPayNowPress}
                >
                  <Text style={styles.payNowButtonText}>💳 Pay Now</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>
                Loading demand data...
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  </Modal>
);

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

export const DocumentViewModal = ({
  visible,
  onClose,
  uploadedDocs,
  onDocumentPress,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.docModalContainer}>
      <View style={styles.docModalContent}>
        <Text style={styles.docModalTitle}>📑 Document View</Text>

        <View style={styles.docTableHeader}>
          <Text style={styles.docCellHeader}>#</Text>
          <Text style={styles.docCellHeader}>Document Name</Text>
          <Text style={styles.docCellHeader}>File</Text>
          <Text style={styles.docCellHeader}>Status</Text>
        </View>

        <ScrollView>
          {uploadedDocs?.map((doc, index) => (
            <View key={doc.id} style={styles.docTableRow}>
              <Text style={styles.docCell}>{index + 1}</Text>
              <Text style={styles.docCell}>{doc.docName}</Text>
              <TouchableOpacity onPress={() => onDocumentPress(doc)}>
                <Text style={[styles.docCell, styles.docFileLink]}>
                  View File
                </Text>
              </TouchableOpacity>
              <Text style={styles.docCell}>
                {doc.verifiedStatus === 1 ? 'Pending' : 'Verified'}
              </Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.docCloseButton} onPress={onClose}>
          <Text style={styles.docCloseButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const ImageViewModal = ({
  visible,
  onClose,
  selectedImageUri,
  imageLoading,
  setImageLoading,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.fullScreenModalContainer}>
      <TouchableOpacity style={styles.closeFullScreenButton} onPress={onClose}>
        <Text style={styles.closeFullScreenButtonText}>✖ Close</Text>
      </TouchableOpacity>

      {imageLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      )}

      <ScrollView
        style={styles.fullScreenScrollView}
        contentContainerStyle={styles.fullScreenScrollContent}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
      >
        {selectedImageUri ? (
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.fullScreenImage}
            resizeMode="contain"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              Alert.alert('Error', 'Failed to load the document');
            }}
          />
        ) : (
          <Text style={styles.errorText}>No document selected</Text>
        )}
      </ScrollView>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.background,
    backgroundColor: Colors.headignColor,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
  },
  rowTable: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  labelFixed: {
    fontSize: 13,
    marginVertical: 2,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  value: {
    flex: 1,
    color: '#222',
  },
  headerRow: {
    backgroundColor: Colors.textSecondary,
  },
  cell: {
    minWidth: 70,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: 'center',
    fontSize: 10,
    color: '#333',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  containerdue: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    margin: 12,
    elevation: 4,
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexWrap: 'nowrap',
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
  },

  tableCell: {
    minWidth: 80,
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
    fontSize: 10,
    color: '#000',
    flex: 1,
  },

  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d2a7e',
    marginBottom: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    fontSize: 30,
  },
  corpName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptType: {
    alignSelf: 'center',
    marginVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 6,
  },
  tableRowModal: {
    flexDirection: 'row',
    padding: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  col: {
    flex: 1,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  qrBox: {
    width: 90,
    height: 90,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 13,
    marginBottom: 2,
  },
  generatedNote: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  docModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docModalContent: {
    backgroundColor: '#fff',
    width: '95%',
    maxHeight: '85%',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  docModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  docTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  docTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  docCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  docCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  docFileLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  docCloseButton: {
    backgroundColor: '#007bff',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  docCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  viewButtonText: {
    color: Colors.background,
    backgroundColor: Colors.primary,
    fontSize: 11,
    padding: 8,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 15,
    maxHeight: '95%',
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    width: '60%',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  penaltyBox: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    marginBottom: 10,
  },
  rebateBox: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    marginBottom: 10,
  },
  totalPayableBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff3cd',
    padding: 10,
    marginTop: 10,
  },
  totalPayableLabel: {
    fontWeight: 'bold',
  },
  totalPayableAmount: {
    fontWeight: 'bold',
    color: '#d9534f',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    minWidth: 1200,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#003366',
  },
  tableSubHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableFooter: {
    backgroundColor: 'white',
  },
  payNowButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  payNowButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
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
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeFullScreenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  fullScreenScrollView: {
    flex: 1,
    width: '100%',
  },
  fullScreenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 100,
  },
});
