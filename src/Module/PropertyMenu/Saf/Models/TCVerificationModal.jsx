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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SAF_API_ROUTES } from '../../../../api/apiRoutes';
import Colors from '../../../Constants/Colors';

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
        const storedToken = await AsyncStorage.getItem('token');
        const token = storedToken ? JSON.parse(storedToken) : null;

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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>
              Tax Collector Verification Details
            </Text>

            {/* SAF Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              <Text>SAF No: {safDtl?.safNo}</Text>
              <Text>Applied Date: {safDtl?.applyDate}</Text>
              <Text>Application Type: {safDtl?.assessmentType}</Text>
              <Text>Ownership Type: {safDtl?.ownershipType}</Text>
            </View>

            {/* TC Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tax Collector</Text>
              <Text>Name: {tcDtl?.userName}</Text>
              <Text>Verified By: {tcDtl?.verifiedBy}</Text>
              <Text>Date of Verification: {tcDtl?.verificationDate}</Text>
            </View>

            {/* Owner Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Owner(s)</Text>
              <View style={styles.tableRowHeader}>
                <Text style={styles.cell}>#</Text>
                <Text style={styles.cell}>Name</Text>
                <Text style={styles.cell}>Guardian</Text>
                <Text style={styles.cell}>Relation</Text>
                <Text style={styles.cell}>Mobile</Text>
              </View>
              {ownerDtl.map((o, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={styles.cell}>{i + 1}</Text>
                  <Text style={styles.cell}>{o.ownerName || '-'}</Text>
                  <Text style={styles.cell}>{o.guardianName || '-'}</Text>
                  <Text style={styles.cell}>{o.relationType || '-'}</Text>
                  <Text style={styles.cell}>{o.mobileNo || '-'}</Text>
                </View>
              ))}
            </View>

            {/* SAF Comparison */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verified Details</Text>
              <View style={styles.tableRowHeader}>
                <Text style={styles.cell}>Particular</Text>
                <Text style={styles.cell}>Self</Text>
                <Text style={styles.cell}>Check</Text>
                <Text style={styles.cell}>Verification</Text>
              </View>
              {safComp.map((c, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={styles.cell}>{c.key}</Text>
                  <Text style={styles.cell}>{renderCheck(c.self)}</Text>
                  <Text style={styles.cell}>{renderCheck(c.test)}</Text>
                  <Text style={styles.cell}>{renderCheck(c.verify)}</Text>
                </View>
              ))}
            </View>

            {/* Floor Verified Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Floor Verified Details</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                  {/* Header */}
                  <View style={styles.tableRowHeader}>
                    <Text style={styles.cell}>Floor</Text>
                    <Text style={styles.cell}>Usage(Self)</Text>
                    <Text style={styles.cell}>Usage(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>Occupancy(Self)</Text>
                    <Text style={styles.cell}>Occupancy(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>Construction(Self)</Text>
                    <Text style={styles.cell}>Construction(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>Built-up(Self)</Text>
                    <Text style={styles.cell}>Built-up(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>Carpet(Self)</Text>
                    <Text style={styles.cell}>Carpet(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>DateFrom(Self)</Text>
                    <Text style={styles.cell}>DateFrom(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                    <Text style={styles.cell}>DateUpto(Self)</Text>
                    <Text style={styles.cell}>DateUpto(Verify)</Text>
                    <Text style={styles.cell}>Check</Text>
                  </View>

                  {/* Data Rows */}
                  {floorCom.map((f, i) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={styles.cell}>{f.floorName}</Text>

                      {/* Usage */}
                      <Text style={styles.cell}>
                        {f.usageType?.self || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {f.usageType?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.usageType?.test)}
                      </Text>

                      {/* Occupancy */}
                      <Text style={styles.cell}>
                        {f.occupancyName?.self || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {f.occupancyName?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.occupancyName?.test)}
                      </Text>

                      {/* Construction */}
                      <Text style={styles.cell}>
                        {f.constructionType?.self || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {f.constructionType?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.constructionType?.test)}
                      </Text>

                      {/* Built-up */}
                      <Text style={styles.cell}>
                        {f.builtupArea?.self || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {f.builtupArea?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.builtupArea?.test)}
                      </Text>

                      {/* Carpet */}
                      <Text style={styles.cell}>
                        {f.carpetArea?.self || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {f.carpetArea?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.carpetArea?.test)}
                      </Text>

                      {/* Date From */}
                      <Text style={styles.cell}>{f.dateFrom?.self || '-'}</Text>
                      <Text style={styles.cell}>
                        {f.dateFrom?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.dateFrom?.test)}
                      </Text>

                      {/* Date Upto */}
                      <Text style={styles.cell}>{f.dateUpto?.self || '-'}</Text>
                      <Text style={styles.cell}>
                        {f.dateUpto?.verify || '-'}
                      </Text>
                      <Text style={styles.cell}>
                        {renderCheck(f.dateUpto?.test)}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Geo Tagging */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Geo Tagging</Text>
              <View style={styles.tableRowHeader}>
                <Text style={styles.cell}>Location</Text>
                <Text style={styles.cell}>Lat</Text>
                <Text style={styles.cell}>Long</Text>
                <Text style={styles.cell}>View</Text>
              </View>
              {geoTag.map((g, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={styles.cell}>{g.directionType}</Text>
                  <Text style={styles.cell}>{g.latitude}</Text>
                  <Text style={styles.cell}>{g.longitude}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://maps.google.com/?q=${g.latitude},${g.longitude}`,
                      )
                    }
                  >
                    <Text style={[styles.cell, { color: 'blue' }]}>
                      Google Map
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Extra Floors */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extra Floors</Text>
              {extraFloor.length > 0 ? (
                extraFloor.map((f, i) => (
                  <Text key={i}>Floor: {f.floorName}</Text>
                ))
              ) : (
                <Text>No Extra Floors</Text>
              )}
            </View>
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
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  section: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: Colors.primary,
    color: Colors.background,
    padding: 5,
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    fontSize: 13,
  },
});
