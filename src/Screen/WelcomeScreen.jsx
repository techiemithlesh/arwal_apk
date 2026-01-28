import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import RMC_LOGO from '../assets/RMC_LOGO.png';
import Back_3 from '../assets/back_3.png';
import Back_6 from '../assets/back_6.png';

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={Back_3}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* TOP - LOGO */}
        <View style={styles.topSection}>
          {/* <Image source={RMC_LOGO} style={styles.logo} resizeMode="contain" /> */}
        </View>

        {/* CENTER - IMAGE */}
        <View style={styles.centerSection}>
          <Image
            source={Back_6}
            style={styles.centerImage}
            resizeMode="contain"
          />
        </View>

        {/* BOTTOM - WELCOME TEXT */}
        <View style={styles.footerSection}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Nagar Parishad Arwal</Text>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    // justifyContent: 'space-between', // <-- space between top, center, footer
    alignItems: 'center',
    paddingVertical: 50,
    marginTop: 200,
  },
  topSection: {
    alignItems: 'center',
  },
  centerSection: {
    alignItems: 'center',
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
  },
  centerImage: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 22,
    color: '#2354c5ff',
  },
  appName: {
    fontSize: 28,
    color: '#2354c5ff',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
