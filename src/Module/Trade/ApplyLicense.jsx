// All necessary imports
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import FormField from '../../Components/FormField';
import Colors from '../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../Components/CustomAlert';
import { BASE_URL } from '../../config';
import HeaderNavigation from '../../Components/HeaderNavigation';
import { API_ROUTES } from '../../api/apiRoutes';
import { showToast } from '../../utils/toast';

const ApplyLicense = ({ navigation }) => {
  const [currentCharge, setCurrentCharge] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [applicationType, setApplicationType] = useState('NEW APPLICATION');
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

  // Error states for all fields
  const [errors, setErrors] = useState({
    firmType: '',
    ownershipType: '',
    wardNo: '',
    holdingNo: '',
    firmName: '',
    totalArea: '',
    establishmentDate: '',
    businessAddress: '',
    pinCode: '',
    ownerOfPremises: '',
    businessDescription: '',
    natureOfBusiness: '',
    licenseFor: '',
    owners: [
      {
        ownerName: '',
        guardianName: '',
        mobileNo: '',
        email: '',
      },
    ],
  });

  const [paymentMode, setPaymentMode] = useState('');
  const [wardList, setWardList] = useState([]);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [firmTypeOptions, setFirmTypeOptions] = useState([]);
  const paymentModeOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Demand Draft', value: 'demand_draft' },
    { label: 'Cheque', value: 'cheque' },
  ];
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
  const [chequeDate, setChequeDate] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [taxData, setTaxData] = useState(null);

  const showAlert = message => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Clear error for a specific field
  const clearError = (field, index = null) => {
    if (field === 'owners' && index !== null) {
      setErrors(prev => ({
        ...prev,
        owners: prev.owners.map((owner, i) =>
          i === index
            ? { ownerName: '', guardianName: '', mobileNo: '', email: '' }
            : owner,
        ),
      }));
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      firmType: '',
      ownershipType: '',
      wardNo: '',
      holdingNo: '',
      firmName: '',
      totalArea: '',
      establishmentDate: '',
      businessAddress: '',
      pinCode: '',
      ownerOfPremises: '',
      businessDescription: '',
      natureOfBusiness: '',
      licenseFor: '',
      owners: owners.map(() => ({
        ownerName: '',
        guardianName: '',
        mobileNo: '',
        email: '',
      })),
    };

    let isValid = true;

    // Firm Type validation
    if (!firmType) {
      newErrors.firmType = 'Firm Type is required';
      isValid = false;
    }

    // Ownership Type validation
    if (!ownershipType) {
      newErrors.ownershipType = 'Ownership Type is required';
      isValid = false;
    }

    // Ward No validation
    if (!wardNo) {
      newErrors.wardNo = 'Ward No is required';
      isValid = false;
    }

    // Holding No validation - mandatory only if license for > 1 year
    if (licenseFor && parseInt(licenseFor) > 1 && !holdingNo) {
      newErrors.holdingNo =
        'Holding No is required for license period > 1 year';
      isValid = false;
    }

    // Firm Name validation
    if (!firmName || firmName.trim() === '') {
      newErrors.firmName = 'Firm Name is required';
      isValid = false;
    }

    // Total Area validation
    if (!totalArea || totalArea.trim() === '') {
      newErrors.totalArea = 'Total Area is required';
      isValid = false;
    } else if (isNaN(totalArea) || parseFloat(totalArea) <= 0) {
      newErrors.totalArea = 'Total Area must be a valid number';
      isValid = false;
    }

    // Establishment Date validation
    if (!establishmentDate) {
      newErrors.establishmentDate = 'Establishment Date is required';
      isValid = false;
    }

    // Business Address validation
    if (!businessAddress || businessAddress.trim() === '') {
      newErrors.businessAddress = 'Business Address is required';
      isValid = false;
    }

    // Pin Code validation
    if (!pinCode || pinCode.trim() === '') {
      newErrors.pinCode = 'Pin Code is required';
      isValid = false;
    } else if (!/^\d{6}$/.test(pinCode)) {
      newErrors.pinCode = 'Pin Code must be 6 digits';
      isValid = false;
    }

    // Owner of Premises validation
    if (!ownerOfPremises || ownerOfPremises.trim() === '') {
      newErrors.ownerOfPremises = 'Owner of Business Premises is required';
      isValid = false;
    }

    // Business Description validation
    if (!businessDescription || businessDescription.trim() === '') {
      newErrors.businessDescription = 'Business Description is required';
      isValid = false;
    }

    // Nature of Business validation
    if (!natureOfBusiness || natureOfBusiness.length === 0) {
      newErrors.natureOfBusiness =
        'Please select at least one Nature of Business';
      isValid = false;
    }

    // License For validation
    if (!licenseFor) {
      newErrors.licenseFor = 'License For is required';
      isValid = false;
    }

    // Owner Details validation
    owners.forEach((owner, index) => {
      // Ensure the index exists in the error object
      newErrors.owners[index] = newErrors.owners[index] || {};

      // Owner Name validation
      if (!owner.ownerName || owner.ownerName.trim() === '') {
        newErrors.owners[index].ownerName = 'Owner Name is required';
        isValid = false;
      } else {
        delete newErrors.owners[index].ownerName;
      }

      // Guardian Name validation
      if (!owner.guardianName || owner.guardianName.trim() === '') {
        newErrors.owners[index].guardianName = 'Guardian Name is required';
        isValid = false;
      } else {
        delete newErrors.owners[index].guardianName;
      }

      // Mobile No validation
      if (!owner.mobileNo || owner.mobileNo.trim() === '') {
        newErrors.owners[index].mobileNo = 'Mobile No is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(owner.mobileNo)) {
        newErrors.owners[index].mobileNo = 'Mobile No must be 10 digits';
        isValid = false;
      } else {
        delete newErrors.owners[index].mobileNo;
      }

      // Email validation (required + valid format)
      // if (!owner.email || owner.email.trim() === '') {
      //   newErrors.owners[index].email = 'Email is required';
      //   isValid = false;
      // } else {
      //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   if (!emailRegex.test(owner.email)) {
      //     newErrors.owners[index].email = 'Invalid email format';
      //     isValid = false;
      //   } else {
      //     delete newErrors.owners[index].email;
      //   }
      // }
    });

    setErrors(newErrors);
    if (!isValid) {
      showToast('error', 'Validation Error', 'Please fill all required fields');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Format establishment date to YYYY-MM-DD
    const formatDate = date => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Build the API payload according to the required format
    const payload = {
      applicationType: 'NEW LICENSE',
      firmTypeId: firmType || 1,
      ownershipTypeId: ownershipType || 1,
      wardMstrId: wardNo || 1,
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

    // Pass both the API payload and display data to summary
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
    fetchMasterData();
    fetchTradeMaster();
  }, []);

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
  }, [licenseFor]); // ✅ Re-fetch whenever licenseFor changes

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
    clearError('wardNo');
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
        <Text style={styles.pageTitle}>Apply License</Text>

        {/* License Info */}
        <View style={styles.sectionCard}>
          <FormField
            label="Application Type"
            value={applicationType}
            editable={false}
          />
          <FormField
            label="Firm Type"
            type="dropdown"
            value={firmType}
            onChange={value => {
              setFirmType(value);
              clearError('firmType');
            }}
            options={firmTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Firm Type'}
            error={errors.firmType}
          />
          <FormField
            label="Ownership Type"
            type="dropdown"
            value={ownershipType}
            onChange={value => {
              setOwnershipType(value);
              clearError('ownershipType');
            }}
            options={ownershipTypeOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Ownership Type'}
            error={errors.ownershipType}
          />
        </View>

        {/* Firm Details */}
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
            error={errors.wardNo}
          />
          {/* <FormField
            label="New Ward No"
            type="dropdown"
            value={newWardNo}
            onChange={value => {
              setNewWardNo(value);
              clearError('newWardNo');
            }}
            options={newWardOptions}
            error={errors.newWardNo}
          /> */}
          <FormField
            label={`Holding No ${parseInt(licenseFor) > 1 ? '*' : ''}`}
            value={holdingNo}
            onChange={value => {
              setHoldingNo(value);
              clearError('holdingNo');
            }}
            error={errors.holdingNo}
          />
          <FormField
            label="Firm Name"
            value={firmName}
            onChange={value => {
              setFirmName(value);
              clearError('firmName');
            }}
            error={errors.firmName}
          />
          <FormField
            label="Business Description"
            value={businessDescription}
            onChange={value => {
              setBusinessDescription(value);
              clearError('businessDescription');
            }}
            error={errors.businessDescription}
          />
          <FormField
            label="Total Area (in Sq. Ft)"
            value={totalArea}
            onChange={value => {
              setTotalArea(value);
              clearError('totalArea');
            }}
            error={errors.totalArea}
          />
          <FormField
            label="Firm Establishment Date"
            type="date"
            value={establishmentDate}
            onChange={value => {
              setEstablishmentDate(value);
              clearError('establishmentDate');
            }}
            error={errors.establishmentDate}
          />
          <FormField
            label="Business Address"
            value={businessAddress}
            onChange={value => {
              setBusinessAddress(value);
              clearError('businessAddress');
            }}
            error={errors.businessAddress}
          />
          <FormField label="Landmark" value={landmark} onChange={setLandmark} />
          <FormField
            label="Pin Code"
            value={pinCode}
            onChange={value => {
              setPinCode(value);
              clearError('pinCode');
            }}
            error={errors.pinCode}
          />

          <FormField
            label="Owner of Business Premises"
            value={ownerOfPremises}
            onChange={value => {
              setOwnerOfPremises(value);
              clearError('ownerOfPremises');
            }}
            placeholder="Enter premises owner name"
            error={errors.ownerOfPremises}
          />
        </View>

        {/* Owner Details (Dynamic) */}
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
                  clearError('owners', index);
                }}
                error={errors.owners[index]?.ownerName}
              />
              <FormField
                label="Guardian Name"
                value={owner.guardianName}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].guardianName = value;
                  setOwners(updated);
                  clearError('owners', index);
                }}
                error={errors.owners[index]?.guardianName}
              />
              <FormField
                label="Mobile No"
                value={owner.mobileNo}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].mobileNo = value;
                  setOwners(updated);
                  clearError('owners', index);
                }}
                error={errors.owners[index]?.mobileNo}
              />
              <FormField
                label="Email ID"
                value={owner.email}
                onChange={value => {
                  const updated = [...owners];
                  updated[index].email = value;
                  setOwners(updated);
                  clearError('owners', index);
                }}
                error={errors.owners[index]?.email}
              />

              {owners.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const updated = owners.filter((_, i) => i !== index);
                    setOwners(updated);
                    const updatedErrors = errors.owners.filter(
                      (_, i) => i !== index,
                    );
                    setErrors(prev => ({ ...prev, owners: updatedErrors }));
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
              setErrors(prev => ({
                ...prev,
                owners: [
                  ...prev.owners,
                  { ownerName: '', guardianName: '', mobileNo: '', email: '' },
                ],
              }));
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
            onChange={value => {
              setNatureOfBusiness(value);
              clearError('natureOfBusiness');
            }}
            options={categoryOptions}
            placeholder={isLoading ? 'Loading...' : 'Select Nature of Business'}
            error={errors.natureOfBusiness}
          />
        </View>

        {/* Charges */}
        <View style={styles.sectionCard}>
          <View style={styles.headingBox}>
            <Text style={styles.headingText}>CHARGES</Text>
          </View>
          <FormField
            label="License For"
            type="dropdown"
            value={licenseFor}
            onChange={value => {
              setLicenseFor(value);
              clearError('licenseFor');
              // Clear holding no error when license period changes
              if (parseInt(value) === 1) {
                clearError('holdingNo');
              }
            }}
            options={licenseForOptions}
            placeholder={isLoading ? 'Loading...' : 'Select License Type'}
            error={errors.licenseFor}
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
            label="currentCharge"
            value={taxData?.currentCharge?.toString() || ''}
            onChange={setCurrentCharge}
            editable={false}
          />
          <FormField
            label="Total Charge"
            value={taxData?.totalCharge?.toString() || ''}
            onChange={setTotalCharge}
            editable={false}
          />
        </View>

        {/* Submit Button */}
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

export default ApplyLicense;

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
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.white,
    elevation: 3,
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
});
