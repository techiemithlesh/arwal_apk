import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';

const PropertyTaxNoticeModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView style={styles.scrollArea}>
            {/* Header */}
            <Text style={styles.title}>Ranchi Municipal Corporation</Text>
            <Text style={styles.subtitle}>
              Notice of property tax customized under section 152(3) of
              Jharkhand Municipal Act-2011
            </Text>

            <View style={styles.memoBlock}>
              <Text>Memo No.: SAM/234/2025-2026</Text>
              <Text>Date: 17/11/2025</Text>
              <Text>Effective: 2025-2026/1</Text>
            </View>

            {/* Owner Info */}
            <View style={styles.section}>
              <Text style={styles.bold}>
                Mr/Mrs/Ms: MITHLESH S/O MY FULL NAME
              </Text>
              <Text>Address: DEGHIJH</Text>
              <Text style={styles.normal}>
                You are hereby informed that your New Holding Number -{' '}
                <Text style={styles.bold}>02000000300087</Text> in Ward No - 2,
                New Ward No - 1 has been done, on the basis of your
                self-assessment declaration form.
              </Text>
              <Text style={styles.normal}>
                The annual rental price has been fixed at Rs{' '}
                <Text style={styles.bold}>1788/-</Text> based on your
                self-assessment declaration.
              </Text>
            </View>

            {/* Tax Table */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.bold]}>Sl. No.</Text>
                <Text style={[styles.tableCell, styles.bold]}>Particulars</Text>
                <Text style={[styles.tableCell, styles.bold]}>
                  Amount (in Rs.)
                </Text>
              </View>

              {[
                { no: '1', name: 'House Tax', amt: '35.76' },
                { no: '2', name: 'Water Tax', amt: '0.00' },
                { no: '3', name: 'Latrine Tax', amt: '0.00' },
                { no: '4', name: 'Light Penalty', amt: '17.88' },
                { no: '5', name: 'Education Cess', amt: '0.00' },
                { no: '6', name: 'Health Cess', amt: '0.00' },
              ].map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.no}</Text>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.amt}</Text>
                </View>
              ))}

              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={styles.tableCell}></Text>
                <Text style={[styles.tableCell, styles.bold]}>
                  Total Amount (per quarter)
                </Text>
                <Text style={[styles.tableCell, styles.bold]}>53.64</Text>
              </View>
            </View>

            {/* Signature */}
            <Text style={styles.signature}>To be signed by the Applicant</Text>

            {/* Notes */}
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.note}>
              1. The tax assessment list is displayed on the website of Ranchi
              Municipal Corporation.
            </Text>
            <Text style={styles.note}>
              2. Additional house tax will be levied if...
            </Text>
            <Text style={styles.note}>
              3. Property tax will be paid quarterly...
            </Text>
            <Text style={styles.note}>
              4. If the entire yearly tax is paid...
            </Text>
            <Text style={styles.note}>
              5. Simple interest will be payable...
            </Text>
            <Text style={styles.note}>
              6. This tax assessment is binding...
            </Text>
            <Text style={styles.note}>
              7. Property tax is collected by Ranchi Municipal Corporation...
            </Text>
            <Text style={styles.note}>
              8. In case listed govt holding number...
            </Text>

            {/* Footer */}
            <Text style={styles.footer}>
              NOTE: This is a computer-generated receipt. This receipt does not
              require physical signature.
            </Text>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '90%',
    width: '100%',
    padding: 10,
  },
  scrollArea: {
    flexGrow: 1,
  },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 12, textAlign: 'center', marginBottom: 10 },
  memoBlock: { alignItems: 'flex-end', marginBottom: 10 },
  section: { marginBottom: 15 },
  bold: { fontWeight: 'bold' },
  normal: { fontSize: 13, marginTop: 5, lineHeight: 18 },
  table: { borderWidth: 1, borderColor: '#000', marginVertical: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableHeader: { backgroundColor: '#eee' },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 13,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  totalRow: { backgroundColor: '#f5f5f5' },
  signature: { marginTop: 20, textAlign: 'right', fontStyle: 'italic' },
  notesTitle: { marginTop: 15, fontWeight: 'bold' },
  note: { fontSize: 11, marginTop: 4, color: '#333', lineHeight: 16 },
  footer: {
    marginTop: 15,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 15,
  },
});

export default PropertyTaxNoticeModal;
