import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthToken, useAuthUser } from '../../../utils/auth';
import axios from 'axios';
import { apartmentByOldWardApi, newWardByOldWardApi, propertyMasterDataApi, safDtlForVerificationApi } from '../../../api/endpoint';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../../Constants/Colors';
import VerificationCard from "./component/VerificationCard";
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from 'react-native-gesture-handler';
import MonthPicker from 'react-native-month-year-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatLocalDate } from "../../../utils/common";
import VerificationPreviewModal from "./component/VerificationPreviewModal";


function SurveyPage() {
  const route = useRoute();
  const { id } = route.params;
  const token = useAuthToken();
  const user = useAuthUser();
  const [safData, setSafData] = useState({});
  const [masterData, setMasterData] = useState({});
  const [newWardList, setNewWardList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [verifyData, setVerifyData] = useState({});
  const [addExtraFloor, setAddExtraFloor] = useState(false);
  const [extraFloors, setExtraFloors] = useState([]);
  const [counter, setCounter] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isPreviewModal,setIsPreviewModal] = useState(false);

  useEffect(() => {
    if (token)
      fetchMaster();
  }, [token]);

  useEffect(() => {
    if (token)
      fetchData();
  }, [token]);

  useEffect(() => {
    if (token)
      fetchNewWard();
  }, [token, safData?.wardMstrId, formData?.wardMstrId]);

  useEffect(() => {
    if (token)
      fetchApartment();
  }, [token, safData?.wardMstrId, formData?.wardMstrId]);


  const fetchMaster = async () => {
    try {
      const response = await axios.post(propertyMasterDataApi, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.status) {
        console.log("master",response?.data?.data);
        setMasterData(response?.data?.data);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(safDtlForVerificationApi, { id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.status) {
        setSafData(response?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchNewWard = async () => {
    try {
      const response = await axios.post(newWardByOldWardApi, { oldWardId: formData?.wardMstrId || safData?.wardMstrId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("data", response)
      if (response?.data?.status) {
        setNewWardList(response?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const fetchApartment = async () => {
    try {
      const response = await axios.post(apartmentByOldWardApi, { oldWardId: formData?.wardMstrId || safData?.wardMstrId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("data", response)
      if (response?.data?.status) {
        setApartmentList(response?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const wardDropdownOptions = masterData?.wardList?.map(item => ({
    label: item.wardNo,
    value: item.id,
  }));

  const newWardDropdownOptions = newWardList?.map(item => ({
    label: item.wardNo,
    value: item.id,
  }));

  const zoneDropdownOptions = masterData?.zoneType?.map(item => ({
    label: item.zone,
    value: item.id,
  }));

  const handleChange = (name, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "propertyTypeId" && value == 4) {
        updated = { ...updated, floar: [] };
      }
      return updated;
    });
    setVerifyData((prev) => {
      let updated = { ...prev, [name]: value == formData?.name };
      return updated;
    });
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFloorChange = (floorId, fieldName, value) => {
      setFormData((prev) => {
          const floorArray = prev.floor || [];
          const index = floorArray.findIndex((f) => String(f.id) === String(floorId));
          let updatedFloors;

          if (index > -1) {
              updatedFloors = [
                  ...floorArray.slice(0, index),
                  { ...floorArray[index], [fieldName]: value },
                  ...floorArray.slice(index + 1),
              ];
          } else {
              const newFloorObject = { id: floorId, [fieldName]: value };
              updatedFloors = [...floorArray, newFloorObject];
          }

          return { ...prev, floor: updatedFloors };
      });

      setVerifyData((prev) => {
          const verifyFloorArray = prev.floor || [];
          const index = verifyFloorArray.findIndex((f) => String(f.id) === String(floorId));
          const isVerifiedValue = value === safData?.floor?.find((sf) => String(sf.id) === String(floorId))?.[fieldName];

          let updatedVerifyFloors;

          if (index > -1) {
              updatedVerifyFloors = [
                  ...verifyFloorArray.slice(0, index),
                  { ...verifyFloorArray[index], [fieldName]: isVerifiedValue },
                  ...verifyFloorArray.slice(index + 1),
              ];
          } else {
              const newVerifyObject = { id: floorId, [fieldName]: isVerifiedValue };
              updatedVerifyFloors = [...verifyFloorArray, newVerifyObject];
          }

          return { ...prev, floor: updatedVerifyFloors };
      });
      setValidationErrors((prev) => {
          const floorErrors = prev.floor || {};
          const newFloorErrors = { 
              ...floorErrors, 
              [floorId]: { 
                  ...(floorErrors[floorId] || {}), 
                  [fieldName]: null 
              } 
          };
          return { ...prev, floor: newFloorErrors };
      });
  };

  const handleExtraFloorChange = (floorIndex, fieldName, value) => {
    setExtraFloors(prev =>
      prev.map(f => {
        return f.index === floorIndex ? { ...f, [fieldName]: value } : f;
      })
    );
    setValidationErrors((prev) => {
      const extraFloorErrors = prev.extraFloors || {};
      const newExtraFloorErrors = { ...extraFloorErrors, [floorIndex]: { ...extraFloorErrors[floorIndex], [fieldName]: null } };
      return { ...prev, extraFloors: newExtraFloorErrors };
    });
  };

  const addFloor = (l = "") => {
    setExtraFloors(prev => [
      ...prev,
      {
        index: counter, 
        floorMasterId: null, 
        constructionTypeMasterId: null,
        occupancyTypeMasterId: null, 
        usageTypeMasterId: null, 
        builtupArea: '',
        dateFrom: null, 
        dateUpto: null, 
        showFromPicker: false,
        showToPicker: false,
      },
    ]);

    setCounter(counter + 1);
  };

  const handleRemoveFloor = (indexToRemove) => {
    setExtraFloors((prev) =>
      prev.filter((f) => f.index !== indexToRemove)
    );
    setValidationErrors((prev) => {
      const { [indexToRemove]: removed, ...rest } = prev.extraFloors || {};
      return { ...prev, extraFloors: rest };
    });
  };

  const validateData = () => { 
    const newErrors = {};
    let firstErrorField = null;
    const setError = (field, message, isFloor = false, id = null) => {
      if (isFloor) {
        if (!newErrors.floor) newErrors.floor = {};
        if (!newErrors.floor[id]) newErrors.floor[id] = {};
        newErrors.floor[id][field] = message;
        if (!firstErrorField) firstErrorField = `floor-${id}-${field}`;
      } else if (field.startsWith('extraFloors')) {
        const [, index, subField] = field.split('-');
        if (!newErrors.extraFloors) newErrors.extraFloors = {};
        if (!newErrors.extraFloors[index]) newErrors.extraFloors[index] = {};
        newErrors.extraFloors[index][subField] = message;
        if (!firstErrorField) firstErrorField = field;
      } else {
        newErrors[field] = message;
        if (!firstErrorField) firstErrorField = field;
      }
    };
    const requiredFields = [
      { name: 'wardMstrId', label: 'Ward No.' },
      { name: 'newWardMstrId', label: 'New Ward No.' },
      { name: 'zoneMstrId', label: 'Zone' },
      { name: 'propTypeMstrId', label: 'Property Type' },
      { name: 'isMobileTower', label: 'Mobile Tower' },
      { name: 'isHoardingBoard', label: 'Hording Board' },
    ];

    requiredFields.forEach(({ name, label }) => {
      const value = formData[name] ; 
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        setError(name, `${label} is required.`);        
      }
    }); 

    const effectivePropType = formData?.propTypeMstrId;
    if (effectivePropType == 3) {
      if (!formData.appartmentDetailsId) {
        setError('appartmentDetailsId', 'Apartment Name is required for this Property Type.');
      }
      if (!formData.flatRegistryDate) {
        setError('flatRegistryDate', 'Flat Registry Date is required for this Property Type.');
      }
    }
    
    const effectiveIsMobileTower = formData?.isMobileTower;
    if (effectiveIsMobileTower === true) {
      if (!formData?.towerArea || parseFloat(formData?.towerArea) <= 0) {
        setError('towerArea', 'Total Area Covered is required and must be greater than 0.');
      }
      if (!formData?.towerInstallationDate) {
        setError('towerInstallationDate', 'Tower Date From is required.');
      }
    }

    const floorsToValidate = safData?.floor || [];
    floorsToValidate.forEach((item) => {
      const floorId = item.id;
      const curentData = formData?.floor?.find((otp) => otp?.id == floorId) || {};

      const getEffectiveValue = (field) => curentData[field];

      const floorRequiredFields = [
        { name: 'usageTypeMasterId', label: 'Usage Type' },
        { name: 'occupancyTypeMasterId', label: 'Occupancy Type' },
        { name: 'constructionTypeMasterId', label: 'Construction Type' },
        { name: 'builtupArea', label: 'Buildup Area' },
        { name: 'dateFrom', label: 'Date From' },
      ];

      floorRequiredFields.forEach(({ name, label }) => {
        const effectiveValue = getEffectiveValue(name);
        if (effectiveValue === null || effectiveValue === undefined || (typeof effectiveValue === 'string' && effectiveValue.trim() === '')) {
          setError(name, `${item.floorName} - ${label} is required.`, true, floorId);
        }
      });

      const builtupArea = getEffectiveValue('builtupArea');
      if (builtupArea && (isNaN(parseFloat(builtupArea)) || parseFloat(builtupArea) <= 0)) {
        setError('builtupArea', `${item.floorName} - Buildup Area must be a positive number.`, true, floorId);
      }

      const dateFrom = getEffectiveValue('dateFrom');
      const dateUpto = getEffectiveValue('dateUpto');
      if (dateFrom && dateUpto) {
        const fromDate = new Date(dateFrom);
        const uptoDate = new Date(dateUpto);
        if (fromDate > uptoDate) {
          setError('dateUpto', `${item.floorName} - Date Upto cannot be before Date From.`, true, floorId);
        }
      }
    });

    if (addExtraFloor && extraFloors.length > 0) {
      extraFloors.forEach((floor, index) => {
        const extraFloorRequiredFields = [
          { name: 'floorMasterId', label: 'Floor Name' },
          { name: 'constructionTypeMasterId', label: 'Construction Type' },
          { name: 'occupancyTypeMasterId', label: 'Occupancy Type' },
          { name: 'usageTypeMasterId', label: 'Usage Type' },
          { name: 'builtupArea', label: 'Built-up Area' },
          { name: 'dateFrom', label: 'Date From' },
        ];

        extraFloorRequiredFields.forEach(({ name, label }) => {
          if (floor[name] === null || floor[name] === undefined || (typeof floor[name] === 'string' && floor[name].trim() === '')) {
            setError(`extraFloors-${floor.index}-${name}`, `Extra Floor ${index + 1} - ${label} is required.`);
          }
        });
        if (floor.builtupArea && (isNaN(parseFloat(floor.builtupArea)) || parseFloat(floor.builtupArea) <= 0)) {
          setError(`extraFloors-${floor.index}-builtupArea`, `Extra Floor ${index + 1} - Built-up Area must be a positive number.`);
        }
        
        if (floor.dateFrom && floor.dateUpto) {
          
          const fromDate = new Date(floor.dateFrom);
          const uptoDate = new Date(floor.dateUpto);
          console.log(fromDate,uptoDate);
          if (fromDate > uptoDate) {
            setError(`extraFloors-${floor.index}-dateUpto`, `Extra Floor ${index + 1} - Date Upto cannot be before Date From.`);
          }
        }
      });
    }

    setValidationErrors(newErrors); 

    if (firstErrorField) {
      Alert.alert('Validation Error', 'Please fill all required fields and correct all errors.');
      return false;
    }
    setIsPreviewModal(true);
    return true;
  };
  
console.log("isPreviewModal",formData)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.surveyContainer}>
        <HeaderNavigation />
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading survey data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>
                Your Application No.:{' '}
                <Text style={styles.value}>{safData.safNo}</Text>
              </Text>
              <Text style={styles.label}>
                Application Type:{' '}
                <Text style={styles.value}>{safData.assessmentType}</Text>
              </Text>
              <Text style={styles.label}>
                Applied Date: <Text style={styles.value}>{safData.applyDate}</Text>
              </Text>
            </View>
            <VerificationCard
              label="Ward No."
              value={formData?.wardMstrId}
              selfValue={safData?.wardMstrId}
              levelVal={safData?.wardNo}
              name="wardMstrId"
              type="select"
              isCorrect={verifyData?.wardMstrId}
              isRequired={true}
              onChange={handleChange}
              option={wardDropdownOptions}
              error={validationErrors?.wardMstrId}
            />
            <VerificationCard
              label="New Ward No."
              value={formData?.newWardMstrId}
              selfValue={safData?.newWardMstrId}
              levelVal={safData?.newWardNo}
              name="newWardMstrId"
              type="select"
              isCorrect={verifyData?.newWardMstrId}
              isRequired={true}
              onChange={handleChange}
              option={newWardDropdownOptions}
              error={validationErrors?.newWardMstrId}
            />

            <VerificationCard
              label="Zone"
              value={formData?.zoneMstrId}
              selfValue={safData?.zoneMstrId}
              levelVal={safData?.zone}
              name="zoneMstrId"
              type="select"
              isCorrect={verifyData?.zoneMstrId}
              isRequired={true}
              onChange={handleChange}
              option={zoneDropdownOptions}
              error={validationErrors?.zoneMstrId}
            />

            <VerificationCard
              label="Property Type"
              value={formData?.propTypeMstrId}
              selfValue={safData?.propTypeMstrId}
              levelVal={safData?.propertyType}
              name="propTypeMstrId"
              type="select"
              isCorrect={verifyData?.propTypeMstrId}
              isRequired={true}
              error={validationErrors?.propTypeMstrId}
              onChange={handleChange}
              option={masterData?.propertyType?.map((item) => ({
                label: item.propertyType,
                value: item.id,
              }))}
            />
            {/* apartment */}
            {(formData?.propTypeMstrId || safData?.propTypeMstrId) == 3 && (
              <>
                <VerificationCard
                  label="Apartment Name"
                  value={formData?.appartmentDetailsId}
                  selfValue={safData?.appartmentDetailsId}
                  levelVal={safData?.propertyType}
                  name="appartmentDetailsId"
                  type="select"
                  isCorrect={verifyData?.appartmentDetailsId}
                  isRequired={true}
                  error={validationErrors?.appartmentDetailsId}
                  onChange={handleChange}
                  option={apartmentList?.map((item) => ({
                    label: item.apartmentName,
                    value: item.id,
                  }))}
                />
                <VerificationCard
                  label="Flat Registry Date"
                  value={formData?.flatRegistryDate}
                  selfValue={safData?.flatRegistryDate}
                  levelVal={safData?.flatRegistryDate}
                  name="flatRegistryDate"
                  type="date"
                  isCorrect={verifyData?.flatRegistryDate}
                  isRequired={true}
                  error={validationErrors?.flatRegistryDate}
                  onChange={handleChange}

                />
              </>
            )}
            {/* floar */}
            {(formData?.propTypeMstrId || safData?.propTypeMstrId) != 4 && (
              <>
                {safData?.floor?.map((item, index) => {
                  const curentData = formData?.floor?.find((otp) => otp?.id == item?.id);
                  const curentVerify = verifyData?.floor?.find((otp) => otp?.id == item?.id);
                  const floorId = item.id;
                  const floorErrors = validationErrors?.floor?.[floorId] || {};
                  return (
                    <LinearGradient
                      colors={['#B6D9E0', '#2C5364']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientContainer}
                    >
                      <View key={item.id+index} style={{ marginBottom: 20 }}>
                        {/* Floor Name Header */}
                        <Text
                          style={{
                            marginTop: 10,
                            marginBottom: 5,
                            marginLeft: 15,
                            marginRight: 15,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 16,
                            backgroundColor: 'rgba(13, 148, 136, 1)',
                            padding: 5,
                            borderRadius: 4,
                          }}
                        >
                          {item.floorName.toUpperCase()}
                        </Text>

                        {/* Verification Card for Usage Type */}
                        <VerificationCard
                          label="Usage Type"
                          value={curentData?.usageTypeMasterId}
                          selfValue={item?.usageTypeMasterId}
                          levelVal={item?.usageType}
                          name="usageTypeMasterId"
                          type="select"
                          isCorrect={curentVerify?.usageTypeMasterId}
                          isRequired={true}
                          error={floorErrors?.usageTypeMasterId}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                          option={masterData?.usageType?.map((usageItem) => ({
                            label: usageItem.usageType,
                            value: usageItem.id,
                          }))}
                        />

                        <VerificationCard
                          label="Occupancy Type"
                          value={curentData?.occupancyTypeMasterId}
                          selfValue={item?.occupancyTypeMasterId}
                          levelVal={item?.occupancyName}
                          name="occupancyTypeMasterId"
                          type="select"
                          isCorrect={curentVerify?.occupancyTypeMasterId}
                          isRequired={true}
                          error={floorErrors?.occupancyTypeMasterId}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                          option={masterData?.occupancyType?.map((usageItem) => ({
                            label: usageItem.occupancyName,
                            value: usageItem.id,
                          }))}
                        />

                        <VerificationCard
                          label="Construction Type"
                          value={curentData?.constructionTypeMasterId}
                          selfValue={item?.constructionTypeMasterId}
                          levelVal={item?.constructionType}
                          name="constructionTypeMasterId"
                          type="select"
                          isCorrect={curentVerify?.constructionTypeMasterId}
                          isRequired={true}
                          error={floorErrors?.constructionTypeMasterId}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                          option={masterData?.constructionType?.map((usageItem) => ({
                            label: usageItem.constructionType,
                            value: usageItem.id,
                          }))}
                        />

                        <VerificationCard
                          label="Buildup Area"
                          value={curentData?.builtupArea}
                          selfValue={item?.builtupArea}
                          levelVal={item?.builtupArea}
                          name="builtupArea"
                          type="number"
                          isCorrect={curentVerify?.builtupArea}
                          isRequired={true}
                          error={floorErrors?.builtupArea}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                        />

                        <VerificationCard
                          label="Date From"
                          value={curentData?.dateFrom}
                          selfValue={item?.dateFrom}
                          levelVal={item?.dateFrom}
                          name="dateFrom"
                          type="yearMonth"
                          isCorrect={curentVerify?.dateFrom}
                          isRequired={true}
                          error={floorErrors?.dateFrom}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                        />

                        <VerificationCard
                          label="Date Upto"
                          value={curentData?.dateUpto}
                          selfValue={item?.dateUpto}
                          levelVal={item?.dateUpto}
                          name="dateUpto"
                          type="yearMonth"
                          isCorrect={curentVerify?.dateUpto}
                          error={floorErrors?.dateUpto}
                          onChange={(fieldName, newValue) => handleFloorChange(item?.id, fieldName, newValue)}
                        />

                      </View>
                    </LinearGradient>
                  );
                })}

                {user?.userFor != "ULB" && (
                  <View>
                    <View style={styles.extraFloorContainer}>
                      <View style={styles.row}>
                        <Text style={styles.labelCheckbox}>
                          Do You Want To Add Extra Floor?
                        </Text>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => {
                            if (!addExtraFloor) {
                              addFloor(); // add first floor when checked
                            } else if (addExtraFloor) {
                              setExtraFloors([]); // reset on uncheck
                            }
                            setAddExtraFloor(!addExtraFloor);
                          }}
                        >
                          <View
                            style={
                              addExtraFloor
                                ? styles.checkedBox
                                : styles.uncheckedBox
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      {addExtraFloor && (
                        <>
                          {extraFloors.map((floor, index) =>{
                            const extraFloorErrors = validationErrors?.extraFloors?.[floor.index] || {}; 
                            return(
                              <LinearGradient
                                key={floor.index}
                                colors={['#ececf2ff', '#eee7e7ff']}
                                style={styles.card}
                              >
                                <View style={styles.rowlabel}>
                                  <Text style={{ color: 'white' }}>
                                    Extra Floor {index + 1}
                                  </Text>
                                  {/* Remove button for extra floor */}
                                  <TouchableOpacity
                                    style={styles.removeBtn}
                                    // Pass the unique `floor.index` to the handler
                                    onPress={() => handleRemoveFloor(floor.index)}
                                  >
                                    <Text style={styles.removeBtnText}>Remove</Text>
                                  </TouchableOpacity>
                                </View>
                                <View>
                                  <Text style={styles.label}>Floor Name</Text>
                                  <Dropdown
                                    style={[styles.dropdown, extraFloorErrors?.floorMasterId && styles.errorBorder]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    data={masterData?.floorType?.map((item) => ({
                                      label: item.floorName,
                                      value: item.id,
                                    }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={floor.floorMasterId}
                                    // Use floor.index for identification
                                    onChange={item =>
                                      handleExtraFloorChange(floor.index, 'floorMasterId', item.value)
                                    }
                                  />
                                  {extraFloorErrors?.floorMasterId && <Text style={styles.errorText}>{extraFloorErrors.floorMasterId}</Text>}

                                  <Text style={styles.label}>
                                    Construction Type
                                  </Text>
                                  <Dropdown
                                    style={[styles.dropdown, extraFloorErrors?.constructionTypeMasterId && styles.errorBorder]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    data={masterData?.constructionType?.map((item) => ({
                                      label: item.constructionType,
                                      value: item.id,
                                    }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={floor.constructionTypeMasterId}
                                    // Use floor.index for identification
                                    onChange={item =>
                                      handleExtraFloorChange(
                                        floor.index,
                                        'constructionTypeMasterId',
                                        item.value,
                                      )
                                    }
                                  />
                                  {extraFloorErrors?.constructionTypeMasterId && <Text style={styles.errorText}>{extraFloorErrors.constructionTypeMasterId}</Text>}

                                  <Text style={styles.label}>Occupancy Type</Text>
                                  <Dropdown
                                    style={[styles.dropdown, extraFloorErrors?.occupancyTypeMasterId && styles.errorBorder]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    data={masterData?.occupancyType?.map((item) => ({
                                      label: item.occupancyName,
                                      value: item.id,
                                    }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={floor.occupancyTypeMasterId}
                                    // Use floor.index for identification
                                    onChange={item =>
                                      handleExtraFloorChange(
                                        floor.index,
                                        'occupancyTypeMasterId',
                                        item.value,
                                      )
                                    }
                                  />
                                  {extraFloorErrors?.occupancyTypeMasterId && <Text style={styles.errorText}>{extraFloorErrors.occupancyTypeMasterId}</Text>}

                                  <Text style={styles.label}>Usage Type</Text>
                                  <Dropdown
                                    style={[styles.dropdown, extraFloorErrors?.usageTypeMasterId && styles.errorBorder]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    data={masterData?.usageType?.map((item) => ({
                                      label: item.usageType,
                                      value: item.id,
                                    }))}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={floor.usageTypeMasterId}
                                    // Use floor.index for identification
                                    onChange={(item) =>
                                      handleExtraFloorChange(floor.index, 'usageTypeMasterId', item.value)
                                    }
                                  />
                                  {extraFloorErrors?.usageTypeMasterId && <Text style={styles.errorText}>{extraFloorErrors.usageTypeMasterId}</Text>}

                                  <Text style={styles.label}>Built-up Area</Text>
                                  <TextInput
                                    style={[styles.input,extraFloorErrors?.builtupArea && styles.errorBorder]}
                                    placeholder="Enter built-up area"
                                    value={floor.builtupArea}
                                    // Use floor.index for identification
                                    onChangeText={(text) =>
                                      handleExtraFloorChange(floor.index, 'builtupArea', text)
                                    }
                                    keyboardType="numeric"
                                  />
                                  {extraFloorErrors?.builtupArea && <Text style={styles.errorText}>{extraFloorErrors.builtupArea}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                  <Text style={styles.staticValueLabel}>Date From:</Text>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Touchable area to open picker */}
                                    <TouchableOpacity
                                      style={[styles.input, { flex: 1 },extraFloorErrors?.dateFrom && styles.errorBorder]}
                                      // Use floor.index for identification
                                      onPress={() => handleExtraFloorChange(floor.index, 'showFromPicker', true)}
                                    >
                                      <Text style={{ color: floor.dateFrom ? '#333' : '#aaa' }}>
                                        {floor.dateFrom
                                          ? new Date(floor.dateFrom).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric',
                                          })
                                          : 'Select Date'}
                                      </Text>
                                    </TouchableOpacity>

                                    {/* ❌ Clear button — only show if date selected */}
                                    {floor.dateFrom ? (
                                      <TouchableOpacity
                                        // Use floor.index for identification
                                        onPress={() => handleExtraFloorChange(floor.index, 'dateFrom', null)}
                                        style={styles.clearBtn}
                                      >
                                        <Text style={styles.clearBtnText}>✕</Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                  {extraFloorErrors?.dateFrom && <Text style={styles.errorText}>{extraFloorErrors.dateFrom}</Text>}
                                  {floor.showFromPicker && (

                                    <MonthPicker
                                      onChange={(event,date) => {
                                        // Use floor.index for identification
                                        handleExtraFloorChange(floor.index, 'showFromPicker', false);
                                        handleExtraFloorChange(floor.index, 'dateFrom', date.toISOString());                                        
                                      }}
                                      // Use floor.dateFrom for the value
                                      value={floor.dateFrom ? new Date(floor.dateFrom) : new Date()}
                                      minimumDate={new Date(1900, 0)}
                                      maximumDate={new Date()} // restrict future
                                      locale="en"
                                    />
                                  )}
                                </View>

                                <View style={styles.inputContainer}>
                                  <Text style={styles.staticValueLabel}>Date Upto:</Text>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Touchable area to open picker */}
                                    <TouchableOpacity
                                      style={[styles.input, { flex: 1 },extraFloorErrors?.dateUpto && styles.errorBorder]}
                                      // Use floor.index for identification
                                      onPress={() => handleExtraFloorChange(floor.index, 'showUptoPicker', true)}
                                    >
                                      <Text style={{ color: floor.dateUpto ? '#333' : '#aaa' }}>
                                        {floor.dateUpto // Check for the corrected field name
                                          ? new Date(floor.dateUpto).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric',
                                          })
                                          : 'Select Date'}
                                      </Text>
                                    </TouchableOpacity>

                                    {/* ❌ Clear button — only show if date selected */}
                                    {floor.dateUpto ? (
                                      <TouchableOpacity
                                        // Use floor.index for identification
                                        onPress={() => handleExtraFloorChange(floor.index, 'dateUpto', null)}
                                        style={styles.clearBtn}
                                      >
                                        <Text style={styles.clearBtnText}>✕</Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                  {extraFloorErrors?.dateUpto && <Text style={styles.errorText}>{extraFloorErrors.dateUpto}</Text>}
                                  {floor.showUptoPicker && (

                                    <MonthPicker
                                      onChange={(event,date) => {
                                        // Use floor.index for identification
                                        handleExtraFloorChange(floor.index, 'showUptoPicker', false);
                                        handleExtraFloorChange(floor.index, 'dateUpto', date.toISOString());
                                      }}
                                      // Use floor.dateUpto for the value
                                      value={floor.dateUpto ? new Date(floor.dateUpto) : new Date()}
                                      minimumDate={new Date(1900, 0)}
                                      maximumDate={new Date()} // restrict future
                                      locale="en"
                                    />
                                  )}
                                </View>
                              </LinearGradient>
                            )}
                          )}

                          {/* Add Floor Button */}
                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={addFloor}
                          >
                            <Text style={styles.addButtonText}>+ Add Another Floor</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                )}                
              </>
            )}

            {/* Mobile Tower */}
            <LinearGradient
                colors={['#B6D9E0', '#2C5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                <View style={{ marginBottom: 20 }}>
                    <VerificationCard
                      label="Mobile Tower"
                      value={formData?.isMobileTower}
                      selfValue={safData?.isMobileTower}
                      levelVal={safData?.isMobileTower ? "Yes":"No"}
                      name="isMobileTower"
                      type="select"
                      isCorrect={verifyData?.isMobileTower}
                      isRequired={true}
                      onChange={handleChange}
                      option={[{label:"Yes",value:true},{label:"No",value:false}]}
                    />
                    {(formData?.isMobileTower||safData?.isMobileTower)&&(
                      <>
                        <VerificationCard
                          label="Total Area Covered by Mobile Tower & Supporting Equipments (in Sq.Ft.)"
                          value={formData?.towerArea}
                          selfValue={safData?.towerArea}
                          levelVal={safData?.towerArea}
                          name="towerArea"
                          type="number"
                          isCorrect={verifyData?.towerArea}
                          isRequired={true}
                          onChange={handleChange}
                          option={[]}
                        />
                        <VerificationCard
                          label="Date of Installation of Mobile Tower"
                          value={formData?.towerInstallationDate}
                          selfValue={safData?.towerInstallationDate}
                          levelVal={safData?.towerInstallationDate}
                          name="towerInstallationDate"
                          type="date"
                          isCorrect={verifyData?.towerInstallationDate}
                          isRequired={true}
                          onChange={handleChange}
                          option={[]}
                        />
                      </>
                    )}                       

                  </View>
            </LinearGradient>

            {/* Hording Board */}
            <LinearGradient
                colors={['#B6D9E0', '#2C5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                <View style={{ marginBottom: 20 }}>
                    <VerificationCard
                      label="Does Property Have Hoarding Board(s)"
                      value={formData?.isHoardingBoard}
                      selfValue={safData?.isHoardingBoard}
                      levelVal={safData?.isHoardingBoard ? "Yes":"No"}
                      name="isHoardingBoard"
                      type="select"
                      isCorrect={verifyData?.isHoardingBoard}
                      isRequired={true}
                      onChange={handleChange}
                      option={[{label:"Yes",value:true},{label:"No",value:false}]}
                    />
                    {(formData?.isHoardingBoard||safData?.isHoardingBoard)&&(
                      <>
                        <VerificationCard
                          label="Total Area of Wall / Roof / Land (in Sq. Ft.)"
                          value={formData?.hoardingArea}
                          selfValue={safData?.hoardingArea}
                          levelVal={safData?.hoardingArea}
                          name="hoardingArea"
                          type="number"
                          isCorrect={verifyData?.hoardingArea}
                          isRequired={true}
                          onChange={handleChange}
                          option={[]}
                        />
                        <VerificationCard
                          label="Date of Installation of Hoarding Board(s)"
                          value={formData?.hoardingInstallationDate}
                          selfValue={safData?.hoardingInstallationDate}
                          levelVal={safData?.hoardingInstallationDate}
                          name="hoardingInstallationDate"
                          type="date"
                          isCorrect={verifyData?.hoardingInstallationDate}
                          isRequired={true}
                          onChange={handleChange}
                          option={[]}
                        />
                      </>
                    )}                       

                  </View>
            </LinearGradient>
            {(formData?.propTypeMstrId || safData?.propTypeMstrId) != 4 && (
              <>
                {/* Petrol Pump */}
                <LinearGradient
                    colors={['#B6D9E0', '#2C5364']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientContainer}
                  >
                    <View style={{ marginBottom: 20 }}>
                        <VerificationCard
                          label="Is property a Petrol Pump ?"
                          value={formData?.isPetrolPump}
                          selfValue={safData?.isPetrolPump}
                          levelVal={safData?.isPetrolPump ? "Yes":"No"}
                          name="isPetrolPump"
                          type="select"
                          isCorrect={verifyData?.isPetrolPump}
                          isRequired={true}
                          onChange={handleChange}
                          option={[{label:"Yes",value:true},{label:"No",value:false}]}
                        />
                        {(formData?.isPetrolPump||safData?.isPetrolPump)&&(
                          <>
                            <VerificationCard
                              label="Total Area of Petrol Pump (in Sq. Ft.)"
                              value={formData?.underGroundArea}
                              selfValue={safData?.underGroundArea}
                              levelVal={safData?.underGroundArea}
                              name="underGroundArea"
                              type="number"
                              isCorrect={verifyData?.underGroundArea}
                              isRequired={true}
                              onChange={handleChange}
                              option={[]}
                            />
                            <VerificationCard
                              label="Date of Completion"
                              value={formData?.petrolPumpCompletionDate}
                              selfValue={safData?.petrolPumpCompletionDate}
                              levelVal={safData?.petrolPumpCompletionDate}
                              name="petrolPumpCompletionDate"
                              type="date"
                              isCorrect={verifyData?.petrolPumpCompletionDate}
                              isRequired={true}
                              onChange={handleChange}
                              option={[]}
                            />
                          </>
                        )}                       

                      </View>
                </LinearGradient>

                {/* Rwh */}
                <LinearGradient
                    colors={['#B6D9E0', '#2C5364']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientContainer}
                  >
                    <View style={{ marginBottom: 20 }}>
                        <VerificationCard
                          label="Rainwater harvesting provision ?"
                          value={formData?.isWaterHarvesting}
                          selfValue={safData?.isWaterHarvesting}
                          levelVal={safData?.isWaterHarvesting ? "Yes":"No"}
                          name="isWaterHarvesting"
                          type="select"
                          isCorrect={verifyData?.isWaterHarvesting}
                          isRequired={true}
                          onChange={handleChange}
                          option={[{label:"Yes",value:true},{label:"No",value:false}]}
                        />
                        {(formData?.isWaterHarvesting||safData?.isWaterHarvesting)&&(
                          <>
                            
                            <VerificationCard
                              label="Date of Completion"
                              value={formData?.waterHarvestingDate}
                              selfValue={safData?.waterHarvestingDate}
                              levelVal={safData?.waterHarvestingDate}
                              name="waterHarvestingDate"
                              type="date"
                              isCorrect={verifyData?.waterHarvestingDate}
                              isRequired={true}
                              onChange={handleChange}
                              option={[]}
                            />
                          </>
                        )}                       

                      </View>
                </LinearGradient>
              </>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                  style={styles.button1} 
                  onPress={() => {validateData()}}
              >
                  <Text style={styles.surveyButtonText}>Preview</Text>
              </TouchableOpacity>

          </View>
          </>
        )}
        {isPreviewModal &&(
          <VerificationPreviewModal 
            onClose={()=>setIsPreviewModal(false)}
            onSuccess={()=>setIsPreviewModal(false)}
            masterData={masterData}
            newWardList={newWardList}
            apartMentList={apartmentList}
            safData={safData}
            verificationData={formData}
            extraFloor={extraFloors}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default SurveyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  surveyContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(80),
  },
  loadingText: {
    marginTop: 10,
    fontSize: responsiveFontSize(2),
    color: Colors.primary,
  },
  card: {
    margin: responsiveWidth(4),
    padding: responsiveWidth(4),
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    fontWeight: '500',
    marginBottom: responsiveHeight(0.5),
    marginLeft: responsiveWidth(1),
  },
  value: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  gradientContainer: {
    borderRadius: 10,
    margin: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  dropdown: {
    height: responsiveHeight(5.5),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#aaa',
    fontSize: responsiveFontSize(1.8),
  },
  selectedText: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
  input: {
    height: responsiveHeight(5.5),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center', // For TouchableOpacity date inputs
  },
  extraFloorContainer: {
    marginTop: responsiveHeight(2),
    padding: responsiveWidth(4),
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: responsiveHeight(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    padding: 5,
    borderRadius: 4,
  },
  labelCheckbox: {
    fontSize: responsiveFontSize(1.9),
    color: '#333',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  uncheckedBox: {
    // empty view for unchecked state
  },
  addButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  removeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 10,
  },
  staticValueLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    fontWeight: '500',
    marginBottom: responsiveHeight(0.5),
    marginLeft: responsiveWidth(1),
  },
  clearBtn: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  clearBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between', // space buttons apart
      marginTop: responsiveHeight(2),
  },

  iconBtn: {
      marginLeft: 10,
  },
  button1: {
      marginTop: 16,
      flex: 1,
      backgroundColor: Colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: responsiveWidth(1),
  },
  surveyButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },

});