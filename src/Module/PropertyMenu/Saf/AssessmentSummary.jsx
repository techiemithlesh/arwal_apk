import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../api/apiRoutes'; // make sure this is your API route
import { getToken } from '../../../utils/auth';
import { showToast } from '../../../utils/toast';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { validateExtraChargesDates } from '../../../Validation/validation.';
import Clipboard from '@react-native-clipboard/clipboard';
// OR for newer versions:

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const AssessmentSummary = ({ route, navigation }) => {
  const [copiedSafNo, setCopiedSafNo] = useState(''); // ✅ add this
  const [modalVisible, setModalVisible] = useState(false);
  const data = route.params?.data || {};
  // console.log('data  AssessmentSummary', route.params?.masterData || {});
  const ownerDetails = data.ownerDtl || [];
  // console.log('owner Datails', ownerDetails);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(route.params?.data || {});
  const [savedSafId, setSavedSafId] = useState(null);

  const masterData = route.params?.masterData || {};
  console.log('masterData', masterData);
  // const getMasterName = (list, id, labelKey) => {
  //   if (!Array.isArray(list)) return '';
  //   const item = list.find(i => i.id === id);
  //   return item ? item[labelKey] : '';
  // };
  const getMasterName = (list, id, labelKey) => {
    if (!Array.isArray(list) || id == null) return '';

    const item = list.find(i => String(i.id) === String(id));
    return item?.[labelKey] || '';
  };

  const mappedProperty = {
    ...data,
    zone: getMasterName(masterData.zoneType, data.zoneMstrId, 'zoneName'),
    ward: getMasterName(masterData.wardList, data.wardMstrId, 'wardNo'),

    ownershipType: getMasterName(
      masterData.ownershipType,
      data.ownershipTypeMstrId,
      'ownershipType',
    ),

    propertyType: getMasterName(
      masterData.propertyType,
      data.propTypeMstrId,
      'propertyType',
    ),
  };
  // Map floor details with names
  const floorss = (data.floorDtl || []).map(floor => ({
    floorName: getMasterName(
      masterData.floorType,
      floor.floorMasterId,
      'floorName',
    ),
    usageType: getMasterName(
      masterData.usageType,
      floor.usageTypeMasterId,
      'usageType',
    ),

    occupancyType: getMasterName(
      masterData.occupancyType,
      floor.occupancyTypeMasterId,
      'occupancyName',
    ),
    constructionType: getMasterName(
      masterData.constructionType,
      floor.constructionTypeMasterId,
      'constructionType',
    ),
    builtUpArea: floor.builtupArea,
    fromDate: floor.dateFrom,
    uptoDate: floor.dateUpto1,
  }));
  console.log('floors details', floorss);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();

      // This helper converts your "Old Type" object into the FormData the API wants
      Object.keys(data).forEach(key => {
        if (key === 'geoTag' || key === 'ownerDtl' || key === 'floorDtl') {
          // Handle arrays specifically for the API format
          data[key].forEach((item, index) => {
            Object.keys(item).forEach(subKey => {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            });
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      console.log('Final payload Summurty:', JSON.stringify(data, null, 2));
      const response = await axios.post(SAF_API_ROUTES.APPLY_SAF, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      console.log('Full Response:', response.data);
      if (response.data.status) {
        const { message, data } = response.data;
        const safId = data?.safId; // ✅ get SAF ID

        setSavedSafId(safId);

        // Show success message immediately
        showToast('success', message);
        const safNo = data?.safNo;

        if (safNo) {
          Clipboard.setString(safNo); // copy SAF No
          setCopiedSafNo(safNo); // ✅ save SAF No in state
          setTimeout(() => {
            setModalVisible(true); // ✅ show modal
          }, 2000);
        }
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'API request failed');
    }
  };

  const handleOk = () => {
    setModalVisible(false);

    if (savedSafId) {
      navigation.navigate('SafDueDetails', { id: savedSafId }); // ✅ correct navigation
    }
  };

  return (
    <>
      <HeaderNavigation />
      <ScrollView style={styles.container}>
        {data.id && (
          <Section title="Assessment ID">
            <Row label="ID" value={data.id} />
          </Section>
        )}
        <Section title="Property Details">
          <View style={styles.ownerCard}>
            <Row label="Assessment Type" value="New Assessment" />
            <Row label="Circle" value={mappedProperty.zone} />
            <Row label="Old Ward" value={mappedProperty.ward} />
            {/* <Row label="New Ward" value={mappedProperty.newWardLabel} /> */}
            <Row label="Ownership Type" value={mappedProperty.ownershipType} />
            <Row label="Property Type" value={mappedProperty.propertyType} />
            {/* <Row label="Road Width (ft)" value={data.roadWidth} /> */}
          </View>
        </Section>
        <Section title="Property Address">
          <View style={styles.ownerCard}>
            <Row label="Property Address" value={data.propAddress} />
            <Row label="City" value={data.propCity} />
            <Row label="District" value={data.propDist} />
            <Row label="State" value={data.propState} />
            <Row label="Pincode" value={data.propState} />
            <Row
              label="Is Correspondence Address Different?"
              value={data.correspondingAddress ? 'Yes' : 'No'}
            />
            {data.correspondingAddress && (
              <>
                <Row
                  label="Correspondence Address"
                  value={data.correspondingAddress}
                />
                <Row label="City" value={data.correspondingCity} />
                <Row label="District" value={data.correspondingDistrict} />
                <Row label="State" value={data.correspondingState} />
                <Row label="Pincode" value={data.correspondingPincode} />
              </>
            )}
          </View>
        </Section>
        <Section title="Owner Details">
          {(ownerDetails || []).map(
            (
              {
                ownerName,
                guardianName,
                gender,
                dob,
                mobileNo,
                relationType,
                adharNo,
                email,
                pan,
                isArmedForce,
                isSpeciallyAbled,
              },
              index,
            ) => (
              <View key={index} style={styles.ownerCard}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                  Owner {index + 1}
                </Text>
                <Row label="Owner Name" value={ownerName} />
                <Row label="Guardian Name" value={guardianName} />
                <Row label="Gender" value={gender} />
                <Row label="DOB" value={dob} />
                <Row label="Mobile No." value={mobileNo} />
                <Row label="Email" value={email} />
                <Row label="Relation" value={relationType} />
                <Row label="Aadhaar No." value={adharNo} />
                <Row label="PAN No." value={pan} />
                <Row
                  label="Is Armed Force?"
                  value={
                    isArmedForce === '1' || isArmedForce === 1 ? 'Yes' : 'No'
                  }
                />
                <Row
                  label="Is Specially Abled?"
                  value={
                    isSpeciallyAbled === '1' || isSpeciallyAbled === 1
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            ),
          )}
        </Section>
        <Section title="Electricity Details">
          <View style={styles.ownerCard}>
            <Row label="KNO" value={data.electAccNo} />
            <Row label="ACC No" value={data.electAccNo} />
            <Row label="BIND/BOOK No" value={data.electBindBookNo} />
            <Row label="Electricity Category" value={data.electConsCategory} />
          </View>
        </Section>
        {/* <Section title="Water Connection Details">
          <View style={styles.ownerCard}>
            <Row label="Water Connection No" value={data.waterConnNo} />
            <Row
              label="Water Connection Date"
              value={
                data.waterConnDate
                  ? new Date(data.waterConnDate).toLocaleDateString('en-GB')
                  : ''
              }
            />
          </View>
        </Section> */}
        <Section title="Extra Charges">
          <View style={styles.ownerCard}>
            {/* Mobile Tower */}
            <Row
              label="Have Mobile Tower?"
              value={
                data.isMobileTower === '1' || data.isMobileTower === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isMobileTower === '1' || data.isMobileTower === 1) && (
              <>
                <Row label="Tower Area" value={data.towerArea} />
                <Row
                  label="Installation Date"
                  value={
                    data.towerInstallationDate
                      ? new Date(data.towerInstallationDate).toLocaleDateString(
                          'en-GB',
                        )
                      : ''
                  }
                />
              </>
            )}

            {/* Hoarding Board */}
            <Row
              label="Have Hoarding Board(s)?"
              value={
                data.isHoardingBoard === '1' || data.isHoardingBoard === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isHoardingBoard === '1' || data.isHoardingBoard === 1) && (
              <>
                <Row label="Hoarding Area" value={data.hoardingArea} />
                <Row
                  label="Hoarding Installation Date"
                  value={
                    data.hoardingInstallationDate
                      ? new Date(
                          data.hoardingInstallationDate,
                        ).toLocaleDateString('en-GB')
                      : ''
                  }
                />
              </>
            )}

            {/* Petrol Pump */}
            <Row
              label="Have Petrol Pump?"
              value={
                data.isPetrolPump === '1' || data.isPetrolPump === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isPetrolPump === '1' || data.isPetrolPump === 1) && (
              <>
                <Row label="Pump Area" value={data.underGroundArea} />
                <Row
                  label="Pump Installation Date"
                  value={
                    data.petrolPumpCompletionDate
                      ? new Date(
                          data.petrolPumpCompletionDate,
                        ).toLocaleDateString('en-GB')
                      : ''
                  }
                />
              </>
            )}

            {/* Rainwater Harvesting */}
            <Row
              label="Have Rainwater Harvesting?"
              value={
                data.isWaterHarvesting === '1' || data.isWaterHarvesting === 1
                  ? 'Yes'
                  : 'No'
              }
            />
            {(data.isWaterHarvesting === '1' ||
              data.isWaterHarvesting === 1) && (
              <Row
                label="Completion Date"
                value={
                  data.waterHarvestingDate
                    ? new Date(data.waterHarvestingDate).toLocaleDateString(
                        'en-GB',
                      )
                    : ''
                }
              />
            )}
          </View>
        </Section>
        <Section title="Floor Details">
          {floorss.map((floor, index) => (
            <View key={index} style={styles.ownerCard}>
              <Text style={styles.sectionTitle}>Floor {index + 1}</Text>

              <Row label="Floor Name" value={floor.floorName} />
              <Row label="Usage Type" value={floor.usageType} />
              <Row label="Occupancy Type" value={floor.occupancyType} />
              <Row label="Construction Type" value={floor.constructionType} />
              <Row label="Built-Up Area" value={floor.builtUpArea} />
              <Row
                label="From Date"
                value={floor.fromDate ? floor.fromDate.replace('-', '/') : ''} // "2025/10"
              />
              <Row
                label="Upto Date"
                value={floor.uptoDate ? floor.uptoDate.replace('-', '/') : ''} // "2025/10"
              />
            </View>
          ))}
        </Section>

        {/* Image Section */}
        <Section title="Property Images">
          <View style={styles.imageContainer}>
            {data.geoTag && data.geoTag.length > 0 ? (
              data.geoTag.map((item, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Text style={styles.imageLabel}>
                    {item.direction.toUpperCase()}
                  </Text>
                  <Image
                    source={{ uri: item.document.uri }}
                    style={styles.propertyImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.geoText}>
                    Lat: {item.latitude.toFixed(4)}, Long:{' '}
                    {item.longitude.toFixed(4)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No images uploaded</Text>
            )}
          </View>
        </Section>
        <View style={{ margin: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.headignColor} />
          ) : (
            <>
              <Button title="Back" onPress={() => navigation.goBack()} />
              <View style={{ marginTop: 10, marginBottom: 60 }}>
                <Button
                  title="Submit Assessment"
                  onPress={handleSubmit}
                  color={Colors.headignColor}
                />
              </View>
            </>
          )}
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Copied!</Text>
              <Text style={styles.modalText}>SAF No: {copiedSafNo}</Text>
              <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageWrapper: {
    width: '30%', // Show two images side-by-side
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 5,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.headignColor,
  },
  propertyImage: {
    width: '100%',
    height: 100,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  geoText: {
    fontSize: 5,
    color: '#777',
    marginTop: 4,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    // marginBottom: 8,
    color: Colors.background,
    padding: 10,
    backgroundColor: Colors.headignColor,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    flex: 1,
    color: '#222',
    textAlign: 'right',
  },
  ownerCard: {
    padding: 15,
    marginBottom: 10,
    // borderRadius: 8,
    borderButtonRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android shadow
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15, // rounded corners
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Android shadow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#555',
  },
  okButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25, // pill-shaped button
    elevation: 2,
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AssessmentSummary;
