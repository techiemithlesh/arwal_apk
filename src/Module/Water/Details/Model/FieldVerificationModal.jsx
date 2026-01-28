import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Reusable InfoRow Component
const InfoRow = ({ label, value, fullWidth = false }) => (
  <View style={[styles.infoRow, fullWidth && styles.fullWidth]}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

// Reusable Section Component
const Section = ({ title, children, isTable = false }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionDivider} />
    <View style={isTable ? styles.sectionContentTable : styles.sectionContent}>
      {children}
    </View>
  </View>
);

// Check Icon Component
const CheckIcon = ({ isChecked }) => (
  <View
    style={[
      styles.checkIcon,
      isChecked ? styles.checkSuccess : styles.checkError,
    ]}
  >
    <Text style={styles.checkText}>{isChecked ? '✓' : '✗'}</Text>
  </View>
);

// Reusable Table Component
const ComparisonTable = ({ data }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderText, styles.colField]}>Field</Text>
      <Text style={[styles.tableHeaderText, styles.colApp]}>Application</Text>
      <Text style={[styles.tableHeaderText, styles.colVerify]}>
        Verification
      </Text>
      <Text style={[styles.tableHeaderText, styles.colCheck]}>Check</Text>
    </View>

    {data.map((row, index) => (
      <View
        key={index}
        style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
      >
        <Text style={[styles.tableCell, styles.colField]}>{row.field}</Text>
        <Text style={[styles.tableCell, styles.colApp]}>{row.application}</Text>
        <Text style={[styles.tableCell, styles.colVerify]}>
          {row.verification}
        </Text>
        <View style={styles.colCheck}>
          <CheckIcon isChecked={row.check} />
        </View>
      </View>
    ))}
  </View>
);

// Main Modal Component
const FieldVerificationModal = ({ visible, onClose, verifiedData }) => {
  const [appliction, setAppliction] = useState(null);
  const [appComp, setAppComp] = useState(null);
  const [ownerDtl, setoWnerDtl] = useState(null);
  const [tcDtl, setotcDtl] = useState(null);

  useEffect(() => {
    if (verifiedData) {
      setAppliction(verifiedData?.appDtl);
      setAppComp(verifiedData?.appComp);
      setoWnerDtl(verifiedData?.ownerDtl);
      setotcDtl(verifiedData?.tcDtl);
    }
  }, [verifiedData]);

  const formattedCompTable = Array.isArray(appComp)
    ? appComp.map(item => ({
        field: item.key,
        application: item.self || '-',
        verification: item.verify || '-',
        check: Boolean(item.test),
      }))
    : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Field Verification Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {/* Verification Officer */}
            <Section title="Verification Officer">
              <InfoRow label="Verified By" value={tcDtl?.verifiedBy} />
              <InfoRow label="User" value={tcDtl?.userName} />
              <InfoRow label="Date" value={tcDtl?.verificationDate} fullWidth />
            </Section>

            {/* Application Details */}
            <Section title="Application Details">
              <InfoRow
                label="Application No"
                value={appliction?.applicationNo}
              />
              <InfoRow label="Apply Date" value={appliction?.applyDate} />
              <InfoRow
                label="Application Type"
                value={appliction?.applicationType}
              />
              <InfoRow label="Property Type" value={appliction?.propertyType} />
              <InfoRow label="Ward No" value={appliction?.wardNo} />
              <InfoRow label="New Ward No" value={appliction?.newWardNo} />
              <InfoRow
                label="Ownership Type"
                value={appliction?.ownershipType}
                fullWidth
              />
            </Section>

            {/* Owner Details */}
            <Section title="Owner Details">
              <InfoRow label="Name" value={ownerDtl?.[0]?.ownerName} />
              <InfoRow label="Mobile" value={ownerDtl?.[0]?.mobileNo} />
              <InfoRow label="Guardian" value={ownerDtl?.[0]?.guardianName} />
              <InfoRow label="DOB" value={ownerDtl?.[0]?.dob} />
            </Section>

            {/* Comparison Table */}
            <Section title="Field Verification Comparison" isTable>
              {formattedCompTable.length > 0 ? (
                <ComparisonTable data={formattedCompTable} />
              ) : (
                <Text>No comparison data available</Text>
              )}
            </Section>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  scrollContent: {
    padding: 20,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  sectionContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionContentTable: {
    flexDirection: 'column', // ensure table rows stack vertically
    width: '100%',
  },
  infoRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  fullWidth: { width: '100%' },
  label: { fontSize: 10, color: '#6b7280' },
  value: { fontSize: 10, fontWeight: '500', width: '60%' },
  table: { marginTop: 12 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowEven: { backgroundColor: '#fafafa' },
  tableCell: { fontSize: 13 },
  colField: { flex: 2 },
  colApp: { flex: 2 },
  colVerify: { flex: 2 },
  colCheck: { flex: 1, alignItems: 'center' },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSuccess: { backgroundColor: '#10b981' },
  checkError: { backgroundColor: '#ef4444' },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default FieldVerificationModal;
