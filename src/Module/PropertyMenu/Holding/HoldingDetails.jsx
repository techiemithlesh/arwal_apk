import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import {
  propertyPaymentWepUrl,
  WORK_FLOW_PERMISSION,
} from '../../../api/apiRoutes';
import { TCVerificationModal } from '../Saf/Models/TCVerificationModal';
import PropertyTaxNoticeModal from '../Saf/Models/PropertyTaxNoticeModal';
import React from 'react';
import Colors from '../../Constants/Colors';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import {
  PayNowModal,
  ViewDemandModal,
  PaymentReceiptModal,
  DocumentViewModal,
  ImageViewModal,
  api,
} from './Model/Model';
import { getToken } from '../../../utils/auth';
import { HOLDIGN_API_ROUTES } from '../../../api/apiRoutes';
import NttDataPaymentModel from './Components/NttDataPaymentModel';
const HoldingDetails = ({ route, navigation }) => {
  const { id } = route.params;
  console.log(id, 'holdign id');
  const [holdingData, setHoldingData] = useState('');
  const [safData, setSafData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerList, setOwnerList] = useState([]); // 👈 owners arrayconst
  const [floordata, setFloorData] = useState([]);
  const [taxDetails, setTaxDetails] = useState([]);
  const [transDtls, setTranDtls] = useState([]);
  const [memoDtls, setMemoDtls] = useState([]);
  const [tcVerfivication, setTcVerfivication] = useState([]);
  const [paymentDtls, setPaynemtDtls] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // View Demand Modal
  const [viewDemandVisible, setViewDemandVisible] = useState(false);
  const [demandlist, setDemandList] = useState(null);
  const [currentdemand, setCurrentDemand] = useState(null);
  const [maindata, setMaindata] = useState(null);
  const [showPayNow, setShowPayNow] = useState(false);

  const [docModalVisible, setDocModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [payNowModalVisible, setPayNowModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [amount, setAmount] = useState('0.00');
  const [refNo, setRefNo] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [paymentReceiptVisible, setPaymentReceiptVisible] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const paymentTypeData = [{ label: 'Full', value: 'Full' }];

  const paymentModeData = [
    { label: 'Online', value: 'Online' },
    { label: 'Cash', value: 'Cash' },
    { label: 'UPI', value: 'UPI' },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [permissionData, setPermissionData] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [token, setToken] = useState(null);
  const [isOnlinePaymentModelOpen,setIsOnlinePaymentModelOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSafDetails();
    }
  }, [id, token]); // ✅ depend on id only

  useEffect(() => {
    const loadToken = async () => {
      try {
        const fetchedToken = await getToken();
        console.log(fetchedToken, 'get token');
        if (fetchedToken) {
          setToken(fetchedToken);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const fetchSafDetails = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const response = await axios.post(
        HOLDIGN_API_ROUTES.DETAILS_API,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = response?.data?.data;

      console.log('API Response Data:', responseData);

      // Set both state variables with the same data
      setHoldingData(responseData);
      setSafData(responseData);

      setWorkflowId(responseData?.workflowId);
      setOwnerList(responseData?.owners || []);
      setFloorData(responseData?.floors || []);
      setTaxDetails(responseData?.tranDtls || []);
      setTranDtls(responseData?.tranDtls || []);
      setMemoDtls(responseData?.memoDtls || []);
      setTcVerfivication(responseData?.tcVerifications || []);
    } catch (error) {
      console.error('fetchSafDetails error:', error);
      Alert.alert(
        'Error',
        'Failed to load property details. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
  const handleView = id => {
    setIsVisible(true); // if you are opening a modal
    setSelectedData(id); // store it in state to use in modal
  };

  const viewdemand = async id => {
    try {
      const token = await getToken(); // ✅ get auth token first

      const response = await axios.post(
        HOLDIGN_API_ROUTES.DEMAND_API,
        { id }, // ✅ send id in body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ API structure: { status, message, data }
      const responseData = response?.data?.data;
      console.log('Demand API Response:', responseData);

      const demandList = responseData?.demandList || [];
      const currentDemand = responseData?.currentDemand || null;

      setMaindata(responseData);
      setCurrentDemand(currentDemand);
      setDemandList(demandList);
      setViewDemandVisible(true);
    } catch (error) {
      console.error(
        'viewdemand error:',
        error?.response?.data || error.message,
      );
      Alert.alert('Error', 'Unable to fetch demand');
    }
  };

  const documentview = async id => {
    try {
      const response = await api.getUploadedDocs(id);
      const uploadedDocs = response?.data;
      setUploadedDocs(uploadedDocs);
      setDocModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch document list.');
    }
  };

  // const handleViewReceipt = async tranDtlId => {
  //   try {
  //     const response = await api.getPaymentReceipt(tranDtlId);
  //     setPaynemtDtls(response?.data);
  //     setModalVisible(true);
  //   } catch (error) {
  //     console.error(
  //       'Error fetching payment receipt:',
  //       error?.response || error,
  //     );
  //   }
  // };
  const handleViewReceiptOld = async tranDtlId => {
    console.log('trans is', tranDtlId);
    try {
      setLoading(true);

      const response = await axios.post(HOLDIGN_API_ROUTES.RECEIPT_API, {
        id: tranDtlId, // sending transaction ID in body
      });

      setPaynemtDtls(response?.data.data);
      setModalVisible(true);
    } catch (error) {
      console.error(
        'Error fetching payment receipt:',
        error?.response || error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt111 = (id = '') => {
    const openBrowerUrl = async url => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    };
    const url = propertyPaymentWepUrl(id);
    console.log('url is', url);
    openBrowerUrl(url);
  };

  const fetchPermission = async () => {
    try {
      const response = await axios.post(
        WORK_FLOW_PERMISSION,
        { wfId: workflowId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const permission = response.data?.data;
      if (permission) {
        setPermissionData(permission);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentTypeChange = item => {
    console.log('Payment Type selected:', item.value);
    setPaymentType(item.value);
  };

  const handlePaymentModeChange = item => {
    console.log('Payment Mode selected:', item.value);
    setPaymentMode(item.value);
  };

  // Update amount when maindata changes - MUST be before any conditional returns

  // useEffect(() => {
  //   if (id && token) {
  //     fetchSafDetails();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [id, token]);

  useEffect(() => {
    if (maindata?.payableAmount) {
      setAmount(maindata.payableAmount.toString());
    }
  }, [maindata]);

  useEffect(() => {
    if (workflowId && token) fetchPermission();
  }, [workflowId, token]);

  const processPayment = async () => {
    const token = await getToken();
    try {
      const paymentData = {
        id: id, // e.g. 143
        paymentType: paymentType?.toUpperCase() || 'FULL',
        paymentMode: paymentMode?.toUpperCase() || 'CASH',
        amount: amount || '0.00', // make sure you pass this too
        chequeNo: paymentMode === 'CASH' ? '' : refNo || '',
        chequeDate:
          paymentMode === 'CASH'
            ? ''
            : chequeDate
            ? chequeDate.toISOString().split('T')[0]
            : '',
        bankName: paymentMode === 'CASH' ? '' : bankName || '',
        branchName: paymentMode === 'CASH' ? '' : branchName || '',
      };

      const response = await axios.post(
        HOLDIGN_API_ROUTES.PAY_DEMAND_API,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('my data resposne of apyment', response.data.status);
      if (response.data?.status === true) {
        Alert.alert(
          'Success',
          response.data.message || 'Payment Successfully Done',
        );
        return { success: true, tranId: response.data?.data?.tranId };
      } else {
        Alert.alert(
          'Payment Error',
          response.data?.message || 'Payment failed',
        );
        return { success: false };
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        error.response?.data?.message ||
          'Failed to process payment. Please try again.',
      );
      return { success: false };
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.headignColor} />
        <Text
          style={{ marginTop: 10, fontSize: 16, color: Colors.headignColor }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <HeaderNavigation />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Basic Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Ward No:</Text>
            <Text style={styles.value}>{safData?.wardNo || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>New Ward No:</Text>
            <Text style={styles.value}>{safData?.newWardNo || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Assessment Type:</Text>
            <Text style={styles.value}>{safData?.assessmentType}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Holding No:</Text>
            <Text style={styles.value}>{safData?.holdingNo || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelFixed}>New Holding No:</Text>
            <Text style={styles.value}>{safData?.newHoldingNo || 'N/A'}</Text>
          </View>

          {/* propTypeMstrId */}

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Property Type:</Text>
            <Text style={styles.value}>{safData?.propertyType || 'N/A'}</Text>
          </View>

          {safData?.propTypeMstrId == 3 && (
            <>
              <View style={styles.row}>
                <Text style={styles.labelFixed}>Apartment Name:</Text>
                <Text style={styles.value}>
                  {safData?.apartmentName || 'N/A'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.labelFixed}>Flat Registry Date:</Text>
                <Text style={styles.value}>
                  {safData?.flatRegistryDate || 'N/A'}
                </Text>
              </View>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Ownership Type:</Text>
            <Text style={styles.value}>{safData?.ownershipType || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Khata No:</Text>
            <Text style={styles.value}>{safData?.khataNo || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Road Width (ft):</Text>
            <Text style={styles.value}>{safData?.roadWidth || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Area of Plot (sq. ft):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Rainwater Harvesting:</Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>City:</Text>
            <Text style={styles.value}>{safData?.propCity || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>District:</Text>
            <Text style={styles.value}>{safData?.propDist || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>State:</Text>
            <Text style={styles.value}>{safData?.propState || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Pin Code:</Text>
            <Text style={styles.value}>{safData?.propPinCode || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Zone:</Text>
            <Text style={styles.value}>{safData?.zone || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Owner Details</Text>

          {ownerList.length > 0 ? (
            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Sl No.
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Owner
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Guardian
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Relation
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Mobile
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Gender
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>DOB</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Email
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Aadhar
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>PAN</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Specially Abled
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Armed Force
                  </Text>
                </View>

                {/* Table Rows */}
                {ownerList.map((owner, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {owner.ownerName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.guardianName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.relationType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.mobileNo ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.gender ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>{owner.dob ?? 'N/A'}</Text>
                    <Text style={styles.tableCell}>{owner.email ?? 'N/A'}</Text>
                    <Text style={styles.tableCell}>
                      {owner.aadharNo || 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>{owner.panNo || 'N/A'}</Text>
                    <Text style={styles.tableCell}>
                      {owner.isSpeciallyAbled ? 'Yes' : 'No'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {owner.isArmedForce ? 'Yes' : 'No'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.row}>
              <Text style={styles.value}>No owner details available.</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Electricity Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Electricity K. No:</Text>
            <Text style={styles.value}>
              {safData?.electConsumerNo ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>ACC No.:</Text>
            <Text style={styles.value}>{safData?.electAccNo ?? 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>BIND/BOOK No.:</Text>
            <Text style={styles.value}>
              {safData?.electBindBookNo ? safData.electBindBookNo : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Electricity Consumer Category:
            </Text>
            <Text style={styles.value}>
              {safData?.electConsCategory ?? 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>
            Building Plan / Water Connection Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Building Plan Approval No:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalNo
                ? safData.buildingPlanApprovalNo
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Building Plan Approval Date:</Text>
            <Text style={styles.value}>
              {safData?.buildingPlanApprovalDate
                ? safData.buildingPlanApprovalDate
                : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Water Consumer No:</Text>
            <Text style={styles.value}>
              {safData?.waterConnNo ? safData.waterConnNo : 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Water Connection Date:</Text>
            <Text style={styles.value}>
              {safData?.waterConnDate ? safData.waterConnDate : 'NA'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Khata No:</Text>
            <Text style={styles.value}>{safData?.khataNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Plot No:</Text>
            <Text style={styles.value}>{safData?.plotNo ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Village/Mauja Name:</Text>
            <Text style={styles.value}>
              {safData?.villageMaujaName ?? 'NA'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Area of Plot (in Decimal):</Text>
            <Text style={styles.value}>{safData?.areaOfPlot ?? 'NA'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Property Address</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Address:</Text>
            <Text style={styles.value}>{safData?.propAddress ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>City:</Text>
            <Text style={styles.value}>{safData?.propCity ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Pin:</Text>
            <Text style={styles.value}>{safData?.propPinCode ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>State:</Text>
            <Text style={styles.value}>{safData?.propState ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>District:</Text>
            <Text style={styles.value}>{safData?.propDist ?? 'NA'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              If Corresponding Address Different:
            </Text>
            <Text style={styles.value}>
              {safData?.isCorrAddDiffer ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Floor Details</Text>

          {floordata?.length > 0 ? (
            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Sl No.
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Floor
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Usage Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Occupancy Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Construction Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Carpet Area
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Built-up Area
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    From Date
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Upto Date
                  </Text>
                </View>

                {/* Table Rows */}
                {floordata.map((floor, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {floor.floorName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.usageType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.occupancyName ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.constructionType ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.carpetArea ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.builtupArea ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.dateFrom ?? 'N/A'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {floor.dateUpto ? floor.dateUpto : 'N/A'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.row}>
              <Text style={styles.value}>No floor details available.</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Additional Property Details</Text>

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Does Property Have Mobile Tower(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isMobileTower ? 'Yes' : 'No'}
            </Text>
          </View>
          {safData?.isMobileTower && (
            <>
              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Date of Installation of Mobile Tower:
                </Text>
                <Text style={styles.value}>
                  {safData?.towerInstallationDate || 'NA'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Total Area Covered by Mobile Tower & its Equipments (Sq. Ft.):
                </Text>
                <Text style={styles.value}>{safData?.towerArea || 'NA'}</Text>
              </View>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Does Property Have Hoarding Board(s)?
            </Text>
            <Text style={styles.value}>
              {safData?.isHoardingBoard ? 'Yes' : 'No'}
            </Text>
          </View>
          {safData?.isHoardingBoard && (
            <>
              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Date of Installation of Hoarding Board(s):
                </Text>
                <Text style={styles.value}>
                  {safData?.hoardingInstallationDate || 'NA'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Total Area of Wall / Roof / Land (in Sq. Ft.):
                </Text>
                <Text style={styles.value}>
                  {safData?.hoardingArea || 'NA'}
                </Text>
              </View>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.labelFixed}>Is Property a Petrol Pump?</Text>
            <Text style={styles.value}>
              {safData?.isPetrolPump ? 'Yes' : 'No'}
            </Text>
          </View>
          {safData?.isPetrolPump && (
            <>
              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Completion Date of Petrol Pump:
                </Text>
                <Text style={styles.value}>
                  {safData?.petrolPumpCompletionDate || 'NA'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.labelFixed}>
                  Underground Storage Area (in Sq. Ft.):
                </Text>
                <Text style={styles.value}>
                  {safData?.underGroundArea || 'NA'}
                </Text>
              </View>
            </>
          )}

          <View style={styles.row}>
            <Text style={styles.labelFixed}>
              Rainwater Harvesting Provision?
            </Text>
            <Text style={styles.value}>
              {safData?.isWaterHarvesting ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {transDtls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Payment Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Transaction No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Payment Mode
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Date
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    From Qtr / Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Upto Qtr / Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Amount
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    View
                  </Text>
                </View>

                {/* Table Body */}
                {transDtls.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item?.tranNo ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item?.paymentMode ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.tranDate
                        ? new Date(item.tranDate).toLocaleDateString('en-GB')
                        : 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.fromQtr ?? 'NA'} / {item?.fromFyear ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.uptoQtr ?? 'NA'} / {item?.uptoFyear ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.payableAmt ?? 'NA'}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleViewReceipt111(item.id)}
                    >
                      <Text style={[styles.tableCell, { color: 'blue' }]}>
                        View
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {Array.isArray(memoDtls) && memoDtls.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Memo Details</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Memo No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Memo Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Holding No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Quarter
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Financial Year
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Quarterly Tax
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Created At
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    User Name
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    User Name
                  </Text>
                </View>

                {/* Table Rows */}
                {memoDtls.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item.memoNo ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item.memoType ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.holdingNo ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>{item.qtr ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>{item.fyear ?? 'NA'}</Text>
                    <Text style={styles.tableCell}>
                      {item.quarterlyTax ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-GB')
                        : 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item.userName ?? 'NA'}
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setVisible(true)}
                    >
                      <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>

                    <PropertyTaxNoticeModal
                      visible={visible}
                      onClose={() => setVisible(false)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {tcVerfivication.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.heading}>Tc Varification</Text>

            <ScrollView horizontal>
              <View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerText]}>SL</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Transaction No
                  </Text>
                  <Text style={[styles.tableCell, styles.headerText]}>
                    Payment Mode
                  </Text>

                  <Text style={[styles.tableCell, styles.headerText]}>
                    View
                  </Text>
                </View>

                {/* Table Body */}
                {tcVerfivication.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>
                      {item?.verifiedBy ?? 'NA'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {item?.towerInstallationDate ?? 'NA'}
                    </Text>

                    <TouchableOpacity onPress={() => handleView(item.id)}>
                      <Text style={{ color: 'blue' }}>View</Text>
                    </TouchableOpacity>

                    {/* TC Verification Modal */}
                    <TCVerificationModal
                      visible={isVisible}
                      onClose={() => setIsVisible(false)}
                      id={selectedData}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity
          onPress={() => documentview(id)}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}> View</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ApplyAssessmentComponentized', {
              id: id,
              isRessessment: true,
              safData: safData,
              ownerList: ownerList,
              taxDetails: taxDetails,
              transDtls: transDtls,
              memoDtls: memoDtls,
              tcVerfivication: tcVerfivication,
              paymentDtls: paymentDtls,
            })
          }
          style={[
            styles.actionBtn,
            safData?.propertyType === 'VACANT LAND' && styles.disabledButton,
          ]}
          disabled={safData?.propertyType === 'VACANT LAND'}
        >
          <Text
            style={[
              styles.actionBtnText,
              safData?.propertyType === 'VACANT LAND' &&
                styles.disabledButtonText,
            ]}
          >
            📋 Ressessment{' '}
            {safData?.propertyType === 'VACANT LAND'
              ? '(Not Available for Vacant Land)'
              : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ApplyAssessmentComponentized', {
              id: id,
              isMutation: true,
              safData: safData,
              ownerList: ownerList,
              taxDetails: taxDetails,
              transDtls: transDtls,
              memoDtls: memoDtls,
              tcVerfivication: tcVerfivication,
              paymentDtls: paymentDtls,
            })
          }
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}> Mutation</Text>
        </TouchableOpacity>
        {/* {safData?.paymentStatus == 0 && (
          <TouchableOpacity
            onPress={() => {
              setShowPayNow(false);
              setViewDemandVisible(true);
              viewdemand(id);
            }}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>👁️ View Demand</Text>
          </TouchableOpacity>
        )} */}
        <TouchableOpacity
          onPress={() => {
            setShowPayNow(false);
            setViewDemandVisible(true);
            viewdemand(id);
          }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}>View Demand</Text>
        </TouchableOpacity>
        {/* 
        {safData?.paymentStatus == 0 && (
          <TouchableOpacity
            onPress={() => {
              setShowPayNow(true); // ✅ Show Pay Now
              setViewDemandVisible(true);
              viewdemand(id);
            }}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>🔄 Proceed Payment</Text>
          </TouchableOpacity>
        )} */}
        <TouchableOpacity
          onPress={() => {
            setShowPayNow(true); // ✅ Show Pay Now
            setViewDemandVisible(true);
            viewdemand(id);
          }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}>Proceed Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsOnlinePaymentModelOpen(true); 
          }}
          style={[styles.actionBtn,{backgroundColor: "red"}]}
        >
          <Text style={styles.actionBtnText}>Online Payment</Text>
        </TouchableOpacity>
      </View>
      <PayNowModal
        visible={payNowModalVisible}
        onClose={() => setPayNowModalVisible(false)}
        paymentTypeData={paymentTypeData}
        paymentModeData={paymentModeData}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        refNo={refNo}
        setRefNo={setRefNo}
        chequeDate={chequeDate}
        setChequeDate={setChequeDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        bankName={bankName}
        setBankName={setBankName}
        branchName={branchName}
        setBranchName={setBranchName}
        amount={amount}
        setAmount={setAmount}
        onProceed={async () => {
          if (!paymentType || !paymentMode) {
            Alert.alert('Validation Error', 'Please fill all required fields');
            return;
          }
          if (paymentMode !== 'Cash' && (!refNo || !bankName || !branchName)) {
            Alert.alert('Validation Error', 'Please fill all payment details');
            return;
          }
          setPayNowModalVisible(false);
          const paymentResult = await processPayment();
          if (paymentResult.success) {
            setTransactionId(paymentResult.tranId);
            await viewdemand(id);
            setTimeout(() => {
              setPaymentCompleted(true);
              setViewDemandVisible(false);
              setPaymentReceiptVisible(true);
            }, 500);
          }
        }}
      />
      {isOnlinePaymentModelOpen &&(
        <NttDataPaymentModel
          id={id}
          visible={isOnlinePaymentModelOpen}
          setVisible={(value) => setIsOnlinePaymentModelOpen(value)}
          onPaymentSuccess={fetchSafDetails}
        />
      )}

      <ViewDemandModal
        visible={viewDemandVisible}
        onClose={() => setViewDemandVisible(false)}
        demandlist={demandlist}
        maindata={maindata}
        showPayNow={showPayNow}
        onPayNowPress={() => setPayNowModalVisible(true)}
      />

      <PaymentReceiptModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        paymentDtls={paymentDtls}
      />
      <DocumentViewModal
        visible={docModalVisible}
        onClose={() => setDocModalVisible(false)}
        uploadedDocs={uploadedDocs}
        onDocumentPress={doc => {
          const fileExtension = doc.docPath.split('.').pop().toLowerCase();
          if (fileExtension === 'pdf') {
            Alert.alert(
              'PDF Document',
              'PDF files will open in external viewer',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open', onPress: () => Linking.openURL(doc.docPath) },
              ],
            );
          } else {
            setSelectedDoc(doc);
            setSelectedImageUri(doc.docPath);
            setImageLoading(true);
            setImageModalVisible(true);
          }
        }}
      />

      <ImageViewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        selectedImageUri={selectedImageUri}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        visible={paymentReceiptVisible}
        onClose={() => {
          setPaymentReceiptVisible(false);
          setPaymentCompleted(false);
          setTransactionId(null);
          // Reset payment form
          setPaymentType(null);
          setPaymentMode(null);
          setRefNo('');
          setBankName('');
          setBranchName('');
          setChequeDate(null);
        }}
        paymentDtls={{
          tranNo: transactionId ? `TXN-${transactionId}` : 'PMT-' + Date.now(),
          tranDate: new Date().toLocaleDateString('en-GB'),
          paymentMode: paymentMode || 'Online',
          payableAmt: amount,
        }}
      />
    </ScrollView>
  );
};

export default HoldingDetails;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.background,
    backgroundColor: Colors.headignColor,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    width: '100%',
  },
  rowTable: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8, // Added for better spacing
    alignItems: 'flex-start', // Keeps label/value aligned at the top
  },
  labelFixed: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    width: 120, // Keep this fixed
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
    flex: 1, // Change 'width: 30%' to 'flex: 1'
    textAlign: 'right',
    flexWrap: 'wrap', // Ensures text goes to the next line
  },
  headerRow: {
    backgroundColor: Colors.textSecondary,
  },
  cell: {
    minWidth: 70,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: 'center',
    fontSize: 10,
    color: '#333',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  containerdue: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    margin: 12,
    elevation: 4,
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexWrap: 'nowrap',
  },

  tableHeader: {
    backgroundColor: '#f0f0f0',
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

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d2a7e',
    marginBottom: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    fontSize: 30,
  },
  corpName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptType: {
    alignSelf: 'center',
    marginVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 6,
  },
  tableRowModal: {
    flexDirection: 'row',
    padding: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  col: {
    flex: 1,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  qrBox: {
    width: 90,
    height: 90,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 13,
    marginBottom: 2,
  },
  generatedNote: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  docModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docModalContent: {
    backgroundColor: '#fff',
    width: '95%',
    maxHeight: '85%',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  docModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  docTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  docTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  docCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  docCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  docFileLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  docCloseButton: {
    backgroundColor: '#007bff',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  docCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 15,
    marginBottom: 80,
    paddingHorizontal: 5,
  },
  actionBtn: {
    width: 85,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginLeft: 5,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeFullScreenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  fullScreenScrollView: {
    flex: 1,
    width: '100%',
  },
  fullScreenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 100,
  },
});
