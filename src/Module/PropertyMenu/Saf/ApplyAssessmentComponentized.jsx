import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../../../Screen/Header';
import { BASE_URL } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddressSection from './components/AddressSection';
import OwnerDetailsSection from './components/OwnerDetailsSection';
import ElectricityDetailsSection from './components/ElectricityDetailsSection';
import WaterConnectionDetailsSection from './components/WaterConnectionDetailsSection';
import ExtraChargesSection from './components/ExtraChargesSection';
import FloorDetailsSection from './components/FloorDetailsSection';
import PropertyDetails from './components/PropertyDetails';
import { showToast } from '../../../utils/toast';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import LocationPhotoSection from '../../../Components/LocationPhotoSection';
import { submitAssessment as submitAssessmentApi } from './utils/assessmentApi';

const ApplyAssessmentComponentized = ({ navigation, route }) => {
  // Get data from route params if it's a reassessment or mutation
  const {
    id,
    isRessessment,
    isMutation,
    safData,
    ownerList,
    taxDetails,
    transDtls,
    memoDtls,
    tcVerfivication,
    paymentDtls,
  } = route?.params || {};
  // console.log('safData:', safData);
  // console.log('isRessessment:', isRessessment);

  const [showPhotoSection, setShowPhotoSection] = useState(false);

  // State to hold data from component
  const [capturedData, setCapturedData] = useState({
    location: null,
    left: null,
    right: null,
    front: null,
  });

  console.log('Captured Data:', capturedData);

  const handleCapturedData = (key, value) => {
    setCapturedData(prev => {
      const newState = { ...prev, [key]: value };

      // Check if the key is a side or the location
      if (key === 'location') {
        console.log('📍 Location Updated:', newState.location);
      } else {
        console.log(`📸 Photo Updated for [${key.toUpperCase()} SIDE]`, value);
      }

      return newState;
    });
  };

  // All state and logic copied from ApplyAssessment.jsx

  const isDataPopulatedRef = React.useRef(false);
  const [error, setError] = useState({});
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    safData?.flatRegistryDate ? new Date(safData.flatRegistryDate) : new Date(),
  );

  const [apartmentList, setApartmentList] = useState([]);
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [builtUpArea, setBuiltUpArea] = useState('');

  const [waterConnectionFacility, setWaterConnectionFacility] = useState(null);
  const [waterTaxType, setWaterTaxType] = useState(null);

  const [waterConnectionNo, setWaterConnectionNo] = useState('');
  const [waterConnectionDate, setWaterConnectionDate] = useState('');
  const [propertyTypeLabel, setPropertyTypeLabel] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [kno, setKno] = useState('');
  const [accNo, setAccNo] = useState('');
  const [bindBookNo, setBindBookNo] = useState('');
  const [khataNo, setKhataNo] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [villageName, setVillageName] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [noRoad, setNoRoad] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [towerArea, setTowerArea] = useState('');
  const [installationDate, setInstallationDate] = useState('');
  const [hoardingArea, setHoardingArea] = useState('');
  const [hoardingInstallationDate, setHoardingInstallationDate] = useState('');
  const [pumpArea, setPumpArea] = useState('');
  const [pumpInstallationDate, setPumpInstallationDate] = useState('');
  const [completionDate, setCompletionDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [oldWard, setOldWard] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState('');
  const [armedForces, setArmedForces] = useState('');
  const [speciallyAbled, setSpeciallyAbled] = useState('');
  const [electricityCategory, setElectricityCategory] = useState('');
  const [mobileTower, setMobileTower] = useState('');
  const [hoarding, setHoarding] = useState('');
  const [petrolPump, setPetrolPump] = useState('');
  const [rainHarvesting, setRainHarvesting] = useState('');
  const [data, setData] = useState(null);
  const [zone, setZone] = useState('');
  const [transferMode, setTransferMode] = useState('');
  const [propertyTransferPercentage, setPropertyTransferPercentage] =
    useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showWaterConnectionDatePicker, setShowWaterConnectionDatePicker] =
    useState(false);
  const [showInstallationDatePicker, setShowInstallationDatePicker] =
    useState(false);
  const [
    showHoardingInstallationDatePicker,
    setShowHoardingInstallationDatePicker,
  ] = useState(false);
  const [showPumpInstallationDatePicker, setShowPumpInstallationDatePicker] =
    useState(false);
  const [correspondingAddress, setCorrespondingAddress] = useState('');
  const [correspondingCity, setCorrespondingCity] = useState('');
  const [correspondingDistrict, setCorrespondingDistrict] = useState('');
  const [correspondingState, setCorrespondingState] = useState('');
  const [correspondingPincode, setCorrespondingPincode] = useState('');
  const [dob, setDob] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  //   const validateMobile = mobile => /^[6-9]\d{9}$/.test(mobile);
  //   const validateAadhaar = aadhaar => /^\d{12}$/.test(aadhaar);
  //   const validatePAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  //   const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  const [floorDetails, setFloorDetails] = useState([
    {
      floorName: '',
      usageType: '',
      occupancyType: '',
      constructionType: '',
      builtUpArea: '',
      fromDate: '',
      uptoDate: '',
    },
  ]);
  const handleFieldChange = (field, value, setter) => {
    setter(value); // Update the state
    if (error[field]) {
      // Clear the error for this field if it exists
      setError(prev => ({ ...prev, [field]: undefined }));
    }
  };
  const addFloor = () => {
    setFloorDetails(prev => [
      ...prev,
      {
        floorName: '',
        usageType: '',
        occupancyType: '',
        constructionType: '',
        builtUpArea: '',
        fromDate: '',
        uptoDate: '',
      },
    ]);
  };

  const updateFloorDetail = (index, field, value) => {
    const updated = [...floorDetails];
    updated[index][field] = value;
    setFloorDetails(updated);
  };
  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      console.log('Checkbox checked - Show corresponding address fields');
    } else {
      console.log('Checkbox unchecked - Hide corresponding address fields');
    }
  };
  const handleSubmit = async () => {
    let newErrors = {};

    if (isMutation) {
      if (!transferMode) {
        newErrors.transferMode = 'Please select mode of ownership transfer';
        showToast(
          'error',
          'Validation Error',
          'Please select mode of ownership transfer',
        );
      }

      if (!propertyTransferPercentage) {
        newErrors.propertyTransferPercentage =
          'Please enter property transfer percentage';
        showToast(
          'error',
          'Validation Error',
          'Please enter property transfer percentage',
        );
      } else if (
        isNaN(propertyTransferPercentage) ||
        propertyTransferPercentage < 0 ||
        propertyTransferPercentage > 100
      ) {
        newErrors.propertyTransferPercentage =
          'Percentage must be between 0 and 100';
        showToast(
          'error',
          'Validation Error',
          'Percentage must be between 0 and 100',
        );
      }
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // stop submission if errors exist
    }

    const geoTagArray = [];
    const sides = ['left', 'right', 'front'];

    sides.forEach(side => {
      const photo = capturedData[side];
      if (photo && capturedData.location) {
        geoTagArray.push({
          direction: `${side} side`,
          latitude: capturedData.location.latitude,
          longitude: capturedData.location.longitude,
          document: {
            uri: photo.uri,
            name: photo.fileName || `${side}_photo.jpg`,
            type: photo.type || 'image/jpeg',
          },
        });
      }
    });

    // const payload = {
    //   assessmentType: isRessessment
    //     ? 'Reassessment'
    //     : isMutation
    //     ? 'Mutation'
    //     : '',
    //   builtupArea: builtUpArea,
    //   appartmentDetailsId: safData?.appartmentDetailsId || '',
    //   holdingId: safData?.id,
    //   wardMstrId: oldWard,
    //   // newWard,
    //   ownershipTypeMstrId: ownershipType,
    //   previousHoldingId: isRessessment || isMutation ? safData?.id : null,

    //   propTypeMstrId: propertyType,

    //   zoneMstrId: zone,
    //   transferMode: isMutation ? transferMode : '',
    //   propertyTransferPercentage: isMutation ? propertyTransferPercentage : '',
    //   gender,
    //   relation,
    //   mobile,
    //   aadhaar,
    //   pan,
    //   email,
    //   armedForces,
    //   speciallyAbled,
    //   kno,
    //   accNo,
    //   bindBookNo,
    //   electricityCategory,
    //   khataNo,
    //   plotNo,
    //   villageMaujaName: villageName,
    //   areaOfPlot: plotArea,
    //   roadTypeMstrId: roadWidth,
    //   noRoad,
    //   waterConnectionNo,
    //   waterConnectionDate,
    //   propAddress: propertyAddress,
    //   propCity: city,
    //   propDist: district,
    //   propState: state,
    //   propPinCode: pincode,
    //   dob: dob ? new Date(dob).toLocaleDateString('en-GB') : '',
    //   ownerName,
    //   guardianName,
    //   correspondingAddress: isChecked ? correspondingAddress : '',
    //   correspondingCity: isChecked ? correspondingCity : '',
    //   correspondingDistrict: isChecked ? correspondingDistrict : '',
    //   correspondingState: isChecked ? correspondingState : '',
    //   correspondingPincode: isChecked ? correspondingPincode : '',
    //   // mobileTower,
    //   // towerArea,
    //   // installationDate,
    //   // hoarding,
    //   // hoardingArea,
    //   // hoardingInstallationDate,
    //   // petrolPump,
    //   // pumpArea,
    //   // pumpInstallationDate,
    //   // rainHarvesting,
    //   // completionDate: completionDate ? completionDate.toISOString() : '',
    //   isMobileTower: mobileTower === 'yes' ? 1 : 0,
    //   isHoardingBoard: hoarding === 'yes' ? 1 : 0,
    //   isPetrolPump: petrolPump === 'yes' ? 1 : 0,
    //   isWaterHarvesting: rainHarvesting === 'yes' ? 1 : 0,

    //   // Add these conditional fields to satisfy the backend validation
    //   ...(mobileTower === 'yes' && {
    //     towerArea: towerArea,
    //     towerInstallationDate: formatDate1(installationDate),
    //   }),

    //   ...(hoarding === 'yes' && {
    //     hoardingArea: hoardingArea,
    //     hoardingInstallationDate: formatDate1(hoardingInstallationDate),
    //   }),

    //   ...(petrolPump === 'yes' && {
    //     underGroundArea: pumpArea, // Error log specifically asked for "under ground area"
    //     petrolPumpCompletionDate: formatDate1(pumpInstallationDate),
    //   }),

    //   ...(rainHarvesting === 'yes' && {
    //     waterHarvestingDate: formatDate1(completionDate),
    //   }),

    //   roadWidth,
    //   waterConnectionFacilityTypeId: waterConnectionFacility,
    //   waterTaxTypeId: waterTaxType,
    //   geoTag: geoTagArray,
    // };
    // payload.ownerDtl = (ownerDetails || []).map(owner => ({
    //   ownerName: owner.ownerName || '',
    //   guardianName: owner.guardianName || '',
    //   mobileNo: owner.mobile || '',

    //   relationType: owner.relation ? relationMap[owner.relation] || '' : '',

    //   gender: owner.gender ? genderMap[owner.gender] || 'Other' : 'Other',

    //   dob: owner.dob ? new Date(owner.dob).toISOString().split('T')[0] : '',

    //   isArmedForce: owner.armedForces === 'yes',
    //   isSpeciallyAbled: owner.speciallyAbled === 'yes',
    // }));

    // // formData.ownershipTypeMstrId = ownershipTypeId;

    // if (propertyTypeLabel !== 'VACANT LAND') {
    //   payload.floorDtl = floorDetails.map(floor => ({
    //     floorMasterId: floor.floorName,
    //     usageTypeMasterId: floor.usageType,
    //     occupancyTypeMasterId: floor.occupancyType,
    //     constructionTypeMasterId: floor.constructionType,
    //     builtupArea: floor.builtUpArea,
    //     dateFrom: floor.fromDate,
    //     uptoDate: floor.uptoDate,
    //   }));
    // }

    const payload = {
      // Mandatory Fields from your error log
      assessmentType: isRessessment
        ? 'Reassessment'
        : isMutation
        ? 'Mutation'
        : '',
      builtupArea: builtUpArea,
      holdingId: safData?.id,
      previousHoldingId: isRessessment || isMutation ? safData?.id : null,
      wardMstrId: oldWard,
      // newWardMstrId: newWard || oldWard, // Fallback if newWard is empty
      ownershipTypeMstrId: ownershipType,
      propTypeMstrId: propertyType,
      zoneMstrId: zone,
      roadTypeMstrId: roadWidth,
      waterConnectionFacilityTypeId: waterConnectionFacility,
      waterTaxTypeId: waterTaxType,
      flatRegistryDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : '',
      appartmentDetailsId: apartmentDetail || '',

      // Mandatory Boolean Flags
      isMobileTower: mobileTower === 'yes' ? 1 : 0,
      isHoardingBoard: hoarding === 'yes' ? 1 : 0,
      isPetrolPump: petrolPump === 'yes' ? 1 : 0,
      isWaterHarvesting: rainHarvesting === 'yes' ? 1 : 0,

      // Add these conditional fields to satisfy the backend validation
      ...(mobileTower === 'yes' && {
        towerArea: towerArea,
        towerInstallationDate: formatDate1(installationDate),
      }),

      ...(hoarding === 'yes' && {
        hoardingArea: hoardingArea,
        hoardingInstallationDate: formatDate1(hoardingInstallationDate),
      }),

      ...(petrolPump === 'yes' && {
        underGroundArea: pumpArea, // Error log specifically asked for "under ground area"
        petrolPumpCompletionDate: formatDate1(pumpInstallationDate),
      }),

      ...(rainHarvesting === 'yes' && {
        waterHarvestingDate: formatDate1(completionDate),
      }),
      ...(isMutation && {
        transferModeMstrId: transferMode,
        percentageOfPropertyTransfer: propertyTransferPercentage,
      }),
      // Property Details
      khataNo: khataNo,
      plotNo: plotNo,
      villageMaujaName: villageName,
      areaOfPlot: plotArea,
      builtupArea: builtUpArea,
      propAddress: propertyAddress,
      propCity: city,
      propDist: district,
      propState: state,
      propPinCode: pincode,

      // Electricity Details
      electConsumerNo: kno,
      electAccNo: accNo,
      electBindBookNo: bindBookNo,
      electConsCategory: electricityCategory,

      // Nested Arrays with mandatory boolean flags inside ownerDtl
      ownerDtl: (ownerList || []).map(owner => ({
        ownerName: owner.ownerName || '',
        guardianName: owner.guardianName || '',
        mobileNo: owner.mobileNo || owner.mobile || '',
        relationType: owner.relationType || owner.relation || '',
        gender: owner.gender || '',
        dob: owner.dob || '',
        isArmedForce: owner.isArmedForce || owner.armedForces === 'yes' ? 1 : 0,
        isSpeciallyAbled:
          owner.isSpeciallyAbled || owner.speciallyAbled === 'yes' ? 1 : 0,
      })),

      floorDtl:
        propertyTypeLabel !== 'VACANT LAND'
          ? (floorDetails || []).map(floor => ({
              floorMasterId: floor.floorName,
              builtupArea: floor.builtUpArea,
              usageTypeMasterId: floor.usageType,
              constructionTypeMasterId: floor.constructionType,
              occupancyTypeMasterId: floor.occupancyType,
              dateFrom: floor.fromDate,
              uptoDate: floor.uptoDate,
            }))
          : [],

      // The GeoTag Array
      geoTag: geoTagArray,
    };
    const formData = new FormData();

    // This helper converts your "Old Type" object into the FormData the API wants
    Object.keys(payload).forEach(key => {
      if (key === 'geoTag' || key === 'ownerDtl' || key === 'floorDtl') {
        // Handle arrays specifically for the API format
        payload[key].forEach((item, index) => {
          Object.keys(item).forEach(subKey => {
            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
          });
        });
      } else {
        formData.append(key, payload[key]);
      }
    });
    console.log('payload  ssss', payload);
    const result = await submitAssessmentApi(formData, true);
    console.log('Submission Result:', result);
    if (result && (result.status || result.success)) {
      showToast('success', result.message || 'Submitted successfully');
      if (isRessessment) {
        navigation.navigate('RessesmentSummry', {
          data: payload,
          safData: safData,
        });
      } else if (isMutation) {
        navigation.navigate('MutationScreen', {
          data: payload,
          safData: safData,
        });
      } else {
        navigation.navigate('AssessmentSummary', { data: payload });
      }
    } else {
      // Log specific errors from backend if available
      console.log('Backend Validation Errors:', result);
      showToast('error', result?.message || 'Submission failed');
    }
  };

  const clearFieldError = field => {
    setError(prev => ({ ...prev, [field]: undefined }));
  };
  useEffect(() => {
    fetchMasterData();
  }, []);
  useEffect(() => {
    if (oldWard) {
      fetchNewWardByOldWard(oldWard);
    }
  }, [oldWard]);
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
        const masterData = response.data.data;
        setData(masterData);
        console.log('Master data:', masterData);
      } else {
        console.warn('Failed to fetch master data:', response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };
  const fetchNewWardByOldWard = async wardId => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        `${BASE_URL}/api/property/get-new-ward-by-old`,
        { oldWardId: wardId },
        { headers },
      );
      // console.log('New ward response:', response?.data);
      if (response?.data?.status) {
        const newOptions = response.data.data.map(item => ({
          label: item.wardNo,
          value: item.id,
        }));
        setNewWardOptions(newOptions);
      } else {
        console.warn('Failed to fetch new wards:', response?.data?.message);
        setNewWardOptions([]);
      }
    } catch (error) {
      console.error('Error fetching new ward:', error);
    }
  };
  const floorNameOptions = [
    { label: 'Select Floor', value: null },
    ...(data?.floorType?.map(floor => ({
      label: floor.floorName,
      value: floor.id,
    })) || []),
  ];
  const usageTypeOptions = [
    { label: 'Select Usage Type', value: null },
    ...(data?.usageType?.map(usetype => ({
      label: usetype.usageType,
      value: usetype.id,
    })) || []),
  ];
  const occupancyTypeOptions = [
    { label: 'Select Occupancy Type', value: null },
    ...(data?.occupancyType?.map(occupy => ({
      label: occupy.occupancyName,
      value: occupy.id,
    })) || []),
  ];
  const constructionTypeOptions = [
    { label: 'Select Construction Type', value: null },
    ...(data?.constructionType?.map(cunstruct => ({
      label: cunstruct.constructionType,
      value: cunstruct.id,
    })) || []),
  ];
  const wardDropdownOptions = [
    { label: 'Select Ward', value: null },
    ...(data?.wardList?.map(ward => ({
      label: ward?.wardNo,
      value: ward?.id,
    })) || []),
  ];

  const circleOptions = [
    { label: 'Select Ward', value: null },
    ...(data?.zoneType?.map(zone => ({
      label: zone?.zoneName,
      value: zone?.id,
    })) ?? []),
  ];
  const waterConnectionFacilityOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.waterFacility?.map(item => ({
      label: item.facilityType,
      value: item.id,
    })) || []),
  ];

  const waterTaxTypeOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.waterTax?.map(item => ({
      label: item.taxType,
      value: item.id,
    })) || []),
  ];
  const ownershipDropdownOptions = [
    { label: 'Select Ownership Type', value: null },
    ...(data?.ownershipType?.map(item => ({
      label: item.ownershipType,
      value: item.id,
    })) || []),
  ];
  const propertyTypeDropdownOptions = [
    { label: 'Select Property Type', value: null },
    ...(data?.propertyType?.map(item => ({
      label: item.propertyType,
      value: item.id,
    })) || []),
  ];
  const genderOptions = [
    { label: 'Select Gender', value: null },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
  const yesNoOptions = [
    { label: 'Select', value: null },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];
  const selectRelation = [
    { label: 'Select Relation', value: null },
    { label: 'S/O', value: 'so' },
    { label: 'D/O', value: 'do' },
    { label: 'W/O', value: 'wo' },
    { label: 'F/O', value: 'fo' },
  ];
  const selectelectcate = [
    { label: 'Select Category', value: null },
    { label: 'DSI', value: 'DSI' },
    { label: 'DSII', value: 'DSII' },
  ];
  const transferModeOptions = [
    { label: 'Select Transfer Mode', value: null },
    { label: 'Sale', value: '1' },
    { label: 'Gift', value: '2' },
    { label: 'Will', value: '3' },
    { label: 'Lease', value: '4' },
    { label: 'Partition', value: '5' },
    { label: 'Succession', value: '6' },
  ];
  const financialYearOptions = [
    { label: 'Select Financial Year', value: null },
    ...(data?.fyearList.map(item => ({
      label: item.fyear,
      value: item.fyear, // Or item.fromDate depending on your API needs
    })) || []),
  ];

  // From Date Options (Starting months of FY)
  const fromDateOptions = [
    { label: 'Select From Date', value: null },
    ...(data?.fyearList?.map(item => ({
      label: item.fyear, // Show "2025-04"
      value: item.fromDate,
    })) || []),
  ];

  // Upto Date Options (Ending months of FY)
  const uptoDateOptions = [
    { label: 'Select Upto Date', value: null },
    ...(data?.fyearList?.map(item => ({
      label: item.fyear, // Show "2026-03"
      value: item.uptoDate,
    })) || []),
  ];
  const roadTypeOptions = [
    { label: 'Select', value: null }, // ✅ default
    ...(data?.roadType?.map(item => ({
      label: item.roadType,
      value: item.id,
    })) || []),
  ];

  const findFYFromOptions = (backendDate, fromOptions, uptoOptions) => {
    if (!backendDate) return null;

    for (let i = 0; i < fromOptions.length; i++) {
      const from = fromOptions[i]?.value;
      const upto = uptoOptions[i]?.value;

      if (!from || !upto) continue;

      if (backendDate >= from && backendDate <= upto) {
        return {
          fromDate: from,
          uptoDate: upto,
        };
      }
    }

    return null;
  };

  // Populate form data when it's a reassessment or mutation
  useEffect(() => {
    if (
      (isRessessment || isMutation) &&
      safData &&
      data &&
      !isDataPopulatedRef.current
    ) {
      // console.log('Populating data for reassessment/mutation:', safData);
      const oldWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.wardNo,
      );
      setOldWard(oldWardOption?.id || '');

      const newWardOption = data?.wardList?.find(
        ward => ward.wardNo === safData.newWardNo,
      );
      setNewWard(newWardOption?.id || '');

      // Find ownership type ID
      const ownershipOption = data?.ownershipType?.find(
        item => item.ownershipType === safData.ownershipType,
      );
      setOwnershipType(ownershipOption?.id || '');

      // Find property type ID
      const propertyTypeOption = data?.propertyType?.find(
        item => item.propertyType === safData.propertyType,
      );
      setPropertyType(propertyTypeOption?.id || '');
      setPropertyTypeLabel(safData.propertyType || '');
      setApartmentDetail(safData.appartmentDetailsId || '');
      // Set zone
      const zoneValue = safData.zone || '';
      // Map zone values to dropdown format
      // ... existing ward/ownership/property logic ...

      // Set zone (Circle)
      if (safData.zoneMstrId) {
        // If the API uses ID, set the ID directly
        setZone(safData.zoneMstrId);
      } else if (safData.zone) {
        // Fallback to label matching if ID isn't the value field
        const zoneOption = circleOptions.find(
          opt => opt.label?.toLowerCase() === safData.zone.toLowerCase(),
        );
        setZone(zoneOption ? zoneOption.value : safData.zone);
      }

      // Property Details
      setKhataNo(safData.khataNo || '');
      setPlotNo(safData.plotNo || '');
      setVillageName(safData.villageMaujaName || '');
      setPlotArea(safData.areaOfPlot || '');
      setRoadWidth(safData.roadWidth || '');
      setBuiltUpArea(safData?.builtupArea ?? '');

      // Populate owner details if available
      if (ownerList && ownerList.length > 0) {
        const owner = ownerList[0];
        // console.log('Setting owner data:', owner);

        setOwnerName(owner.ownerName || '');

        // Set gender dropdown value
        const genderValue = owner.gender?.toLowerCase() || '';
        setGender(genderValue);

        setDob(owner.dob || '');
        setGuardianName(owner.guardianName || '');

        // Find relation type ID
        const relationOption = selectRelation.find(
          item => item.label === owner.relationType,
        );
        setRelation(relationOption?.value || '');

        setMobile(owner.mobileNo?.toString() || '');

        setAadhaar(owner.aadharNo || '');
        setPan(owner.panNo || '');
        setEmail(owner.email || '');
        setArmedForces(owner.isArmedForce ? 'yes' : 'no');
        setSpeciallyAbled(owner.isSpeciallyAbled ? 'yes' : 'no');
      }

      // Electricity Details
      setKno(safData.electConsumerNo || '');
      setAccNo(safData.electAccNo || '');
      setBindBookNo(safData.electBindBookNo || '');

      // Find electricity category ID
      const electricityCategoryOption = selectelectcate.find(
        item => item.label === safData.electConsCategory,
      );
      setElectricityCategory(electricityCategoryOption?.value || '');

      // Water Connection Details
      setWaterConnectionNo(safData.waterConnNo || '');
      setWaterConnectionDate(safData.waterConnDate || '');

      // Property Address
      setPropertyAddress(safData.propAddress || '');
      setCity(safData.propCity || '');
      setDistrict(safData.propDist || '');
      setState(safData.propState || '');
      setPincode(safData.propPinCode || '');

      // Corresponding Address if different
      if (safData.isCorrAddDiffer) {
        setIsChecked(true);
        setCorrespondingAddress(safData.corrAddress || '');
        setCorrespondingCity(safData.corrCity || '');
        setCorrespondingDistrict(safData.corrDist || '');
        setCorrespondingState(safData.corrState || '');
        setCorrespondingPincode(safData.corrPinCode || '');
      }

      // Extra Charges - Mobile Tower
      setMobileTower(safData.isMobileTower ? 'yes' : 'no');
      setTowerArea(safData.towerArea || '');
      setInstallationDate(safData.towerInstallationDate || '');

      // Water Connection Facility and Tax Type
      const waterFacilityOption = data?.waterFacility?.find(
        item => item.facilityType === safData.waterConnectionFacilityType,
      );
      setWaterConnectionFacility(waterFacilityOption?.id ?? null);

      const waterTaxOption = data?.waterTax?.find(
        item => item.taxType === safData.waterTaxType,
      );
      setWaterTaxType(waterTaxOption?.id ?? null);

      const roadTypeOptions = data?.roadType?.find(
        item => item.roadType === safData.roadType,
      );
      setRoadWidth(roadTypeOptions?.id || '');
      // Extra Charges - Hoarding
      setHoarding(safData.isHoardingBoard ? 'yes' : 'no');
      setHoardingArea(safData.hoardingArea || '');
      setHoardingInstallationDate(safData.hoardingInstallationDate || '');

      // Extra Charges - Petrol Pump
      setPetrolPump(safData.isPetrolPump ? 'yes' : 'no');
      setPumpArea(safData.underGroundArea || '');
      setPumpInstallationDate(safData.petrolPumpCompletionDate || '');

      // Extra Charges - Rainwater Harvesting
      setRainHarvesting(safData.isWaterHarvesting ? 'yes' : 'no');
      setCompletionDate(
        safData.petrolPumpCompletionDate
          ? new Date(safData.petrolPumpCompletionDate)
          : null,
      );

      // Populate floor details from existing data
      if (safData.floors && safData.floors.length > 0) {
        // console.log('Setting floor data:', safData.floors);

        const populatedFloorDetails = safData.floors.map(floor => {
          // Find the correct IDs from master data options
          const floorNameOption = data?.floorType?.find(
            item => item.floorName === floor.floorName,
          );
          const usageTypeOption = data?.usageType?.find(
            item => item.usageType === floor.usageType,
          );
          const occupancyTypeOption = data?.occupancyType?.find(
            item => item.occupancyName === floor.occupancyName,
          );
          const constructionTypeOption = data?.constructionType?.find(
            item => item.constructionType === floor.constructionType,
          );
          const fyMatch = findFYFromOptions(
            floor.dateFrom,
            fromDateOptions,
            uptoDateOptions,
          );

          const fyUptoMatch = findFYFromOptions(
            floor.dateUpto,
            fromDateOptions,
            uptoDateOptions,
          );

          return {
            floorName: floorNameOption?.id || floor.floorName || '',
            usageType: usageTypeOption?.id || floor.usageType || '',
            occupancyType: occupancyTypeOption?.id || floor.occupancyName || '',
            constructionType:
              constructionTypeOption?.id || floor.constructionType || '',
            builtUpArea: floor.builtupArea || '',
            fromDate: fyMatch ? fyMatch.fromDate : null,
            uptoDate: fyUptoMatch ? fyUptoMatch.uptoDate : null,
          };
        });

        setFloorDetails(populatedFloorDetails);
        // console.log('Floor details populated:', populatedFloorDetails);
      }

      isDataPopulatedRef.current = true; // Mark as populated
    }
  }, [isRessessment, isMutation, safData, ownerList, data]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>
            {isRessessment
              ? 'Reassessment Type'
              : isMutation
              ? 'Mutation Type'
              : 'Assessment Type'}
          </Text>
          <View style={styles.section}>
            <Text style={styles.label}>Old Ward *</Text>
            <Dropdown
              style={styles.dropdown}
              data={wardDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Old Ward"
              value={oldWard}
              onChange={item => setOldWard(item.value)}
              disable={isRessessment || isMutation}
            />
            {/* <Text style={styles.label}>New Ward *</Text>
          <Dropdown
            style={styles.dropdown}
            data={newWardOptions}
            labelField="label"
            valueField="value"
            placeholder="Select New Ward"
            value={newWard}
            onChange={item => setNewWard(item.value)}
            disable={isRessessment || isMutation}
          /> */}
            <Text style={styles.label}>Ownership Type *</Text>
            <Dropdown
              style={styles.dropdown}
              data={ownershipDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Ownership Type"
              value={ownershipType}
              onChange={item => setOwnershipType(item.value)}
              disable={isRessessment || isMutation}
            />
            <Text style={styles.label}>Property Type *</Text>
            <Dropdown
              style={styles.dropdown}
              data={propertyTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Property Type"
              value={propertyType}
              onChange={item => {
                setPropertyType(item.value);
                setPropertyTypeLabel(item.label);
              }}
              disable={isRessessment || isMutation}
            />
            <Text style={styles.label}>Circe *</Text>
            <Dropdown
              style={styles.dropdown}
              data={circleOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Zone"
              value={zone}
              onChange={item => setZone(item.value)}
              disable={isRessessment || isMutation}
            />
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
              Zone 1: Over bridge to Saheed chowk.
            </Text>
            <Text style={{ color: 'red', fontSize: 12 }}>
              Zone 2: Rest area other than Zone 1.
            </Text>

            {safData?.propTypeMstrId == 3 && (
              <View>
                <Text
                  style={[
                    styles.label,
                    error.ownershipType && styles.errorLabel,
                  ]}
                >
                  Apartment Details *
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: '#f0f0f0', // optional, to indicate read-only
                  }}
                >
                  <Text>{safData?.apartmentName || 'N/A'}</Text>
                </View>
              </View>
            )}

            {/* Mutation-specific fields */}
            {isMutation && (
              <>
                <Text style={styles.label}>Mode of Ownership Transfer *</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={transferModeOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Mode of Ownership Transfer"
                  value={transferMode}
                  onChange={item => {
                    setTransferMode(item.value);
                    if (error.transferMode) clearFieldError('transferMode');
                  }}
                />
                {error.transferMode && (
                  <Text style={styles.errorText}>{error.transferMode}</Text>
                )}

                <Text style={styles.label}>Property Transfer (0-100%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage (0-100)"
                  keyboardType="numeric"
                  value={propertyTransferPercentage}
                  onChangeText={text => {
                    setPropertyTransferPercentage(text);
                    if (error.propertyTransferPercentage)
                      clearFieldError('propertyTransferPercentage');
                  }}
                  maxLength={3}
                />
                {error.propertyTransferPercentage && (
                  <Text style={styles.errorText}>
                    {error.propertyTransferPercentage}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.header}>Owner Details</Text>
          <OwnerDetailsSection
            ownerName={ownerName}
            setOwnerName={setOwnerName}
            gender={gender}
            setGender={setGender}
            genderOptions={genderOptions}
            dob={dob}
            setDob={setDob}
            showDobPicker={showDobPicker}
            setShowDobPicker={setShowDobPicker}
            guardianName={guardianName}
            setGuardianName={setGuardianName}
            relation={relation}
            setRelation={setRelation}
            selectRelation={selectRelation}
            mobile={mobile}
            setMobile={setMobile}
            aadhaar={aadhaar}
            setAadhaar={setAadhaar}
            pan={pan}
            setPan={setPan}
            email={email}
            setEmail={setEmail}
            armedForces={armedForces}
            setArmedForces={setArmedForces}
            speciallyAbled={speciallyAbled}
            setSpeciallyAbled={setSpeciallyAbled}
            yesNoOptions={yesNoOptions}
            isRessessment={isRessessment}
            isMutation={isMutation}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.header}>Electricity Details</Text>
          <ElectricityDetailsSection
            kno={kno}
            setKno={setKno}
            accNo={accNo}
            setAccNo={setAccNo}
            bindBookNo={bindBookNo}
            setBindBookNo={setBindBookNo}
            electricityCategory={electricityCategory}
            setElectricityCategory={setElectricityCategory}
            selectelectcate={selectelectcate}
            isRessessment={isRessessment}
            isMutation={isMutation}
          />
        </View>
        {/* <Text style={styles.header}>Water Connection Details</Text>
        <WaterConnectionDetailsSection
          waterConnectionNo={waterConnectionNo}
          setWaterConnectionNo={setWaterConnectionNo}
          waterConnectionDate={waterConnectionDate}
          setWaterConnectionDate={setWaterConnectionDate}
          showWaterConnectionDatePicker={showWaterConnectionDatePicker}
          setShowWaterConnectionDatePicker={setShowWaterConnectionDatePicker}
          isRessessment={isRessessment}
          isMutation={isMutation}
        /> */}

        <View style={styles.card}>
          <Text style={styles.header}>Property Address</Text>
          <AddressSection
            address={propertyAddress}
            setAddress={setPropertyAddress}
            city={city}
            setCity={setCity}
            district={district}
            setDistrict={setDistrict}
            stateValue={state}
            setStateValue={setState}
            pincode={pincode}
            setPincode={setPincode}
            isRessessment={isRessessment} // true/false
            isMutation={isMutation}
          />
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleCheckboxToggle}
          disabled={isRessessment || isMutation}
        >
          <View style={[styles.checkbox, isChecked && styles.checked]} />
          <Text style={styles.label}>
            If Corresponding Address Different from Property Address
          </Text>
        </TouchableOpacity>
        {isChecked && (
          <View style={styles.extraFields}>
            <AddressSection
              address={correspondingAddress}
              setAddress={setCorrespondingAddress}
              city={correspondingCity}
              setCity={setCorrespondingCity}
              district={correspondingDistrict}
              setDistrict={setCorrespondingDistrict}
              stateValue={correspondingState}
              setStateValue={setCorrespondingState}
              pincode={correspondingPincode}
              setPincode={setCorrespondingPincode}
              title="Corresponding Address"
              isRessessment={isRessessment}
              isMutation={isMutation}
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.header}>Extra Charges</Text>
          <ExtraChargesSection
            mobileTower={mobileTower}
            setMobileTower={setMobileTower}
            towerArea={towerArea}
            setTowerArea={setTowerArea}
            installationDate={installationDate}
            setInstallationDate={setInstallationDate}
            showInstallationDatePicker={showInstallationDatePicker}
            setShowInstallationDatePicker={setShowInstallationDatePicker}
            hoarding={hoarding}
            setHoarding={setHoarding}
            hoardingArea={hoardingArea}
            setHoardingArea={setHoardingArea}
            hoardingInstallationDate={hoardingInstallationDate}
            setHoardingInstallationDate={setHoardingInstallationDate}
            showHoardingInstallationDatePicker={
              showHoardingInstallationDatePicker
            }
            setShowHoardingInstallationDatePicker={
              setShowHoardingInstallationDatePicker
            }
            petrolPump={petrolPump}
            setPetrolPump={setPetrolPump}
            pumpArea={pumpArea}
            setPumpArea={setPumpArea}
            pumpInstallationDate={pumpInstallationDate}
            setPumpInstallationDate={setPumpInstallationDate}
            showPumpInstallationDatePicker={showPumpInstallationDatePicker}
            setShowPumpInstallationDatePicker={
              setShowPumpInstallationDatePicker
            }
            rainHarvesting={rainHarvesting}
            setRainHarvesting={setRainHarvesting}
            completionDate={completionDate}
            setCompletionDate={setCompletionDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            yesNoOptions={yesNoOptions}
            isRessessment={isRessessment}
            isMutation={isMutation}
          />
        </View>
        <View style={styles.card}>
          <PropertyDetails
            khataNo={khataNo}
            setKhataNo={setKhataNo}
            plotNo={plotNo}
            setPlotNo={setPlotNo}
            villageName={villageName}
            setVillageName={setVillageName}
            plotArea={plotArea}
            setPlotArea={setPlotArea}
            roadWidth={roadWidth}
            setRoadWidth={setRoadWidth}
            noRoad={noRoad}
            roadWidthOptions={roadTypeOptions}
            setNoRoad={setNoRoad}
            buildArea={builtUpArea}
            setBuildArea={setBuiltUpArea}
            showFieldAlert={msg => {}}
            styles={styles}
            isEditable={!isRessessment && !isMutation}
          />
        </View>
        <FloorDetailsSection
          propertyTypeLabel={propertyTypeLabel}
          floorDetails={floorDetails}
          updateFloorDetail={updateFloorDetail}
          addFloor={addFloor}
          fromYearOptions={fromDateOptions}
          uptoYearOptions={uptoDateOptions}
          floorNameOptions={floorNameOptions}
          usageTypeOptions={usageTypeOptions}
          occupancyTypeOptions={occupancyTypeOptions}
          constructionTypeOptions={constructionTypeOptions}
          isRessessment={isRessessment}
          isMutation={isMutation}
        />

        <View style={styles.card}>
          {/* Water Connection Facility */}
          <Text style={styles.cardTitle}>Water Connection Facility</Text>
          <Text style={styles.label}>Water Connection Facility *</Text>
          <Dropdown
            style={[
              styles.dropdown,
              error.waterConnectionFacility && styles.errorInput,
            ]}
            data={waterConnectionFacilityOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={waterConnectionFacility}
            onChange={item => {
              handleFieldChange(
                'waterConnectionFacility',
                item.value,
                setWaterConnectionFacility,
              );
            }}
          />
          {error.waterConnectionFacility && (
            <Text style={styles.errorText}>
              {error.waterConnectionFacility}
            </Text>
          )}

          {/* Water Tax Type */}
          <Text style={styles.label}>Water Tax Type *</Text>
          <Dropdown
            style={[styles.dropdown, error.waterTaxType && styles.errorInput]}
            data={waterTaxTypeOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={waterTaxType}
            onChange={item => {
              handleFieldChange('waterTaxType', item.value, setWaterTaxType);
            }}
          />
          {error.waterTaxType && (
            <Text style={styles.errorText}>{error.waterTaxType}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPhotoSection(!showPhotoSection)}
        >
          <Text style={styles.buttonText}>
            {showPhotoSection ? 'Hide Photo/Location' : ' Add Photo & Location'}
          </Text>
        </TouchableOpacity>

        {showPhotoSection && (
          <LocationPhotoSection
            onDataCaptured={handleCapturedData}
            savedPhotos={{
              left: capturedData.left,
              right: capturedData.right,
              front: capturedData.front,
            }}
            savedLocation={capturedData.location}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.white,
    elevation: 3,
  },
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  checked: {
    backgroundColor: 'green',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateInput: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  dateText: {
    color: '#333',
  },
  floorCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  floorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  addBtn: {
    backgroundColor: '#2e86de',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#071970',
    fontSize: 17,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  toggleButton: {
    backgroundColor: '#fff', // White background to distinguish from main submit
    borderWidth: 1.5,
    borderColor: '#3498db', // Using your app's primary blue
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    flexDirection: 'row',
    borderStyle: 'dashed', // Dashed border makes it look like an "upload/add" area
  },
  toggleButtonText: {
    color: '#3498db',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ApplyAssessmentComponentized;
