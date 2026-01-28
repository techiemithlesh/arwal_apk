// TradeModels.jsx
import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import PrintButton from '../../../../Components/PrintButton';
import Toast from 'react-native-toast-message';
import { showToast } from '../../../../utils/toast';
import { toastConfig } from '../../../../utils/toastConfig';
import { useEffect } from 'react';
import { API_ROUTES } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import axios from 'axios';
// 1. View Trade License Modal
export const ViewTradeLicenseModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>
            Municipal Trade Licence Approval Certificate
          </Text>

          <Text style={styles.mainTitle}>Municipal License</Text>

          <Text style={styles.subTitle}>RANCHI MUNICIPAL CORPORATION</Text>
          <Text style={styles.tinyText}>
            (This certificate relates to Section 455(J) Jharkhand Municipal Act
            2011)
          </Text>

          {[
            [
              'Municipal Trade Licence No:',
              tradeDetails?.licenseNo || 'RAN55020319162233',
            ],
            ['Issue Date:', tradeDetails?.issueDate || '03-02-2019'],
            ['Validity:', tradeDetails?.validUpto || '23-01-2020'],
            [
              'Owner/Entity Name:',
              tradeDetails?.firmName || 'GOPAL GENERAL STORE',
            ],
            [
              'Owner Name:',
              tradeDetails?.owners?.[0]?.ownerName || 'ARVIND KUMAR',
            ],
            ['Nature of Entity:', tradeDetails?.firmType || 'GENERAL STORE'],
            [
              'Nature of Business:',
              tradeDetails?.natureOfBusiness ||
                'GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PARCHING',
            ],
            ['Business Code:', tradeDetails?.businessCode || '(83)'],
            ['Date of Application:', tradeDetails?.applyDate || '24-01-2019'],
            ['Ward No.:', tradeDetails?.wardNo || '55'],
            ['Holding No.:', tradeDetails?.holdingNo || 'N/A'],
            [
              'Street Address:',
              tradeDetails?.address ||
                'NEW NAGAR BANDHGARI DIPATOLI RANCHI834001',
            ],
            [
              'Application No.:',
              tradeDetails?.applicationNo || '162233240119104140',
            ],
            [
              'Mobile No.:',
              tradeDetails?.owners?.[0]?.mobileNo || '9709226782',
            ],
          ].map(([label, value], index) => (
            <View style={styles.rowContainer} key={index}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}

          <Text style={styles.declaration}>
            This is to declare that{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.firmName || 'GOPAL GENERAL STORE'}
            </Text>{' '}
            having application number{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.applicationNo || '162233240119104140'}
            </Text>{' '}
            has been successfully registered with satisfactory compliance of
            registration criteria.
          </Text>

          <View style={{ marginTop: 10 }}>
            {[
              '1. The business will run according to the license issued.',
              '2. Prior permission from the local body is necessary if the business is changed.',
              '3. Information to the local body is necessary for extension of the area.',
              '4. Prior intimation to local body regarding winding off business is necessary.',
              '5. Renewal is necessary one month before expiry.',
              '6. Penalty may be levied under Section 459.',
              '7. Illegal parking in front of the firm is non-permissible.',
              '8. Dustbins must be available at premises and adhere to waste disposal rules.',
              '9. SWM & Plastic Waste Management Rules 2016 shall be adhered to.',
            ].map((term, i) => (
              <Text style={styles.term} key={i}>
                {term}
              </Text>
            ))}
          </View>

          <Text style={styles.note}>
            Note: This is a computer-generated license. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// 2. View Demand Modal
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

export const PaymentModal = ({
  visible,
  onClose,
  tradeDetails,
  demandDetails,
  onPaymentSuccess, // ✅ new callback prop
  setUpdatedTradeDetails,
}) => {
  const [year, setYear] = useState(null);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(new Date());
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [paymentType, setPaymentType] = useState('FULL');

  const processPayment = async () => {
    let response = null;

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return { success: false };
      }

      console.log('tradeDetails', tradeDetails);

      const paymentData = {
        id: tradeDetails?.id,
        paymentType: paymentType?.toUpperCase(),
        paymentMode: paymentMode?.toUpperCase(),
        chequeNo: paymentMode?.toUpperCase() === 'CASH' ? '' : refNo,
        chequeDate:
          paymentMode?.toUpperCase() === 'CASH'
            ? ''
            : chequeDate?.toISOString().split('T')[0],
        bankName: paymentMode?.toUpperCase() === 'CASH' ? '' : bankName,
        branchName: paymentMode?.toUpperCase() === 'CASH' ? '' : branchName,
      };

      console.log('paymentData', paymentData);

      try {
        response = await axios.post(API_ROUTES.TRADE_PAY_DEMAND, paymentData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(
          'Payment API Error:',
          error.response?.data || error.message,
        );
        response = error.response;
      }

      const tranId =
        response?.data?.data && typeof response.data.data === 'object'
          ? response.data.data.id
          : null;

      console.log('Transaction ID:', tranId);

      if (response?.data?.status === true) {
        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );

        // ✅ Reset local trade amounts to 0
        if (setUpdatedTradeDetails) {
          setUpdatedTradeDetails(prev => ({
            ...prev,
            demandAmount: 0,
            payableAmount: 0,
            realizationPenalty: 0,
            demandList: prev?.demandList?.map(item => ({
              ...item,
              connFee: 0,
              penalty: 0,
              amount: 0,
            })),
          }));
        }

        // ✅ Trigger refresh callback in parent
        if (onPaymentSuccess) onPaymentSuccess();

        // ✅ Close modal
        onClose();

        return { success: true, tranId };
      } else {
        Alert.alert(
          'Payment Error',
          response?.data?.message || 'Payment failed. Please try again.',
        );
        return { success: false };
      }
    } catch (error) {
      console.error('Unexpected Payment Error:', error);
      Alert.alert(
        'Payment Error',
        error?.response?.data?.message ||
          'Failed to process payment. Please try again later.',
      );
      return { success: false };
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Licence Required for the Year</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Charge Applied*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.totalCharge?.toString() || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Penalty*</Text>
              <TextInput style={styles.input} value="0" editable={false} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Denial Amount*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.latePenalty || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Charge*</Text>
              <TextInput
                style={styles.input}
                value={demandDetails?.totalCharge?.toString() || '0'}
                editable={false}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Mode*</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'CASH', value: 'CASH' },
                  { label: 'CHEQUE', value: 'CHEQUE' },
                  { label: 'ONLINE', value: 'ONLINE' },
                  { label: 'DD', value: 'DD' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Choose Payment Mode"
                value={paymentMode}
                onChange={item => setPaymentMode(item.value)}
              />
            </View>

            {paymentMode !== 'CASH' && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Ref No*</Text>
                  <TextInput
                    style={styles.input}
                    value={refNo}
                    onChangeText={setRefNo}
                    placeholder="Enter Reference Number"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Cheque Date*</Text>
                  <TextInput
                    style={styles.input}
                    value={chequeDate.toISOString().split('T')[0]}
                    onChangeText={text => setChequeDate(new Date(text))}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Bank Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Enter Bank Name"
                  />
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Branch Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={branchName}
                    onChangeText={setBranchName}
                    placeholder="Enter Branch Name"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={async () => {
                if (!paymentMode) {
                  Alert.alert('Validation Error', 'Please select Payment Mode');
                  return;
                }

                if (
                  paymentMode !== 'CASH' &&
                  (!refNo || !bankName || !branchName)
                ) {
                  Alert.alert(
                    'Validation Error',
                    'Please fill all payment details',
                  );
                  return;
                }

                const paymentResult = await processPayment();

                if (paymentResult.success) {
                  console.log('✅ Payment Done:', paymentResult.tranId);
                }
              }}
            >
              <Text style={styles.submitText}>Pay Now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');
const downloadPDF = async url => {
  try {
    const { fs } = RNBlobUtil;
    const dir = fs.dirs.DownloadDir; // Downloads folder
    const path = `${dir}/document_${Date.now()}.pdf`;

    const res = await RNBlobUtil.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading PDF...',
      },
    }).fetch('GET', url);

    showToast('success', '📄 Success', 'PDF Downloaded Successfully!');
    console.log('PDF saved to:', res.path());
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', 'Download failed!');
  }
};

export const DocumentModal = ({ visible, onClose, documents }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const openPreview = index => {
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const renderPreviewItem = ({ item }) => {
    const isPDF = item.docPath?.toLowerCase().endsWith('.pdf');

    return (
      <View
        style={{
          width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPDF ? (
          <View style={{ alignItems: 'center' }}>
            {/* PDF Preview via Google Docs viewer */}
            <WebView
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                  item.docPath,
                )}`,
              }}
              style={{
                width: width * 0.95,
                height: height * 0.75,
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            />

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => downloadPDF(item.docPath)}
            >
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
            <View style={{ padding: 20 }}>
              <Text style={{}}>Trade Documents</Text>
              <PrintButton fileUrl={item.docPath} title="Print" />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.docPath }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        {/* Document List Modal */}
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Uploaded Documents</Text>

            <View style={styles.sectionContainer}>
              {documents?.length > 0 ? (
                documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.documentName}>
                        {doc.docName} ({doc.ownerName || 'N/A'})
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded By: {doc.uploadedBy || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Owner: {doc.ownerName || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded At: {doc.createdAt?.split('T')[0] || 'N/A'}
                      </Text>
                      {doc.verifiedAt && (
                        <Text style={styles.documentDate}>
                          Verified At: {doc.verifiedAt}
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={[
                          styles.documentStatus,
                          {
                            color:
                              doc.verifiedStatus === 1
                                ? 'green'
                                : doc.verifiedStatus === 2
                                ? 'red'
                                : 'orange',
                          },
                        ]}
                      >
                        {doc.verifiedStatus === 1
                          ? 'Verified'
                          : doc.verifiedStatus === 2
                          ? 'Rejected'
                          : 'Pending'}
                      </Text>

                      {/* View Button */}
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => openPreview(index)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#666' }}>
                  No Documents Uploaded
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View style={styles.previewOverlay}>
            <TouchableOpacity
              style={styles.previewCloseBtn}
              onPress={() => setPreviewVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={documents}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentIndex}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPreviewItem}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 300);
              }}
            />
            {/* Toast inside modal to ensure it appears above modal content */}
            <Toast config={toastConfig} position="top" topOffset={60} />
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

// 5. Payment Receipt Modal
export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>Payment Receipt</Text>
          <Text style={styles.subTitle}>
            {receiptData?.ulbDtl?.ulbName || 'Ranchi Municipal Corporation'}
          </Text>
          <Text style={styles.receiptTypeTitle}>
            Trade License Payment Receipt
          </Text>

          <View style={styles.sectionContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Receipt No.:</Text>
              <Text style={styles.value}>{receiptData?.tranNo || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{receiptData?.tranDate || 'N/A'}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Transaction Type:</Text>
              <Text style={styles.value}>
                {receiptData?.tranDtl?.tranType || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Payment Mode:</Text>
              <Text style={styles.value}>
                {receiptData?.paymentMode || 'N/A'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Ward No:</Text>
              <Text style={styles.value}>
                {receiptData?.newWardNo || receiptData?.wardNo || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Demand Amount:</Text>
              <Text style={styles.value}>
                ₹
                {receiptData?.tranDtl?.demandAmt ||
                  (
                    parseFloat(receiptData?.currentCharge || 0) +
                    parseFloat(receiptData?.arrearCharge || 0)
                  ).toFixed(2)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Penalty:</Text>
              <Text style={styles.value}>
                ₹{receiptData?.tranDtl?.penaltyAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Discount:</Text>
              <Text style={styles.value}>
                ₹{receiptData?.tranDtl?.discountAmt || '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={[styles.label, styles.totalText]}>
                Payable Amount:
              </Text>
              <Text style={[styles.value, styles.totalText]}>
                ₹
                {receiptData?.tranDtl?.payableAmt ||
                  receiptData?.amount ||
                  '0.00'}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      receiptData?.paymentStatus === 'Clear' ||
                      receiptData?.paymentStatus === 'Paid'
                        ? 'green'
                        : 'red',
                    fontWeight: 'bold',
                  },
                ]}
              >
                {receiptData?.paymentStatus || 'N/A'}
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            Visit:{' '}
            {receiptData?.ulbDtl?.ulbUrl || 'https://ranchimunicipal.com'}
          </Text>
          <Text style={styles.note}>
            Call: {receiptData?.ulbDtl?.tollFreeNo || '1800-xxx-xxxx'}
          </Text>
          <Text style={styles.note}>
            In collaboration with{'\n'}
            {receiptData?.ulbDtl?.collaboration ||
              'Ranchi Municipal Corporation'}
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>
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
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 18,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  receiptTypeTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 12,
    color: '#000',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  tinyText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
    flex: 1,
    color: '#555',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  declaration: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  term: {
    fontSize: 12,
    marginVertical: 2,
    color: '#444',
  },
  note: {
    marginTop: 12,
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  printBtn: {
    marginTop: 18,
    backgroundColor: '#0c3c78',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  row: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#b30000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 6,
    backgroundColor: 'white',
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 18,
    color: '#b30000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  viewBtn: {
    backgroundColor: '#0c3c78',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Preview styles
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  // Preview Modal
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  previewImage: {
    width: '95%',
    height: '75%',
    borderRadius: 10,
  },
  downloadBtn: {
    marginTop: 15,
    backgroundColor: '#0c3c78',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
