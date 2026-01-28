import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './sharedStyles';

export const DocumentModal = ({
  visible,
  onClose,
  uploadedDocs,
  onDocumentPress,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.docModalContainer}>
      <View style={styles.docModalContent}>
        <Text style={styles.docModalTitle}>📑 Document View</Text>

        <View style={styles.docTableHeader}>
          <Text style={styles.docCellHeader}>#</Text>
          <Text style={styles.docCellHeader}>Document Name</Text>
          <Text style={styles.docCellHeader}>File</Text>
          <Text style={styles.docCellHeader}>Status</Text>
        </View>

        <ScrollView>
          {uploadedDocs?.map((doc, index) => (
            <View key={doc.id} style={styles.docTableRow}>
              <Text style={styles.docCell}>{index + 1}</Text>
              <Text style={styles.docCell}>{doc.docName}</Text>
              <TouchableOpacity onPress={() => onDocumentPress(doc)}>
                <Text style={[styles.docCell, styles.docFileLink]}>
                  View File
                </Text>
              </TouchableOpacity>
              <Text style={styles.docCell}>
                {doc.verifiedStatus === 1 ? 'Pending' : 'Verified'}
              </Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.docCloseButton} onPress={onClose}>
          <Text style={styles.docCloseButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
