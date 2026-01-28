import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';

export const showToast = (type = 'success', title = '', message = '') => {
  Toast.show({
    type,          
    text1: title,
    text2: message,
    visibilityTime: 2500,
    position: 'top',
    topOffset: 60,
  });
};

export const showToastCenter = (type = 'success', title = '', message = '') => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 2500,
    position: 'top', // we keep 'top' but override style
    topOffset: 0,
    bottomOffset: 0,
    props: {}, // optional props if needed
    // Add custom style to center
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
    // override container style
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '50%',
    },
  });
};