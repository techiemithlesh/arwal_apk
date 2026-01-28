import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { sharedStyles } from './sharedStyles';

export const PaymentReceiptSimpleModal = ({ visible, onClose, receiptData }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={sharedStyles.overlay}>
      <View style={sharedStyles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={sharedStyles.closeBtn} onPress={onClose}>
            <Text style={sharedStyles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={sharedStyles.mainTitle}>Payment Receipt</Text>
          <Text style={sharedStyles.subTitle}>
            {receiptData?.ulbDtl?.ulbName || 'Municipal Corporation'}
          </Text>

          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.sectionTitle}>Receipt Info</Text>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Receipt No:</Text>
              <Text style={sharedStyles.value}>{receiptData?.tranNo || 'N/A'}</Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Date:</Text>
              <Text style={sharedStyles.value}>{receiptData?.tranDate || 'N/A'}</Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Application No:</Text>
              <Text style={sharedStyles.value}>
                {receiptData?.applicationNo || 'N/A'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Account:</Text>
              <Text style={sharedStyles.value}>
                {receiptData?.accountDescription || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.sectionTitle}>Owner Details</Text>
            {receiptData?.ownerDtl?.map((o, i) => (
              <View style={sharedStyles.rowContainer} key={i}>
                <Text style={sharedStyles.label}>Owner {i + 1}:</Text>
                <Text style={sharedStyles.value}>
                  {o.ownerName} ({o.mobileNo})
                </Text>
              </View>
            ))}
          </View>

          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.sectionTitle}>Payment Details</Text>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Mode:</Text>
              <Text style={sharedStyles.value}>
                {receiptData?.paymentMode || 'N/A'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Status:</Text>
              <Text
                style={[
                  sharedStyles.value,
                  {
                    color:
                      receiptData?.paymentStatus === 'Clear' ? 'green' : 'red',
                  },
                ]}
              >
                {receiptData?.paymentStatus || 'N/A'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Amount:</Text>
              <Text style={sharedStyles.value}>
                ₹ {receiptData?.amount || '0.00'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>In Words:</Text>
              <Text style={sharedStyles.value}>
                {receiptData?.amountInWords || ''}
              </Text>
            </View>
          </View>

          <View style={sharedStyles.sectionContainer}>
            <Text style={sharedStyles.sectionTitle}>Transaction</Text>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Payable Amount:</Text>
              <Text style={sharedStyles.value}>
                ₹ {receiptData?.tranDtl?.payableAmt || '0.00'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Demand Amount:</Text>
              <Text style={sharedStyles.value}>
                ₹ {receiptData?.tranDtl?.demandAmt || '0.00'}
              </Text>
            </View>
            <View style={sharedStyles.rowContainer}>
              <Text style={sharedStyles.label}>Penalty:</Text>
              <Text style={sharedStyles.value}>
                ₹ {receiptData?.tranDtl?.penaltyAmt || '0.00'}
              </Text>
            </View>
          </View>

          {receiptData?.fineRebate?.length > 0 && (
            <View style={sharedStyles.sectionContainer}>
              <Text style={sharedStyles.sectionTitle}>Fine / Rebate</Text>
              {receiptData.fineRebate.map((f, i) => (
                <View style={sharedStyles.rowContainer} key={i}>
                  <Text style={sharedStyles.label}>{f.headName}:</Text>
                  <Text style={sharedStyles.value}>₹ {f.amount}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={sharedStyles.note}>
            Note: This is a computer-generated receipt. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={sharedStyles.printBtn}>
            <Text style={sharedStyles.printText}>Download / Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default PaymentReceiptSimpleModal;
