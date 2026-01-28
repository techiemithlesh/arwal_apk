import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import RNBlobUtil from 'react-native-blob-util';
import PrintButton from '../../../../Components/PrintButton';
import Toast from 'react-native-toast-message';
import { showToast } from '../../../../utils/toast';
import { toastConfig } from '../../../../utils/toastConfig';

const { width, height } = Dimensions.get('window');

const downloadPDF = async url => {
  try {
    const { fs } = RNBlobUtil;
    const dir = fs.dirs.DownloadDir; // Downloads folder
    const path = `${dir}/document_${Date.now()}.pdf`;

    const res = await RNBlobUtil.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading PDF...',
      },
    }).fetch('GET', url);

    showToast('success', '📄 Success', 'PDF Downloaded Successfully!');
    console.log('PDF saved to:', res.path());
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', 'Download failed!');
  }
};

export const DocumentModal = ({ visible, onClose, documents }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const openPreview = index => {
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const renderPreviewItem = ({ item }) => {
    const isPDF = item.docPath?.toLowerCase().endsWith('.pdf');

    return (
      <View
        style={{
          width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPDF ? (
          <View style={{ alignItems: 'center' }}>
            {/* PDF Preview via Google Docs viewer */}
            <WebView
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                  item.docPath,
                )}`,
              }}
              style={{
                width: width * 0.95,
                height: height * 0.75,
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            />

            {/* Download Button */}
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => downloadPDF(item.docPath)}
            >
              <Text style={styles.downloadText}>Download PDF</Text>
            </TouchableOpacity>
            <View style={{ padding: 20 }}>
              <Text style={{}}>Trade Documents</Text>
              <PrintButton fileUrl={item.docPath} title="Print" />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.docPath }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        {/* Document List Modal */}
        <View style={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.mainTitle}>Uploaded Documents</Text>

            <View style={styles.sectionContainer}>
              {documents?.length > 0 ? (
                documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.documentName}>
                        {doc.docName} ({doc.ownerName || 'N/A'})
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded By: {doc.uploadedBy || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Owner: {doc.ownerName || 'N/A'}
                      </Text>
                      <Text style={styles.documentDate}>
                        Uploaded At: {doc.createdAt?.split('T')[0] || 'N/A'}
                      </Text>
                      {doc.verifiedAt && (
                        <Text style={styles.documentDate}>
                          Verified At: {doc.verifiedAt}
                        </Text>
                      )}

                      <Text
                        style={[
                          styles.documentStatus,
                          {
                            color:
                              doc.verifiedStatus === 1
                                ? 'green'
                                : doc.verifiedStatus === 2
                                ? 'red'
                                : 'orange',
                          },
                        ]}
                      >
                        {doc.verifiedStatus === 1
                          ? 'Verified'
                          : doc.verifiedStatus === 2
                          ? 'Rejected'
                          : 'Pending'}
                      </Text>

                      {/* View Button */}
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => openPreview(index)}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#666' }}>
                  No Documents Uploaded
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={previewVisible}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View style={styles.previewOverlay}>
            <TouchableOpacity
              style={styles.previewCloseBtn}
              onPress={() => setPreviewVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={documents}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={currentIndex}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderPreviewItem}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                }, 300);
              }}
            />
            {/* Toast inside modal to ensure it appears above modal content */}
            <Toast config={toastConfig} position="top" topOffset={60} />
          </View>
        </Modal>
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
  sectionContainer: {
    paddingVertical: 10,
  },
  documentItem: {
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    marginTop: 10,
    shadowColor: '#3b2525ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  documentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  documentStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  viewBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    width: 80,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
  },
  previewImage: {
    width: width * 0.95,
    height: height * 0.8,
  },
  downloadBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
