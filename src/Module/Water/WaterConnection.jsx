import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import axios from 'axios';
import * as Print from 'expo-print'; // ✅ Import print module
import { SAF_API_ROUTES } from '../../api/apiRoutes';
import { getToken } from '../../utils/auth';

export const TCVerificationModal = ({ visible, onClose, id }) => {
  const [extraFloor, setExtraFloor] = useState([]);
  const [floorCom, setFloorCom] = useState([]);
  const [geoTag, setGeoTag] = useState([]);
  const [ownerDtl, setOwnerDtl] = useState([]);
  const [safComp, setSafComp] = useState([]);
  const [safDtl, setSafDtl] = useState(null);
  const [tcDtl, setTcDtl] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSafDetails = async () => {
      setLoading(true);
      try {
        const token = getToken();

        if (!token) {
          Alert.alert('Error', 'Authentication token not found.');
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.post(
          SAF_API_ROUTES.SAF_VARIFICATION_MODEL,
          { id },
          { headers },
        );

        const apiData = response.data?.data;

        if (apiData) {
          setExtraFloor(apiData.extraFloor || []);
          setFloorCom(apiData.floorCom || []);
          setGeoTag(apiData.getGeoTag || []);
          setOwnerDtl(apiData.ownerDtl || []);
          setSafComp(apiData.safComp || []);
          setSafDtl(apiData.safDtl || null);
          setTcDtl(apiData.tcDtl || null);
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to load property details. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSafDetails();
  }, [id]);

  const renderCheck = val => {
    if (val === true || val === 'Yes') return '✅';
    if (val === false || val === 'No') return '❌';
    return val || '-';
  };

  // ✅ Print Function
  const handlePrint = async () => {
    const htmlContent = `
      <html>
        <body>
          <h2 style="text-align:center;">Tax Collector Verification Details</h2>
          <h3>Basic Details</h3>
          <p><b>SAF No:</b> ${safDtl?.safNo || '-'}</p>
          <p><b>Applied Date:</b> ${safDtl?.applyDate || '-'}</p>
          <p><b>Application Type:</b> ${safDtl?.assessmentType || '-'}</p>
          <p><b>Ownership Type:</b> ${safDtl?.ownershipType || '-'}</p>

          <h3>Tax Collector</h3>
          <p><b>Name:</b> ${tcDtl?.userName || '-'}</p>
          <p><b>Verified By:</b> ${tcDtl?.verifiedBy || '-'}</p>
          <p><b>Date:</b> ${tcDtl?.verificationDate || '-'}</p>

          <h3>Owners</h3>
          <ul>
            ${ownerDtl
              .map(o => `<li>${o.ownerName} (${o.relationType})</li>`)
              .join('')}
          </ul>

          <h3>Extra Floors</h3>
          <p>${
            extraFloor.length > 0
              ? extraFloor.map(f => f.floorName).join(', ')
              : 'None'
          }</p>
        </body>
      </html>
    `;
    await Print.printAsync({ html: htmlContent });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close + Print Buttons */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
              <Text style={styles.printText}>🖨️ Print</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>
              Tax Collector Verification Details
            </Text>

            {/* existing UI content... */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '90%',
  },
  closeBtn: {
    marginBottom: 5,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  printBtn: {
    marginBottom: 5,
  },
  printText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
});
