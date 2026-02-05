import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AppTooltip from './AppTooltip';
import { useState } from 'react';
// Error Display Component
const ErrorText = ({ error }) => {
  if (!error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
};

const PropertyDetails = ({
  khataNo,
  setKhataNo,
  plotNo,
  setPlotNo,
  villageName,
  setVillageName,
  plotArea,
  setPlotArea,
  roadWidthOptions,
  roadWidth,
  setRoadWidth,
  showFieldAlert = () => {},
  isEditable,
  errors = {},
  setErrors = () => {},
  khataNoRef,
  plotNoRef,
  villageNameRef,
  plotAreaRef,
  roadWidthRef,
  buildArea,
  setBuildArea,
}) => {
  const [showPlotTooltip, setShowPlotTooltip] = useState(false);
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Property Details</Text>

      {/* Khata No */}
      <Text style={styles.label}>Khata No. </Text>
      <TextInput
        ref={khataNoRef}
        style={[styles.input, errors.khataNo && styles.inputError]}
        // placeholder="xxxx xxxx xxxx"
        placeholderTextColor="grey"
        value={khataNo}
        onChangeText={setKhataNo}
        editable={isEditable}
      />
      {errors.khataNo && <Text style={styles.errorText}>{errors.khataNo}</Text>}

      {/* Plot No */}
      <Text style={styles.label}>Plot No. </Text>
      <TextInput
        ref={plotNoRef}
        style={[styles.input, errors.plotNo && styles.inputError]}
        // placeholder="ASD12"
        placeholderTextColor="grey"
        value={plotNo}
        onChangeText={setPlotNo}
        editable={isEditable}
      />
      {errors.plotNo && <Text style={styles.errorText}>{errors.plotNo}</Text>}

      {/* Village Name */}
      <Text style={styles.label}>Village/Mauja Name *</Text>
      <TextInput
        ref={villageNameRef}
        style={[styles.input, errors.villageName && styles.inputError]}
        placeholder="village"
        // placeholderTextColor="grey"
        value={villageName}
        onChangeText={setVillageName}
        editable={isEditable}
      />
      {errors.villageName && (
        <Text style={styles.errorText}>{errors.villageName}</Text>
      )}

      {/* Plot Area */}
      <Text style={styles.label}>Area of Plot (in sqft ) *</Text>
      <AppTooltip
        visible={showPlotTooltip}
        text="Built-up area includes all floors."
        onClose={() => setShowPlotTooltip(false)}
      />
      <TextInput
        ref={plotAreaRef}
        style={[styles.input, errors.plotArea && styles.inputError]}
        // placeholder="100.00"
        placeholderTextColor="grey"
        value={plotArea}
        onChangeText={setPlotArea}
        keyboardType="numeric"
        editable={isEditable}
        onFocus={() => setShowPlotTooltip(true)}
        onBlur={() => setShowPlotTooltip(false)}
      />

      {errors.plotArea && (
        <Text style={styles.errorText}>{errors.plotArea}</Text>
      )}

      {/* Built-up Area */}
      <Text style={styles.label}>Built-up Area (in sqft )*</Text>
      <TextInput
        ref={plotAreaRef}
        style={[styles.input, errors.buildArea && styles.inputError]}
        // placeholder="100.00"
        placeholderTextColor="grey"
        value={buildArea}
        onChangeText={setBuildArea}
        keyboardType="numeric"
        editable={isEditable}
      />
      {errors.buildArea && (
        <Text style={styles.errorText}>{errors.buildArea}</Text>
      )}

      {/* Road Width */}
      <Text style={styles.label}>Road Type *</Text>

      <Dropdown
        style={[styles.dropdown, errors.roadWidth && styles.errorInput]}
        data={roadWidthOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Road Width"
        placeholderStyle={{ color: 'grey' }}
        value={roadWidth}
        onChange={item => setRoadWidth(item.value)} // ✅ This should call the setter
      />
      {errors.roadWidth && (
        <Text style={styles.errorText}>{errors.roadWidth}</Text>
      )}

      {/* <Text style={styles.label}>
        In Case of No Road Enter "0" (For Vacant Land Only)
      </Text> */}
      <ErrorText error={errors.noRoad} />
    </View>
  );
};

export default PropertyDetails;

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#000000ff',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e63946',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '400',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});
