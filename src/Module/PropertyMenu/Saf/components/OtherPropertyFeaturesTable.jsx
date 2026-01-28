import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../utils/helpers';

const OtherPropertyFeaturesTable = ({
  mobileTower,
  towerArea,
  installationDate,
  hoarding,
  hoardingArea,
  hoardingInstallationDate,
  petrolPump,
  pumpArea,
  pumpInstallationDate,
  rainHarvesting,
  completionDate,
  selectedPropertyLabel,
}) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Other Property Features</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Field</Text>
          <Text style={styles.tableHeaderText}>Value</Text>
        </View>

        {/* Mobile Tower */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCellLabel}>Mobile Tower</Text>
          <Text style={styles.tableCell}>{mobileTower || 'N/A'}</Text>
        </View>
        {mobileTower === 'yes' && (
          <>
            <View style={[styles.tableRow, styles.tableRowAlternate]}>
              <Text style={styles.tableCellLabel}>Tower Area</Text>
              <Text style={styles.tableCell}>{towerArea || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Installation Date</Text>
              <Text style={styles.tableCell}>
                {installationDate ? formatDate(installationDate) : 'N/A'}
              </Text>
            </View>
          </>
        )}

        {/* Hoarding */}
        <View style={[styles.tableRow, styles.tableRowAlternate]}>
          <Text style={styles.tableCellLabel}>Hoarding</Text>
          <Text style={styles.tableCell}>{hoarding || 'N/A'}</Text>
        </View>
        {hoarding === 'yes' && (
          <>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Hoarding Area</Text>
              <Text style={styles.tableCell}>{hoardingArea || 'N/A'}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlternate]}>
              <Text style={styles.tableCellLabel}>Installation Date</Text>
              <Text style={styles.tableCell}>
                {hoardingInstallationDate ? formatDate(hoardingInstallationDate) : 'N/A'}
              </Text>
            </View>
          </>
        )}

        {selectedPropertyLabel !== 'VACANT LAND' && (
          <>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Petrol Pump</Text>
              <Text style={styles.tableCell}>{petrolPump || 'N/A'}</Text>
            </View>
            {petrolPump === 'yes' && (
              <>
                <View style={[styles.tableRow, styles.tableRowAlternate]}>
                  <Text style={styles.tableCellLabel}>Pump Area</Text>
                  <Text style={styles.tableCell}>{pumpArea || 'N/A'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Installation Date</Text>
                  <Text style={styles.tableCell}>
                    {pumpInstallationDate ? formatDate(pumpInstallationDate) : 'N/A'}
                  </Text>
                </View>
              </>
            )}

            {/* Rainwater Harvesting */}
            <View style={[styles.tableRow, styles.tableRowAlternate]}>
              <Text style={styles.tableCellLabel}>Rainwater Harvesting</Text>
              <Text style={styles.tableCell}>{rainHarvesting || 'N/A'}</Text>
            </View>
            {rainHarvesting === 'yes' && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLabel}>Completion Date</Text>
                <Text style={styles.tableCell}>
                  {completionDate
                    ? new Date(completionDate).toISOString().split('T')[0]
                    : 'N/A'}
                </Text>
              </View>
            )}
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

export default OtherPropertyFeaturesTable;
