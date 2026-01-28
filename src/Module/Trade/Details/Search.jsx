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
  ActivityIndicator,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Pagination from '../../../Components/Pagination';
import Colors from '../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_ROUTES } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import styles from '../../../style/SearchStyles';

const Search = ({ navigation }) => {
  const [value, setValue] = useState(null); // wardId
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState(null);
  const [wardDropdownOptions, setWardDropdownOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    fetchMaster();
  }, []);

  const fetchMaster = async () => {
    try {
      setLoadingMaster(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Auth error', 'No token found. Please login.');
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
      }
    } catch (error) {
      console.error('Fetch master data error:', error);
      Alert.alert('Error', 'Failed to fetch master data.');
    } finally {
      setLoadingMaster(false);
    }
  };

  const search = async (pageNumber = 1) => {
    try {
      setLoadingSearch(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Auth error', 'No token found. Please login.');
        return;
      }

      const body = {
        perPage: 5,
        page: pageNumber,
        keyWord: keyword?.trim() || '',
        wardId: value ? [value] : [],
      };

      const response = await axios.post(API_ROUTES.TRADE_SEARCH, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status) {
        const results = response.data.data?.data ?? [];
        setSearchResults(results);
        setPage(pageNumber);
        setLastPage(response.data.data?.lastPage || 1);
        setTotal(response.data.data?.total || 0);
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
    navigation.navigate('TradeDetails', { id: item.id });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.row}>
        <Text style={styles.label}>SL No:</Text>
        <Text style={styles.value}>{index + 1 + (page - 1) * 5}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ward No:</Text>
        <Text style={styles.value}>{item.wardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Application No:</Text>
        <Text style={styles.value}>{item.applicationNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Firm Name:</Text>
        <Text style={[styles.value, { flex: 1 }]} numberOfLines={1}>
          {item.firmName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Owner Name:</Text>
        <Text style={[styles.value, { flex: 1 }]} numberOfLines={1}>
          {item.ownerName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text
          style={[styles.value, { flex: 1, textAlign: 'right' }]}
          numberOfLines={2}
        >
          {item.address}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Apply Date:</Text>
        <Text style={styles.value}>{item.applyDate}</Text>
      </View>
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Text style={styles.label}>App Status:</Text>
        <Text style={styles.value}>{item.appStatus}</Text>
      </View>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewPress(item)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />

      {/* ✅ Search UI moved OUTSIDE FlatList */}
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

        <TouchableOpacity style={styles.button} onPress={() => search(1)}>
          <Text style={styles.buttonText}>
            {loadingSearch ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Now FlatList no longer re-renders input */}
      <View style={styles.container}>
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          ListEmptyComponent={
            !loadingSearch && (
              <Text style={{ textAlign: 'center', marginTop: 10 }}>
                No results found.
              </Text>
            )
          }
          ListFooterComponent={
            <>
              {loadingSearch && (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ marginVertical: 10 }}
                />
              )}
              {searchResults.length > 0 && !loadingSearch && (
                <Pagination
                  page={page}
                  lastPage={lastPage}
                  total={total}
                  onNext={() => search(page + 1)}
                  onPrev={() => search(page - 1)}
                  onPageChange={pageNo => search(pageNo)}
                />
              )}
            </>
          }
          contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}
        />
      </View>
    </View>
  );
};

export default Search;

// ---------------- STYLES ----------------
