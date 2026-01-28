import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from './Header';
import React, { useState } from 'react';

const staffData = [
  {
    id: '1',
    wardNo: '12',
    owner: 'John Doe',
    grad: 'BSc',
    address: 'Street 1',
  },
  {
    id: '2',
    wardNo: '13',
    owner: 'Jane Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '3',
    wardNo: '14',
    owner: 'Alice Johnson',
    grad: 'MSc',
    address: 'Street 3',
  },
  {
    id: '2',
    wardNo: '13',
    owner: 'Jane Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '3',
    wardNo: '14',
    owner: 'Alice Johnson',
    grad: 'MSc',
    address: 'Street 3',
  },
  {
    id: '2',
    wardNo: '13',
    owner: 'Jane Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '3',
    wardNo: '14',
    owner: 'Alice Johnson',
    grad: 'MSc',
    address: 'Street 3',
  },
  {
    id: '2',
    wardNo: '13',
    owner: 'Jane Smith',
    grad: 'BA',
    address: 'Street 2',
  },
  {
    id: '3',
    wardNo: '14',
    owner: 'Alice Johnson',
    grad: 'MSc',
    address: 'Street 3',
  },
];

const StaffCard = ({ item }) => (
  <View style={styles.card}>
    <View>
      <Text style={styles.name}>Owner: {item.owner}</Text>
      <Text style={styles.detail}>Staff No: {item.wardNo}</Text>
      <Text style={styles.detail}>Ward No: {item.wardNo}</Text>
      <Text style={styles.detail}>Graduation: {item.grad}</Text>
      <Text style={styles.detail}>Address: {item.address}</Text>
    </View>
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => alert(`View details for ${item.owner}`)}
    >
      <Icon name="visibility" size={24} color="#4A90E2" />
    </TouchableOpacity>
  </View>
);

const StaffList = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(staffData);

  const handleSearch = text => {
    setSearch(text);
    const filtered = staffData.filter(item =>
      item.owner.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header navigation={navigation} />
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
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StaffCard item={item} />}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default StaffList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#4a90e2',
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  iconButton: {
    padding: 8,
  },
});
