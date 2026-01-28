import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import Pagination from '../../../Components/Pagination';
import styles from '../../../style/SearchStyles';

const SearchAssessment = ({ navigation }) => {
  const [value, setValue] = useState(); // ward id
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🟢 Fetch Master Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

        const response = await axios.post(
          `${BASE_URL}/api/property/get-saf-master-data`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setMasterData(response.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, []);

  // 🟢 Ward Dropdown Options
  const wardDropdownOptions = [
    { label: 'Select Ward', value: null }, // 👈 default null option
    ...(masterData?.wardList || []).map(item => ({
      label: item.wardNo,
      value: item.id,
    })),
  ];

  // 🟢 Search with Pagination
  const onSearch = async (pageNo = 1) => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;

      const body = {
        perPage: 5,
        page: pageNo,
        keyWord: keyword?.trim() || '',
        wardId: value ? [value] : [],
      };

      const response = await axios.post(
        `${BASE_URL}/api/property/search-saf`,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.status) {
        const results = response.data.data?.data || [];
        setSearchResults(results);
        setPage(pageNo);
        setLastPage(response.data.data?.lastPage || 1);
        setTotal(response.data.data?.total || results.length);
      } else {
        setSearchResults([]);
        Alert.alert('No Records', response.data?.message || 'No data found.');
      }
    } catch (error) {
      console.error('Search API error:', error);
      Alert.alert('Error', 'Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPress = item => {
    navigation.navigate('SafDueDetails', { id: item.id });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.row}>
        <Text style={styles.label}>SL No:</Text>
        <Text style={styles.value}>{index + 1}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Apply Date:</Text>
        <Text style={styles.value}>{item.applyDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{item.appStatus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ward No:</Text>
        <Text style={styles.value}>{item.wardNo}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.label}>New Ward No:</Text>
        <Text style={styles.value}>{item.newWardNo}</Text>
      </View> */}
      <View style={styles.row}>
        <Text style={styles.label}>Application No:</Text>
        <Text style={styles.value}>{item.safNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Assessment Type:</Text>
        <Text style={styles.value}>{item.assessmentType}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{item.ownerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Guardian Name:</Text>
        <Text style={styles.value}>{item.guardianName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Property Type:</Text>
        <Text style={styles.value}>{item.propertyType}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={[styles.value, { flex: 1 }]} numberOfLines={2}>
          {item.propAddress}
        </Text>
      </View>
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{item.mobileNo}</Text>
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
    <View style={styles.container}>
      <HeaderNavigation />

      {/* 🔹 Search Form */}
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
            placeholder="Select Ward"
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

        <TouchableOpacity style={styles.button} onPress={() => onSearch(1)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Result List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{
            marginTop: responsiveHeight(2),
            paddingBottom: responsiveHeight(5),
          }}
          ListFooterComponent={
            searchResults.length > 0 ? (
              <Pagination
                page={page}
                lastPage={lastPage}
                total={total}
                onNext={() => page < lastPage && onSearch(page + 1)}
                onPrev={() => page > 1 && onSearch(page - 1)}
                onPageChange={pageNo => onSearch(pageNo)}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default SearchAssessment;
