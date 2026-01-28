import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { getUserDetails } from '../../../utils/auth';
import { showToast } from '../../../utils/toast';
import SubmissionModal from '../Holding/Surveysubmission/SubmissionModal';
import {
  submitFieldVerification,
  submitGeotaggedImages,
  sendToLevel,
} from '../Holding/Surveysubmission/submissionApi';
import { getToken } from '../../../utils/auth';
import axios from 'axios';

const VerifiedStatus = ({ route }) => {
  const [isULBUser, setIsULBUser] = useState(false);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [front, setFront] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  const { submissionData, id, data, floorIds, floorDataArray } =
    route.params || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserDetails();
        if (user?.userFor == 'ULB') setIsULBUser(true);
        console.log('User Details:', user.userFor);
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const parseDate = str => {
    if (!str) return null;
    if (str.includes('/')) {
      const [month, year] = str.split('/');
      return `${year}-${month.padStart(2, '0')}`;
    }
    const months = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };
    const [monthName, year] = str.split(' ');
    const month = months[monthName.toLowerCase()];
    return month && year ? `${year}-${month}` : null;
  };

  const getCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  /**
   * CORE FIX: Handles checking permission AND enabling GPS hardware
   */
  const handleRequestLocation = async () => {
    const hasPermission = await getLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please enable location permissions in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
        ],
      );
      return false;
    }

    setLoadingLocation(true);

    try {
      // This triggers the "Allow Location" system dialog to turn GPS ON
      if (Platform.OS === 'android') {
        await promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
      }

      return new Promise(resolve => {
        Geolocation.getCurrentPosition(
          pos => {
            setLocation(pos.coords);
            setLoadingLocation(false);
            resolve(pos.coords);
          },
          err => {
            console.log('Geo Error:', err);
            setLoadingLocation(false);
            Alert.alert(
              'Location Error',
              'Unable to fetch coordinates. Ensure you are outdoors.',
            );
            resolve(null);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
        );
      });
    } catch (error) {
      setLoadingLocation(false);
      Alert.alert('GPS Required', 'Please turn on GPS to proceed.');
      return false;
    }
  };

  const capturePhoto = async photoIndex => {
    // Ensure we have location before allowing photo capture
    let currentLoc = location;
    if (!currentLoc) {
      currentLoc = await handleRequestLocation();
    }
    if (!currentLoc) return;

    const hasCamera = await getCameraPermission();
    if (!hasCamera) {
      Alert.alert('Camera Error', 'Camera permission is required.');
      return;
    }

    launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.didCancel || !res.assets) return;
      const photo = res.assets[0];
      if (photoIndex === 'left') setLeft(photo);
      if (photoIndex === 'right') setRight(photo);
      if (photoIndex === 'front') setFront(photo);
    });
  };

  // const handleSubmit = async () => {
  //   if (!isULBUser && (!location || !left || !right || !front)) {
  //     Alert.alert(
  //       'Missing Info',
  //       'Please capture location and all required photos.',
  //     );
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const fieldResponse = await submitFieldVerification(
  //       submissionData,
  //       floorIds,
  //       floorDataArray,
  //       id,
  //       data,
  //     );

  //     if (fieldResponse.status === 200) {
  //       showToast('success', fieldResponse.data.message);
  //       if (!isULBUser && location) {
  //         const photos = [
  //           { label: 'left side', direction: 'West', ...left },
  //           { label: 'right side', direction: 'East', ...right },
  //           { label: 'front side', direction: 'North', ...front },
  //         ];
  //         await submitGeotaggedImages(photos, location, id);
  //       }
  //       setShowModal(true);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Submission failed.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    // 1. Strict Validation
    if (!isULBUser && (!location || !left || !right || !front)) {
      Alert.alert(
        'Missing Info',
        'Please capture location and all required photos.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Submit Main Verification Data
      const fieldResponse = await submitFieldVerification(
        submissionData,
        floorIds,
        floorDataArray,
        id,
        data,
      );

      if (fieldResponse.status === 200) {
        showToast('success', fieldResponse.data.message);
        console.log('Field Verification Response:', fieldResponse);

        // 3. ONLY submit images if this is NOT a ULB user AND photos exist
        if (!isULBUser && location && left && right && front) {
          const photos = [
            { label: 'left side', direction: 'West', ...left },
            { label: 'right side', direction: 'East', ...right },
            { label: 'front side', direction: 'North', ...front },
          ];

          try {
            await submitGeotaggedImages(photos, location, id);
          } catch (geoError) {
            console.log(
              'Photo submission failed, but main data was sent:',
              geoError,
            );
            // We don't necessarily want to block the whole process if just photos fail
          }
        }

        // 4. Open Modal for Remarks
        setShowModal(true);
      }
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        'Submission failed. Check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSendToLevel = async status => {
    try {
      await sendToLevel(id, remarks, status);
      setShowModal(false);
      showToast('success', `Successfully sent ${status.toLowerCase()}`);
      navigation.navigate('FieldVarification', { id });
    } catch (err) {
      Alert.alert('Error', 'Failed to send to level.');
    }
  };

  const renderFloorData = () => {
    if (!submissionData?.extraFloors) return null;
    return submissionData.extraFloors.map((floor, idx) => (
      <View key={idx} style={styles.extraFloorCard}>
        <Text style={styles.extraFloorTitle}>
          Extra Floor {idx + 1} Details
        </Text>
        {[
          'floorName',
          'constructionType',
          'occupancyType',
          'usageType',
          'builtupArea',
          'dateFrom',
          'dateUpto',
        ].map(field => (
          <View style={styles.floorRow} key={field}>
            <Text style={styles.floorLabel}>
              {field.replace(/([A-Z])/g, ' $1')}:
            </Text>
            <Text style={styles.floorValue}>
              {field.includes('date')
                ? parseDate(floor[field])
                : floor[field] || 'N/A'}
            </Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Preview Details</Text>

        {submissionData ? (
          <>
            {/* Property Details */}
            <SubmissionCard
              title="Property Details"
              rows={[
                ...(submissionData['assessmentType'] === 'Mutation'
                  ? [
                      {
                        label: 'Percentage Transfer',
                        value: submissionData['Percentage_Transfer'],
                        verifiedValue: submissionData['Verified_Percentage'],
                      },
                    ]
                  : []),

                {
                  label: 'Ward No',
                  value: submissionData['Ward No'],
                  verifiedValue: submissionData['Verified_Ward'],
                },
                {
                  label: 'Road Type',
                  value: submissionData['Road Type (Current)'],
                  verifiedValue: submissionData['Verified_RoadType'],
                },
                {
                  label: 'Built-up Area',
                  value: submissionData['Built-up Area (Current)'],
                  verifiedValue: submissionData['Verified_BuiltupArea'],
                },
                {
                  label: 'Area of plot',
                  value: submissionData['Area of Plot (Current)'],
                  verifiedValue: submissionData['Verified_PlotArea'],
                },
                {
                  label: 'Zone',
                  value: submissionData['Zone (Current)'],
                  verifiedValue: submissionData['Verified_Zone'],
                },
                {
                  label: 'Property Type',
                  value: submissionData['Property Type (Current)'],
                  verifiedValue: submissionData['Verified_PropertyType'],
                },

                ...(submissionData['Verified_PropertyType'] ===
                'FLATS / UNIT IN MULTI STORIED BUILDING'
                  ? [
                      {
                        label: 'Selected Date',
                        value: submissionData['selectedDate'],
                      },
                      {
                        label: 'Apartment Detail Type',
                        value: submissionData['apartmentLabel'],
                      },
                    ]
                  : []),
              ]}
            />
            {submissionData?.propTypeMstrId != 4 && floorIds?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Floor Details</Text>
                {floorIds.map((floor, index) => (
                  <SubmissionCard
                    key={index}
                    title={`${floor.floorName} Details`}
                    rows={[
                      {
                        label: 'Usage Type',
                        value: floor.usageType,
                        verifiedValue:
                          submissionData[`Verified_Usage${floor.floorName}`],
                      },
                      {
                        label: 'Occupancy Type',
                        value: floor.occupancyName,
                        verifiedValue:
                          submissionData[
                            `Verified_Occupancy${floor.floorName}`
                          ],
                      },
                      {
                        label: 'Construction Type',
                        value: floor.constructionType,
                        verifiedValue:
                          submissionData[
                            `Verified_Construction${floor.floorName}`
                          ],
                      },
                      {
                        label: 'Built-up Area',
                        value: floor.builtupArea,
                        verifiedValue:
                          submissionData[`Verified_BuiltUp${floor.floorName}`],
                      },
                      {
                        label: 'Date From',
                        value: floor.dateFrom,
                        verifiedValue:
                          submissionData[`Verified_DateFrom${floor.floorName}`],
                      },
                      {
                        label: 'Date To',
                        value: floor.dateUpto || '-',
                        verifiedValue:
                          submissionData[`Verified_DateTo${floor.floorName}`],
                      },
                    ]}
                  />
                ))}
              </>
            )}

            {submissionData && (
              <SubmissionCard
                title="Additional Details"
                isHide={true}
                rows={[
                  // Mobile Tower
                  {
                    label: 'Mobile Tower',
                    value: submissionData.mobileTower || 'N/A',
                  },
                  ...(submissionData.mobileTower === 'yes'
                    ? [
                        {
                          label: 'Tower Area',
                          value: submissionData.towerArea || 'N/A',
                        },
                        {
                          label: 'Installation Date',
                          value: submissionData.installationDate || 'N/A',
                        },
                      ]
                    : []),

                  // Hoarding
                  {
                    label: 'Hoarding',
                    value: submissionData.hoarding || 'N/A',
                  },
                  ...(submissionData.hoarding === 'yes'
                    ? [
                        {
                          label: 'Hoarding Area',
                          value: submissionData.hoardingArea || 'N/A',
                        },
                        {
                          label: 'Hoarding Installation Date',
                          value:
                            submissionData.hoardingInstallationDate ||
                            submissionData.installationDate ||
                            'N/A',
                        },
                      ]
                    : []),

                  // Rain Harvesting
                  {
                    label: 'Rain Harvesting',
                    value: submissionData.rainHarvesting || 'N/A',
                  },

                  // Petrol Pump
                  {
                    label: 'Petrol Pump',
                    value: submissionData.petrolPump || 'N/A',
                  },
                  ...(submissionData.petrolPump === 'yes'
                    ? [
                        {
                          label: 'Pump Area',
                          value: submissionData.pumpArea || 'N/A',
                        },
                        {
                          label: 'Pump Installation Date',
                          value: submissionData.pumpInstallationDate || 'N/A',
                        },
                      ]
                    : []),
                ]}
              />
            )}

            {!isULBUser && (
              <View style={styles.locationPhotoCard}>
                <Text style={styles.locationPhotoTitle}>Photo & Location</Text>
                {loadingLocation ? (
                  <ActivityIndicator size="large" color="#007AFF" />
                ) : !location ? (
                  <>
                    <TouchableOpacity
                      style={styles.getLocationButton}
                      onPress={handleRequestLocation}
                    >
                      <Text style={styles.getLocationButtonText}>
                        📍 Get Current Location
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.locationHelpText}>
                      * Location is required before capturing photos
                    </Text>
                  </>
                ) : (
                  <View style={styles.locationInfo}>
                    <View style={styles.coordinatesBox}>
                      <Text style={styles.coordinateLabel}>
                        Lat: {location.latitude.toFixed(6)} | Lng:{' '}
                        {location.longitude.toFixed(6)}
                      </Text>
                    </View>
                    <View style={styles.photosGrid}>
                      {['left', 'right', 'front'].map(side => {
                        const photo =
                          side === 'left'
                            ? left
                            : side === 'right'
                            ? right
                            : front;
                        const setPhoto =
                          side === 'left'
                            ? setLeft
                            : side === 'right'
                            ? setRight
                            : setFront;
                        return (
                          <View key={side} style={styles.photoItem}>
                            <Text style={styles.photoLabel}>
                              {side.toUpperCase()}
                            </Text>
                            {photo ? (
                              <View style={styles.photoWrapper}>
                                <Image
                                  source={{ uri: photo.uri }}
                                  style={styles.photoImage}
                                />
                                <TouchableOpacity
                                  style={styles.photoDeleteButton}
                                  onPress={() => setPhoto(null)}
                                >
                                  <Text style={styles.photoDeleteText}>✕</Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={styles.captureButton}
                                onPress={() => capturePhoto(side)}
                              >
                                <Text style={styles.captureButtonText}>
                                  📷 Capture
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          <Text>No data found.</Text>
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <SubmissionModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          remarks={remarks}
          onRemarksChange={setRemarks}
          onForward={() => handleSendToLevel('FORWARD')}
          onBackward={() => handleSendToLevel('BACKWARD')}
          isULBUser={isULBUser}
        />
      </ScrollView>
    </>
  );
};

// ... Styles (Keeping your existing styles)
const SubmissionCard = ({ title, rows, isHide = false }) => (
  <View style={styles.tableCard}>
    <Text style={styles.tableTitle}>{title}</Text>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={[styles.tableCellLabel, styles.tableHeaderText]}>Field</Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Current
      </Text>
      <Text style={[styles.tableCellValue, styles.tableHeaderText]}>
        Verified
      </Text>
    </View>
    {rows.map((row, index) => (
      <View
        key={index}
        style={[
          styles.tableRow,
          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
        ]}
      >
        <Text style={styles.tableCellLabel}>{row.label}</Text>
        <Text style={styles.tableCellValue}>{String(row.value || 'N/A')}</Text>
        {!isHide && (
          <Text style={styles.tableCellValue}>
            {String(row.verifiedValue || 'N/A')}
          </Text>
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  tableRowEven: { backgroundColor: '#f9f9f9' },
  tableRowOdd: { backgroundColor: '#fff' },
  tableHeader: { backgroundColor: '#007AFF', borderRadius: 6 },
  tableHeaderText: { color: '#fff', fontWeight: '700' },
  tableCellLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  tableCellValue: { flex: 1, fontSize: 14, textAlign: 'right' },
  locationPhotoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  locationPhotoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  getLocationButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  getLocationButtonText: { color: '#fff', fontWeight: 'bold' },
  locationHelpText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
  },
  coordinatesBox: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  coordinateLabel: { fontWeight: '600', fontSize: 13 },
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  photoItem: { width: '30%', alignItems: 'center' },
  photoLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  photoImage: { width: 80, height: 80, borderRadius: 8 },
  photoWrapper: { position: 'relative' },
  photoDeleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  photoDeleteText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  captureButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
  captureButtonText: { color: '#fff', fontSize: 10 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 60,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabledButton: { backgroundColor: '#ccc' },
  extraFloorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  extraFloorTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  floorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  floorLabel: { flex: 1, fontWeight: '600' },
  floorValue: { width: 100, textAlign: 'right' },
});

export default VerifiedStatus;
