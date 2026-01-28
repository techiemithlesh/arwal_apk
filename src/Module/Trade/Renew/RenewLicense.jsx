// Search.jsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_ROUTES } from '../../../api/apiRoutes';

const RenwLicense = ({ navigation }) => {
  const [value, setValue] = useState(null); // selected ward id
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState(null);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setLoadingMaster(true);
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        if (!token) {
          Alert.alert('Auth error', 'No token found. Please login.');
          setLoadingMaster(false);
          return;
        }

        const response = await axios.post(
          API_ROUTES.TRADE_MASTER_DETAILS,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.status && response.data.data) {
          const data = response.data.data;
          setMasterData(data);

          const wards = Array.isArray(data.wardList) ? data.wardList : [];
          const wardOptions = wards.map(w => ({
            label: w.wardNo?.toString() ?? 'N/A',
            value: w.id,
          }));
          setWardDropdownOptions(wardOptions);
        } else {
          setMasterData(null);
          setWardDropdownOptions([]);
        }
      } catch (error) {
        console.error('Fetch master data error:', error);
        Alert.alert('Error', 'Failed to fetch master data.');
      } finally {
        setLoadingMaster(false);
      }
    };

    fetchMaster();
  }, []);

  const search = async () => {
    try {
      setLoadingSearch(true);
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      if (!token) {
        Alert.alert('Auth error', 'No token found. Please login.');
        setLoadingSearch(false);
        return;
      }

      const body = {
        perPage: 20,
        page: 1,
        keyWord: keyword?.trim() || '',
        wardId: value ? [value] : [],
      };

      const response = await axios.post(API_ROUTES.TRADE_SEARCH, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status) {
        const results = response.data.data?.data ?? [];
        setSearchResults(results);
      } else {
        setSearchResults([]);
        Alert.alert('Search', response.data?.message || 'No results found');
      }
    } catch (error) {
      console.error('Search API error:', error);
      Alert.alert('Error', 'Failed to perform search.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleViewPress = item => {
    navigation.navigate('RenewLicensePage', { id: item.id });
    console.log(item.id, 'my id is');
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { flex: 1 }]}>
          Apply Date: <Text style={styles.value}>{item.applyDate}</Text>
        </Text>
        <Text style={[styles.label, { flex: 1, textAlign: 'right' }]}>
          Status: <Text style={styles.value}>{item.appStatus}</Text>
        </Text>
      </View>

      <Text style={styles.label}>
        🏷️ SL No: <Text style={styles.value}>{index + 1}</Text>
      </Text>
      <Text style={styles.label}>
        🏠 Ward No: <Text style={styles.value}>{item.wardNo}</Text>
      </Text>
      <Text style={styles.label}>
        🆕 New Ward No: <Text style={styles.value}>{item.newWardNo}</Text>
      </Text>
      <Text style={styles.label}>
        📄 Application No:{' '}
        <Text style={styles.value}>{item.applicationNo}</Text>
      </Text>
      <Text style={styles.label}>
        🏢 firmName Type: <Text style={styles.value}>{item.firmName}</Text>
      </Text>
      <Text style={styles.label}>
        👤 Owner: <Text style={styles.value}>{item.ownerName}</Text>
      </Text>
      <Text style={styles.label}>
        👨‍👩‍👧 Guardian Name: <Text style={styles.value}>{item.guardianName}</Text>
      </Text>
      <Text style={styles.label}>
        🏡 Property Type: <Text style={styles.value}>{item.propertyType}</Text>
      </Text>
      <Text style={styles.label}>
        📍 Address: <Text style={styles.value}>{item.propAddress}</Text>
      </Text>
      <Text style={styles.label}>
        📞 Mobile: <Text style={styles.value}>{item.mobileNo}</Text>
      </Text>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.seacrhCont}>
      <View style={styles.searchhead}>
        <Text style={styles.text}>Search Application</Text>
      </View>

      <View style={styles.selectWardKey}>
        <Dropdown
          style={styles.dropdown}
          data={wardDropdownOptions}
          labelField="label"
          valueField="value"
          placeholder={loadingMaster ? 'Loading wards...' : 'Select Ward'}
          value={value}
          onChange={item => setValue(item.value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Search Keyword"
          placeholderTextColor="black"
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={search}>
        <Text style={styles.buttonText}>
          {loadingSearch ? 'Searching...' : 'Search'}
        </Text>
      </TouchableOpacity>

      {searchResults.length === 0 && !loadingSearch && (
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
          No results to show
        </Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />
      <View style={styles.container}>
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}
        />
      </View>
    </View>
  );
};

export default RenwLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  seacrhCont: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: Colors.borderColor,
    backgroundColor: '#fff',
  },
  searchhead: {
    backgroundColor: Colors.headignColor,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    elevation: 3,
  },
  text: {
    color: Colors.background,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  dropdown: {
    height: responsiveHeight(5),
    width: responsiveWidth(40),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: responsiveWidth(2),
  },
  input: {
    width: responsiveWidth(40),
    height: responsiveHeight(5),
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectWardKey: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1.5),
  },
  button: {
    backgroundColor: Colors.borderColor,
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    marginLeft: responsiveHeight(2),
    marginRight: responsiveHeight(2),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: responsiveFontSize(1.9),
    color: '#333',
    marginBottom: responsiveHeight(0.5),
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewButton: {
    marginTop: responsiveHeight(1),
    backgroundColor: Colors.primary,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
