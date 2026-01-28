import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../../api/apiRoutes';
import { getToken } from '../../../../utils/auth';
import MessageModal from '../../../../utils/MessageModal';

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

const RessesmentSummry = ({ route, navigation }) => {
  const data = route.params?.data || {};
  const safData = route?.params?.safData || {};
  console.log('Ressesment Summary Data:', data);

  const [loading, setLoading] = useState(false);
  const [safId, setSafId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  const handleCloseModal = id => {
    setModalVisible(false);
    if (id) {
      navigation.navigate('SafDueDetails', { id });
    } else {
      console.warn('SAF ID is missing. Navigation cancelled.');
    }
  };

  const formatDate1 = dob => {
    if (!dob) return '2019-02-14';
    const parts = dob.split('/');
    if (parts.length !== 3) return '2019-02-14';

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${year}-${month}-${day}`;
  };

  const convertToYearMonth = dateStr => {
    if (!dateStr) return null;
    const parts = dateStr.includes('/')
      ? dateStr.split('/')
      : dateStr.split('-');
    if (parts.length === 2) {
      const [month, year] = parts;
      return `${year}-${month.padStart(2, '0')}`;
    }
    if (parts.length === 3) {
      const [year, month] = parts;
      return `${year}-${month}`;
    }
    return dateStr;
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const token = await getToken();

  //     const payload = {
  //       geoTag: data?.geoTag || [],
  //       waterConnectionFacilityTypeId: data?.waterConnectionFacility,
  //       waterTaxTypeId: data?.waterTaxType,
  //       roadTypeMstrId: data.roadWidth || '',
  //       assessmentType: 'Reassessment',
  //       appartmentDetailsId: data?.appartmentDetailsId || '',
  //       previousHoldingId: data.holdingId,
  //       zoneMstrId: data.zoneId || 1,
  //       wardMstrId: Number(data.oldWard || 1),
  //       ownershipTypeMstrId: data.ownershipTypeId || data.ownershipType || 1,
  //       propTypeMstrId: data.propertyTypeId || data.propertyType || 1,
  //       flatRegistryDate: '',
  //       roadWidth: String(data.roadWidth || ''),
  //       khataNo: data.khataNo || '',
  //       plotNo: data.plotNo || '',
  //       builtupArea: String(data.builtUpArea || ''),
  //       villageMaujaName: data.villageName || '',
  //       areaOfPlot: String(data.plotArea || ''),
  //       propAddress: data.propertyAddress || '',
  //       propCity: data.city || '',
  //       propDist: data.district || '',
  //       propPinCode: data.pincode || '',
  //       propState: data.state || '',
  //       isMobileTower: data.mobileTower === 'yes' ? 1 : 0,
  //       towerArea:
  //         data.mobileTower === 'yes' ? parseInt(data.towerArea || '') : '',
  //       towerInstallationDate:
  //         data.mobileTower === 'yes' ? formatDate1(data.installationDate) : '',
  //       isHoardingBoard: data.hoarding === 'yes' ? 1 : 0,
  //       hoardingArea:
  //         data.hoarding === 'yes' ? String(data.hoardingArea || '') : '',
  //       hoardingInstallationDate:
  //         data.hoarding === 'yes'
  //           ? formatDate1(data.hoardingInstallationDate)
  //           : '',
  //       isPetrolPump: data.petrolPump === 'yes' ? 1 : 0,
  //       underGroundArea:
  //         data.petrolPump === 'yes' ? String(data.pumpArea || '') : '',
  //       petrolPumpCompletionDate:
  //         data.petrolPump === 'yes'
  //           ? formatDate1(data.pumpInstallationDate)
  //           : '',
  //       landOccupationDate: '',
  //       isWaterHarvesting: data.rainHarvesting === 'yes' ? 1 : 0,
  //       waterHarvestingDate:
  //         data.rainHarvesting === 'yes'
  //           ? formatDate1(data.waterHarvestingDate)
  //           : '2020-04-10',
  //       ownerDtl: [
  //         {
  //           email: '',
  //           guardianName: '',
  //           ownerName: data.ownerName || '',
  //           mobileNo: data.mobile || '',
  //           gender:
  //             data.gender === 'male'
  //               ? 'Male'
  //               : data.gender === 'female'
  //               ? 'Female'
  //               : 'Male',
  //           dob: formatDate1(data.dob) || '',
  //           isArmedForce: data.armedForces === 'yes' ? 1 : 0,
  //           isSpeciallyAbled: data.speciallyAbled === 'yes' ? 1 : 0,
  //         },
  //       ],
  //       floorDtl:
  //         data.floors && data.floors.length > 0
  //           ? data.floors.map(floor => ({
  //               builtupArea: String(floor.builtUpArea || ''),
  //               dateFrom: floor.fromDate ? floor.fromDate : '',
  //               dateUpto: floor.uptoDate
  //                 ? convertToYearMonth(floor.uptoDate.replace('/', '-'))
  //                 : '',
  //               floorMasterId: String(floor.floorName || ''), // floorName instead of floorNameId
  //               usageTypeMasterId: String(floor.usageType || ''), // usageType instead of usageTypeId
  //               constructionTypeMasterId: floor.constructionType || '',
  //               occupancyTypeMasterId: floor.occupancyType || '',
  //             }))
  //           : [],
  //     };
  //     console.log(JSON.stringify(payload));

  //     // Log as a pretty-printed string (with indentation)
  //     console.log(JSON.stringify(payload, null, 2));
  //     const response = await axios.post(
  //       SAF_API_ROUTES.APPLY_SAF_RESSESMENT_API,
  //       payload,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     );
  //     console.log('Response:', response.data);

  //     setLoading(false);
  //     const safIdValue = response?.data?.data?.safId;
  //     setSafId(safIdValue);

  //     if (response.data.success) {
  //       setModalType('success');
  //       setModalMessage('Reassessment submitted successfully');
  //       setModalVisible(true);
  //     } else {
  //       setModalType('error');
  //       setModalMessage(response.data.message || 'Something went wrong');
  //       setModalVisible(true);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setModalType('error');
  //     setModalMessage('Something went wrong');
  //     setModalVisible(true);
  //     console.error(error);
  //   }
  // };
  const handleSubmit1 = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();

      // 1. Add all simple fields
      Object.keys(data).forEach(key => {
        if (key !== 'geoTag' && key !== 'floors' && key !== 'ownerDtl') {
          formData.append(key, String(data[key] || ''));
        }
      });

      // 2. Add Images (The Fix)
      data.geoTag.forEach((item, index) => {
        formData.append(`geoTag[${index}][document]`, {
          uri: item.document.uri,
          name: `photo_${index}.jpg`,
          type: 'image/jpeg',
        });
        formData.append(`geoTag[${index}][direction]`, item.direction);
      });

      // 3. Add Arrays
      formData.append('ownerDtl', JSON.stringify(payload.ownerDtl));
      formData.append('floorDtl', JSON.stringify(payload.floorDtl));

      const response = await axios.post(
        SAF_API_ROUTES.APPLY_SAF_RESSESMENT_API,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Response:', response.data);
      if (response.data.success) {
        setModalType('success');
        setModalMessage('Submitted Successfully');
      }
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Check your connection or file size');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();

      // 1. Create the structured data exactly as per your commented payload
      // This ensures logic like "yes" -> 1 and date formatting is correct.
      const payload = {
        waterConnectionFacilityTypeId: data?.waterConnectionFacility || '',
        waterTaxTypeId: data?.waterTaxType || '',
        roadTypeMstrId: data.roadWidth || '',
        assessmentType: 'Reassessment',
        appartmentDetailsId: data?.appartmentDetailsId || '',
        previousHoldingId: data.holdingId || '',
        zoneMstrId: data.zoneId || 1,
        wardMstrId: Number(data.oldWard || 1),
        ownershipTypeMstrId: data.ownershipTypeId || data.ownershipType || 1,
        propTypeMstrId: data.propertyTypeId || data.propertyType || 1,
        flatRegistryDate: '',
        roadWidth: String(data.roadWidth || ''),
        khataNo: data.khataNo || '',
        plotNo: data.plotNo || '',
        builtupArea: String(data.builtUpArea || ''),
        villageMaujaName: data.villageName || '',
        areaOfPlot: String(data.plotArea || ''),
        propAddress: data.propertyAddress || '',
        propCity: data.city || '',
        propDist: data.district || '',
        propPinCode: data.pincode || '',
        propState: data.state || '',
        isMobileTower: data.mobileTower === 'yes' ? 1 : 0,
        towerArea:
          data.mobileTower === 'yes' ? parseInt(data.towerArea || 0) : '',
        towerInstallationDate:
          data.mobileTower === 'yes' ? formatDate1(data.installationDate) : '',
        isHoardingBoard: data.hoarding === 'yes' ? 1 : 0,
        hoardingArea:
          data.hoarding === 'yes' ? String(data.hoardingArea || '') : '',
        hoardingInstallationDate:
          data.hoarding === 'yes'
            ? formatDate1(data.hoardingInstallationDate)
            : '',
        isPetrolPump: data.petrolPump === 'yes' ? 1 : 0,
        underGroundArea:
          data.petrolPump === 'yes' ? String(data.pumpArea || '') : '',
        petrolPumpCompletionDate:
          data.petrolPump === 'yes'
            ? formatDate1(data.pumpInstallationDate)
            : '',
        landOccupationDate: '',
        isWaterHarvesting: data.rainHarvesting === 'yes' ? 1 : 0,
        waterHarvestingDate:
          data.rainHarvesting === 'yes'
            ? formatDate1(data.waterHarvestingDate)
            : '2020-04-10',
      };

      // 2. Append top-level payload items to FormData
      Object.keys(payload).forEach(key => {
        formData.append(key, String(payload[key]));
      });

      // 3. Append Owner Details (Array of Objects)
      // Most backends require indexing for multipart arrays: ownerDtl[0][name]
      const ownerDtl = {
        email: data.email || '',
        guardianName: data.guardianName || '',
        ownerName: data.ownerName || '',
        mobileNo: data.mobile || '',
        gender: data.gender === 'male' ? 'Male' : 'Female',
        dob: formatDate1(data.dob) || '',
        isArmedForce: data.armedForces === 'yes' ? 1 : 0,
        isSpeciallyAbled: data.speciallyAbled === 'yes' ? 1 : 0,
        relationType: data.relation || '',
      };

      Object.keys(ownerDtl).forEach(key => {
        formData.append(`ownerDtl[0][${key}]`, ownerDtl[key]);
      });
      console.log('Owner Details appended to FormData', ownerDtl);
      // 4. Append Floor Details (Loop through floors)
      if (data.floors && data.floors.length > 0) {
        data.floors.forEach((floor, index) => {
          const floorObj = {
            builtupArea: String(floor.builtUpArea || ''),
            dateFrom: floor.fromDate || '',
            dateUpto: floor.uptoDate
              ? convertToYearMonth(floor.uptoDate.replace('/', '-'))
              : '',
            floorMasterId: String(floor.floorName || ''),
            usageTypeMasterId: String(floor.usageType || ''),
            constructionTypeMasterId: floor.constructionType || '',
            occupancyTypeMasterId: floor.occupancyType || '',
          };
          Object.keys(floorObj).forEach(key => {
            formData.append(`floorDtl[${index}][${key}]`, floorObj[key]);
          });
        });
      }

      // 5. Append Images (GeoTags)
      if (data.geoTag && Array.isArray(data.geoTag)) {
        data.geoTag.forEach((item, index) => {
          if (item.document?.uri) {
            formData.append(`geoTag[${index}][document]`, {
              uri: item.document.uri,
              name: `photo_${index}.jpg`,
              type: 'image/jpeg',
            });
            formData.append(
              `geoTag[${index}][direction]`,
              item.direction || '',
            );
          }
        });
      }

      // 6. Submit
      const response = await axios.post(
        SAF_API_ROUTES.APPLY_SAF_RESSESMENT_API,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Submission Successful:', response.data);

      if (response.data.success) {
        setSafId(response?.data?.data?.safId);
        setModalType('success');
        setModalMessage('Reassessment submitted successfully');
      } else {
        setModalType('error');
        setModalMessage(response.data.message || 'Something went wrong');
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error);
      setModalType('error');
      setModalMessage(
        error.response?.data?.message || 'Failed to submit assessment',
      );
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Assessment Section */}
      {data.id && (
        <Section title="Assessment ID">
          <Row label="ID" value={data.id} />
        </Section>
      )}

      {/* Property Details */}
      <Section title="Property Details">
        <Row label="Assessment Type" value="Ressesment" />
        <Row label="Zone" value={safData.zone} />
        <Row label="Old Ward" value={safData.wardNo} />
        <Row label="New Ward" value={safData.newWardNo} />
        <Row label="Ownership Type" value={safData.ownershipType} />
        <Row label="Property Type" value={safData.propertyType} />
        <Row label="Road Width (ft)" value={data.roadWidth} />
      </Section>

      {/* Property Address */}
      <Section title="Property Address">
        <Row label="Property Address" value={data.propertyAddress} />
        <Row label="City" value={data.city} />
        <Row label="District" value={data.district} />
        <Row label="State" value={data.state} />
        <Row label="Pincode" value={data.pincode} />
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
      </Section>

      {/* Owner Details */}
      <Section title="Owner Details">
        <Row label="Owner Name" value={data.ownerName} />
        <Row label="Guardian Name" value={data.guardianName} />
        <Row label="Gender" value={data.gender} />
        <Row label="DOB" value={data.dob} />
        <Row label="Mobile No." value={data.mobile} />
        <Row label="Email" value={data.email} />
        <Row label="Relation" value={data.relation} />
        <Row label="Aadhaar No." value={data.aadhaar} />
        <Row label="PAN No." value={data.pan} />
        <Row label="Is Armed Force?" value={data.armedForces} />
        <Row label="Is Specially Abled?" value={data.speciallyAbled} />
      </Section>

      {/* Electricity Details */}
      <Section title="Electricity Details">
        <Row label="KNO" value={data.kno} />
        <Row label="ACC No" value={data.accNo} />
        <Row label="BIND/BOOK No" value={data.bindBookNo} />
        <Row label="Electricity Category" value={data.electricityCategory} />
      </Section>

      {/* Water Connection Details */}
      <Section title="Water Connection Details">
        <Row label="Water Connection No" value={data.waterConnectionNo} />
        <Row
          label="Water Connection Date"
          value={
            data.waterConnectionDate
              ? new Date(data.waterConnectionDate).toLocaleDateString('en-GB')
              : ''
          }
        />
      </Section>

      {/* Extra Charges */}
      <Section title="Extra Charges">
        <Row label="Have Mobile Tower?" value={data.mobileTower} />
        {data.mobileTower === 'yes' && (
          <>
            <Row label="Tower Area" value={data.towerArea} />
            <Row
              label="Installation Date"
              value={
                data.installationDate
                  ? new Date(data.installationDate).toLocaleDateString('en-GB')
                  : ''
              }
            />
          </>
        )}
        <Row label="Have Hoarding Board(s)?" value={data.hoarding} />
        {data.hoarding === 'yes' && (
          <>
            <Row label="Hoarding Area" value={data.hoardingArea} />
            <Row
              label="Hoarding Installation Date"
              value={
                data.hoardingInstallationDate
                  ? new Date(data.hoardingInstallationDate).toLocaleDateString(
                      'en-GB',
                    )
                  : ''
              }
            />
          </>
        )}
        <Row label="Have Petrol Pump?" value={data.petrolPump} />
        {data.petrolPump === 'yes' && (
          <>
            <Row label="Pump Area" value={data.pumpArea} />
            <Row
              label="Pump Installation Date"
              value={
                data.pumpInstallationDate
                  ? new Date(data.pumpInstallationDate).toLocaleDateString(
                      'en-GB',
                    )
                  : ''
              }
            />
          </>
        )}
        <Row label="Have Rainwater Harvesting?" value={data.rainHarvesting} />
        {data.rainHarvesting === 'yes' && (
          <Row
            label="Completion Date"
            value={
              data.completionDate
                ? new Date(data.completionDate).toLocaleDateString('en-GB')
                : ''
            }
          />
        )}
      </Section>

      {/* Floor Details */}
      {Array.isArray(data.floors) && data.floors.length > 0 && (
        <Section title="Floor Details">
          {data.floors.map((floor, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                Floor {index + 1}
              </Text>
              <Row label="Floor Name" value={floor.floorName} />
              <Row label="Usage Type" value={floor.usageType} />
              <Row label="Occupancy Type" value={floor.occupancyType} />
              <Row label="Construction Type" value={floor.constructionType} />
              <Row label="Built-Up Area" value={floor.builtUpArea} />
              <Row
                label="From Date"
                value={convertToYearMonth(floor.fromDate)}
              />
              <Row
                label="Upto Date"
                value={convertToYearMonth(floor.uptoDate)}
              />
            </View>
          ))}
        </Section>
      )}

      {/* Submit Buttons */}
      <View style={{ margin: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.headignColor} />
        ) : (
          <>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <View style={{ marginTop: 10, marginBottom: 50 }}>
              <Button
                title="Submit Assessment"
                onPress={handleSubmit}
                color={Colors.headignColor}
              />
            </View>
          </>
        )}
      </View>

      {/* Message Modal */}
      <MessageModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => handleCloseModal(safId)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
    padding: 10,
    backgroundColor: Colors.headignColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { fontWeight: '600', color: '#555', flex: 1 },
  value: { flex: 1, color: '#222', textAlign: 'right' },
});

export default RessesmentSummry;
