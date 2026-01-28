import React from 'react';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { WATER_API_ROUTES } from '../../../api/apiRoutes';
import { getToken } from '../../../utils/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import HeaderNavigation from '../../../Components/HeaderNavigation';

const SubmitSurey = () => {
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const route = useRoute();
  const { data } = route.params || {}; // data passed from previous screen
  const { modalData } = route.params || {}; // data passed from previous screen
  console.log('Received data:', data);

  // const handleForward = async () => {
  //   await sendNextStatus('FORWARD'); // or 'F' if backend expects 'F'
  // };

  const handleBackward = async () => {
    await sendNextStatus('BACKWARD'); // backward status
  };

  const handleForward = async status => {
    try {
      const token = await getToken();
      // console.log('Sending forward with remarks:', token);
      const payload = {
        id: data?.id?.id ?? data?.id,
        remarks: remarks || '',
        status: 'FORWARD',
      };
      console.log('Sending forward with remarks:', payload);

      const response = await axios.post(WATER_API_ROUTES.POST_NEXT, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      Toast.show({
        type: 'success',
        text1: '✅ Success',
        text2: response.data?.message || 'Forwarded successfully',
        position: 'center', // shows in middle of screen
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        text1Style: { fontSize: 22, fontWeight: 'bold' },
        text2Style: { fontSize: 18 },
      });
      setIsModalVisible(false);
      setTimeout(() => {
        navigation.navigate('WaterInbox');
      }, 1000);
    } catch (error) {
      console.log('Response data:', error.response?.data);

      Alert.alert(
        'Error',
        `Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  const handleSubmit = async data => {
    const token = await getToken();

    if (!data?.id) return null;

    const getValue = field =>
      field?.verifiedValue?.id ?? field?.selfAssessedValue?.id ?? null;
    const getLabel = field =>
      field?.verifiedValue?.label ?? field?.selfAssessedValue?.label ?? null;

    const payload = {
      gateValve: data?.camberValue ?? '',
      waterLockArng: data?.waterMeterChamber ?? '',
      applicationId: data?.id?.id ?? data?.id,
      areaSqft: getValue(data?.area),
      category: getValue(data?.category),
      // connectionThroughId: getValue(data?.connectionThrough),
      connectionThroughId: data?.connectionThroughId,

      connectionTypeId: getValue(data?.connectionType),
      distributedPipelineSize: getLabel(data?.pinelineSize),
      distributedPipelineType:
        data?.pipelineDisturbationType?.verifiedValue?.id ??
        data?.pipelineDisturbationType?.id ??
        null,
      ferruleTypeId:
        data?.fealureSize?.verifiedValue?.id ?? data?.fealureSize?.id ?? null,
      permittedPipeDiameter:
        data?.pipeDelimeter?.verifiedValue?.label ??
        data?.pipeDelimeter?.label ??
        null,
      permittedPipeQuality:
        data?.pipeQuality?.verifiedValue?.id ?? data?.pipeQuality?.id ?? null,
      pipelineTypeId: getValue(data?.pipelineType),
      propertyTypeId: getValue(data?.propertyType),
      roadType: data?.roadType?.verifiedValue?.id ?? data?.roadType?.id ?? null,
      tsMapId: data?.tsMap?.verifiedValue?.id ?? data?.tsMap?.id ?? null,
      wardMstrId: getValue(data?.wardNo),
      newWardMstrId: getValue(data?.newWardNo),
    };
    console.log('Constructed payload:', payload);

    try {
      const response = await axios.post(
        WATER_API_ROUTES.CONSUMER_FIELD_VERIFICATION_API,
        payload, // ✅ Correct payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status) {
        console.log('Verification Data:', response.data);
        setIsModalVisible(true);
        return response.data;
      } else {
        console.warn('API did not return success:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Water Connection Survey Summary</Text>

        {modalData && modalData.length > 0 ? (
          <View style={styles.tableContainer}>
            {/* Header Row */}
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
                Label
              </Text>
              <Text style={[styles.cell, styles.headerCell]}>Self</Text>
              <Text style={[styles.cell, styles.headerCell]}>Verified</Text>
              <Text style={[styles.cell, styles.headerCell]}>Status</Text>
            </View>

            {/* Data Rows */}
            {modalData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff' },
                ]}
              >
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.label || '-'}
                </Text>
                <Text style={styles.cell}>{item.self || '-'}</Text>
                <Text style={styles.cell}>{item.verified || '-'}</Text>
                <Text
                  style={[
                    styles.cell,
                    {
                      color:
                        item.status === 'Correct'
                          ? 'green'
                          : item.status === 'Not Verified'
                          ? 'red'
                          : '#f59e0b',
                      fontWeight: '600',
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>No survey data available.</Text>
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit(data)}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Remarks</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your remarks..."
              value={remarks}
              onChangeText={setRemarks}
              multiline
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                onPress={handleBackward}
              >
                <Text style={styles.buttonText}>Backward</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#22c55e' }]}
                onPress={handleForward}
              >
                <Text style={styles.buttonText}>Forward</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubmitSurey;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerRow: {
    backgroundColor: '#0891b2',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#1e293b',
  },
  headerCell: {
    color: 'white',
    fontWeight: '700',
  },
  noData: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 50,

    backgroundColor: '#0891b2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0891b2',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#555',
  },
});
