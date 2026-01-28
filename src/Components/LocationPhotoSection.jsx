import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
// Added launchImageLibrary to the imports
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

const LocationPhotoSection = ({
  onDataCaptured,
  savedPhotos,
  savedLocation,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Internal Permission Helper
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          // Note: Android 13+ handles gallery permissions differently (READ_MEDIA_IMAGES),
          // but react-native-image-picker usually handles the system picker without explicit storage permission.
        ]);
        return (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const handleRequestLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera and Location permissions are required.',
      );
      return;
    }

    setLoadingLocation(true);
    try {
      if (Platform.OS === 'android') {
        await promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
      }

      Geolocation.getCurrentPosition(
        pos => {
          setLoadingLocation(false);
          onDataCaptured('location', pos.coords);
        },
        err => {
          setLoadingLocation(false);
          Alert.alert(
            'Location Error',
            'Unable to fetch coordinates. Ensure GPS is on.',
          );
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      setLoadingLocation(false);
    }
  };

  // Refactored capturePhoto to offer choice
  const capturePhoto = async side => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Image Source',
      'Choose how you want to upload the photo',
      [
        {
          text: '📷 Take Photo',
          onPress: () => openPicker('camera', side),
        },
        {
          text: '🖼️ Choose from Gallery',
          onPress: () => openPicker('gallery', side),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  // Logic for opening Camera or Gallery
  const openPicker = (type, side) => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1, // Ensures only one photo is picked
    };

    const method = type === 'camera' ? launchCamera : launchImageLibrary;

    method(options, res => {
      if (res.didCancel) {
        console.log('User cancelled');
      } else if (res.errorCode) {
        Alert.alert('Error', res.errorMessage);
      } else if (res.assets && res.assets.length > 0) {
        onDataCaptured(side, res.assets[0]);
      }
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Photo & Location Verification</Text>

      {!savedLocation ? (
        <TouchableOpacity style={styles.btn} onPress={handleRequestLocation}>
          {loadingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>📍 Get Current Location</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View>
          <View style={styles.coordsBox}>
            <Text style={styles.coordsText}>
              Lat: {savedLocation.latitude.toFixed(6)} | Lng:{' '}
              {savedLocation.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.grid}>
            {['left', 'right', 'front'].map(side => (
              <View key={side} style={styles.photoItem}>
                <Text style={styles.label}>{side.toUpperCase()}</Text>
                {savedPhotos[side] ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: savedPhotos[side].uri }}
                      style={styles.img}
                    />
                    <TouchableOpacity
                      onPress={() => onDataCaptured(side, null)}
                      style={styles.delBtn}
                    >
                      <Text style={styles.delText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.capBtn}
                    onPress={() => capturePhoto(side)}
                  >
                    <Text style={styles.capText}>📸 Upload</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// ... Styles remain the same
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  btn: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  coordsBox: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  coordsText: { fontSize: 13, color: '#333', fontWeight: '500' },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  photoItem: { width: '31%', alignItems: 'center' },
  photoWrapper: { width: '100%', height: 80, position: 'relative' },
  img: { width: '100%', height: 80, borderRadius: 8 },
  label: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  capBtn: {
    backgroundColor: '#380a0a',
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  capText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  delBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});

export default LocationPhotoSection;
