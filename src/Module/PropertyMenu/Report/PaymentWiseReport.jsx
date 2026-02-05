import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
// import { getUserDetails } from '../../../utils/userDetails';
import { getUserDetails } from '../../../utils/auth';

const PaymentWiseReport = () => {
  const [wardOptions, setWardOptions] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [datas, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { wardList } = useMasterData();

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

  useEffect(() => {
    if (wardList && wardList.length > 0) {
      const wards = [
        { label: 'All Wards', value: null },
        ...wardList.map(item => ({
          label: `Ward ${item.wardNo}`,
          value: item.id,
        })),
      ];
      setWardOptions(wards);
    }
  }, [wardList]);

  const paymentModeOptions = [
    { label: 'All Modes', value: null },
    { label: 'CASH', value: 'CASH' },
    { label: 'DD', value: 'DD' },
    { label: 'ONLINE', value: 'ONLINE' },
  ];
  useEffect(() => {
    if (user) {
      console.log('User ready, fetching initial report:', user);
      fetchReport();
    }
  }, [user]);
  const fetchReport = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getToken();

      const payload = {
        userId: user,
        fromDate: fromDate ? fromDate.toISOString().split('T')[0] : '',
        uptoDate: toDate ? toDate.toISOString().split('T')[0] : '',
        wardId: selectedWard ? Number(selectedWard) : null,
        paymentMode: selectedMode || null,
        appType: null,
      };
      console.log('payload', payload);
      const response = await axios.post(
        PROPERTY_REPORTS_API.PAYMENT_MODE_WISE_REPORT_API,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('Payment Wise Report', response.data.data);
      setData(response.data?.data || {});
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleReset = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setSelectedWard(null);
    setSelectedMode(null);
    fetchReport();
  };

  const SummaryCard = ({ title, data }) => {
    if (!data || data.length === 0) return null;
    return (
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>{title}</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.paymentModeColumn]}>
            Payment Mode
          </Text>
          <Text style={[styles.tableHeaderText, styles.countColumn]}>
            Count
          </Text>
          <Text style={[styles.tableHeaderText, styles.amountColumn]}>
            Amount
          </Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.paymentModeColumn]}>
              {item.paymentMode}
            </Text>
            <Text style={[styles.tableCell, styles.countColumn]}>
              {item.count}
            </Text>
            <Text style={[styles.tableCell, styles.amountColumn]}>
              ₹{parseFloat(item.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderNavigation />
      <ScrollView>
        {/* 🔹 MODERN SEARCH SECTION */}
        <View style={styles.mainSearchCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              Collection Summary Filters
            </Text>
            <Text style={styles.cardHeaderSub}>
              Removed collector field for ward-wise view
            </Text>
          </View>

          <View style={styles.filterGrid}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.newLabel}>From Date</Text>
                <View style={styles.modernInputWrapper}>
                  <TouchableOpacity
                    style={styles.modernInput}
                    onPress={() => setShowFromPicker(true)}
                  >
                    <Text style={styles.inputText}>
                      {fromDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.newLabel}>To Date</Text>
                <View style={styles.modernInputWrapper}>
                  <TouchableOpacity
                    style={styles.modernInput}
                    onPress={() => setShowToPicker(true)}
                  >
                    <Text style={styles.inputText}>
                      {toDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.newLabel}>Ward No.</Text>
                <Dropdown
                  data={wardOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="All Wards"
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
                  placeholder="All Modes"
                  value={selectedMode}
                  onChange={item => setSelectedMode(item.value)}
                  style={styles.modernDropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.modernSearchBtn, { flex: 3 }]}
              onPress={fetchReport}
            >
              <Text style={styles.modernSearchBtnText}>GENERATE REPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>RESET</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: rh(5) }}
          />
        ) : (
          <View style={{ paddingBottom: 20 }}>
            <SummaryCard
              title="Door to Door Collection"
              data={datas?.doorToDoor}
            />
            <SummaryCard title="Total Transaction" data={datas?.totalTran} />

            {datas?.netCollection && (
              <View
                style={[
                  styles.tableCard,
                  { borderLeftWidth: 5, borderLeftColor: '#28A745' },
                ]}
              >
                <Text style={[styles.tableTitle, { color: '#28A745' }]}>
                  Net Collection
                </Text>
                <View style={styles.tableRow}>
                  <Text style={[styles.totalLabel, styles.paymentModeColumn]}>
                    Grand Total
                  </Text>
                  <Text style={[styles.totalValue, styles.countColumn]}>
                    {datas.netCollection.count}
                  </Text>
                  <Text style={[styles.totalValue, styles.amountColumn]}>
                    ₹{parseFloat(datas.netCollection.amount).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          onChange={(e, d) => {
            setShowFromPicker(false);
            if (d) setFromDate(d);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          onChange={(e, d) => {
            setShowToPicker(false);
            if (d) setToDate(d);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },

  /* 🔶 Modern Filter Card */
  mainSearchCard: {
    backgroundColor: '#fff',
    marginHorizontal: rw(3),
    marginTop: rh(1.5),
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
    marginBottom: rh(1),
  },
  cardHeader: { marginBottom: rh(1.5) },
  cardHeaderTitle: { fontSize: rf(2), fontWeight: '700', color: '#1A1C1E' },
  cardHeaderSub: { fontSize: rf(1.4), color: '#6C757D' },

  filterGrid: { marginTop: rh(0.5) },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(1.2),
  },
  formGroup: { width: '48%' },
  newLabel: {
    fontSize: rf(1.4),
    color: '#495057',
    fontWeight: '600',
    marginBottom: 5,
  },

  modernInputWrapper: { flexDirection: 'row', alignItems: 'center' },
  modernInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: rw(2),
    height: rh(5),
  },
  inputText: { fontSize: rf(1.4), color: '#212529' },
  clearDateBtn: {
    marginLeft: rw(1),
    padding: 5,
    backgroundColor: '#FFE5E5',
    borderRadius: 5,
  },
  clearDateText: { color: '#FF3B30', fontSize: rf(1.2), fontWeight: 'bold' },

  modernDropdown: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: rw(3),
    height: rh(5),
  },
  placeholderStyle: { fontSize: rf(1.4), color: '#ADB5BD' },
  selectedTextStyle: { fontSize: rf(1.4), color: '#212529' },

  buttonRow: { flexDirection: 'row', alignItems: 'center', marginTop: rh(1) },
  modernSearchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: rh(5.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernSearchBtnText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resetBtn: {
    flex: 1,
    height: rh(5.5),
    backgroundColor: '#6C757D',
    borderRadius: 8,
    marginLeft: rw(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { color: '#fff', fontSize: rf(1.4), fontWeight: '700' },

  /* 🔶 Table / Summary Card Styles */
  tableCard: {
    backgroundColor: '#fff',
    marginHorizontal: rw(3),
    marginTop: rh(1.5),
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tableTitle: {
    fontSize: rf(1.8),
    fontWeight: 'bold',
    padding: rh(1.2),
    backgroundColor: '#F8F9FA',
    color: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    paddingVertical: rh(1),
    paddingHorizontal: rw(3),
  },
  tableHeaderText: { fontWeight: '700', fontSize: rf(1.4), color: '#495057' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(3),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F3F5',
    alignItems: 'center',
  },
  tableCell: { fontSize: rf(1.4), color: '#495057' },

  totalLabel: { fontSize: rf(1.6), fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: rf(1.6), fontWeight: 'bold', color: '#28A745' },

  paymentModeColumn: { flex: 2 },
  countColumn: { flex: 1, textAlign: 'center' },
  amountColumn: { flex: 1.5, textAlign: 'right' },
});

export default PaymentWiseReport;
