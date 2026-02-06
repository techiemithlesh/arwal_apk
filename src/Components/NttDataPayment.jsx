import React, { useState, useRef, useEffect } from "react";
import {
    Linking,
    NativeModules,
    ToastAndroid,
    Alert,
    Platform,
    ActivityIndicator,
    View
} from "react-native";
import { WebView } from "react-native-webview";
import PaymentHelper from '../helpers/NttPaymentHelper';
import axios from "axios";
import { decryptOnlineResponseApi, testOnlineSignatureApi } from "../api/apiRoutes";

const { NdpsAESLibrary } = NativeModules;

function NttDataPayment({ route, navigation }) {
    const ndps = new PaymentHelper();
    const INJECT_JS = 'window.ReactNativeWebView.postMessage(document.getElementsByTagName("h5")[0].innerHTML)';

    const { htmlPage, merchantDetails } = route.params;

    // Use Ref instead of State to avoid async race conditions
    const isOnMobileSdkParam = useRef(false);
    const lastNavUrlRef = useRef("");

    const LoadingIndicatorView = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator color="#0000ff" size="large" />
        </View>
    );

    const decryptFinalResponse = async (data) => {
        console.log("Processing Final Response:", data);
        let isSuccessful = false;
        let splitStr = String(data).split("|");
        let responseToastMsg = "Transaction failed"; // Default

        if (!splitStr[1] || !splitStr[1].includes("encData")) {
            console.warn("No encData token found in payload");
            return;
        }

        let splitEncData = splitStr[1].split("=");
        let encToken = splitEncData[1];

        if (encToken === "cancelTransaction") {
            responseToastMsg = "Transaction has been cancelled";
        } else {
            try {
                const response = await axios.post(decryptOnlineResponseApi, { encData: encToken });

                if (response?.data?.status) {
                    const parsedResponse = response?.data?.data;
                    let signatureStr = ndps.createSigStr(parsedResponse);
                    const signatureResponse = await axios.post(testOnlineSignatureApi, { signatureStr: signatureStr });
                    if (signatureResponse?.data?.status) {
                        const generatedSignatureStr = signatureResponse?.data?.data?.signature;
                        if (generatedSignatureStr === parsedResponse?.payInstrument?.payDetails?.signature) {
                            const statusCode = parsedResponse?.payInstrument?.responseDetails?.statusCode;
                            if (statusCode === "OTS0000" || statusCode === "OTS0551") {
                                responseToastMsg = "Transaction success";
                                isSuccessful = true;
                            }
                        } else {
                            console.log("Signature mismatch!");
                        }
                    }


                }
            } catch (e) {
                console.error("Decryption Error:", e);
            }
        }

        if (Platform.OS === "android") {
            ToastAndroid.show(responseToastMsg, ToastAndroid.SHORT);
        } else {
            Alert.alert("Payment Status", responseToastMsg);
        }

        if (isSuccessful && route.params?.onPaymentSuccess) {
            route.params.onPaymentSuccess(); // Execute the refresh function
        }
        navigation.goBack();
    };

    return (
        <WebView
            style={{ flex: 1 }}
            originWhitelist={["https://*", "upi://*"]}
            source={{ html: htmlPage }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={LoadingIndicatorView} // Fixed: removed 'this'
            startInLoadingState={true}
            onShouldStartLoadWithRequest={(request) => {
                const url = request.url;

                if (url.startsWith("upi:")) {
                    Linking.openURL(url).catch(() => {
                        Alert.alert("Error", "No UPI apps installed!");
                    });
                    return false;
                }

                if (url.includes("mobilesdk/param")) {
                    isOnMobileSdkParam.current = true; // Instant update
                }
                return true;
            }}
            onNavigationStateChange={(navState) => {
                lastNavUrlRef.current = navState.url;
                if (navState.url.includes("mobilesdk/param")) {
                    isOnMobileSdkParam.current = true;
                }
            }}
            onMessage={(event) => {
                const data = String(event.nativeEvent.data || "");
                if (data.includes("encData")) {
                    // Check ref value instead of state
                    if (isOnMobileSdkParam.current) {
                        decryptFinalResponse(data);
                    } else {
                        console.warn("Waiting for mobile SDK URL...");
                    }
                }
            }}
            injectedJavaScript={INJECT_JS}
        />
    );
}

export default NttDataPayment;