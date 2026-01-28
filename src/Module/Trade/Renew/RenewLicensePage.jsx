import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import FormField from '../../../Components/FormField';

import Colors from '../../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../../Components/CustomAlert';
import { BASE_URL } from '../../../config';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { API_ROUTES } from '../../../api/apiRoutes';

const RenewLicensePage = ({ navigation, route }) => {
  const { id } = route.params;

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Form fields
  const [applicationType, setApplicationType] = useState('');
  const [firmType, setFirmType] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [holdingNo, setHoldingNo] = useState('');
  const [firmName, setFirmName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [establishmentDate, setEstablishmentDate] = useState(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [newWardNo, setNewWardNo] = useState('');
  const [ownerOfPremises, setOwnerOfPremises] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [natureOfBusiness, setNatureOfBusiness] = useState([]);
  const [licenseFor, setLicenseFor] = useState('');
  const [chargeApplied, setChargeApplied] = useState('');
  const [penalty, setPenalty] = useState('');
  const [denialAmount, setDenialAmount] = useState('');
  const [totalCharge, setTotalCharge] = useState('');

  // Options / Master data
  const [ownershipTypeOptions, setOwnershipTypeOptions] = useState([]);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [firmTypeOptions, setFirmTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [owners, setOwners] = useState([
    { ownerName: '', guardianName: '', mobileNo: '', email: '' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [taxData, setTaxData] = useState(null);
  const [fetchedBusinessNames, setFetchedBusinessNames] = useState([]);

  const licenseForOptions = [
    { label: '1 year', value: '1' },
    { label: '2 year', value: '2' },
    { label: '3 year', value: '3' },
    { label: '4 year', value: '4' },
    { label: '5 year', value: '5' },
    { label: '6 year', value: '6' },
    { label: '7 year', value: '7' },
    { label: '8 year', value: '8' },
  ];

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // ----------------------------- FETCH APPLICATION DATA -----------------------------
  const fetchApplicationData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (!token) {
        Alert.alert('Auth error', 'No token found. Please login.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/trade/get-dtl`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.status && response.data.data) {
        const data = response.data.data;
        console.log('data', data);
        setFirmType(data.firmTypeId || '');
        setOwnershipType(data.ownershipTypeId || '');
        setWardNo(data.wardMstrId || '');
        setNewWardNo(data.newWardMstrId || '');
        setFirmName(data.firmName || '');
        setBusinessDescription(data.firmDescription || '');
        setEstablishmentDate(
          data.firmEstablishmentDate
            ? new Date(data.firmEstablishmentDate)
            : null,
        );
        setOwnerOfPremises(data.premisesOwnerName || '');
        setTotalArea(data.areaInSqft || '');
        setBusinessAddress(data.address || '');
        setPinCode(data.pinCode || '');
        setHoldingNo(data.holdingNo || '');
        setApplicationType(data.applicationType);
        // ✅ License For (convert number to string for dropdown)
        setLicenseFor(
          data.licenseForYears ? data.licenseForYears.toString() : '1',
        );

        if (data.natureOfBusiness) {
          const businessArray = data.natureOfBusiness
            .split(',')
            .map(item => item.trim());
          setFetchedBusinessNames(businessArray);
        }

        if (data.owners && Array.isArray(data.owners)) {
          setOwners(
            data.owners.map(owner => ({
              ownerName: owner.ownerName || '',
              guardianName: owner.guardianName || '',
              mobileNo: owner.mobileNo?.toString() || '',
              email: owner.email || '',
            })),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      showAlert('Failed to load application data');
    }
  };

  // ----------------------------- FETCH MASTER DATA -----------------------------
  const fetchMasterData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-saf-master-data`,
        {},
        { headers },
      );

      if (response?.data?.status) {
        const wards = response.data.data.wardList || [];
        const wardOptions = wards.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setWardDropdownOptions(wardOptions);

        // Fetch new ward options
        for (const item of wards) {
          try {
            const responseWard = await axios.post(
              `${BASE_URL}/api/property/get-new-ward-by-old`,
              { oldWardId: item.id },
              { headers },
            );
            if (responseWard?.data?.status) {
              const options = responseWard.data.data.map(ward => ({
                label: ward.wardNo,
                value: ward.id,
              }));
              setNewWardOptions(prev => [...prev, ...options]);
            }
          } catch (error) {
            console.error(`Error for ward ID ${item.id}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  // ----------------------------- FETCH TRADE MASTER -----------------------------
  const fetchTradeMaster = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const res = await axios.post(
        `${BASE_URL}/api/trade/get-trade-master-data`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res?.data?.status) {
        const data = res.data.data;
        setFirmTypeOptions(
          data.firmType.map(f => ({ label: f.firmType, value: f.id })),
        );
        setOwnershipTypeOptions(
          data.ownershipType.map(o => ({
            label: o.ownershipType,
            value: o.id,
          })),
        );
        setCategoryOptions(
          data.itemType.map(c => ({ label: c.tradeItem, value: c.id })),
        );
      } else {
        showAlert('Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching trade master:', err);
      showAlert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------- HANDLE WARD CHANGE -----------------------------
  const handleWardChange = async selectedWardId => {
    setWardNo(selectedWardId);
    setNewWardNo('');

    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/get-new-ward-by-old`,
        { oldWardId: selectedWardId },
        { headers },
      );

      if (response?.data?.status) {
        const options = response.data.data.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setNewWardOptions(options);
      }
    } catch (error) {
      console.error('Error fetching new wards for selected ward:', error);
    }
  };

  // ----------------------------- FETCH TAX DATA -----------------------------
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const body = {
          applicationType: 'NEW LICENSE',
          firmEstablishmentDate: '2020-02-20',
          areaInSqft: '100',
          licenseForYears: licenseFor || '',
          isTobaccoLicense: 0,
        };

        const response = await axios.post(API_ROUTES.TRADE_REVIEW_TAX, body, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json',
          },
        });

        setTaxData(response.data.data);
      } catch (error) {
        console.error(
          '❌ Error fetching Tax Review:',
          error.response?.data || error,
        );
        setTaxData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxData();
  }, [licenseFor]);

  // ----------------------------- MAP NATURE OF BUSINESS -----------------------------
  useEffect(() => {
    if (fetchedBusinessNames.length > 0 && categoryOptions.length > 0) {
      const businessIds = fetchedBusinessNames
        .map(businessName => {
          const found = categoryOptions.find(opt => opt.label === businessName);
          return found ? found.value : null;
        })
        .filter(id => id !== null);

      if (businessIds.length > 0) setNatureOfBusiness(businessIds);
    }
  }, [fetchedBusinessNames, categoryOptions]);

  // ----------------------------- INITIAL DATA FETCH -----------------------------
  useEffect(() => {
    fetchApplicationData();
    fetchMasterData();
    fetchTradeMaster();
  }, []);

  // ----------------------------- HANDLE SUBMIT -----------------------------
  const handleSubmit = async () => {
    const formatDate = date => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const payload = {
      priviesLicenseId: id,
      applicationType: 'RENEWAL',
      firmTypeId: firmType || 1,
      ownershipTypeId: ownershipType || 1,
      wardMstrId: wardNo || 1,
      newWardMstrId: newWardNo || 1,
      firmName: firmName || '',
      firmDescription: businessDescription || '',
      firmEstablishmentDate: formatDate(establishmentDate),
      premisesOwnerName: ownerOfPremises || '',
      areaInSqft: totalArea,
      address: businessAddress || '',
      pinCode: pinCode || '',
      licenseForYears: licenseFor || '1',
      isTobaccoLicense: 0,
      holdingNo: holdingNo || '',
      natureOfBusiness: natureOfBusiness.map(id => ({
        tradeItemTypeId: String(id),
      })),
      ownerDtl: owners.map(owner => ({
        ownerName: owner.ownerName || '',
        guardianName: owner.guardianName || '',
        mobileNo: owner.mobileNo || '',
      })),
    };

    const summaryData = {
      apiPayload: payload,
      displayData: {
        applicationType,
        firmType:
          firmTypeOptions.find(opt => opt.value === firmType)?.label || '',
        ownershipType:
          ownershipTypeOptions.find(opt => opt.value === ownershipType)
            ?.label || '',
        wardNo:
          wardDropdownOptions.find(opt => opt.value === wardNo)?.label || '',
        newWardNo:
          newWardOptions.find(opt => opt.value === newWardNo)?.label || '',
        firmName,
        businessDescription,
        establishmentDate,
        businessAddress,
        pinCode,
        totalArea,
        licenseFor:
          licenseForOptions.find(opt => opt.value === licenseFor)?.label || '',
        holdingNo,
        ownerOfPremises,
        natureOfBusiness: natureOfBusiness
          .map(id => categoryOptions.find(opt => opt.value === id)?.label || '')
          .filter(label => label !== ''),
        owners,
        chargeApplied: taxData?.licenseCharge?.toString() || '',
        penalty: taxData?.latePenalty?.toString() || '',
        denialAmount: taxData?.arrearCharge?.toString() || '',
        totalCharge: taxData?.totalCharge?.toString() || '',
      },
    };
    console.log('Payment Type', payload);
    navigation.navigate('ApplyLicenseSummary', { submittedData: summaryData });
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Renew License</Text>

        {/* FIRM / BASIC DETAILS */}
        <View style={styles.sectionCard}>
          <FormField
            label="Application Type"
            value={'RENEWAL'}
            editable={false}
          />
          <FormField
            label="Firm Type"
            type="dropdown"
            value={firmType}
            onChange={setFirmType}
            options={firmTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Firm Type'}
          />
          <FormField
            label="Ownership Type"
            type="dropdown"
            value={ownershipType}
            onChange={setOwnershipType}
            options={ownershipTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Ownership Type'}
          />
        </View>

        {/* FIRM DETAILS */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>FIRM DETAILS</Text>
          </View>
          <FormField
            label="Ward No"
            type="dropdown"
            value={wardNo}
            onChange={handleWardChange}
            options={wardDropdownOptions}
          />
          <FormField
            label="Holding No"
            value={holdingNo}
            onChange={setHoldingNo}
          />
          <FormField
            label="Firm Name"
            value={firmName}
            onChange={setFirmName}
          />
          <FormField
            label="Business Description"
            value={businessDescription}
            onChange={setBusinessDescription}
          />
          <FormField
            label="Total Area (in Sq. Ft)"
            value={totalArea}
            onChange={setTotalArea}
          />
          <FormField
            label="Firm Establishment Date"
            type="date"
            value={establishmentDate}
            onChange={setEstablishmentDate}
          />
          <FormField
            label="Business Address"
            value={businessAddress}
            onChange={setBusinessAddress}
          />
          <FormField label="Landmark" value={landmark} onChange={setLandmark} />
          <FormField label="Pin Code" value={pinCode} onChange={setPinCode} />
          <FormField
            label="New Ward No"
            type="dropdown"
            value={newWardNo}
            onChange={setNewWardNo}
            options={newWardOptions}
          />
          <FormField
            label="Owner of Business Premises"
            value={ownerOfPremises}
            onChange={setOwnerOfPremises}
            placeholder="Enter premises owner name"
          />
        </View>

        {/* OWNER DETAILS */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>OWNER DETAILS</Text>
          </View>
          {owners.map((owner, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <FormField
                label={`Owner Name ${owners.length > 1 ? index + 1 : ''}`}
                value={owner.ownerName}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].ownerName = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Guardian Name"
                value={owner.guardianName}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].guardianName = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Mobile No"
                value={owner.mobileNo}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].mobileNo = value;
                  setOwners(updated);
                }}
              />
              <FormField
                label="Email ID"
                value={owner.email}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].email = value;
                  setOwners(updated);
                }}
              />
              {owners.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const updated = owners.filter((_, i) => i !== index);
                    setOwners(updated);
                  }}
                >
                  <Text style={styles.removeButtonText}>Remove Owner</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setOwners([
                ...owners,
                { ownerName: '', guardianName: '', mobileNo: '', email: '' },
              ]);
            }}
          >
            <Text style={styles.addButtonText}>+ Add Owner</Text>
          </TouchableOpacity>
        </View>

        {/* BUSINESS DETAILS */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>BUSINESS DETAILS</Text>
          </View>
          <FormField
            label="Nature of Business"
            type="multiselect"
            value={natureOfBusiness}
            onChange={setNatureOfBusiness}
            options={categoryOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Nature of Business'}
          />
        </View>

        {/* CHARGES */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>CHARGES</Text>
          </View>
          <FormField
            label="License For"
            type="dropdown"
            value={licenseFor}
            onChange={setLicenseFor}
            options={licenseForOptions}
          />
          <FormField
            label="License Charge"
            value={taxData?.licenseCharge?.toString() || ''}
            editable={false}
          />
          <FormField
            label="Penalty"
            value={taxData?.latePenalty?.toString() || ''}
            editable={false}
          />
          <FormField
            label="Arrear / Denial Amount"
            value={taxData?.arrearCharge?.toString() || ''}
            editable={false}
          />
          <FormField
            label="Total Charge"
            value={taxData?.totalCharge?.toString() || ''}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Proceed to Summary</Text>
        </TouchableOpacity>
      </ScrollView>

      {alertVisible && (
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </View>
  );
};

export default RenewLicensePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: Colors.white,
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginVertical: responsiveHeight(2),
    color: Colors.primary,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.white,
    elevation: 3,
  },
  headingBox: {
    backgroundColor: Colors.lightGray,
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  headingText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  addButton: {
    alignItems: 'center',
    marginVertical: responsiveHeight(1),
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  removeButton: {
    alignItems: 'center',
    marginVertical: responsiveHeight(1),
  },
  removeButtonText: {
    color: Colors.red,
    fontWeight: 'bold',
  },
});
