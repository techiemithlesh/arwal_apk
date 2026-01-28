import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from './Header';

const sampleData = [
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '14',
    owner: 'Alice Smith',
    grad: 'BA',
    address: 'Street 2',
  },
];

const StaffInformation = () => {
  const [data, setData] = useState(sampleData);
  const [search, setSearch] = useState('');

  const handleSearch = text => {
    setSearch(text);
    const filtered = sampleData.filter(item =>
      item.owner.toLowerCase().includes(text.toLowerCase()),
    );
    setData(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.wardNo}</Text>
      <Text style={styles.cell}>{item.owner}</Text>
      <Text style={styles.cell}>{item.grad}</Text>
      <Text style={styles.cell}>{item.address}</Text>
      <TouchableOpacity onPress={() => alert(`View ${item.owner}`)}>
        <Icon name="remove-red-eye" size={22} color="#2196F3" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      {/* Top Row: Search + Inbox */}
      <View style={styles.topRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Owner"
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity>
          <Icon name="inbox" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Export Buttons */}
      <View style={styles.exportRow}>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="file-download" size={24} color="#4CAF50" />
          <Text style={styles.iconLabel}>Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="picture-as-pdf" size={24} color="#F44336" />
          <Text style={styles.iconLabel}>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Ward No.</Text>
        <Text style={styles.headerText}>Owner</Text>
        <Text style={styles.headerText}>Grad.</Text>
        <Text style={styles.headerText}>Address</Text>
        <Text style={styles.headerText}>Action</Text>
      </View>

      {/* FlatList Table */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found</Text>
        }
      />
    </View>
  );
};

export default StaffInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
    padding: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  exportRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconLabel: {
    marginLeft: 4,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
