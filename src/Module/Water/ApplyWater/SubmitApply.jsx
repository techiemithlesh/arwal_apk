import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import Colors from '../../Constants/Colors';
import { WATER_API_ROUTES } from '../../../api/apiRoutes';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';

const SubmitApply = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [copiedWaterNo, setCopiedWaterNo] = useState('');
  const [copiedLicenseNo, setCopiedLicenseNo] = useState('');
  const [idApp, setIdApp] = useState('');

  const navigation = useNavigation();
  const { formData, masterData, resetForm } = route.params;
  console.log('Form Data:', formData);
  // const {}
  const handleOk = () => {
    setModalVisible(false);

    // Reset the form fields after successful submission
    if (resetForm) {
      resetForm();
    }

    navigation.navigate('WaterDetails', { id: idApp }); // replace with your screen
  };
  // Mapping field keys to their label property
  const labelKeyMap = {
    constructionType: 'constructionType',
    floorType: 'floorName',
    occupancyType: 'occupancyName',
    ownershipType: 'ownershipType',
    propertyType: 'propertyType',
    roadType: 'roadType',
    transferMode: 'transferMode',
    usageType: 'usageType',
    wardList: 'wardNo',
  };

  // Utility to get label from master data
  const getLabel = (options = [], value, masterKey) => {
    if (!options || !value) return 'N/A';
    const valueKey = 'id';
    const labelKey = labelKeyMap[masterKey] || 'name';
    const item = options.find(opt => opt[valueKey] == value);
    return item ? item[labelKey] : 'N/A';
  };

  // Prepare labels
  const propertyLabel = getLabel(
    masterData?.propertyType,
    formData.propertyType,
    'propertyType',
  );
  const ownershipLabel = getLabel(
    masterData?.ownershipType,
    formData.ownerType,
    'ownershipType',
  );
  const wardLabel = getLabel(masterData?.wardList, formData.wardNo, 'wardList');

  const selectedNewWard = formData.newWardOptions?.find(
    opt => opt.value === formData.newWardNo,
  );
  const newWardLabel = selectedNewWard ? selectedNewWard.label : 'N/A';

  const RowItem = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const handleSubmit = async () => {
    const payload = {
      category: formData.category || '',
      pipelineTypeId: parseInt(formData.pipelineTypeId) || 1,
      connectionTypeId: parseInt(formData.connectionTypeId) || 1,
      connectionThroughId: parseInt(formData.connectionThroughId) || 1,
      propertyTypeId: parseInt(formData.propertyTypeId) || 1,
      ownershipTypeId: parseInt(formData.ownershipTypeId) || 1,
      wardMstrId: parseInt(formData.wardMstrId) || 1,
      // newWardMstrId: parseInt(formData.newWardMstrId) || 1,
      areaSqft: formData.areaSqft || '',
      address: formData.address || '',
      landmark: formData.landmark || '',
      pinCode: formData.pinCode || '',
      holdingNo: formData.holdingNo || '',
      safNo: formData.safNo || '',
      ownerDtl: formData.ownerDtl?.map((applicant, index) => ({
        id: applicant.id || index + 1,
        ownerName: applicant.ownerName || '',
        guardianName: applicant.guardianName || '',
        dob: applicant.dob || '',
        mobileNo: applicant.mobileNo || '',
        email: applicant.email || '',
      })),
    };

    // Add safNo if connectionThrough = 2
    if (formData.connectionThroughId?.toString() === '2') {
      payload.safNo = formData.safNo;
    }

    console.log('Submitting payload:', payload);

    try {
      const token = await getToken();

      const response = await axios.post(
        WATER_API_ROUTES.APPLY_CONNECTION,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response:', response);
      const applicationId = response.data.data?.applicationId;
      setIdApp(applicationId);
      console.log('applicationId:', applicationId);

      if (response.data.status) {
        const licenseNo = response.data.data?.applicationNo; // License Number from API
        // License Number from API

        // alert(`✅ Application Submitted!\nLicense No: ${licenseNo}`);

        if (licenseNo) {
          Clipboard.setString(licenseNo); // copy License No
          setCopiedLicenseNo(licenseNo); // ✅ save License No in state
          setTimeout(() => {
            setModalVisible(true); // show confirmation modal
          }, 2000);
        }
      } else {
        Alert.alert(
          'Authentication Failed',
          'Please login again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('WaterDetails', { id: idApp }),
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.error('Full error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.';

      Alert.alert(
        'Submission Failed',
        message,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SearchWater'),
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Submitted Data</Text>

        {/* Connection Details */}
        <View style={styles.card}>
          <Text style={styles.heading}>Connection Details</Text>
          <RowItem
            label="Type of Connection"
            value={formData.connectionTypeId || 'N/A'}
          />
          <RowItem
            label="Connection Through"
            value={formData.connectionThroughId || 'N/A'}
          />
          <RowItem label="Property Type" value={formData.propertyTypeId} />
          <RowItem label="Owner Type" value={formData.ownershipTypeId} />
        </View>

        {/* Property Details */}
        <View style={styles.card}>
          <Text style={styles.heading}>Property Details</Text>
          <RowItem label="Ward No" value={formData.wardMstrId} />
          <RowItem label="New Ward No" value={formData.newWardMstrId} />
          <RowItem label="Total Area" value={formData.areaSqft || 'N/A'} />
          <RowItem label="Landmark" value={formData.landmark || 'N/A'} />
          <RowItem label="Pin" value={formData.pinCode || 'N/A'} />
          <RowItem label="Address" value={formData.address || 'N/A'} />
        </View>

        {/* Applicants */}
        <View style={styles.card}>
          <Text style={styles.heading}>Applicants</Text>
          {formData.ownerDtl?.map((a, index) => (
            <View key={index} style={styles.subCard}>
              <RowItem label="Owner Name" value={a.ownerName || 'N/A'} />
              <RowItem label="Guardian Name" value={a.guardianName || 'N/A'} />
              <RowItem label="Mobile No" value={a.mobileNo || 'N/A'} />
              <RowItem label="Email" value={a.email || 'N/A'} />
              <RowItem label="DOB" value={a.dob || 'N/A'} />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>FINAL SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Copied!</Text>
            <Text style={styles.modalText}>
              Copied Application No: {copiedLicenseNo}
            </Text>
            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    padding: 8,
    color: '#fff',
    backgroundColor: Colors.primary,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 15, fontWeight: '500', color: '#444' },
  value: { fontSize: 15, color: '#555', maxWidth: '60%', textAlign: 'right' },
  subCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fdfdfd',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15, // rounded corners
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Android shadow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#555',
  },
  okButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25, // pill-shaped button
    elevation: 2,
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SubmitApply;
