Remove
 // // Keep legacy states for compatibility (will be removed later)
  // const [usageType, setUsageType] = useState(null);
  // const [usageTypeDropdown, setUsageTypeDropdown] = useState('');
  // const [occupancyType, setOccupancyType] = useState(null);
  // const [occupancyTypeDropdown, setOccupancyTypeDropdown] = useState('');
  // const [constructionType, setConstructionType] = useState(null);
  // const [constructionTypeDropdown, setConstructionTypeDropdown] = useState('');
  // const [buildupArea, setBuildupArea] = useState(null);
  // const [buildupAreaDropdown, setBuildupAreaDropdown] = useState('');
  // const [builtupAreaInput, setBuiltupAreaInput] = useState(null);
  // const [dateFromParking, setDateFromParking] = useState(null);
  // const [dateFromParkingDropdown, setDateFromParkingDropdown] = useState(null);
  // const [dateToParking, setDateToParking] = useState(null);
  // const [dateToParkingDropdown, setDateToParkingDropdown] = useState(null);

  // // #################### Basement #############
  // const [usageTypeBasement, setUsageTypeBasement] = useState(null);
  // const [usageTypeInputBasement, setUsageTypeInputBasement] = useState('');
  // const [occupancyTypeBasement, setOccupancyTypeBasement] = useState(null);
  // const [occupancyTypeInputBasement, setOccupancyTypeInputBasement] =
  //   useState('');
  // const [constructionTypeBasement, setConstructionTypeBasement] =
  //   useState(null);
  // const [constructionTypeInputBasement, setConstructionTypeInputBasement] =
  //   useState('');
  // const [buildupAreaBasement, setBuildupAreaBasement] = useState(null);
  // const [buildupAreaDropdownBasement, setBuildupAreaDropdownBasement] =
  //   useState('');
  // const [builtupAreaInputBasement, setBuiltupAreaInputBasement] =
  //   useState(null);
  // const [dateFromBasement, setDateFromBasement] = useState(null);
  // const [dateFromBasementDropdown, setDateFromBasementDropdown] =
  //   useState(null);
  // const [dateToBasement, setDateToBasement] = useState(null);
  // const [dateToBasementDropdown, setDateToBasementDropdown] = useState(null);
// const validatePreviewData = () => {
  //   const errors = [];

  //   if (!wardVerification && !wardDropdown) {
  //     errors.push('Please verify/select Ward No');
  //   }

  //   if (!newWardVerification && !newWardDropdown) {
  //     errors.push('Please verify/select New Ward No');
  //   }

  //   if (!zoneVerification && !zoneDropdown) {
  //     errors.push('Please verify/select Zone');
  //   }

  //   if (!propertyVerification && !propertyDropdown) {
  //     errors.push('Please verify/select Property Type');
  //   }

  //   const selectedPropertyLabel =
  //     propertyDropdownOptions?.find(
  //       opt => String(opt.value) === String(propertyDropdown),
  //     )?.label || '';

  //   const shouldShowSections =
  //     data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
  //     (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
  //       selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
  //       selectedPropertyLabel !== '');

  //   if (
  //     shouldShowSections &&
  //     selectedPropertyLabel.toUpperCase() !== 'VACANT LAND'
  //   ) {
  //     floorIds.forEach((floor, index) => {
  //       if (!floor.usageType) {
  //         errors.push(`Please select Usage Type (${floor.floorName})`);
  //       }
  //       if (!floor.occupancyType) {
  //         errors.push(`Please select Occupancy Type (${floor.floorName})`);
  //       }
  //       if (!floor.constructionType) {
  //         errors.push(`Please select Construction Type (${floor.floorName})`);
  //       }
  //       if (!floor.builtupArea) {
  //         errors.push(`Please enter Built-up Area (${floor.floorName})`);
  //       }
  //       if (!floor.fromDate) {
  //         errors.push(`Please select Date From (${floor.floorName})`);
  //       }
  //       if (!floor.toDate) {
  //         errors.push(`Please select Date To (${floor.floorName})`);
  //       }
  //     });
  //   }
  //   // Return only first error (or null if no errors)
  //   return errors.length > 0 ? errors[0] : null;
  // };
