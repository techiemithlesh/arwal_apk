// components/PrintButton.js
import React from 'react';
import { Button, Alert } from 'react-native';
import RNPrint from 'react-native-print';

const PrintButton = ({ fileUrl, title = 'Print Document' }) => {
  const handlePrint = async () => {
    try {
      if (!fileUrl) {
        Alert.alert('No document available to print');
        return;
      }

      if (Array.isArray(fileUrl)) {
        // Loop through docs (opens print dialog one by one)
        for (let doc of fileUrl) {
          await RNPrint.print({ filePath: doc });
        }
      } else {
        await RNPrint.print({ filePath: fileUrl });
      }
    } catch (err) {
      console.log('Print error: ', err);
    }
  };

  return <Button title={title} onPress={handlePrint} />;
};

export default PrintButton;
