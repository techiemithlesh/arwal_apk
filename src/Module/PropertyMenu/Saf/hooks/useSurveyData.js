import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../config';

export const useSurveyData = (id) => {
  const [data, setData] = useState(null);
  const [masterData, setMasterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [floorIds, setFloorIds] = useState([]);
  const [apartmentDetail, setApartmentDetail] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-field-verification`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response1 = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMasterData(response1.data.data);
        setData(response.data.data);
        console.log("Detaulsadsfsfds",response.data.data)

        const floors = response.data.data.floor || [];
        setFloorIds(floors);

        setApartmentDetail(response.data.data.appartmentDetailsId);

        if (response.data.data.flatRegistryDate) {
          const parsedDate = new Date(response.data.data.flatRegistryDate);
          const normalized = new Date(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
          );
          setSelectedDate(normalized);
        } else {
          setSelectedDate(new Date());
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    data,
    masterData,
    isLoading,
    floorIds,
    apartmentDetail,
    setApartmentDetail,
    selectedDate,
    setSelectedDate,
  };
};
