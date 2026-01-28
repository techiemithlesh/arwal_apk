/**
 * BLUETOOTH SERVICE USAGE EXAMPLES
 *
 * This file demonstrates how to use the BluetoothService in different components
 * across your application.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useBluetoothPrinter } from './BluetoothService';
import { Printer, Style, Align, InMemory } from '@linvix-sistemas/react-native-escpos-buffer';

/**
 * EXAMPLE 1: Simple Receipt Printer Component
 * Shows basic usage for printing a simple receipt
 */
export const SimpleReceiptExample = ({ receiptData }) => {
  const {
    connectedDevice,
    printing,
    scanForDevices,
    printBuffer,
  } = useBluetoothPrinter();

  const printSimpleReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert('No Printer', 'Please connect to a printer first.');
      scanForDevices();
      return;
    }

    try {
      // Create ESC/POS buffer
      const connection = new InMemory();
      const printer = await Printer.CONNECT('TM-T20', connection);

      // Format your receipt
      await printer.writeln('SIMPLE RECEIPT', Style.Bold, Align.Center);
      await printer.writeln(`Total: Rs. ${receiptData.amount}`, Style.Normal, Align.Left);
      await printer.feed(2);
      await printer.cutter();

      // Print using the service
      const buffer = connection.buffer();
      await printBuffer(buffer, {
        successMessage: 'Receipt printed!',
      });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Error', 'Failed to print receipt');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={printSimpleReceipt} disabled={printing}>
        <Text>{printing ? 'Printing...' : 'Print Receipt'}</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * EXAMPLE 2: Printer Selection Component with Modal
 * Shows how to implement a printer selection UI with modal that shows after scanning
 */
export const PrinterSelectionExample = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    bluetoothDevices,
    pairedDevices,
    scanning,
    connecting,
    connectedDevice,
    scanForDevices,
    connectToPrinter,
    disconnectPrinter,
  } = useBluetoothPrinter();

  // Handle scan with callback to show modal when done
  const handleScan = () => {
    scanForDevices(() => {
      // This callback is called when scanning completes
      setShowModal(true);
    });
  };

  return (
    <View>
      {/* Show connected printer */}
      {connectedDevice && (
        <View>
          <Text>Connected: {connectedDevice.name}</Text>
          <TouchableOpacity onPress={disconnectPrinter}>
            <Text>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scan button */}
      <TouchableOpacity onPress={handleScan} disabled={scanning}>
        <Text>{scanning ? 'Scanning...' : 'Scan for Printers'}</Text>
      </TouchableOpacity>

      {/* List paired devices */}
      <Text>Paired Devices:</Text>
      {pairedDevices.map((device, index) => (
        <TouchableOpacity
          key={`paired-${index}`}
          onPress={() => connectToPrinter(device)}
          disabled={connecting}
        >
          <Text>{device.name || 'Unknown Device'}</Text>
          <Text>{device.address}</Text>
        </TouchableOpacity>
      ))}

      {/* List scanned devices */}
      <Text>Available Devices:</Text>
      {bluetoothDevices.map((device, index) => (
        <TouchableOpacity
          key={`scanned-${index}`}
          onPress={() => connectToPrinter(device)}
          disabled={connecting}
        >
          <Text>{device.name || 'Unknown Device'}</Text>
          <Text>{device.address}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * EXAMPLE 3: Tax Receipt Printer
 * Shows how to use in a different type of receipt (Tax, Property, etc.)
 */
export const TaxReceiptExample = ({ taxData }) => {
  const {
    connectedDevice,
    printing,
    scanForDevices,
    printBuffer,
  } = useBluetoothPrinter();

  const printTaxReceipt = async () => {
    if (!connectedDevice) {
      scanForDevices();
      return;
    }

    try {
      const connection = new InMemory();
      const printer = await Printer.CONNECT('TM-T20', connection);

      // Header
      await printer.writeln('TAX RECEIPT', Style.Bold, Align.Center);
      await printer.writeln('================================', Style.Normal, Align.Center);

      // Receipt details
      await printer.writeln(`Receipt No: ${taxData.receiptNo}`, Style.Normal, Align.Left);
      await printer.writeln(`Date: ${taxData.date}`, Style.Normal, Align.Left);
      await printer.writeln(`Property ID: ${taxData.propertyId}`, Style.Normal, Align.Left);
      await printer.writeln(`Owner: ${taxData.ownerName}`, Style.Normal, Align.Left);
      await printer.writeln(`Tax Amount: Rs. ${taxData.amount}`, Style.Bold, Align.Left);

      // Footer
      await printer.feed(2);
      await printer.writeln('Thank you!', Style.Normal, Align.Center);
      await printer.cutter();
      await printer.feed(3);

      // Print
      const buffer = connection.buffer();
      await printBuffer(buffer);
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={printTaxReceipt} disabled={printing}>
        <Text>{connectedDevice ? 'Print Tax Receipt' : 'Connect Printer'}</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * EXAMPLE 4: Using with Property Tax, Trade License, etc.
 *
 * The same BluetoothService can be used across all modules:
 * - Water billing receipts
 * - Property tax receipts
 * - Trade license receipts
 * - Any other receipt types
 *
 * Just import the hook and use it the same way:
 *
 * import { useBluetoothPrinter } from '../../utils/BluetoothService';
 *
 * const {
 *   connectedDevice,
 *   printing,
 *   scanForDevices,
 *   connectToPrinter,
 *   printBuffer,
 * } = useBluetoothPrinter();
 *
 * Then format your specific receipt and print using printBuffer()
 */

/**
 * AVAILABLE HOOK PROPERTIES AND METHODS:
 *
 * States:
 * - bluetoothDevices: Array of scanned Bluetooth devices
 * - pairedDevices: Array of already paired devices
 * - scanning: Boolean indicating if currently scanning
 * - connecting: Boolean indicating if currently connecting
 * - connectedDevice: Currently connected device object or null
 * - printing: Boolean indicating if currently printing
 *
 * Methods:
 * - scanForDevices(): Scan for available Bluetooth printers
 * - connectToPrinter(device): Connect to a specific device
 * - disconnectPrinter(): Disconnect from current printer
 * - printBuffer(buffer, options): Print ESC/POS formatted buffer
 * - isConnected(): Check if connected to a printer
 * - convertBufferToBytes(buffer): Convert buffer to byte array
 */
