import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';

const VerificationCard = ({
  label,
  value,
  dropdownOptions = [],
  selectedVerification,
  setSelectedVerification,
  dropdownValue,
  setDropdownValue = () => {},
  showInputOnIncorrect = false,
  inputValue = '',
  setInputValue = () => {},
  inputLabel = 'Enter New Value:',
  inputPlaceholder = 'Enter new value',
  showCalendarOnIncorrect = false,
  calendarValue = new Date(),
  setCalendarValue = () => {},
  hideCorrectOption = false,
  editable = true,
  showError = false, // Trigger error from parent
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const options = hideCorrectOption ? ['Incorrect'] : ['Correct', 'Incorrect'];

  const handleVerificationChange = status => {
    setSelectedVerification(status);
    setInternalError(false); // Clear internal error
    if (status === 'Correct') {
      setDropdownValue('');
      setInputValue('');
      setCalendarValue(new Date());
    }
  };

  const handleChangeDate = (event, newDate) => {
    if (Platform.OS === 'ios') {
      setCalendarValue(newDate);
    } else {
      if (event === 'dateSetAction' && newDate) {
        setCalendarValue(newDate);
      }
      setShowPicker(false);
    }
  };

  // Determine if we should show error
  const isSelectionRequired = !selectedVerification;
  const showErrorMessage = (internalError || showError) && isSelectionRequired;

  return (
    <View style={styles.card}>
      {/* Label */}
      <View style={styles.rowlabel}>
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Self Assessed */}
      <View style={styles.row}>
        <Text style={styles.value}>Self Assessed</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
      </View>

      {/* Correct / Incorrect radio */}
      <View
        style={[styles.radioGroup, showErrorMessage && styles.radioGroupError]}
      >
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => handleVerificationChange(option)}
            disabled={!editable}
          >
            <View
              style={[
                styles.circle,
                selectedVerification === option && styles.filledCircle,
              ]}
            />
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Show error message */}
      {showErrorMessage && (
        <Text style={styles.errorText}>Please select Correct or Incorrect</Text>
      )}

      <View style={styles.divider} />

      {/* Correct: show value */}
      {selectedVerification === 'Correct' && (
        <View style={styles.staticValueContainer}>
          <Text style={styles.staticValue}>{value}</Text>
        </View>
      )}

      {/* Incorrect + Calendar */}
      {selectedVerification === 'Incorrect' && showCalendarOnIncorrect && (
        <View style={styles.inputContainer}>
          <Text style={styles.staticValueLabel}>Select Date:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: calendarValue ? '#333' : '#aaa' }}>
              {calendarValue
                ? moment(calendarValue).format('YYYY-MM')
                : 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <MonthPicker
              onChange={handleChangeDate}
              value={calendarValue || new Date()}
              minimumDate={new Date(2000, 0)}
              maximumDate={new Date(2030, 11)}
              locale="en"
            />
          )}
        </View>
      )}

      {/* Incorrect + Text Input */}
      {selectedVerification === 'Incorrect' &&
        showInputOnIncorrect &&
        !showCalendarOnIncorrect && (
          <View style={styles.inputContainer}>
            <Text style={styles.staticValueLabel}>{inputLabel}</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={inputPlaceholder}
              editable={editable}
            />
          </View>
        )}

      {/* Incorrect + Dropdown */}
      {selectedVerification === 'Incorrect' &&
        !showInputOnIncorrect &&
        !showCalendarOnIncorrect && (
          <Dropdown
            style={styles.dropdown}
            data={dropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={dropdownValue}
            onChange={item => setDropdownValue(item.value)}
            disable={!editable}
          />
        )}
    </View>
  );
};

export default VerificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(3),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: 'white',
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: 10,
  },
  radioGroupError: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: responsiveWidth(2),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircle: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: responsiveWidth(2),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  staticValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
  },
  staticValueLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    fontWeight: '500',
  },
  staticValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#007BFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    paddingHorizontal: responsiveWidth(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(1.6),
    marginHorizontal: responsiveWidth(4),
    marginBottom: 5,
  },
});
