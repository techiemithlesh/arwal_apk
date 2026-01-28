import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { formatDate1 } from '../utils/helpers';

const ApartmentDetailsSection = ({
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
  apartmentList,
  apartmentDetail,
  setApartmentDetail,
  setApartmentLabel,
  error,
}) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={[styles.label, error.ownershipType && styles.errorLabel]}>
          Flat Registry Date *
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateInput}
        >
          <Text>
            {selectedDate ? formatDate1(selectedDate) : 'Select Date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            maximumDate={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (event.type === 'set' && date) {
                setSelectedDate(
                  new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                );
              }
            }}
          />
        )}

        <Text style={[styles.label, error.ownershipType && styles.errorLabel]}>
          Appartment Datails *
        </Text>
        <Dropdown
          style={[styles.dropdown, error.propertyType && styles.errorInput]}
          data={apartmentList}
          labelField="label"
          valueField="value"
          placeholder="Select Apartment"
          value={apartmentDetail}
          onChange={item => {
            setApartmentDetail(item.value);
            setApartmentLabel(item.label);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(4),
    margin: responsiveWidth(4),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  errorLabel: {
    color: 'red',
  },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default ApartmentDetailsSection;
