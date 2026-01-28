import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderLogin from '../../Screen/HeaderLogin';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';
import HeaderNavigation from '../../../Components/HeaderNavigation';

const TradeInbox = ({ navigation }) => {
  const data1 = [
    { label: 'Select Ward', value: '1' },
    { label: 'Ward 2', value: '2' },
    { label: 'Ward 3', value: '3' },
  ];

  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeInput, setActiveInput] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        console.log(token, 'our token');

        if (!token) {
          console.warn('No token found');
          return;
        }
        const response = await axios.post(
          `${BASE_URL}api/trade/inbox`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log('Fetched Data:', response.data?.data?.data);
        setData(response.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(data, 'data');

  const handleSearch = () => {
    // Add your search filter logic here
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Application No.:</Text>
          <Text style={styles.value}>{item?.applicationNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Application Type:</Text>
          <Text style={styles.value}>{item?.applicationType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Owner Name:</Text>
          <Text style={styles.value}>{item?.ownerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Guardian Name:</Text>
          <Text style={styles.value}>{item?.guardianName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Mobile No.:</Text>
          <Text style={styles.value}>{item?.mobileNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Firm Type:</Text>
          <Text style={styles.value}>{item?.firmType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Address:</Text>
          <Text style={styles.value}>{item?.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Ward No.:</Text>
          <Text style={styles.value}>{item?.wardNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Apply Date:</Text>
          <Text style={styles.value}>{item?.applyDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Receiving Date:</Text>
          <Text style={styles.value}>{item?.receivingDate}</Text>
        </View>

        {/* Optional role info */}
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Current Role ID:</Text>
          <Text style={styles.value}>{item?.currentRoleId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Initiator Role ID:</Text>
          <Text style={styles.value}>{item?.initiatorRoleId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Finisher Role ID:</Text>
          <Text style={styles.value}>{item?.finisherRoleId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Max Level Attempt:</Text>
          <Text style={styles.value}>{item?.maxLevelAttempt}</Text>
        </View>

        <TouchableOpacity
          style={styles.button1}
          onPress={() => navigation.navigate('SurveyPage', { id: item.id })}
        >
          <Text style={styles.surveyButtonText}>Survey</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <HeaderNavigation />

        <View>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Field Verification</Text>
            <View style={styles.formGrid}>
              <View style={styles.inputBox}></View>
            </View>

            {/* <View style={styles.formGrid}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Ward No</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={data1}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Ward"
                  placeholderTextColor="black"
                  value={value}
                  onChange={item => setValue(item.value)}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Keyword</Text>
                <TextInput style={styles.input} placeholder="Enter Keyword" />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View> */}
          </ScrollView>

          <View style={styles.applicationList}>
            <Text style={styles.title}>Application List</Text>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: responsiveHeight(2),
                    backgroundColor: 'red',
                    color: 'white',
                    padding: 10,
                  }}
                >
                  No data found.
                </Text>
              }
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.modalContent}>
        {/* <DatePicker
          modal
          open={isDatePickerOpen}
          date={selectedDate}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setIsDatePickerOpen(false)}
        /> */}
      </View>
    </View>
  );
};

export default TradeInbox;

// Styles remain unchanged

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: responsiveWidth(2),
    backgroundColor: 'orange',
    color: 'white',
    marginTop: responsiveHeight(4),
    marginLeft: responsiveHeight(2),
    marginRight: responsiveHeight(2),
    borderRadius: 4,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Shadow for Android
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
  },

  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputBox: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#999',
  },
  selectedTextStyle: {
    color: '#000',
  },
  applicationList: {
    margin: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  button1: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  surveyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  calendarWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },

  calendarInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },

  modalContent: {
    backgroundColor: 'white',
    width: responsiveWidth(80),
    maxHeight: responsiveHeight(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
