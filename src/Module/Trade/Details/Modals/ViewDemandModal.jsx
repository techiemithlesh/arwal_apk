import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from './sharedStyles';

export const ViewDemandModal = ({
  visible,
  onClose,
  demandDetails,
  tradeDetails1,
}) => {
  useEffect(() => {
    if (visible) {
      console.log('Full Response:', demandDetails);
      // console.log('tradeDue:', tradeDetails.data.data);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Demand Details</Text>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Current Demand</Text>
              {/*
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Application No:</Text>
                <Text style={styles.value}>
                  {demandDetails?.applicationNo || 'N/A'}
                </Text>
              </View> */}

              <View style={styles.rowContainer}>
                <Text style={styles.label}>License Fee:</Text>
                <Text style={styles.value}>
                  ₹ {demandDetails?.licenseCharge || '0'}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Processing Fee:</Text>
                <Text style={styles.value}>
                  ₹ {demandDetails?.processingFee || '0'}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Late Fee:</Text>
                <Text style={styles.value}>
                  ₹ {demandDetails?.latePenalty || '0'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.rowContainer}>
                <Text style={[styles.label, styles.totalText]}>
                  Total Amount:
                </Text>
                <Text style={[styles.value, styles.totalText]}>
                  ₹ {demandDetails?.totalCharge || '0'}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Due Date:</Text>
                <Text style={styles.value}>
                  {demandDetails?.dueDate || '24-08-2025'}
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <Text style={styles.label}>Payment Status:</Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        demandDetails?.paymentStatus === 'Paid'
                          ? 'green'
                          : 'red',
                    },
                  ]}
                >
                  {demandDetails?.paymentStatus || 'Pending'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
