import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { API_ROUTES } from '../../api/apiRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

const ApplyLicenseSummary = ({ route, navigation }) => {
  const { submittedData } = route.params || {};

  const data = submittedData?.displayData || submittedData;
  const apiPayload = submittedData?.apiPayload || null;
  const [modalVisible, setModalVisible] = useState(false);
  const [copiedLicenseNo, setCopiedLicenseNo] = useState('');
  const [licenseId, setLicenseId] = useState(null);

  const formatDate = date => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-GB');
  };

  const renderSection = (title, sectionData) => (
    <View style={styles.sectionCard}>
      <View style={styles.headingBox}>
        <Text style={styles.headingText}>{title}</Text>
      </View>
      {Object.entries(sectionData).map(([key, value]) => (
        <View key={key} style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>{key}:</Text>
          <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
        </View>
      ))}
    </View>
  );

  // LICENSE DETAILS
  const getLicenseData = () => {
    if (!data) return {};
    return {
      'Application Type': data.applicationType,
      'Firm Type': data.firmType,
      'Type of Ownership': data.ownershipType,
      Category: data.category,
    };
  };

  // FIRM DETAILS
  const getFirmData = () => {
    if (!data) return {};
    return {
      'Ward No': data.wardNo,
      'Holding No': data.holdingNo,
      'Firm Name': data.firmName,
      'Total Area (Sq. Ft)': data.totalArea,
      'Establishment Date': formatDate(data.establishmentDate),
      'Business Address': data.businessAddress,
      Landmark: data.landmark,
      'Pin Code': data.pinCode,
      'New Ward No': data.newWardNo,
      'Owner of Premises': data.ownerOfPremises,
      'Business Description': data.businessDescription,
    };
  };

  // OWNER DETAILS (supports multiple owners)
  const getOwnerData = () => {
    if (!data || !data.owners || data.owners.length === 0) return [];
    return data.owners.map((owner, index) => ({
      'Owner Name': owner.ownerName,
      'Guardian Name': owner.guardianName,
      'Mobile No': owner.mobileNo,
      'Email ID': owner.email,
      index: index + 1, // for labeling OWNER 1, OWNER 2, etc.
    }));
  };

  // NATURE OF BUSINESS
  const getBusinessData = () => {
    if (!data) return [];
    return Array.isArray(data.natureOfBusiness)
      ? data.natureOfBusiness
      : data.natureOfBusiness
      ? [data.natureOfBusiness]
      : [];
  };

  // LICENSE CHARGES
  const getLicenseDetails = () => {
    if (!data) return {};
    return {
      'License For': data.licenseFor,
      'Charge Applied': data.chargeApplied,
      Penalty: data.penalty,
      'Denial Amount / Arrears': data.denialAmount,
      'Total Charge': data.totalCharge,
    };
  };
  const handleOk = () => {
    setModalVisible(false);
    navigation.navigate('TradeDetails', { id: licenseId }); // replace with your screen
  };

  const handleSubmit = async () => {
    const payload =
      apiPayload ||
      (() => {
        if (!submittedData) {
          alert('❌ No data available to submit!');
          return null;
        }

        const formatDateForAPI = date => {
          if (!date) return null;
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const serializedSubmittedData = {
          ...submittedData,
          establishmentDate: formatDateForAPI(submittedData.establishmentDate),
        };

        return {
          applicationType: serializedSubmittedData.applicationType,
          firmTypeId: serializedSubmittedData.firmTypeId || 1,
          ownershipTypeId: serializedSubmittedData.ownershipTypeId || 1,
          wardMstrId: serializedSubmittedData.wardMstrId || 1,
          firmName: serializedSubmittedData.firmName,
          firmDescription: serializedSubmittedData.businessDescription,
          firmEstablishmentDate: serializedSubmittedData.establishmentDate,
          premisesOwnerName: serializedSubmittedData.ownerOfPremises,
          areaInSqft: serializedSubmittedData.totalArea,
          address: serializedSubmittedData.businessAddress,
          pinCode: serializedSubmittedData.pinCode,
          licenseForYears: serializedSubmittedData.licenseFor?.charAt(0) || '1',
          isTobaccoLicense: serializedSubmittedData.isTobaccoLicense || 0,
          holdingNo: serializedSubmittedData.holdingNo || '',
          natureOfBusiness: Array.isArray(
            serializedSubmittedData.natureOfBusinessIds,
          )
            ? serializedSubmittedData.natureOfBusinessIds.map(id => ({
                tradeItemTypeId: String(id),
              }))
            : [],
          ownerDtl:
            serializedSubmittedData.owners?.map(o => ({
              ownerName: o.ownerName,
              guardianName: o.guardianName,
              mobileNo: o.mobileNo,
            })) || [],
        };
      })();

    if (!payload) return;

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
      };

      const response = await axios.post(API_ROUTES.TRADE_APPLY, payload, {
        headers,
      });
      console.log('API Response:', response);

      if (response.data.errors) {
        console.log('Validation Errors:', response.data.errors);
      }

      if (response.data.status) {
        const safNo = response.data.data?.applicationNo; // or safNo if API returns that key

        const licenseNo = response.data.data?.applicationNo; // License Number from API
        const licenseId = response.data.data?.licenseId;
        setLicenseId(licenseId);

        if (licenseNo) {
          Clipboard.setString(licenseNo); // copy License No
          setCopiedLicenseNo(licenseNo); // ✅ save License No in state
          setTimeout(() => {
            setModalVisible(true); // show confirmation modal
          }, 2000);
        }
        // Optional navigation if needed
        // navigation.navigate('Search');
      } else {
        // Handle backend validation or message errors
        let errorMessage = response.data.message || 'Submission failed';
        if (response.data.errors) {
          const errorDetails = Object.entries(response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          errorMessage += '\n\nDetails:\n' + errorDetails;
        }

        alert('❌ ' + errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Error submitting application:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>License Application Summary</Text>

      {data ? (
        <>
          {renderSection('LICENSE DETAILS', getLicenseData())}
          {renderSection('FIRM DETAILS', getFirmData())}

          {/* OWNER DETAILS (multiple owners) */}
          {getOwnerData().map((owner, idx) => (
            <View key={idx} style={styles.sectionCard}>
              <View style={styles.headingBox}>
                <Text style={styles.headingText}>OWNER {owner.index}</Text>
              </View>
              {Object.entries(owner).map(([key, value]) => {
                if (key === 'index') return null;
                return (
                  <View key={key} style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>{key}:</Text>
                    <Text style={styles.fieldValue}>
                      {value || 'Not specified'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* NATURE OF BUSINESS */}
          <View style={styles.sectionCard}>
            <View style={styles.headingBox}>
              <Text style={styles.headingText}>NATURE OF BUSINESS</Text>
            </View>
            <View style={styles.tagContainer}>
              {getBusinessData().map((item, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {renderSection('LICENSE REQUIRED FOR THE YEAR', getLicenseDetails())}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Form</Text>
        </TouchableOpacity>
      </View>
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
              copiedLicenseNo No: {copiedLicenseNo}
            </Text>
            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: responsiveWidth(4),
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: Colors.primaryText || '#000',
    textAlign: 'center',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headingBox: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(1),
    marginBottom: responsiveHeight(1.5),
  },
  headingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  fieldRow: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(0.8),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
  fieldValue: {
    flex: 2,
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  noDataText: {
    fontSize: responsiveFontSize(2.2),
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(3),
    gap: responsiveWidth(2),
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e6f7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  tagText: {
    color: '#0050b3',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
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

export default ApplyLicenseSummary;
