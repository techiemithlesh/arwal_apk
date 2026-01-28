import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';
import HeaderNavigation from '../../../../../Components/HeaderNavigation';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const SubmitSummaryPage = ({ route }) => {
  const { submissionData, location, photos, remarks, id, status } =
    route.params;

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Header */}
      <HeaderNavigation />

      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Submission Info */}
        <Card title="Submission Summary">
          <Text>
            <Text style={styles.label}>Submission ID:</Text> {id}
          </Text>
          <Text>
            <Text style={styles.label}>Status:</Text> {status}
          </Text>
          <Text>
            <Text style={styles.label}>Remarks:</Text> {remarks || '-'}
          </Text>
        </Card>

        {/* ✅ Property Details */}
        <Card title="Property Details">
          <Text>
            <Text style={styles.label}>Ward No:</Text>{' '}
            {submissionData?.['Ward No']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Ward:</Text>{' '}
            {submissionData?.Verified_Ward}
          </Text>
          <Text>
            <Text style={styles.label}>New Ward No:</Text>{' '}
            {submissionData?.['New Ward No (Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified New Ward:</Text>{' '}
            {submissionData?.Verified_NewWard}
          </Text>
          <Text>
            <Text style={styles.label}>Zone:</Text>{' '}
            {submissionData?.['Zone (Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Zone:</Text>{' '}
            {submissionData?.Verified_Zone}
          </Text>
          <Text>
            <Text style={styles.label}>Property Type:</Text>{' '}
            {submissionData?.['Property Type (Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Property Type:</Text>{' '}
            {submissionData?.Verified_PropertyType}
          </Text>
          <Text>
            <Text style={styles.label}>Area of Plot:</Text>{' '}
            {submissionData?.areaOfPlot}
          </Text>
          <Text>
            <Text style={styles.label}>Road Width:</Text>{' '}
            {submissionData?.roadWidth}
          </Text>
        </Card>

        {/* ✅ 1st Floor Example */}
        <Card title="1st Floor Details">
          <Text>
            <Text style={styles.label}>Usage Type:</Text>{' '}
            {submissionData?.['Usage Type (1st Floor Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Usage:</Text>{' '}
            {submissionData?.['Verified_Usage1st Floor']}
          </Text>
          <Text>
            <Text style={styles.label}>Occupancy:</Text>{' '}
            {submissionData?.['Occupancy Type (1st Floor Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Occupancy:</Text>{' '}
            {submissionData?.['Verified_Occupancy1st Floor']}
          </Text>
          <Text>
            <Text style={styles.label}>Construction:</Text>{' '}
            {submissionData?.['Construction Type (1st Floor Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Construction:</Text>{' '}
            {submissionData?.['Verified_Construction1st Floor']}
          </Text>
          <Text>
            <Text style={styles.label}>Built-up Area:</Text>{' '}
            {submissionData?.['Built-up Area (1st Floor Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Built-up:</Text>{' '}
            {submissionData?.['Verified_BuiltUp1st Floor']}
          </Text>
          <Text>
            <Text style={styles.label}>Date From:</Text>{' '}
            {submissionData?.['Date From (1st Floor Current)']}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Date From:</Text>{' '}
            {submissionData?.['Verified_DateFrom1st Floor']}
          </Text>
          <Text>
            <Text style={styles.label}>Date To:</Text>{' '}
            {submissionData?.['Date To (1st Floor Current)'] || '-'}
          </Text>
          <Text>
            <Text style={styles.label}>Verified Date To:</Text>{' '}
            {submissionData?.['Verified_DateTo1st Floor']}
          </Text>
        </Card>

        {/* ✅ Location */}
        <Card title="Location">
          {location ? (
            <>
              <Text>
                <Text style={styles.label}>Latitude:</Text> {location.latitude}
              </Text>
              <Text>
                <Text style={styles.label}>Longitude:</Text>{' '}
                {location.longitude}
              </Text>
            </>
          ) : (
            <Text>No location data</Text>
          )}
        </Card>

        {/* ✅ Photos */}
        <Card title="Captured Photos">
          {photos?.length > 0 ? (
            photos.map((photo, idx) =>
              photo?.uri ? (
                <View key={idx} style={styles.photoBox}>
                  <Text style={styles.label}>{photo.label}</Text>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                </View>
              ) : (
                <Text key={idx}>{photo.label} not captured</Text>
              ),
            )
          ) : (
            <Text>No photos available</Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

export default SubmitSummaryPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e86de',
  },
  label: {
    fontWeight: 'bold',
  },
  photoBox: {
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 150,
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
