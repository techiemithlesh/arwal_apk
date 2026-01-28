import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const OwnerDetailsSection = ({
  ownerName,
  setOwnerName,
  gender,
  setGender,
  genderOptions,
  dob,
  setDob,
  showDobPicker,
  setShowDobPicker,
  guardianName,
  setGuardianName,
  relation,
  setRelation,
  selectRelation,
  mobile,
  setMobile,
  aadhaar,
  setAadhaar,
  pan,
  setPan,
  email,
  setEmail,
  armedForces,
  setArmedForces,
  speciallyAbled,
  setSpeciallyAbled,
  yesNoOptions,
  isRessessment = false,
  isMutation = false,
}) => {
  const isOwnerDisabled = isRessessment && !isMutation;

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Owner Name */}
      <Text style={styles.label}>Owner Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Owner Name"
        placeholderTextColor="grey"
        value={ownerName}
        onChangeText={setOwnerName}
        editable={!isOwnerDisabled}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender *</Text>
      <Dropdown
        style={styles.dropdown}
        data={genderOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Gender"
        value={gender}
        onChange={item => setGender(item.value)}
        disable={isOwnerDisabled}
      />

      {/* DOB */}
      <Text style={styles.label}>Date of Birth *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => !isOwnerDisabled && setShowDobPicker(true)}
      >
        <Text style={{ color: dob ? '#000' : '#999' }}>
          {dob ? new Date(dob).toLocaleDateString('en-GB') : 'DOB *'}
        </Text>
      </TouchableOpacity>
      {showDobPicker && !isOwnerDisabled && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDobPicker(false);
            if (event.type === 'set' && selectedDate) {
              setDob(selectedDate.toISOString());
            }
          }}
        />
      )}

      {/* Guardian */}
      <Text style={styles.label}>Guardian Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Guardian Name"
        placeholderTextColor="black"
        value={guardianName}
        onChangeText={setGuardianName}
        editable={!isOwnerDisabled}
      />

      {/* Relation */}
      <Text style={styles.label}>Relation *</Text>
      <Dropdown
        style={styles.dropdown}
        data={selectRelation}
        labelField="label"
        valueField="value"
        placeholder="Select Relation"
        value={relation}
        onChange={item => setRelation(item.value)}
        disable={isOwnerDisabled}
      />

      {/* Mobile */}
      <Text style={styles.label}>Mobile Number *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={10}
        placeholder="Enter Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        placeholderTextColor="black"
        editable={!isOwnerDisabled}
      />

      {/* Aadhaar */}
      <Text style={styles.label}>Aadhaar Number *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={12}
        placeholder="Enter Aadhaar Number"
        value={aadhaar}
        onChangeText={setAadhaar}
        placeholderTextColor="black"
        editable={!isOwnerDisabled}
      />

      {/* PAN */}
      <Text style={styles.label}>PAN Number *</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="characters"
        maxLength={10}
        placeholder="Enter PAN Number"
        value={pan}
        onChangeText={setPan}
        placeholderTextColor="black"
        editable={!isOwnerDisabled}
      />

      {/* Email */}
      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="black"
        editable={!isOwnerDisabled}
      />

      {/* Armed Forces */}
      <Text style={styles.label}>Member of Armed Forces?</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Member of Armed Forces?"
        value={armedForces}
        onChange={item => setArmedForces(item.value)}
        disable={isOwnerDisabled}
      />

      {/* Specially Abled */}
      <Text style={styles.label}>Specially Abled?</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Specially Abled?"
        value={speciallyAbled}
        onChange={item => setSpeciallyAbled(item.value)}
        disable={isOwnerDisabled}
      />
    </View>
  );
};

export default OwnerDetailsSection;

const styles = StyleSheet.create({
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
    marginBottom: 12,
    fontSize: 16,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
});
