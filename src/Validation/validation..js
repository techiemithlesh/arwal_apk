// formValidation.js
import { Alert } from 'react-native';

export const scrollToInput = (inputRef, scrollViewRef) => {
  if (inputRef && inputRef.current && scrollViewRef?.current) {
    inputRef.current.measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({ y: y, animated: true });
        inputRef.current.focus?.(); // focus safely
      },
      error => console.log('measureLayout error:', error)
    );
  }
};

export const handleValidation = ({
  // Basic fields
  ownerName,
  guardianName,
  mobile,
  aadhaar,
  pan,
  email,
  kNo,
  accNo,
  bindBookNo,
  khataNo,
  plotNo,
  villageName,
  plotArea,
  roadWidth,
  noRoad,
  propertyAddress,
  city,
  district,
  state,
  pincode,
  correspondingAddress,
  correspondingCity,
  correspondingDistrict,
  correspondingState,
  correspondingPincode,
  towerArea,
  hoardingArea,
  pumpArea,
  // Dropdowns
  oldWard,
  newWard,
  ownershipType,
  propertyType,
  zone,
  gender,
  relation,
  armedForces,
  speciallyAbled,
  electricityCategory,
  mobileTower,
  hoarding,
  petrolPump,
  rainHarvesting,
  // Floor details (array of objects)
  floorDetails,
  // Refs
  refs,
  floorRefs,
  scrollViewRef,
  setError,
  isCorrespondingChecked = false
}) => {
  const newError = {};

  // Helper to check empty fields
  const checkField = (value, key, ref) => {
    if (!value) {
      newError[key] = `${key} is required`;
      scrollToInput(ref, scrollViewRef);
      setError(newError);
      return false;
    }
    return true;
  };

  // Basic validations
  if (!checkField(ownerName, 'ownerName', refs.ownerNameRef)) return false;
  if (!checkField(guardianName, 'guardianName', refs.guardianNameRef)) return false;
  if (!checkField(mobile, 'mobile', refs.mobileRef)) return false;
  if (!checkField(aadhaar, 'aadhaar', refs.aadhaarRef)) return false;
  if (!checkField(pan, 'pan', refs.panRef)) return false;
  if (!checkField(email, 'email', refs.emailRef)) return false;
  if (!checkField(kNo, 'kNo', refs.knoRef)) return false;
  if (!checkField(accNo, 'accNo', refs.accNoRef)) return false;
  if (!checkField(bindBookNo, 'bindBookNo', refs.bindBookNoRef)) return false;
  if (!checkField(khataNo, 'khataNo', refs.khataNoRef)) return false;
  if (!checkField(plotNo, 'plotNo', refs.plotNoRef)) return false;
  if (!checkField(villageName, 'villageName', refs.villageNameRef)) return false;
  if (!checkField(plotArea, 'plotArea', refs.plotAreaRef)) return false;
  if (!checkField(roadWidth, 'roadWidth', refs.roadWidthRef)) return false;
  if (!checkField(noRoad, 'noRoad', refs.noRoadRef)) return false;
  if (!checkField(propertyAddress, 'propertyAddress', refs.propertyAddressRef)) return false;
  if (!checkField(city, 'city', refs.cityRef)) return false;
  if (!checkField(district, 'district', refs.districtRef)) return false;
  if (!checkField(state, 'state', refs.stateRef)) return false;
  if (!checkField(pincode, 'pincode', refs.pincodeRef)) return false;

  // Corresponding address (conditional)
  if (isCorrespondingChecked) {
    if (!checkField(correspondingAddress, 'correspondingAddress', refs.correspondingAddressRef)) return false;
    if (!checkField(correspondingCity, 'correspondingCity', refs.correspondingCityRef)) return false;
    if (!checkField(correspondingDistrict, 'correspondingDistrict', refs.correspondingDistrictRef)) return false;
    if (!checkField(correspondingState, 'correspondingState', refs.correspondingStateRef)) return false;
    if (!checkField(correspondingPincode, 'correspondingPincode', refs.correspondingPincodeRef)) return false;
  }

  // Dropdowns / selects
  if (!checkField(oldWard, 'oldWard', refs.oldWardRef)) return false;
  if (!checkField(newWard, 'newWard', refs.newWardRef)) return false;
  if (!checkField(ownershipType, 'ownershipType', refs.ownershipTypeRef)) return false;
  if (!checkField(propertyType, 'propertyType', refs.propertyTypeRef)) return false;
  if (!checkField(zone, 'zone', refs.zoneRef)) return false;
  if (!checkField(gender, 'gender', refs.genderRef)) return false;
  if (!checkField(relation, 'relation', refs.relationRef)) return false;
  if (!checkField(armedForces, 'armedForces', refs.armedForcesRef)) return false;
  if (!checkField(speciallyAbled, 'speciallyAbled', refs.speciallyAbledRef)) return false;
  if (!checkField(electricityCategory, 'electricityCategory', refs.electricityCategoryRef)) return false;
  if (!checkField(mobileTower, 'mobileTower', refs.mobileTowerRef)) return false;
  if (!checkField(hoarding, 'hoarding', refs.hoardingRef)) return false;
  if (!checkField(petrolPump, 'petrolPump', refs.petrolPumpRef)) return false;
  if (!checkField(rainHarvesting, 'rainHarvesting', refs.rainHarvestingRef)) return false;

  // Floor validation
  if (floorDetails && floorDetails.length > 0) {
    for (let i = 0; i < floorDetails.length; i++) {
      const floor = floorDetails[i];
      const floorRef = floorRefs.current[i];
      if (!floor.floorName || !floor.usageType || !floor.occupancyType || !floor.constructionType || !floor.builtUpArea) {
        newError[`floor_${i}`] = 'All floor fields are required';
        scrollToInput(floorRef, scrollViewRef);
        setError(newError);
        return false;
      }
    }
  }

  setError({});
  return true;
};


// dateValidation.js

export const validateExtraChargesDates = ({
  mobileTower,
  installationDate,
  hoarding,
  hoardingInstallationDate,
  petrolPump,
  pumpInstallationDate,
  rainHarvesting,
  completionDate,
}) => {
  const today = new Date();

  const isFutureDate = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d > today;
  };

  // Mobile Tower
  if (mobileTower === 'yes') {
    if (!installationDate) {
      Alert.alert('Validation Error', 'Please select Mobile Tower Installation Date.');
      return false;
    }
    if (isFutureDate(installationDate)) {
      Alert.alert(
        'Validation Error',
        'Mobile Tower Installation Date cannot be in the future.'
      );
      return false;
    }
  }

  // Hoarding
  if (hoarding === 'yes') {
    if (!hoardingInstallationDate) {
      Alert.alert('Validation Error', 'Please select Hoarding Installation Date.');
      return false;
    }
    if (isFutureDate(hoardingInstallationDate)) {
      Alert.alert(
        'Validation Error',
        'Hoarding Installation Date cannot be in the future.'
      );
      return false;
    }
  }

  // Petrol Pump
  if (petrolPump === 'yes') {
    if (!pumpInstallationDate) {
      Alert.alert('Validation Error', 'Please select Petrol Pump Installation Date.');
      return false;
    }
    if (isFutureDate(pumpInstallationDate)) {
      Alert.alert(
        'Validation Error',
        'Petrol Pump Installation Date cannot be in the future.'
      );
      return false;
    }
  }

  // Rain Harvesting
  if (rainHarvesting === 'yes') {
    if (!completionDate) {
      Alert.alert('Validation Error', 'Please select Rain Harvesting Completion Date.');
      return false;
    }
    if (isFutureDate(completionDate)) {
      Alert.alert(
        'Validation Error',
        'Rain Harvesting Completion Date cannot be in the future.'
      );
      return false;
    }
  }

  return true; // All validations passed
};
