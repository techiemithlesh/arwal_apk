import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './sharedStyles';

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
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  </Modal>
);
