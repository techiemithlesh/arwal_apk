import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';

const DatePickerForm = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selected = newDate || date;
      showPicker(false);
      setDate(selected);
    },
    [date, showPicker],
  );

  // Format date for display
  const formatDate = date => {
    return moment(date).format('MMYYYY');
  };

  // Handle form submission
  const handleSubmit = () => {
    Alert.alert('Selected Date', `You selected: ${formatDate(date)}`, [
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Date Selection Form</Text>

        {/* Date Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date:</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => showPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={date}
            minimumDate={new Date(2000, 0)}
            maximumDate={new Date()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DatePickerForm;
