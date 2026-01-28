import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { getToken } from '../../../../utils/auth';
import { WATER_API_ROUTES } from '../../../../api/apiRoutes';
import axios from 'axios';

export const RemarksModal = ({
  visible,
  onClose,
  remarks,
  setRemarks,
  onSubmit,
  id,
}) => {
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (!remarks.trim()) {
      setError('Please enter remarks');
    }
  };

  const handleFocus = () => {
    setError('');
  };

  const handleSend = async () => {
    if (!remarks.trim()) {
      setError('Please enter remarks');
      return;
    }

    const payload = {
      id: id,
      remarks: remarks,
      status: 'FORWARD',
    };

    try {
      const token = await getToken();
      console.log('Sending payload:', payload);

      const response = await axios.post(
        WATER_API_ROUTES.WATER_REMARKS_API,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Remarks submitted:', response.data);

      setRemarks('');
      onClose();
      onSubmit();
    } catch (error) {
      console.error(
        '❌ Error submitting remarks:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to submit remarks');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Enter Remarks</Text>

          <TextInput
            style={[styles.textArea, error ? styles.inputError : null]}
            multiline
            numberOfLines={4}
            placeholder="Enter your remarks here..."
            value={remarks}
            onChangeText={text => {
              setRemarks(text);
              if (text.trim()) {
                setError('');
              }
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    height: 100,
    fontSize: 16,
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 6,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6c757d',
    borderRadius: 6,
  },
  cancelText: {
    color: 'white',
    fontWeight: '600',
  },
  sendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  sendText: {
    color: 'white',
    fontWeight: '600',
  },
});
