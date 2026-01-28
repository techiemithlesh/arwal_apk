import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export const ViewTradeLicenseModal = ({ visible, onClose, tradeDetails }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>
            Municipal Trade Licence Approval Certificate
          </Text>

          <Text style={styles.mainTitle}>Municipal License</Text>

          <Text style={styles.subTitle}>RANCHI MUNICIPAL CORPORATION</Text>
          <Text style={styles.tinyText}>
            (This certificate relates to Section 455(J) Jharkhand Municipal Act
            2011)
          </Text>

          {[
            [
              'Municipal Trade Licence No:',
              tradeDetails?.licenseNo || 'RAN55020319162233',
            ],
            ['Issue Date:', tradeDetails?.issueDate || '03-02-2019'],
            ['Validity:', tradeDetails?.validUpto || '23-01-2020'],
            [
              'Owner/Entity Name:',
              tradeDetails?.firmName || 'GOPAL GENERAL STORE',
            ],
            [
              'Owner Name:',
              tradeDetails?.owners?.[0]?.ownerName || 'ARVIND KUMAR',
            ],
            ['Nature of Entity:', tradeDetails?.firmType || 'GENERAL STORE'],
            [
              'Nature of Business:',
              tradeDetails?.natureOfBusiness ||
                'GRAIN SELLING WHOLESALE OR STORING FOR WHOLESALE TRADE PARCHING',
            ],
            ['Business Code:', tradeDetails?.businessCode || '(83)'],
            ['Date of Application:', tradeDetails?.applyDate || '24-01-2019'],
            ['Ward No.:', tradeDetails?.wardNo || '55'],
            ['Holding No.:', tradeDetails?.holdingNo || 'N/A'],
            [
              'Street Address:',
              tradeDetails?.address ||
                'NEW NAGAR BANDHGARI DIPATOLI RANCHI834001',
            ],
            [
              'Application No.:',
              tradeDetails?.applicationNo || '162233240119104140',
            ],
            [
              'Mobile No.:',
              tradeDetails?.owners?.[0]?.mobileNo || '9709226782',
            ],
          ].map(([label, value], index) => (
            <View style={styles.rowContainer} key={index}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}

          <Text style={styles.declaration}>
            This is to declare that{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.firmName || 'GOPAL GENERAL STORE'}
            </Text>{' '}
            having application number{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {tradeDetails?.applicationNo || '162233240119104140'}
            </Text>{' '}
            has been successfully registered with satisfactory compliance of
            registration criteria.
          </Text>

          <View style={{ marginTop: 10 }}>
            {[
              '1. The business will run according to the license issued.',
              '2. Prior permission from the local body is necessary if the business is changed.',
              '3. Information to the local body is necessary for extension of the area.',
              '4. Prior intimation to local body regarding winding off business is necessary.',
              '5. Renewal is necessary one month before expiry.',
              '6. Penalty may be levied under Section 459.',
              '7. Illegal parking in front of the firm is non-permissible.',
              '8. Dustbins must be available at premises and adhere to waste disposal rules.',
              '9. SWM & Plastic Waste Management Rules 2016 shall be adhered to.',
            ].map((term, i) => (
              <Text style={styles.term} key={i}>
                {term}
              </Text>
            ))}
          </View>

          <Text style={styles.note}>
            Note: This is a computer-generated license. No physical signature is
            required.
          </Text>

          <TouchableOpacity style={styles.printBtn}>
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 6,
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mainTitle: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tinyText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1.2,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
  },
  value: {
    flex: 2,
    fontSize: 13,
    color: '#000',
  },
  declaration: {
    fontSize: 13,
    marginTop: 16,
    marginBottom: 10,
    textAlign: 'justify',
    color: '#333',
  },
  term: {
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
  },
  note: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  printBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
