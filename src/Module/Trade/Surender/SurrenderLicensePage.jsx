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
import HeaderNavigation from '../../../Components/HeaderNavigation';

import { BASE_URL } from '../../../config';

import { API_ROUTES } from '../../../api/apiRoutes';

const SurrenderLicensePage = ({ navigation, route }) => {
  const { id } = route.params;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [applicationType] = useState('SURRENDER LICENSE');
  const [firmType, setFirmType] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [category, setCategory] = useState('');
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
  const [ownershipTypeOptions, setOwnershipTypeOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [owners, setOwners] = useState([
    {
      ownerName: '',
      guardianName: '',
      mobileNo: '',
      email: '',
    },
  ]);

  const [wardList, setWardList] = useState([]);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [firmTypeOptions, setFirmTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const licenseForOptions = [
    { label: '1year', value: '1' },
    { label: '2year', value: '2' },
    { label: '3year', value: '3' },
    { label: '4year', value: '4' },
    { label: '5year', value: '5' },
    { label: '6year', value: '6' },
    { label: '7year', value: '7' },
    { label: '8year', value: '8' },
  ];
  const [taxData, setTaxData] = useState(null);
  const [fetchedBusinessNames, setFetchedBusinessNames] = useState([]);

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

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
      applicationType: 'SURRENDER',
      firmTypeId: firmType || 1,
      ownershipTypeId: ownershipType || 1,
      wardMstrId: wardNo || 1,
      newWardMstrId: newWardNo || 1,
      firmName: firmName || '',
      firmDescription: businessDescription || '',
      firmEstablishmentDate: formatDate(establishmentDate) || '2020-02-20',
      premisesOwnerName: ownerOfPremises || '',
      areaInSqft: totalArea || '100',
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

    console.log('✅ API Payload:', JSON.stringify(payload, null, 2));

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
          .map(id => {
            const found = categoryOptions.find(opt => opt.value === id);
            return found ? found.label : '';
          })
          .filter(label => label !== ''),
        owners,
        chargeApplied: taxData?.licenseCharge?.toString() || '',
        penalty: taxData?.latePenalty?.toString() || '',
        denialAmount: taxData?.arrearCharge?.toString() || '',
        totalCharge: taxData?.totalCharge?.toString() || '',
      },
    };

    navigation.navigate('ApplyLicenseSummary', { submittedData: summaryData });
  };

  useEffect(() => {
    fetchApplicationData();
    fetchMasterData();
    fetchTradeMaster();
  }, []);

  useEffect(() => {
    if (fetchedBusinessNames.length > 0 && categoryOptions.length > 0) {
      const businessIds = fetchedBusinessNames
        .map(businessName => {
          const found = categoryOptions.find(opt => opt.label === businessName);
          return found ? found.value : null;
        })
        .filter(id => id !== null);

      if (businessIds.length > 0) {
        setNatureOfBusiness(businessIds);
        console.log('Mapped business IDs:', businessIds);
      }
    }
  }, [fetchedBusinessNames, categoryOptions]);

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
        { id }, // 👈 pass ID in body
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data?.status && response.data.data) {
        const data = response.data.data;
        console.log(data, 'all data is fulfilled');

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
        setLicenseFor(data.licenseForYears || '');

        if (data.natureOfBusiness) {
          const businessArray = data.natureOfBusiness
            .split(',')
            .map(item => item.trim());
          console.log(businessArray, 'nature of business array');
          setFetchedBusinessNames(businessArray);
        }
        if (data.owners && Array.isArray(data.owners)) {
          setOwners(
            data.owners.map(owner => ({
              ownerName: owner.ownerName || '',
              guardianName: owner.guardianName || '',
              mobileNo: owner.mobileNo?.toString() || '', // ensure string for input
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
        setWardOptions(
          data.wardList.map(w => ({ label: w.wardNo, value: w.id })),
        );
        setCategoryOptions(
          data.itemType.map(c => ({
            label: c.tradeItem,
            value: c.id,
          })),
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
        console.log('Wards:', wards);
        setWardList(wards);

        const wardOptions = wards.map(ward => ({
          label: ward.wardNo,
          value: ward.id,
        }));
        setWardDropdownOptions(wardOptions);

        fetchNewWardList(wards, headers);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const fetchNewWardList = async (wardList, headers) => {
    for (const item of wardList) {
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
  };

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

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Renew License</Text>

        <View style={styles.sectionCard}>
          <FormField
            label="Application Type"
            value={'SURRENDER'}
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
            placeholder={isLoading ? 'Loading...' : 'Select License Type'}
          />

          <FormField
            label="Charge Applied"
            value={taxData?.licenseCharge?.toString() || ''}
            onChange={setChargeApplied}
            editable={false}
          />

          <FormField
            label="Penalty"
            value={taxData?.latePenalty?.toString() || ''}
            onChange={setPenalty}
            editable={false}
          />

          <FormField
            label="Denial Amount"
            value={taxData?.arrearCharge?.toString() || ''}
            onChange={setDenialAmount}
            editable={false}
          />

          <FormField
            label="Total Charge"
            value={taxData?.totalCharge?.toString() || ''}
            onChange={setTotalCharge}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default SurrenderLicensePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(5),
  },
  pageTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: Colors.primary,
  },
  sectionCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },
  headingBox: {
    marginBottom: responsiveHeight(1.5),
  },
  headingText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
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
});
