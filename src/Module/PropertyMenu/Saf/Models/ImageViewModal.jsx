import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';

export const ImageViewModal = ({
  visible,
  onClose,
  imageUri,
  imageLoading,
  setImageLoading,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModalContainer}>
        <TouchableOpacity style={styles.closeFullScreenButton} onPress={onClose}>
          <Text style={styles.closeFullScreenButtonText}>✕ Close</Text>
        </TouchableOpacity>

        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading document...</Text>
          </View>
        )}

        <ScrollView
          style={styles.fullScreenScrollView}
          contentContainerStyle={styles.fullScreenScrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
        >
          {imageUri ? (
            <Image
              source={{uri: imageUri}}
              style={styles.fullScreenImage}
              resizeMode="contain"
              onLoad={() => {
                console.log('Image loaded successfully');
                setImageLoading(false);
              }}
              onError={error => {
                console.log('Image load error:', error);
                console.log('Failed URI:', imageUri);
                setImageLoading(false);
                Alert.alert(
                  'Load Error',
                  `Failed to load document. Path: ${imageUri}\n\nWould you like to try opening it externally?`,
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Open Externally',
                      onPress: () => {
                        Linking.openURL(imageUri);
                        onClose();
                      },
                    },
                  ],
                );
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeFullScreenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  fullScreenScrollView: {
    flex: 1,
    width: '100%',
  },
  fullScreenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 100,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -50}, {translateY: -50}],
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});
