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
  BackHandler, // Added for hardware back button control
} from 'react-native';

import React, { useEffect, useState } from 'react';
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

import back_11 from '../assets/back_11.jpg';
import Arwal_logo from '../assets/Arwal_logo.png';
import { getToken } from '../utils/auth';
import { heartBeatApi } from '../api/apiRoutes';

const LoginScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selected, setSelected] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Add this at the top

  // 1. CONTROL HARDWARE BACK BUTTON
  // useEffect(() => {
  //   const backAction = () => {
  //     // If the user is on the Login screen, exit the app when back is pressed
  //     Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
  //       { text: 'Cancel', onPress: () => null, style: 'cancel' },
  //       { text: 'YES', onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true; // Prevents default back navigation
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  // 2. AUTO-LOGIN CHECK (Using Replace)
  useEffect(() => {
    const fetchTokenAndTest = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        try {
          const response = await axios.post(
            heartBeatApi,
            {},
            { headers: { Authorization: `Bearer ${savedToken}` } },
          );

          if (response?.data?.status && response?.data?.authenticated) {
            // Use REPLACE to clear the login screen from the history stack
            navigation.replace('DashBoard');
          }
        } catch (err) {
          console.log('Token validation failed:', err);
        }
      }
    };
    fetchTokenAndTest();
  }, []);

  const handleLogin1 = async () => {
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation logic
    if (selected === 'email') {
      if (!email || !emailRegex.test(email)) {
        showToast('error', 'Please enter a valid email!');
        return;
      }
    } else if (!userName) {
      showToast('error', 'Please enter your username!');
      return;
    }

    if (!password || password.length < 6) {
      showToast('error', 'Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    const loginPayload =
      selected === 'email'
        ? { email, password, type: 'mobile' }
        : { userName, password, type: 'mobile' };

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, loginPayload);

      if (response?.data?.data?.token) {
        const { token, userDetails } = response.data.data;
        const expiryTime = new Date().getTime() + 5 * 60 * 1000;
        // Change this:
        await AsyncStorage.setItem('token', JSON.stringify(token));

        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        await AsyncStorage.setItem('tokenExpiry', JSON.stringify(expiryTime));

        showToast('success', 'Login Successfully!');
        console.log('User Details:', userDetails);

        // 3. CLEAR STACK ON LOGIN
        // This ensures the user cannot "swipe back" or "back press" into login
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashBoard' }],
        });
      } else {
        showToast('error', 'Invalid Credentials');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };
  const handleLogin = async () => {
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Pre-validation
    if (selected === 'email') {
      if (!email || !emailRegex.test(email)) {
        showToast('error', 'Please enter a valid email!');
        return;
      }
    } else if (!userName) {
      showToast('error', 'Please enter your username!');
      return;
    }

    if (!password || password.length < 6) {
      showToast('error', 'Password must be at least 6 characters!');
      return;
    }

    setLoading(true); // Start loading

    const loginPayload =
      selected === 'email'
        ? { email, password, type: 'mobile' }
        : { userName, password, type: 'mobile' };

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, loginPayload);

      if (response?.data?.data?.token) {
        const { token, userDetails } = response.data.data;
        const expiryTime = new Date().getTime() + 5 * 60 * 1000;

        await AsyncStorage.setItem('token', JSON.stringify(token));
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
        await AsyncStorage.setItem('tokenExpiry', JSON.stringify(expiryTime));

        showToast('success', 'Login Successfully!');

        navigation.reset({
          index: 0,
          routes: [{ name: 'DashBoard' }],
        });
      } else {
        // This handles cases where the server returns 200 but no token
        showToast('error', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      // 2. Handle specific error messages from your backend
      const serverMessage = error.response?.data?.message;
      const fallbackMessage = 'The email or password you entered is incorrect.';

      // Check if it's a 401 (Unauthorized) or 404 (Not Found)
      if (error.response?.status === 401 || error.response?.status === 404) {
        showToast('error', fallbackMessage);
      } else {
        showToast(
          'error',
          serverMessage || 'Connection error. Please try again.',
        );
      }
      console.error(error)
      console.log('Login Error:', error.response?.data || error.message);
    } finally {
      // 3. STOP LOADING: This runs no matter if the try succeeded or the catch failed
      setLoading(false);
    }
  };
  return (
    <ImageBackground
      source={back_11}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.loginContainer}>
            <View style={styles.topSection}>
              <Image
                source={Arwal_logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.login}>Login</Text>

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

            <View style={styles.emailContainer}>
              <Text style={styles.inputLabel}>
                {selected === 'email' ? 'Email' : 'Username'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter your ${selected}`}
                placeholderTextColor="#666"
                value={selected === 'email' ? email : userName}
                onChangeText={selected === 'email' ? setEmail : setUserName}
                keyboardType={
                  selected === 'email' ? 'email-address' : 'default'
                }
              />
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={{ fontSize: 18 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.remfogpass}>
              <TouchableOpacity
                style={[styles.checkbox, checked && styles.checked]}
                onPress={() => setChecked(!checked)}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text>Remember Me</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emailContainer}>
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// ... Styles remain mostly the same ...
const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  login: {
    color: '#0551a2',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: responsiveFontSize(3),
  },
  loginContainer: {
    padding: 22,
    borderRadius: 10,
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(15),
  },
  emailuser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    height: responsiveHeight(6),
    borderColor: '#0551a2',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
    color: '#000',
  },
  inputLabel: { fontWeight: '600', color: '#333' },
  button: {
    backgroundColor: '#0551a2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  forgotText: { color: 'blue', marginLeft: responsiveWidth(10) },
  remfogpass: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: { backgroundColor: '#0551a2' },
  checkmark: { color: '#fff', fontSize: 14 },
  label: { fontSize: 16, color: '#000' },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0551a2',
    marginRight: 10,
  },
  selected: { backgroundColor: '#0551a2' },
  emailContainer: { marginTop: 10 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0551a2',
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    height: responsiveHeight(6),
  },
  passwordInput: { flex: 1, color: '#000' },
  topSection: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 120, height: 120 },
});

export default LoginScreen;
