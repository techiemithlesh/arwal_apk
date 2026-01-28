import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import Colors from '../Constants/Colors';
import { CUSTOMER_API } from '../../api/apiRoutes';
import axios from 'axios';
import HeaderNavigation from '../../Components/HeaderNavigation';
import {
  ViewDemandModal,
  ViewTradeLicenseModal,
  PaymentModal,
  DocumentModal,
  PaymentReceiptModal,
} from './Model';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../utils/auth';
import { WORK_FLOW_PERMISSION, API_ROUTES } from '../../api/apiRoutes';
import GenerateDemandModal from './Model/GenerateDemandModal';
import styles from '../../style/DetailsStyle';
const Details = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showTradeLicenseModal, setShowTradeLicenseModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [receiptData, setTradPaymentRecipt] = useState(null);
  const [customerDue, setCustomerDue] = useState(null);

  const [tradeDetails, setTradeDetails] = useState(null);
  const [paymentDtl, setPaymentDtl] = useState([]);

  const [workflowData, setWorkflowData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [levelRemarks, setLevelRemarks] = useState([]);
  const [connectionDtl, setConnectionDtl] = useState('');

  const [loading, setLoading] = useState(false);
  const [customerDeuDetails, setCustomerDueDetails] = useState('');
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [receiptDatas, setReceiptData] = useState(null);
  const [connectionDetails, setConnectionDetails] = useState({});
  const [meterStatusId, setMeterStatusId] = useState('');

  const id = route?.params?.id;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const token = await getToken();

        const tradeRes = await axios.post(
          CUSTOMER_API.CUSTOMER_DETAILS_API,
          { id: Number(id) },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setConnectionDetails(tradeRes.data.data.connectionDtl || {});
        const paymentIds = paymentDtl.map(item => item.id);
        console.log('Consumer Deatails', tradeRes.data.data.connectionDtl);

        if (tradeRes?.data?.status && tradeRes.data.data) {
          setTradeDetails(tradeRes.data.data);
          setPaymentDtl(tradeRes.data.data.tranDtls || []);

          setLevelRemarks(tradeRes.data.data.levelRemarks || []);
          setConnectionDtl(tradeRes.data.data.connectionDtl);
        }

        const workflowId = tradeRes?.data?.data?.workflowId || 0;
        const transId = tradeRes?.data?.data?.tranDtls?.[0]?.id || 0;
        console.log('Transaction ID:', transId); // 9

        const meterStatusId1 = tradeRes.data.data.meterStatusId;
        console.log('Consumer Details', meterStatusId1);
        setMeterStatusId(meterStatusId1);

        const [customerDue, workflowRes, paymentRes, receiptRes, documentRes] =
          await Promise.all([
            axios.post(
              CUSTOMER_API.CUSTOMER_DUE_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              WORK_FLOW_PERMISSION,
              { wfId: workflowId },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            // axios.post(
            //   API_ROUTES.TRADE_PAYMENT,
            //   {
            //     id,
            //     paymentType: 'FULL',
            //     paymentMode: 'CASH',
            //     chequeNo: '',
            //     chequeDate: '',
            //     bankName: '',
            //     branchName: '',
            //   },
            //   { headers: { Authorization: `Bearer ${token}` } },
            // ),
            axios.post(
              CUSTOMER_API.CUSTOMER_PAYMENT_RECIPT_API,
              { id: transId },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            axios.post(
              CUSTOMER_API.CUSTOMER_DETAILS_API,
              { id },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ]);

        if (customerDue?.data?.status)
          setCustomerDueDetails(customerDue.data.data);
        if (customerDue?.data?.status)
          setCustomerDue(customerDue.data.data.demandList);
        if (workflowRes?.data?.status) setWorkflowData(workflowRes.data.data);
        if (paymentRes?.data?.status) {
          setTradPaymentRecipt(paymentRes.data.data);
          console.log('Customer receiptData from API', paymentRes.data.data);
        }
        if (documentRes?.data?.status) setDocuments(documentRes.data.data);
      } catch (err) {
        console.log(
          '❌ Error fetching data:',
          err.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

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
          {/* <Text style={styles.bannerText}>
            Your applied application no.{' '}
            <Text style={styles.appId}>{tradeDetails?.consumerNo}</Text>. You
            can use this for future reference.
          </Text> */}
          {/* 
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
          </Text> */}
        </View>
        {/* Basic Details */}
        <Section title="Basic Details">
          <View style={styles.customerCard}>
            <DetailRow
              label="Consumer No"
              value={tradeDetails?.consumerNo || 'N/A'}
            />
            <DetailRow
              label="Consumer Date"
              value={
                tradeDetails?.createdAt
                  ? tradeDetails.createdAt.slice(0, 10)
                  : 'N/A'
              }
            />
            <DetailRow label="Ward No" value={tradeDetails?.wardNo || 'N/A'} />
            <DetailRow
              label="New Ward No"
              value={tradeDetails?.newWardNo || 'N/A'}
            />
            <DetailRow
              label="Property Type"
              value={tradeDetails?.propertyType || 'N/A'}
            />
            <DetailRow
              label="Ownership Type"
              value={tradeDetails?.ownershipType || 'N/A'}
            />
            <DetailRow
              label="Connection Through"
              value={tradeDetails?.connectionThrough || 'N/A'}
            />
            <DetailRow
              label="Pipeline Type"
              value={tradeDetails?.pipelineType || 'N/A'}
            />
            <DetailRow
              label="Area in Sqft"
              value={tradeDetails?.areaSqft || 'N/A'}
            />
            <DetailRow label="Address" value={tradeDetails?.address || 'N/A'} />
            <DetailRow
              label="Landmark"
              value={tradeDetails?.landmark || 'N/A'}
            />
            <DetailRow
              label="Pin Code"
              value={tradeDetails?.pinCode || 'N/A'}
            />
          </View>
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
        {/* <Section title="Document Details">
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
        </Section> */}
        <Section title="Payment Detail">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.docHeader}>
                <Text style={styles.docCol}>Tran No</Text>
                <Text style={styles.docCol}>Tran Date</Text>
                <Text style={styles.docCol}>Payment Mode</Text>
                <Text style={styles.docCol}>Tran Type</Text>
                <Text style={styles.docCol}>Demand From</Text>
                <Text style={styles.docCol}>Demand Upto</Text>
                <Text style={styles.docCol}>Demand Amt (Excl. Penalty)</Text>
                <Text style={styles.docCol}>Paid Demand</Text>
                <Text style={styles.docCol}>Paid Penalty</Text>
                <Text style={styles.docCol}>Total Paid Amt</Text>
                <Text style={styles.docCol}>Balance Amt</Text>
                <Text style={styles.docCol}>View</Text>
              </View>

              {/* Table Rows */}
              {paymentDtl && paymentDtl.length > 0 ? (
                paymentDtl.map((item, index) => (
                  <View key={item.id || index} style={styles.paymentRow}>
                    <Text style={styles.paymentCol}>{item.tranNo}</Text>
                    <Text style={styles.paymentCol}>{item.tranDate}</Text>
                    <Text style={styles.paymentCol}>{item.paymentMode}</Text>
                    <Text style={styles.paymentCol}>{item.tranType}</Text>
                    <Text style={styles.paymentCol}>{item.fromDate}</Text>
                    <Text style={styles.paymentCol}>{item.uptoDate}</Text>
                    <Text style={styles.paymentCol}>{item.demandAmt}</Text>
                    <Text style={styles.paymentCol}>{item.payableAmt}</Text>
                    <Text style={styles.paymentCol}>{item.penaltyAmt}</Text>
                    <Text style={styles.paymentCol}>
                      {parseFloat(item.payableAmt) +
                        parseFloat(item.penaltyAmt)}
                    </Text>
                    <Text style={styles.paymentCol}>{item.balance}</Text>

                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => setShowReceipt(true)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No payment details found.</Text>
              )}
            </View>
          </ScrollView>
        </Section>
        <Section title="Consumer Connection Details">
          <View style={styles.customerCard}>
            <DetailRow
              label="Connection Type"
              value={connectionDtl.connectionType || 'N/A'}
            />

            <DetailRow
              label="Connection Date"
              value={
                connectionDtl.connectionDate
                  ? new Date(connectionDtl.connectionDate).toLocaleDateString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="Created At"
              value={
                connectionDtl.createdAt
                  ? new Date(connectionDtl.createdAt).toLocaleString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="Meter No"
              value={connectionDtl.meterNo || 'N/A'}
            />

            <DetailRow
              label="Current Reading"
              value={connectionDtl.currentReading || 'N/A'}
            />

            <DetailRow
              label="Current Reading Date"
              value={
                Array.isArray(connectionDtl.currentReadingDate) &&
                connectionDtl.currentReadingDate.length > 0
                  ? new Date(
                      connectionDtl.currentReadingDate[0],
                    ).toLocaleString()
                  : 'N/A'
              }
            />

            <DetailRow
              label="User Name"
              value={connectionDtl.userName || 'N/A'}
            />

            {/* Show Image */}
            <View style={styles.imageContainer}>
              <Text style={styles.text}>Last Reading Img</Text>
              {connectionDtl.docPath ? (
                <Image
                  source={{ uri: connectionDtl.docPath }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text>No document available</Text>
              )}
            </View>
          </View>
        </Section>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              (!meterStatusId || meterStatusId === null) && styles.disabledBtn,
            ]}
            onPress={() => setModalVisible(true)}
            disabled={!meterStatusId || meterStatusId === null}
          >
            <Text style={styles.actionBtnText}>Generate Demand</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowDemandModal(true)}
          >
            <Text style={styles.actionBtnText}>View Demand</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.actionBtnText}>Pay Demand</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowDocumentModal(true)}
          >
            <Text style={styles.actionBtnText}>View Application</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Modals */}
      <ViewDemandModal
        visible={showDemandModal}
        onClose={() => setShowDemandModal(false)}
        customerDue={customerDue}
        tradeDetails1={tradeDetails}
        customerDeuDetails={customerDeuDetails}
      />
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        customerDue={customerDue}
        tradeDetails={tradeDetails}
        customerDeuDetails={customerDeuDetails}
        id={id}
      />
      <DocumentModal
        visible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={documents}
      />
      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        receiptData={receiptData}
      />
      <GenerateDemandModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        connectionDetails={connectionDetails}
        id={id}
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

export default Details;
