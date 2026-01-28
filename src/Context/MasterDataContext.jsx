import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [masterData, setMasterData] = useState({
    wardList: [],
    typeOfConnectionList: [],
    connectionThroughList: [],
    propertyType: [],
    ownershipType: [],
    propertyTypeList: [],
    ownerTypeList: [],
  });
  console.log('mater data', masterData);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        if (!token) {
          console.warn('❗ No token found in AsyncStorage');
          setLoading(false);
          return;
        }

        const res = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          {}, // ✅ empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );

        console.log(
          '📦 Full Master Data:',
          JSON.stringify(res.data.data, null, 2),
        );

        if (res.data?.status && res.data.data) {
          const {
            wardList,
            typeOfConnectionList,
            connectionThroughList,
            propertyType,
            ownershipType,
            propertyTypeList,
            ownerTypeList,
          } = res.data.data;

          setMasterData({
            wardList: Array.isArray(wardList) ? wardList : [],
            typeOfConnectionList: Array.isArray(typeOfConnectionList)
              ? typeOfConnectionList
              : [],
            connectionThroughList: Array.isArray(connectionThroughList)
              ? connectionThroughList
              : [],
            propertyType: Array.isArray(propertyType) ? propertyType : [],
            ownershipType: Array.isArray(ownershipType) ? ownershipType : [],
            propertyTypeList: Array.isArray(propertyTypeList)
              ? propertyTypeList
              : [],
            ownerTypeList: Array.isArray(ownerTypeList) ? ownerTypeList : [],
          });

          console.log('✅ Master data loaded successfully');
        }
      } catch (error) {
        console.error(
          '🚨 Error fetching master data:',
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaster();
  }, []);

  return (
    <MasterDataContext.Provider value={{ ...masterData, loading }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => useContext(MasterDataContext);
