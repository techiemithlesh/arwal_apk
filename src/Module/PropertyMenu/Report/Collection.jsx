import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Colors from '../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import { PROPERTY_REPORTS_API } from '../../../api/apiRoutes';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
import { useMasterData } from '../../../Context/MasterDataContext';
import Pagination from '../../../Components/Pagination';
import PaymentReceiptModal from '../Saf/PaymentReceiptModal';
import { getUserDetails } from '../../../utils/auth';

const Collection = () => {
  const [wardOptions, setWardOptions] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const [datas, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [user, setUser] = useState(null);

  const { wardList } = useMasterData();

  useEffect(() => {
    if (wardList && wardList.length > 0) {
      const wards = [
        { label: 'All Wards', value: null },
        ...wardList.map(item => ({
          label: `Ward No: ${item.wardNo}`,
          value: item.id,
        })),
      ];
      setWardOptions(wards);
    }
  }, [wardList]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use await to wait for the data to actually arrive
        const details = await getUserDetails();

        console.log('Actual User Details:', details?.id);
        setUser(details?.id);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUser();
  }, []);

  const paymentModeOptions = [
    { label: 'All Modes', value: null },
    { label: 'CASH', value: 'CASH' },
    { label: 'DD', value: 'DD' },
    { label: 'ONLINE', value: 'ONLINE' },
  ];

  const fetchReport = async (pageNo = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const token = await getToken();
      const payload = {
        userId: user,
        page: pageNo,
        perPage: 10,
        key: null,
        fromDate: fromDate ? fromDate.toISOString().split('T')[0] : '',
        uptoDate: toDate ? toDate.toISOString().split('T')[0] : '',
        wardId: selectedWard ? Number(selectedWard) : null,
        paymentMode: selectedMode || null,
        appType: null,
      };

      const response = await axios.post(
        PROPERTY_REPORTS_API.COLLECTION_REPORT_API,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log('Collection Report Response:', response.data);

      const responseData = response.data.data;
      setLastPage(responseData.lastPage || 1);

      if (isLoadMore) {
        setData(prev => [...prev, ...responseData.data]);
      } else {
        setData(responseData.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReport(1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchReport(1);
  };

  const loadMore = () => {
    if (page < lastPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReport(nextPage, true);
    }
  };

  const apShowReceipt = item => {
    setReceiptData(item);
    setShowReceipt(true);
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, { width: 100 }]}>SAF No</Text>
      <Text style={[styles.tableHeaderCell, { width: 120 }]}>Owner</Text>
      <Text style={[styles.tableHeaderCell, { width: 100 }]}>Mobile</Text>
      <Text style={[styles.tableHeaderCell, { width: 60 }]}>Ward</Text>
      <Text style={[styles.tableHeaderCell, { width: 100 }]}>Mode</Text>
      <Text style={[styles.tableHeaderCell, { width: 80 }]}>Demand</Text>
      <Text style={[styles.tableHeaderCell, { width: 80 }]}>Payable</Text>
      <Text style={[styles.tableHeaderCell, { width: 120 }]}>Tran No</Text>
      <Text style={[styles.tableHeaderCell, { width: 100 }]}>Date</Text>
      <Text style={[styles.tableHeaderCell, { width: 120 }]}>Collected By</Text>
      <Text style={[styles.tableHeaderCell, { width: 70 }]}>Action</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: 100 }]}>{item.safNo}</Text>
      <Text style={[styles.tableCell, { width: 120 }]}>{item.ownerName}</Text>
      <Text style={[styles.tableCell, { width: 100 }]}>{item.mobileNo}</Text>
      <Text style={[styles.tableCell, { width: 60 }]}>{item.wardNo}</Text>
      <Text style={[styles.tableCell, { width: 100 }]}>{item.paymentMode}</Text>
      <Text style={[styles.tableCell, { width: 80 }]}>{item.demandAmt}</Text>
      <Text style={[styles.tableCell, { width: 80 }]}>{item.payableAmt}</Text>
      <Text style={[styles.tableCell, { width: 120 }]}>{item.tranNo}</Text>
      <Text style={[styles.tableCell, { width: 100 }]}>{item.tranDate}</Text>
      <Text style={[styles.tableCell, { width: 120 }]}>{item.userName}</Text>
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => apShowReceipt(item)}
      >
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderNavigation />

      {/* 🔹 MODERN SEARCH SECTION */}
      <View style={styles.mainSearchCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Filter Reports</Text>
          <Text style={styles.cardHeaderSub}>
            Narrow down your search results
          </Text>
        </View>

        <View style={styles.filterGrid}>
          {/* Row 1: Dates */}
          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.newLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={styles.inputText}>
                  {fromDate.toLocaleDateString()}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.newLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.modernInput}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={styles.inputText}>
                  {toDate.toLocaleDateString()}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Ward & Payment Mode */}
          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.newLabel}>Ward No.</Text>
              <Dropdown
                data={wardOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Ward"
                value={selectedWard}
                onChange={item => setSelectedWard(item.value)}
                style={styles.modernDropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.newLabel}>Payment Mode</Text>
              <Dropdown
                data={paymentModeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Mode"
                value={selectedMode}
                onChange={item => setSelectedMode(item.value)}
                style={styles.modernDropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.modernSearchBtn}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.modernSearchBtnText}>APPLY FILTERS</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          onChange={(e, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          onChange={(e, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {/* Table List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ marginTop: 15 }}
      >
        <View style={{ minWidth: 1050, marginLeft: 10 }}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: rh(10) }}
            />
          ) : (
            <FlatList
              data={datas}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={renderItem}
              ListHeaderComponent={<TableHeader />}
              stickyHeaderIndices={[0]}
              contentContainerStyle={{ paddingBottom: 20 }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : null
              }
            />
          )}
        </View>
      </ScrollView>

      {/* Pagination */}
      <Pagination
        page={page}
        lastPage={lastPage}
        total={datas.length}
        onNext={() => {
          if (page < lastPage) {
            const n = page + 1;
            setPage(n);
            fetchReport(n);
          }
        }}
        onPrev={() => {
          if (page > 1) {
            const p = page - 1;
            setPage(p);
            fetchReport(p);
          }
        }}
        onPageChange={num => {
          setPage(num);
          fetchReport(num);
        }}
      />

      <PaymentReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        paymentDtls={receiptData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  /* 🔶 Modern Filter Card */
  mainSearchCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: rw(3),
    marginTop: rh(1),
    borderRadius: 15,
    padding: rw(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
    borderTopWidth: 5,
    borderTopColor: Colors.primary,
  },

  cardHeader: {
    marginBottom: rh(1),
  },

  cardHeaderTitle: {
    fontSize: rf(2.1),
    fontWeight: '700',
    color: '#1A1C1E',
  },

  cardHeaderSub: {
    fontSize: rf(1.4),
    color: '#6C757D',
  },

  filterGrid: {
    marginTop: rh(1),
  },

  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1.5),
  },

  formGroup: {
    width: '48%',
  },

  newLabel: {
    fontSize: rf(1.5),
    color: '#495057',
    fontWeight: '600',
    marginBottom: 5,
  },

  modernInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: rw(3),
    height: rh(5.5),
  },

  inputText: {
    fontSize: rf(1.6),
    color: '#212529',
  },

  calendarIcon: { fontSize: rf(1.8) },

  modernDropdown: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: rw(3),
    height: rh(5.5),
  },

  placeholderStyle: { fontSize: rf(1.6), color: '#ADB5BD' },
  selectedTextStyle: { fontSize: rf(1.6), color: '#212529' },

  modernSearchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: rh(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(0.5),
    elevation: 2,
  },

  modernSearchBtnText: {
    color: '#fff',
    fontSize: rf(1.8),
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },

  /* 🔶 Table Styles */
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: rh(1.5),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  tableHeaderCell: {
    color: '#fff',
    fontWeight: '700',
    fontSize: rf(1.3),
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: rh(1.2),
    borderBottomWidth: 0.5,
    borderBottomColor: '#E9ECEF',
    alignItems: 'center',
  },

  tableCell: {
    fontSize: rf(1.3),
    color: '#495057',
    textAlign: 'center',
  },

  viewBtn: {
    width: 60,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: rw(1),
  },

  viewBtnText: {
    color: '#fff',
    fontSize: rf(1.3),
    fontWeight: '600',
  },
});

export default Collection;
