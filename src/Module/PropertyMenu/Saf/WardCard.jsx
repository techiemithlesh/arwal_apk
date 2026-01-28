import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const WardCard = ({
  title = 'Ward No',
  selfAssessed = 0,
  selectedOption,
  setSelectedOption,
  verification,
  setVerification,
  dropdownData = [],
  radioOptions = ['Correct', 'Incorrect'],
  showSelfAssessed = true,
  showRadioGroup = true,
  showDropdown = true,
  labels = {
    selfAssessed: 'Self-Assessed',
    check: 'Check',
    verification: 'Verification',
  },
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {showSelfAssessed && (
        <View style={styles.row}>
          <Text style={styles.label}>{labels.selfAssessed}:</Text>
          <Text style={styles.value}>{selfAssessed}</Text>
        </View>
      )}

      {showRadioGroup && (
        <View style={styles.radioGroup}>
          <Text style={styles.label}>{labels.check}</Text>
          {radioOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioItem}
              onPress={() => setSelectedOption(option)}
            >
              <View style={styles.circle}>
                {selectedOption === option && (
                  <View style={styles.selectedCircle} />
                )}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showDropdown && (
        <>
          <Text style={styles.label}>{labels.verification}</Text>
          <Dropdown
            style={styles.dropdown}
            data={dropdownData}
            labelField="label"
            valueField="value"
            value={verification}
            onChange={item => setVerification(item.value)}
            placeholder="Select Verification"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  radioLabel: {
    fontSize: 15,
  },
  dropdown: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    marginTop: 4,
  },
});

export default WardCard;
const FieldSection = ({ title, children }) => (
  <View style={styles.fieldSection}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);
