import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from 'react-native';

export const DocumentViewModal = ({
  visible,
  onClose,
  uploadedDocs,
  onDocumentPress,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.docModalContainer}>
        <View style={styles.docModalContent}>
          <Text style={styles.docModalTitle}>📄 Document View</Text>

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
                <TouchableOpacity
                  onPress={() => {
                    console.log('Document clicked:', doc);
                    console.log('Document path:', doc.docPath);

                    // Check if it's a PDF or image
                    const fileExtension = doc.docPath
                      .split('.')
                      .pop()
                      .toLowerCase();
                    console.log('File extension:', fileExtension);

                    if (fileExtension === 'pdf') {
                      // For PDF files, fall back to Linking
                      Alert.alert(
                        'PDF Document',
                        'PDF files will open in external viewer',
                        [
                          {text: 'Cancel', style: 'cancel'},
                          {
                            text: 'Open',
                            onPress: () => Linking.openURL(doc.docPath),
                          },
                        ],
                      );
                    } else {
                      // For image files, open in modal
                      onDocumentPress(doc);
                    }
                  }}
                >
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
};

const styles = StyleSheet.create({
  docModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docModalContent: {
    backgroundColor: '#fff',
    width: '95%',
    maxHeight: '85%',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  docModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  docTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  docTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  docCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  docCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  docFileLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  docCloseButton: {
    backgroundColor: '#007bff',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  docCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
