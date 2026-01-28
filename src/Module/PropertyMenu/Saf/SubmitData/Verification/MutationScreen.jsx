import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../../Constants/Colors';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../../../api/apiRoutes'; // make sure this is your API route
import { getToken } from '../../../../../utils/auth';
import HeaderNavigation from '../../../../../Components/HeaderNavigation';
import MessageModal from '../../../../../utils/MessageModal';

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

const MutationScreen = ({ route, navigation }) => {
  const data = route.params?.data || {};
  const safData = route?.params?.safData || {};

  console.log('safData data in MutationScreen:', safData);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  function convertToYearMonth1(date) {
    const [month, year] = date.split('-');
    return `${year}-${month}`;
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    if (modalType === 'success') navigation.goBack();
  };
  const convertToYearMonth = dateStr => {
    if (!dateStr) return null;
    const parts = dateStr.includes('/')
      ? dateStr.split('/')
      : dateStr.split('-');
    if (parts.length === 2) {
      const [month, year] = parts; // if input is "MM/YYYY"
      return `${year}-${month.padStart(2, '0')}`;
    }
    if (parts.length === 3) {
      // if input is "YYYY-MM-DD"
      const [year, month] = parts;
      return `${year}-${month}`;
    }
    return dateStr;
  };
  const parseDate = str => {
    if (!str) return null;

    // If string includes 'T', assume ISO format
    if (str.includes('T')) {
      return new Date(str);
    }

    // If string is DD/MM/YYYY
    if (str.includes('/')) {
      const [day, month, year] = str.split('/');
      return new Date(`${year}-${month}-${day}`);
    }

    // If string is YYYY-MM-DD
    if (str.includes('-')) {
      return new Date(str);
    }

    return null; // fallback
  };

  function formatDate1(dob) {
    if (!dob) return '2019-02-14'; // fallback if empty
    const parts = dob.split('/'); // ["18", "09", "1901"]
    if (parts.length !== 3) return '2019-02-14'; // fallback for invalid format

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }

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

  return (
    <ScrollView style={styles.container}>
      <HeaderNavigation />
      {data.id && (
        <Section title="Assessment ID">
          <Row label="ID" value={data.id} />
        </Section>
      )}

      <Section title="Property Details">
        <Row label="Assessment Type" value="Mutation" />
        <Row label="Zone" value={safData.zone} />
        <Row label="Old Ward" value={safData.wardNo} />
        <Row label="New Ward" value={safData.newWardNo} />
        <Row label="Ownership Type" value={safData.ownershipType} />
        <Row label="Property Type" value={safData.propertyType} />
        <Row label="Road Width (ft)" value={data.roadWidth} />
      </Section>

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

      <Section title="Electricity Details">
        <Row label="KNO" value={data.kno} />
        <Row label="ACC No" value={data.accNo} />
        <Row label="BIND/BOOK No" value={data.bindBookNo} />
        <Row label="Electricity Category" value={data.electricityCategory} />
      </Section>

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

      {Array.isArray(data.floors) && data.floors.length > 0 && (
        <Section title="Floor Details">
          {data.floors.map((floor, index) => {
            console.log(floor, 'floor');
            return (
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
                  value={
                    floor.fromDate
                      ? parseDate(floor.fromDate).toLocaleDateString('en-GB')
                      : ''
                  }
                />

                <Row
                  label="Upto Date"
                  value={
                    floor.uptoDate
                      ? parseDate(floor.uptoDate).toLocaleDateString('en-GB')
                      : ''
                  }
                />
              </View>
            );
          })}
        </Section>
      )}

      <View style={{ margin: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.headignColor} />
        ) : (
          <>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <View style={{ marginTop: 10, marginBottom: 80 }}>
              <Button
                title="Submit Assessment"
                onPress={handleSubmit}
                color={Colors.headignColor}
              />
            </View>
          </>
        )}
      </View>
      <MessageModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 8,
    color: '#ffffffff',
    padding: 10,
    backgroundColor: Colors.headignColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
});

export default MutationScreen;
