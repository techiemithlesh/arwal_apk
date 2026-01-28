import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import VerificationCard from '../../PropertyMenu/VerificationCard'; // Import your VerificationCard component
import HeaderNavigation from '../../Components/HeaderNavigation';
import { useWaterMasterData } from './BackendData/FieldVerificarionData';
import { Modal, TextInput } from 'react-native'; // already imported
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { fetchFieldVerificationData } from './BackendData/fetchFieldVerificationData';

const WaterSurvey = () => {
  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();

  console.log('🆔 Received ID:', id);
  const [fealureSize, setfealureSize] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState([]);

  const [selectedPipelineType, setSelectedPipelineType] = React.useState(null);
  const [selectedPipeDelimeter, setSelectedPipeDelimeter] =
    React.useState(null);
  const [selectedPipeQuality, setSelectedPipeQuality] = React.useState(null);
  const [selectedRoadType, setSelectedRoadType] = React.useState(null);

  // State for each verification card
  const [wardVerification, setWardVerification] = useState(null);
  const [wardDropdown, setWardDropdown] = useState('');

  const [propertyTypeVerification, setPropertyTypeVerification] =
    useState(null);
  const [propertyTypeDropdown, setPropertyTypeDropdown] = useState('');

  const [pipelineTypeVerification, setPipelineTypeVerification] =
    useState(null);
  const [pipelineTypeDropdown, setPipelineTypeDropdown] = useState('');

  const [connectionTypeVerification, setConnectionTypeVerification] =
    useState(null);
  const [connectionTypeDropdown, setConnectionTypeDropdown] = useState('');

  const [categoryVerification, setCategoryVerification] = useState(null);
  const [categoryDropdown, setCategoryDropdown] = useState('');

  const [areaVerification, setAreaVerification] = useState(null);
  const [areaInput, setAreaInput] = useState('');

  const [newWardVerification, setNewWardVerification] = useState(null);
  const [newWardDropdown, setNewWardDropdown] = useState(null);

  const [pinelineSizeVerification, setPinelineSizeVerification] =
    useState(null);
  const [pinelineSize, setPinelineSize] = useState('');

  const [data, setData] = useState(null);

  // dropdownData.js
  const permissibleFerruleSizes = [
    { label: '10 mm', value: '10' },
    { label: '20 mm', value: '20' },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchFieldVerificationData(id);
        setData(result?.data);
        console.log('Fetched Data:', result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#0891b2" />;

  const {
    roadTypeOptions,
    ownershipType,
    propertyTypeOptions,
    connectionType,
    categoryTypeOptions,
    pipelineTypeOptions,
    distributedPipelineTypeOptions, // ✅ Added
    permittedPipeDiameterOptions, // ✅ Added
    permittedPipeQualityOptions,
    connectionThrough,
    wardOptions,
    newWardOptions,
    loading,
    error,
    fetchNewWardByOldWard,
    fetchVarification,
  } = useWaterMasterData();
  useEffect(() => {
    if (id) {
      fetchVarification(id);
    }
    if (wardDropdown) {
      fetchNewWardByOldWard(wardDropdown);
    }
  }, [wardDropdown, id]);

  const handleSave = () => {
    // Handle save logic here
    console.log('Form saved');
  };
  const handleAddNewWard = () => {
    const payload = {
      wardNo: {
        selfAssessedValue: '29',
        verifiedValue:
          wardVerification === 'Correct'
            ? '29'
            : wardVerification === 'Incorrect'
            ? wardDropdown
            : null,
        status: wardVerification || 'Not Verified',
      },
      newWardNo: {
        selfAssessedValue: '',
        verifiedValue:
          newWardVerification === 'Correct'
            ? newWardDropdown
            : newWardVerification === 'Incorrect'
            ? newWardDropdown
            : null,
        status: newWardVerification || 'Not Verified',
      },
      propertyType: {
        selfAssessedValue: 'Residential',
        verifiedValue:
          propertyTypeVerification === 'Correct'
            ? 'Residential'
            : propertyTypeVerification === 'Incorrect'
            ? propertyTypeDropdown
            : null,
        status: propertyTypeVerification || 'Not Verified',
      },
      pipelineType: {
        selfAssessedValue: 'New Pipeline',
        verifiedValue:
          pipelineTypeVerification === 'Correct'
            ? 'New Pipeline'
            : pipelineTypeVerification === 'Incorrect'
            ? pipelineTypeDropdown
            : null,
        status: pipelineTypeVerification || 'Not Verified',
      },
      connectionType: {
        selfAssessedValue: 'New Connection',
        verifiedValue:
          connectionTypeVerification === 'Correct'
            ? 'New Connection'
            : connectionTypeVerification === 'Incorrect'
            ? connectionTypeDropdown
            : null,
        status: connectionTypeVerification || 'Not Verified',
      },
      category: {
        selfAssessedValue: 'APL',
        verifiedValue:
          categoryVerification === 'Correct'
            ? 'APL'
            : categoryVerification === 'Incorrect'
            ? categoryDropdown
            : null,
        status: categoryVerification || 'Not Verified',
      },
      area: {
        selfAssessedValue: '600',
        verifiedValue:
          areaVerification === 'Correct'
            ? '600'
            : areaVerification === 'Incorrect'
            ? areaInput
            : null,
        status: areaVerification || 'Not Verified',
      },
      pinelineSize: {
        selfAssessedValue: '6',
        verifiedValue:
          pinelineSizeVerification === 'Correct'
            ? '6'
            : pinelineSizeVerification === 'Incorrect'
            ? pinelineSize
            : null,
        status: pinelineSizeVerification || 'Not Verified',
      },
      pipelineDisturbationType: selectedPipelineType,
      pipeDelimeter: selectedPipeDelimeter,
      pipeQuality: selectedPipeQuality,
      roadType: selectedRoadType,
    };

    console.log('Final Payload:', payload);

    // Convert to modal table data
    const modalData = [
      {
        label: 'Ward No',
        self: payload.wardNo.selfAssessedValue,
        verified: payload.wardNo.verifiedValue,
        status: payload.wardNo.status,
      },
      {
        label: 'New Ward No',
        self: payload.newWardNo.selfAssessedValue || '-',
        verified: payload.newWardNo.verifiedValue,
        status: payload.newWardNo.status,
      },
      {
        label: 'Property Type',
        self: payload.propertyType.selfAssessedValue,
        verified: payload.propertyType.verifiedValue,
        status: payload.propertyType.status,
      },
      {
        label: 'Pipeline Type',
        self: payload.pipelineType.selfAssessedValue,
        verified: payload.pipelineType.verifiedValue,
        status: payload.pipelineType.status,
      },
      {
        label: 'Connection Type',
        self: payload.connectionType.selfAssessedValue,
        verified: payload.connectionType.verifiedValue,
        status: payload.connectionType.status,
      },
      {
        label: 'Category',
        self: payload.category.selfAssessedValue,
        verified: payload.category.verifiedValue,
        status: payload.category.status,
      },
      {
        label: 'Area (Sq ft)',
        self: payload.area.selfAssessedValue,
        verified: payload.area.verifiedValue,
        status: payload.area.status,
      },
      {
        label: 'Pipeline Size (MM)',
        self: payload.pinelineSize.selfAssessedValue,
        verified: payload.pinelineSize.verifiedValue,
        status: payload.pinelineSize.status,
      },
      {
        label: 'Pipeline Disturbation Type',
        self: '-',
        verified: payload.pipelineDisturbationType,
        status: payload.pipelineDisturbationType ? 'Selected' : '-',
      },
      {
        label: 'Pipe Delimeter',
        self: '-',
        verified: payload.pipeDelimeter,
        status: payload.pipeDelimeter ? 'Selected' : '-',
      },
      {
        label: 'Pipe Quality',
        self: '-',
        verified: payload.pipeQuality,
        status: payload.pipeQuality ? 'Selected' : '-',
      },
      {
        label: 'Road Type',
        self: '-',
        verified: payload.roadType,
        status: payload.roadType ? 'Selected' : '-',
      },
    ];

    setModalTitle('Form Submission Preview');
    setModalContent(modalData);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNavigation />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Application Info Bar */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {data?.applicationNo || 'Application No: N/A'}
          </Text>
          <Text style={styles.infoText}>Applied Date: 31-Jan-2025</Text>
        </View>
        {/* Ward No */}
        <VerificationCard
          label="Ward No."
          value={data?.wardNo || ''}
          dropdownOptions={wardOptions}
          selectedVerification={wardVerification}
          setSelectedVerification={setWardVerification}
          dropdownValue={wardDropdown}
          setDropdownValue={setWardDropdown}
        />
        <VerificationCard
          label="New No."
          value={data?.newWardNo}
          dropdownOptions={newWardOptions}
          selectedVerification={newWardVerification}
          setSelectedVerification={setNewWardVerification}
          dropdownValue={newWardDropdown}
          setDropdownValue={setNewWardDropdown}
          disabled={!wardDropdown}
        />
        {/* Property Type */}
        <VerificationCard
          label="Property Type"
          value={data?.propertyType}
          dropdownOptions={propertyTypeOptions}
          selectedVerification={propertyTypeVerification}
          setSelectedVerification={setPropertyTypeVerification}
          dropdownValue={propertyTypeDropdown}
          setDropdownValue={setPropertyTypeDropdown}
        />
        {/* Pipeline Type */}
        <VerificationCard
          label="Pipeline Type"
          value={data?.pipelineType}
          dropdownOptions={pipelineTypeOptions}
          selectedVerification={pipelineTypeVerification}
          setSelectedVerification={setPipelineTypeVerification}
          dropdownValue={pipelineTypeDropdown}
          setDropdownValue={setPipelineTypeDropdown}
        />
        {/* Connection Type */}
        <VerificationCard
          label="Connection Type"
          value={data?.connectionType}
          dropdownOptions={connectionType}
          selectedVerification={connectionTypeVerification}
          setSelectedVerification={setConnectionTypeVerification}
          dropdownValue={connectionTypeDropdown}
          setDropdownValue={setConnectionTypeDropdown}
        />
        {/* Category */}
        <VerificationCard
          label="Category"
          value={data?.category}
          dropdownOptions={categoryTypeOptions}
          selectedVerification={categoryVerification}
          setSelectedVerification={setCategoryVerification}
          dropdownValue={categoryDropdown}
          setDropdownValue={setCategoryDropdown}
        />
        {/* Area of Plot(in Sq ft) */}
        <VerificationCard
          label="Area of Plot(in Sq ft)"
          value={data?.propertyType}
          selectedVerification={areaVerification}
          setSelectedVerification={setAreaVerification}
          showInputOnIncorrect={true}
          inputValue={areaInput}
          setInputValue={setAreaInput}
          inputLabel="Enter Area (Sq ft):"
          inputPlaceholder="Enter area in square feet"
        />
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Disturbation Pipeline Size (in MM)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pipeline size"
            value={pinelineSize}
            onChangeText={setPinelineSize} // updates state as user types
            keyboardType="numeric" // only numeric input
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Permissible Ferule Size </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={permissibleFerruleSizes}
            labelField="label"
            valueField="value"
            placeholder="Select Ferrule Size"
            value={fealureSize}
            onChange={item => {
              setfealureSize(item.value); // update state with selected value
            }}
          />
        </View>

        <View>
          {/* Pipeline Disturbation Type */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Pipeline Disturbation Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={distributedPipelineTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Pipeline Type"
              value={selectedPipelineType}
              onChange={item => setSelectedPipelineType(item.value)}
            />
          </View>

          {/* Permissible Pipe Delimeter */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Permissible Pipe Delimeter</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={permittedPipeDiameterOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Pipe Delimeter"
              value={selectedPipeDelimeter}
              onChange={item => setSelectedPipeDelimeter(item.value)}
            />
          </View>

          {/* Permissible Pipe Quality */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Permissible Pipe Quality</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={permittedPipeQualityOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Pipe Quality"
              value={selectedPipeQuality}
              onChange={item => setSelectedPipeQuality(item.value)}
            />
          </View>

          {/* Road Type */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Road Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={roadTypeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Road Type"
              value={selectedRoadType}
              onChange={item => setSelectedRoadType(item.value)}
            />
          </View>
        </View>
        {/* Add New Ward Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              handleAddNewWard(); // call your existing function
              // show the modal
            }}
          >
            <Text style={styles.addButtonText}>Preview Data</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom spacing */}
        <View style={{ height: responsiveHeight(5) }} />
      </ScrollView>
      / Inside your component return (after ScrollView, or at the end)
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <ScrollView
              style={{ maxHeight: responsiveHeight(50), marginBottom: 10 }}
            >
              {/* Table Header */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000',
                }}
              >
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Field</Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>
                  Self Assessed
                </Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Verified</Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Status</Text>
              </View>

              {/* Table Rows */}
              {modalContent.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 6,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#ccc',
                  }}
                >
                  <Text style={{ flex: 1 }}>{item.label}</Text>
                  <Text style={{ flex: 1 }}>{item.self ?? '-'}</Text>
                  <Text style={{ flex: 1 }}>{item.verified ?? '-'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      color:
                        item.status === 'Correct'
                          ? 'green'
                          : item.status === 'Incorrect'
                          ? 'red'
                          : 'black',
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#0891b2' }]}
                onPress={() => {
                  console.log('Form Submitted:', modalContent);
                  setIsModalVisible(false);

                  // 👇 navigate to new page, e.g., "NextPage"
                  navigation.navigate('SubmitSurey', {
                    data: modalContent, // optional: pass data to next screen
                  });
                }}
              >
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: responsiveFontSize(1.6),
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  infoBar: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    margin: 15,
  },
  infoText: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  addButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(3),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    color: 'white',
    fontWeight: '500',
    fontSize: responsiveFontSize(1.8),
  },
});

export default WaterSurvey;
