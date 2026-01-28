import axios from 'axios';
import { PROPERTY_API, SAF_API_ROUTES } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';

export const submitFieldVerification = async (submissionData, floorIds, id, data) => {
  const token = await getToken();
console.log("Api Submisison data", submissionData?.extraFloors
)
  const convertMonthYear = str => {
    if (!str) return null;
    const months = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };
    const [monthName, year] = str.split(' ');
    const month = months[monthName.toLowerCase()];
    return month && year ? `${year}-${month}` : null;
  };

  const formatDateForAPI = date => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

 const finalFloors = [
  ...(submissionData?.extraFloors?.map(floor => ({
    safFloorDetailId: floor.safFloorDetailId || 0,
    builtupArea: Number(floor.builtupArea ?? 0),
    dateFrom: floor.dateFrom,
    dateUpto: floor.dateUpto,
    floorMasterId: floor.floorMasterId ? String(floor.floorMasterId) : null,
    usageTypeMasterId: floor.usageTypeMasterId ? String(floor.usageTypeMasterId) : null,
    constructionTypeMasterId: floor.constructionTypeMasterId ? String(floor.constructionTypeMasterId) : null,
    occupancyTypeMasterId: floor.occupancyTypeMasterId ? String(floor.occupancyTypeMasterId) : null,
  })) || []),

  ...(id?.map(floor => ({
    safFloorDetailId: floor.safFloorDetailId || 0,
    builtupArea: Number(floor.builtupArea ?? 0),
    carpetArea: Number(floor.carpetArea ?? 0),
    dateFrom: floor.dateFrom,
    dateUpto: floor.dateUpto,
    floorMasterId: floor.floorMasterId ? String(floor.floorMasterId) : null,
    usageTypeMasterId: floor.usageTypeMasterId ? String(floor.usageTypeMasterId) : null,
    constructionTypeMasterId: floor.constructionTypeMasterId ? String(floor.constructionTypeMasterId) : null,
    occupancyTypeMasterId: floor.occupancyTypeMasterId ? String(floor.occupancyTypeMasterId) : null,
    floorName: floor.floorName || null,
    usageType: floor.usageType || null,
    occupancyName: floor.occupancyName || null,
    constructionType: floor.constructionType || null,
  })) || []),
];


  const fieldPayload = {
    //  percentageOfPropertyTransfer:
    //       submissionData?.percentageOfPropertyTransfer,
          percentageOfPropertyTransfer:
  Number(submissionData?.percentageOfPropertyTransfer || 0),

     roadTypeMstrId:submissionData?.roadTypeMstrId,

      builtupArea:submissionData?.Verified_BuiltupArea,

    flatRegistryDate: submissionData?.selectedDate,
    appartmentDetailsId: submissionData?.apartmentDetail,
    isMobileTower: submissionData?.mobileTower === 'yes',
  towerArea:
    submissionData?.mobileTower === 'yes'
      ? parseFloat(submissionData?.towerArea) || 0
      : null,
  towerInstallationDate:
    submissionData?.mobileTower === 'yes' && submissionData?.installationDate
      ? moment(submissionData.installationDate).format('YYYY-MM-DD')
      : null,

  isHoardingBoard: submissionData?.hoarding === 'yes',
  hoardingArea:
    submissionData?.hoarding === 'yes'
      ? parseFloat(submissionData?.hoardingArea) || 0
      : null,
  hoardingInstallationDate:
    submissionData?.hoarding === 'yes' && submissionData?.hoardingInstallationDate
      ? moment(submissionData.hoardingInstallationDate).format('YYYY-MM-DD')
      : null,
  isPetrolPump: submissionData?.petrolPump === 'yes',
  pumpArea:
    submissionData?.petrolPump === 'yes'
      ? parseFloat(submissionData?.pumpArea) || 0
      : null,
  petrolPumpCompletionDate:
    submissionData?.petrolPump === 'yes' && submissionData?.pumpInstallationDate
      ? moment(submissionData.pumpInstallationDate).format('YYYY-MM-DD')
      : null,
  underGroundArea:
    submissionData?.petrolPump === 'yes'
      ? parseFloat(submissionData?.underGroundArea) || 0.1
      : null,

  isWaterHarvesting: submissionData?.rainHarvesting === 'yes',
  waterHarvestingDate:
    submissionData?.rainHarvesting === 'yes' && submissionData?.completionDate
      ? moment(submissionData.completionDate).format('YYYY-MM-DD')
      : null,

  // Required numeric fields
  // roadWidth: parseFloat(submissionData?.roadWidth) || '',
  areaOfPlot: parseFloat(submissionData?.areaOfPlot) || 0,
    safDetailId: submissionData?.safDetailId,
    wardMstrId: submissionData?.wardMstrId,
    newWardMstrId: submissionData?.newWardMstrId,
    propTypeMstrId:
      submissionData?.propTypeMstrId || submissionData?.propertyTypeId,
    zoneMstrId: submissionData?.zoneMstrId,
    // roadWidth: submissionData?.roadWidth,
    areaOfPlot: submissionData?.areaOfPlot,
    landOccupationDate:
      submissionData?.['Property Type (Current)'] === 'VACANT LAND' ||
      submissionData?.Verified_PropertyType === 'VACANT LAND'
        ? data?.landOccupationDate || new Date().toISOString().split('T')[0]
        : null,
   ...(submissionData?.propTypeMstrId != '4' && { floorDtl: finalFloors }),
  };
  console.log('Field Payload:', JSON.stringify(fieldPayload, null, 2));
  const response = await axios.post(
    PROPERTY_API.FIELD_VARIFICATION_API,
    fieldPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    },
  );
//  console.log("API Status:", response?.data?.status, "dkfiudgifadsf");
console.log("Full Response:", JSON.stringify(response?.data, null, 2));
console.log("API Message:", response?.data?.message);
  return response;
};

export const submitGeotaggedImages = async (photos, location, id) => {
  const token = await getToken();

  const resizedPhotos = await Promise.all(
    photos.map(async (photo) => {
      if (!photo?.uri) return null;
      const resized = await ImageResizer.createResizedImage(
        photo.uri,
        1024,
        1024,
        'JPEG',
        80,
      );
      return {
        ...photo,
        uri: resized.uri,
        fileName: photo.fileName || `${photo.label.replace(' ', '_')}.jpg`,
      };
    }),
  );

  const formData = new FormData();
  formData.append('id', id);

  const geoTagArray = resizedPhotos.map((photo) => ({
    latitude: location.latitude,
    longitude: location.longitude,
    direction: photo.label,
    label: photo.label,
    document: photo,
  }));

  while (geoTagArray.length < 3) {
    geoTagArray.push({
      latitude: location.latitude,
      longitude: location.longitude,
      direction: 'N',
      label: `extra-${geoTagArray.length + 1}`,
      document: resizedPhotos[0] || null,
    });
  }

  geoTagArray.forEach((item, index) => {
    if (!item.document) return;
    formData.append(`geoTag[${index}][latitude]`, item.latitude);
    formData.append(`geoTag[${index}][longitude]`, item.longitude);
    formData.append(`geoTag[${index}][direction]`, item.direction);
    formData.append(`geoTag[${index}][label]`, item.label);
    formData.append(`geoTag[${index}][document]`, {
      uri: item.document.uri,
      type: item.document.type || 'image/jpeg',
      name: item.document.fileName,
    });
  });

  resizedPhotos.forEach(photo => {
    if (!photo) return;
    formData.append('images', {
      uri: photo.uri,
      type: photo.type || 'image/jpeg',
      name: photo.fileName,
    });
  });

  const response = await axios.post(
    PROPERTY_API.GEOTAGING_IMAGE_API,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      timeout: 20000,
    },
  );

  return response;
};

export const sendToLevel = async (id, remarks, status) => {
  const token = await getToken();
  const payload = {
    id: id,
    remarks: remarks,
    status: status, // 'FORWARD' or 'BACKWARD'
  };

  const response = await axios.post(SAF_API_ROUTES.SEND_TO_LEVEL_API, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};