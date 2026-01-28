import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Colors from '../Constants/Colors';

const DocUpload = () => {
  const [landmark, setLandmark] = useState('');
  const [newWardNo, setNewWardNo] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* APPLY LICENSE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPLY LICENSE</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Application Type *</Text>
            <Text style={styles.value}>RENEWAL</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Firm Type *</Text>
            <Text style={styles.value}>PROPRIETORSHIP</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Type of Ownership *</Text>
            <Text style={styles.value}>OWN PROPERTY</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>License No.</Text>
            <Text style={styles.value}>8583</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Category *</Text>
            <Text style={styles.value}>Others</Text>
          </View>
        </View>
      </View>

      {/* FIRM DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FIRM DETAILS</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Holding No.</Text>
            <Text style={styles.value}>0010000771000X1</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Ward No.</Text>
            <Text style={styles.value}>1</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Firm Name *</Text>
            <Text style={styles.value}>SHANTI NIKETAN</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Total Area (Sq. Ft)</Text>
            <Text style={styles.value}>180.00</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Firm Establishment Date</Text>
            <Text style={styles.value}>2017-10-09</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Pin Code</Text>
            <Text style={styles.value}>0</Text>
          </View>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Business Address</Text>
          <Text style={styles.value}>OPP S.S MEMORIAL COLLEGE RANCHI</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Owner of Business Premises</Text>
          <Text style={styles.value}>SMT. URMILA DEVI</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Landmark"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Business Description *</Text>
          <Text style={styles.value}>XEROX SHOP STUDIO</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>New Ward No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter New Ward No."
            value={newWardNo}
            onChangeText={setNewWardNo}
          />
        </View>
      </View>

      {/* OWNER DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OWNER DETAILS</Text>
        {/* Owner Table Header */}
        <View style={[styles.ownerRow, styles.tableHeader]}>
          <Text style={styles.tableHeaderText}>OWNER NAME</Text>
          <Text style={styles.tableHeaderText}>GUARDIAN NAME</Text>
          <Text style={styles.tableHeaderText}>MOBILE NO</Text>
          <Text style={styles.tableHeaderText}>EMAIL ID</Text>
          <Text style={styles.tableHeaderText}>UPLOAD</Text>
        </View>
        {/* Owner 1 */}
        <View style={styles.ownerRow}>
          <Text style={styles.ownerCell}>PRAKASH RAJAN SRIVASTAVA</Text>
          <Text style={styles.ownerCell}>LATE MADAN MEHAN SRIVASTAV</Text>
          <Text style={styles.ownerCell}>9876543210</Text>
          <Text style={styles.ownerCell}>—</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Document</Text>
          </TouchableOpacity>
        </View>
        {/* Owner 2 */}
        <View style={styles.ownerRow}>
          <Text style={styles.ownerCell}>RAHUL SHARMA</Text>
          <Text style={styles.ownerCell}>LATE RAMESH SHARMA</Text>
          <Text style={styles.ownerCell}>—</Text>
          <Text style={styles.ownerCell}>rahul@example.com</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Document</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* NATURE OF BUSINESS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NATURE OF BUSINESS</Text>
        <Text style={styles.value}>
          BOARDING AND LODGING HOUSE INCLUDING PAYING GUEST ACCOMMODATION AND
          WORKING MEN WOMEN HOSTELS KEEPING
        </Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Trade Code *</Text>
          <Text style={styles.value}>19</Text>
        </View>
      </View>

      {/* OTHER DOCUMENTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OTHER DOCUMENTS</Text>
        {/* Document 1 */}
        <View style={styles.ownerRow}>
          <Text style={styles.ownerCell}>Affidavit</Text>
          <Text style={styles.ownerCell}>New</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText1}>Upload Document</Text>
          </TouchableOpacity>
        </View>
        {/* Document 2 */}
        <View style={styles.ownerRow}>
          <Text style={styles.ownerCell}>Trade Licence</Text>
          <Text style={styles.ownerCell}>New</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText1}>Upload Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Colors.primary,
    color: '#fff',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  column: {
    flexBasis: '48%',
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  inputRow: {
    marginVertical: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    fontSize: 14,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  ownerCell: {
    flexBasis: '20%',
    fontSize: 12,
    color: '#000',
    padding: 2,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  uploadText: {
    color: '#fff',
    fontSize: 5,
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: Colors.primary,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    flexBasis: '20%',
    padding: 2,
  },
  uploadText1: {
    color: '#fff',
    fontSize: 12,
  },
});

export default DocUpload;
