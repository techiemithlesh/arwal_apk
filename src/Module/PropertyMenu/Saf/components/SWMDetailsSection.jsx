import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../Constants/Colors';

const SWMDetailsSection = ({
  occupancyType,
  setOccupancyType,
  consumerName,
  setConsumerName,
  guardianName,
  setGuardianName,
  relation,
  setRelation,
  mobileNo,
  setMobileNo,
  consumerCategory,
  setConsumerCategory,
  category,
  setCategory,
  consumerRange,
  setConsumerRange,
  effectiveFrom,
  setEffectiveFrom,
  monthlyRate,
  setMonthlyRate,
  occupancyTypeOptions = [],
  relationOptions = [],
  consumerCategoryOptions = [],
  categoryOptions = [],
  consumerRangeOptions = [],
  errors = {},
  styles: customStyles,
  isCategoryEditable,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setEffectiveFrom(`${year}-${month}`);
    }
  };

  return (
    <View>
      <Text style={customStyles?.cardTitle || styles.cardTitle}>
        SWM DETAILS
      </Text>

      {/* Occupancy Type */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.occupancyType && styles.errorLabel,
        ]}
      >
        Occupancy Type *
      </Text>
      <Dropdown
        style={[
          customStyles?.dropdown || styles.dropdown,
          errors.occupancyType && styles.errorInput,
        ]}
        data={occupancyTypeOptions}
        labelField="label"
        valueField="value"
        placeholder="Select"
        value={occupancyType}
        onChange={item => setOccupancyType(item.value)}
      />
      {errors.occupancyType && (
        <Text style={styles.errorText}>{errors.occupancyType}</Text>
      )}

      {/* Consumer Name */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.consumerName && styles.errorLabel,
        ]}
      >
        Consumer Name *
      </Text>
      <TextInput
        style={[
          customStyles?.input || styles.input,
          errors.consumerName && styles.errorInput,
        ]}
        placeholder="Enter Consumer Name"
        value={consumerName}
        onChangeText={setConsumerName}
      />
      {errors.consumerName && (
        <Text style={styles.errorText}>{errors.consumerName}</Text>
      )}

      {/* Guardian Name */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.guardianName && styles.errorLabel,
        ]}
      >
        Guardian Name *
      </Text>
      <TextInput
        style={[
          customStyles?.input || styles.input,
          errors.guardianName && styles.errorInput,
        ]}
        placeholder="Enter Guardian Name"
        value={guardianName}
        onChangeText={setGuardianName}
      />
      {errors.guardianName && (
        <Text style={styles.errorText}>{errors.guardianName}</Text>
      )}

      {/* Relation */}
      <Text style={customStyles?.label || styles.label}>Relation</Text>
      <Dropdown
        style={[
          customStyles?.dropdown || styles.dropdown,
          errors.relation && styles.errorInput,
        ]}
        data={relationOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Relation"
        value={relation}
        onChange={item => setRelation(item.value)}
      />
      {errors.relation && (
        <Text style={styles.errorText}>{errors.relation}</Text>
      )}

      {/* Mobile No */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.mobileNo && styles.errorLabel,
        ]}
      >
        Mobile No *
      </Text>
      <TextInput
        style={[
          customStyles?.input || styles.input,
          errors.mobileNo && styles.errorInput,
        ]}
        placeholder="Enter Mobile No"
        keyboardType="phone-pad"
        value={mobileNo}
        onChangeText={setMobileNo}
        maxLength={10}
      />
      {errors.mobileNo && (
        <Text style={styles.errorText}>{errors.mobileNo}</Text>
      )}

      {/* Consumer Category */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.consumerCategory && styles.errorLabel,
        ]}
      >
        Consumer Category *
      </Text>
      <Dropdown
        style={[
          customStyles?.dropdown || styles.dropdown,
          errors.consumerCategory && styles.errorInput,
        ]}
        data={consumerCategoryOptions}
        labelField="label"
        valueField="value"
        placeholder="Select"
        value={consumerCategory}
        onChange={item => setConsumerCategory(item.value)}
      />
      {errors.consumerCategory && (
        <Text style={styles.errorText}>{errors.consumerCategory}</Text>
      )}

      {/* Category */}
      <Text style={customStyles?.label || styles.label}>Category *</Text>
      <Dropdown
        style={customStyles?.dropdown || styles.dropdown}
        data={categoryOptions}
        labelField="label"
        valueField="value"
        placeholder="Select"
        value={category}
        disable={!isCategoryEditable}
        onChange={item => {
          if (isCategoryEditable) {
            setCategory(item.value);
          }
        }}
      />

      {/* Consumer Range */}
      <Text
        style={[
          customStyles?.label || styles.label,
          errors.consumerRange && styles.errorLabel,
        ]}
      >
        Consumer Range *
      </Text>
      <Dropdown
        style={[
          customStyles?.dropdown || styles.dropdown,
          errors.consumerRange && styles.errorInput,
        ]}
        data={consumerRangeOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Range"
        value={consumerRange}
        onChange={item => setConsumerRange(item.value)}
      />
      {errors.consumerRange && (
        <Text style={styles.errorText}>{errors.consumerRange}</Text>
      )}

      {/* Effective From */}
      <Text style={customStyles?.label || styles.label}>Effective From</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={[
            customStyles?.input || styles.input,
            errors.effectiveFrom && styles.errorInput,
          ]}
          placeholder="YYYY-MM"
          value={effectiveFrom}
          editable={false}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          style={[errors.effectiveFrom && styles.errorInput]}
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      {errors.effectiveFrom && (
        <Text style={styles.errorText}>{errors.effectiveFrom}</Text>
      )}

      {/* Monthly Rate */}
      <Text style={customStyles?.label || styles.label}>Monthly Rate</Text>
      <TextInput
        style={customStyles?.input || styles.input}
        placeholder="Enter Monthly Rate"
        keyboardType="numeric"
        value={monthlyRate}
        onChangeText={setMonthlyRate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  errorLabel: {
    color: '#e74c3c',
  },
  errorInput: {
    borderColor: '#e74c3c',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default SWMDetailsSection;
