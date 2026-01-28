import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PreviewScreen = ({ route }) => {
  const { formData } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preview Data</Text>
      <Text>Ward No: {formData.wardDropdown}</Text>
      <Text>New Ward No: {formData.newWardDropdown}</Text>
      <Text>Zone: {formData.zoneDropdown}</Text>
      <Text>Property Type: {formData.propertyDropdown}</Text>
      {/* Add more fields as needed */}
      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Floors:</Text>
      {formData.floors && formData.floors.length > 0 ? (
        formData.floors.map((floor, idx) => (
          <View key={idx} style={styles.floorBox}>
            <Text>Floor Name: {floor.name}</Text>
            <Text>Construction Type: {floor.constructionType}</Text>
            <Text>Occupancy Type: {floor.occupancyType}</Text>
            <Text>Usage Type: {floor.usageType}</Text>
            <Text>Date From: {floor.fromDate ? new Date(floor.fromDate).toLocaleDateString() : ''}</Text>
            <Text>Date Upto: {floor.toDate ? new Date(floor.toDate).toLocaleDateString() : ''}</Text>
          </View>
        ))
      ) : (
        <Text>No extra floors added.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10, alignSelf: 'center' },
  floorBox: { marginBottom: 10, padding: 5, borderWidth: 1, borderColor: '#eee', borderRadius: 5 },
});

export default PreviewScreen; 