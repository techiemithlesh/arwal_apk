// components/HeaderNavigation.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Module/Constants/Colors';
import Sidebar from '../Screen/Sidebar';
import { Ulb_Api } from '../api/apiRoutes';
import { getToken } from '../utils/auth';
import { getUserDetails } from '../utils/auth';
import axios from 'axios';
const HeaderNavigation = ({ title, showBack = true, customBackAction }) => {
  const navigation = useNavigation();

  const [ulbData, setUlbData] = useState('');

  useEffect(() => {
    fetchUlbDetails();
  }, []);

  const fetchUlbDetails = async () => {
    try {
      const token = await getToken();
      const user = await getUserDetails();
      const ulbId = user?.ulbId;
      console.log('user', user);

      if (!token || !ulbId) return;

      const response = await axios.post(Ulb_Api(ulbId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('user Datails', response?.data?.data);
      setUlbData(response?.data?.data);
    } catch (error) {
      console.log('❌ ULB API Error:', error?.response || error);
    }
  };

  return (
    <>
      <Sidebar navigation={navigation} />

      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {ulbData && (
          <View style={styles.ulbColumn}>
            <Text style={styles.subTitle1}>{ulbData?.hindiUlbName}</Text>
            <Text style={styles.subTitle}>{ulbData?.ulbName}</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default HeaderNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ⭐ KEY LINE

    height: 100,
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: Colors.primary,
    elevation: 4,
  },
  ulbColumn: {
    flexDirection: 'column', // default, but explicit
    alignItems: 'flex-end', // right aligned
  },

  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  subTitle: {
    fontSize: 17,
    color: '#EAEAEA',
    fontWeight: '600',
    textAlign: 'right',
  },
  subTitle1: {
    fontSize: 15,
    color: '#EAEAEA',
    textAlign: 'right',
  },
});
