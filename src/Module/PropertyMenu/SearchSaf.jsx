import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { useAuthToken } from '../../../utils/auth';
import axios from 'axios';
import { showToast } from '../../../utils/toast';
import { ActivityIndicator, Clipboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import DataTable from '../../../Components/DataTable';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../../Constants/Colors';
import { safSearchApi } from '../../../api/endpoint';
import { statusColor } from '../../../utils/common';

function SearchSaf() {
    const navigation = useNavigation();
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyWord, setKeyWord] = useState("");
    const [wardIds, setWardIds] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const token = useAuthToken();

    useEffect(() => {
        if (token) fetchData();
    }, [token, currentPage, itemsPerPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const payload = {
                wardId: wardIds,
                keyWord: keyWord,
                page: currentPage,
                perPage: itemsPerPage,
            };
            const response = await axios.post(safSearchApi,
                { ...payload },
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
            if (response?.data?.status) {
                const { data } = response.data; console.log(data);
                setDataList(data.data);
                setTotalPages(data.lastPage);
                setTotalItem(data.total);
            }
        } catch (error) {
            console.log('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const copyToClipboard = (safNo) => {
        if (!safNo) {
            showToast('sucess', 'No SAF number to copy');
            return;
        }
        Clipboard.setString(String(safNo)); // ensure it's a string
        showToast('error', `${safNo} copied to clipboard`);
    };

    const renderItem = (item, index) => (
        <View key={index} style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.cardLabel}>Status:</Text>
                <Text style={[styles.value,{fontWeight:'bold'},statusColor(item?.appStatus)]}>{item?.appStatus}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.cardLabel}>Ward No.:</Text>
                <Text style={styles.value}>{item?.wardNo}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Assessment Type:</Text>
                <Text style={styles.value}>{item?.assessmentType}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Property Type:</Text>
                <Text style={styles.value}>{item?.propertyType}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Applicant Name:</Text>
                <Text style={styles.value}>{item?.ownerName}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Mobile No.:</Text>
                <Text style={styles.value}>{item?.mobileNo}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>SAF No.:</Text>
                <View style={styles.safRow}>
                    <TouchableOpacity
                        onPress={() => copyToClipboard(item?.safNo)}
                        style={styles.value}
                    >
                        <Text style={{ textDecorationLine: "underline" }} >{item?.safNo}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Property Address:</Text>
                <Text style={styles.value}>{item?.propAddress}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.cardLabel}>Apply Date:</Text>
                <Text style={styles.value}>{item?.applyDate}</Text>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.button1}
                    onPress={() => navigation.navigate('SafDueDetails', { id: item.id })}
                >
                    <Text style={styles.surveyButtonText}>View</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.surveyContainer}>
                <HeaderNavigation />
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Loading survey data...</Text>
                    </View>
                ) : (
                    <View style={styles.applicationList}>
                        <DataTable
                            data={dataList}
                            renderRow={renderItem}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            totalItem={totalItem}
                            totalPages={totalPages}
                            title='Application List'
                            setPageNo={setCurrentPage}
                            setItemsPerPage={setItemsPerPage}
                            onSearch={handleSearch}
                            setSearch={setKeyWord}
                            search={keyWord}

                        />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SearchSaf;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },

    surveyContainer: { flex: 1 },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(10),
    },

    loadingText: {
        marginTop: 10,
        fontSize: responsiveHeight(2),
        color: '#333',
    },

    title: {
        fontSize: responsiveHeight(2),
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: responsiveWidth(2),
        marginBottom: responsiveHeight(2),
        marginHorizontal: responsiveWidth(2),
    },

    applicationList: {
        flex: 1,
        paddingHorizontal: responsiveWidth(2),
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        flexWrap: 'wrap',
    },
    cardLabel: { fontWeight: '600', color: '#333', width: '40%' },
    value: { color: '#555', width: '55%' },
    safRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // space buttons apart
        marginTop: responsiveHeight(2),
    },

    iconBtn: {
        marginLeft: 10,
    },
    button1: {
        marginTop: 16,
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: responsiveWidth(1),
    },
    surveyButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

});
