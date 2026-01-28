import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropertyDetailsTable from './PropertyDetailsTable';
import FloorDetailsTable from './FloorDetailsTable';
import OtherPropertyFeaturesTable from './OtherPropertyFeaturesTable';
import { getLabelByValue, formatDate } from '../utils/helpers';

const PreviewModal = ({
  visible,
  onClose,
  onSubmit,
  previewData,
  data,
  selectedPropertyLabel,
  selectedPropertyId,
  propertyDropdownOptions,
  floorIds,
  addExtraFloor,
  floors,
  floorNameDropdownOptions,
  constructionTypeDropdownOptions,
  occupancyTypeDropdownOptions,
  usageTypeDropdownOptions,
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
}) => {
  const shouldShowPreviewSections =
    data?.propertyType?.toUpperCase() !== 'VACANT LAND' ||
    (data?.propertyType?.toUpperCase() === 'VACANT LAND' &&
      selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' &&
      selectedPropertyLabel !== '');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Preview Details</Text>
          <ScrollView style={styles.modalContent}>
            {/* Property Details Table */}
            <PropertyDetailsTable
              previewData={previewData}
              assessmentType={data?.assessmentType}
              selectedPropertyLabel={selectedPropertyLabel}
              selectedPropertyId={selectedPropertyId}
            />

            {/* Floor Details Tables */}
            {shouldShowPreviewSections &&
              selectedPropertyLabel.toUpperCase() !== 'VACANT LAND' && (
                <>
                  {floorIds.map((floor, index) => {
                    const floorPrefix = floor.floorName || `Floor ${index + 1}`;
                    return (
                      <FloorDetailsTable
                        key={floor.id}
                        floor={floor}
                        floorPrefix={floorPrefix}
                        previewData={previewData}
                      />
                    );
                  })}

                  {/* Extra Floor Details Cards */}
                  {addExtraFloor &&
                    floors.length > 0 &&
                    floors.map((floor, floorIndex) => (
                      <View key={floorIndex} style={styles.cardContainer}>
                        <Text style={styles.cardTitle}>
                          Extra Floor {floorIndex + 1} Details
                        </Text>

                        {[
                          {
                            label: 'Floor Type',
                            value:
                              getLabelByValue(
                                floorNameDropdownOptions,
                                floor.floorName,
                              ) || 'N/A',
                          },
                          {
                            label: 'Construction Type',
                            value:
                              getLabelByValue(
                                constructionTypeDropdownOptions,
                                floor.constructionType,
                              ) || 'N/A',
                          },
                          {
                            label: 'Occupancy Type',
                            value:
                              getLabelByValue(
                                occupancyTypeDropdownOptions,
                                floor.occupancyType,
                              ) || 'N/A',
                          },
                          {
                            label: 'Usage Type',
                            value:
                              getLabelByValue(
                                usageTypeDropdownOptions,
                                floor.usageType,
                              ) || 'N/A',
                          },
                          {
                            label: 'Built-up Area',
                            value: floor.builtupArea || 'N/A',
                          },
                          {
                            label: 'Date From',
                            value: floor.fromDate
                              ? formatDate(floor.fromDate)
                              : 'N/A',
                          },
                          {
                            label: 'Date To',
                            value: floor.toDate
                              ? formatDate(floor.toDate)
                              : 'N/A',
                          },
                        ].map((item, idx) => (
                          <View key={idx} style={styles.cardRow}>
                            <Text style={styles.cardLabel}>{item.label}</Text>
                            <Text style={styles.cardValue}>{item.value}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                </>
              )}

            {/* Other Property Features Section */}
            <OtherPropertyFeaturesTable
              mobileTower={mobileTower}
              towerArea={towerArea}
              installationDate={installationDate}
              hoarding={hoarding}
              hoardingArea={hoardingArea}
              hoardingInstallationDate={hoardingInstallationDate}
              petrolPump={petrolPump}
              pumpArea={pumpArea}
              pumpInstallationDate={pumpInstallationDate}
              rainHarvesting={rainHarvesting}
              completionDate={completionDate}
              selectedPropertyLabel={selectedPropertyLabel}
            />
          </ScrollView>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={onSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f3969',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreviewModal;
