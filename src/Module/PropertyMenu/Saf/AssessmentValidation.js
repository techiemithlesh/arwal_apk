export const scrollToInput = (inputRef, scrollViewRef, errorField) => {
  if (!scrollViewRef?.current) return;
  
  setTimeout(() => {
    if (scrollViewRef.current) {
      // Map error fields to their approximate scroll positions in the form
      const fieldScrollPositions = {
        // Assessment Type section (top of form)
        oldWard: 0,
        newWard: 0,
        ownershipType: 0,
        propertyType: 0,
        zone: 0,
        
        // Owner Details section
        ownerName: 700,
        gender: 700,
        guardianName: 700,
        relation: 700,
        mobile: 700,
        aadhaar: 700,
        pan: 700,
        email: 700,
        armedForces: 700,
        speciallyAbled: 700,
        
        // Electricity Details section
        kno: 1400,
        accNo: 1400,
        bindBookNo: 1400,
        electricityCategory: 1400,
        
        // Property Details section
        khataNo: 1800,
        plotNo: 1800,
        villageName: 1800,
        plotArea: 1800,
        roadWidth: 1800,
        noRoad: 1800,
        
        // Property Address section
        propertyAddress: 2200,
        city: 2200,
        district: 2200,
        state: 2200,
        pincode: 2200,
        
        // Corresponding Address section
        correspondingAddress: 2800,
        correspondingCity: 2800,
        correspondingDistrict: 2800,
        correspondingState: 2800,
        correspondingPincode: 2800,
        
        // Extra Charges section
        mobileTower: 3200,
        towerArea: 3200,
        hoarding: 3200,
        hoardingArea: 3200,
        petrolPump: 3200,
        pumpArea: 3200,
        rainHarvesting: 3200,
      };
      
      // Get scroll position based on error field name or default to top
      const scrollY = fieldScrollPositions[errorField] || 0;
      
      scrollViewRef.current.scrollTo({
        y: scrollY,
        animated: true
      });
    }
  }, 100);
};

const validateMobile = mobile => /^[6-9]\d{9}$/.test(mobile);
const validateAadhaar = aadhaar => /^\d{12}$/.test(aadhaar);
const validatePAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
const validatePincode = pincode => /^\d{6}$/.test(pincode);

export const handleValidation = ({
  // Assessment Type
  oldWard,
  newWard,
  ownershipType,
  propertyType,
  zone,
  
  // Owner Details
  ownerName,
  gender,
  dob,
  guardianName,
  relation,
  mobile,
  aadhaar,
  pan,
  email,
  armedForces,
  speciallyAbled,
  
  // Electricity Details
  kno,
  accNo,
  bindBookNo,
  electricityCategory,
  
  // Property Details
  khataNo,
  plotNo,
  villageName,
  plotArea,
  roadWidth,
  noRoad,
  
  // Property Address
  propertyAddress,
  city,
  district,
  state,
  pincode,
  
  // Corresponding Address
  isChecked,
  correspondingAddress,
  correspondingCity,
  correspondingDistrict,
  correspondingState,
  correspondingPincode,
  
  // Extra Charges
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
  
  // Floor Details
  propertyTypeLabel,
  floorDetails,
  
  // Refs
  oldWardRef,
  newWardRef,
  ownershipTypeRef,
  propertyTypeRef,
  zoneRef,
  ownerNameRef,
  genderRef,
  guardianNameRef,
  relationRef,
  mobileRef,
  aadhaarRef,
  panRef,
  emailRef,
  armedForcesRef,
  speciallyAbledRef,
  knoRef,
  accNoRef,
  bindBookNoRef,
  electricityCategoryRef,
  khataNoRef,
  plotNoRef,
  villageNameRef,
  plotAreaRef,
  roadWidthRef,
  noRoadRef,
  propertyAddressRef,
  cityRef,
  districtRef,
  stateRef,
  pincodeRef,
  correspondingAddressRef,
  correspondingCityRef,
  correspondingDistrictRef,
  correspondingStateRef,
  correspondingPincodeRef,
  mobileTowerRef,
  towerAreaRef,
  hoardingRef,
  hoardingAreaRef,
  petrolPumpRef,
  pumpAreaRef,
  rainHarvestingRef,
  floorRefs,
  scrollViewRef,
  setError,
}) => {
  // Clear previous errors
  setError({});
  
  // Assessment Type validations
  if (!oldWard) {
    setError({ oldWard: 'Please select Old Ward' });
    scrollToInput(oldWardRef, scrollViewRef, 'oldWard');
    return false;
  }

  if (!newWard) {
    setError({ newWard: 'Please select New Ward' });
    scrollToInput(newWardRef, scrollViewRef, 'newWard');
    return false;
  }

  if (!ownershipType) {
    setError({ ownershipType: 'Please select Ownership Type' });
    scrollToInput(ownershipTypeRef, scrollViewRef, 'ownershipType');
    return false;
  }

  if (!propertyType) {
    setError({ propertyType: 'Please select Property Type' });
    scrollToInput(propertyTypeRef, scrollViewRef, 'propertyType');
    return false;
  }

  if (!zone) {
    setError({ zone: 'Please select Zone' });
    scrollToInput(zoneRef, scrollViewRef, 'zone');
    return false;
  }

  // Owner Details validations
  if (!ownerName || ownerName.trim().length < 2) {
    setError({ ownerName: 'Please enter a valid Owner Name (minimum 2 characters)' });
    scrollToInput(ownerNameRef, scrollViewRef, 'ownerName');
    return false;
  }

  if (!gender) {
    setError({ gender: 'Please select Gender' });
    scrollToInput(genderRef, scrollViewRef, 'gender');
    return false;
  }

  if (!dob) {
    setError({ dob: 'Please select Date of Birth' });
    scrollToInput(null, scrollViewRef, 'ownerName');
    return false;
  }

  if (!guardianName || guardianName.trim().length < 2) {
    setError({ guardianName: 'Please enter a valid Guardian Name (minimum 2 characters)' });
    scrollToInput(guardianNameRef, scrollViewRef, 'guardianName');
    return false;
  }

  if (!relation) {
    setError({ relation: 'Please select Relation' });
    scrollToInput(relationRef, scrollViewRef, 'relation');
    return false;
  }

  if (!mobile || !validateMobile(mobile)) {
    setError({ mobile: 'Please enter a valid 10-digit Mobile Number starting with 6-9' });
    scrollToInput(mobileRef, scrollViewRef, 'mobile');
    return false;
  }

  if (!aadhaar || !validateAadhaar(aadhaar)) {
    setError({ aadhaar: 'Please enter a valid 12-digit Aadhaar Number' });
    scrollToInput(aadhaarRef, scrollViewRef, 'aadhaar');
    return false;
  }

  if (!pan || !validatePAN(pan)) {
    setError({ pan: 'Please enter a valid PAN Number (e.g., ABCDE1234F)' });
    scrollToInput(panRef, scrollViewRef, 'pan');
    return false;
  }

  if (!email || !validateEmail(email)) {
    setError({ email: 'Please enter a valid Email Address' });
    scrollToInput(emailRef, scrollViewRef, 'email');
    return false;
  }

  if (!armedForces) {
    setError({ armedForces: 'Please select Armed Forces status' });
    scrollToInput(armedForcesRef, scrollViewRef, 'armedForces');
    return false;
  }

  if (!speciallyAbled) {
    setError({ speciallyAbled: 'Please select Specially Abled status' });
    scrollToInput(speciallyAbledRef, scrollViewRef, 'speciallyAbled');
    return false;
  }

  // Electricity Details validations
  if (!kno || kno.trim().length < 4) {
    setError({ kno: 'Please enter a valid Electricity K. No' });
    scrollToInput(knoRef, scrollViewRef, 'kno');
    return false;
  }

  if (!accNo || accNo.trim().length < 2) {
    setError({ accNo: 'Please enter a valid ACC No' });
    scrollToInput(accNoRef, scrollViewRef, 'accNo');
    return false;
  }

  if (!bindBookNo || bindBookNo.trim().length < 2) {
    setError({ bindBookNo: 'Please enter a valid BIND/BOOK No' });
    scrollToInput(bindBookNoRef, scrollViewRef, 'bindBookNo');
    return false;
  }

  if (!electricityCategory) {
    setError({ electricityCategory: 'Please select Electricity Category' });
    scrollToInput(electricityCategoryRef, scrollViewRef, 'electricityCategory');
    return false;
  }

  // Property Details validations
  // if (!khataNo || khataNo.trim().length < 1) {
  //   setError({ khataNo: 'Please enter Khata No' });
  //   scrollToInput(khataNoRef, scrollViewRef, 'khataNo');
  //   return false;
  // }

  // if (!plotNo || plotNo.trim().length < 1) {
  //   setError({ plotNo: 'Please enter Plot No' });
  //   scrollToInput(plotNoRef, scrollViewRef, 'plotNo');
  //   return false;
  // }

  if (!villageName || villageName.trim().length < 2) {
    setError({ villageName: 'Please enter Village Name' });
    scrollToInput(villageNameRef, scrollViewRef, 'villageName');
    return false;
  }

  if (!plotArea || isNaN(plotArea) || parseFloat(plotArea) <= 0) {
    setError({ plotArea: 'Please enter a valid Plot Area' });
    scrollToInput(plotAreaRef, scrollViewRef, 'plotArea');
    return false;
  }

  if (!roadWidth || isNaN(roadWidth) || parseFloat(roadWidth) <= 0) {
    setError({ roadWidth: 'Please enter a valid Road Width' });
    scrollToInput(roadWidthRef, scrollViewRef, 'roadWidth');
    return false;
  }

  if (!noRoad || noRoad.trim().length < 1) {
    setError({ noRoad: 'Please enter No. of Road' });
    scrollToInput(noRoadRef, scrollViewRef, 'noRoad');
    return false;
  }

  // Property Address validations
  if (!propertyAddress || propertyAddress.trim().length < 5) {
    setError({ propertyAddress: 'Please enter a valid Property Address (minimum 5 characters)' });
    scrollToInput(propertyAddressRef, scrollViewRef, 'propertyAddress');
    return false;
  }

  if (!city || city.trim().length < 2) {
    setError({ city: 'Please enter a valid City name' });
    scrollToInput(cityRef, scrollViewRef, 'city');
    return false;
  }

  if (!district || district.trim().length < 2) {
    setError({ district: 'Please enter a valid District name' });
    scrollToInput(districtRef, scrollViewRef, 'district');
    return false;
  }

  if (!state || state.trim().length < 2) {
    setError({ state: 'Please enter a valid State name' });
    scrollToInput(stateRef, scrollViewRef, 'state');
    return false;
  }

  if (!pincode || !validatePincode(pincode)) {
    setError({ pincode: 'Please enter a valid 6-digit Pincode' });
    scrollToInput(pincodeRef, scrollViewRef, 'pincode');
    return false;
  }

  // Corresponding Address validations (if checkbox is checked)
  if (isChecked) {
    if (!correspondingAddress || correspondingAddress.trim().length < 5) {
      setError({ correspondingAddress: 'Please enter a valid Corresponding Address' });
      scrollToInput(correspondingAddressRef, scrollViewRef, 'correspondingAddress');
      return false;
    }

    if (!correspondingCity || correspondingCity.trim().length < 2) {
      setError({ correspondingCity: 'Please enter a valid Corresponding City' });
      scrollToInput(correspondingCityRef, scrollViewRef, 'correspondingCity');
      return false;
    }

    if (!correspondingDistrict || correspondingDistrict.trim().length < 2) {
      setError({ correspondingDistrict: 'Please enter a valid Corresponding District' });
      scrollToInput(correspondingDistrictRef, scrollViewRef, 'correspondingDistrict');
      return false;
    }

    if (!correspondingState || correspondingState.trim().length < 2) {
      setError({ correspondingState: 'Please enter a valid Corresponding State' });
      scrollToInput(correspondingStateRef, scrollViewRef, 'correspondingState');
      return false;
    }

    if (!correspondingPincode || !validatePincode(correspondingPincode)) {
      setError({ correspondingPincode: 'Please enter a valid 6-digit Corresponding Pincode' });
      scrollToInput(correspondingPincodeRef, scrollViewRef, 'correspondingPincode');
      return false;
    }
  }

  // Extra Charges validations
  if (!mobileTower) {
    setError({ mobileTower: 'Please select Mobile Tower status' });
    scrollToInput(mobileTowerRef, scrollViewRef, 'mobileTower');
    return false;
  }

  if (mobileTower === 'yes') {
    if (!towerArea || towerArea.trim().length < 1) {
      setError({ towerArea: 'Please enter Tower Area' });
      scrollToInput(towerAreaRef, scrollViewRef, 'towerArea');
      return false;
    }

    if (!installationDate) {
      setError({ installationDate: 'Please select Mobile Tower Installation Date' });
      scrollToInput(null, scrollViewRef, 'mobileTower');
      return false;
    }
  }

  if (!hoarding) {
    setError({ hoarding: 'Please select Hoarding Board status' });
    scrollToInput(hoardingRef, scrollViewRef, 'hoarding');
    return false;
  }

  if (hoarding === 'yes') {
    if (!hoardingArea || hoardingArea.trim().length < 1) {
      setError({ hoardingArea: 'Please enter Hoarding Area' });
      scrollToInput(hoardingAreaRef, scrollViewRef, 'hoardingArea');
      return false;
    }

    if (!hoardingInstallationDate) {
      setError({ hoardingInstallationDate: 'Please select Hoarding Installation Date' });
      scrollToInput(null, scrollViewRef, 'hoarding');
      return false;
    }
  }

  if (!petrolPump) {
    setError({ petrolPump: 'Please select Petrol Pump status' });
    scrollToInput(petrolPumpRef, scrollViewRef, 'petrolPump');
    return false;
  }

  if (petrolPump === 'yes') {
    if (!pumpArea || pumpArea.trim().length < 1) {
      setError({ pumpArea: 'Please enter Pump Area' });
      scrollToInput(pumpAreaRef, scrollViewRef, 'pumpArea');
      return false;
    }

    if (!pumpInstallationDate) {
      setError({ pumpInstallationDate: 'Please select Pump Installation Date' });
      scrollToInput(null, scrollViewRef, 'petrolPump');
      return false;
    }
  }

  if (!rainHarvesting) {
    setError({ rainHarvesting: 'Please select Rainwater Harvesting status' });
    scrollToInput(rainHarvestingRef, scrollViewRef, 'rainHarvesting');
    return false;
  }

  if (rainHarvesting === 'yes' && !completionDate) {
    setError({ completionDate: 'Please select Rainwater Harvesting Completion Date' });
    scrollToInput(null, scrollViewRef, 'rainHarvesting');
    return false;
  }

  // Floor Details validations (if not VACANT LAND)
  if (propertyTypeLabel !== 'VACANT LAND') {
    for (let i = 0; i < floorDetails.length; i++) {
      const floor = floorDetails[i];

      if (!floor.floorName) {
        setError({ [`floorName-${i}`]: `Please select Floor Name for Floor ${i + 1}` });
        return false;
      }

      if (!floor.usageType) {
        setError({ [`usageType-${i}`]: `Please select Usage Type for Floor ${i + 1}` });
        return false;
      }

      if (!floor.occupancyType) {
        setError({ [`occupancyType-${i}`]: `Please select Occupancy Type for Floor ${i + 1}` });
        return false;
      }

      if (!floor.constructionType) {
        setError({ [`constructionType-${i}`]: `Please select Construction Type for Floor ${i + 1}` });
        return false;
      }

      if (!floor.builtUpArea || isNaN(floor.builtUpArea) || parseFloat(floor.builtUpArea) <= 0) {
        setError({ [`builtUpArea-${i}`]: `Please enter a valid Built Up Area for Floor ${i + 1}` });
        scrollToInput({ current: floorRefs.current[i] }, scrollViewRef);
        return false;
      }

      if (!floor.fromDate) {
        setError({ [`fromDate-${i}`]: `Please select From Date for Floor ${i + 1}` });
        return false;
      }

      if (!floor.uptoDate) {
        setError({ [`uptoDate-${i}`]: `Please select Upto Date for Floor ${i + 1}` });
        return false;
      }
    }
  }

  // All validations passed
  return true;
};