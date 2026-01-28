import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const AddressSection = ({
  address,
  setAddress,
  city,
  setCity,
  district,
  setDistrict,
  stateValue,
  setStateValue,
  pincode,
  setPincode,
  title,
  isRessessment = false,
  isMutation = false,
  errors = {}, // 👈 object containing errors
}) => {
  const isDisabled = isRessessment || isMutation;

  // helper to apply error style
  const getInputStyle = field =>
    errors[field] ? [styles.input, styles.inputError] : styles.input;

  return (
    <View style={styles.section}>
      {title && <Text style={styles.header}>{title}</Text>}

      <Text style={styles.label}>Property Address *</Text>
      <TextInput
        style={getInputStyle('address')}
        placeholder="Property Address *"
        placeholderTextColor="grey"
        value={address}
        onChangeText={setAddress}
        editable={!isDisabled}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <Text style={styles.label}>City *</Text>
      <TextInput
        style={getInputStyle('city')}
        placeholder="City *"
        placeholderTextColor="grey"
        value={city}
        onChangeText={setCity}
        editable={!isDisabled}
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

      <Text style={styles.label}>District *</Text>
      <TextInput
        style={getInputStyle('district')}
        placeholder="District *"
        placeholderTextColor="grey"
        value={district}
        onChangeText={setDistrict}
        editable={!isDisabled}
      />
      {errors.district && (
        <Text style={styles.errorText}>{errors.district}</Text>
      )}

      <Text style={styles.label}>State *</Text>
      <TextInput
        style={getInputStyle('stateValue')}
        placeholder="State *"
        placeholderTextColor="grey"
        value={stateValue}
        onChangeText={setStateValue}
        editable={!isDisabled}
      />
      {errors.stateValue && (
        <Text style={styles.errorText}>{errors.stateValue}</Text>
      )}

      <Text style={styles.label}>Pincode *</Text>
      <TextInput
        style={getInputStyle('pincode')}
        placeholder="Pincode *"
        placeholderTextColor="grey"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        editable={!isDisabled}
      />
      {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e63946', // red border for error
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default AddressSection;
