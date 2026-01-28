// Pagination.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Colors from '../Module/Constants/Colors';

const Pagination = ({
  page,
  lastPage,
  total,
  onNext,
  onPrev,
  onPageChange,
}) => {
  // Generate page numbers with dots
  const getPageNumbers = () => {
    const pages = [];
    if (lastPage <= 8) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (page <= 3) pages.push(1, 2, 3, 4, 5, '...', lastPage);
      else if (page >= lastPage - 2)
        pages.push(
          1,
          '...',
          lastPage - 4,
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage,
        );
      else pages.push(1, '...', page - 1, page, page + 1, '...', lastPage);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
      <Text style={styles.pageInfo}>
        Page {page} of {lastPage}
      </Text>

      <View style={styles.paginationWrapper}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.arrowBtn, page === 1 && styles.disabledBtn]}
          onPress={onPrev}
          disabled={page === 1}
        >
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>

        {/* Scrollable Page Numbers */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {pageNumbers.map((num, index) => (
            <TouchableOpacity
              key={index}
              disabled={num === '...'}
              onPress={() => num !== '...' && onPageChange(num)}
              style={[
                styles.pageBtn,
                num === page && styles.activeBtn,
                num === '...' && styles.dotBtn,
              ]}
            >
              <Text
                style={[
                  styles.pageNumberText,
                  num === page && styles.activeText,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.arrowBtn, page === lastPage && styles.disabledBtn]}
          onPress={onNext}
          disabled={page === lastPage}
        >
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
  },

  pageInfo: {
    fontSize: responsiveFontSize(1.8),
    color: '#000',
    marginBottom: 8,
  },

  paginationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },

  disabledBtn: {
    backgroundColor: '#CCCCCC',
  },

  arrowText: {
    fontSize: responsiveFontSize(2.2),
    color: '#000',
  },

  pageBtn: {
    minWidth: 35,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginHorizontal: 3,
  },

  activeBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  pageNumberText: {
    fontSize: responsiveFontSize(1.8),
    color: '#000',
  },

  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  dotBtn: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});
