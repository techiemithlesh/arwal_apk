import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Colors from '../../../Constants/Colors';

export const ViewDemandModal = ({
  visible,
  onClose,
  demandlist,
  maindata,
  showPayNow,
  onPayNowPress,
}) => {
  return (
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

            {console.log('Modal render - demandlist:', demandlist)}
            {console.log(
              'Modal render - demandlist length:',
              demandlist?.length,
            )}
            {console.log('Modal render - first item:', demandlist?.[0])}

            {demandlist ? (
              <View>
                {/* 🟩 Demand Table */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 20,
                    paddingRight: 10,
                  }}
                >
                  <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, styles.headerText]}>
                        #
                      </Text>
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

                    {/* Sub-header for Tax and Due columns */}
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
                        <Text style={styles.tableCell}>
                          {item.dueDate || ''}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.holdingTax === 'object'
                            ? JSON.stringify(item.holdingTax)
                            : item.holdingTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.latrineTax === 'object'
                            ? JSON.stringify(item.latrineTax)
                            : item.latrineTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.waterTax === 'object'
                            ? JSON.stringify(item.waterTax)
                            : item.waterTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.healthCessTax === 'object'
                            ? JSON.stringify(item.healthCessTax)
                            : item.healthCessTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.educationCessTax === 'object'
                            ? JSON.stringify(item.educationCessTax)
                            : item.educationCessTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.rwhTax === 'object'
                            ? JSON.stringify(item.rwhTax)
                            : item.rwhTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.totalTax === 'object'
                            ? JSON.stringify(item.totalTax)
                            : item.totalTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueHoldingTax === 'object'
                            ? JSON.stringify(item.dueHoldingTax)
                            : item.dueHoldingTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueLatrineTax === 'object'
                            ? JSON.stringify(item.dueLatrineTax)
                            : item.dueLatrineTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueWaterTax === 'object'
                            ? JSON.stringify(item.dueWaterTax)
                            : item.dueWaterTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueHealthCessTax === 'object'
                            ? JSON.stringify(item.dueHealthCessTax)
                            : item.dueHealthCessTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueEducationCessTax === 'object'
                            ? JSON.stringify(item.dueEducationCessTax)
                            : item.dueEducationCessTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {typeof item.dueRwhTax === 'object'
                            ? JSON.stringify(item.dueRwhTax)
                            : item.dueRwhTax || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {(() => {
                            const dueTotalTax =
                              parseFloat(item.dueHoldingTax || 0) +
                              parseFloat(item.dueLatrineTax || 0) +
                              parseFloat(item.dueWaterTax || 0) +
                              parseFloat(item.dueHealthCessTax || 0) +
                              parseFloat(item.dueEducationCessTax || 0) +
                              parseFloat(item.dueRwhTax || 0);
                            return dueTotalTax.toFixed(2);
                          })()}
                        </Text>
                        <Text style={styles.tableCell}>
                          {item.monthDiff || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {item.monthlyPenalty || '0'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {(() => {
                            const totalDue =
                              parseFloat(item.dueHoldingTax || 0) +
                              parseFloat(item.dueLatrineTax || 0) +
                              parseFloat(item.dueWaterTax || 0) +
                              parseFloat(item.dueHealthCessTax || 0) +
                              parseFloat(item.dueEducationCessTax || 0) +
                              parseFloat(item.dueRwhTax || 0) +
                              parseFloat(item.monthlyPenalty || 0);
                            return totalDue.toFixed(2);
                          })()}
                        </Text>
                      </View>
                    ))}

                    {/* Table Footer */}
                    <View style={[styles.tableRow, styles.tableFooter]}>
                      <Text style={styles.tableCell}>Total</Text>
                      <Text style={styles.tableCell}></Text>
                      <Text style={styles.tableCell}></Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const holdingTax =
                              typeof item.holdingTax === 'object'
                                ? 0
                                : parseFloat(item.holdingTax || 0);
                            return sum + holdingTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const rwhTax =
                              typeof item.rwhTax === 'object'
                                ? 0
                                : parseFloat(item.rwhTax || 0);
                            return sum + rwhTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const totalTax =
                              typeof item.totalTax === 'object'
                                ? 0
                                : parseFloat(item.totalTax || 0);
                            return sum + totalTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const dueHoldingTax =
                              typeof item.dueHoldingTax === 'object'
                                ? 0
                                : parseFloat(item.dueHoldingTax || 0);
                            return sum + dueHoldingTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>0.00</Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const dueRwhTax =
                              typeof item.dueRwhTax === 'object'
                                ? 0
                                : parseFloat(item.dueRwhTax || 0);
                            return sum + dueRwhTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const dueTotalTax =
                              parseFloat(item.dueHoldingTax || 0) +
                              parseFloat(item.dueLatrineTax || 0) +
                              parseFloat(item.dueWaterTax || 0) +
                              parseFloat(item.dueHealthCessTax || 0) +
                              parseFloat(item.dueEducationCessTax || 0) +
                              parseFloat(item.dueRwhTax || 0);
                            return sum + dueTotalTax;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>-</Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const monthlyPenalty = parseFloat(
                              item.monthlyPenalty || 0,
                            );
                            return sum + monthlyPenalty;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {demandlist
                          ?.reduce((sum, item) => {
                            const totalDue =
                              parseFloat(item.dueHoldingTax || 0) +
                              parseFloat(item.dueLatrineTax || 0) +
                              parseFloat(item.dueWaterTax || 0) +
                              parseFloat(item.dueHealthCessTax || 0) +
                              parseFloat(item.dueEducationCessTax || 0) +
                              parseFloat(item.dueRwhTax || 0) +
                              parseFloat(item.monthlyPenalty || 0);
                            return sum + totalDue;
                          }, 0)
                          .toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {/* 🟩 Main Demand */}
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

                {/* 🟥 Penalties */}
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
                  <Text>
                    Other Penalty: ₹ {maindata?.otherPenalty || '0.00'}
                  </Text>
                </View>

                {/* 🟩 Rebates */}
                <Text style={styles.sectionHeader}>Rebates</Text>
                <View>
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
                    <Text>
                      First Qtr Rebate: ₹ {maindata.firstQuatreRebate}
                    </Text>
                  </View>
                </View>

                {/* 🟨 Total Payable */}
                <View style={styles.totalPayableBox}>
                  <Text style={styles.totalPayableLabel}>
                    Total Payable Amount:
                  </Text>
                  <Text style={styles.totalPayableAmount}>
                    ₹ {maindata?.payableAmount}
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
                <Text style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                  {demandlist
                    ? 'Data received but structure may be different'
                    : 'No data received'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#ffffffff',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    width: '60%',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
    width: '40%',
    textAlign: 'right',
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
  tableCell: {
    width: 120,
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
});
