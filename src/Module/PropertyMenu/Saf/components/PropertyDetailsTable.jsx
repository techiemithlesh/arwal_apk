import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PropertyDetailsTable = ({
  previewData,
  assessmentType,
  selectedPropertyLabel,
  selectedPropertyId,
}) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Property Details</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Field</Text>
          <Text style={styles.tableHeaderText}>Current Value</Text>
          <Text style={styles.tableHeaderText}>Verified Value</Text>
        </View>

        {assessmentType === 'Mutation' && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>
              Percentage of Property Transfer
            </Text>
            <Text style={styles.tableCell}>
              {previewData['Percentage_Transfer'] || 'N/A'}
            </Text>
            <Text style={styles.tableCell}>
              {previewData['Verified_Percentage'] || 'N/A'}
            </Text>
          </View>
        )}

        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Ward No</Text>
          <Text style={styles.tableCell}>
            {previewData['Ward No'] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData['Verified_Ward'] || 'N/A'}
          </Text>
        </View>

         <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Road Type</Text>
          <Text style={styles.tableCell}>
            {previewData['Road Type (Current)'] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData['Verified_RoadType'] || 'N/A'}
          </Text>
        </View>

         <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Area-of-plot</Text>
          <Text style={styles.tableCell}>
            {previewData['Area of Plot (Current)'] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData['Verified_PlotArea'] || 'N/A'}
          </Text>
        </View>


       {selectedPropertyId !== 4 && (
  <View style={[styles.tableRow, styles.tableRowAlternate]}>
    <Text style={styles.tableCellLabel}>Build-up Area</Text>

    <Text style={styles.tableCell}>
      {previewData['Built-up Area (Current)'] || 'N/A'}
    </Text>

    <Text style={styles.tableCell}>
      {previewData['Verified_BuiltupArea'] || 'N/A'}
    </Text>
  </View>
)}


        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Zone</Text>
          <Text style={styles.tableCell}>
            {previewData['Zone (Current)'] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData['Verified_Zone'] || 'N/A'}
          </Text>
        </View>

        <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Property Type</Text>
          <Text style={styles.tableCell}>
            {previewData['Property Type (Current)'] || 'N/A'}
          </Text>
          <Text style={styles.tableCell}>
            {previewData['Verified_PropertyType'] || 'N/A'}
          </Text>
        </View>

{(selectedPropertyId === 3 || selectedPropertyId === 4) && (
  <View style={styles.tableRow}>
    <Text style={styles.tableCellLabel}>
      Property Possession Date
    </Text>
    <Text style={styles.tableCell}>
      {previewData.Property_Possession_Date || '-'}
    </Text>
    <Text style={styles.tableCell}></Text>
  </View>
)}


        {selectedPropertyLabel === 'FLATS / UNIT IN MULTI STORIED BUILDING' && (
          <>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Selected Date</Text>
              <Text style={styles.tableCell}>{previewData.selectedDate}</Text>
              <Text style={styles.tableCell}> </Text>
            </View>

            <View style={[styles.tableRow, styles.tableRowAlternate]}>
              <Text style={styles.tableCellLabel}>Apartment Detail</Text>
              <Text style={styles.tableCell}>
                {previewData.apartmentLabel || 'N/A'}
              </Text>
              <Text style={styles.tableCell}> </Text>
            </View>
          </>
        )}
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

export default PropertyDetailsTable;
