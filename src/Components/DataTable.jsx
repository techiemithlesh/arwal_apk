import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
// Replaced with a more modern Icon library if desired, but sticking to MaterialIcons
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { Picker } from '@react-native-picker/picker';

// --- Mock Export Functions ---
const mockExportToExcel = async (title, headers, data) => {
  Alert.alert(
    'Export Info',
    'Excel export needs specialized libraries (e.g., react-native-excel or CSV export) in a mobile environment.',
  );
  return Promise.resolve();
};

const mockExportToPDF = async (title, headers, data) => {
  Alert.alert(
    'Export Info',
    'PDF generation (jsPDF) is not supported. Use RN libraries like react-native-html-to-pdf or a backend solution.',
  );
  return Promise.resolve();
};
// -----------------------------

export default function DataTable({
  data = [],
  headers = [],
  renderRow,
  footerRow = null,
  title = 'Application List', // Default title changed to match screenshot
  actionButton,
  itemsPerPage = 5,
  totalPages = 1,
  currentPage = 1,
  totalItem = 1,
  fetchAllData = () => Promise.resolve([]),
  setPageNo = () => { },
  setItemsPerPage = () => { },
  isSearchInput = true,
  search = '',
  setSearch = () => { },
  onSearch = () => { },
  filterComponent = null,
  links = null,
}) {
  const [searchInput, setSearchInput] = useState(search);
  const [isExcelExporting, setIsExcelExporting] = useState(false);
  const [isPDFExporting, setIsPDFExporting] = useState(false);

  // Filter logic remains the same
  const filteredData = useMemo(() => {
    const keyword = searchInput.toLowerCase().trim();
    if (!keyword) return data;

    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === 'string' && value.toLowerCase().includes(keyword),
      ),
    );
  }, [searchInput, data]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setPageNo(page);
  };

  const handleSearchClick = () => {
    setSearch(searchInput);
    setPageNo(1);
    onSearch();
  };

  const exportToExcel = async () => {
    setIsExcelExporting(true);
    const allData = await fetchAllData();
    try {
      await mockExportToExcel(title, headers, allData);
    } catch (err) {
      Alert.alert('Error', 'Excel export failed.');
      console.error('Excel export failed:', err);
    } finally {
      setIsExcelExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsPDFExporting(true);
    const allData = await fetchAllData();
    try {
      await mockExportToPDF(title, headers, allData);
    } catch (err) {
      Alert.alert('Error', 'PDF export failed.');
      console.error('PDF export failed:', err);
    } finally {
      setIsPDFExporting(false);
    }
  };

  // Pagination rendering logic for simplicity
  const renderPaginationButtons = () => {
    const pages = [];
    const maxVisible = 5; 
    
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    const finalStart = Math.max(1, end - maxVisible + 1);

    for (let i = finalStart; i <= end; i++) {
        pages.push(i);
    }

    if (finalStart > 1) {
        if (finalStart > 2) pages.unshift('...');
        if (finalStart > 1) pages.unshift(1);
    }

    if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        if (end < totalPages) pages.push(totalPages);
    }

    const uniquePages = [...new Set(pages)];

    return uniquePages.map((page, idx) =>
      page === '...' ? (
        <Text key={`ellipsis-${idx}`} style={styles.paginationEllipsis}>...</Text>
      ) : (
        <TouchableOpacity
          key={page}
          onPress={() => handlePageChange(page)}
          style={[
            styles.paginationButton,
            currentPage === page ? styles.paginationActive : styles.paginationInactive,
          ]}
        >
          <Text style={currentPage === page ? styles.textWhite : styles.textDark}>
            {page}
          </Text>
        </TouchableOpacity>
      ),
    );
  };

  const itemsPerPageOptions = useMemo(
    () => [5,10, 25, 50, 100, 500, 1000].map(String),
    [],
  );
  const currentItemsPerPage = itemsPerPage === totalItem ? '-1' : String(itemsPerPage);

  return (
    // Outer container for padding/margin
    <View style={styles.outerContainer}>
      
      {/* Title and Action Button */}
      <View style={styles.header}>
        <Text style={styles.titleText}>{title}</Text>
        {actionButton}
      </View>

      {/* Export Buttons and Search Bar */}
      <View style={styles.controlsContainer}>
        {/* Export Buttons */}
        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonExcel]}
            onPress={exportToExcel}
            disabled={isExcelExporting}
          >
            {isExcelExporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textWhite}>Excel</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPDF]}
            onPress={exportToPDF}
            disabled={isPDFExporting}
          >
            {isPDFExporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textWhite}>PDF</Text>
            )}
          </TouchableOpacity>
        </View>

        {filterComponent && <View style={styles.filterContainer}>{filterComponent}</View>}

        {/* Search Input and Button */}
        <View style={styles.searchRow}>
          {isSearchInput && (
            <TextInput
              style={styles.textInput}
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearchClick}
              returnKeyType="search"
            />
          )}
          <TouchableOpacity
            onPress={handleSearchClick}
            style={[styles.button, styles.buttonSearch]}
          >
            <Text style={styles.textWhite}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items per page Selector */}
      <View style={styles.itemsPerPageContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.textSmall}>Show</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={currentItemsPerPage}
              style={styles.picker}
              onValueChange={(value) => {
                const numValue = value === '-1' ? totalItem : Number(value);
                setItemsPerPage(numValue);
                setPageNo(1);
              }}
              mode="dropdown"
            >
              {itemsPerPageOptions.map((size) => (
                <Picker.Item key={size} label={size} value={size} />
              ))}
              <Picker.Item label="All" value="-1" />
            </Picker>
          </View>
          <Text style={styles.textSmall}>items per page</Text>
        </View>
        {links}
      </View>

      {/* Main Data Container (Assuming it holds the cards/rows, matching the screenshot) */}
      <View style={styles.listContainer}>
        <ScrollView nestedScrollEnabled={true}>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => renderRow(item, index, currentPage, itemsPerPage))
          ) : (
            <View style={styles.noRecordsRow}>
              <Text style={styles.noRecordsText}>No records found.</Text>
            </View>
          )}
          {footerRow}
        </ScrollView>
      </View>

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <View style={styles.paginationButtonsContainer}>
          <TouchableOpacity
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={[styles.paginationNavButton, currentPage === 1 && styles.disabled]}
          >
            <Icon name="chevron-left" size={24} color={currentPage === 1 ? '#AAA' : '#555'} />
          </TouchableOpacity>

          {renderPaginationButtons()}

          <TouchableOpacity
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={[styles.paginationNavButton, currentPage === totalPages && styles.disabled]}
          >
            <Icon name="chevron-right" size={24} color={currentPage === totalPages ? '#AAA' : '#555'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- Styles ---
const COLORS = {
  colorPrimary: '#3B82F6', 
  colorSuccess: '#10B981', 
  colorDanger: '#EF4444', 
  colorBorder: '#D1D5DB', 
  colorTextDark: '#333', // 👈 Moved this definition outside
  colorTextLight: '#555',
  colorGrayBackground: '#F0F0F0',
};
const styles = StyleSheet.create({
  // --- Colors & Base Styles ---
  colorPrimary: '#3B82F6', // Blue for Search/Active
  colorSuccess: '#10B981', // Green for Excel
  colorDanger: '#EF4444', // Red for PDF
  colorBorder: '#D1D5DB', // Light Gray Border
  colorTextDark: '#333',
  
  textWhite: { color: '#fff' },
  textDark: { color: COLORS.colorTextDark },
  textSmall: { fontSize: 13, color: '#555' },
  disabled: { opacity: 0.5 },

  outerContainer: {
    padding: 15, // Provide general padding
    backgroundColor: '#fff',
    flex: 1,
  },

  // --- Header ---
  header: {
    paddingBottom: 15,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 22,
    color: COLORS.colorTextDark,
  },

  // --- Controls (Export, Search) ---
  controlsContainer: {
    marginBottom: 10,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    minHeight: 40,
    // Add shadow/elevation for a lifted feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonExcel: {
    backgroundColor: COLORS.colorSuccess,
  },
  buttonPDF: {
    backgroundColor: COLORS.colorDanger,
  },
  buttonSearch: {
    backgroundColor: COLORS.colorPrimary,
    paddingHorizontal: 20, // Make the Search button wider
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.colorBorder,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#fff',
    color: '#000',
    minHeight: 45,
    fontSize: 15,
  },

  // --- Items per page (Picker) ---
  itemsPerPageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  pickerBox: {
    width: 80,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.colorBorder,
    justifyContent: 'center',
    overflow: 'hidden', 
  },
  picker: {
    width: '100%',
    height: '100%',
    // iOS text alignment/size can be adjusted here if needed
  },

  // --- List/Card Container (Replacing Table Wrapper) ---
  listContainer: {
    // If the data is rendered as cards (as in the screenshot), this is the list wrapper
    flex: 1, // Allow the scrollview to take available space
  },
  noRecordsRow: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    marginTop: 10,
  },
  noRecordsText: {
    color: '#888',
    fontSize: 16,
  },

  // --- Pagination Styles ---
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paginationInfo: {
    fontSize: 14,
    color: '#555',
  },
  paginationButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationNavButton: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  paginationActive: {
    backgroundColor: COLORS.colorPrimary,
  },
  paginationInactive: {
    backgroundColor: '#E5E7EB',
  },
  paginationEllipsis: {
    paddingHorizontal: 5,
    fontSize: 18,
    color: '#AAA',
  },
});