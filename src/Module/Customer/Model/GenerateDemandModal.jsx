import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getToken } from '../../../utils/auth';
import { CUSTOMER_API } from '../../../api/apiRoutes';
import axios from 'axios';

const GenerateDemandModal = ({ visible, onClose, connectionDetails, id }) => {
  const [state, setState] = useState({
    typeOfConnection: connectionDetails.connectionType,
    meterNo: connectionDetails.meterNo,
    connectionDate: connectionDetails.connectionDate,
    demandUptoDate: new Date(),
    currentMeterReading: '',
    meterPhoto: null,
    showDatePicker: false,
  });
  useEffect(() => {
    console.log('STATE UPDATED ✅', state);
  }, [state]);

  const handleInputChange = (field, value) => {
    setState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const capturePhoto = async () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.didCancel || !res.assets) return;
      const photo = res.assets[0];
      setState(prev => ({ ...prev, meterPhoto: { uri: photo.uri } }));
    });
  };

  const pickPhotoFromGallery = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.didCancel || !res.assets) return;
      const photo = res.assets[0];
      setState(prev => ({ ...prev, meterPhoto: { uri: photo.uri } }));
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setState(prev => ({ ...prev, showDatePicker: false }));
    if (selectedDate) {
      setState(prev => ({ ...prev, demandUptoDate: selectedDate }));
    }
  };

  const formatDate = date => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      if (!state.currentMeterReading || !state.meterPhoto) {
        Alert.alert(
          'Error',
          'Please enter meter reading and upload/capture the meter photo.',
        );
        return;
      }

      // Format current date as YYYY-MM-DD
      const currentDate = new Date().toISOString().split('T')[0];

      // Prepare FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('id', id);
      formData.append('lastReading', state.currentMeterReading);
      formData.append('currentDate', currentDate);
      formData.append('meterImg', {
        uri: state.meterPhoto.uri,
        name: 'meter.jpg',
        type: 'image/jpeg',
      });

      const apiResponse = await axios.post(
        CUSTOMER_API.CONSUMER_GENERATE_DEMAND_API,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('apiResponse', apiResponse);
      Alert.alert('Success', 'Demand generated successfully!');
      onClose();
    } catch (error) {
      console.error(
        'API Error:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert(
        'Error',
        'Failed to generate demand. Check console for details.',
      );
    }
  };

  const handleCancel = () => {
    setState(prev => ({ ...prev, meterPhoto: null }));
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Generate Demand</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Type of Connection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type of Connection</Text>
                <TextInput
                  style={styles.textInput}
                  value={state.typeOfConnection}
                  editable={false}
                />
              </View>

              {/* Meter No */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Meter No.</Text>
                <TextInput
                  style={styles.textInput}
                  value={state.meterNo}
                  editable={false}
                />
              </View>

              {/* Connection Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Connection Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={state.connectionDate}
                  editable={false}
                />
              </View>

              {/* Demand Upto Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.labelRequired}>
                  Demand Upto Date <Text style={styles.asterisk}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dateInputContainer}
                  onPress={() => handleInputChange('showDatePicker', true)}
                >
                  <TextInput
                    style={[styles.textInput, styles.dateInput]}
                    value={formatDate(state.demandUptoDate)}
                    editable={false}
                  />
                  <View style={styles.calendarIcon}>
                    <Text style={styles.calendarIconText}>📅</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Current Meter Reading */}
              <View style={styles.inputGroup}>
                <Text style={styles.labelRequired}>
                  Current Meter Reading <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={state.currentMeterReading}
                  onChangeText={value =>
                    handleInputChange('currentMeterReading', value)
                  }
                  placeholder="Enter Current Meter Reading"
                  keyboardType="numeric"
                />
              </View>

              {/* Meter Img */}
              <Text style={styles.labelRequired}>
                Upload / Capture Image <Text style={styles.asterisk}>*</Text>
              </Text>
              <View style={styles.photoContainer}>
                {state.meterPhoto ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: state.meterPhoto.uri }}
                      style={styles.photoImage}
                    />
                    <TouchableOpacity
                      style={styles.photoDeleteButton}
                      onPress={() => handleInputChange('meterPhoto', null)}
                    >
                      <Text style={styles.photoDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.photoOptions}>
                    <TouchableOpacity
                      style={styles.captureButton}
                      onPress={capturePhoto}
                    >
                      <Text style={styles.captureButtonText}>📷 Capture</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickPhotoFromGallery}
                    >
                      <Text style={styles.uploadButtonText}>🖼️ Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker */}
          {state.showDatePicker && (
            <DateTimePicker
              value={state.demandUptoDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default GenerateDemandModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    width: 350,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  labelRequired: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  asterisk: {
    color: '#e74c3c',
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderRadius: 8,
    backgroundColor: '#f8f9fc',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dateInput: {
    flex: 1,
    paddingRight: 45,
  },
  calendarIcon: {
    position: 'absolute',
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIconText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  captureButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  captureButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  photoWrapper: {
    position: 'relative',
  },
  photoImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  photoDeleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#dc3545',
    borderRadius: 15,
    padding: 5,
  },
  photoDeleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
