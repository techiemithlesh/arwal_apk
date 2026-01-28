/**
 * Validation functions for ApplyAssessment form
 */

export const validateField = (fieldName, value) => {
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
  const alphabetRegex = /^[A-Za-z\s]+$/;
  const addressRegex = /^[A-Za-z0-9\s,./-]+$/;

  switch (fieldName) {
    case 'oldWard':
      return !value ? 'Old Ward is required' : '';
    case 'ownershipType':
      return !value ? 'Ownership Type is required' : '';
    case 'propertyType':
      return !value ? 'Property Type is required' : '';
    case 'zone':
      return !value ? 'Zone is required' : '';
    case 'khataNo':
      if (!value) return 'Khata No is required';
      if (!addressRegex.test(value)) return 'Invalid Khata No';
      return '';
    case 'plotNo':
      if (!value) return 'Plot No is required';
      if (!addressRegex.test(value)) return 'Invalid Plot No';
      return '';
    case 'villageName':
      if (!value) return 'Village Name is required';
      if (!alphabetRegex.test(value))
        return 'Village Name must contain only letters';
      return '';
    case 'plotArea':
      if (!value) return 'Plot Area is required';
      if (isNaN(value)) return 'Plot Area must be a number';
      return '';
    case 'buildArea':
      if (!value) return 'Built-up Area is required';
      if (isNaN(value)) return 'Built-up Area must be a number';
      if (Number(value) <= 0) return 'Built-up Area must be greater than 0';
      if (!/^\d+(\.\d{1,2})?$/.test(value))
        return 'Invalid format. Use numbers only (up to 2 decimals)';
      return '';
    case 'roadWidth':
      if (!value) return 'Road Width is required';
      if (isNaN(value)) return 'Road Width must be a number';
      if (Number(value) > 499)
        return 'Road Width must not be greater than 499';
      return '';
    case 'waterConnectionFacility':
      return !value ? 'Water Connection Facility is required' : '';
    case 'waterTaxType':
      return !value ? 'Water Tax Type is required' : '';
    default:
      return '';
  }
};

export const validateOwnerField = (index, fieldName, value) => {
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

export const validateFloorField = (index, fieldName, value) => {
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

export const validateSWMField = (fieldName, value) => {
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
  const mobileRegex = /^\d{10}$/;

  switch (fieldName) {
    case 'occupancyType':
      return !value ? 'Occupancy Type is required' : '';
    case 'consumerName':
      if (!value) return 'Consumer Name is required';
      if (!nameRegex.test(value))
        return 'Consumer Name can only contain letters and spaces';
      return '';
    case 'guardianName':
      if (!value) return 'Guardian Name is required';
      if (!nameRegex.test(value))
        return 'Guardian Name can only contain letters and spaces';
      return '';
    case 'mobileNo':
      if (!value) return 'Mobile No is required';
      if (!mobileRegex.test(value)) return 'Mobile number must be 10 digits';
      return '';
    case 'consumerCategory':
      return !value ? 'Consumer Category is required' : '';
    case 'category':
      return !value ? 'Category is required' : '';
    case 'consumerRange':
      return !value ? 'Consumer Range is required' : '';
    default:
      return '';
  }
};

/**
 * Main validation function for the entire form
 */
export const validateAssessmentForm = ({
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
  swanConsumerDetails,
  setError,
  showToast,
}) => {
  let newErrors = {};

  // Basic Field Validations
  if (!oldWard) {
    newErrors.oldWard = 'Old Ward is required';
    setError(newErrors);
    showToast('error', 'Select Old Ward');
    return false;
  }

  if (!ownershipType) {
    newErrors.ownershipType = 'Ownership Type is required';
    setError(newErrors);
    showToast('error', 'Select Ownership Type');
    return false;
  }

  if (!propertyType) {
    newErrors.propertyType = 'Property Type is required';
    setError(newErrors);
    showToast('error', 'Select Property Type');
    return false;
  }

  if (!zone) {
    newErrors.zone = 'Zone is required';
    setError(newErrors);
    showToast('error', 'Select Zone');
    return false;
  }

  if (!buildArea) {
    newErrors.buildArea = 'Built-up Area is required';
    setError(newErrors);
    showToast('error', 'Enter Built-up Area');
    return false;
  } else if (isNaN(buildArea)) {
    newErrors.buildArea = 'Built-up Area must be a number';
    setError(newErrors);
    showToast('error', 'Built-up Area must be numeric');
    return false;
  } else if (Number(buildArea) <= 0) {
    newErrors.buildArea = 'Built-up Area must be greater than 0';
    setError(newErrors);
    showToast('error', 'Built-up Area must be greater than 0');
    return false;
  }

  // Owner Validations
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;
  for (let i = 0; i < ownerDetails.length; i++) {
    const owner = ownerDetails[i];

    if (!owner.ownerName) {
      newErrors[`ownerName_${i}`] = 'Owner Name is required';
      setError(newErrors);
      showToast('error', `Enter Owner Name for Owner ${i + 1}`);
      return false;
    } else if (!nameRegex.test(owner.ownerName)) {
      newErrors[`ownerName_${i}`] =
        'Owner Name can only contain letters and spaces';
      setError(newErrors);
      showToast('error', `Owner Name for Owner ${i + 1} is invalid`);
      return false;
    }

    if (!owner.guardianName) {
      newErrors[`guardianName_${i}`] = 'Guardian Name is required';
      setError(newErrors);
      showToast('error', `Enter Guardian Name for Owner ${i + 1}`);
      return false;
    } else if (!nameRegex.test(owner.guardianName)) {
      newErrors[`guardianName_${i}`] =
        'Guardian Name can only contain letters and spaces';
      setError(newErrors);
      showToast('error', `Guardian Name for Owner ${i + 1} is invalid`);
      return false;
    }

    if (!owner.relation) {
      newErrors[`relation_${i}`] = 'Relation is required';
      setError(newErrors);
      showToast('error', `Select Relation for Owner ${i + 1}`);
      return false;
    }

    if (!owner.gender) {
      newErrors[`gender_${i}`] = 'Gender is required';
      setError(newErrors);
      showToast('error', `Select Gender for Owner ${i + 1}`);
      return false;
    }

    if (!owner.dob) {
      newErrors[`dob_${i}`] = 'Date of Birth is required';
      setError(newErrors);
      showToast('error', `Select Date of Birth for Owner ${i + 1}`);
      return false;
    }

    if (!owner.mobile) {
      newErrors[`mobile_${i}`] = 'Mobile is required';
      setError(newErrors);
      showToast('error', `Enter Mobile Number for Owner ${i + 1}`);
      return false;
    } else if (!/^\d{10}$/.test(owner.mobile)) {
      newErrors[`mobile_${i}`] = 'Mobile number must be 10 digits';
      setError(newErrors);
      showToast(
        'error',
        `Mobile Number for Owner ${i + 1} must be 10 digits`,
      );
      return false;
    }
  }

  // Property Details Validations
  const alphabetRegex = /^[A-Za-z\s]+$/;
  const addressRegex = /^[A-Za-z0-9\s,./-]+$/;
  const pincodeRegex = /^[0-9]{6}$/;

  // if (!khataNo) {
  //   newErrors.khataNo = 'Khata No is required';
  //   setError(newErrors);
  //   showToast('error', 'Enter Khata No');
  //   return false;
  // } else if (!addressRegex.test(khataNo)) {
  //   newErrors.khataNo = 'Invalid Khata No';
  //   setError(newErrors);
  //   showToast('error', 'Khata No can only contain letters, numbers, , . / -');
  //   return false;
  // }

  // if (!plotNo) {
  //   newErrors.plotNo = 'Plot No is required';
  //   setError(newErrors);
  //   showToast('error', 'Enter Plot No');
  //   return false;
  // } else if (!addressRegex.test(plotNo)) {
  //   newErrors.plotNo = 'Invalid Plot No';
  //   setError(newErrors);
  //   showToast('error', 'Plot No can only contain letters, numbers, , . / -');
  //   return false;
  // }

  if (!villageName) {
    newErrors.villageName = 'Village Name is required';
    setError(newErrors);
    showToast('error', 'Enter Village Name');
    return false;
  } else if (!alphabetRegex.test(villageName)) {
    newErrors.villageName = 'Invalid Village Name';
    setError(newErrors);
    showToast('error', 'Village Name must contain only letters');
    return false;
  }

  if (!plotArea) {
    newErrors.plotArea = 'Plot Area is required';
    setError(newErrors);
    showToast('error', 'Enter Plot Area');
    return false;
  } else if (isNaN(plotArea)) {
    newErrors.plotArea = 'Plot Area must be a number';
    setError(newErrors);
    showToast('error', 'Plot Area must be numeric');
    return false;
  }

  if (!roadWidth) {
    newErrors.roadWidth = 'Road Width is required';
    setError(newErrors);
    showToast('error', 'Enter Road Width');
    return false;
  } else if (isNaN(roadWidth)) {
    newErrors.roadWidth = 'Road Width must be a number';
    setError(newErrors);
    showToast('error', 'Road Width must be numeric');
    return false;
  } else if (Number(roadWidth) > 499) {
    newErrors.roadWidth = 'Road Width must not be greater than 499';
    setError(newErrors);
    showToast('error', 'Road Width equal or less than 499');
    return false;
  }

  // Address Validations
  if (!propertyAddress) {
    newErrors.address = 'Address is required';
    setError(newErrors);
    showToast('error', 'Enter Address');
    return false;
  } else if (!addressRegex.test(propertyAddress)) {
    newErrors.address = 'Invalid Address';
    setError(newErrors);
    showToast('error', 'Address can contain letters, numbers, and ,.-/');
    return false;
  }

  if (!city) {
    newErrors.city = 'City is required';
    setError(newErrors);
    showToast('error', 'Enter City');
    return false;
  } else if (!alphabetRegex.test(city)) {
    newErrors.city = 'City should contain only letters';
    setError(newErrors);
    showToast('error', 'City should contain only letters');
    return false;
  }

  if (!district) {
    newErrors.district = 'District is required';
    setError(newErrors);
    showToast('error', 'Enter District');
    return false;
  } else if (!alphabetRegex.test(district)) {
    newErrors.district = 'District should contain only letters';
    setError(newErrors);
    showToast('error', 'District should contain only letters');
    return false;
  }

  if (!state) {
    newErrors.state = 'State is required';
    setError(newErrors);
    showToast('error', 'Enter State');
    return false;
  } else if (!alphabetRegex.test(state)) {
    newErrors.state = 'State should contain only letters';
    setError(newErrors);
    showToast('error', 'State should contain only letters');
    return false;
  }

  if (!pincode) {
    newErrors.pincode = 'Pincode is required';
    setError(newErrors);
    showToast('error', 'Enter Pincode');
    return false;
  } else if (!pincodeRegex.test(pincode)) {
    newErrors.pincode = 'Pincode should be 6 digits';
    setError(newErrors);
    showToast('error', 'Pincode should be 6 digits');
    return false;
  }

  // Extra Charges Validations
  if (mobileTower === 'yes' || mobileTower === true) {
    if (!towerArea) {
      newErrors.towerArea = 'Tower area is required';
      setError(newErrors);
      showToast('error', 'Enter Tower Area');
      return false;
    }
    if (!installationDate) {
      newErrors.installationDate = 'Installation date is required';
      setError(newErrors);
      showToast('error', 'Select Tower Installation Date');
      return false;
    }
  }

  if (hoarding === 'yes') {
    if (!hoardingArea) {
      newErrors.hoardingArea = 'Hoarding area is required';
      setError(newErrors);
      showToast('error', 'Enter Hoarding Area');
      return false;
    }
    if (!hoardingInstallationDate) {
      newErrors.hoardingInstallationDate =
        'Hoarding Installation Date is required';
      setError(newErrors);
      showToast('error', 'Select Hoarding Installation Date');
      return false;
    }
  }

  if (petrolPump === 'yes') {
    if (!pumpArea) {
      newErrors.pumpArea = 'Pump area is required';
      setError(newErrors);
      showToast('error', 'Enter Pump Area');
      return false;
    }
    if (!pumpInstallationDate) {
      newErrors.pumpInstallationDate = 'Pump Installation Date is required';
      setError(newErrors);
      showToast('error', 'Select Pump Installation Date');
      return false;
    }
  }

  if (rainHarvesting === 'yes') {
    if (!completionDate) {
      newErrors.completionDate = 'Completion date is required';
      setError(newErrors);
      showToast('error', 'Select Rain Harvesting Completion Date');
      return false;
    }
  }

  // Floor Details Validations
  if (propertyTypeLabel !== 'VACANT LAND') {
    if (floorDetails && floorDetails.length > 0) {
      for (let index = 0; index < floorDetails.length; index++) {
        const floor = floorDetails[index];

        if (!floor.floorName) {
          newErrors[`floor_${index}_floorName`] = 'Floor name is required';
          setError(newErrors);
          showToast('error', `Select Floor Name for Floor ${index + 1}`);
          return false;
        }

        if (!floor.usageType) {
          newErrors[`floor_${index}_usageType`] = 'Usage type is required';
          setError(newErrors);
          showToast('error', `Select Usage Type for Floor ${index + 1}`);
          return false;
        }

        if (!floor.constructionType) {
          newErrors[`floor_${index}_constructionType`] =
            'Construction type is required';
          setError(newErrors);
          showToast(
            'error',
            `Select Construction Type for Floor ${index + 1}`,
          );
          return false;
        }

        if (!floor.occupancyType) {
          newErrors[`floor_${index}_occupancyType`] =
            'Occupancy type is required';
          setError(newErrors);
          showToast('error', `Select Occupancy Type for Floor ${index + 1}`);
          return false;
        }

        if (!floor.builtUpArea || floor.builtUpArea <= 0) {
          newErrors[`floor_${index}_builtUpArea`] =
            'Built-up area is required and must be > 0';
          setError(newErrors);
          showToast('error', `Enter Built-up Area for Floor ${index + 1}`);
          return false;
        }

        if (!floor.fromDate) {
          newErrors[`floor_${index}_fromDate`] = 'Start date is required';
          setError(newErrors);
          showToast('error', `Select Start Date for Floor ${index + 1}`);
          return false;
        }
      }
    }
  }

  // Water Connection Details Validations
  if (!waterConnectionFacility) {
    newErrors.waterConnectionFacility = 'Water Connection Facility is required';
    setError(newErrors);
    showToast('error', 'Select Water Connection Facility');
    return false;
  }

  if (!waterTaxType) {
    newErrors.waterTaxType = 'Water Tax Type is required';
    setError(newErrors);
    showToast('error', 'Select Water Tax Type');
    return false;
  }

  // SWM Details Validations (if SWM is checked)
//  if (isSwanChecked) {
//   for (let i = 0; i < swmConsumers.length; i++) {
//     const consumer = swmConsumers[i];

//     if (!consumer.occupancyType) {
//       newErrors[`swm_${i}_occupancyType`] = 'Occupancy Type is required';
//       setError(newErrors);
//       showToast('error', `Select Occupancy Type for SWM Consumer ${i + 1}`);
//       return false;
//     }

//     if (!consumer.consumerName) {
//       newErrors[`swm_${i}_consumerName`] = 'Consumer Name is required';
//       setError(newErrors);
//       showToast('error', `Enter Consumer Name for SWM Consumer ${i + 1}`);
//       return false;
//     }

//     if (!consumer.guardianName) {
//       newErrors[`swm_${i}_guardianName`] = 'Guardian Name is required';
//       setError(newErrors);
//       showToast('error', `Enter Guardian Name for SWM Consumer ${i + 1}`);
//       return false;
//     }

//     if (!consumer.mobileNo) {
//       newErrors[`swm_${i}_mobileNo`] = 'Mobile No is required';
//       setError(newErrors);
//       showToast('error', `Enter Mobile No for SWM Consumer ${i + 1}`);
//       return false;
//     } else if (!/^\d{10}$/.test(consumer.mobileNo)) {
//       newErrors[`swm_${i}_mobileNo`] = 'Mobile number must be 10 digits';
//       setError(newErrors);
//       showToast('error', `Mobile No must be 10 digits`);
//       return false;
//     }

//     if (!consumer.consumerCategory) {
//       newErrors[`swm_${i}_consumerCategory`] =
//         'Consumer Category is required';
//       setError(newErrors);
//       showToast('error', `Select Consumer Category for SWM Consumer ${i + 1}`);
//       return false;
//     }

//     if (!consumer.consumerRange) {
//       newErrors[`swm_${i}_consumerRange`] = 'Consumer Range is required';
//       setError(newErrors);
//       showToast('error', `Select Consumer Range for SWM Consumer ${i + 1}`);
//       return false;
//     }
//   }
// }


  // All validations passed
  setError({});
  return true;
};

