import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

import React, { useState } from 'react';
import { showToast } from '../utils/toast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { BASE_URL } from '../config';
import Colors from '../Module/Constants/Colors';
// import back_1 from './assets/back_1.jpg';
import back_2 from '../assets/back_3.png';
import RMC_LOGO from '../assets/RMC_LOGO.png';

const LoginScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selected, setSelected] = useState('email'); // Default to 'email'
  const [showPassword, setShowPassword] = useState(false); // Show/hide password

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (selected === 'email') {
      if (!email) {
        showToast('error', 'Please enter your email!');
        return;
      }
      if (!emailRegex.test(email)) {
        showToast('error', 'Please enter a valid email address!');
        return;
      }
    }

    if (selected === 'username') {
      if (!userName) {
        showToast('error', 'Please enter your username!');
        return;
      }
      if (userName.length < 3) {
        showToast('error', 'Username must be at least 3 characters!');
        return;
      }
    }

    if (!password) {
      showToast('error', 'Please enter your password!');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters!');
      return;
    }

    const loginPayload =
      selected === 'email'
        ? { email, password, type: 'mobile' }
        : { userName, password, type: 'mobile' };

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, loginPayload);
      console.log('Login response:', response);

      if (response?.data?.data?.token) {
        const { token, userDetails } = response.data.data;
        const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
        await AsyncStorage.setItem('token', JSON.stringify(token));
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        await AsyncStorage.setItem('tokenExpiry', JSON.stringify(expiryTime)); // store expiry
        showToast('success', 'Login Successfully!');
        navigation.navigate('DashBoard');
      } else {
        showToast('error', 'Check email & password please!');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Incorrect credentials');
      } else {
        Alert.alert(
          'Login Failed',
          error.response?.data?.message || 'Something went wrong',
        );
      }
    }
  };

  return (
    <ImageBackground
      source={back_2}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.topSection}>
          <Image source={RMC_LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.loginContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Log in your account</Text>

            {/* Email / Username Selection */}
            <View style={styles.emailuser}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setSelected('email')}
              >
                <View
                  style={[
                    styles.circle,
                    selected === 'email' && styles.selected,
                  ]}
                />
                <Text style={styles.label}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionRow, { marginLeft: 30 }]}
                onPress={() => setSelected('username')}
              >
                <View
                  style={[
                    styles.circle,
                    selected === 'username' && styles.selected,
                  ]}
                />
                <Text style={styles.label}>Username</Text>
              </TouchableOpacity>
            </View>

            {/* Email or Username Input */}
            <View style={styles.emailContainer}>
              <TextInput
                style={styles.input}
                placeholder={selected === 'email' ? 'Email' : 'Username'}
                placeholderTextColor="#999"
                value={selected === 'email' ? email : userName}
                onChangeText={text =>
                  selected === 'email' ? setEmail(text) : setUserName(text)
                }
                keyboardType={
                  selected === 'email' ? 'email-address' : 'default'
                }
                autoCapitalize="none"
              />
            </View>

            {/* Password Field with Eye */}
            <View style={styles.emailContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={{ fontSize: 18 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me */}
            <View style={styles.remfogpass}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setChecked(!checked)}
              >
                <View style={[styles.checkbox, checked && styles.checked]}>
                  {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginContainer: {
    marginBottom: 2,
    backgroundColor: 'rgba(4, 35, 86, 0.95)',
    marginHorizontal: responsiveWidth(8),
    // marginVertical: responsiveHeight(10),
    padding: 40,
    borderRadius: 25,
    shadowColor: '#3f0202ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  topSection: {
    alignItems: 'center',
    // marginBottom: 15,
    marginTop: responsiveHeight(10),
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeText: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: responsiveFontSize(1.8),
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailuser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(247, 244, 242, 1)',
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#c96',
    borderColor: '#c96',
  },
  label: {
    fontSize: responsiveFontSize(1.9),
    color: '#ffffffff',
  },
  emailContainer: {
    marginBottom: 15,
  },
  input: {
    height: responsiveHeight(6),
    borderColor: '#ddd',
    borderWidth: 1.5,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    fontSize: responsiveFontSize(2),
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    height: responsiveHeight(6),
  },
  passwordInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  remfogpass: {
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#c96',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#c96',
    borderColor: '#c96',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: responsiveFontSize(1.8),
    color: '#fffefeff',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: 'rgba(12, 20, 94, 1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#01114dff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: responsiveFontSize(1.8),
    color: '#ffffffff',
  },
  registerLink: {
    fontSize: responsiveFontSize(1.8),
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: 'bold',
  },
});
