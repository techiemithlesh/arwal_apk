import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import VerificationCard from './VerificationCard';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthYearPicker from 'react-native-month-year-picker';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { BASE_URL } from '../../../config';
import { WARD_API } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import ExtraChargesSection from './components/ExtraChargesSection';
import { getUserDetails } from '../../../utils/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PROPERTY_API } from '../../../api/apiRoutes';
import { useRef } from 'react';
import { validateExtraChargesDates } from '../../../Validation/validation.';
import { showToast } from '../../../utils/toast';

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const SurveyPage = ({ route, navigation }) => {
  const { id } = route.params;

  console.log(id);
  const [showError, setShowErrors] = useState(false);
  const hasFetched = useRef(false);
  const [mobileTower, setMobileTower] = useState('no');
  const [towerArea, setTowerArea] = useState('');
  const [installationDate, setInstallationDate] = useState(null);
  const [showInstallationDatePicker, setShowInstallationDatePicker] =
    useState(false);

  const [percentageVerification, setPercentageVerification] = useState(null);
  const [percentageValue, setPercentageValue] = useState('');

  // Hoarding
  const [hoarding, setHoarding] = useState('no');
  const [hoardingArea, setHoardingArea] = useState('');
  const [hoardingInstallationDate, setHoardingInstallationDate] =
    useState(null);
  const [
    showHoardingInstallationDatePicker,
    setShowHoardingInstallationDatePicker,
  ] = useState(false);

  // Petrol Pump
  const [petrolPump, setPetrolPump] = useState('no');
  const [pumpArea, setPumpArea] = useState('');
  const [pumpInstallationDate, setPumpInstallationDate] = useState(null);
  const [showPumpInstallationDatePicker, setShowPumpInstallationDatePicker] =
    useState(false);

  // Rainwater Harvesting
  const [rainHarvesting, setRainHarvesting] = useState('no');
  const [completionDate, setCompletionDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [addExtraFloor, setAddExtraFloor] = useState(false);
  const [floors, setFloors] = useState([]);

  const addFloor = () => {
    setFloors(prev => [
      ...prev,
      {
        floorName: '',
        constructionType: '',
        occupancyType: '',
        usageType: '',
        builtupArea: '',
        fromDate: null,
        toDate: null,
        showFromPicker: false,
        showToPicker: false,
      },
    ]);
  };

  const removeFloor = () => {
    setFloors(prev => prev.slice(0, -1));
  };

  const updateFloor = (index, field, value) => {
    setFloors(prev =>
      prev.map((floor, i) =>
        i === index ? { ...floor, [field]: value } : floor,
      ),
    );
  };

  const getLabelByValue = (options, value) => {
    const found = options.find(option => option.value === value);
    return found ? found.label : '';
  };
  // for remarks
  const [remarks, setRemarks] = useState('');

  // State for API data
  const [data, setData] = useState(null);
  const [masterData, setMasterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Separate state for each card
  const [wardVerification, setWardVerification] = useState(null);
  const [wardDropdown, setWardDropdown] = useState('');

  const [newWardVerification, setNewWardVerification] = useState(null);
  const [newWardDropdown, setNewWardDropdown] = useState('');
  const [newWardInput, setNewWardInput] = useState('');

  const [zoneVerification, setZoneVerification] = useState(null);
  const [zoneDropdown, setZoneDropdown] = useState('');

  const [propertyVerification, setPropertyVerification] = useState(null);
  const [propertyDropdown, setPropertyDropdown] = useState('');

  // #################### Floor-specific states #############
  // Arrays to handle multiple floors dynamically
  const [floorVerifications, setFloorVerifications] = useState({});
  const [floorDropdownValues, setFloorDropdownValues] = useState({});
  const [floorInputValues, setFloorInputValues] = useState({});

  const [newWardOptions, setNewWardOptions] = useState([]);

  // Helper function to update floor-specific state
  const updateFloorState = (
    floorId,
    field,
    value,
    stateType = 'verification',
  ) => {
    if (stateType === 'verification') {
      setFloorVerifications(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    } else if (stateType === 'dropdown') {
      setFloorDropdownValues(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    } else if (stateType === 'input') {
      setFloorInputValues(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    }
  };

  const getFloorState = (floorId, field, stateType = 'verification') => {
    if (stateType === 'verification') {
      return floorVerifications[`${floorId}_${field}`] || null;
    } else if (stateType === 'dropdown') {
      return floorDropdownValues[`${floorId}_${field}`] || '';
    } else if (stateType === 'input') {
      return floorInputValues[`${floorId}_${field}`] || '';
    }
  };
  console.log('wardVerification', wardVerification);

  // Add more fields as needed
  const [floorType, setFloorType] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({});

  const [floorIds, setFloorIds] = useState([]);

  const showFromPicker = () => setFromPickerVisible(true);
  const hideFromPicker = () => setFromPickerVisible(false);
  const handleFromConfirm = date => {
    setFromDate(date);
    hideFromPicker();
  };
  const [error, setError] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [date, setDate] = useState(new Date());
  const [apartmentList, setApartmentList] = useState([]); // dropdown data
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(false);
  // floor related
  const [isULBUser, setIsULBUser] = useState(false);

  const validatePreviewForm = () => {
    const errors = [];

    // 1. Check Property Type verification
    if (!propertyVerification) {
      errors.push('Property Type verification is required');
    }

    // 2. Check Ward verification
    if (!wardVerification) {
      errors.push('Ward No. verification is required');
    }

    // 3. Check New Ward verification
    if (!newWardVerification) {
      errors.push('New Ward No. verification is required');
    }

    // 4. Check Zone verification
    if (!zoneVerification) {
      errors.push('Zone verification is required');
    }

    // 5. Check Mutation specific fields
    if (data?.assessmentType === 'Mutation' && !percentageVerification) {
      errors.push('Percentage of Property Transfer verification is required');
    }

    // 6. Check for apartment-specific fields
    if (selectedPropertyLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING') {
      if (!selectedDate) {
        errors.push('Flat Registry Date is required');
      }
      if (!apartmentDetail) {
        errors.push('Apartment Details is required');
      }
    }

    // 7. Check floor verifications (if not vacant land)
    if (
      shouldShowSections &&
      selectedPropertyLabel.toUpperCase() !== 'VACANT LAND'
    ) {
      floorIds.forEach(floor => {
        const floorName = floor.floorName;

        if (!getFloorState(floor.id, 'usageType', 'verification')) {
          errors.push(`${floorName}: Usage Type verification is required`);
        }
        if (!getFloorState(floor.id, 'occupancyType', 'verification')) {
          errors.push(`${floorName}: Occupancy Type verification is required`);
        }
        if (!getFloorState(floor.id, 'constructionType', 'verification')) {
          errors.push(
            `${floorName}: Construction Type verification is required`,
          );
        }
        if (!getFloorState(floor.id, 'builtupArea', 'verification')) {
          errors.push(`${floorName}: Built-up Area verification is required`);
        }
        if (!getFloorState(floor.id, 'dateFrom', 'verification')) {
          errors.push(`${floorName}: Date From verification is required`);
        }
        // if (!getFloorState(floor.id, 'dateTo', 'verification')) {
        //   errors.push(`${floorName}: Date To verification is required`);
        // }
      });
    }

    // 8. Validate extra charges dates
    const dateValidation = validateExtraChargesDates({
      mobileTower,
      installationDate,
      hoarding,
      hoardingInstallationDate,
      petrolPump,
      pumpInstallationDate,
      rainHarvesting,
      completionDate,
    });

    if (!dateValidation) {
      errors.push('Please check extra charges dates');
    }

    return errors;
  };

  // console.log('selected date', selectedDate.toISOString());
  useEffect(() => {
    if (data) {
      // console.log('Received data:', data); // <-- Log the whole data object

      // Mobile Tower
      setMobileTower(data.isMobileTower ? 'yes' : 'no');
      setTowerArea(data.towerArea || '');
      setInstallationDate(
        data.towerInstallationDate
          ? new Date(data.towerInstallationDate)
          : null,
      );

      // Hoarding
      setHoarding(data.isHoardingBoard ? 'yes' : 'no');
      setHoardingArea(data.hoardingArea || '');
      setHoardingInstallationDate(
        data.hoardingInstallationDate
          ? new Date(data.hoardingInstallationDate)
          : null,
      );

      // Petrol Pump
      setPetrolPump(data.isPetrolPump ? 'yes' : 'no');
      setPumpArea(data.underGroundArea || '');
      setPumpInstallationDate(
        data.petrolPumpCompletionDate
          ? new Date(data.petrolPumpCompletionDate)
          : null,
      );

      // Rainwater Harvesting
      setRainHarvesting(data.isWaterHarvesting ? 'yes' : 'no');
      setCompletionDate(
        data.waterHarvestingDate ? new Date(data.waterHarvestingDate) : null,
      );
    }
  }, [data]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserDetails();
        if (user?.userFor === 'ULB') setIsULBUser(true);
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const getLabelFromOptions = (options, value) => {
    const found = options?.find(item => item.value === value);
    return found?.label || value || 'N/A';
  };

  const getPreviewValue = (
    original,
    dropdownValue,
    verification,
    options,
    inputValue = null,
  ) => {
    if (verification === 'Correct') return original;
    if (inputValue) return inputValue;
    if (dropdownValue instanceof Date) {
      return formatDate(dropdownValue);
    }
    return getLabelFromOptions(options, dropdownValue);
  };

  const handleSubmitPreview = () => {
    // Get the verified IDs based on selection

    if (!propertyVerification) {
      setShowErrors(true); // trigger error
      return;
    }
    const isValid = validateExtraChargesDates({
      mobileTower,
      installationDate,
      hoarding,
      hoardingInstallationDate,
      petrolPump,
      pumpInstallationDate,
      rainHarvesting,
      completionDate,
    });

    if (!isValid) return;
    const getVerifiedId = (verification, originalValue, dropdownValue) => {
      if (verification === 'Correct' || !dropdownValue) {
        // If correct or no change, find the original ID from master data
        return originalValue;
      }
      return dropdownValue; // Return the selected dropdown ID
    };

    // Prepare floor data dynamically for all floors
    const floorDataArray = floorIds.map(floor => {
      const floorId = floor.id;

      return {
        safFloorDetailId: floor?.id || floor?.safFloorDetailId || null,
        floorMasterId: floor?.floorMasterId,
        floorName: floor?.floorName,

        // Usage Type
        usageTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'usageType', 'verification'),
          floor?.usageTypeMasterId,
          getFloorState(floorId, 'usageType', 'dropdown'),
        ),

        // Occupancy Type
        occupancyTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'occupancyType', 'verification'),
          floor?.occupancyTypeMasterId,
          getFloorState(floorId, 'occupancyType', 'dropdown'),
        ),

        // Construction Type
        constructionTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'constructionType', 'verification'),
          floor?.constructionTypeMasterId,
          getFloorState(floorId, 'constructionType', 'dropdown'),
        ),

        // Builtup Area
        builtupArea:
          getFloorState(floorId, 'builtupArea', 'verification') ===
            'Incorrect' && getFloorState(floorId, 'builtupArea', 'input')
            ? Number(getFloorState(floorId, 'builtupArea', 'input'))
            : Number(floor?.builtupArea || 0),

        // Date From
        dateFrom:
          getFloorState(floorId, 'dateFrom', 'verification') === 'Incorrect' &&
          getFloorState(floorId, 'dateFrom', 'dropdown')
            ? formatDate(getFloorState(floorId, 'dateFrom', 'dropdown'))
            : floor?.dateFrom,

        // Date To
        dateUpto:
          getFloorState(floorId, 'dateTo', 'verification') === 'Incorrect' &&
          getFloorState(floorId, 'dateTo', 'dropdown')
            ? formatDate(getFloorState(floorId, 'dateTo', 'dropdown'))
            : floor?.dateUpto,
      };
    });

    // console.log('Floor array', floorDataArray);

    // // For backwards compatibility, extract parking and basement floors
    const parkingFloorData =
      floorDataArray.find(f => f.floorMasterId === 1) || null;
    const basementFloorData =
      floorDataArray.find(f => f.floorMasterId === 2) || null;
    console.log('paroig data array', parkingFloorData);

    const submissionData = {
      ...previewData,
      // Main property IDs
      assessmentType: data?.assessmentType,
      percentageOfPropertyTransfer:
        percentageValue || data?.percentageOfPropertyTransfer,
      selectedDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : null,
      apartmentDetail: apartmentDetail,
      safDetailId: id,
      wardMstrId: getVerifiedId(
        wardVerification,
        data?.wardMstrId,
        wardDropdown,
      ),
      newWardMstrId: getVerifiedId(
        newWardVerification,
        data?.newWardMstrId,
        newWardDropdown,
      ),
      propTypeMstrId: getVerifiedId(
        propertyVerification,
        data?.propTypeMstrId,
        propertyDropdown,
      ),
      zoneMstrId: getVerifiedId(
        zoneVerification,
        data?.zoneMstrId,
        zoneDropdown,
      ),
      roadWidth: data?.roadWidth,
      areaOfPlot: data?.areaOfPlot,
      // isMobileTower: data?.isMobileTower || false,
      // isHoardingBoard: data?.isHoardingBoard || false,
      // isPetrolPump: data?.isPetrolPump || false,
      // isWaterHarvesting: data?.isWaterHarvesting || false,
      // remarks: remarks || '',

      // Floor details
      parkingFloor: parkingFloorData,
      basementFloor: basementFloorData,

      mobileTower,
      towerArea: mobileTower === 'yes' ? towerArea : null,
      installationDate:
        mobileTower === 'yes' && installationDate
          ? new Date(installationDate).toISOString().split('T')[0]
          : null,

      // Hoarding
      hoarding,
      hoardingArea: hoarding === 'yes' ? hoardingArea : null,
      hoardingInstallationDate:
        hoarding === 'yes' && hoardingInstallationDate
          ? new Date(hoardingInstallationDate).toISOString().split('T')[0]
          : null,

      // Petrol Pump
      petrolPump,
      pumpArea: petrolPump === 'yes' ? pumpArea : null,
      pumpInstallationDate:
        petrolPump === 'yes' && pumpInstallationDate
          ? new Date(pumpInstallationDate).toISOString().split('T')[0]
          : null,

      // Rainwater Harvesting
      rainHarvesting,
      completionDate:
        rainHarvesting === 'yes' && completionDate
          ? new Date(completionDate).toISOString().split('T')[0]
          : null,
      // Extra floors with IDs
      extraFloors: addExtraFloor
        ? floors?.map((floor, index) => ({
            safFloorDetailId: null, // New floor, no existing ID
            floorMasterId: floor.floorName, // This is already the ID from dropdown
            floorName: getLabelByValue(
              floorNameDropdownOptions,
              floor.floorName,
            ),
            constructionTypeMasterId: floor.constructionType,
            constructionType: getLabelByValue(
              constructionTypeDropdownOptions,
              floor.constructionType,
            ),
            occupancyTypeMasterId: floor.occupancyType,
            occupancyType: getLabelByValue(
              occupancyTypeDropdownOptions,
              floor.occupancyType,
            ),
            usageTypeMasterId: floor.usageType,
            usageType: getLabelByValue(
              usageTypeDropdownOptions,
              floor.usageType,
            ),
            builtupArea: floor.builtupArea || 0,
            dateFrom: floor.fromDate ? formatDate(floor.fromDate) : '',
            dateUpto: floor.toDate ? formatDate(floor.toDate) : '',
          }))
        : [],
    };

    console.log('Submitted Data with IDs: Survey page', submissionData);

    // Navigate and optionally pass data
    navigation.navigate('VerifiedStatus', {
      submissionData,
      id,
      floorIds,
      data,
      floorDataArray,
    });
  };

  const showToPicker = () => setToPickerVisible(true);
  const hideToPicker = () => setToPickerVisible(false);
  const handleToConfirm = date => {
    setToDate(date);
    hideToPicker();
  };

  // Format date as YYYY-MM-DD (local)
  // const formatDate1 = date => {
  //   if (!date) return '';
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  const formatDate1 = date => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDate = date => {
    if (!date) return 'Select Date';

    try {
      const d = new Date(date);

      // Check if date is valid
      if (isNaN(d.getTime())) return 'Select Date';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Select Date';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log('toke', token);

        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-field-verification`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response1 = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('field Virification data', response.data.data);
        setMasterData(response1.data.data);
        setData(response.data.data);
        console.log('master data', response1.data.data);
        const floors = response.data.data.floor || [];
        setFloorIds(floors);

        setApartmentDetail(response.data.data.appartmentDetailsId);

        if (response.data.data.flatRegistryDate) {
          const parsedDate = new Date(response.data.data.flatRegistryDate);
          // Normalize to remove timezone shift issues
          const normalized = new Date(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
          );
          setSelectedDate(normalized);
        } else {
          setSelectedDate(new Date());
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    fetchNewWardByOldWard(wardDropdown);
  }, [wardVerification, wardDropdown]);
  const fetchNewWardByOldWard = async wardId => {
    console.log('Fetching new wards for old ward:', wardId || oldWard);

    const oldWard = wardId || data?.wardMstrId;

    try {
      const token = await getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        WARD_API.OLD_WARD_API,
        { oldWardId: oldWard },
        { headers },
      );

      console.log('New ward response:', response?.data);
      if (response?.data?.status) {
        const newOptions = response.data.data.map(item => ({
          label: item.wardNo,
          value: item.id,
        }));
        setNewWardOptions(newOptions);
        console.log('New Ward', newOptions);
      } else {
        console.warn('Failed to fetch new wards:', response?.data?.message);
        setNewWardOptions([]);
      }
    } catch (error) {
      console.error('Error fetching new ward:', error);
      setNewWardOptions([]);
    }
  };

  // Prepare dropdown options for ward and zone
  const wardDropdownOptions = (masterData?.wardList || []).map(item => ({
    label: item.wardNo,
    value: item.id,
  }));
  const propertyDropdownOptions = (masterData?.propertyType || []).map(
    item => ({
      label: item.propertyType,
      value: item.id,
    }),
  );

  const selectedPropertyLabel =
    propertyDropdownOptions.find(
      opt => String(opt.value) === String(propertyDropdown),
    )?.label ||
    data?.propertyType ||
    '';
  const isNotVacantLand = selectedPropertyLabel.toUpperCase() !== 'VACANT LAND';
  const shouldShowSections =
    data?.propertyType?.toUpperCase() !== 'VACANT LAND' || // API value not vacant land
    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
      selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
      selectedPropertyLabel !== '');
  const zoneDropdownOptions = [
    { label: 'Zone 1', value: '1' },
    { label: 'Zone 2', value: '2' },
  ];

  const floorNameDropdownOptions = (masterData?.floorType || []).map(item => ({
    label: item.floorName, // What user sees in dropdown
    value: item.id, // What you use internally (e.g. to send to API)
  }));

  // #################### Parking #############
  const usageTypeDropdownOptions = (masterData?.usageType || []).map(item => ({
    label: item.usageType,
    value: item.id,
  }));
  const occupancyTypeDropdownOptions = (masterData?.occupancyType || []).map(
    item => ({
      label: item.occupancyName,
      value: item.id,
    }),
  );
  const constructionTypeDropdownOptions = (
    masterData?.constructionType || []
  ).map(item => ({
    label: item.constructionType,
    value: item.id,
  }));
  const buildupAreaDropdownOptions = (masterData?.buildupArea || []).map(
    item => ({
      label: item.buildupArea,
      value: item.id,
    }),
  );
  const dateFromParkingDropdownOptions = (
    masterData?.dateFromParking || []
  ).map(item => ({
    label: item.dateFromParking,
    value: item.id,
  }));
  const dateToParkingDropdownOptions = (masterData?.dateToParking || []).map(
    item => ({
      label: item.dateToParking,
      value: item.id,
    }),
  );

  // Add state for date picker modals
  const [showDateFromParkingPicker, setShowDateFromParkingPicker] =
    useState(false);
  const [showDateToParkingPicker, setShowDateToParkingPicker] = useState(false);
  const [showDateFromBasementPicker, setShowDateFromBasementPicker] =
    useState(false);
  const [showDateToBasementPicker, setShowDateToBasementPicker] =
    useState(false);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading survey data...</Text>
      </View>
    );
  }

  const fetchApartments = async () => {
    try {
      const token = await getToken();
      const body = data?.wardMstrId ? { oldWardId: data?.wardMstrId } : {};
      console.log('Body:', body);

      const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response);

      if (response.data?.status) {
        const formatted = response.data.data.map(item => ({
          label: `${item.apartmentName} (${item.aptCode})`,
          value: item.id,
        }));

        setApartmentList(formatted);
        // console.log('Formatted apartments:', formatted);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoadingApartments(false);
    }
  };

  if (
    !hasFetched.current &&
    selectedPropertyLabel?.trim().toUpperCase() ===
      'FLATS / UNIT IN MULTI STORIED BUILDING'
  ) {
    fetchApartments();
    hasFetched.current = true;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.surveyContainer}>
        <HeaderNavigation />
        <View style={styles.gradientWrapper}>
          <LinearGradient
            colors={['#055441ff', '#110850ff']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.title}>Self Assessment - Field Survey</Text>
          </LinearGradient>
        </View>
        {data && (
          <View style={styles.card}>
            <Text style={styles.label}>
              Your Application No.:{' '}
              <Text style={styles.value}>{data.safNo}</Text>
            </Text>
            <Text style={styles.label}>
              Application Type:{' '}
              <Text style={styles.value}>{data.assessmentType}</Text>
            </Text>
            <Text style={styles.label}>
              Applied Date: <Text style={styles.value}>{data.applyDate}</Text>
            </Text>
          </View>
        )}

        {/* Percentage of Property Transfer Card */}
        {/* {data?.assessmentType === 'Mutation' && (
          <VerificationCard
            label="Percentage of Property Transfer"
            value={data?.percentageOfPropertyTransfer || '0'}
            selectedVerification={percentageVerification}
            setSelectedVerification={setPercentageVerification}
            showInputOnIncorrect={true}
            inputValue={percentageValue}
            setInputValue={setPercentageValue}
            inputLabel="Enter New Percentage"
            inputPlaceholder="Enter %"
            editable={true}
          />
        )} */}
        {data?.assessmentType === 'Mutation' && (
          <VerificationCard
            label="Percentage of Property Transfer"
            value={data?.percentageOfPropertyTransfer}
            selectedVerification={percentageVerification}
            setSelectedVerification={setPercentageVerification}
            showInputOnIncorrect={true}
            inputValue={percentageValue}
            setInputValue={setPercentageValue}
            inputLabel="Enter New Percentage"
            inputPlaceholder="Enter %"
            editable={true}
            showError={showError} // pass boolean
          />
        )}

        {/* Ward No. Card */}
        <VerificationCard
          label="Ward No."
          value={data?.wardNo || ''}
          dropdownOptions={wardDropdownOptions}
          selectedVerification={wardVerification}
          setSelectedVerification={setWardVerification}
          dropdownValue={wardDropdown}
          setDropdownValue={setWardDropdown}
          showError={showError} // pass boolean
        />

        {/* Always show New Ward No., hide 'Correct' only if Ward No is Incorrect */}
        <VerificationCard
          label="New Ward No."
          value={data?.newWardNo || ''}
          dropdownOptions={newWardOptions} // do not clear unless really needed
          selectedVerification={newWardVerification}
          setSelectedVerification={setNewWardVerification}
          dropdownValue={newWardDropdown}
          setDropdownValue={setNewWardDropdown}
          hideCorrectOption={wardVerification === 'Incorrect'} // only hide Correct if Ward No is Incorrect
          showError={showError} // pass boolean
        />
        {/* Zone Card */}
        <VerificationCard
          label="Zone"
          value={data?.zone || ''}
          dropdownOptions={zoneDropdownOptions}
          selectedVerification={zoneVerification}
          setSelectedVerification={setZoneVerification}
          dropdownValue={zoneDropdown}
          setDropdownValue={setZoneDropdown}
          showError={showError} // pass boolean
        />
        <VerificationCard
          label="Property Type"
          value={data?.propertyType || ''}
          dropdownOptions={propertyDropdownOptions || []}
          selectedVerification={propertyVerification}
          setSelectedVerification={setPropertyVerification}
          dropdownValue={propertyDropdown}
          setDropdownValue={setPropertyDropdown}
          showError={showError} // pass boolean
        />
        {selectedPropertyLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING' && (
          <View style={styles.card}>
            <View>
              {/* Date Picker */}
              {/* Date Picker */}
              <Text
                style={[styles.label, error.ownershipType && styles.errorLabel]}
              >
                Flat Registry Date *
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                }}
                showError={showError} // pass boolean
              >
                <Text>
                  {selectedDate ? formatDate1(selectedDate) : 'Select Date'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                // <DateTimePicker
                //   value={selectedDate}
                //   maximumDate={new Date()}
                //   mode="date"
                //   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                //   onChange={(event, date) => {
                //     setShowDatePicker(false);
                //     if (event.type === 'set' && date) {
                //       console.log('Selected new date:', date.toISOString());
                //       setSelectedDate(date); // keep as Date object
                //     }
                //   }}
                // />
                <DateTimePicker
                  value={selectedDate || new Date()}
                  maximumDate={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (event.type === 'set' && date) {
                      setSelectedDate(
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                        ),
                      );
                    }
                  }}
                />
              )}

              {/* Apartment Details Dropdown */}
              <Text
                style={[styles.label, error.ownershipType && styles.errorLabel]}
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
          </View>
        )}

        {shouldShowSections &&
          selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' && (
            <>
              {/* #################### Parking ############# */}
              <LinearGradient
                colors={['#B6D9E0', '#2C5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                {floorIds.map((floor, index) => (
                  <View key={floor.id} style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        marginTop: 10,
                        marginBottom: 5,
                        marginLeft: 15,
                        marginRight: 15,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                        backgroundColor: 'rgba(13, 148, 136, 1)', // 👈 add background color
                        padding: 5, // optional so the text doesn’t stick to edges
                        borderRadius: 4, // optional for rounded background
                      }}
                    >
                      {floor.floorName.toUpperCase()}
                    </Text>

                    <VerificationCard
                      label="Usage-Type"
                      value={floor.usageType || ''}
                      dropdownOptions={usageTypeDropdownOptions || []}
                      selectedVerification={getFloorState(
                        floor.id,
                        'usageType',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'usageType',
                          value,
                          'verification',
                        )
                      }
                      dropdownValue={getFloorState(
                        floor.id,
                        'usageType',
                        'dropdown',
                      )}
                      setDropdownValue={value =>
                        updateFloorState(
                          floor.id,
                          'usageType',
                          value,
                          'dropdown',
                        )
                      }
                      showError={showError} // pass boolean
                    />
                    <VerificationCard
                      label="Occupancy-Type"
                      value={floor.occupancyName || ''}
                      dropdownOptions={occupancyTypeDropdownOptions || []}
                      selectedVerification={getFloorState(
                        floor.id,
                        'occupancyType',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'occupancyType',
                          value,
                          'verification',
                        )
                      }
                      dropdownValue={getFloorState(
                        floor.id,
                        'occupancyType',
                        'dropdown',
                      )}
                      setDropdownValue={value =>
                        updateFloorState(
                          floor.id,
                          'occupancyType',
                          value,
                          'dropdown',
                        )
                      }
                      showError={showError} // pass boolean
                    />
                    <VerificationCard
                      label="Construction-Type"
                      value={floor.constructionType || ''}
                      dropdownOptions={constructionTypeDropdownOptions || []}
                      selectedVerification={getFloorState(
                        floor.id,
                        'constructionType',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'constructionType',
                          value,
                          'verification',
                        )
                      }
                      dropdownValue={getFloorState(
                        floor.id,
                        'constructionType',
                        'dropdown',
                      )}
                      setDropdownValue={value =>
                        updateFloorState(
                          floor.id,
                          'constructionType',
                          value,
                          'dropdown',
                        )
                      }
                      showError={showError} // pass boolean
                    />
                    <VerificationCard
                      label="Builtup-Area"
                      value={floor.builtupArea || ''}
                      dropdownOptions={buildupAreaDropdownOptions || []}
                      selectedVerification={getFloorState(
                        floor.id,
                        'builtupArea',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'builtupArea',
                          value,
                          'verification',
                        )
                      }
                      dropdownValue={getFloorState(
                        floor.id,
                        'builtupArea',
                        'dropdown',
                      )}
                      setDropdownValue={value =>
                        updateFloorState(
                          floor.id,
                          'builtupArea',
                          value,
                          'dropdown',
                        )
                      }
                      showInputOnIncorrect={true}
                      inputValue={getFloorState(
                        floor.id,
                        'builtupArea',
                        'input',
                      )}
                      setInputValue={value =>
                        updateFloorState(
                          floor.id,
                          'builtupArea',
                          value,
                          'input',
                        )
                      }
                      inputLabel="Enter new builtup area:"
                      inputPlaceholder="Enter new builtup area"
                      showError={showError} // pass boolean
                    />
                    <VerificationCard
                      label="Date From"
                      value={floor.dateFrom || ''}
                      selectedVerification={getFloorState(
                        floor.id,
                        'dateFrom',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'dateFrom',
                          value,
                          'verification',
                        )
                      }
                      showCalendarOnIncorrect={true}
                      calendarValue={getFloorState(
                        floor.id,
                        'dateFrom',
                        'dropdown',
                      )}
                      setCalendarValue={value =>
                        updateFloorState(
                          floor.id,
                          'dateFrom',
                          value,
                          'dropdown',
                        )
                      }
                      onCalendarPress={() => {
                        // We'll need to handle this differently for each floor
                        if (floor.floorMasterId === 1)
                          setShowDateFromParkingPicker(true);
                        else if (floor.floorMasterId === 2)
                          setShowDateFromBasementPicker(true);
                      }}
                      showError={showError} // pass boolean
                    />
                    <VerificationCard
                      label="Date Upto"
                      value={floor.dateUpto || ''}
                      selectedVerification={getFloorState(
                        floor.id,
                        'dateTo',
                        'verification',
                      )}
                      setSelectedVerification={value =>
                        updateFloorState(
                          floor.id,
                          'dateTo',
                          value,
                          'verification',
                        )
                      }
                      showCalendarOnIncorrect={true}
                      calendarValue={getFloorState(
                        floor.id,
                        'dateTo',
                        'dropdown',
                      )}
                      setCalendarValue={value =>
                        updateFloorState(floor.id, 'dateTo', value, 'dropdown')
                      }
                      onCalendarPress={() => {
                        // We'll need to handle this differently for each floor
                        if (floor.floorMasterId === 1)
                          setShowDateToParkingPicker(true);
                        else if (floor.floorMasterId === 2)
                          setShowDateToBasementPicker(true);
                      }}
                    />
                  </View>
                ))}
              </LinearGradient>
              {!isULBUser && (
                <View>
                  <View style={styles.extraFloorContainer}>
                    <View style={styles.row}>
                      <Text style={styles.labelCheckbox}>
                        Do You Want To Add Extra Floor?
                      </Text>
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => {
                          setAddExtraFloor(!addExtraFloor);
                          if (!addExtraFloor && floors.length === 0) {
                            setFloors([1]); // add first floor when checked
                          } else if (addExtraFloor) {
                            setFloors([]); // reset on uncheck
                          }
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
                        {floors.map((floor, index) => (
                          <LinearGradient
                            key={index}
                            colors={['#ececf2ff', '#eee7e7ff']}
                            style={styles.card}
                          >
                            <View style={styles.rowlabel}>
                              <Text style={{ color: 'white' }}>
                                Extra Floor {index + 1}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.label}>Floor Name</Text>
                              <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholder}
                                selectedTextStyle={styles.selectedText}
                                data={floorNameDropdownOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={floor.floorName}
                                onChange={item =>
                                  updateFloor(index, 'floorName', item.value)
                                }
                              />

                              <Text style={styles.label}>
                                Construction Type
                              </Text>
                              <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholder}
                                selectedTextStyle={styles.selectedText}
                                data={constructionTypeDropdownOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={floor.constructionType}
                                onChange={item =>
                                  updateFloor(
                                    index,
                                    'constructionType',
                                    item.value,
                                  )
                                }
                              />

                              <Text style={styles.label}>Occupancy Type</Text>
                              <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholder}
                                selectedTextStyle={styles.selectedText}
                                data={occupancyTypeDropdownOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={floor.occupancyType}
                                onChange={item =>
                                  updateFloor(
                                    index,
                                    'occupancyType',
                                    item.value,
                                  )
                                }
                              />

                              <Text style={styles.label}>Usage Type</Text>
                              <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholder}
                                selectedTextStyle={styles.selectedText}
                                data={usageTypeDropdownOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={floor.usageType}
                                onChange={item =>
                                  updateFloor(index, 'usageType', item.value)
                                }
                              />

                              <Text style={styles.label}>Built-up Area</Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter built-up area"
                                value={floor.builtupArea}
                                onChangeText={text =>
                                  updateFloor(index, 'builtupArea', text)
                                }
                                keyboardType="numeric"
                              />
                            </View>

                            <Text style={styles.label}>Date From</Text>
                            <TouchableOpacity
                              style={styles.dateBox}
                              onPress={() =>
                                updateFloor(index, 'showFromPicker', true)
                              }
                            >
                              <Text style={styles.dateText}>
                                {floor.fromDate
                                  ? formatDate(floor.fromDate)
                                  : 'Select Date'}
                              </Text>
                            </TouchableOpacity>
                            {floor.showFromPicker && (
                              <MonthYearPicker
                                onChange={(event, newDate) => {
                                  updateFloor(index, 'showFromPicker', false);
                                  if (newDate) {
                                    updateFloor(index, 'fromDate', newDate);
                                  }
                                }}
                                value={floor.fromDate || new Date()}
                              />
                            )}

                            <Text style={styles.label}>Date Upto</Text>
                            <TouchableOpacity
                              style={styles.dateBox}
                              onPress={() =>
                                updateFloor(index, 'showToPicker', true)
                              }
                            >
                              <Text style={styles.dateText}>
                                {floor.toDate
                                  ? formatDate(floor.toDate)
                                  : 'Select Date'}
                              </Text>
                            </TouchableOpacity>
                            {floor.showToPicker && (
                              <MonthYearPicker
                                onChange={(event, newDate) => {
                                  updateFloor(index, 'showToPicker', false);
                                  if (newDate) {
                                    updateFloor(index, 'toDate', newDate);
                                  }
                                }}
                                value={floor.toDate || new Date()}
                              />
                            )}

                            <Text style={styles.cardText}></Text>
                          </LinearGradient>
                        ))}

                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            onPress={addFloor}
                            style={styles.addButton}
                          >
                            <Text style={styles.buttonText}>Add Floor</Text>
                          </TouchableOpacity>
                          {floors.length > 0 && (
                            <TouchableOpacity
                              onPress={removeFloor}
                              style={styles.removeButton}
                            >
                              <Text style={styles.buttonText}>
                                Remove Floor
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </>
                    )}
                  </View>

                  {/* Remarks Section */}
                  {/* <View style={styles.remarksContainer}>
                    <Text style={styles.remarksLabel}>Remarks</Text>
                    <TextInput
                      style={styles.remarksInput}
                      placeholder="Enter your remarks here..."
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
                      value={remarks}
                      onChangeText={setRemarks}
                      textAlignVertical="top"
                    />
                  </View> */}
                </View>
              )}
            </>
          )}

        <View style={[styles.card, styles.shadow]}>
          <ExtraChargesSection
            propertyTypeId={
              propertyDropdown ? propertyDropdown : data?.propertyTypeId
            }
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
            isRessessment={false}
            isMutation={false}
          />
        </View>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => {
            // Validation can be added here if needed

            const validationErrors = validatePreviewForm();

            if (validationErrors.length > 0) {
              setShowErrors(true);

              showToast('error', 'fill all requred field frist');
              // Show alert with all errors
              // Alert.alert(
              //   'Validation Error',
              //   'Please complete all required verifications:\n\n' +
              //     validationErrors
              //       .map((err, idx) => `${idx + 1}. ${err}`)
              //       .join('\n'),
              //   [{ text: 'OK' }],
              // );
              return;
            }

            // Reset errors if validation passes
            setShowErrors(false);

            const generatedPreview = {
              Percentage_Transfer: data?.percentageOfPropertyTransfer,
              Verified_Percentage: getPreviewValue(
                data?.percentageOfPropertyTransfer,
                percentageValue,
                percentageVerification,
                null,
              ),
              'Ward No': data?.wardNo,
              Verified_Ward: getPreviewValue(
                data?.wardNo,
                wardDropdown,
                wardVerification,
                wardDropdownOptions,
              ),

              'New Ward No (Current)': data?.newWardNo,
              Verified_NewWard: getPreviewValue(
                data?.newWardNo,
                newWardDropdown,
                newWardVerification,
                wardDropdownOptions,
              ),

              'Zone (Current)': data?.zone,
              Verified_Zone: getPreviewValue(
                data?.zone,
                zoneDropdown,
                zoneVerification,
                zoneDropdownOptions,
              ),
              'Property Type (Current)': data?.propertyType,
              Verified_PropertyType: getPreviewValue(
                data?.propertyType,
                propertyDropdown,
                propertyVerification,
                propertyDropdownOptions,
              ),
              selectedDate: selectedDate
                ? selectedDate.toISOString().split('T')[0]
                : null, // YYYY-MM-DD
              apartmentDetail: apartmentDetail,
            };

            if (data?.propertyType !== 'VACANT LAND') {
              // generatedPreview['Remarks (Preview)'] = remarks ?? 'NA';

              // Generate preview data for each floor dynamically
              floorIds.forEach((floor, index) => {
                const floorId = floor.id;
                const floorPrefix = floor.floorName || `Floor ${index + 1}`;

                generatedPreview[`Usage Type (${floorPrefix} Current)`] =
                  floor?.usageType;
                generatedPreview[`Verified_Usage${floorPrefix}`] =
                  getPreviewValue(
                    floor?.usageType,
                    getFloorState(floorId, 'usageType', 'dropdown'),
                    getFloorState(floorId, 'usageType', 'verification'),
                    usageTypeDropdownOptions,
                  );

                generatedPreview[`Occupancy Type (${floorPrefix} Current)`] =
                  floor?.occupancyName;
                generatedPreview[`Verified_Occupancy${floorPrefix}`] =
                  getPreviewValue(
                    floor?.occupancyName,
                    getFloorState(floorId, 'occupancyType', 'dropdown'),
                    getFloorState(floorId, 'occupancyType', 'verification'),
                    occupancyTypeDropdownOptions,
                  );

                generatedPreview[`Construction Type (${floorPrefix} Current)`] =
                  floor?.constructionType;
                generatedPreview[`Verified_Construction${floorPrefix}`] =
                  getPreviewValue(
                    floor?.constructionType,
                    getFloorState(floorId, 'constructionType', 'dropdown'),
                    getFloorState(floorId, 'constructionType', 'verification'),
                    constructionTypeDropdownOptions,
                  );

                generatedPreview[`Built-up Area (${floorPrefix} Current)`] =
                  floor?.builtupArea;
                generatedPreview[`Verified_BuiltUp${floorPrefix}`] =
                  getPreviewValue(
                    floor?.builtupArea,
                    getFloorState(floorId, 'builtupArea', 'dropdown'),
                    getFloorState(floorId, 'builtupArea', 'verification'),
                    buildupAreaDropdownOptions,
                    getFloorState(floorId, 'builtupArea', 'input'),
                  );

                generatedPreview[`Date From (${floorPrefix} Current)`] =
                  floor?.dateFrom;
                generatedPreview[`Verified_DateFrom${floorPrefix}`] =
                  getPreviewValue(
                    floor?.dateFrom,
                    getFloorState(floorId, 'dateFrom', 'dropdown'),
                    getFloorState(floorId, 'dateFrom', 'verification'),
                    null,
                    null,
                    true,
                  );

                generatedPreview[`Date To (${floorPrefix} Current)`] =
                  floor?.dateUpto;
                generatedPreview[`Verified_DateTo${floorPrefix}`] =
                  getPreviewValue(
                    floor?.dateUpto,
                    getFloorState(floorId, 'dateTo', 'dropdown'),
                    getFloorState(floorId, 'dateTo', 'verification'),
                    null,
                    null,
                    true,
                  );
              });
            }

            // Add remarks if property type is not VACANT LAND
            // if (data?.propertyType !== 'VACANT LAND' && remarks) {
            //   generatedPreview['Remarks'] = remarks;
            // }

            setPreviewData(generatedPreview);
            console.log('Preview', generatedPreview);
            setIsPreviewVisible(true);
          }}
        >
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
        <Modal
          visible={isPreviewVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPreviewVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Preview Details</Text>
              <ScrollView style={styles.modalContent}>
                {/* Property Details Table */}
                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Property Details</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Field</Text>
                      <Text style={styles.tableHeaderText}>Current Value</Text>
                      <Text style={styles.tableHeaderText}>Verified Value</Text>
                    </View>
                    {data?.assessmentType === 'Mutation' && (
                      <View style={styles.tableRow}>
                        <Text style={styles.tableCellLabel}>
                          Percentage of Property Transfer
                        </Text>
                        <Text style={styles.tableCell}>
                          {previewData['Percentage_Transfer'] || 'N/A'}
                        </Text>
                        <Text style={styles.tableCell}>
                          {previewData['Verified_Percentage'] || 'N/A'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellLabel}>Ward No</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Ward No'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_Ward'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                      <Text style={styles.tableCellLabel}>New Ward No</Text>
                      <Text style={styles.tableCell}>
                        {previewData['New Ward No (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_NewWard'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellLabel}>Zone</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Zone (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_Zone'] || 'N/A'}
                      </Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                      <Text style={styles.tableCellLabel}>Property Type</Text>
                      <Text style={styles.tableCell}>
                        {previewData['Property Type (Current)'] || 'N/A'}
                      </Text>
                      <Text style={styles.tableCell}>
                        {previewData['Verified_PropertyType'] || 'N/A'}
                      </Text>
                    </View>
                    {selectedPropertyLabel ===
                      'FLATS / UNIT IN MULTI STORIED BUILDING' && (
                      <>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCellLabel}>
                            Selected Date
                          </Text>
                          <Text style={styles.tableCell}>
                            {previewData.selectedDate}
                          </Text>
                          <Text style={styles.tableCell}>
                            {' '}
                            {/* Optional verified value */}{' '}
                          </Text>
                        </View>

                        <View
                          style={[styles.tableRow, styles.tableRowAlternate]}
                        >
                          <Text style={styles.tableCellLabel}>
                            Apartment Detail
                          </Text>
                          <Text style={styles.tableCell}>
                            {previewData.apartmentDetail || 'N/A'}
                          </Text>
                          <Text style={styles.tableCell}>
                            {' '}
                            {/* Optional verified value */}{' '}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {/* Apply same condition as shouldShowSections */}
                {(() => {
                  const currentPropertyLabel =
                    propertyDropdownOptions?.find(
                      opt => String(opt.value) === String(propertyDropdown),
                    )?.label ||
                    data?.propertyType ||
                    '';

                  const shouldShowPreviewSections =
                    data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
                    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
                      currentPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
                      currentPropertyLabel !== '');

                  return shouldShowPreviewSections &&
                    currentPropertyLabel.toUpperCase() !== 'VACANT LAND' ? (
                    <>
                      {/* Dynamic Floor Details Tables */}
                      {floorIds.map((floor, index) => {
                        const floorId = floor.id;
                        const floorPrefix =
                          floor.floorName || `Floor ${index + 1}`;

                        return (
                          <View key={floorId} style={styles.tableContainer}>
                            <Text style={styles.tableTitle}>
                              {floorPrefix} Details
                            </Text>
                            <View style={styles.table}>
                              <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>
                                  Field
                                </Text>
                                <Text style={styles.tableHeaderText}>
                                  Current Value
                                </Text>
                                <Text style={styles.tableHeaderText}>
                                  Verified Value
                                </Text>
                              </View>
                              <View style={styles.tableRow}>
                                <Text style={styles.tableCellLabel}>
                                  Usage Type
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Usage Type (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_Usage${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.tableRow,
                                  styles.tableRowAlternate,
                                ]}
                              >
                                <Text style={styles.tableCellLabel}>
                                  Occupancy Type
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Occupancy Type (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_Occupancy${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                              <View style={styles.tableRow}>
                                <Text style={styles.tableCellLabel}>
                                  Construction Type
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Construction Type (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_Construction${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.tableRow,
                                  styles.tableRowAlternate,
                                ]}
                              >
                                <Text style={styles.tableCellLabel}>
                                  Built-up Area
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Built-up Area (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_BuiltUp${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                              <View style={styles.tableRow}>
                                <Text style={styles.tableCellLabel}>
                                  Date From
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Date From (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_DateFrom${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.tableRow,
                                  styles.tableRowAlternate,
                                ]}
                              >
                                <Text style={styles.tableCellLabel}>
                                  Date To
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Date To (${floorPrefix} Current)`
                                  ] || 'N/A'}
                                </Text>
                                <Text style={styles.tableCell}>
                                  {previewData[
                                    `Verified_DateTo${floorPrefix}`
                                  ] || 'N/A'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}

                      {/* Extra Floor Details Cards */}
                      {addExtraFloor &&
                        floors.length > 0 &&
                        floors.map((floor, floorIndex) => (
                          <View key={floorIndex} style={styles.cardContainer}>
                            <Text style={styles.cardTitle}>
                              Extra Floor {floorIndex + 1} Details
                            </Text>

                            {[
                              {
                                label: 'Floor Type',
                                value:
                                  getLabelByValue(
                                    floorNameDropdownOptions,
                                    floor.floorName,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Construction Type',
                                value:
                                  getLabelByValue(
                                    constructionTypeDropdownOptions,
                                    floor.constructionType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Occupancy Type',
                                value:
                                  getLabelByValue(
                                    occupancyTypeDropdownOptions,
                                    floor.occupancyType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Usage Type',
                                value:
                                  getLabelByValue(
                                    usageTypeDropdownOptions,
                                    floor.usageType,
                                  ) || 'N/A',
                              },
                              {
                                label: 'Built-up Area',
                                value: floor.builtupArea || 'N/A',
                              },
                              {
                                label: 'Date From',
                                value: floor.fromDate
                                  ? formatDate(floor.fromDate)
                                  : 'N/A',
                              },
                              {
                                label: 'Date To',
                                value: floor.toDate
                                  ? formatDate(floor.toDate)
                                  : 'N/A',
                              },
                            ].map((item, idx) => (
                              <View key={idx} style={styles.cardRow}>
                                <Text style={styles.cardLabel}>
                                  {item.label}
                                </Text>
                                <Text style={styles.cardValue}>
                                  {item.value}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ))}

                      {/* Remarks Section */}
                      {(remarks || previewData['Remarks (Preview)']) && (
                        <View style={styles.remarksContainer}>
                          <Text style={styles.tableTitle}>Remarks</Text>
                          <View style={styles.remarksBox}>
                            <Text style={styles.remarksText}>
                              {remarks ||
                                previewData['Remarks (Preview)'] ||
                                'No remarks'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </>
                  ) : null;
                })()}
                {/* Other Property Features Section */}

                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Other Property Features</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Field</Text>
                      <Text style={styles.tableHeaderText}>Value</Text>
                    </View>

                    {/* Mobile Tower */}
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellLabel}>Mobile Tower</Text>
                      <Text style={styles.tableCell}>
                        {mobileTower || 'N/A'}
                      </Text>
                    </View>
                    {mobileTower === 'yes' && (
                      <>
                        <View
                          style={[styles.tableRow, styles.tableRowAlternate]}
                        >
                          <Text style={styles.tableCellLabel}>Tower Area</Text>
                          <Text style={styles.tableCell}>
                            {towerArea || 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCellLabel}>
                            Installation Date
                          </Text>
                          <Text style={styles.tableCell}>
                            {installationDate
                              ? formatDate(installationDate)
                              : 'N/A'}
                          </Text>
                        </View>
                      </>
                    )}

                    {/* Hoarding */}
                    <></>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                      <Text style={styles.tableCellLabel}>Hoarding</Text>
                      <Text style={styles.tableCell}>{hoarding || 'N/A'}</Text>
                    </View>
                    {hoarding === 'yes' && (
                      <>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCellLabel}>
                            Hoarding Area
                          </Text>
                          <Text style={styles.tableCell}>
                            {hoardingArea || 'N/A'}
                          </Text>
                        </View>
                        <View
                          style={[styles.tableRow, styles.tableRowAlternate]}
                        >
                          <Text style={styles.tableCellLabel}>
                            Installation Date
                          </Text>
                          <Text style={styles.tableCell}>
                            {hoardingInstallationDate
                              ? formatDate(hoardingInstallationDate)
                              : 'N/A'}
                          </Text>
                        </View>
                      </>
                    )}

                    {selectedPropertyLabel !== 'VACANT LAND' && (
                      <>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCellLabel}>Petrol Pump</Text>
                          <Text style={styles.tableCell}>
                            {petrolPump || 'N/A'}
                          </Text>
                        </View>
                        {petrolPump === 'yes' && (
                          <>
                            <View
                              style={[
                                styles.tableRow,
                                styles.tableRowAlternate,
                              ]}
                            >
                              <Text style={styles.tableCellLabel}>
                                Pump Area
                              </Text>
                              <Text style={styles.tableCell}>
                                {pumpArea || 'N/A'}
                              </Text>
                            </View>
                            <View style={styles.tableRow}>
                              <Text style={styles.tableCellLabel}>
                                Installation Date
                              </Text>
                              <Text style={styles.tableCell}>
                                {pumpInstallationDate
                                  ? formatDate(pumpInstallationDate)
                                  : 'N/A'}
                              </Text>
                            </View>
                          </>
                        )}

                        {/* Rainwater Harvesting */}
                        <View
                          style={[styles.tableRow, styles.tableRowAlternate]}
                        >
                          <Text style={styles.tableCellLabel}>
                            Rainwater Harvesting
                          </Text>
                          <Text style={styles.tableCell}>
                            {rainHarvesting || 'N/A'}
                          </Text>
                        </View>
                        {rainHarvesting === 'yes' && (
                          <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>
                              Completion Date
                            </Text>
                            <Text style={styles.tableCell}>
                              {completionDate
                                ? new Date(completionDate)
                                    .toISOString()
                                    .split('T')[0]
                                : 'N/A'}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                    {/* Petrol Pump */}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setIsPreviewVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitPreview}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Date pickers for parking and basement */}
        {showDateFromParkingPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateFromParkingPicker(false);
              if (newDate) {
                const parkingFloor = floorIds.find(f => f.floorMasterId === 1);
                if (parkingFloor) {
                  updateFloorState(
                    parkingFloor.id,
                    'dateFrom',
                    newDate,
                    'dropdown',
                  );
                }
              }
            }}
            value={(() => {
              const parkingFloor = floorIds.find(f => f.floorMasterId === 1);
              return parkingFloor
                ? getFloorState(parkingFloor.id, 'dateFrom', 'dropdown') ||
                    new Date()
                : new Date();
            })()}
          />
        )}
        {showDateToParkingPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateToParkingPicker(false);
              if (newDate) {
                const parkingFloor = floorIds.find(f => f.floorMasterId === 1);
                if (parkingFloor) {
                  updateFloorState(
                    parkingFloor.id,
                    'dateTo',
                    newDate,
                    'dropdown',
                  );
                }
              }
            }}
            value={(() => {
              const parkingFloor = floorIds.find(f => f.floorMasterId === 1);
              return parkingFloor
                ? getFloorState(parkingFloor.id, 'dateTo', 'dropdown') ||
                    new Date()
                : new Date();
            })()}
          />
        )}
        {showDateFromBasementPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateFromBasementPicker(false);
              if (newDate) {
                const basementFloor = floorIds.find(f => f.floorMasterId === 2);
                if (basementFloor) {
                  updateFloorState(
                    basementFloor.id,
                    'dateFrom',
                    newDate,
                    'dropdown',
                  );
                }
              }
            }}
            value={(() => {
              const basementFloor = floorIds.find(f => f.floorMasterId === 2);
              return basementFloor
                ? getFloorState(basementFloor.id, 'dateFrom', 'dropdown') ||
                    new Date()
                : new Date();
            })()}
          />
        )}
        {showDateToBasementPicker && (
          <MonthYearPicker
            onChange={(event, newDate) => {
              setShowDateToBasementPicker(false);
              if (newDate) {
                const basementFloor = floorIds.find(f => f.floorMasterId === 2);
                if (basementFloor) {
                  updateFloorState(
                    basementFloor.id,
                    'dateTo',
                    newDate,
                    'dropdown',
                  );
                }
              }
            }}
            value={(() => {
              const basementFloor = floorIds.find(f => f.floorMasterId === 2);
              return basementFloor
                ? getFloorState(basementFloor.id, 'dateTo', 'dropdown') ||
                    new Date()
                : new Date();
            })()}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SurveyPage;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF', // 👈 your dynamic color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
  },

  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label1: {
    color: 'white',
  },
  input: {
    height: responsiveHeight(5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  removeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5',
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    marginBottom: 5,
  },
  extraFloorContainer: {
    // backgroundColor: '#F5F5F5', // background color for the whole section
    // marginLeft:10,
    // marginRight:10
    // borderRadius: 10,
    // marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // background color for the whole section
    marginLeft: responsiveWidth(2),
    marginRight: responsiveWidth(2),
    paddingLeft: responsiveWidth(3),
    borderRadius: 10,
    marginVertical: 10,
  },
  labelCheckbox: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'blue',
  },
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(4),
    margin: responsiveWidth(4),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
  },
  surveyContainer: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: responsiveHeight(10),
  },
  gradientWrapper: {
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  gradient: {
    borderRadius: 8,
    padding: responsiveWidth(3),
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: responsiveHeight(1),
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
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
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    fontSize: 16,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 12,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  table: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowAlternate: {
    backgroundColor: '#f9f9f9',
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    paddingRight: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  remarksBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  remarksText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  remarksContainer: {
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(2),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: responsiveWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  remarksLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: responsiveHeight(1),
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: responsiveWidth(3),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    minHeight: responsiveHeight(12),
    backgroundColor: '#f9f9f9',
  },
  remarksPreviewText: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    lineHeight: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(2),
  },
  cardContainer: {
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f3969',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
});
