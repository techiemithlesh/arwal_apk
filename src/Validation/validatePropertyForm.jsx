export const validatePropertyForm = ({
  values,
  ownerDetails,
  floorDetails,
  propertyTypeLabel,
  setError,
  setTouchedFields,
  showToast,
}) => {
  let newErrors = {};

  // Mark fields as touched
  setTouchedFields(prev => ({
    ...prev,
    oldWard: true,
    newWard: true,
    ownershipType: true,
    propertyType: true,
    zone: true,
  }));

  const {
    oldWard,
    ownershipType,
    propertyType,
    zone,
    buildArea,
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
  } = values;

  // ---------- BASIC VALIDATIONS ----------
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

  if (!buildArea || isNaN(buildArea) || Number(buildArea) <= 0) {
    newErrors.buildArea = 'Built-up Area must be greater than 0';
    setError(newErrors);
    showToast('error', 'Enter valid Built-up Area');
    return false;
  }

  // ---------- OWNER VALIDATIONS ----------
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' - .]+$/;

  for (let i = 0; i < ownerDetails.length; i++) {
    const owner = ownerDetails[i];

    if (!owner.ownerName || !nameRegex.test(owner.ownerName)) {
      newErrors[`ownerName_${i}`] = 'Invalid Owner Name';
      setError(newErrors);
      showToast('error', `Invalid Owner Name for Owner ${i + 1}`);
      return false;
    }

    if (!owner.guardianName || !nameRegex.test(owner.guardianName)) {
      newErrors[`guardianName_${i}`] = 'Invalid Guardian Name';
      setError(newErrors);
      showToast('error', `Invalid Guardian Name for Owner ${i + 1}`);
      return false;
    }

    if (!/^\d{10}$/.test(owner.mobile)) {
      newErrors[`mobile_${i}`] = 'Mobile must be 10 digits';
      setError(newErrors);
      showToast('error', `Invalid Mobile for Owner ${i + 1}`);
      return false;
    }
  }

  // ---------- EXTRA CHARGES ----------
  if (mobileTower === 'yes') {
    if (!towerArea || !installationDate) {
      showToast('error', 'Enter Mobile Tower details');
      return false;
    }
  }

  if (hoarding === 'yes') {
    if (!hoardingArea || !hoardingInstallationDate) {
      showToast('error', 'Enter Hoarding details');
      return false;
    }
  }

  if (petrolPump === 'yes') {
    if (!pumpArea || !pumpInstallationDate) {
      showToast('error', 'Enter Petrol Pump details');
      return false;
    }
  }

  if (rainHarvesting === 'yes' && !completionDate) {
    showToast('error', 'Select Rain Harvesting Completion Date');
    return false;
  }

  // ---------- FLOOR DETAILS ----------
  if (propertyTypeLabel !== 'VACANT LAND') {
    for (let i = 0; i < floorDetails.length; i++) {
      const floor = floorDetails[i];

      if (
        !floor.floorName ||
        !floor.usageType ||
        !floor.constructionType ||
        !floor.occupancyType ||
        !floor.builtUpArea ||
        floor.builtUpArea <= 0 ||
        !floor.fromDate
      ) {
        showToast('error', `Fill all details for Floor ${i + 1}`);
        return false;
      }
    }
  }

  // ✅ ALL GOOD
  setError({});
  return true;
};
