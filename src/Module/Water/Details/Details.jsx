import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Constants/Colors';
import { WORK_FLOW_PERMISSION } from '../../../api/apiRoutes';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { ViewDemandModal } from './Model/ViewDemandModal';
import { PaymentModal } from './Model/PaymentModal';
import { DocumentModal } from './Model/DocumentModal';
import { PaymentReceiptModal } from './Model/PaymentReceiptModal';
import { RemarksModal } from './Model/RemarksModal';
import FieldVerificationModal from './Model/FieldVerificationModal';

import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../../utils/auth';
import { WATER_API_ROUTES } from '../../../api/apiRoutes';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import styles from '../../../style/DetailsStyle';

const Details = ({ route }) => {
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showTradeLicenseModal, setShowTradeLicenseModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [receiptData, setTradPaymentRecipt] = useState(null);
  const [waterDue, setWaterDue] = useState(null);
  const [tradeDetails, setTradeDetails] = useState(null);
  const [paymentDtl, setPaymentDtl] = useState(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [levelRemarks, setLevelRemarks] = useState([]);
  const [tradeDue, setTradeDue] = useState(null);
  const [tcVerification, setTcVerification] = useState(null);
  const [tradeId, setTradeId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [modalVerificationData, setModalVerificationData] = useState(null);
  const [yourVerificationData, setYourVerificationData] = useState(null);

  const handleViewVerification = async id => {
    try {
      const token = await getToken();
      console.log('id', id);

      // Fetch field verification for this specific ID
      const res = await axios.post(
        WATER_API_ROUTES.GET_FIELD_VERIFICATION_DTLS_API,
        { id: id }, // API expects an array of IDs
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('Full Axios response:', res);
      console.log('Response data:', res.data);
      console.log('Response data.data:', res.data.status);
      if (res?.data?.status) {
        setModalVerificationData(res.data.data); // store data for modal
        setIsVisible(true); // show modal immediately
      } else {
        console.error('API returned false status:', res.data.message);
      }
    } catch (err) {
      console.error('Error fetching field verification:', err.message);
    }
  };
  // console.log('Modal Visible:', isVisible);

  const id = route?.params?.id;
  const navigation = useNavigation();

  const fetchAllData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const token = await getToken();

      // Fetch trade details first to get workflowId
      const tradeRes = await axios.post(
        WATER_API_ROUTES.WATER_DETAILS,
        { id: Number(id) },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // console.log('Trade Details Response:', tradeRes?.data);
      // console.log('Payment Status:', tradeRes?.data?.paymentStatus);
      // console.log('Payment Status:', tradeRes?.data?.data?.paymentStatus); // ✅

      if (tradeRes?.data?.status && tradeRes.data.data) {
        setTradeDetails(tradeRes.data.data);
        setPaymentDtl(tradeRes.data.data.tranDtls?.[0] || null);
        setLevelRemarks(tradeRes.data.data.levelRemarks || []);
        setTcVerification(tradeRes.data.data.tcVerifications || null);
      }

      const workflowId = tradeRes?.data?.data?.workflowId || 0;
      // console.log('Trade details ID:', tradeRes?.data?.data?.tranDtls?.[0]?.id);
      const newTradeId = tradeRes?.data?.data?.tranDtls?.[0]?.id;
      setTradeId(newTradeId);
      console.log('jbdfjads', newTradeId); // ✅ Logs immediately

      // Run other APIs in parallel
      const [
        waterDue,
        workflowRes,
        paymentRes,
        receiptRes,
        documentRes,
        fieldverification,
      ] = await Promise.all([
        axios.post(
          WATER_API_ROUTES.WATER_DUE,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        axios.post(
          WORK_FLOW_PERMISSION,
          { wfId: workflowId },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        axios.post(
          WATER_API_ROUTES.PAYMENT_RECEIPT,
          { id: newTradeId },
          { headers: { Authorization: `Bearer ${token}` } },
        ),

        axios.post(
          WATER_API_ROUTES.PAY_DEMAND,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        axios.post(
          WATER_API_ROUTES.WATER_DOC_LIST,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        axios.post(
          WATER_API_ROUTES.GET_FIELD_VERIFICATION_DTLS_API,
          { id },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ]);
      console.log(
        'fieldverification fieldverification:',
        fieldverification.data.data,
      );
      if (fieldverification?.data?.status)
        setModalVerificationData(fieldverification.data.data);

      if (waterDue?.data?.status) setWaterDue(waterDue.data.data);
      if (workflowRes?.data?.status) setWorkflowData(workflowRes.data.data);
      if (paymentRes?.data?.status) setTradeDue(paymentRes.data.data);
      if (paymentRes?.data?.status) setTradPaymentRecipt(paymentRes.data.data);
      if (documentRes?.data?.status) setDocuments(documentRes.data.data);
    } catch (err) {
      console.log('❌ Error fetching data:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // fetchAllData();

  useEffect(() => {
    fetchAllData();
  }, [id]);

  useEffect(() => {
    if (tradeId) {
      console.log('Trade ID updated:', tradeId);
      // you can call next API here, e.g. fetchReceipt(tradeId);
    }
  }, [tradeId]);

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
          <DetailRow label="category" value={`${tradeDetails?.category} `} />
          <DetailRow
            label="connectionType"
            value={tradeDetails?.connectionType}
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
            label="connectionThrough"
            value={tradeDetails?.connectionThrough}
          />
          <DetailRow label="pipelineType" value={tradeDetails?.pipelineType} />
          <DetailRow label="propertyType" value={tradeDetails?.propertyType} />
          <DetailRow label="Category Type" value="Others" />
          <DetailRow label="applyDate" value={tradeDetails?.applyDate} />
          <DetailRow label="Applied Date" value={tradeDetails?.applyDate} />
          <DetailRow label="Area" value={tradeDetails?.areaSqft} />
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

        {/* Document Details */}
        <Section title="Document Details">
          <View style={styles.docHeader}>
            <Text style={styles.docCol}>Document Name</Text>
            <Text style={styles.docCol}>Image</Text>
            <Text style={styles.docCol}>Status</Text>
          </View>

          {Array.isArray(documents) &&
            documents.map(doc => (
              <DocRow
                key={doc.id}
                name={doc.docName}
                status={
                  doc.verifiedStatus === 1
                    ? 'Verified'
                    : doc.verifiedStatus === 0
                    ? 'Pending'
                    : 'Failed'
                }
              />
            ))}
        </Section>

        {/* Payment Details */}
        <Section title="Payment Detail">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
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
                  <Text style={styles.paymentCol}>
                    {paymentDtl.paymentMode}
                  </Text>
                  <Text style={styles.paymentCol}>{paymentDtl.tranType}</Text>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => setShowReceipt(true)}
                  >
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </Section>

        {/* Field Verification */}
        <Section title="Field Verification">
          {/* Table Header */}
          <View style={styles.docHeader}>
            <Text style={styles.docCol}>SL</Text>
            <Text style={styles.docCol}>Verified By</Text>
            <Text style={styles.docCol}>Verification On</Text>
            <Text style={styles.docCol}>View</Text>
          </View>

          {/* Table Rows */}
          {tcVerification && tcVerification.length > 0 ? (
            tcVerification.map((item, index) => (
              <View key={item.id || index} style={styles.paymentRow}>
                <Text style={styles.paymentCol}>{index + 1}</Text>
                <Text style={styles.paymentCol}>
                  {item.verifiedBy} ({item.userName})
                </Text>
                <Text style={styles.paymentCol}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => handleViewVerification(item.id)}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No Field Verification Available!
              </Text>
            </View>
          )}
        </Section>

        <Section title="Level Remarks">
          {Array.isArray(levelRemarks) && levelRemarks.length > 0 ? (
            <View style={styles.remarksTableContainer}>
              <View style={styles.remarksHeader}>
                <Text style={styles.remarksHeaderCol}>Role</Text>
                <Text style={styles.remarksHeaderCol}>Remark</Text>
                <Text style={styles.remarksHeaderCol}>Time</Text>
                <Text style={styles.remarksHeaderCol}>Action</Text>
              </View>
              {levelRemarks.map((remark, index) => (
                <View
                  key={remark.id || index}
                  style={[
                    styles.remarksRow,
                    { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
                  ]}
                >
                  <Text style={styles.remarksColRole}>
                    {remark.senderRole || 'N/A'}
                  </Text>
                  <Text style={styles.remarksColRole}>
                    {remark.senderRemarks || '-'}
                  </Text>
                  <Text style={styles.remarksColRole}>
                    {new Date(remark.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(remark.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.remarksColRole}>
                    {remark.actions || '-'}
                  </Text>
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

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={[styles.tradeLicenseBtn, { flex: 1 }]}
            onPress={() => setShowTradeLicenseModal(true)}
          >
            <Text style={styles.tradeLicenseText}>View Water</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowDemandModal(true)}
          >
            <Text style={styles.actionBtnText}>View Demand</Text>
          </TouchableOpacity>
          {tradeDetails?.paymentStatus === 0 && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.actionBtnText}>Make Payment</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowDocumentModal(true)}
          >
            <Text style={styles.actionBtnText}>View Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FieldVerificationModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        verifiedData={modalVerificationData}
      />
      <ViewDemandModal
        visible={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        tradeDetails={waterDue}
        tradeDetails1={tradeDetails}
        id={id}
        fetchAllData={fetchAllData}
      />
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tradeDetails={waterDue}
        id={id}
        fetchAllData={fetchAllData}
        onShowReceipt={() => {
          setShowPaymentModal(false);
          setShowReceipt(true);
        }}
      />

      <DocumentModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={documents}
        id={id}
      />
      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        receiptData={receiptData}
        id={id}
      />

      <RemarksModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        remarks={remarks}
        setRemarks={setRemarks}
        // onSubmit={handleSend} // pass the function
      />
    </View>
  );
};

// Section and Row components
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

const DocRow = ({ name, status }) => {
  const color =
    status === 'Verified'
      ? 'green'
      : status === 'Pending'
      ? 'orange'
      : status === 'Failed'
      ? 'red'
      : 'black';
  return (
    <View style={styles.docRow}>
      <Text style={styles.docCol}>{name}</Text>
      <Text style={styles.docCol}>📄</Text>
      <Text style={[styles.docCol, { color, fontWeight: 'bold' }]}>
        {status}
      </Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: { padding: 10, backgroundColor: '#f4faff' },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },

//   banner: {
//     backgroundColor: '#e6f0ff',
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 10,
//   },
//   bannerText: { fontSize: 14 },
//   appId: { color: '#ff6600', fontWeight: 'bold' },
//   statusText: { marginTop: 5 },
//   expired: { color: 'red', fontWeight: 'bold' },

//   sectionTitle: {
//     backgroundColor: Colors.primary || '#007AFF',
//     paddingVertical: responsiveHeight(1.5),
//     paddingHorizontal: responsiveWidth(4),
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.primary || '#007AFF',
//     borderBottomWidth: 0,
//     elevation: 6,
//     zIndex: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     color: '#FFFFFF',
//     alignSelf: 'stretch', // 👈 makes width match parent
//   },

//   section: {
//     backgroundColor: Colors.cardBackground || '#FFFFFF',
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//     marginTop: -1,
//     paddingBottom: responsiveWidth(4),
//     // paddingHorizontal: responsiveWidth(4),
//     marginTop: responsiveHeight(2),
//     borderTopWidth: 0,
//     borderColor: Colors.cardBorder || '#f0f0f0',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     zIndex: 1,
//     alignSelf: 'stretch', // 👈 ensures same width as title
//   },

//   row: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: responsiveHeight(0.5),
//     paddingVertical: responsiveHeight(0.8),
//     paddingHorizontal: responsiveWidth(2),
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.rowDivider || '#eee',
//   },
//   label: { fontWeight: '600', color: '#333', flex: 1 },
//   value: { flex: 1, textAlign: 'right', color: '#000' },

//   ownerHeader: { flexDirection: 'row', backgroundColor: '#f2f2f2', padding: 8 },
//   ownerRow: {
//     flexDirection: 'row',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   ownerCol: { flex: 1, fontWeight: 'bold' },

//   docHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//     paddingBottom: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'black',
//   },
//   docRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//     alignItems: 'center',
//   },
//   docCol: { flex: 1, textAlign: 'center', color: '#ffffffff' },

//   paymentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   paymentCol: { flex: 1, textAlign: 'center' },
//   viewBtn: {
//     backgroundColor: '#0c3c78',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 4,
//   },
//   viewBtnText: { color: '#fff', fontWeight: '600' },

//   noRemarksContainer: { padding: 10, alignItems: 'center' },
//   noRemarksText: { color: '#999' },

//   noDataContainer: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 6,
//   },
//   noDataText: {
//     color: '#666',
//     fontSize: 14,
//     fontStyle: 'italic',
//   },

//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//     marginTop: 15,
//     marginBottom: 20,
//     paddingHorizontal: 5,
//   },
//   actionBtn: {
//     width: 85,
//     backgroundColor: Colors.primary,
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   actionBtnText: {
//     color: '#fff',
//     fontSize: 9,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

export default Details;
