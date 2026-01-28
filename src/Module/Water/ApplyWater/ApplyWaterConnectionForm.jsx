import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../Constants/Colors';
import { useMasterData } from '../../../Context/MasterDataContext';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { BASE_URL } from '../../../config';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
import { useNavigation } from '@react-navigation/native';
import { scrollToInput, handleValidation } from './validation';
import { WATER_API_ROUTES } from '../../../api/apiRoutes';
import { callTestRequest } from './applyTestRequest';
import { showToast } from '../../../utils/toast';

const ApplyWaterConnectionForm = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [data, setData] = useState({});
  const [typeOfConnection, setTypeOfConnection] = useState(null);
  const [connectonType, setConnectonType] = useState([]);
  const [connectionThrough, setConnectionThrough] = useState([]);
  const [connectionThroughValue, setConnectionThroughValue] = useState(null);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [propertyType, setPropertyType] = useState(null);
  const [ownerType, setOwnerType] = useState(null);
  const [ownershipType, setOwnershipType] = useState([]);
  const [wardNo, setWardNo] = useState(null);
  const [wardNo2, setWardNo2] = useState(null);
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [totalArea, setTotalArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');
  const [kNo, setKNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [electricityType, setElectricityType] = useState('');
  const [categoryType, setCategoryType] = useState(null);
  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [pipelineType, setPipelineType] = useState(null);
  const [pipelineTypeOptions, setPipelineTypeOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [safNo, setSafNo] = useState('');
  const [holdingNo, setHoldingNo] = useState('');
  const [applicants, setApplicants] = useState([
    { ownerName: '', guardianName: '', mobileNo: '', email: '', dob: '' },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(null);
  const [error, setError] = useState({});

  const { wardList, ownerTypeList } = useMasterData();
  const navigation = useNavigation();

  const totalAreaRef = useRef(null);
  const holdingNoRef = useRef(null);

  const landmarRef = useRef(null);
  const pincodeRef = useRef(null);
  const addressRef = useRef(null);
  const khataNoRef = useRef(null);
  const bindBookNoRef = useRef(null);
  const accountNoRef = useRef(null);
  const electricityTypeRef = useRef(null);
  const scrollViewRef = useRef(null);
  const typeOfConnectionWrapperRef = useRef(null);
  const connectionThroughWrapperRef = useRef(null);
  const propertyTypeWrapperRef = useRef(null);
  const ownerTypeWrapperRef = useRef(null);
  const wardNoWrapperRef = useRef(null);
  const wardNo2WrapperRef = useRef(null);
  const typeOfConnectionRef = useRef(null);
  const connectionThroughRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const ownerTypeRef = useRef(null);
  const wardNoRef = useRef(null);
  const wardNo2Ref = useRef(null);
  const applicantRefs = useRef([]);
  // const wardOptions =
  //   wardList?.map(item => ({ label: item.wardNo, value: item.id })) || [];
  // console.log('master data', wardOptions);

  // Fetch new ward options based on old ward
  useEffect(() => {
    const fetchNewWardByOldWard = async wardId => {
      try {
        const token = await getToken();
        const response = await axios.post(
          `${BASE_URL}/api/property/get-new-ward-by-old`,
          { oldWardId: wardId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response?.data?.status) {
          setNewWardOptions(
            response.data.data.map(item => ({
              label: item.wardNo,
              value: item.id,
            })),
          );
        } else {
          setNewWardOptions([]);
        }
      } catch (error) {
        console.error('Error fetching new ward:', error);
        setNewWardOptions([]);
      }
    };

    if (wardNo) fetchNewWardByOldWard(wardNo);
  }, [wardNo]);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          WATER_API_ROUTES.MASTER_DATA,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response?.data?.status) {
          const masterData = response.data.data;
          setData(masterData);
          console.log('Master Data:', masterData);

          setOwnershipType(
            masterData?.ownershipType?.map(item => ({
              label: item.ownershipType,
              value: item.id,
            })) || [],
          );
          setPropertyTypeOptions(
            masterData?.propertyType?.map(item => ({
              label: item.propertyType,
              value: item.id,
            })) || [],
          );
          setConnectonType(
            masterData?.connectionType?.map(item => ({
              label: item.connectionType,
              value: item.id,
            })) || [],
          );
          setCategoryTypeOptions(
            masterData?.categoryType?.map(item => ({
              label: item,
              value: item,
            })) || [],
          );
          setPipelineTypeOptions(
            masterData?.pipelineType?.map(item => ({
              label: item.pipelineType,
              value: item.id,
            })) || [],
          );
          setConnectionThrough(
            masterData?.connectionThrow?.map(item => ({
              label: item.connectionThrough,
              value: item.id,
            })) || [],
          );
          setWardOptions(
            masterData?.wardList?.map(item => ({
              label: item.wardNo,
              value: item.id,
            })) || [],
          );

          // newWardOptions will come from API when old ward is selected
          setNewWardOptions([]);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchMasterData();
  }, []);

  const selectedPropertyLabel =
    propertyTypeOptions.find(option => option.value === propertyType)?.label ||
    '';
  const selectedConnectionThrougn =
    connectionThrough.find(option => option.value === connectionThroughValue)
      ?.label || '';

  // Add new applicant with dob field
  const addApplicant = () =>
    setApplicants(prev => [
      ...prev,
      { ownerName: '', guardianName: '', mobileNo: '', email: '', dob: '' },
    ]);

  // Remove applicant safely
  const removeApplicant = index => {
    setApplicants(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // If the removed applicant was selected for DOB, reset picker
      if (selectedApplicantIndex === index) setSelectedApplicantIndex(null);
      return updated;
    });
  };

  // Update a field for a specific applicant
  const updateApplicantField = (index, field, value) => {
    setApplicants(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  useEffect(() => {
    if (categoryTypeOptions.length > 0 && categoryType === null) {
      setCategoryType(categoryTypeOptions[0].value);
    }
  }, [categoryTypeOptions]);

  useEffect(() => {
    if (pipelineTypeOptions.length > 0 && pipelineType === null) {
      setPipelineType(pipelineTypeOptions[0].value);
    }
  }, [pipelineTypeOptions]);

  // Reset all form fields
  const resetForm = () => {
    setTypeOfConnection(null);
    setConnectionThroughValue(null);
    setPropertyType(null);
    setOwnerType(null);
    setWardNo(null);
    setWardNo2(null);
    setNewWardOptions([]);
    setTotalArea('');
    setLandmark('');
    setPin('');
    setAddress('');
    setKNo('');
    setBindBookNo('');
    setAccountNo('');
    setElectricityType('');
    setSafNo('');
    setHoldingNo('');
    setCategoryType(
      categoryTypeOptions.length > 0 ? categoryTypeOptions[0].value : null,
    );
    setPipelineType(
      pipelineTypeOptions.length > 0 ? pipelineTypeOptions[0].value : null,
    );
    setApplicants([
      { ownerName: '', guardianName: '', mobileNo: '', email: '', dob: '' },
    ]);
    setError({});
    setFocusedField(null);
  };

  const handleSubmit = async () => {
    const isValid = handleValidation({
      totalArea,
      holdingNo,
      safNo,
      landmark,
      pin,
      address,
      applicants,
      typeOfConnection,
      connectionThrough: connectionThroughValue,
      propertyType,
      ownerType,
      wardNo,
      // wardNo2,
      totalAreaRef,
      landmarRef,
      pincodeRef,
      addressRef,
      applicantRefs,
      khataNoRef,
      bindBookNoRef,
      accountNoRef,
      electricityTypeRef,
      typeOfConnectionRef: typeOfConnectionWrapperRef,
      connectionThroughRef: connectionThroughWrapperRef,
      propertyTypeRef: propertyTypeWrapperRef,
      ownerTypeRef: ownerTypeWrapperRef,
      wardNoRef: wardNoWrapperRef,
      // wardNo2Ref: wardNo2WrapperRef,
      scrollViewRef,
      scrollToInput,
      setError,
    });

    if (!isValid) return;

    const payload = {
      category: categoryType,
      pipelineTypeId: pipelineType.toString(),
      connectionTypeId: typeOfConnection.toString(),
      // connectionThroughId: parseInt(connectionThrough),
      connectionThroughId:
        connectionThroughValue != null
          ? parseInt(connectionThroughValue)
          : null,
      propertyTypeId: propertyType,
      ownershipTypeId: ownerType.toString(),
      wardMstrId: wardNo.toString(),
      // newWardMstrId: wardNo2.toString(),
      areaSqft: totalArea,
      address: address,
      landmark: landmark,
      pinCode: pin,
      holdingNo: holdingNo || '',
      safNo: safNo || '',

      ownerDtl: applicants.map((applicant, index) => ({
        id: applicant.id || index + 1,
        ownerName: applicant.ownerName || '',
        guardianName: applicant.guardianName || '',
        dob: applicant.dob,
        mobileNo: applicant.mobileNo || '',
        email: applicant.email || '',
      })),
    };
    try {
      const result = await callTestRequest(payload);
      console.log('call Test Api', result);

      if (result.status) {
        showToast('success', result.message || 'Valid Request');

        navigation.navigate('SubmitApply', {
          formData: payload,
          masterData: data,
          resetForm: resetForm,
        });
      } else {
        showToast('error', result.message || 'Invalid Request');
      }
    } catch (error) {
      showToast('error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.containe} ref={scrollViewRef}>
          {/* Type of Connection & Connection Through */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Apply Water Connection Form</Text>
            <View style={styles.fullWidthInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type of Connection *</Text>
                <View ref={typeOfConnectionWrapperRef}>
                  <Dropdown
                    ref={typeOfConnectionRef}
                    style={[
                      styles.dropdown,
                      focusedField === 'typeOfConnection' &&
                        styles.inputFocused,
                      error.typeOfConnection && styles.inputError,
                    ]}
                    data={connectonType}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={typeOfConnection}
                    onChange={item => setTypeOfConnection(item.value)}
                    onFocus={() => setFocusedField('typeOfConnection')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                {error.typeOfConnection && (
                  <Text style={{ color: 'red' }}>{error.typeOfConnection}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Connection Through *</Text>
                <View ref={connectionThroughWrapperRef}>
                  <Dropdown
                    ref={connectionThroughRef}
                    style={[
                      styles.dropdown,
                      focusedField === 'connectionThrough' &&
                        styles.inputFocused,
                      error.connectionThrough && styles.inputError,
                    ]}
                    data={connectionThrough}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={connectionThroughValue}
                    onChange={item => setConnectionThroughValue(item.value)}
                    onFocus={() => setFocusedField('connectionThrough')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                {error.connectionThrough && (
                  <Text style={{ color: 'red' }}>
                    {error.connectionThrough}
                  </Text>
                )}
              </View>
            </View>

            {/* Property Type & Owner Type */}
            <View style={styles.fullWidthInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Property Type *</Text>
                <View ref={propertyTypeWrapperRef}>
                  <Dropdown
                    ref={propertyTypeRef}
                    style={[
                      styles.dropdown,
                      focusedField === 'propertyType' && styles.inputFocused,
                      error.propertyType && styles.inputError,
                    ]}
                    data={propertyTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={propertyType}
                    onChange={item => setPropertyType(item.value)}
                  />
                </View>
                {error.propertyType && (
                  <Text style={{ color: 'red' }}>{error.propertyType}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Owner Type *</Text>
                <View ref={ownerTypeWrapperRef}>
                  <Dropdown
                    ref={ownerTypeRef}
                    style={[
                      styles.dropdown,
                      focusedField === 'ownerType' && styles.inputFocused,
                      error.ownerType && styles.inputError,
                    ]}
                    data={ownershipType}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={ownerType}
                    onChange={item => setOwnerType(item.value)}
                  />
                </View>
                {error.ownerType && (
                  <Text style={{ color: 'red' }}>{error.ownerType}</Text>
                )}
              </View>
            </View>

            <View style={styles.fullWidthInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category Type</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    focusedField === 'categoryType' && styles.inputFocused,
                  ]}
                  data={categoryTypeOptions}
                  labelField="label"
                  valueField="value"
                  value={categoryType}
                  disable={selectedPropertyLabel !== 'Residential'} // editable only if Residential
                  onChange={item => setCategoryType(item.value)} // updates state
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pipeline Type</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    focusedField === 'pipelineType' && styles.inputFocused,
                  ]}
                  data={pipelineTypeOptions}
                  labelField="label"
                  valueField="value"
                  value={pipelineType}
                  disable={selectedPropertyLabel !== 'Residential'} // editable only if Residential
                  onChange={item => setPipelineType(item.value)}
                />
              </View>
            </View>

            {/* SAF & Holding No */}
            {/* Conditional SAF / Holding Input */}
            <View style={styles.fullWidthInputContainer}>
              {selectedConnectionThrougn === 'SAF' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>SAF No</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === 'safNo' && styles.inputFocused,
                    ]}
                    placeholder="Enter SAF No"
                    value={safNo}
                    onChangeText={setSafNo}
                    onFocus={() => setFocusedField('safNo')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              )}

              {selectedConnectionThrougn === 'Holding Proof' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Holding No</Text>
                  <TextInput
                    useRef={holdingNoRef}
                    style={[
                      styles.input,
                      focusedField === 'holdingNo' && styles.inputFocused,
                    ]}
                    placeholder="Enter Holding No"
                    value={holdingNo}
                    onChangeText={setHoldingNo}
                    onFocus={() => setFocusedField('holdingNo')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {error.holdingNo && (
                    <Text style={{ color: 'red' }}>{error.holdingNo}</Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Ward Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Applicant Property Details</Text>
            <View style={styles.fullWidthInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ward No. *</Text>
                <View ref={wardNoWrapperRef}>
                  <Dropdown
                    ref={wardNoRef}
                    style={[
                      styles.dropdown,
                      focusedField === 'wardNo' && styles.inputFocused,
                      error.wardNo && styles.inputError,
                    ]}
                    data={wardOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={wardNo}
                    onChange={item => setWardNo(item.value)}
                  />
                </View>
                {error.wardNo && (
                  <Text style={{ color: 'red' }}>{error.wardNo}</Text>
                )}
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>New Ward No *</Text>
                <View ref={wardNo2WrapperRef}>
                  <Dropdown
                    ref={wardNo2Ref}
                    style={[
                      styles.dropdown,
                      focusedField === 'wardNo2' && styles.inputFocused,
                      error.wardNo2 && styles.inputError,
                    ]}
                    data={newWardOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={wardNo2}
                    onChange={item => setWardNo2(item.value)}
                  />
                </View>
                {error.wardNo2 && (
                  <Text style={{ color: 'red' }}>{error.wardNo2}</Text>
                )}
              </View> */}
            </View>

            {/* Total Area, Landmark, Pin & Address */}
            <View style={styles.fullWidthInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Area (in Sq. Ft) *</Text>
                <TextInput
                  ref={totalAreaRef}
                  style={[
                    styles.input,
                    focusedField === 'totalArea' && styles.inputFocused,
                    error.totalArea && styles.inputError,
                  ]}
                  placeholder="Enter Total Area"
                  value={totalArea}
                  onChangeText={setTotalArea}
                  onFocus={() => setFocusedField('totalArea')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                />
                {error.totalArea && (
                  <Text style={{ color: 'red' }}>{error.totalArea}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Landmark *</Text>
                <TextInput
                  ref={landmarRef}
                  style={[
                    styles.input,
                    focusedField === 'landmark' && styles.inputFocused,
                    error.landmark && styles.inputError,
                  ]}
                  placeholder="Enter Landmark"
                  value={landmark}
                  onChangeText={setLandmark}
                  onFocus={() => setFocusedField('landmark')}
                  onBlur={() => setFocusedField(null)}
                />
                {error.landmark && (
                  <Text style={{ color: 'red' }}>{error.landmark}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pin *</Text>
                <TextInput
                  ref={pincodeRef}
                  style={[
                    styles.input,
                    focusedField === 'pin' && styles.inputFocused,
                    error.pin && styles.inputError,
                  ]}
                  placeholder="Enter Pin"
                  value={pin}
                  onChangeText={setPin}
                  onFocus={() => setFocusedField('pin')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {error.pin && <Text style={{ color: 'red' }}>{error.pin}</Text>}
              </View>
            </View>

            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                ref={addressRef}
                style={[
                  styles.input,
                  focusedField === 'address' && styles.inputFocused,
                  error.address && styles.inputError,
                ]}
                placeholder="Enter Address"
                value={address}
                onChangeText={setAddress}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
              {error.address && (
                <Text style={{ color: 'red' }}>{error.address}</Text>
              )}
            </View>
          </View>

          {/* Applicants */}
          <Text style={styles.sectionTitle}>Applicant Details</Text>
          {applicants.map((applicant, index) => (
            <View key={index} style={styles.sectionCard}>
              <Text style={styles.applicantTitle}>Applicant {index + 1}</Text>

              <View style={styles.fullWidthInputContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Owner Name *</Text>
                  <TextInput
                    ref={el => (applicantRefs.current[index * 3] = el)}
                    style={[
                      styles.input,
                      focusedField === `ownerName-${index}` &&
                        styles.inputFocused,
                    ]}
                    placeholder="Owner Name"
                    value={applicant.ownerName}
                    onChangeText={value =>
                      updateApplicantField(index, 'ownerName', value)
                    }
                    onFocus={() => setFocusedField(`ownerName-${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  {error[`ownerName-${index}`] && (
                    <Text style={{ color: 'red' }}>
                      {error[`ownerName-${index}`]}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Guardian Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === `guardianName-${index}` &&
                        styles.inputFocused,
                    ]}
                    placeholder="Guardian Name"
                    value={applicant.guardianName}
                    onChangeText={value =>
                      updateApplicantField(index, 'guardianName', value)
                    }
                    onFocus={() => setFocusedField(`guardianName-${index}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.fullWidthInputContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mobile No. *</Text>
                  <TextInput
                    ref={el => (applicantRefs.current[index * 3 + 1] = el)}
                    style={[
                      styles.input,
                      focusedField === `mobileNo-${index}` &&
                        styles.inputFocused,
                    ]}
                    placeholder="Mobile No."
                    value={applicant.mobileNo}
                    onChangeText={value =>
                      updateApplicantField(index, 'mobileNo', value)
                    }
                    onFocus={() => setFocusedField(`mobileNo-${index}`)}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="numeric"
                  />
                  {error[`mobileNo-${index}`] && (
                    <Text style={{ color: 'red' }}>
                      {error[`mobileNo-${index}`]}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email ID</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === `email-${index}` && styles.inputFocused,
                    ]}
                    placeholder="Email ID"
                    value={applicant.email}
                    onChangeText={value =>
                      updateApplicantField(index, 'email', value)
                    }
                    onFocus={() => setFocusedField(`email-${index}`)}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* New DOB Field */}
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => {
                      setSelectedApplicantIndex(index);
                      setShowDatePicker(true);
                    }}
                  >
                    <Text>{applicant.dob ? applicant.dob : 'Select Date'}</Text>
                  </TouchableOpacity>

                  {showDatePicker && selectedApplicantIndex === index && (
                    <DateTimePicker
                      value={
                        applicant.dob ? new Date(applicant.dob) : new Date()
                      }
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const formattedDate = `${selectedDate.getFullYear()}-${(
                            '0' +
                            (selectedDate.getMonth() + 1)
                          ).slice(-2)}-${('0' + selectedDate.getDate()).slice(
                            -2,
                          )}`;
                          const updatedApplicants = [...applicants];
                          updatedApplicants[index].dob = formattedDate;
                          setApplicants(updatedApplicants);
                        }
                      }}
                    />
                  )}
                  {error[`dob-${index}`] && (
                    <Text style={{ color: 'red' }}>
                      {error[`dob-${index}`]}
                    </Text>
                  )}
                </View>
              </View>

              {applicants.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeApplicant(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addApplicant}>
            <Text style={styles.addButtonText}>+ Add Applicant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: rf(2.2), fontWeight: 'bold', marginVertical: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
    width: '100%',
  },

  fullWidthInputContainer: { flex: 1, marginBottom: 12 },
  label: { marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  inputFocused: { borderColor: Colors.primary },
  inputError: { borderColor: 'red' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: rw(3),
    marginBottom: rh(2),
    backgroundColor: Colors.white,
    elevation: 3,
  },
  applicantTitle: { fontWeight: 'bold', marginBottom: 8 },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: rf(2) },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 10,
    // marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // For Android shadow
    overflow: 'hidden',
    padding: 20,
  },
});

export default ApplyWaterConnectionForm;
