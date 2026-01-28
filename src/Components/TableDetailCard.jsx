import React, { useState,useRef } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
function TableDetailCard({ title, note, headers = [], data = [] }) {
    const hasData = data && data.length > 0;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', info: '' });
    const headerScrollRef = useRef(null);
    const bodyScrollRef = useRef(null);
    const openInfoModal = (label, info) => {
        setModalContent({ title: label, info: info });
        setModalVisible(true);
    };
    const COLUMN_WIDTH = responsiveWidth(35); 

    const syncScroll = (event) => {
        const x = event.nativeEvent.contentOffset.x;
        // Scroll the header to match the body's horizontal offset
        if (headerScrollRef.current) {
            headerScrollRef.current.scrollTo({ x, animated: false });
        }
    };
    const renderTableBody = () => {
        if (!hasData) {
            return (
                <View style={styles.tableBodyContainer}>
                    <Text style={styles.noDataText}>No table data available.</Text>
                </View>
            );
        }

        return data.map((item, index) => (
            <View key={`val-${index}`} style={styles.tableBodyRow}>
                {item.cells.map((cellValue, cellIndex) => (
                    <Text key={cellIndex} style={[styles.tableCell, { width: COLUMN_WIDTH }]}>
                        {cellValue ? cellValue: 'NA'}
                    </Text>
                ))}
            </View>
        ));
    };

    return (
        <View style={styles.outerContainer}>
            {/* 1. HEADING (Merged Top Section) */}
            {title && (
                <View style={styles.headingWrapper}>
                    <Text style={styles.headingText}>{title}</Text>
                </View>
            )}
            
            <View style={styles.card}>
                {note && (
                    <Text style={styles.note}>{note}</Text>
                )}                

                <ScrollView 
                    style={styles.tableScrollVertical} 
                    contentContainerStyle={styles.tableContentVertical}
                    stickyHeaderIndices={[0]} // Makes the header wrapper sticky
                    directionalLockEnabled={true} 
                    nestedScrollEnabled={true} 
                    scrollsToTop={false}
                >
                    {/* STICKY HEADER WRAPPER (Index 0) */}
                    <View style={styles.tableHeaderWrapper}>
                        {/* Horizontal ScrollView for the actual headers */}
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            ref={headerScrollRef} // Ref for synchronization
                            scrollEnabled={false} // Prevent direct scrolling of header by user
                        >
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                {headers?.map((headerText, index) => (
                                    <Text key={`head-${index}`} style={[styles.tableCell, styles.headerText, { width: COLUMN_WIDTH }]}>
                                        {headerText}
                                    </Text>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    
                    {/* TABLE BODY CONTAINER */}
                    {/* Horizontal ScrollView for the body content */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        ref={bodyScrollRef} // Ref for synchronization
                        onScroll={syncScroll} // Attach sync function
                        scrollEventThrottle={16}
                    >
                        <View style={styles.tableBodyContainer}>
                            {renderTableBody()}                            
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>

            {/* --- MODAL COMPONENT (Info Modal remains the same) --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalContent.title} Information</Text>
                        <Text style={styles.modalInfo}>{modalContent.info}</Text>
                        <TouchableOpacity 
                            style={styles.modalCloseButton} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default TableDetailCard;

const styles = StyleSheet.create({
    outerContainer: {
        marginHorizontal: responsiveWidth(3), 
        marginVertical: responsiveHeight(1), 
    },
    headingWrapper: {
        backgroundColor: Colors.primary || '#007AFF',
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(4),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,        
        borderWidth: 1, 
        borderColor: Colors.primary || '#007AFF', 
        borderBottomWidth: 0,
        elevation: 6,
        zIndex: 2, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    headingText: {
        fontSize: responsiveWidth(4.5), 
        fontWeight: '700', 
        color: '#FFFFFF', 
        textAlign: 'left',
    },

    card: {
        backgroundColor: Colors.cardBackground || '#FFFFFF',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginTop: -1, 
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingTop: 0, 
        paddingBottom: 0,
        paddingHorizontal: 0,
        
        borderWidth: 1, 
        borderColor: Colors.cardBorder || '#f0f0f0',
        borderTopWidth: 0,
        elevation: 4,
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    note: {
        fontSize: responsiveWidth(3.5),
        color: Colors.textMuted || '#777',
        fontStyle: 'italic',
        marginVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(4), 
    },
    noDataText: {
        fontSize: responsiveWidth(4),
        color: Colors.textMuted || '#777',
        textAlign: 'center',
        paddingVertical: responsiveHeight(2),
    },

    tableScrollVertical: {
        maxHeight: responsiveHeight(50), 
        paddingVertical: responsiveHeight(1), 
    },
    tableContentVertical: {
        flexGrow: 1, 
    },
    
    tableHeaderWrapper: {
        backgroundColor: '#FFFFFF', 
        borderBottomWidth: 1,
        borderBottomColor: Colors.rowDivider || '#ddd',
        zIndex: 10, 
    },
    tableRow: {
        flexDirection: 'row',
        minHeight: responsiveHeight(5),
    },
    tableHeader: {
        backgroundColor: Colors.tableHeader || '#0b0b0bff',
        borderRightWidth: 1,
        borderRightColor: Colors.rowDivider || '#4f4848ff',        
    },
    headerText: {
        fontWeight: 'bold',
        color:"#fff",
        textAlign: 'center',
        paddingVertical: responsiveHeight(1),
        fontSize: responsiveWidth(3.5),
    },
    tableCell: {
        paddingHorizontal: responsiveWidth(1.5),
        paddingVertical: responsiveHeight(1),
        borderRightWidth: 1,
        borderRightColor: Colors.rowDivider || '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: responsiveWidth(3.2),
        color: Colors.textValue || '#222',
        textAlign: 'left',
    },
    tableBodyContainer: {
        // The container for the actual data rows
    },
    tableBodyRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.rowDivider || '#eee',
        backgroundColor: Colors.cardBackground || '#FFFFFF',
    },

    // ... (Modal styles are omitted for brevity, assumed correct)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.cardBackground || '#fff',
        borderRadius: 12,
        padding: responsiveWidth(6),
        width: '85%',
        maxHeight: '70%',
        elevation: 10,
    },
    modalTitle: {
        fontSize: responsiveWidth(5),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1),
        color: Colors.headingColor || '#1f3e7a',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: responsiveHeight(0.5),
    },
    modalInfo: {
        fontSize: responsiveWidth(4),
        color: Colors.textValue || '#333',
        marginVertical: responsiveHeight(1.5),
        lineHeight: responsiveHeight(2.5),
    },
    modalCloseButton: {
        backgroundColor: Colors.primary || '#007AFF',
        borderRadius: 8,
        padding: responsiveHeight(1.5),
        marginTop: responsiveHeight(2),
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: responsiveWidth(4),
    },
});