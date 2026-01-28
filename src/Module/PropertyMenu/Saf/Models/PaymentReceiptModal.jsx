import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import {
  Printer,
  Style,
  Align,
  InMemory,
} from '@linvix-sistemas/react-native-escpos-buffer';

import { useBluetoothPrinter } from '../../../../utils/BluetoothService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

export const PaymentReceiptModal = ({ visible, onClose, paymentDtls }) => {
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  console;

  const {
    bluetoothDevices,
    pairedDevices,
    scanning,
    connecting,
    connectedDevice,
    printing,
    scanForDevices,
    connectToPrinter,
    printBuffer,
  } = useBluetoothPrinter();

  /* =====================================================
     PDF DOWNLOAD (DESIGN MATCHES SCREENSHOT)
  ===================================================== */
  const downloadReceipt = async () => {
    try {
      setDownloading(true);

      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Helvetica;
      padding: 30px;
      font-size: 13px;
      color: #111827;
    }
    .center { text-align: center; }
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #1d2a7e;
    }
    .badge {
      border: 1px solid #000;
      padding: 4px 12px;
      display: inline-block;
      margin-top: 6px;
      font-weight: bold;
      font-size: 12px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
    }
    .label { font-weight: bold; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 6px;
      font-size: 12px;
      text-align: center;
    }
    th {
      background: #f3f4f6;
    }
    .right { text-align: right; }
    .total {
      font-weight: bold;
      background: #f9fafb;
    }
    .footer {
      margin-top: 25px;
      font-size: 11px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="center title">${paymentDtls?.ulbDtl?.ulbName}</div>
  <div class="center">
    <div class="badge">HOLDING TAX RECEIPT</div>
  </div>

  <div class="row">
    <div><span class="label">Receipt No:</span> ${paymentDtls?.tranNo}</div>
    <div><span class="label">Date:</span> ${paymentDtls?.tranDate}</div>
  </div>

  <div class="row">
    <div><span class="label">Department:</span> ${paymentDtls?.department}</div>
    <div><span class="label">Ward No:</span> ${paymentDtls?.wardNo}</div>
  </div>

  <div class="row">
    <div><span class="label">Owner:</span> ${paymentDtls?.ownerName}</div>
    <div><span class="label">Payment Mode:</span> ${paymentDtls?.paymentMode}</div>
  </div>

  <table>
    <tr>
      <th>Description</th>
      <th>From FY</th>
      <th>To FY</th>
      <th>Amount</th>
    </tr>
    <tr>
      <td>Holding Tax</td>
      <td>${paymentDtls?.fromFyear}</td>
      <td>${paymentDtls?.uptoFyear}</td>
      <td class="right">${paymentDtls?.holdingTax}</td>
    </tr>
    <tr>
      <td>RWH</td>
      <td>-</td>
      <td>-</td>
      <td class="right">${paymentDtls?.rwhTax}</td>
    </tr>
    <tr class="total">
      <td colspan="3">Total Demand</td>
      <td class="right">${paymentDtls?.amount}</td>
    </tr>
  </table>

  <div class="footer">
    <b>Total (In Words):</b> ${paymentDtls?.amountInWords}<br/><br/>
    ** This is a computer-generated receipt and does not require signature **
  </div>
</body>
</html>
`;

      const pdf = await RNHTMLtoPDF.convert({
        html,
        fileName: `Receipt_${paymentDtls?.tranNo}`,
        directory: 'Documents',
      });

      const destPath = `${RNFS.DownloadDirectoryPath}/Receipt_${paymentDtls?.tranNo}.pdf`;
      await RNFS.copyFile(pdf.filePath, destPath);
      await RNFS.scanFile(destPath);

      Alert.alert('Success', 'PDF downloaded to Downloads');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'PDF download failed');
    } finally {
      setDownloading(false);
    }
  };

  /* =====================================================
     PRINT RECEIPT (ESC/POS)
  ===================================================== */
  const printReceipt = async () => {
    if (!connectedDevice) {
      scanForDevices(() => setShowPrinterModal(true));
      return;
    }

    try {
      const connection = new InMemory();
      const printer = await Printer.CONNECT('TM-T20', connection);

      await printer.writeln('HOLDING TAX RECEIPT', Style.Bold, Align.Center);
      await printer.writeln(
        paymentDtls?.ulbDtl?.ulbName,
        Style.Normal,
        Align.Center,
      );
      await printer.feed(1);

      await printer.writeln(`Receipt No: ${paymentDtls?.tranNo}`);
      await printer.writeln(`Date: ${paymentDtls?.tranDate}`);
      await printer.writeln(`Owner: ${paymentDtls?.ownerName}`);
      await printer.writeln(`Amount: Rs. ${paymentDtls?.amount}`, Style.Bold);

      await printer.feed(1);
      await printer.writeln('-------------------------------');
      await printer.writeln(`Holding Tax : ${paymentDtls?.holdingTax}`);
      await printer.writeln(`RWH Tax     : ${paymentDtls?.rwhTax}`);
      await printer.writeln('-------------------------------');
      await printer.writeln(`TOTAL : Rs. ${paymentDtls?.amount}`, Style.Bold);
      await printer.feed(2);

      await printer.writeln('This is a computer generated');
      await printer.writeln('receipt. No signature required.');
      await printer.feed(3);
      await printer.cutter();

      const buffer = connection.buffer();
      await printBuffer(buffer);
    } catch (err) {
      Alert.alert('Print Error', 'Failed to print receipt');
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.header}>View Receipt</Text>

        <Text style={styles.title}>{paymentDtls?.ulbDtl?.ulbName}</Text>

        <Text style={styles.badge}>HOLDING TAX RECEIPT</Text>

        <View style={styles.section}>
          <Text>
            Receipt No: <Text style={styles.bold}>{paymentDtls?.tranNo}</Text>
          </Text>
          <Text>
            Date: <Text style={styles.bold}>{paymentDtls?.tranDate}</Text>
          </Text>
          <Text>
            Owner: <Text style={styles.bold}>{paymentDtls?.ownerName}</Text>
          </Text>
          <Text>
            Amount: <Text style={styles.bold}>{paymentDtls?.amount}</Text>
          </Text>
        </View>

        {/* BUTTONS */}
        <TouchableOpacity style={styles.successBtn} onPress={downloadReceipt}>
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Download PDF</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={printReceipt}>
          {printing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Print Receipt</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => scanForDevices(() => setShowPrinterModal(true))}
        >
          <Text style={styles.outlineText}>Scan / Change Printer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

/* =====================================================
   STYLES (UNIFIED DESIGN)
===================================================== */
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#1d2a7e' },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  badge: {
    alignSelf: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  section: { marginBottom: 20 },
  bold: { fontWeight: 'bold' },

  primaryBtn: {
    backgroundColor: '#1d2a7e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  successBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: '#1d2a7e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  outlineText: {
    color: '#1d2a7e',
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
