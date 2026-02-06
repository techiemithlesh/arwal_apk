import React, { useEffect, useState } from 'react';
import {
    Button, Text, View, NativeModules, Alert,
    Modal, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Ensure you have this
import PaymentHelper from '../../../../helpers/NttPaymentHelper';
import { getToken } from '../../../../utils/auth';
import axios from 'axios';
import { decryptOnlineResponseApi, initOnlinePropPaymentApi } from '../../../../api/apiRoutes';

const { NdpsAESLibrary } = NativeModules;

function NttDataPaymentModel({ id, visible, setVisible, onPaymentSuccess = () => { } }) {
    const [token, setToken] = useState(null);
    const navigation = useNavigation();
    const ndps = new PaymentHelper();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const fetchedToken = await getToken();
                if (fetchedToken) {
                    setToken(fetchedToken);
                }
            } catch (error) {
                console.error('Failed to load token:', error);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const openPaymentModel = async (encryptedStr, merchantDetails) => {
        try {

            let tokenIdResp = await ndps.getAtomTokenId(encryptedStr, merchantDetails);
            const response = await axios.post(
                decryptOnlineResponseApi,
                { encData: tokenIdResp },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response?.data?.status) {
                const parsedResponse = response?.data?.data;
                // let parsedResponse = JSON.parse(decryptedStr);

                if (parsedResponse["responseDetails"]["txnStatusCode"] === "OTS0000") {
                    let aipayContent = ndps.openAipayPopUp(parsedResponse["atomTokenId"], merchantDetails);

                    // SUCCESS: Close and Navigate
                    setVisible(false);
                    navigation.navigate('NttDataPayment', {
                        htmlPage: aipayContent,
                        merchantDetails: merchantDetails,
                        onPaymentSuccess: onPaymentSuccess // Pass the refresh function here
                    });
                } else {
                    // LOGIC ERROR: Close and Alert
                    setVisible(false);
                    Alert.alert("Error", "Transaction initialization failed.");
                }
            } else {
                // API ERROR: Close and Alert
                setVisible(false);
                Alert.alert("Error", "Server returned failed status.");
            }
        } catch (e) {
            // CRASH/NETWORK ERROR: Close and Alert
            console.error("Decryption Error:", e);
            setVisible(false); // <--- Ensure this is here
            Alert.alert("Error", "Could not process payment response.");
        }
    };

    const handleOpenPay = async () => {

        setLoading(true);
        try {
            const response = await axios.post(
                initOnlinePropPaymentApi,
                {
                    paymentType: "FULL",
                    id: id,
                    successUrl: "https://yourdomain.com/success",
                    failUrl: "https://yourdomain.com/fail",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            console.log("response", response,token);

            if (response?.data?.status) {
                const data = response?.data?.data; // This is your merchantDetails                
                // Pass the payload and the merchant data to the next step
                await openPaymentModel(data?.payloadHashValue, data);
            } else {
                Alert.alert("Error", response?.data?.message || "Initialization failed");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            Alert.alert("Network Error", "Unable to connect to payment server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Payment Confirmation</Text>
                    <Text style={styles.detailText}>Property ID: {id}</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.btn, styles.cancelBtn]}
                                onPress={() => setVisible(false)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, styles.payBtn]}
                                onPress={handleOpenPay}
                            >
                                <Text style={styles.btnText}>Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    detailText: {
        marginBottom: 20,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    btn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelBtn: { backgroundColor: '#6c757d' },
    payBtn: { backgroundColor: '#28a745' },
    btnText: { color: 'white', fontWeight: 'bold' }
});

export default NttDataPaymentModel;