import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { BASE_URL } from '../../../config';
import Colors from '../../Constants/Colors';
import { showToast } from '../../../utils/toast';
import Pagination from '../../../Components/Pagination';

const FieldVarification = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async pageNo => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const token = storedToken ? JSON.parse(storedToken) : null;
      setToken(token);

      if (!token) return console.warn('No token found');

      const response = await axios.post(
        `${BASE_URL}/api/property/inbox?page=${pageNo}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const res = response.data?.data || {};

      setData(res.data || []);
      setLastPage(res.lastPage || 1);
      setTotal(res.total || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = safNo => {
    if (!safNo) {
      showToast('error', 'No SAF number to copy');
      return;
    }
    Clipboard.setString(String(safNo));
    showToast('success', `${safNo} copied to clipboard`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Ward No.:</Text>
        <Text style={styles.value}>{item?.wardNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Assessment Type:</Text>
        <Text style={styles.value}>{item?.assessmentType}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Property Type:</Text>
        <Text style={styles.value}>{item?.propertyType}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Applicant Name:</Text>
        <Text style={styles.value}>{item?.ownerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Mobile No.:</Text>
        <Text style={styles.value}>{item?.mobileNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>SAF No.:</Text>
        <TouchableOpacity
          onPress={() => copyToClipboard(item?.safNo)}
          style={styles.iconBtn}
        >
          <Text style={{ fontSize: 10, color: '#007bff' }}>📋</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{item?.safNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Property Address:</Text>
        <Text style={styles.value}>{item?.propAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Apply Date:</Text>
        <Text style={styles.value}>{item?.applyDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cardLabel}>Forward Date:</Text>
        <Text style={styles.value}>{item?.receivingDate}</Text>
      </View>

      <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate('SurveyPage', { id: item.id })}
      >
        <Text style={styles.surveyButtonText}>Survey</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.navigate('SafDueDetails', { id: item.id })}
      >
        <Text style={styles.surveyButtonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderNavigation />
      <View style={styles.applicationList}>
        <Text style={styles.title}>Application List</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 30 }}
          />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.noData}>No data found.</Text>
            }
          />
        )}

        {/* ✅ Pagination Added */}
        {total > 0 && (
          <Pagination
            page={page}
            lastPage={lastPage}
            total={total}
            onNext={() => setPage(prev => prev + 1)}
            onPrev={() => setPage(prev => prev - 1)}
            onPageChange={(pageNo) => setPage(pageNo)}
          />
        )}
      </View>
    </View>
  );
};

export default FieldVarification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },

  formWrapper: {
    padding: responsiveWidth(2),
    marginHorizontal: responsiveHeight(2),
    marginTop: responsiveHeight(2),
    borderRadius: 4,
    backgroundColor: 'orange',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  title: {
    fontSize: responsiveHeight(2),
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
    margin: 20,
  },

  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputBox: { width: '48%', marginBottom: 16 },
  label: { fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: { color: '#999' },
  selectedTextStyle: { color: '#000' },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  applicationList: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardLabel: { fontWeight: '600', color: '#333', fontSize: 10 },
  value: {
    color: '#555',
    width: 130, // example width in dp
    fontSize: 10, // example font size in dp
  },
  button1: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  button2: {
    marginTop: 16,
    backgroundColor: '#0a80a4ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  surveyButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  iconBtn: {
    marginLeft: 110,
  },
});
