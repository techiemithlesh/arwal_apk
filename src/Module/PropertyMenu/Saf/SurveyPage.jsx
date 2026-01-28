import React, { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import MonthYearPicker from 'react-native-month-year-picker';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import ExtraChargesSection from './components/ExtraChargesSection';
import VerificationCard from './VerificationCard';
import { WARD_API, PROPERTY_API } from '../../../api/apiRoutes';
import { getToken, getUserDetails } from '../../../utils/auth';
import { showToast } from '../../../utils/toast';

// Import custom hooks
import { useSurveyData } from './hooks/useSurveyData';
import { useFloorManagement } from './hooks/useFloorManagement';
import { useVerification } from './hooks/useVerification';
import { useExtraCharges } from './hooks/useExtraCharges';
import { useExtraFloors } from './hooks/useExtraFloors';

// Import components
import ApplicationInfo from './components/ApplicationInfo';
import FloorVerificationSection from './components/FloorVerificationSection';
import ExtraFloorForm from './components/ExtraFloorForm';
import ApartmentDetailsSection from './components/ApartmentDetailsSection';
import PreviewModal from './components/PreviewModal';

// Import utilities and constants
import {
  formatDate,
  formatDate1,
  getLabelByValue,
  getPreviewValue,
  getVerifiedId,
} from './utils/helpers';
import { validatePreviewForm } from './utils/validation';
import { yesNoOptions, zoneDropdownOptions } from './constants';

const SurveyPage = ({ route, navigation }) => {
  const { id } = route.params;

  const [propertyDate, setPropertyDate] = useState(null);
  const [showPropertyDatePicker, setShowPropertyDatePicker] = useState(false);

  const [roadType, setRoadType] = useState(''); // dropdown selected value
  const [roadTypeVerification, setRoadTypeVerification] = useState(''); // Correct/Incorrect

  // State management
  const [showError, setShowErrors] = useState(false);
  const hasFetched = useRef(false);
  const [error, setError] = useState({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [newWardOptions, setNewWardOptions] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [apartmentLabel, setApartmentLabel] = useState('');

  const [plotAreaVerification, setPlotAreaVerification] = useState('');
  const [plotAreaValue, setPlotAreaValue] = useState('');

  const [buildupVerification, setBuildupVerification] = useState('');
  const [buildupValue, setBuildupValue] = useState('');

  const [loadingApartments, setLoadingApartments] = useState(false);
  const [isULBUser, setIsULBUser] = useState(false);

  // Date picker states
  const [showDateFromParkingPicker, setShowDateFromParkingPicker] =
    useState(false);
  const [showDateToParkingPicker, setShowDateToParkingPicker] = useState(false);
  const [showDateFromBasementPicker, setShowDateFromBasementPicker] =
    useState(false);
  const [showDateToBasementPicker, setShowDateToBasementPicker] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Custom hooks
  const {
    data,
    masterData,
    isLoading,
    floorIds,
    apartmentDetail,
    setApartmentDetail,
    selectedDate,
    setSelectedDate,
  } = useSurveyData(id);

  const { updateFloorState, getFloorState } = useFloorManagement();

  const {
    percentageVerification,
    setPercentageVerification,
    percentageValue,
    setPercentageValue,
    wardVerification,
    setWardVerification,
    wardDropdown,
    setWardDropdown,
    newWardVerification,
    setNewWardVerification,
    newWardDropdown,
    setNewWardDropdown,
    zoneVerification,
    setZoneVerification,
    zoneDropdown,
    setZoneDropdown,
    propertyVerification,
    setPropertyVerification,
    propertyDropdown,
    setPropertyDropdown,
  } = useVerification();

  const extraCharges = useExtraCharges(data);

  const {
    addExtraFloor,
    setAddExtraFloor,
    floors,
    setFloors,
    addFloor,
    removeFloor,
    updateFloor,
  } = useExtraFloors();

  // Check if user is ULB user
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

  // Fetch new ward options when ward changes
  useEffect(() => {
    fetchNewWardByOldWard(wardDropdown);
  }, [wardVerification, wardDropdown]);

  const fetchNewWardByOldWard = async wardId => {
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

      if (response?.data?.status) {
        const newOptions = response.data.data.map(item => ({
          label: item.wardNo,
          value: item.id,
        }));
        setNewWardOptions(newOptions);
      } else {
        setNewWardOptions([]);
      }
    } catch (error) {
      console.error('Error fetching new ward:', error);
      setNewWardOptions([]);
    }
  };

  // Fetch apartments for multi-storied building
  const fetchApartments = async () => {
    try {
      const token = await getToken();
      const body = data?.wardMstrId ? { oldWardId: data?.wardMstrId } : {};

      const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status) {
        const formatted = response.data.data.map(item => ({
          label: `${item.apartmentName} (${item.aptCode})`,
          value: item.id,
        }));
        console.log('formatted', formatted);
        setApartmentList(formatted);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoadingApartments(false);
    }
  };

  // Prepare dropdown options
  const zoneDropdownOptions = (masterData?.zoneType || []).map(item => ({
    label: item.zoneName,
    value: item.id,
  }));

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

  const floorNameDropdownOptions = (masterData?.floorType || []).map(item => ({
    label: item.floorName,
    value: item.id,
  }));

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

  const roadTypeOptions = (masterData?.roadType || []).map(item => ({
    label: item.roadType,
    value: item.id,
  }));

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

  const selectedPropertyLabel =
    propertyDropdownOptions.find(
      opt => String(opt.value) === String(propertyDropdown),
    )?.label ||
    data?.propertyType ||
    '';

  const selectedPropertyId = propertyDropdown
    ? Number(propertyDropdown)
    : data?.propTypeMstrId
    ? Number(data.propTypeMstrId)
    : null;

  const shouldShowSections =
    data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
      selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
      selectedPropertyLabel !== '');

  // Fetch apartments when property type is multi-storied building
  if (
    !hasFetched.current &&
    selectedPropertyLabel?.trim().toUpperCase() ===
      'FLATS / UNIT IN MULTI STORIED BUILDING'
  ) {
    fetchApartments();
    hasFetched.current = true;
  }

  // Handle preview submission
  const handleSubmitPreview = () => {
    if (!propertyVerification) {
      setShowErrors(true);
      return;
    }

    // Prepare floor data dynamically for all floors
    const floorDataArray = floorIds.map(floor => {
      const floorId = floor.id;

      return {
        safFloorDetailId: floor?.id || floor?.safFloorDetailId || null,
        floorMasterId: floor?.floorMasterId,
        floorName: floor?.floorName,
        usageTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'usageType', 'verification'),
          floor?.usageTypeMasterId,
          getFloorState(floorId, 'usageType', 'dropdown'),
        ),
        occupancyTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'occupancyType', 'verification'),
          floor?.occupancyTypeMasterId,
          getFloorState(floorId, 'occupancyType', 'dropdown'),
        ),
        constructionTypeMasterId: getVerifiedId(
          getFloorState(floorId, 'constructionType', 'verification'),
          floor?.constructionTypeMasterId,
          getFloorState(floorId, 'constructionType', 'dropdown'),
        ),
        builtupArea:
          getFloorState(floorId, 'builtupArea', 'verification') ===
            'Incorrect' && getFloorState(floorId, 'builtupArea', 'input')
            ? Number(getFloorState(floorId, 'builtupArea', 'input'))
            : Number(floor?.builtupArea || 0),
        dateFrom:
          getFloorState(floorId, 'dateFrom', 'verification') === 'Incorrect' &&
          getFloorState(floorId, 'dateFrom', 'dropdown')
            ? formatDate(getFloorState(floorId, 'dateFrom', 'dropdown'))
            : floor?.dateFrom,
        dateUpto:
          getFloorState(floorId, 'dateTo', 'verification') === 'Incorrect' &&
          getFloorState(floorId, 'dateTo', 'dropdown')
            ? formatDate(getFloorState(floorId, 'dateTo', 'dropdown'))
            : floor?.dateUpto,
      };
    });

    const parkingFloorData =
      floorDataArray.find(f => f.floorMasterId === 1) || null;
    const basementFloorData =
      floorDataArray.find(f => f.floorMasterId === 2) || null;

    let submissionData = {
      ...previewData,
      assessmentType: data?.assessmentType,
      percentageOfPropertyTransfer:
        percentageValue || data?.percentageOfPropertyTransfer,
      selectedDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : null,
      apartmentDetail: apartmentDetail,
      apartmentLabel,
      safDetailId: id,
      wardMstrId: getVerifiedId(
        wardVerification,
        data?.wardMstrId,
        wardDropdown,
      ),
      // newWardMstrId: getVerifiedId(
      //   newWardVerification,
      //   data?.newWardMstrId,
      //   newWardDropdown,
      // ),

      propertyPossessionDate:
        (selectedPropertyId === 3 || selectedPropertyId === 4) && propertyDate
          ? propertyDate.toISOString().split('T')[0]
          : null,

      propTypeMstrId: getVerifiedId(
        propertyVerification,
        data?.propTypeMstrId,
        propertyDropdown,
      ),
      roadTypeMstrId: getVerifiedId(
        roadTypeVerification,
        data?.roadTypeMstrId,
        roadType,
      ),

      zoneMstrId: getVerifiedId(
        zoneVerification,
        data?.zoneMstrId,
        zoneDropdown,
      ),
      roadWidth: data?.roadWidth,
      // areaOfPlot: data?.areaOfPlot,

      areaOfPlot: getVerifiedId(
        plotAreaVerification,
        data?.areaOfPlot,
        plotAreaValue,
      ),

      parkingFloor: parkingFloorData,
      basementFloor: basementFloorData,
      mobileTower: extraCharges.mobileTower,
      towerArea:
        extraCharges.mobileTower === 'yes' ? extraCharges.towerArea : null,
      installationDate:
        extraCharges.mobileTower === 'yes' && extraCharges.installationDate
          ? new Date(extraCharges.installationDate).toISOString().split('T')[0]
          : null,
      hoarding: extraCharges.hoarding,
      hoardingArea:
        extraCharges.hoarding === 'yes' ? extraCharges.hoardingArea : null,
      hoardingInstallationDate:
        extraCharges.hoarding === 'yes' && extraCharges.hoardingInstallationDate
          ? new Date(extraCharges.hoardingInstallationDate)
              .toISOString()
              .split('T')[0]
          : null,
      petrolPump: extraCharges.petrolPump,
      pumpArea:
        extraCharges.petrolPump === 'yes' ? extraCharges.pumpArea : null,
      pumpInstallationDate:
        extraCharges.petrolPump === 'yes' && extraCharges.pumpInstallationDate
          ? new Date(extraCharges.pumpInstallationDate)
              .toISOString()
              .split('T')[0]
          : null,
      rainHarvesting: extraCharges.rainHarvesting,
      completionDate:
        extraCharges.rainHarvesting === 'yes' && extraCharges.completionDate
          ? new Date(extraCharges.completionDate).toISOString().split('T')[0]
          : null,
      extraFloors: addExtraFloor
        ? floors?.map((floor, index) => ({
            safFloorDetailId: null,
            floorMasterId: floor.floorName,
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
    if (submissionData?.propTypeMstrId != 4) {
      submissionData = { ...submissionData, builtupArea: buildupValue };
    }

    console.log('Submitted Data with IDs: Survey page', submissionData);

    navigation.navigate('VerifiedStatus', {
      submissionData,
      id,
      floorIds,
      data,
      floorDataArray,
    });
  };

  // Generate preview data
  const handlePreview = () => {
    const validationErrors = validatePreviewForm({
      propertyVerification,
      wardVerification,
      newWardVerification,
      zoneVerification,
      data,
      percentageVerification,
      selectedPropertyLabel,
      selectedDate,
      apartmentDetail,
      shouldShowSections,
      floorIds,
      getFloorState,
      mobileTower: extraCharges.mobileTower,
      installationDate: extraCharges.installationDate,
      hoarding: extraCharges.hoarding,
      hoardingInstallationDate: extraCharges.hoardingInstallationDate,
      petrolPump: extraCharges.petrolPump,
      pumpInstallationDate: extraCharges.pumpInstallationDate,
      rainHarvesting: extraCharges.rainHarvesting,
      completionDate: extraCharges.completionDate,
    });

    if (validationErrors.length > 0) {
      setShowErrors(true);
      showToast('error', 'fill all requred field frist');
      return;
    }

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
      'Road Type (Current)': data?.roadType,
      Verified_RoadType: getPreviewValue(
        data?.roadType,
        roadType,
        roadTypeVerification,
        roadTypeOptions,
      ),

      'Built-up Area (Current)': data?.builtupArea,
      Verified_BuiltupArea: getPreviewValue(
        data?.builtupArea,
        buildupValue,
        buildupVerification,
        null,
      ),
      'Area of Plot (Current)': data?.areaOfPlot,
      Verified_PlotArea: getPreviewValue(
        data?.areaOfPlot,
        plotAreaValue,
        plotAreaVerification,
        null,
      ),

      Property_Possession_Date: propertyDate
        ? propertyDate.toISOString().split('T')[0]
        : '-',

      'Property Type (Current)': data?.propertyType,
      Verified_PropertyType: getPreviewValue(
        data?.propertyType,
        propertyDropdown,
        propertyVerification,
        propertyDropdownOptions,
      ),
      selectedDate: selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : null,
      apartmentDetail: apartmentDetail,
      apartmentLabel: apartmentLabel,
    };
    console.log('generatedPreview', generatedPreview);

    if (data?.propertyType !== 'VACANT LAND') {
      floorIds.forEach((floor, index) => {
        const floorId = floor.id;
        const floorPrefix = floor.floorName || `Floor ${index + 1}`;

        generatedPreview[`Usage Type (${floorPrefix} Current)`] =
          floor?.usageType;
        generatedPreview[`Verified_Usage${floorPrefix}`] = getPreviewValue(
          floor?.usageType,
          getFloorState(floorId, 'usageType', 'dropdown'),
          getFloorState(floorId, 'usageType', 'verification'),
          usageTypeDropdownOptions,
        );

        generatedPreview[`Occupancy Type (${floorPrefix} Current)`] =
          floor?.occupancyName;
        generatedPreview[`Verified_Occupancy${floorPrefix}`] = getPreviewValue(
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
        generatedPreview[`Verified_BuiltUp${floorPrefix}`] = getPreviewValue(
          floor?.builtupArea,
          getFloorState(floorId, 'builtupArea', 'dropdown'),
          getFloorState(floorId, 'builtupArea', 'verification'),
          buildupAreaDropdownOptions,
          getFloorState(floorId, 'builtupArea', 'input'),
        );

        generatedPreview[`Date From (${floorPrefix} Current)`] =
          floor?.dateFrom;
        generatedPreview[`Verified_DateFrom${floorPrefix}`] = getPreviewValue(
          floor?.dateFrom,
          getFloorState(floorId, 'dateFrom', 'dropdown'),
          getFloorState(floorId, 'dateFrom', 'verification'),
          null,
          null,
          true,
        );

        generatedPreview[`Date To (${floorPrefix} Current)`] = floor?.dateUpto;
        generatedPreview[`Verified_DateTo${floorPrefix}`] = getPreviewValue(
          floor?.dateUpto,
          getFloorState(floorId, 'dateTo', 'dropdown'),
          getFloorState(floorId, 'dateTo', 'verification'),
          null,
          null,
          true,
        );
      });
    }

    setPreviewData(generatedPreview);
    setIsPreviewVisible(true);
    console.log('Preview Visible:', isPreviewVisible);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading survey data...</Text>
      </View>
    );
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

        {/* Application Info */}
        <ApplicationInfo data={data} />

        {/* Percentage of Property Transfer */}
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
            showError={showError}
          />
        )}

        <VerificationCard
          label="Road Type"
          value={data?.roadType || ''} // Current value from API
          dropdownOptions={roadTypeOptions} // Options
          selectedVerification={roadTypeVerification} // Correct / Incorrect
          setSelectedVerification={setRoadTypeVerification}
          dropdownValue={roadType} // Selected dropdown value
          setDropdownValue={setRoadType}
          showError={showError}
        />

        {/* Ward Verifications */}
        <VerificationCard
          label="Ward No."
          value={data?.wardNo || ''}
          dropdownOptions={wardDropdownOptions}
          selectedVerification={wardVerification}
          setSelectedVerification={setWardVerification}
          dropdownValue={wardDropdown}
          setDropdownValue={setWardDropdown}
          showError={showError}
        />

        {/* <VerificationCard
          label="New Ward No."
          value={data?.newWardNo || ''}
          dropdownOptions={newWardOptions}
          selectedVerification={newWardVerification}
          setSelectedVerification={setNewWardVerification}
          dropdownValue={newWardDropdown}
          setDropdownValue={setNewWardDropdown}
          hideCorrectOption={wardVerification === 'Incorrect'}
          showError={showError}
        /> */}

        {/* Zone Verification */}
        <VerificationCard
          label="Circle"
          value={data?.zone || ''}
          dropdownOptions={zoneDropdownOptions}
          selectedVerification={zoneVerification}
          setSelectedVerification={setZoneVerification}
          dropdownValue={zoneDropdown}
          setDropdownValue={setZoneDropdown}
          showError={showError}
        />

        <VerificationCard
          label="Area of Plot"
          value={data?.areaOfPlot || ''}
          selectedVerification={plotAreaVerification}
          setSelectedVerification={setPlotAreaVerification}
          showInputOnIncorrect={true}
          inputValue={plotAreaValue}
          setInputValue={setPlotAreaValue}
          inputLabel="Enter Area of Plot"
          inputPlaceholder="Enter area (sq.ft)"
          keyboardType="numeric"
          editable={true}
          showError={showError}
        />

        {/* Built-up Area Verification */}
        {/* Built-up Area Verification (INPUT on Incorrect) */}
        {selectedPropertyId !== 4 && (
          <VerificationCard
            label="Built-up Area"
            value={data?.builtupArea || ''}
            selectedVerification={buildupVerification}
            setSelectedVerification={setBuildupVerification}
            showInputOnIncorrect={true}
            inputValue={buildupValue}
            setInputValue={setBuildupValue}
            inputLabel="Enter Built-up Area"
            inputPlaceholder="Enter area (sq.ft)"
            keyboardType="numeric"
            editable={true}
            showError={showError}
          />
        )}

        {/* Property Type Verification */}
        <VerificationCard
          label="Property Type"
          value={data?.propertyType || ''}
          dropdownOptions={propertyDropdownOptions || []}
          selectedVerification={propertyVerification}
          setSelectedVerification={setPropertyVerification}
          dropdownValue={propertyDropdown}
          setDropdownValue={setPropertyDropdown}
          showError={showError}
        />

        {/* Apartment Details Section */}
        {selectedPropertyId == 1 &&
          (() => {
            console.log('✅ Rendering ApartmentDetailsSection');
            console.log('selectedDate:', selectedDate);
            console.log('showDatePicker:', showDatePicker);
            console.log('apartmentList:', apartmentList);
            console.log('apartmentDetail:', apartmentLabel);
            console.log('error:', error);

            return (
              <ApartmentDetailsSection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                apartmentList={apartmentList}
                apartmentDetail={apartmentDetail}
                setApartmentDetail={setApartmentDetail}
                setApartmentLabel={setApartmentLabel}
                error={error}
              />
            );
          })()}

        {(selectedPropertyId === 3 || selectedPropertyId === 4) && (
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>
              Date of Possession / Purchase
            </Text>

            <TouchableOpacity
              onPress={() => setShowPropertyDatePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 12,
                borderRadius: 6,
              }}
            >
              <Text>
                {propertyDate
                  ? propertyDate.toISOString().split('T')[0]
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {showPropertyDatePicker && (
          <DateTimePicker
            value={propertyDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowPropertyDatePicker(false);
              if (selectedDate) {
                setPropertyDate(selectedDate);
              }
            }}
          />
        )}

        {/* Floor Verification Section */}
        {shouldShowSections &&
          selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' && (
            <>
              <FloorVerificationSection
                floorIds={floorIds}
                getFloorState={getFloorState}
                updateFloorState={updateFloorState}
                usageTypeDropdownOptions={usageTypeDropdownOptions}
                occupancyTypeDropdownOptions={occupancyTypeDropdownOptions}
                constructionTypeDropdownOptions={
                  constructionTypeDropdownOptions
                }
                buildupAreaDropdownOptions={buildupAreaDropdownOptions}
                showError={showError}
                setShowDateFromParkingPicker={setShowDateFromParkingPicker}
                setShowDateFromBasementPicker={setShowDateFromBasementPicker}
                setShowDateToParkingPicker={setShowDateToParkingPicker}
                setShowDateToBasementPicker={setShowDateToBasementPicker}
              />

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
                            setFloors([1]);
                          } else if (addExtraFloor) {
                            setFloors([]);
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
                      <ExtraFloorForm
                        floors={floors}
                        addFloor={addFloor}
                        removeFloor={removeFloor}
                        updateFloor={updateFloor}
                        floorNameDropdownOptions={floorNameDropdownOptions}
                        constructionTypeDropdownOptions={
                          constructionTypeDropdownOptions
                        }
                        occupancyTypeDropdownOptions={
                          occupancyTypeDropdownOptions
                        }
                        usageTypeDropdownOptions={usageTypeDropdownOptions}
                      />
                    )}
                  </View>
                </View>
              )}
            </>
          )}

        {/* Extra Charges Section */}
        <View style={[styles.card, styles.shadow]}>
          <ExtraChargesSection
            propertyTypeId={
              propertyDropdown ? propertyDropdown : data?.propertyTypeId
            }
            {...extraCharges}
            yesNoOptions={yesNoOptions}
            isRessessment={false}
            isMutation={false}
          />
        </View>

        {/* Preview Button */}
        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>

        {/* Preview Modal */}
        <PreviewModal
          visible={isPreviewVisible}
          onClose={() => setIsPreviewVisible(false)}
          onSubmit={handleSubmitPreview}
          previewData={previewData}
          data={data}
          selectedPropertyLabel={selectedPropertyLabel}
          selectedPropertyId={selectedPropertyId}
          propertyDropdownOptions={propertyDropdownOptions}
          floorIds={floorIds}
          addExtraFloor={addExtraFloor}
          floors={floors}
          floorNameDropdownOptions={floorNameDropdownOptions}
          constructionTypeDropdownOptions={constructionTypeDropdownOptions}
          occupancyTypeDropdownOptions={occupancyTypeDropdownOptions}
          usageTypeDropdownOptions={usageTypeDropdownOptions}
          {...extraCharges}
        />

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
  previewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 60,
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  extraFloorContainer: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
});
