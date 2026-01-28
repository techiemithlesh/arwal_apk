import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../Module/Constants/Colors';
import LogoutButton from '../Components/LogoutButton';

const { width } = Dimensions.get('window');

const Sidebar = ({ children, menuItems, navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.75))[0]; // smoother animation

  const toggleSidebar = () => {
    const toValue = isOpen ? -width * 0.75 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleNavigate = screen => {
    toggleSidebar();
    if (navigation && screen) navigation.navigate(screen);
  };

  return (
    <>
      {/* 🍔 Hamburger Button */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={styles.hamburgerContainer}
      >
        <View style={[styles.line, isOpen && styles.line1Open]} />
        <View style={[styles.line, isOpen && styles.line2Open]} />
        <View style={[styles.line, isOpen && styles.line3Open]} />
      </TouchableOpacity>

      {/* 🌫 Overlay when sidebar is open */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* 📋 Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* 👤 Sidebar Header */}
        <View style={styles.sidebarHeader}>
          <View style={styles.profileContainer}>
            <Image
              source={require('../assets/back_6.png')} // optional placeholder
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.username}>Welcome</Text>
              <Text style={styles.email}>Muncipal </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleSidebar}>
            <Icon name="x" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 📦 Sidebar Menu */}
        <View style={styles.sidebarContent}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('DashBoard')}
          >
            <Icon name="home" size={22} color="#fff" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('ProfilePage')}
          >
            <Icon name="user" size={22} color="#fff" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="file-text" size={22} color="#fff" />
            <Text style={styles.menuText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="settings" size={22} color="#fff" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          {/* custom children menu (optional) */}
          {children}
        </View>

        <View style={styles.sidebarFooter}>
          {/* <TouchableOpacity style={styles.footerItem}>
         
            <Icon name="log-out" size={20} color={Colors.primary} />
            <Text
              style={styles.footerText}
              onPress={() => handleNavigate('Logout')}
            >
              Logout
            </Text>
          </TouchableOpacity> */}
          <LogoutButton />
          <Text style={styles.footerCopyright}>
            © 2025 Bihar Municipal Corporation
          </Text>
        </View>
      </Animated.View>
    </>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  // 🍔 Hamburger
  hamburgerContainer: {
    position: 'absolute',
    top: 55,
    left: 18,
    zIndex: 100,
    width: 30,
    height: 25,
    justifyContent: 'space-between',
  },
  line: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  line1Open: { transform: [{ rotate: '45deg' }, { translateY: 8 }] },
  line2Open: { opacity: 0 },
  line3Open: { transform: [{ rotate: '-45deg' }, { translateY: -8 }] },

  // 🌫 Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },

  // 📋 Sidebar Container
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  // 👤 Header
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 15,
  },

  // 📦 Menu Items
  sidebarContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    color: Colors.background,
    marginLeft: 12,
    fontWeight: '500',
  },

  // ⚙️ Footer
  sidebarFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primary,
  },
  footerCopyright: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
  },
});
