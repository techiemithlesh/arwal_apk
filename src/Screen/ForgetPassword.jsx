import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {
  FORGET_PASS_API,
  OTP_VERIFY_API,
  CHANGE_PASS_API,
} from '../api/apiRoutes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');

  const [changePassModalVisible, setChangePassModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: Send OTP
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Validation', 'Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(FORGET_PASS_API, {
        email,
        OtpType: 'Forgot Password',
      });

      if (response.data.status) {
        Alert.alert(
          'Success',
          response.data.message || 'OTP sent to your email.',
        );
        setOtpModalVisible(true); // open OTP modal
      } else {
        Alert.alert('Failed', response.data.message || 'Unable to send OTP.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Validation', 'Please enter OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(OTP_VERIFY_API, { email, otp });
      if (response.data.status) {
        Alert.alert('Success', 'OTP Verified!');
        setOtpModalVisible(false);
        setChangePassModalVisible(true); // open change password modal
      } else {
        Alert.alert('Failed', response.data.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(CHANGE_PASS_API, {
        email,
        newPassword,
      });
      if (response.data.status) {
        Alert.alert('Success', 'Password changed successfully!');
        setChangePassModalVisible(false);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert(
          'Failed',
          response.data.message || 'Unable to change password.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* OTP Modal */}
      <Modal transparent visible={otpModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              placeholder="OTP"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOtpModalVisible(false)}>
              <Text
                style={{ marginTop: 10, color: 'red', textAlign: 'center' }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal transparent visible={changePassModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter New Password</Text>
            <TextInput
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Change Password</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChangePassModalVisible(false)}>
              <Text
                style={{ marginTop: 10, color: 'red', textAlign: 'center' }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});
