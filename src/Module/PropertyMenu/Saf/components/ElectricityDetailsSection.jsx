import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const ElectricityDetailsSection = ({
  kno,
  setKno,
  accNo,
  setAccNo,
  bindBookNo,
  setBindBookNo,
  electricityCategory,
  setElectricityCategory,
  selectelectcate,
  errors = {}, // 👈 new
  isRessessment = false,
  isMutation = false,
}) => {
  const isDisabled = isRessessment || isMutation;

  return (
    <View style={styles.container}>
      {/* Electricity K. No */}
      <Text style={styles.label}>Electricity K. No </Text>
      <TextInput
        style={[
          styles.input,
          errors.kno && styles.inputError, // highlight error
        ]}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        keyboardType="numeric"
        maxLength={14}
        value={kno}
        onChangeText={setKno}
        editable={!isDisabled}
      />
      {errors.kno && <Text style={styles.errorText}>{errors.kno}</Text>}

      {/* ACC No */}
      <Text style={styles.label}>ACC No </Text>
      <TextInput
        style={[styles.input, errors.accNo && styles.inputError]}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        keyboardType="numeric"
        value={accNo}
        onChangeText={setAccNo}
        editable={!isDisabled}
      />
      {errors.accNo && <Text style={styles.errorText}>{errors.accNo}</Text>}

      {/* BIND/BOOK No */}
      <Text style={styles.label}>BIND/BOOK No</Text>
      <TextInput
        style={[styles.input, errors.bindBookNo && styles.inputError]}
        placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        value={bindBookNo}
        onChangeText={setBindBookNo}
        editable={!isDisabled}
      />
      {errors.bindBookNo && (
        <Text style={styles.errorText}>{errors.bindBookNo}</Text>
      )}

      {/* Electricity Category */}
      <Text style={styles.label}>Electricity Category </Text>
      <Dropdown
        style={[
          styles.dropdown,
          errors.electricityCategory && styles.inputError,
        ]}
        data={selectelectcate}
        labelField="label"
        valueField="value"
        value={electricityCategory}
        onChange={item => setElectricityCategory(item.value)}
        disabled={isDisabled}
      />
      {errors.electricityCategory && (
        <Text style={styles.errorText}>{errors.electricityCategory}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#e63946',
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default ElectricityDetailsSection;
