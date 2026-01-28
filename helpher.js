// import { PermissionsAndroid } from 'react-native';

// const requestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       {
//         title: 'Storage Permission',
//         message: 'App needs access to storage to download PDF',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );

//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };
// export { requestStoragePermission };

import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
  // iOS
  if (Platform.OS !== 'android') return true;

  // Android 13+ (API 33+) — NO permission required
  if (Platform.Version >= 33) {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'Allow storage access to download receipt PDF',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};
//  export { requestStoragePermission };