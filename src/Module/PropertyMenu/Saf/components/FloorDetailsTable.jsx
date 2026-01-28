import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FloorDetailsTable = ({ floor, floorPrefix, previewData }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>{floorPrefix} Details</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Field</Text>
          <Text style={styles.tableHeaderText}>Current Value</Text>
          <Text style={styles.tableHeaderText}>Verified Value</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Usage Type</Text>
          <Text style={styles.tableCell}>
            {previewData[`Usage Type (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_Usage${floorPrefix}`] || 'N/A'}
          </Text>
        </View>

        <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Occupancy Type</Text>
          <Text style={styles.tableCell}>
            {previewData[`Occupancy Type (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_Occupancy${floorPrefix}`] || 'N/A'}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Construction Type</Text>
          <Text style={styles.tableCell}>
            {previewData[`Construction Type (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_Construction${floorPrefix}`] || 'N/A'}
          </Text>
        </View>

        <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Built-up Area</Text>
          <Text style={styles.tableCell}>
            {previewData[`Built-up Area (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_BuiltUp${floorPrefix}`] || 'N/A'}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Date From</Text>
          <Text style={styles.tableCell}>
            {previewData[`Date From (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_DateFrom${floorPrefix}`] || 'N/A'}
          </Text>
        </View>

        <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Date To</Text>
          <Text style={styles.tableCell}>
            {previewData[`Date To (${floorPrefix} Current)`] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData[`Verified_DateTo${floorPrefix}`] || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  table: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowAlternate: {
    backgroundColor: '#f9f9f9',
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    paddingRight: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
});

export default FloorDetailsTable;
