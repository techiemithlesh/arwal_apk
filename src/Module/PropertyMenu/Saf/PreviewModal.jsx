import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PreviewModal = ({ visible, onClose, previewData }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Preview Details</Text>
          <ScrollView style={styles.modalContent}>
            {Object.entries(previewData || {}).map(([key, value]) => (
              <View key={key} style={styles.previewRow}>
                <Text style={styles.previewLabel}>{key}:</Text>
                <Text style={styles.previewValue}>{value || 'N/A'}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  previewRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  previewLabel: {
    fontWeight: '600',
    width: 120,
  },
  previewValue: {
    flex: 1,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PreviewModal;
