import { validateExtraChargesDates } from '../../../../Validation/validation.';

export const validatePreviewForm = ({
  propertyVerification,
  wardVerification,
  // newWardVerification,
  zoneVerification,
  data,
  percentageVerification,
  selectedPropertyLabel,
  selectedDate,
  apartmentDetail,
  shouldShowSections,
  floorIds,
  getFloorState,
  mobileTower,
  installationDate,
  hoarding,
  hoardingInstallationDate,
  petrolPump,
  pumpInstallationDate,
  rainHarvesting,
  completionDate,
}) => {
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
  // if (!newWardVerification) {
  //   errors.push('New Ward No. verification is required');
  // }

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
