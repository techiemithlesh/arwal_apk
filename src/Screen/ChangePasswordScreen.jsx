import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import HeaderNavigation from '../Components/HeaderNavigation';
import { showToast } from '../utils/toast';
import { getToken } from '../utils/auth';
import { changePassApi } from '../api/apiRoutes';
import axios from 'axios';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const validatePassword = password => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{6,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Error', 'New password and confirm password do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setShowPasswordHint(true);
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        showToast('Error', 'User not authenticated');
        return;
      }

      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
        conformPassword: confirmPassword, // ✅ typo fixed
      };

      console.log('Payload JSON:', JSON.stringify(payload, null, 2));

      const response = await axios.post(changePassApi, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Maseaf', response);
      if (response.data?.status === true) {
        showToast('success', 'Password updated successfully');

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(
          'error',
          response.data?.message || 'Current password does not match',
        );
      }

      setShowPasswordHint(false);
    } catch (error) {
      const message = error?.response?.data?.message;

      if (
        message?.toLowerCase().includes('current') ||
        message?.toLowerCase().includes('old')
      ) {
        showToast('error', 'Current password does not match');
      } else {
        showToast('error', message || 'Something went wrong');
      }
    }
  };

  return (
    <>
      <HeaderNavigation />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* 🔐 Password Rules Box */}

            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Password must contain:</Text>
              <Text style={styles.hintText}>• At least 6 characters</Text>
              <Text style={styles.hintText}>• One uppercase letter (A–Z)</Text>
              <Text style={styles.hintText}>• One lowercase letter (a–z)</Text>
              <Text style={styles.hintText}>• One number (0–9)</Text>
              <Text style={styles.hintText}>
                • One special character (!@#$)
              </Text>
            </View>

            <Text style={styles.title}>Update Password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password to keep your account secure
            </Text>

            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={secure}
              placeholder="Enter current password"
              placeholderTextColor="#d19a9a"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={secure}
              placeholder="Enter new password"
              placeholderTextColor="#d19a9a"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
                setShowPasswordHint(text.length > 0 && !validatePassword(text));
              }}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={secure}
              placeholder="Confirm new password"
              placeholderTextColor="#d19a9a"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[
                styles.button,
                !(currentPassword && newPassword && confirmPassword) &&
                  styles.disabled,
              ]}
              disabled={!(currentPassword && newPassword && confirmPassword)}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Text style={styles.toggleText}>
                {secure ? 'Show Passwords' : 'Hide Passwords'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  hintBox: {
    backgroundColor: '#EAF7FB',
    borderColor: '#70dbf3',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
    height: 100,
  },
  hintTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 6,
  },
  hintText: {
    fontSize: 8,
    color: '#333',
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#70dbf3',
    backgroundColor: '#a6dbe8',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 14,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
