import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Colors from '../../Constants/Colors';

const { height } = Dimensions.get('window');

export const GenerateDemandModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalHeader}>Generate Demand</Text>
        <Text style={styles.modalText}>Here you can generate demand...</Text>

        {/* ✅ ScrollView with flexGrow fix */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
        >
          {/* Owner Basic Details */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Owner Basic Details</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Consumer No :</Text>
                <Text style={styles.value}>001060700793DMT01</Text>

                <Text style={styles.label}>Pipeline Type :</Text>
                <Text style={styles.value}>Old Pipeline</Text>

                <Text style={styles.label}>Connection Type :</Text>
                <Text style={styles.value}>New Connection</Text>

                <Text style={styles.label}>Category :</Text>
                <Text style={styles.value}>APL</Text>

                <Text style={styles.label}>Owner Name :</Text>
                <Text style={styles.value}>MRS. GIRJA DEVI</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Application No :</Text>
                <Text style={styles.value}>12000004</Text>

                <Text style={styles.label}>Property Type :</Text>
                <Text style={styles.value}>Residential</Text>

                <Text style={styles.label}>Connection Through :</Text>
                <Text style={styles.value}>N/A</Text>

                <Text style={styles.label}>Area in Sqft :</Text>
                <Text style={styles.value}>1347.98</Text>

                <Text style={styles.label}>Mobile No :</Text>
                <Text style={styles.value}>9431594215</Text>
              </View>
            </View>
          </View>

          {/* Demand Details */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Demand Details</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Due From</Text>
                <Text style={styles.value}>March / 2024</Text>

                <Text style={styles.label}>Arrear Demand</Text>
                <Text style={[styles.value, styles.highlight]}>3775.34</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Due Upto</Text>
                <Text style={styles.value}>May / 2025</Text>

                <Text style={styles.label}>Current Demand</Text>
                <Text style={[styles.value, styles.highlight]}>0</Text>
              </View>
            </View>
          </View>

          {/* Consumer Connection Details */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              Consumer Connection Details
            </Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Connection Type</Text>
                <Text style={[styles.value, styles.bold]}>Meter</Text>

                <Text style={styles.label}>Meter No.</Text>
                <Text style={[styles.value, styles.bold]}>6341</Text>

                <Text style={styles.label}>Last Meter Reading</Text>
                <Text style={[styles.value, styles.bold]}>720.00</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Connection Date</Text>
                <Text style={[styles.value, styles.bold]}>02-04-2007</Text>

                <Text style={styles.label}>Final Meter Reading</Text>
                <View style={styles.inputBox} />
              </View>
            </View>

            <Text style={styles.label}>Meter Image</Text>
            <View style={styles.uploadBox}>
              <Text>Choose File</Text>
              <Text>No file chosen</Text>
            </View>
          </View>
        </ScrollView>

        {/* ✅ Sticky Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Generate Demand</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const ProceedToPayModal = ({ visible, onClose }) => {
  const paymentData = [
    {
      month: 'May/2023',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
    {
      month: 'Jun/2023',
      type: 'Meter',
      amount: '72.00',
      penalty: '25.92',
      total: '97.92',
    },
    {
      month: 'Jul/2023',
      type: 'Meter',
      amount: '360.00',
      penalty: '124.20',
      total: '484.20',
    },
    {
      month: 'Aug/2023',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
    {
      month: 'Sep/2023',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
    {
      month: 'Oct/2023',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
    {
      month: 'Nov/2023',
      type: 'Meter',
      amount: '72.00',
      penalty: '20.52',
      total: '92.52',
    },
    {
      month: 'Jan/2024',
      type: 'Meter',
      amount: '54.00',
      penalty: '13.77',
      total: '67.77',
    },
    {
      month: 'Feb/2024',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
    {
      month: 'Mar/2024',
      type: 'Meter',
      amount: '0.00',
      penalty: '0.00',
      total: '0.00',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.paymentModalContent}>
          <Text style={styles.modalHeader}>Proceed to Pay</Text>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Owner Basic Details</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Consumer No :</Text>
                  <Text style={styles.value}>001060700793DMT01</Text>

                  <Text style={styles.label}>Pipeline Type :</Text>
                  <Text style={styles.value}>Old Pipeline</Text>

                  <Text style={styles.label}>Connection Type :</Text>
                  <Text style={styles.value}>New Connection</Text>

                  <Text style={styles.label}>Category :</Text>
                  <Text style={styles.value}>APL</Text>

                  <Text style={styles.label}>Owner Name :</Text>
                  <Text style={styles.value}>MRS. GIRJA DEVI</Text>
                </View>

                <View style={styles.col}>
                  <Text style={styles.label}>Application No :</Text>
                  <Text style={styles.value}>12000004</Text>

                  <Text style={styles.label}>Property Type :</Text>
                  <Text style={styles.value}>Residential</Text>

                  <Text style={styles.label}>Connection Through :</Text>
                  <Text style={styles.value}>N/A</Text>

                  <Text style={styles.label}>Area in Sqft :</Text>
                  <Text style={styles.value}>1347.98</Text>

                  <Text style={styles.label}>Mobile No :</Text>
                  <Text style={styles.value}>9431594215</Text>
                </View>
              </View>
            </View>
            {/* Payment Table */}
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Demand Month</Text>
                <Text style={styles.tableHeaderText}>Connection Type</Text>
                <Text style={styles.tableHeaderText}>Amount</Text>
                <Text style={styles.tableHeaderText}>Penalty</Text>
                <Text style={styles.tableHeaderText}>Total Demand</Text>
              </View>

              {/* Table Rows */}
              {paymentData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  ]}
                >
                  <Text style={styles.tableCellText}>{item.month}</Text>
                  <Text style={styles.tableCellText}>{item.type}</Text>
                  <Text style={styles.tableCellText}>{item.amount}</Text>
                  <Text style={styles.tableCellText}>{item.penalty}</Text>
                  <Text style={styles.tableCellText}>{item.total}</Text>
                </View>
              ))}
            </View>

            {/* Payment Section */}
            <View style={styles.paymentSection}>
              <Text style={styles.paymentSectionTitle}>Proceed Payment</Text>

              {/* Payment Form */}
              <View style={styles.paymentForm}>
                {/* Row 1: Select Month and Amount */}
                <View style={styles.paymentRow}>
                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Select Month</Text>
                    <View style={styles.paymentDropdown}>
                      <Text style={styles.paymentInputText}>Mar/2024</Text>
                    </View>
                  </View>

                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Amount</Text>
                    <View style={styles.paymentInput}>
                      <Text style={styles.paymentInputText}>558</Text>
                    </View>
                  </View>
                </View>

                {/* Row 2: Penalty and Other Penalty */}
                <View style={styles.paymentRow}>
                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Penalty</Text>
                    <View style={styles.paymentInput}>
                      <Text style={styles.paymentInputText}>184</Text>
                    </View>
                  </View>

                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Other Penalty</Text>
                    <View style={styles.paymentInput}>
                      <Text style={styles.paymentInputText}>0</Text>
                    </View>
                  </View>
                </View>

                {/* Row 3: Rebate and Advance */}
                <View style={styles.paymentRow}>
                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Rebate</Text>
                    <View style={styles.paymentInput}>
                      <Text style={styles.paymentInputText}>0</Text>
                    </View>
                  </View>

                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Advance</Text>
                    <View style={styles.paymentInput}>
                      <Text style={styles.paymentInputText}>0</Text>
                    </View>
                  </View>
                </View>

                {/* Row 4: Remain Advance and Payable Amount */}
                <View style={styles.paymentRow}>
                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>
                      Remain Advance (in Rs.)
                    </Text>
                    <View style={styles.paymentAmountDisplay}>
                      <Text style={styles.paymentAmountText}>0.00</Text>
                    </View>
                  </View>

                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>
                      Payable Amount (in Rs.)
                    </Text>
                    <View style={styles.paymentAmountDisplayGreen}>
                      <Text style={styles.paymentAmountTextGreen}>742</Text>
                    </View>
                  </View>
                </View>

                {/* Row 5: Payment Mode */}
                <View style={styles.paymentRow}>
                  <View style={styles.paymentField}>
                    <Text style={styles.paymentLabel}>Payment Mode</Text>
                    <View style={styles.paymentDropdown}>
                      <Text style={styles.paymentInputText}>Select</Text>
                    </View>
                  </View>
                  <View style={styles.paymentField}></View>
                </View>

                {/* Row 6: Remarks */}
                <View style={styles.paymentField}>
                  <Text style={styles.paymentLabel}>Remarks</Text>
                  <View style={styles.paymentTextArea}>
                    <Text style={styles.paymentInputText}></Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const LastPaymentReceiptModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.receiptModalContent}>
        <Text style={styles.modalHeader}>Payment Receipt</Text>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
        >
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>
              Ranchi Municipal Corporation
            </Text>
            <Text style={styles.receiptSubtitle}>
              WATER USER CHARGE PAYMENT RECEIPT
            </Text>
            <View style={styles.receiptDivider} />
          </View>

          {/* Customer Details */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>02-03-2024</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>TC Name</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>SANJEEVAN</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>TC Mobile No.</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>720874287</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Consumer No.</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>001060700638DMT01</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Ward No.</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>32</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Holding No.</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>032000181700A61</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Citizen Name</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>SMT. SARSWATI DEVI</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Guardian Name</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>
                LATE MR. MUNESHWAR PRASAD GUPTA
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Citizen Mobile No</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>9470130342</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Address</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}></Text>
            </View>
          </View>

          <View style={styles.receiptDivider} />

          {/* Transaction Details */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction No.</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>WTRAN361284020324021259</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Period</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>
                December / 2023 to March / 2024
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Total Amount</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>90.00</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Penalty</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>0.00</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Rebate</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>0.00</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Paid Amount</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>90.00</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Meter Payment</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>
                (1625.00 - 1643.00) : 90.00
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Due Amount</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>0.00</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Payment Mode</Text>
              <Text style={styles.receiptColon}>:</Text>
              <Text style={styles.receiptValue}>CASH</Text>
            </View>
          </View>

          <View style={styles.receiptDivider} />
        </ScrollView>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const TotalDemandReceiptModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalHeader}>Total Demand Receipt</Text>
        <Text style={styles.modalText}>Demand receipt details...</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  receiptModalContent: {
    backgroundColor: Colors.background,
    padding: 30,
    marginTop: 20,
  },
  receiptRow: {
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '95%',
    maxHeight: height * 0.85, // so it scrolls
  },

  paymentModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '95%',
    maxHeight: height * 0.9,
  },

  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111',
  },

  modalText: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: '#444',
  },

  scrollArea: {
    flexGrow: 0,
    marginBottom: 10,
  },

  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  col: {
    flex: 1,
    paddingHorizontal: 6,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },

  value: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },

  highlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  bold: {
    fontWeight: 'bold',
  },

  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 36,
    marginTop: 4,
    paddingHorizontal: 8,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },

  button: {
    backgroundColor: '#f59e0b', // amber color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  closeBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Payment Table Styles
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tableRowEven: {
    backgroundColor: '#f9f9f9',
  },

  tableRowOdd: {
    backgroundColor: '#fff',
  },

  tableCellText: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },

  // Payment Section Styles
  paymentSection: {
    backgroundColor: Colors.primary,

    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },

  paymentSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },

  paymentForm: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  paymentField: {
    flex: 1,
    marginHorizontal: 4,
  },

  paymentLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },

  paymentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },

  paymentInputText: {
    fontSize: 14,
    color: '#333',
  },

  paymentTextArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  paymentDropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },

  paymentAmountDisplay: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },

  paymentAmountText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },

  paymentAmountDisplayGreen: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },

  paymentAmountTextGreen: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'bold',
  },
});
