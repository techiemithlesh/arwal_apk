import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { HOLDIGN_API_ROUTES } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import Pagination from '../../../Components/Pagination'; // ✅ Pagination imported
import styles from '../../../style/SearchStyles';

const Search = ({ navigation }) => {
  const [value, setValue] = useState(); // Ward ID
  const [keyword, setKeyword] = useState('');
  const [masterData, setMasterData] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🔹 Fetch Master Data (Ward List)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await axios.post(
          HOLDIGN_API_ROUTES.MASTER_DATA_API,
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

  // 🔹 Dropdown Options
  const wardDropdownOptions = (masterData?.wardList || []).map(item => ({
    label: item.wardNo,
    value: item.id,
  }));

  // 🔹 Search API Call with Pagination
  const search = async (pageNo = 1) => {
    try {
      setLoadingSearch(true);
      const token = await getToken();

      const body = {
        perPage: 10,
        page: pageNo,
        keyWord: keyword?.trim() || '',
        wardId: value ? [value] : [],
      };

      const response = await axios.post(HOLDIGN_API_ROUTES.SEARCH_API, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status) {
        const results = response.data.data?.data ?? [];
        setSearchResults(results);
        setPage(pageNo);
        setLastPage(response.data.data?.lastPage || 1);
        setTotal(response.data.data?.total || 0);
      } else {
        setSearchResults([]);
        Alert.alert(
          'No Results',
          response.data?.message || 'No records found.',
        );
      }
    } catch (error) {
      console.error('Search API error:', error);
      Alert.alert('Error', 'Something went wrong while searching.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // 🔹 Navigate to Details
  const handleViewPress = item => {
    navigation.navigate('HoldingDetails', { id: item.id });
  };

  // 🔹 Search Header Section
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
          placeholder="Select Ward"
          value={value}
          onChange={item => setValue(item.value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Search Keyword"
          placeholderTextColor="black"
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => search(1)}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );

  // 🔹 Render Each Result Card
  const renderItem = ({ item, index }) => (
    <View style={styles.resultCard}>
      <View style={styles.row}>
        <Text style={styles.label}>SL No:</Text>
        <Text style={styles.value}>{index + 1}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ward No:</Text>
        <Text style={styles.value}>{item.wardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>New Ward No:</Text>
        <Text style={styles.value}>{item.newWardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Holding No:</Text>
        <Text style={styles.value}>{item.holdingNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>New Holding No:</Text>
        <Text style={styles.value}>{item.newHoldingNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{item.ownerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{item.mobileNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={[styles.value, { flex: 1 }]} numberOfLines={2}>
          {item.propAddress}
        </Text>
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

      {/* ✅ Search Header OUTSIDE FlatList */}
      {renderHeader()}

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
