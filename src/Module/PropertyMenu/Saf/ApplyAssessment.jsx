import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { Dropdown } from 'react-native-element-dropdown';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddressSection from './components/AddressSection';
import ElectricityDetailsSection from './components/ElectricityDetailsSection';
import WaterConnectionDetailsSection from './components/WaterConnectionDetailsSection';
import ExtraChargesSection from './components/ExtraChargesSection';
import FloorDetailsSection from './components/FloorDetailsSection';
import PropertyDetails from './components/PropertyDetails';
import { handleValidation, scrollToInput } from './AssessmentValidation';
import { showToast } from '../../../utils/toast';
import { validateAssessmentForm } from './utils/assessmentValidation';
import {
  fetchMasterData as fetchMasterDataApi,
  fetchNewWardByOldWard as fetchNewWardByOldWardApi,
  fetchApartments as fetchApartmentsApi,
  submitAssessment as submitAssessmentApi,
  fetchSwmSubCategory as fetchSwmSubCategoryApi,
  fetchSwmRate as fetchSwmRateApi,
} from './utils/assessmentApi';
import SWMDetailsSection from './components/SWMDetailsSection';
import Colors from '../../Constants/Colors';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import { Ulb_Api } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import { getUserDetails } from '../../../utils/auth';
import LocationPhotoSection from '../../../Components/LocationPhotoSection';
const ApplyAssessment = ({ navigation, route }) => {
  // Route params removed - this is now only for New Assessment
  const [swmSubCategoryList, setSwmSubCategoryList] = useState([]);

  const [waterConnectionFacility, setWaterConnectionFacility] = useState(null);
  const [waterTaxType, setWaterTaxType] = useState(null);
  // All state variables
  const [newWardLabel, setNewWardLabel] = useState('');
  const [waterConnectionNo, setWaterConnectionNo] = useState('');
  const [waterConnectionDate, setWaterConnectionDate] = useState('');
  const [propertyTypeLabel, setPropertyTypeLabel] = useState('');
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
  const [buildArea, setBuildArea] = useState('');
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [electricityCategory, setElectricityCategory] = useState('');
  const [mobileTower, setMobileTower] = useState('no');
  const [hoarding, setHoarding] = useState('no');
  const [petrolPump, setPetrolPump] = useState('no');
  const [rainHarvesting, setRainHarvesting] = useState('no');
  const [data, setData] = useState(null);
  const [zone, setZone] = useState('');
  const [zoneLabel, setZoneLabel] = useState('');
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
  const [error, setError] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apartmentList, setApartmentList] = useState([]);
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(false);

  const [possessionDate, setPossessionDate] = useState(null);
  const [showPossessionDatePicker, setShowPossessionDatePicker] =
    useState(false);

  // Track touched fields
  const [touchedFields, setTouchedFields] = useState({});

  // MULTIPLE OWNERS STATE
  const [ownerDetails, setOwnerDetails] = useState([
    {
      ownerName: '',
      gender: '',
      dob: '',
      guardianName: '',
      relation: '',
      mobile: '',
      aadhaar: '',
      pan: '',
      email: '',
      armedForces: 'no',
      speciallyAbled: 'no',
    },
  ]);

  // Date picker for owners
  const [ownerDatePicker, setOwnerDatePicker] = useState({
    index: null,
    show: false,
  });
  // State for SWM (Solid Waste Management) Consumer checkbox
  // SWM MULTIPLE STATE (replace swanConsumerDetails)
  const [isSwanChecked, setIsSwanChecked] = useState(false);

  const [swmConsumers, setSwmConsumers] = useState([
    {
      occupancyType: '',
      consumerName: '',
      guardianName: '',
      relation: '',
      mobileNo: '',
      consumerCategory: '',
      category: 'APL',
      consumerRange: '',
      effectiveFrom: '',
      monthlyRate: '',
    },
  ]);

  const [showPhotoSection, setShowPhotoSection] = useState(false);

  // State to hold data from component
  const [capturedData, setCapturedData] = useState({
    location: null,
    left: null,
    right: null,
    front: null,
  });

  // Inside ApplyAssessment.js
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

  const [ulbData, setUlbData] = useState('');

  useEffect(() => {
    fetchUlbDetails();
  }, []);

  const fetchUlbDetails = async () => {
    try {
      const token = await getToken();
      const user = await getUserDetails();
      const ulbId = user?.ulbId;
      console.log('user', user);

      if (!token || !ulbId) return;

      const response = await axios.post(Ulb_Api(ulbId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('user Datails Applu', response?.data?.data);
      setUlbData(response?.data?.data);
      setCity(response?.data?.data?.city);
      setDistrict(response?.data?.data?.district);
      setState(response?.data?.data?.state);
    } catch (error) {
      console.log('❌ ULB API Error:', error?.response || error);
    }
  };

  const handleSwanCheckboxToggles = () => {
    setIsSwanChecked(prev => !prev);
  };

  const addSwmConsumer = () => {
    setSwmConsumers(prev => [
      ...prev,
      {
        occupancyType: '',
        consumerName: '',
        guardianName: '',
        relation: '',
        mobileNo: '',
        consumerCategory: '',
        category: 'APL',
        consumerRange: '',
        effectiveFrom: '',
        monthlyRate: '',
      },
    ]);
  };

  const removeSwmConsumer = index => {
    if (swmConsumers.length === 1) {
      showToast('error', 'At least one SWM consumer is required');
      return;
    }
    setSwmConsumers(prev => prev.filter((_, i) => i !== index));
  };

  const updateSwmConsumer = (index, field, value) => {
    setSwmConsumers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });

    const errorKey = `swm_${index}_${field}`;
    clearFieldError(errorKey);
  };

  useEffect(() => {
    swmConsumers.forEach((consumer, index) => {
      if (consumer.consumerCategory !== 1 && consumer.category !== 'APL') {
        updateSwmConsumer(index, 'category', 'APL');
      }
    });
  }, [swmConsumers]);

  // const isCategoryEditable = swanConsumerDetails.consumerCategory === 1;

  const handleSwanCheckboxToggle = () => {
    setIsSwanChecked(prev => !prev);
  };

  const apartmentDropdownOptions = [
    { label: 'Apartment A', value: 'A' },
    { label: 'Apartment B', value: 'B' },
  ];

  // Create refs for all form fields
  const scrollViewRef = useRef(null);

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
  const [datePicker, setDatePicker] = useState({
    index: null,
    field: '',
    show: false,
  });

  // NEW: Mark field as touched
  const markFieldAsTouched = fieldName => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  // NEW: Validate single field
  const validateField = (fieldName, value) => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,./-]+$/;

    switch (fieldName) {
      case 'oldWard':
        return !value ? 'Ward No is required' : '';
      // case 'newWard':
      //   return !value ? 'New Ward is required' : '';
      case 'ownershipType':
        return !value ? 'Ownership Type is required' : '';
      case 'propertyType':
        return !value ? 'Property Type is required' : '';
      case 'zone':
        return !value ? 'Zone is required' : '';
      // case 'khataNo':
      //   if (!value) return 'Khata No is required';
      //   if (!addressRegex.test(value)) return 'Invalid Khata No';
      //   return '';
      // case 'plotNo':
      //   if (!value) return 'Plot No is required';
      //   if (!addressRegex.test(value)) return 'Invalid Plot No';
      //   return '';
      case 'villageName':
        if (!value) return 'Village Name is required';
        if (!alphabetRegex.test(value))
          return 'Village Name must contain only letters';
        return '';
      case 'plotArea':
        if (!value) return 'Plot Area is required';
        if (isNaN(value)) return 'Plot Area must be a number';
        return '';
      case 'buildArea': // ADD THIS CASE
        if (!value) return 'Built-up Area is required';
        if (isNaN(value)) return 'Built-up Area must be a number';
        if (Number(value) <= 0) return 'Built-up Area must be greater than 0';
        if (!/^\d+(\.\d{1,2})?$/.test(value))
          return 'Invalid format. Use numbers only (up to 2 decimals)';
        return '';
      case 'roadWidth':
        if (!value) return 'Road Type is required';
        if (isNaN(value)) return 'Road Type must be a number';
        if (Number(value) > 499)
          return 'Road Type must not be greater than 499';
        return '';
      default:
        return '';
    }
  };

  const formatDDMMYYYY = date => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}-${d.getFullYear()}`;
  };

  // NEW: Validate owner field
  const validateOwnerField = (index, fieldName, value) => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;

    switch (fieldName) {
      case 'ownerName':
        if (!value) return 'Owner Name is required';
        if (!nameRegex.test(value))
          return 'Owner Name can only contain letters and spaces';
        return '';
      case 'guardianName':
        if (!value) return 'Guardian Name is required';
        if (!nameRegex.test(value))
          return 'Guardian Name can only contain letters and spaces';
        return '';
      case 'relation':
        return !value ? 'Relation is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'dob':
        return !value ? 'Date of Birth is required' : '';
      case 'mobile':
        if (!value) return 'Mobile is required';
        if (!/^\d{10}$/.test(value)) return 'Mobile number must be 10 digits';
        return '';
      default:
        return '';
    }
  };

  // NEW: Validate floor field
  const validateFloorField = (index, fieldName, value) => {
    switch (fieldName) {
      case 'floorName':
        return !value ? 'Floor name is required' : '';
      case 'usageType':
        return !value ? 'Usage type is required' : '';
      case 'constructionType':
        return !value ? 'Construction type is required' : '';
      case 'occupancyType':
        return !value ? 'Occupancy type is required' : '';
      case 'builtUpArea':
        if (!value || value <= 0)
          return 'Built-up area is required and must be > 0';
        return '';
      case 'fromDate':
        return !value ? 'Start date is required' : '';
      default:
        return '';
    }
  };

  // OWNER FUNCTIONS
  const updateOwnerDetail = (index, field, value) => {
    const updated = [...ownerDetails];
    updated[index][field] = value;
    setOwnerDetails(updated);

    // Real-time validation
    const errorKey = `${field}_${index}`;
    markFieldAsTouched(errorKey);
    const fieldError = validateOwnerField(index, field, value);

    if (fieldError) {
      setError(prev => ({ ...prev, [errorKey]: fieldError }));
    } else {
      clearFieldError(errorKey);
    }
  };

  const addOwner = () => {
    setOwnerDetails(prev => [
      ...prev,
      {
        ownerName: '',
        gender: '',
        dob: '',
        guardianName: '',
        relation: '',
        mobile: '',
        aadhaar: '',
        pan: '',
        email: '',
        armedForces: 'no',
        speciallyAbled: 'no',
      },
    ]);
  };

  const removeOwner = index => {
    if (ownerDetails.length > 1) {
      const updated = ownerDetails.filter((_, i) => i !== index);
      setOwnerDetails(updated);

      // Remove errors for this owner
      const newErrors = { ...error };
      Object.keys(newErrors).forEach(key => {
        if (key.endsWith(`_${index}`)) {
          delete newErrors[key];
        }
      });
      setError(newErrors);
    } else {
      showToast('error', 'At least one owner is required');
    }
  };

  const handleOwnerDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      const { index } = ownerDatePicker;
      updateOwnerDetail(index, 'dob', formatted);
    }
    setOwnerDatePicker({ index: null, show: false });
  };

  const updateFloorDetail = (index, field, value) => {
    const updated = [...floorDetails];
    updated[index][field] = value;
    setFloorDetails(updated);

    // Real-time validation for floors
    const errorKey = `floor_${index}_${field}`;
    markFieldAsTouched(errorKey);
    const fieldError = validateFloorField(index, field, value);

    if (fieldError) {
      setError(prev => ({ ...prev, [errorKey]: fieldError }));
    } else {
      clearFieldError(errorKey);
    }
  };

  const handleDateChange1 = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formatted = `${month}/${year}`;
      const { index, field } = datePicker;
      updateFloorDetail(index, field, formatted);
    }
    setDatePicker({ index: null, field: '', show: false });
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

  const removeFloor = index => {
    if (floorDetails.length > 1) {
      const updated = floorDetails.filter((_, i) => i !== index);
      setFloorDetails(updated);

      // Remove errors for this floor
      const newErrors = { ...error };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`floor_${index}_`)) {
          delete newErrors[key];
        }
      });
      setError(newErrors);
    } else {
      showToast('error', 'At least one floor is required');
    }
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  // Fetch Apartments from API when Flats is selected
  const fetchApartments = useCallback(async () => {
    try {
      setLoadingApartments(true);
      const result = await fetchApartmentsApi(oldWard);
      if (result.success) {
        setApartmentList(result.data);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoadingApartments(false);
    }
  }, [oldWard]);

  useEffect(() => {
    if (propertyType === 1 && oldWard) {
      fetchApartments();
    }
  }, [propertyType, oldWard, fetchApartments]);

  // Modified field change handlers with real-time validation
  const handleFieldChange = (fieldName, value, setter) => {
    setter(value);
    markFieldAsTouched(fieldName);

    const fieldError = validateField(fieldName, value);
    if (fieldError) {
      setError(prev => ({ ...prev, [fieldName]: fieldError }));
    } else {
      clearFieldError(fieldName);
    }
  };

  const Validate = async () => {
    let isValid = true;
    let swmErrors = {};
    let newErrors = {};

    if (!capturedData.location) {
      showToast(
        'error',
        'Location coordinates are required. Please tap "Get Current Location".',
      );
      return false;
    }

    if (isSwanChecked) {
      swmConsumers.forEach((consumer, index) => {
        const baseKey = `swm_${index}`;

        if (!consumer.occupancyType) {
          swmErrors[`${baseKey}_occupancyType`] = 'Occupancy Type is required';
          isValid = false;
        }

        if (!consumer.consumerName) {
          swmErrors[`${baseKey}_consumerName`] = 'Consumer Name is required';
          isValid = false;
        }

        if (!consumer.guardianName) {
          swmErrors[`${baseKey}_guardianName`] = 'Guardian Name is required';
          isValid = false;
        }

        if (!consumer.mobileNo) {
          swmErrors[`${baseKey}_mobileNo`] = 'Mobile number is required';
          isValid = false;
        } else if (!/^\d{10}$/.test(consumer.mobileNo)) {
          swmErrors[`${baseKey}_mobileNo`] = 'Mobile number must be 10 digits';
          isValid = false;
        }

        if (!consumer.consumerCategory) {
          swmErrors[`${baseKey}_consumerCategory`] =
            'Consumer Category is required';
          isValid = false;
        }

        if (!consumer.consumerRange) {
          swmErrors[`${baseKey}_consumerRange`] = 'Consumer Range is required';
          isValid = false;
        }
        if (!consumer.effectiveFrom) {
          swmErrors[`${baseKey}_effectiveFrom`] =
            'effectiveFrom Date is required';
          isValid = false;
        }

        if (!consumer.relation) {
          swmErrors[`${baseKey}_relation`] = 'Relation is required';
          isValid = false;
        }
      });
    }

    if (Object.keys(swmErrors).length > 0) {
      setError(prev => ({ ...prev, ...swmErrors }));
      showToast('error', 'Please fill all SWM consumer details');
      return false;
    }

    // 🔹 existing validation
    return validateAssessmentForm({
      oldWard,
      ownershipType,
      propertyType,
      zone,
      buildArea,
      ownerDetails,
      khataNo,
      plotNo,
      villageName,
      plotArea,
      roadWidth,
      propertyAddress,
      city,
      district,
      state,
      pincode,
      mobileTower,
      towerArea,
      installationDate,
      hoarding,
      hoardingArea,
      hoardingInstallationDate,
      petrolPump,
      pumpArea,
      pumpInstallationDate,
      rainHarvesting,
      completionDate,
      propertyTypeLabel,
      floorDetails,
      waterConnectionFacility,
      waterTaxType,
      isSwanChecked,
      swmConsumers,
      setError,
      showToast,
    });
  };

  const clearFieldError = fieldName => {
    setError(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  function formatDate1(dateInput) {
    if (!dateInput) return '';
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0];
    }
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length !== 3) return '';
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    if (dateInput.includes('-') && dateInput.length === 10) {
      return dateInput;
    }
    return '';
  }

  // const handleSubmit = async () => {
  //   const isValid = await Validate();
  //   if (!isValid) return;

  //   const formData = new FormData();

  //   // 1. Map and Append geoTag (Images + Coordinates)
  //   const geoTagArray = [];
  //   const sides = ['left', 'right', 'front'];

  //   sides.forEach(side => {
  //     const photo = capturedData[side];
  //     if (photo && capturedData.location) {
  //       geoTagArray.push({
  //         direction: `${side} side`,
  //         latitude: capturedData.location.latitude,
  //         longitude: capturedData.location.longitude,
  //         // NOTE: In a plain object, this will likely fail unless your
  //         // submitAssessmentApi function converts this to FormData internally.
  //         document: {
  //           uri: photo.uri,
  //           name: photo.fileName || `${side}.jpg`,
  //           type: photo.type || 'image/jpeg',
  //         },
  //       });
  //     }
  //   });
  //   console.log('GeoTag entries added:', geoIndex);

  //   // 2. Prepare SWM Consumer Payload

  //   const swmConsumerPayload = isSwanChecked
  //     ? swmConsumers.map(consumer => ({
  //         index: '',
  //         id: '',
  //         categoryTypeMasterId: String(consumer.consumerCategory),
  //         subCategoryTypeMasterId: String(consumer.consumerRange),
  //         occupancyTypeMasterId: String(consumer.occupancyType),

  //         category: consumer.category,
  //         ownerName: consumer.consumerName,
  //         guardianName: consumer.guardianName,
  //         relationType: consumer.relation,
  //         mobileNo: consumer.mobileNo,

  //         dateOfEffective: consumer.effectiveFrom,
  //         rate: String(consumer.monthlyRate),
  //         lockStatus: false,
  //       }))
  //     : [];

  //   const payload = {
  //     waterConnectionFacilityTypeId: waterConnectionFacility,
  //     waterTaxTypeId: waterTaxType,

  //     roadTypeMstrId: roadWidth,

  //     newWardLabel,
  //     zoneLabel,
  //     assessmentType: 'New Assessment',
  //     zoneMstrId: zone,
  //     wardMstrId: oldWard,
  //     newWardMstrId: newWard,
  //     ownershipTypeMstrId: ownershipType,
  //     electAccNo: khataNo,
  //     electBindBookNo: bindBookNo,
  //     electConsCategory: electricityCategory,
  //     electConsumerNo: kno,
  //     waterConnDate: waterConnectionDate,
  //     waterConnNo: waterConnectionNo,
  //     propTypeMstrId: propertyType,
  //     appartmentDetailsId: apartmentDetail || '',
  //     flatRegistryDate: selectedDate
  //       ? selectedDate.toISOString().split('T')[0]
  //       : '',
  //     roadWidth: roadWidth,
  //     khataNo: khataNo,
  //     plotNo: plotNo,
  //     villageMaujaName: villageName,
  //     areaOfPlot: plotArea,
  //     propAddress: propertyAddress,
  //     propCity: city,
  //     propDist: district,

  //     builtupArea: buildArea,
  //     propPinCode: pincode,
  //     propState: state,
  //     swmConsumer: swmConsumerPayload,
  //     isMobileTower: mobileTower === 'yes' ? '1' : '0',
  //     ...(mobileTower === 'yes' && {
  //       towerArea: parseInt(towerArea || 50),
  //       towerInstallationDate: installationDate
  //         ? formatDate1(installationDate)
  //         : '',
  //     }),
  //     isHoardingBoard: hoarding === 'yes' ? '1' : '0',
  //     ...(hoarding === 'yes' && {
  //       hoardingArea: hoardingArea ? String(hoardingArea) : '50',
  //       hoardingInstallationDate: hoardingInstallationDate
  //         ? formatDate1(hoardingInstallationDate)
  //         : '',
  //     }),
  //     isPetrolPump: petrolPump === 'yes' ? '1' : '0',
  //     ...(petrolPump === 'yes' && {
  //       underGroundArea: pumpArea ? String(pumpArea) : '25',
  //       petrolPumpCompletionDate: pumpInstallationDate
  //         ? formatDate1(pumpInstallationDate)
  //         : '',
  //     }),
  //     isWaterHarvesting: rainHarvesting === 'yes' ? '1' : '0',
  //     ...(rainHarvesting === 'yes' && {
  //       waterHarvestingDate: completionDate ? formatDate1(completionDate) : '',
  //     }),
  //     landOccupationDate: completionDate
  //       ? formatDate1(completionDate)
  //       : '2021-02-03',
  //     ownerDtl: (ownerDetails || []).map(owner => ({
  //       ownerName: owner.ownerName,
  //       guardianName: owner.guardianName,
  //       mobileNo: owner.mobile,
  //       relationType: owner.relation,
  //       gender: owner.gender,
  //       dob: owner.dob,
  //       isArmedForce: owner.isArmedForce ? 1 : 0,
  //       isSpeciallyAbled: owner.isSpeciallyAbled ? 1 : 0,
  //     })),
  //     floorDtl:
  //       propertyTypeLabel !== 'VACANT LAND'
  //         ? (floorDetails || []).map(floor => ({
  //             builtupArea:
  //               floor.builtUpArea !== undefined && floor.builtUpArea !== ''
  //                 ? parseFloat(floor.builtUpArea)
  //                 : null,

  //             dateFrom: floor.fromDate,
  //             dateUpto1: floor.uptoDate,
  //             floorMasterId: floor.floorName,
  //             usageTypeMasterId: floor.usageType,
  //             constructionTypeMasterId: floor.constructionType,
  //             occupancyTypeMasterId: floor.occupancyType,
  //           }))
  //         : [],

  //     geoTag: geoTagArray,
  //   };

  //   console.log('--- OLD TYPE PAYLOAD LOG ---');
  //   console.log(JSON.stringify(payload, null, 2));
  //   const result = await submitAssessmentApi(payload);

  //   if (result.success) {
  //     showToast('success', result.message);
  //     navigation.navigate('AssessmentSummary', {
  //       data: payload,
  //       masterData: data,
  //     });
  //   } else {
  //     showToast('error', result.message || 'Submission failed');
  //   }
  // };
  const handleSubmit = async () => {
    const isValid = await Validate();
    if (!isValid) return;

    // 1. Build the geoTag array with document objects
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

    // 2. Construct the Payload (Fixing all "field is required" errors)
    const payload = {
      // Mandatory Fields from your error log
      assessmentType: 'New Assessment',
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

      // Property Details
      khataNo: khataNo,
      plotNo: plotNo,
      villageMaujaName: villageName,
      areaOfPlot: plotArea,
      builtupArea: buildArea,
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
      ownerDtl: (ownerDetails || []).map(owner => ({
        ownerName: owner.ownerName,
        guardianName: owner.guardianName,
        mobileNo: owner.mobile,
        relationType: owner.relation,
        gender: owner.gender,
        dob: owner.dob,
        isArmedForce: owner.armedForces === 'yes' ? 1 : 0,
        isSpeciallyAbled: owner.speciallyAbled === 'yes' ? 1 : 0,
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
            }))
          : [],

      // The GeoTag Array
      geoTag: geoTagArray,
    };

    console.log('--- SUBMITTING OLD TYPE PAYLOAD ---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('payload  ssss', payload);
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

    // Update result handling based on your API response structure
    if (result && (result.status || result.success)) {
      showToast('success', result.message || 'Submitted successfully');
      navigation.navigate('AssessmentSummary', {
        data: payload,
        masterData: data,
      });
    } else {
      // Log specific errors from backend if available
      console.log('Backend Validation Errors:', result);
      showToast('error', result?.message || 'Submission failed');
    }
  };
  useEffect(() => {
    const loadMasterData = async () => {
      const result = await fetchMasterDataApi();
      if (result.success) {
        setData(result.data);
      }
    };
    loadMasterData();
  }, []);

  useEffect(() => {
    if (oldWard) {
      const loadNewWards = async () => {
        const result = await fetchNewWardByOldWardApi(oldWard);
        if (result.success) {
          setNewWardOptions(result.data);
        } else {
          setNewWardOptions([]);
        }
      };
      loadNewWards();
    }
  }, [oldWard]);

  useEffect(() => {
    if (!isSwanChecked) return;

    const consumer = swmConsumers[0];
    if (!consumer?.consumerCategory) return;

    const fetchSub = async () => {
      const res = await fetchSwmSubCategoryApi({
        categoryTypeMasterId: consumer.consumerCategory,
      });

      if (res?.success) {
        setSwmSubCategoryList(res.data);
      }
    };

    fetchSub();
  }, [isSwanChecked, swmConsumers[0]?.consumerCategory]);
  useEffect(() => {
    if (!isSwanChecked) return;

    swmConsumers.forEach((consumer, index) => {
      if (!consumer.consumerRange || !consumer.category) return;

      const fetchRate = async () => {
        const res = await fetchSwmRateApi({
          subCategoryTypeMasterId: consumer.consumerRange,
          category: consumer.category,
        });

        if (res?.success && consumer.monthlyRate !== res.data.ratePerMonth) {
          setSwmConsumers(prev => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              monthlyRate: res.data.ratePerMonth,
            };
            return updated;
          });
        }
      };

      fetchRate();
    });
  }, [
    isSwanChecked,
    swmConsumers.map(c => c.consumerRange).join(','),
    swmConsumers.map(c => c.category).join(','),
  ]);
  useEffect(() => {
    if (!isSwanChecked) return;

    let changed = false;

    const updated = swmConsumers.map(c => {
      if (c.consumerCategory !== 1 && c.category !== 'APL') {
        changed = true;
        return { ...c, category: 'APL' };
      }
      return c;
    });

    if (changed) {
      setSwmConsumers(updated);
    }
  }, [isSwanChecked, swmConsumers.map(c => c.consumerCategory).join(',')]);

  // const floorNameOptions =
  //   data?.floorType?.map(floor => ({
  //     label: floor.floorName,
  //     value: floor.id,
  //   })) || [];

  const floorNameOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.floorType?.map(floor => ({
      label: floor.floorName,
      value: floor.id,
    })) || []),
  ];

  const constructionTypeOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.constructionType?.map(item => ({
      label: item.constructionType,
      value: item.id,
    })) || []),
  ];

  const zoneType1 =
    data?.zoneType?.map(zoneType => ({
      label: zoneType.zoneName,
      value: zoneType.id,
    })) || [];

  const zoneType = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.zoneType?.map(zoneType => ({
      label: zoneType.zoneName,
      value: zoneType.id,
    })) || []),
  ];

  const usageTypeOptions1 =
    data?.usageType?.map(usetype => ({
      label: usetype.usageType,
      value: usetype.id,
    })) || [];
  const usageTypeOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.usageType?.map(usetype => ({
      label: usetype.usageType,
      value: usetype.id,
    })) || []),
  ];

  const swmSubCategoryOptions =
    swmSubCategoryList.map(item => ({
      label: item.subCategoryType,
      value: item.id,
    })) || [];

  const occupancyTypeOptions1 =
    data?.occupancyType?.map(occupy => ({
      label: occupy.occupancyName,
      value: occupy.id,
    })) || [];
  const occupancyTypeOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.occupancyType?.map(occupy => ({
      label: occupy.occupancyName,
      value: occupy.id,
    })) || []),
  ];

  const constructionTypeOptions1 =
    data?.constructionType?.map(cunstruct => ({
      label: cunstruct.constructionType,
      value: cunstruct.id,
    })) || [];

  const wardDropdownOptions1 =
    data?.wardList?.map(ward => ({
      label: ward?.wardNo,
      value: ward?.id,
    })) || [];

  const wardDropdownOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.wardList?.map(ward => ({
      label: ward?.wardNo,
      value: ward?.id,
    })) || []),
  ];

  const ownershipDropdownOptions1 =
    data?.ownershipType?.map(item => ({
      label: item.ownershipType,
      value: item.id,
    })) || [];

  const ownershipDropdownOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.ownershipType?.map(item => ({
      label: item.ownershipType,
      value: item.id,
    })) || []),
  ];

  const propertyTypeDropdownOptions1 =
    data?.propertyType?.map(item => ({
      label: item.propertyType,
      value: item.id,
    })) || [];

  const propertyTypeDropdownOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.propertyType?.map(item => ({
      label: item.propertyType,
      value: item.id,
    })) || []),
  ];

  // console.log("dgbkjdgbskdbgsd",propertyTypeDropdownOptions);

  const genderOptions = [
    { label: 'select', value: '' },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const yesNoOptions = [
    { label: 'select', value: '' },
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const selectRelation = [
    { label: 'select', value: '' },

    { label: 'S/O', value: 'S/O' },
    { label: 'D/O', value: 'D/O' },
    { label: 'W/O', value: 'W/O' },
    { label: 'F/O', value: 'F/O' },
  ];

  const waterConnectionFacilityOptions1 =
    data?.waterFacility?.map(item => ({
      label: item.facilityType,
      value: item.id,
    })) || [];

  const waterConnectionFacilityOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.waterFacility?.map(item => ({
      label: item.facilityType,
      value: item.id,
    })) || []),
  ];

  const waterTaxTypeOptions1 =
    data?.waterTax?.map(item => ({
      label: item.taxType,
      value: item.id,
    })) || [];

  const waterTaxTypeOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.waterTax?.map(item => ({
      label: item.taxType,
      value: item.id,
    })) || []),
  ];

  const selectelectcate =
    data?.electricityType?.map((item, index) => ({
      label: item,
      value: item,
    })) || [];

  const roadWidthOptions1 =
    data?.roadType?.map(item => ({
      label: item.roadType,
      value: item.id,
    })) || [];

  const roadWidthOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.roadType?.map(item => ({
      label: item.roadType,
      value: item.id,
    })) || []),
  ];

  const fromDateOptions1 =
    data?.fyearList?.map(item => ({
      label: item.fyear, // "2025-04"
      value: item.fromDate,
    })) || [];
  const fromDateOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.fyearList?.map(item => ({
      label: item.fyear, // "2025-04"
      value: item.fromDate,
    })) || []),
  ];

  const uptoDateOptions1 =
    data?.fyearList?.map(item => ({
      label: item.fyear, // "2026-03"
      value: item.uptoDate,
    })) || [];

  const uptoDateOptions = [
    { label: 'Select', value: null }, // ✅ first option
    ...(data?.fyearList?.map(item => ({
      label: item.fyear, // "2026-03"
      value: item.uptoDate,
    })) || []),
  ];

  const swmConsumerType =
    data?.swmConsumerType?.map(item => ({
      label: item.categoryType,
      value: item.id,
    })) || [];

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        {/* Assessment Type Section */}
        <Text style={styles.cardTitle}>New Assessment</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Details</Text>

            <Text style={[styles.label, error.oldWard && styles.errorLabel]}>
              Ward No *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.oldWard && styles.errorInput]}
              data={wardDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderTextColor="grey"
              value={oldWard}
              onChange={item => {
                handleFieldChange('oldWard', item.value, setOldWard);
              }}
            />
            {error.oldWard && (
              <Text style={styles.errorText}>{error.oldWard}</Text>
            )}

            {/* <Text style={[styles.label, error.newWard && styles.errorLabel]}>
              New Ward *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.newWard && styles.errorInput]}
              data={newWardOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderTextColor="grey"
              value={newWard}
              onChange={item => {
                setNewWard(item.value);
                setNewWardLabel(item.label);
                markFieldAsTouched('newWard');
                clearFieldError('newWard');
              }}
            />
            {error.newWard && (
              <Text style={styles.errorText}>{error.newWard}</Text>
            )} */}

            <Text
              style={[styles.label, error.ownershipType && styles.errorLabel]}
            >
              Ownership Type *
            </Text>
            <Dropdown
              style={[
                styles.dropdown,
                error.ownershipType && styles.errorInput,
              ]}
              data={ownershipDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderTextColor="grey"
              value={ownershipType}
              onChange={item => {
                handleFieldChange(
                  'ownershipType',
                  item.value,
                  setOwnershipType,
                );
              }}
            />
            {error.ownershipType && (
              <Text style={styles.errorText}>{error.ownershipType}</Text>
            )}

            <Text
              style={[styles.label, error.propertyType && styles.errorLabel]}
            >
              Property Type *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.propertyType && styles.errorInput]}
              data={propertyTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderTextColor="grey"
              value={propertyType}
              onChange={item => {
                setPropertyType(item.value);
                setPropertyTypeLabel(item.label);
                markFieldAsTouched('propertyType');
                clearFieldError('propertyType');
              }}
            />
            {error.propertyType && (
              <Text style={styles.errorText}>{error.propertyType}</Text>
            )}
            {(propertyType === 3 || propertyType === 4) && (
              <>
                <Text style={styles.label}>
                  Date of Possession / Purchase / Acquisition (Whichever is
                  earlier) *
                </Text>

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowPossessionDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {possessionDate
                      ? formatDDMMYYYY(possessionDate)
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {showPossessionDatePicker && (
              <DateTimePicker
                value={possessionDate ? new Date(possessionDate) : new Date()}
                mode="date"
                maximumDate={new Date()}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowPossessionDatePicker(false);
                  if (date) setPossessionDate(date);
                }}
              />
            )}

            {propertyType === 1 && (
              <View>
                <Text
                  style={[
                    styles.label,
                    error.ownershipType && styles.errorLabel,
                  ]}
                >
                  Select Flat Registry Date *
                </Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {selectedDate
                      ? selectedDate.toISOString().split('T')[0]
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    maximumDate={new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange1}
                  />
                )}

                <Text
                  style={[
                    styles.label,
                    error.ownershipType && styles.errorLabel,
                  ]}
                >
                  Appartment Datails *
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    error.propertyType && styles.errorInput,
                  ]}
                  data={apartmentList}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Apartment"
                  value={apartmentDetail}
                  onChange={item => setApartmentDetail(item.value)}
                />
              </View>
            )}

            <Text style={[styles.label, error.zone && styles.errorLabel]}>
              Circe *
            </Text>
            <Dropdown
              style={[styles.dropdown, error.zone && styles.errorInput]}
              data={zoneType}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderTextColor="grey"
              value={zone}
              onChange={item => {
                setZone(item.value);
                setZoneLabel(item.label);
                markFieldAsTouched('zone');
                clearFieldError('zone');
              }}
            />
            {error.zone && <Text style={styles.errorText}>{error.zone}</Text>}
            <Text style={styles.infoText}>
              Zone 1: Over bridge to Saheed chowk.
            </Text>
            <Text style={styles.infoText}>
              Zone 2: Rest area other than Zone 1.
            </Text>
          </View>
        </View>

        {/* MULTIPLE OWNER DETAILS SECTION */}
        <View style={styles.cardContainer}>
          {ownerDetails.map((owner, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Owner Details</Text>

              <View style={styles.floorHeader}>
                <Text style={styles.floorTitle}>Owner {index + 1}</Text>
                {ownerDetails.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeOwner(index)}
                  >
                    <Text style={styles.removeBtnText}>Remove Owner</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  error[`ownerName_${index}`] && styles.errorLabel,
                ]}
              >
                Owner Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`ownerName_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Owner Name"
                value={owner.ownerName}
                onChangeText={value =>
                  updateOwnerDetail(index, 'ownerName', value)
                }
              />
              {error[`ownerName_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`ownerName_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`gender_${index}`] && styles.errorLabel,
                ]}
              >
                Gender *
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  error[`gender_${index}`] && styles.errorInput,
                ]}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={owner.gender}
                onChange={item =>
                  updateOwnerDetail(index, 'gender', item.value)
                }
              />
              {error[`gender_${index}`] && (
                <Text style={styles.errorText}>{error[`gender_${index}`]}</Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`dob_${index}`] && styles.errorLabel,
                ]}
              >
                Date of Birth *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  error[`dob_${index}`] && styles.errorInput,
                ]}
                onPress={() => setOwnerDatePicker({ index, show: true })}
              >
                <Text style={styles.dateText}>
                  {owner.dob || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              {error[`dob_${index}`] && (
                <Text style={styles.errorText}>{error[`dob_${index}`]}</Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`guardianName_${index}`] && styles.errorLabel,
                ]}
              >
                Guardian Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`guardianName_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Guardian Name"
                value={owner.guardianName}
                onChangeText={value =>
                  updateOwnerDetail(index, 'guardianName', value)
                }
              />
              {error[`guardianName_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`guardianName_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`relation_${index}`] && styles.errorLabel,
                ]}
              >
                Relation *
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  error[`relation_${index}`] && styles.errorInput,
                ]}
                data={selectRelation}
                labelField="label"
                valueField="value"
                placeholder="Select Relation"
                value={owner.relation}
                onChange={item =>
                  updateOwnerDetail(index, 'relation', item.value)
                }
              />
              {error[`relation_${index}`] && (
                <Text style={styles.errorText}>
                  {error[`relation_${index}`]}
                </Text>
              )}

              <Text
                style={[
                  styles.label,
                  error[`mobile_${index}`] && styles.errorLabel,
                ]}
              >
                Mobile Number *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  error[`mobile_${index}`] && styles.errorInput,
                ]}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                value={owner.mobile}
                onChangeText={value =>
                  updateOwnerDetail(index, 'mobile', value)
                }
                maxLength={10}
              />
              {error[`mobile_${index}`] && (
                <Text style={styles.errorText}>{error[`mobile_${index}`]}</Text>
              )}

              <Text style={styles.label}>Aadhaar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Aadhaar Number"
                keyboardType="numeric"
                value={owner.aadhaar}
                onChangeText={value =>
                  updateOwnerDetail(index, 'aadhaar', value)
                }
                maxLength={12}
              />

              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter PAN Number"
                value={owner.pan}
                onChangeText={value => updateOwnerDetail(index, 'pan', value)}
                maxLength={10}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                keyboardType="email-address"
                value={owner.email}
                onChangeText={value => updateOwnerDetail(index, 'email', value)}
              />

              <Text style={styles.label}>Armed Forces</Text>
              <Dropdown
                style={styles.dropdown}
                data={yesNoOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Armed Forces"
                value={owner.armedForces}
                onChange={item =>
                  updateOwnerDetail(index, 'armedForces', item.value)
                }
              />

              <Text style={styles.label}>Specially Abled</Text>
              <Dropdown
                style={styles.dropdown}
                data={yesNoOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Specially Abled"
                value={owner.speciallyAbled}
                onChange={item =>
                  updateOwnerDetail(index, 'speciallyAbled', item.value)
                }
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addOwner}>
            <Text style={styles.addBtnText}>Add Owner</Text>
          </TouchableOpacity>
        </View>

        {ownerDatePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            maximumDate={new Date()}
            onChange={handleOwnerDateChange}
          />
        )}

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Electricity Details</Text>

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
              // errors={{
              //   kno: !kno ? 'K. No is required' : '',
              //   accNo: !accNo ? 'ACC No is required' : '',
              //   electricityCategory: !electricityCategory
              //     ? 'Select a category'
              //     : '',
              // }}
            />
          </View>
        </View>

        {/* <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Water Connection Details</Text>
          <View style={styles.card}>
            <WaterConnectionDetailsSection
              waterConnectionNo={waterConnectionNo}
              setWaterConnectionNo={setWaterConnectionNo}
              waterConnectionDate={waterConnectionDate}
              setWaterConnectionDate={setWaterConnectionDate}
              showWaterConnectionDatePicker={showWaterConnectionDatePicker}
              setShowWaterConnectionDatePicker={
                setShowWaterConnectionDatePicker
              }
            />
          </View>
        </View> */}

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Property Details</Text>

            <PropertyDetails
              khataNo={khataNo}
              setKhataNo={value =>
                handleFieldChange('khataNo', value, setKhataNo)
              }
              plotNo={plotNo}
              setPlotNo={value => handleFieldChange('plotNo', value, setPlotNo)}
              villageName={villageName}
              setVillageName={value =>
                handleFieldChange('villageName', value, setVillageName)
              }
              plotArea={plotArea}
              setPlotArea={value =>
                handleFieldChange('plotArea', value, setPlotArea)
              }
              buildArea={buildArea}
              setBuildArea={value =>
                handleFieldChange('buildArea', value, setBuildArea)
              } // ✅ Also fix this
              roadWidth={roadWidth}
              setRoadWidth={value => {
                setRoadWidth(value); // Update state
                markFieldAsTouched('roadWidth'); // Mark as touched
                clearFieldError('roadWidth'); // Clear error
              }}
              roadWidthOptions={roadWidthOptions}
              showFieldAlert={msg => {}}
              styles={styles}
              errors={{
                // khataNo: error.khataNo || '',
                // plotNo: error.plotNo || '',
                villageName: error.villageName || '',
                plotArea: error.plotArea || '',
                roadWidth: error.roadWidth || '',
                buildArea: error.buildArea || '',
              }}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Property Address</Text>

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
              errors={{
                address: !propertyAddress ? 'Property Address is required' : '',
                city: !city ? 'City is required' : '',
                district: !district ? 'District is required' : '',
                stateValue: !state ? 'State is required' : '',
                pincode: !pincode ? 'Pincode is required' : '',
              }}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleCheckboxToggle}
          >
            <View style={[styles.checkbox, isChecked && styles.checked]} />
            <Text style={styles.checkboxLabel}>
              If Corresponding Address Different from Property Address
            </Text>
          </TouchableOpacity>
          {isChecked && (
            <View style={styles.card}>
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
                error={error}
              />
            </View>
          )}
        </View>

        <View style={styles.cardContainer}>
          {/* SWM Consumer Checkbox */}
          {propertyType !== 4 && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleSwanCheckboxToggles}
            >
              <View
                style={[styles.checkbox, isSwanChecked && styles.checked]}
              />
              <Text style={styles.checkboxLabel}>SWM Consumer Only</Text>
            </TouchableOpacity>
          )}

          {/* SWM MULTIPLE CONSUMER FORM */}
          {isSwanChecked && (
            <View>
              {swmConsumers.map((consumer, index) => (
                <View key={index} style={styles.card}>
                  {/* Header */}
                  <View style={styles.floorHeader}>
                    <Text style={styles.floorTitle}>
                      SWM Consumer {index + 1}
                    </Text>

                    {swmConsumers.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeSwmConsumer(index)}
                      >
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <SWMDetailsSection
                    occupancyType={consumer.occupancyType}
                    setOccupancyType={value =>
                      updateSwmConsumer(index, 'occupancyType', value)
                    }
                    consumerName={consumer.consumerName}
                    setConsumerName={value =>
                      updateSwmConsumer(index, 'consumerName', value)
                    }
                    guardianName={consumer.guardianName}
                    setGuardianName={value =>
                      updateSwmConsumer(index, 'guardianName', value)
                    }
                    relation={consumer.relation}
                    setRelation={value =>
                      updateSwmConsumer(index, 'relation', value)
                    }
                    mobileNo={consumer.mobileNo}
                    setMobileNo={value =>
                      updateSwmConsumer(index, 'mobileNo', value)
                    }
                    consumerCategory={consumer.consumerCategory}
                    setConsumerCategory={value =>
                      updateSwmConsumer(index, 'consumerCategory', value)
                    }
                    category={consumer.category}
                    setCategory={value =>
                      updateSwmConsumer(index, 'category', value)
                    }
                    consumerRange={consumer.consumerRange}
                    setConsumerRange={value =>
                      updateSwmConsumer(index, 'consumerRange', value)
                    }
                    effectiveFrom={consumer.effectiveFrom}
                    setEffectiveFrom={value =>
                      updateSwmConsumer(index, 'effectiveFrom', value)
                    }
                    monthlyRate={consumer.monthlyRate}
                    setMonthlyRate={value =>
                      updateSwmConsumer(index, 'monthlyRate', value)
                    }
                    occupancyTypeOptions={occupancyTypeOptions}
                    relationOptions={selectRelation}
                    consumerCategoryOptions={swmConsumerType}
                    consumerRangeOptions={swmSubCategoryOptions}
                    isCategoryEditable={consumer.consumerCategory === 1}
                    categoryOptions={[
                      { label: 'APL', value: 'APL' },
                      { label: 'BPL', value: 'BPL' },
                    ]}
                    styles={styles}
                    errors={{
                      occupancyType: error?.[`swm_${index}_occupancyType`],
                      consumerName: error?.[`swm_${index}_consumerName`],
                      guardianName: error?.[`swm_${index}_guardianName`],
                      mobileNo: error?.[`swm_${index}_mobileNo`],
                      consumerCategory:
                        error?.[`swm_${index}_consumerCategory`],
                      category: error?.[`swm_${index}_category`],
                      consumerRange: error?.[`swm_${index}_consumerRange`],

                      effectiveFrom: error?.[`swm_${index}_effectiveFrom`],
                      relation: error?.[`swm_${index}_relation`],
                    }}
                  />
                </View>
              ))}

              {/* ADD BUTTON */}
              <TouchableOpacity style={styles.addBtn} onPress={addSwmConsumer}>
                <Text style={styles.addBtnText}>Add SWM Consumer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Extra Charges</Text>

            <ExtraChargesSection
              propertyTypeId={propertyType}
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
              error={error}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          {propertyTypeLabel !== 'VACANT LAND' && (
            <>
              {floorDetails.map((floor, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>Floor Details</Text>

                  <View style={styles.floorHeader}>
                    <Text style={styles.floorTitle}>Floor {index + 1}</Text>
                    {floorDetails.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeFloor(index)}
                      >
                        <Text style={styles.removeBtnText}>Remove Floor</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_floorName`] && styles.errorLabel,
                    ]}
                  >
                    Floor Name *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_floorName`] && styles.errorInput,
                    ]}
                    data={floorNameOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.floorName}
                    onChange={item =>
                      updateFloorDetail(index, 'floorName', item.value)
                    }
                  />
                  {error[`floor_${index}_floorName`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_floorName`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_usageType`] && styles.errorLabel,
                    ]}
                  >
                    Usage Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_usageType`] && styles.errorInput,
                    ]}
                    data={usageTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.usageType}
                    onChange={item =>
                      updateFloorDetail(index, 'usageType', item.value)
                    }
                  />
                  {error[`floor_${index}_usageType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_usageType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_occupancyType`] &&
                        styles.errorLabel,
                    ]}
                  >
                    Occupancy Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_occupancyType`] &&
                        styles.errorInput,
                    ]}
                    data={occupancyTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.occupancyType}
                    onChange={item =>
                      updateFloorDetail(index, 'occupancyType', item.value)
                    }
                  />
                  {error[`floor_${index}_occupancyType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_occupancyType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_constructionType`] &&
                        styles.errorLabel,
                    ]}
                  >
                    Construction Type *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_constructionType`] &&
                        styles.errorInput,
                    ]}
                    data={constructionTypeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.constructionType}
                    onChange={item =>
                      updateFloorDetail(index, 'constructionType', item.value)
                    }
                  />
                  {error[`floor_${index}_constructionType`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_constructionType`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_builtUpArea`] && styles.errorLabel,
                    ]}
                  >
                    Built Up Area (Sq Ft) *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      error[`floor_${index}_builtUpArea`] && styles.errorInput,
                    ]}
                    placeholder="Enter Built Up Area"
                    placeholderStyle={{ color: 'grey' }}
                    keyboardType="numeric"
                    value={floor.builtUpArea}
                    onChangeText={value =>
                      updateFloorDetail(index, 'builtUpArea', value)
                    }
                  />
                  {error[`floor_${index}_builtUpArea`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_builtUpArea`]}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.label,
                      error[`floor_${index}_fromDate`] && styles.errorLabel,
                    ]}
                  >
                    From Date *
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      error[`floor_${index}_fromDate`] && styles.errorInput,
                    ]}
                    data={fromDateOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select From Date"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.fromDate}
                    onChange={item =>
                      updateFloorDetail(index, 'fromDate', item.value)
                    }
                  />
                  {error[`floor_${index}_fromDate`] && (
                    <Text style={styles.errorText}>
                      {error[`floor_${index}_fromDate`]}
                    </Text>
                  )}

                  <Text style={styles.label}>Up to Date</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={uptoDateOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Up to Date"
                    placeholderStyle={{ color: 'grey' }}
                    value={floor.uptoDate}
                    onChange={item =>
                      updateFloorDetail(index, 'uptoDate', item.value)
                    }
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addBtn} onPress={addFloor}>
                <Text style={styles.addBtnText}>Add Floor</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {datePicker.show && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={new Date()}
            onChange={handleDateChange}
          />
        )}

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
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.white,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
    paddingLeft: 6,
    backgroundColor: '#2c3e50',
    paddingVertical: 6,
    borderRadius: 6,
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
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#e74c3c',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorLabel: {
    color: '#e74c3c',
  },
  infoText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  dropdown: {
    height: 50,
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
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
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 4,
    marginRight: 12,
  },
  checked: {
    backgroundColor: '#3498db',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flexShrink: 1,
    fontWeight: '500',
  },
  dateInput: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#e1e8ed',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#333',
  },
  floorCard: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    elevation: 1,
  },
  floorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  floorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
  addBtn: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
    elevation: 1,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    fontWeight: '500',
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

export default ApplyAssessment;
