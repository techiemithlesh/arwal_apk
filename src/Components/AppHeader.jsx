import { StyleSheet, Text, View } from 'react-native';
import {statusColor} from "../utils/common";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AppHeader = ({ applicationNo, status }) => {
  const statusColor = statusColor(status);
  return (

    <View style={styles.bannerContainer}>
        {applicationNo &&(
        <View style={styles.infoSection}>
            <MaterialIcons name="info" size={24} color="#007AFF" style={{ marginRight: 10 }} />
            <Text style={styles.text}>
            Your applied application no. is: 
            <Text style={styles.applicationNoText}>
                {applicationNo} 
            </Text>
            <MaterialIcons name="content-copy" size={14} color="#007AFF" /> 
            {' You can use this for future reference.'}
            </Text>
        </View>
        )}

      {status &&(
        <View style={[styles.statusBox, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
            Current Status: {status}
            </Text>
        </View>
      )}
    </View>
  );
};

export default AppHeader;
const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6f7ff', // Light blue background for the entire bar
    borderRadius: 8,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1, // Allows text to wrap
  },
  applicationNoText: {
    fontWeight: 'bold',
    color: '#FF4500', // Orange-red for emphasis
    fontSize: 14,
  },
  statusBox: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: '#fff',
    minWidth: 150, // Ensure box has minimum width
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});