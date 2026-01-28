import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import MonthYearPicker from 'react-native-month-year-picker';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { formatDate } from '../utils/helpers';

const ExtraFloorForm = ({
  floors,
  addFloor,
  removeFloor,
  updateFloor,
  floorNameDropdownOptions,
  constructionTypeDropdownOptions,
  occupancyTypeDropdownOptions,
  usageTypeDropdownOptions,
}) => {
  return (
    <>
      {floors.map((floor, index) => (
        <LinearGradient
          key={index}
          colors={['#ececf2ff', '#eee7e7ff']}
          style={styles.card}
        >
          <View style={styles.rowlabel}>
            <Text style={{ color: 'white' }}>
              Extra Floor {index + 1}
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Floor Name</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={floorNameDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={floor.floorName}
              onChange={item =>
                updateFloor(index, 'floorName', item.value)
              }
            />

            <Text style={styles.label}>Construction Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={constructionTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={floor.constructionType}
              onChange={item =>
                updateFloor(index, 'constructionType', item.value)
              }
            />

            <Text style={styles.label}>Occupancy Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={occupancyTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={floor.occupancyType}
              onChange={item =>
                updateFloor(index, 'occupancyType', item.value)
              }
            />

            <Text style={styles.label}>Usage Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={usageTypeDropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={floor.usageType}
              onChange={item =>
                updateFloor(index, 'usageType', item.value)
              }
            />

            <Text style={styles.label}>Built-up Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter built-up area"
              value={floor.builtupArea}
              onChangeText={text =>
                updateFloor(index, 'builtupArea', text)
              }
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Date From</Text>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() =>
              updateFloor(index, 'showFromPicker', true)
            }
          >
            <Text style={styles.dateText}>
              {floor.fromDate
                ? formatDate(floor.fromDate)
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {floor.showFromPicker && (
            <MonthYearPicker
              onChange={(event, newDate) => {
                updateFloor(index, 'showFromPicker', false);
                if (newDate) {
                  updateFloor(index, 'fromDate', newDate);
                }
              }}
              value={floor.fromDate || new Date()}
            />
          )}

          <Text style={styles.label}>Date Upto</Text>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() =>
              updateFloor(index, 'showToPicker', true)
            }
          >
            <Text style={styles.dateText}>
              {floor.toDate
                ? formatDate(floor.toDate)
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {floor.showToPicker && (
            <MonthYearPicker
              onChange={(event, newDate) => {
                updateFloor(index, 'showToPicker', false);
                if (newDate) {
                  updateFloor(index, 'toDate', newDate);
                }
              }}
              value={floor.toDate || new Date()}
            />
          )}
        </LinearGradient>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={addFloor}
          style={styles.addButton}
        >
          <Text style={styles.buttonText}>Add Floor</Text>
        </TouchableOpacity>
        {floors.length > 0 && (
          <TouchableOpacity
            onPress={removeFloor}
            style={styles.removeButton}
          >
            <Text style={styles.buttonText}>Remove Floor</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
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
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    height: responsiveHeight(5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 12,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  removeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ExtraFloorForm;
