import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Colors from '../../Constants/Colors';
import { API_ROUTES } from '../../../api/apiRoutes';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../../utils/auth';
import { showToast } from '../../../utils/toast';
import { PaymentReceiptModal } from './InboxModels';

const InboxDtls = ({ route }) => {
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tradeDetails, setTradeDetails] = useState(null);
  const [paymentDtl, setPaymentDtl] = useState(null);
  const [levelRemarks, setLevelRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const [receiptVisible, setReceiptVisible] = useState(false);

  const id = route?.params?.id;
  const navigation = useNavigation();

  const fetchTradeDetails = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const token = await getToken();

      const tradeRes = await axios.post(
        API_ROUTES.TRADE_DETAILS,
        { id: Number(id) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('trade Details', tradeRes.data.data);
      if (tradeRes?.data?.status && tradeRes.data.data) {
        setTradeDetails(tradeRes.data.data);

        setPaymentDtl(tradeRes.data.data.tranDtls?.[0] || null);
        const tranId = tradeRes.data.data.tranDtls?.[0]?.id || null;
        setPaymentId(tranId);
        console.log('Payment ID:', tranId);
        setLevelRemarks(tradeRes.data.data.levelRemarks || []);
      }
    } catch (err) {
      console.log(
        '❌ Error fetching trade details:',
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTradeDetails();
  }, [id]);

  const fetchPaymentReceipt = async paymentId => {
    if (!paymentId) return;

    try {
      const token = await getToken();

      const receiptRes = await axios.post(
        API_ROUTES.TRADE_PAYMENT_RECEIPT,
        { id: paymentId }, // <-- corrected key
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log('Full Payment Receipt Response:', receiptRes);
      // console.log('Receipt Data:', receiptRes.data);
      // console.log('Status:', receiptRes.data.status);
      // console.log('Message:', receiptRes.data.message);
      // console.log('Data:', receiptRes.data.data);
      if (receiptRes?.data?.status) {
        setPaymentReceipt(receiptRes.data.data); // store in state
      } else {
        console.log('No payment receipt found:', receiptRes.data.message);
      }
    } catch (err) {
      console.log(
        '❌ Error fetching payment receipt:',
        err.response?.data || err.message,
      );
    }
  };

  if (paymentId) {
    fetchPaymentReceipt(paymentId);
  }
  const handleWorkflowAction = async status => {
    if (!id) return;
    if (!remarks.trim()) {
      Alert.alert('Validation', 'Please enter remarks before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();

      const payload = {
        id: String(id),
        remarks: remarks,
        status: status, // "FORWARD" or "BACKWARD"
      };

      const res = await axios.post(API_ROUTES.TRADE_POST_NEXT, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status) {
        showToast(
          'success',
          `Application ${
            status === 'FORWARD' ? 'forwarded' : 'sent back'
          } successfully`,
        );
        setShowWorkflowModal(false);
        setRemarks('');

        // ✅ Fetch updated trade details again
      } else {
        Alert.alert('Error', res.data?.message || 'Something went wrong');
      }
    } catch (err) {
      console.log('❌ Workflow error:', err.response?.data || err.message);
      Alert.alert('Error', 'Error processing workflow action');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your applied application no.{' '}
            <Text style={styles.appId}>{tradeDetails?.applicationNo}</Text>. You
            can use this for future reference.
          </Text>

          <Text style={styles.statusText}>
            Current Status:{' '}
            <Text
              style={
                tradeDetails?.appStatus?.toLowerCase().includes('expired')
                  ? styles.expired
                  : styles.active
              }
            >
              {tradeDetails?.appStatus || 'N/A'}
            </Text>
          </Text>
        </View>

        {/* Basic Details */}
        <Section title="Basic Details">
          <DetailRow label="Ward No" value={tradeDetails?.wardNo} />
          <DetailRow
            label="Licence For"
            value={`${tradeDetails?.licenseForYears} Years`}
          />
          <DetailRow
            label="Nature Of Business"
            value={tradeDetails?.natureOfBusiness}
          />
          <DetailRow
            label="Ownership Type"
            value={tradeDetails?.ownershipType}
          />
          <DetailRow label="Landmark" value={tradeDetails?.landmark || 'N/A'} />
          <DetailRow label="Address" value={tradeDetails?.address} />
          <DetailRow
            label="Application No"
            value={tradeDetails?.applicationNo}
          />
          <DetailRow
            label="Valid Upto"
            value={tradeDetails?.validUpto || 'N/A'}
          />
          <DetailRow
            label="Updated Date"
            value={tradeDetails?.updatedAt?.slice(0, 10)}
          />
          <DetailRow
            label="Application Type"
            value={tradeDetails?.applicationType}
          />
          <DetailRow label="Firm Name" value={tradeDetails?.firmName} />
          <DetailRow label="Firm Type" value={tradeDetails?.firmType} />
          <DetailRow label="Category Type" value="Others" />
          <DetailRow
            label="Firm Establishment Date"
            value={tradeDetails?.firmEstablishmentDate}
          />
          <DetailRow label="Applied Date" value={tradeDetails?.applyDate} />
          <DetailRow label="Area" value={tradeDetails?.areaInSqft} />
          <DetailRow label="Pin Code" value={tradeDetails?.pinCode} />
        </Section>

        {/* Owner Details */}
        <Section title="Owner Details">
          <View style={styles.ownerHeader}>
            <Text style={styles.ownerCol}>Owner Name</Text>
            <Text style={styles.ownerCol}>Guardian Name</Text>
            <Text style={styles.ownerCol}>Mobile No</Text>
            <Text style={styles.ownerCol}>Email Id</Text>
          </View>
          {tradeDetails?.owners?.map((owner, index) => (
            <View
              key={owner.id || index}
              style={[
                styles.ownerRow,
                { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
              ]}
            >
              <Text style={styles.ownerCol}>{owner.ownerName}</Text>
              <Text style={styles.ownerCol}>{owner.guardianName}</Text>
              <Text style={styles.ownerCol}>{String(owner.mobileNo)}</Text>
              <Text style={styles.ownerCol}>{owner.email || 'N/A'}</Text>
            </View>
          ))}
        </Section>

        {/* Payment Details */}
        <Section title="Payment Detail">
          <View style={styles.docHeader}>
            <Text style={styles.docCol}>Processing Fee</Text>
            <Text style={styles.docCol}>Transaction Date</Text>
            <Text style={styles.docCol}>Payment Through</Text>
            <Text style={styles.docCol}>Payment For</Text>
            <Text style={styles.docCol}>View</Text>
          </View>
          {paymentDtl && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentCol}>{paymentDtl.penaltyAmt}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.tranDate}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.paymentMode}</Text>
              <Text style={styles.paymentCol}>{paymentDtl.tranType}</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Text
                  style={styles.viewBtnText}
                  onPress={() => setReceiptVisible(true)}
                >
                  View
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Section>

        {/* Level Remarks */}
        <Section title="Level Remarks">
          {Array.isArray(levelRemarks) && levelRemarks.length > 0 ? (
            <View style={styles.container}>
              <View
                style={[
                  styles.row,
                  { borderBottomWidth: 1, borderBottomColor: '#000' },
                ]}
              >
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Role</Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Remark
                </Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Time</Text>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Action
                </Text>
              </View>
              {levelRemarks.map((remark, index) => (
                <View key={remark.id || index} style={styles.row}>
                  <Text style={styles.value}>{remark.senderRole || 'N/A'}</Text>
                  <Text style={styles.value}>
                    {remark.senderRemarks || '-'}
                  </Text>
                  <Text style={styles.value}>
                    {new Date(remark.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(remark.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.value}>{remark.actions || '-'}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noRemarksContainer}>
              <Text style={styles.noRemarksText}>
                No level remarks available
              </Text>
            </View>
          )}
        </Section>

        {/* Workflow Button */}
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.workflowBtn}
            onPress={() => setShowWorkflowModal(true)}
          >
            <Text style={styles.workflowBtnText}>Backward/Forward</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PaymentReceiptModal
        visible={receiptVisible}
        onClose={() => setReceiptVisible(false)}
        receiptData={paymentReceipt}
      />
      {/* Workflow Modal */}
      <Modal
        visible={showWorkflowModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWorkflowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.workflowModal}>
            <Text style={styles.modalTitle}>Enter Remarks</Text>

            {/* <Text style={styles.inputLabel}>Enter Remarks:</Text> */}
            <TextInput
              style={styles.remarksInput}
              placeholder="Enter your remarks..."
              value={remarks}
              onChangeText={setRemarks}
              multiline
            />

            <View style={styles.modalBtnContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#007bff' }]}
                onPress={() => handleWorkflowAction('FORWARD')}
                disabled={isSubmitting}
              >
                <Text style={styles.btnText}>
                  {isSubmitting ? 'Processing...' : 'Forward'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#ff9800' }]}
                onPress={() => handleWorkflowAction('BACKWARD')}
                disabled={isSubmitting}
              >
                <Text style={styles.btnText}>
                  {isSubmitting ? 'Processing...' : 'Backward'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowWorkflowModal(false)}
            >
              <Text style={{ color: '#000', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- Section Components ---
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f4faff' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#e6f0ff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  bannerText: { fontSize: 14 },
  appId: { color: '#ff6600', fontWeight: 'bold' },
  statusText: { marginTop: 5 },
  expired: { color: 'red', fontWeight: 'bold' },
  active: { color: 'green', fontWeight: 'bold' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Colors.primary,
    color: '#fff',
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  label: { fontWeight: '600', color: '#333', flex: 1 },
  value: { flex: 1, textAlign: 'right', color: '#000' },
  ownerHeader: { flexDirection: 'row', backgroundColor: '#f2f2f2', padding: 8 },
  ownerRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ownerCol: { flex: 1, fontWeight: 'bold' },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  docCol: { flex: 1, textAlign: 'center' },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCol: { flex: 1, textAlign: 'center' },
  viewBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewBtnText: { color: '#fff', fontWeight: '600' },
  noRemarksContainer: { padding: 10, alignItems: 'center' },
  noRemarksText: { color: '#999' },
  workflowBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  workflowBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workflowModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  },
  inputLabel: { fontWeight: '600', marginBottom: 5 },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 15,
  },
  modalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default InboxDtls;
