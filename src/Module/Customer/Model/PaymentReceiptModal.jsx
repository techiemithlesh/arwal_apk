import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Printer,
  Style,
  Align,
  InMemory,
} from '@linvix-sistemas/react-native-escpos-buffer';

import { useState } from 'react';
import { sharedStyles } from './sharedStyles';
import useBluetoothPrinter from '../../../utils/BluetoothService';
export const PaymentReceiptModal = ({ visible, onClose, receiptData }) => {
  if (!receiptData) return null;
  console.log('recipt data', receiptData);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  // Use Bluetooth printer hook
  const {
    bluetoothDevices,
    pairedDevices,
    scanning,
    connecting,
    connectedDevice,
    printing,
    scanForDevices,
    connectToPrinter: connectToDevice,
    printBuffer,
  } = useBluetoothPrinter();

  // Handle scanning for devices
  const handleScanForDevices = () => {
    scanForDevices(() => {
      // This callback is called when scanning completes
      setShowPrinterModal(true);
    });
  };

  // Wrapper for connecting to printer and closing modal
  const handleConnectToPrinter = async device => {
    const success = await connectToDevice(device);
    if (success) {
      setShowPrinterModal(false);
    }
  };

  // Format and print receipt
  const printReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert('No Printer', 'Please connect to a Bluetooth printer first.');
      handleScanForDevices();
      return;
    }

    try {
      // Create ESC/POS buffer
      const connection = new InMemory();
      const printer = await Printer.CONNECT('TM-T20', connection);

      // Build receipt content
      await printer.feed(1);

      // Header
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln('PAYMENT RECEIPT', Style.Bold, Align.Center);
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        receiptData?.ulbDtl?.ulbName || 'Municipal Corporation',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.feed(1);

      // Title
      await printer.writeln(
        'Water Connection Charge',
        Style.Bold,
        Align.Center,
      );
      await printer.writeln('Payment Receipt', Style.Normal, Align.Center);
      await printer.feed(1);

      // Receipt details
      await printer.writeln(
        `Receipt No: ${receiptData?.tranNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Date: ${receiptData?.tranDate || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Ward No: ${receiptData?.wardNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `New Ward No: ${receiptData?.newWardNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Received From: ${receiptData?.ownerName || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Address: ${receiptData?.address || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Amount: Rs. ${receiptData?.amount || '0.00'}`,
        Style.Bold,
        Align.Left,
      );
      await printer.writeln(
        `In Words: ${receiptData?.amountInWords || ''}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Towards: ${receiptData?.accountDescription || ''}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Via: ${receiptData?.paymentMode || 'Cash'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.feed(1);

      // Table
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        'Description          Amount',
        Style.Bold,
        Align.Center,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );

      // Collection details
      for (const item of receiptData?.collection || []) {
        const desc = (item?.demand?.chargeFor || 'N/A').substring(0, 18);
        const amt = `Rs. ${item?.amount}`;
        await printer.writeln(
          `${desc.padEnd(20)} ${amt}`,
          Style.Normal,
          Align.Left,
        );
      }
      console.log('receiptData.fineRebate', printReceipt);
      // Fine/Rebate
      for (const fine of receiptData?.fineRebate || []) {
        const desc = (fine?.headName || '').substring(0, 18);
        const prefix = fine?.isRebate ? '-' : '+';
        const amt = `${prefix} Rs. ${fine?.amount}`;
        await printer.writeln(
          `${desc.padEnd(20)} ${amt}`,
          Style.Normal,
          Align.Left,
        );
      }

      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        `Total: Rs. ${receiptData?.amount || '0.00'}`,
        Style.Bold,
        Align.Right,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.feed(1);

      // Footer
      await printer.writeln(
        '** This is a computer-generated',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        'receipt and does not require',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln('signature. **', Style.Normal, Align.Center);

      // Cut paper and feed
      await printer.cutter();
      await printer.feed(3);

      // Get buffer and print using Bluetooth service
      const buffer = connection.buffer();
      await printBuffer(buffer, {
        successMessage: 'Receipt printed successfully!',
        errorMessage: 'Failed to print receipt. Please try again.',
      });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert(
        'Print Failed',
        'Failed to format receipt. Please try again.',
      );
    }
  };

  const data = receiptData;

  const qrCodeUrl = data.qrCode || '';
  const purpose = data.description || 'Water Connection';
  const mode = data.paymentMode || 'CASH';

  const lineItems =
    data.collection?.map(item => ({
      description: data.description || 'Water Connection',
      fromQTR: item.demandFrom || '',
      fromFY: item.fromDate || '',
      toQTR: item.uptoDate || '',
      toFY: item.uptoDate || '',
      amount: item.amount || '0',
    })) || [];

  const totalAmount = lineItems
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    .toFixed(2);

  const totalPaid = parseFloat(data.amount || 0).toFixed(2);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={sharedStyles.receiptContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header with Close Button */}
          <View style={sharedStyles.header}>
            <Text style={sharedStyles.title}>Payment Receipt</Text>
            <TouchableOpacity style={sharedStyles.closeBtn} onPress={onClose}>
              <Text style={sharedStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Receipt Info */}
          <View style={sharedStyles.receiptInfo}>
            <Text>
              Trans No:{' '}
              <Text style={sharedStyles.bold}>{data.tranNo || 'N/A'}</Text>
            </Text>
            <Text>
              Received From:{' '}
              <Text style={sharedStyles.bold}>
                {data.ownerDtl?.[0]?.ownerName || 'N/A'}
              </Text>
            </Text>
            <Text>
              Address:{' '}
              <Text style={sharedStyles.bold}>{data.address || 'N/A'}</Text>
            </Text>
            <Text>
              A Sum of Rs.:{' '}
              <Text style={sharedStyles.bold}>{data.amount || '0.00'}</Text>
            </Text>
            <Text>
              In Words:{' '}
              <Text style={sharedStyles.bold}>
                {data.amountInWords || 'N/A'}
              </Text>
            </Text>
            <Text>
              Towards: <Text style={sharedStyles.bold}>{purpose}</Text> Vide:{' '}
              <Text style={sharedStyles.bold}>{mode}</Text>
            </Text>
          </View>

          {/* Table */}
          <View style={sharedStyles.tableContainer}>
            {/* Table Header */}
            <View style={[sharedStyles.tableRow, sharedStyles.tableHeaderRow]}>
              {[
                'Description',
                'From QTR',
                'From FY',
                'To QTR',
                'To FY',
                'Amount',
              ].map((header, idx) => (
                <Text
                  key={idx}
                  style={[sharedStyles.tableCell, sharedStyles.tableHeaderCell]}
                >
                  {header}
                </Text>
              ))}
            </View>

            {/* Table Body */}
            {lineItems.map((item, index) => (
              <View key={index} style={sharedStyles.tableRow}>
                <Text style={sharedStyles.tableCell}>{item.description}</Text>
                <Text style={sharedStyles.tableCell}>{item.fromQTR}</Text>
                <Text style={sharedStyles.tableCell}>{item.fromFY}</Text>
                <Text style={sharedStyles.tableCell}>{item.toQTR}</Text>
                <Text style={sharedStyles.tableCell}>{item.toFY}</Text>
                <Text style={sharedStyles.tableCell}>₹ {item.amount}</Text>
              </View>
            ))}

            {/* Table Footer */}
            <View style={sharedStyles.tableRow}>
              <Text style={[sharedStyles.tableCell, sharedStyles.bold]}>
                Total Amount
              </Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={[sharedStyles.tableCell, sharedStyles.bold]}>
                ₹ {totalAmount}
              </Text>
            </View>

            <View style={sharedStyles.tableRow}>
              <Text style={[sharedStyles.tableCell, sharedStyles.bold]}>
                Total Paid Amount
              </Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={sharedStyles.tableCell}></Text>
              <Text style={[sharedStyles.tableCell, sharedStyles.bold]}>
                ₹ {totalPaid}
              </Text>
            </View>
          </View>

          {/* QR & Contact Info */}
          <View style={sharedStyles.qrAndContact}>
            {qrCodeUrl && (
              <Image source={{ uri: qrCodeUrl }} style={sharedStyles.qrImage} />
            )}
            <View style={sharedStyles.contactInfo}>
              <Text>Visit:</Text>
              <Text>Call: 8002158818</Text>
              <Text>In collaboration with Uinfo Technology PVT LTD.</Text>
            </View>
          </View>

          <Text style={sharedStyles.footerNote}>
            ** This is a computer-generated receipt and does not require
            signature. **
          </Text>

          <TouchableOpacity
            style={sharedStyles.printBtn}
            onPress={printReceipt}
            disabled={printing}
          >
            {printing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={sharedStyles.printText}>
                {connectedDevice ? 'Print Receipt' : 'Connect & Print'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.scanBtn}
            onPress={handleScanForDevices}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#1E40AF" />
            ) : (
              <Text style={sharedStyles.scanText}>
                {connectedDevice ? 'Change Printer' : 'Scan for Printers'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Modal
        visible={showPrinterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrinterModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.printerModalContent}>
            <View style={styles.printerModalHeader}>
              <Text style={styles.printerModalTitle}>
                Select Bluetooth Printer
              </Text>
              <TouchableOpacity
                onPress={() => setShowPrinterModal(false)}
                style={styles.closeIconBtn}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.printerList}>
              {/* Paired Devices */}
              {pairedDevices && (
                <>
                  <Text style={styles.sectionTitle}>Paired Devices</Text>
                  {pairedDevices.map((device, index) => (
                    <TouchableOpacity
                      key={`paired-${index}`}
                      style={[
                        styles.deviceItem,
                        connectedDevice?.address === device.address &&
                          styles.connectedDevice,
                      ]}
                      onPress={() => handleConnectToPrinter(device)}
                      disabled={connecting}
                    >
                      <View>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceAddress}>
                          {device.address || device.id}
                        </Text>
                      </View>
                      {connecting ? (
                        <ActivityIndicator size="small" color="#1E40AF" />
                      ) : connectedDevice?.address === device.address ? (
                        <Text style={styles.connectedTag}>Connected</Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {/* Scanned Devices */}
              {bluetoothDevices.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Available Devices</Text>
                  {bluetoothDevices.map((device, index) => (
                    <TouchableOpacity
                      key={`scanned-${index}`}
                      style={styles.deviceItem}
                      onPress={() => handleConnectToPrinter(device)}
                      disabled={connecting}
                    >
                      <View>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceAddress}>
                          {device.address || device.id}
                        </Text>
                      </View>
                      {connecting && (
                        <ActivityIndicator size="small" color="#1E40AF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {pairedDevices.length === 0 && bluetoothDevices.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    No Bluetooth devices found.
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Make sure your printer is turned on and paired.
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={handleScanForDevices}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.rescanText}>Rescan Devices</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default PaymentReceiptModal;

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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  receiptContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    flex: 1.2,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
  },
  infoValue: {
    flex: 2,
    fontSize: 13,
    color: '#000',
  },
  receiptTable: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
    width: 350,
    alignSelf: 'center',
  },
  receiptTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  receiptTableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
  },
  receiptTableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
  },
  receiptTableCell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: '#000',
  },
  receiptTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    color: '#000',
    marginRight: 52,
  },
  receiptNote: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  connectedText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  printBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  scanText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Printer Modal Styles
  printerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  printerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  printerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  closeIconBtn: {
    padding: 4,
  },
  printerList: {
    maxHeight: 400,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  connectedDevice: {
    backgroundColor: '#dbeafe',
    borderColor: '#1E40AF',
    borderWidth: 2,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 12,
    color: '#6b7280',
  },
  connectedTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  rescanBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rescanText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
