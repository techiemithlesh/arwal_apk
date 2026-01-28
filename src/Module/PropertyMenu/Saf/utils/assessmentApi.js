/**
 * API functions for ApplyAssessment
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../config';
import { PROPERTY_API } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import { subCategory, swmRate } from '../../../../api/apiRoutes';
import { Platform } from 'react-native';

/**
 * Fetch master data for SAF assessment
 */
export const fetchMasterData = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(
      `${BASE_URL}/api/property/get-saf-master-data`,
      {},
      { headers },
    );
    if (response?.data?.status) {
      const masterData = response.data.data;
      console.log('Master data:', masterData);
      return { success: true, data: masterData };
    } else {
      console.warn('Failed to fetch master data:', response?.data?.message);
      return { success: false, message: response?.data?.message };
    }
  } catch (error) {
    console.error('Error fetching master data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch new ward by old ward ID
 */
export const fetchNewWardByOldWard = async wardId => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(
      `${BASE_URL}/api/property/get-new-ward-by-old`,
      { oldWardId: wardId },
      { headers },
    );
    console.log('New ward response:', response?.data);
    if (response?.data?.status) {
      const newOptions = response.data.data.map(item => ({
        label: item.wardNo,
        value: item.id,
      }));
      return { success: true, data: newOptions };
    } else {
      console.warn('Failed to fetch new wards:', response?.data?.message);
      return { success: false, data: [], message: response?.data?.message };
    }
  } catch (error) {
    console.error('Error fetching new ward:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Fetch apartments list
 */
export const fetchApartments = async oldWardId => {
  try {
    const token = await getToken();
    const body = oldWardId ? { oldWardId } : {};

    const response = await axios.post(PROPERTY_API.APARTMENT_API, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Response Apartment:', response);
    if (response.data?.status) {
      const formatted = response.data.data.map(item => ({
        label: `${item.apartmentName} (${item.aptCode})`,
        value: item.id,
      }));
      return { success: true, data: formatted };
    } else {
      return { success: false, data: [], message: response.data?.message };
    }
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Submit assessment data
 */
// export const submitAssessment = async payload => {
//   try {
//     const token = await getToken();
//     const response = await axios.post(
//       PROPERTY_API.TEST_REQUEST_API,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log('API Response:', response.data);
//     return {
//       success: response.data.status && response.data.message === 'Valid Request',
//       data: response.data,
//       message: response.data.message,
//     };
//   } catch (error) {
//     console.error('API Test Error:', error.response?.data || error.message);
//     return {
//       success: false,
//       error: error.response?.data || error.message,
//       message: 'API Test Failed ❌',
//     };
//   }
// };

// Inside assessmentApi.js
export const submitAssessment = async (payload,ContentType=false) => {
  
  const token = await getToken();
  
  console.log("Payload in APIiiii:", payload);
  try{
    const response = await axios.post(PROPERTY_API.TEST_REQUEST_API, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(ContentType?{'Content-Type': 'multipart/form-data'}:{}),
      },
    });
    console.log("API Response:", response);
    return response.data;
  }catch(error){
    console.log("Error in APIiiii:", error);
  }
  
};
export const fetchSwmSubCategory = async payload => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;

    const response = await axios.post(
      subCategory,
      payload, // example: { categoryId: 1 }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response?.data?.status) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data?.message };
    }
  } catch (error) {
    console.error('SWM SubCategory Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch SWM Rate
 */
export const fetchSwmRate = async payload => {
  console.log("payload",payload);
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken) : null;

    const response = await axios.post(
      swmRate,
      payload, // example: { subCategoryId: 2 }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
console.log("paylad",response?.data);
    if (response?.data?.status) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data?.message };
    }
  } catch (error) {
    console.error('SWM Rate Error:', error);
    return { success: false, error: error.message };
  }
};