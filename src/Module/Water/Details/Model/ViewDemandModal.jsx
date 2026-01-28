import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export const ViewDemandModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          {/* Close Button */}
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
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Penalty</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Total</Text>
          </View>

          {/* Table Row (from demandList[0]) */}
          {tradeDetails?.demandList?.map((item, index) => (
            <View style={styles.tableRow} key={item.id || index}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {item.chargeFor}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item.connFee}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item.penalty}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.amount}</Text>
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
        </ScrollView>
      </View>
    </View>
  </Modal>
);

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
});
