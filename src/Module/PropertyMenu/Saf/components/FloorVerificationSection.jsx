import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VerificationCard from '../VerificationCard';

const FloorVerificationSection = ({
  floorIds,
  getFloorState,
  updateFloorState,
  usageTypeDropdownOptions,
  occupancyTypeDropdownOptions,
  constructionTypeDropdownOptions,
  buildupAreaDropdownOptions,
  showError,
  setShowDateFromParkingPicker,
  setShowDateFromBasementPicker,
  setShowDateToParkingPicker,
  setShowDateToBasementPicker,
}) => {
  return (
    <LinearGradient
      colors={['#B6D9E0', '#2C5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      {floorIds.map((floor, index) => (
        <View key={floor.id} style={{ marginBottom: 20 }}>
          <Text style={styles.floorTitle}>
            {floor.floorName.toUpperCase()}
          </Text>

          <VerificationCard
            label="Usage-Type"
            value={floor.usageType || ''}
            dropdownOptions={usageTypeDropdownOptions || []}
            selectedVerification={getFloorState(
              floor.id,
              'usageType',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(
                floor.id,
                'usageType',
                value,
                'verification',
              )
            }
            dropdownValue={getFloorState(
              floor.id,
              'usageType',
              'dropdown',
            )}
            setDropdownValue={value =>
              updateFloorState(
                floor.id,
                'usageType',
                value,
                'dropdown',
              )
            }
            showError={showError}
          />

          <VerificationCard
            label="Occupancy-Type"
            value={floor.occupancyName || ''}
            dropdownOptions={occupancyTypeDropdownOptions || []}
            selectedVerification={getFloorState(
              floor.id,
              'occupancyType',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(
                floor.id,
                'occupancyType',
                value,
                'verification',
              )
            }
            dropdownValue={getFloorState(
              floor.id,
              'occupancyType',
              'dropdown',
            )}
            setDropdownValue={value =>
              updateFloorState(
                floor.id,
                'occupancyType',
                value,
                'dropdown',
              )
            }
            showError={showError}
          />

          <VerificationCard
            label="Construction-Type"
            value={floor.constructionType || ''}
            dropdownOptions={constructionTypeDropdownOptions || []}
            selectedVerification={getFloorState(
              floor.id,
              'constructionType',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(
                floor.id,
                'constructionType',
                value,
                'verification',
              )
            }
            dropdownValue={getFloorState(
              floor.id,
              'constructionType',
              'dropdown',
            )}
            setDropdownValue={value =>
              updateFloorState(
                floor.id,
                'constructionType',
                value,
                'dropdown',
              )
            }
            showError={showError}
          />

          <VerificationCard
            label="Builtup-Area"
            value={floor.builtupArea || ''}
            dropdownOptions={buildupAreaDropdownOptions || []}
            selectedVerification={getFloorState(
              floor.id,
              'builtupArea',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(
                floor.id,
                'builtupArea',
                value,
                'verification',
              )
            }
            dropdownValue={getFloorState(
              floor.id,
              'builtupArea',
              'dropdown',
            )}
            setDropdownValue={value =>
              updateFloorState(
                floor.id,
                'builtupArea',
                value,
                'dropdown',
              )
            }
            showInputOnIncorrect={true}
            inputValue={getFloorState(
              floor.id,
              'builtupArea',
              'input',
            )}
            setInputValue={value =>
              updateFloorState(
                floor.id,
                'builtupArea',
                value,
                'input',
              )
            }
            inputLabel="Enter new builtup area:"
            inputPlaceholder="Enter new builtup area"
            showError={showError}
          />

          <VerificationCard
            label="Date From"
            value={floor.dateFrom || ''}
            selectedVerification={getFloorState(
              floor.id,
              'dateFrom',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(
                floor.id,
                'dateFrom',
                value,
                'verification',
              )
            }
            showCalendarOnIncorrect={true}
            calendarValue={getFloorState(
              floor.id,
              'dateFrom',
              'dropdown',
            )}
            setCalendarValue={value =>
              updateFloorState(
                floor.id,
                'dateFrom',
                value,
                'dropdown',
              )
            }
            onCalendarPress={() => {
              if (floor.floorMasterId === 1)
                setShowDateFromParkingPicker(true);
              else if (floor.floorMasterId === 2)
                setShowDateFromBasementPicker(true);
            }}
            showError={showError}
          />

          <VerificationCard
            label="Date Upto"
            value={floor.dateUpto || ''}
            selectedVerification={getFloorState(
              floor.id,
              'dateTo',
              'verification',
            )}
            setSelectedVerification={value =>
              updateFloorState(floor.id, 'dateTo', value, 'verification')
            }
            showCalendarOnIncorrect={true}
            calendarValue={getFloorState(
              floor.id,
              'dateTo',
              'dropdown',
            )}
            setCalendarValue={value =>
              updateFloorState(floor.id, 'dateTo', value, 'dropdown')
            }
            onCalendarPress={() => {
              if (floor.floorMasterId === 1)
                setShowDateToParkingPicker(true);
              else if (floor.floorMasterId === 2)
                setShowDateToBasementPicker(true);
            }}
          />
        </View>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floorTitle: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    padding: 5,
    borderRadius: 4,
  },
});

export default FloorVerificationSection;
