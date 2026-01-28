import React, { useEffect, useState } from 'react'
import { useAuthToken } from '../../../utils/auth';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { safDtlApi, wfPermissionsApi } from "../../../api/endpoint";
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../Constants/Colors';
import HeaderNavigation from '../../../Components/HeaderNavigation';
import ActionButton from "../../../Components/ActionButton";
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import DetailCard from "../../../Components/DetailCard";
import TableDetailCard from "../../../Components/TableDetailCard";
import RemarksAccordion from "../../../Components/RemarksAccordion";
import { formatLocalDate, formatLocalDateTime, formatTimeAMPM } from '../../../utils/common';
import TcVerificationDtlModal from "./component/TcVerificationDtlModal";
import SAMModal from "./component/SAMModal";
import PaymentReceiptModal from "./component/PaymentReceiptModal";
import DocViewModal from "./component/DocViewModal"

function SafDetails() {
    const route = useRoute();
    const { id } = route.params;
    const token = useAuthToken();
    const [safData, setSafData] = useState({});
    const [remarks, setRemarks] = useState([]);
    const [wfPermissions, setWfPermissions] = useState(null);    
    const [buttonType, setButtonType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowVerificationModal, setIsShowVerificationModal] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [isShowPaymentReceiptModal, setIsShowPaymentReceiptModal] =useState(false);
    const [paymentReceiptId, setPaymentReceiptId] = useState(null);
    const [isShowSamModal, setIsShowSamModal] = useState(false);
    const [isShowFamModal, setIsShowFamModal] = useState(false);
    const [samReceiptId, setSamReceiptId] = useState(null);
    const [isDocViewModal, setIsDocViewModal] = useState(false);

    const actionButtons = [
        {
            label: "View Demand",
            onClick: () => {
                setButtonType("viewDemand");
            },
            icon: "remove-red-eye",
            show: safData?.paymentStatus == 0,
        },
        {
            label: "Proceed Payment",
            onClick: () => {
                setButtonType("viewDemand");
            },
            icon: "payments",
            color: "#4CD964",
            show:
                safData?.paymentStatus == 0 &&
                (wfPermissions?.canTakePayment || wfPermissions?.hasFullPermission),
        },
        {
            label: "View Document",
            onClick: () => {
                setIsDocViewModal(true);
            },
            icon: "remove-red-eye",
            show: true,
        },
    ];

    useEffect(() => {
        if (id && token) {
            fetchSafDetails();
        }
    }, [id, token]);

    useEffect(() => {
        if (safData?.workflowId && token)
            fetchPermission();
    }, [safData?.workflowId, token]);

    const fetchSafDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(safDtlApi, { id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response",response);
            if (response?.data?.status) {
                setSafData(response?.data?.data);
                const updatedRemarks = response?.data?.data?.levelRemarks?.map((item) => ({
                    ...item,
                    roleCode: item?.senderRole,
                    action: item?.actions,
                    userName: item?.senderUserName,
                    message: item?.senderRemarks,
                    date: item?.createdAt
                    ? new Date(item?.createdAt).toLocaleDateString()
                    : "NA",
                    time: item?.createdAt ? formatTimeAMPM(item.createdAt) : "NA",
                }));

                setRemarks(updatedRemarks);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchPermission = async () => {
        try {
            const response = await axios.post(wfPermissionsApi, { wfId: safData?.workflowId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response?.data?.status) {
                setWfPermissions(response?.data?.data);
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    console.log("safData",safData);
    console.log("permission",wfPermissions);

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
                    <>
                        <DetailCard title="Basic Details" data={[
                            {
                                label:"SAF NO.",
                                value:safData?.safNo,
                            },
                            {
                                label:"Apply Date",
                                value:formatLocalDate(safData?.applyDate),
                            },
                            {
                                label:"Ward No",
                                value:safData?.wardNo,
                            },
                            {
                                label:"New Ward No",
                                value:safData?.newWardNo,
                            },
                            {
                                label:"Assessment Type",
                                value:safData?.assessmentType,
                            },
                            {
                                label:"Property Type",
                                value:safData?.propertyType,
                            },
                            {
                                label:"Ownership Type",
                                value:safData?.ownershipType,
                            },
                            {
                                label:"Road Width",
                                value:safData?.roadWidth,
                            },
                            {
                                label:"Plot No",
                                value:safData?.plotNo,
                            },
                            {
                                label:"Area of Plot",
                                value:safData?.areaOfPlot,
                            },
                            {
                                label:"Rain Water Harvesting",
                                value:safData?.isWaterHarvesting?"Yes":"No",
                            },
                            {
                                label:"Address",
                                value:safData?.propAddress,
                            },
                            {
                                label:"Zone",
                                value:safData?.zone,
                            },
                        ]} />

                        <TableDetailCard 
                            title="Owner Details"
                            headers={[
                                "Sl No.", "Owner", "Guardian", "Relation", "Mobile", "Gender", 
                                "DOB", "Email", "Aadhar", "PAN", "Specially Abled", "Armed Force"
                            ]}
                            data={safData?.owners?.map((owner, index) => ({
                                cells: [
                                    (index + 1).toString(),
                                    owner.ownerName ?? 'N/A',
                                    owner.guardianName ?? 'N/A',
                                    owner.relationType ?? 'N/A',
                                    owner.mobileNo ?? 'N/A',
                                    owner.gender ?? 'N/A',
                                    owner.dob ?? 'N/A',
                                    owner.email ?? 'N/A',
                                    owner.aadharNo ?? 'N/A',
                                    owner.panNo ?? 'N/A',
                                    owner.isSpeciallyAbled ? 'Yes' : 'No',
                                    owner.isArmedForce ? 'Yes' : 'No',
                                ],
                                
                            }))}
                        />

                        <DetailCard 
                            title="Electricity Details" 
                            data={[
                            {
                                label:"Electricity K. No.",
                                value:safData?.electConsumerNo,
                            },
                            {
                                label:"ACC No.",
                                value:safData?.electAccNo,
                            },
                            {
                                label:"BIND/BOOK No.",
                                value:safData?.electBindBookNo,
                            },
                            {
                                label:"Electricity Consumer Category.",
                                value:safData?.electConsCategory,
                            },
                            
                        ]} />

                        <DetailCard 
                            title="Building Plan / Water Connection Details" 
                            data={[
                            {
                                label:"Building Plan Approval No.",
                                value:safData?.buildingPlanApprovalNo,
                            },
                            {
                                label:"Building Plan Approval Date",
                                value:safData?.buildingPlanApprovalDate,
                            },
                            {
                                label:"Water Consumer No.",
                                value:safData?.waterConnNo,
                            },
                            {
                                label:"Water Connection Date",
                                value:safData?.waterConnDate,
                            },
                            
                        ]} />

                        <DetailCard 
                            title="Property Details" 
                            data={[
                            {
                                label:"Khata No.",
                                value:safData?.khataNo,
                            },
                            {
                                label:"Plot No.",
                                value:safData?.plotNo,
                            },
                            {
                                label:"Village/Mauja Name",
                                value:safData?.villageMaujaName,
                            },
                            {
                                label:"Area of Plot (in Decimal)",
                                value:safData?.areaOfPlot,
                            },
                            
                        ]} />

                        <DetailCard 
                            title="Property Address" 
                            data={[
                            {
                                label:"Address",
                                value:safData?.propAddress,
                            },
                            {
                                label:"City",
                                value:safData?.propCity,
                            },
                            {
                                label:"Pin Code",
                                value:safData?.propPinCode,
                            },
                            {
                                label:"State",
                                value:safData?.propState,
                            },
                            {
                                label:"District",
                                value:safData?.propDist,
                            },
                            {
                                label:"Is Corresponding Address Different",
                                value:safData?.isCorrAddDiffer ? 'Yes' : 'No',
                            },
                            
                        ]} />

                        <TableDetailCard 
                            title="Floor Details"
                            headers={[
                                "Sl No.", "Floor", "Usage Type", "Occupancy Type", "Construction Type", "Built-up Area", 
                                "From Date", "Upto Date",
                            ]}
                            data={safData?.floors?.map((item, index) => ({
                                cells: [
                                    (index + 1).toString(),
                                    item.floorName ?? 'N/A',
                                    item.usageType ?? 'N/A',
                                    item.occupancyName ?? 'N/A',
                                    item.constructionType ?? 'N/A',
                                    item.builtupArea ?? 'N/A',
                                    formatLocalDate(item.dateFrom) ?? 'N/A',
                                    formatLocalDate(item.dateUpto) ?? 'N/A',
                                ],
                                
                            }))}
                        />
                        <DetailCard 
                            title="Additional Property Details" 
                            data={[
                            {
                                label:"Does Property Have Mobile Tower(s)?",
                                value:safData?.isMobileTower ? 'Yes' : 'No',
                            },
                            ...(safData?.isMobileTower ? [
                                {
                                    label: "Date of Installation of Mobile Tower",
                                    value: formatLocalDate(safData?.towerInstallationDate),
                                },
                                {
                                    label: "Total Area Covered by Mobile Tower & its Equipments (Sq. Ft.)",
                                    value: safData?.towerArea,
                                },
                                ] :[]
                            
                            ),
                            {
                                label:"Does Property Have Hoarding Board(s)?",
                                value:safData?.isHoardingBoard ? 'Yes' : 'No',
                            },
                            ...(safData?.isHoardingBoard ? [
                                {
                                    label: "Date of Installation of Hoarding Board(s)",
                                    value: formatLocalDate(safData?.hoardingInstallationDate),
                                },
                                {
                                    label: "Total Area of Wall / Roof / Land (in Sq. Ft.)",
                                    value: safData?.hoardingArea,
                                },
                                ] :[]
                            ),
                            {
                                label:"Is Property a Petrol Pump?",
                                value:safData?.isPetrolPump ? 'Yes' : 'No',
                            },
                            ...(safData?.isPetrolPump ? [
                                {
                                    label: "Completion Date of Petrol Pump",
                                    value: formatLocalDate(safData?.petrolPumpCompletionDate),
                                },
                                {
                                    label: "Underground Storage Area (in Sq. Ft.)",
                                    value: safData?.underGroundArea,
                                },
                                ] :[]
                            ),
                            {
                                label:"Rainwater Harvesting Provision?",
                                value:safData?.isWaterHarvesting ? 'Yes' : 'No',
                            },
                            ...(safData?.isWaterHarvesting ? [
                                {
                                    label: "Rainwater Harvesting Date From",
                                    value: formatLocalDate(safData?.waterHarvestingDate),
                                },
                                ] :[]
                            ),
                            ...(safData?.propTypeMstrId==3 ? [
                                {
                                    label: "Land Acquisition Date",
                                    value: formatLocalDate(safData?.landOccupationDate),
                                },
                                ] :[]
                            ),
                            
                        ]} />

                        <TableDetailCard 
                            title="Tax Details"
                            headers={[
                                "Sl No.", "ARV", "Effect From", "Holding Tax", "Water Tax", "Conservancy/Latrine Tax", 
                                "Edu. Cess", "RWH Penalty", "Quarterly Tax",
                            ]}
                            data={safData?.taxDtl?.map((item, index) => ({
                                cells: [
                                    (index + 1).toString(),
                                    item.arv ?? 'N/A',
                                    `${item?.qtr ?? 'NA'} / ${item?.fyear ?? 'NA'}`,
                                    item.holdingTax ?? 'N/A',
                                    item.waterTax ?? 'N/A',
                                    item.latrineTax ?? 'N/A',
                                    item?.educationCess ?? 'N/A',
                                    item?.rwhPenalty ?? 'N/A',
                                    item?.quarterlyTax ?? 'N/A',
                                ],
                                
                            }))}
                        />

                        <TableDetailCard 
                            title="Payment Details"
                            headers={[
                                "Sl No.", "Transaction No", "Payment Mode", "Date", "From Qtr / Year", "Upto Qtr / Year", 
                                "Amount", "View", 
                            ]}
                            data={safData?.tranDtls?.map((item, index) => ({
                                cells: [
                                    (index + 1).toString(),
                                    item.tranNo ?? 'N/A',
                                    item.paymentMode ?? 'N/A',
                                    item.tranDate ?? 'N/A',
                                    `${item?.fromQtr ?? 'NA'} / ${item?.fromFyear ?? 'NA'}`,
                                    `${item?.uptoQtr ?? 'NA'} / ${item?.uptoFyear ?? 'NA'}`,
                                    item?.payableAmt ?? 'N/A',
                                    (
                                    <TouchableOpacity
                                            key={`view-button-${item?.id || index}`} 
                                            style={styles.button} // Ensure this style has a background and padding
                                            onPress={() => {
                                                setIsShowPaymentReceiptModal(true)
                                                setPaymentReceiptId(item.id);
                                            }}
                                        >
                                            <Text style={styles.buttonText}>View</Text>
                                        </TouchableOpacity>
                                    )
                                    ,
                                ],
                                
                            }))}
                        />

                        <TableDetailCard 
                            title="Tc Verification"
                            headers={[
                                "Sl No.", "Verified By", "Verification On", "View",  
                            ]}
                            data={safData?.tcVerifications?.map((item, index) => ({
                                cells: [
                                    (index + 1).toString(), 
                                    (<Text> 
                                        {item.verifiedBy ?? 'NA'}
                                        <Text style={{color: "#aac8e9ff"}}> ({item?.userName??"NA"})</Text>
                                    </Text>),
                                    formatLocalDateTime(item?.createdAt),                                    
                                    (
                                        <TouchableOpacity
                                            key={`view-button-${item?.id || index}`} 
                                            style={styles.button} // Ensure this style has a background and padding
                                            onPress={() => {
                                                setVerificationId(item?.id);
                                                setIsShowVerificationModal(true);
                                            }}
                                        >
                                            <Text style={styles.buttonText}>View</Text>
                                        </TouchableOpacity>
                                    )
                                    ,
                                ],
                                
                            }))}
                        />

                        <TableDetailCard 
                            title="Memo Details"
                            headers={[
                                "Sl No.", "Memo No", "Generated On", "Generated By", "ARV", 
                                "Quarterly Tax", "Effect From", "Memo Type","Holding No", "View",  
                            ]}
                            data={safData?.memoDtls?.map((item, index) => ({
                                cells: [
                                    (index + 1).toString(),
                                    item?.memoNo,
                                    formatLocalDateTime(item?.createdAt),  
                                    item?.userName,                                  
                                    item?.arv,
                                    item?.quarterlyTax,
                                    `${item?.qtr}/${item?.fyear}`,
                                    item?.memoType,
                                    item?.holdingNo,
                                    (
                                        <TouchableOpacity
                                            key={`view-button-${item?.id || index}`} 
                                            style={styles.button} // Ensure this style has a background and padding
                                            onPress={() => {
                                                    if (item?.memoType == "FAM") {
                                                        setIsShowFamModal(true);
                                                    } else {
                                                        setIsShowSamModal(true);
                                                    }
                                                    setSamReceiptId(item.id);
                                            }}
                                        >
                                            <Text style={styles.buttonText}>View</Text>
                                        </TouchableOpacity>
                                    )
                                    ,
                                ],
                                
                            }))}
                        />
                        <RemarksAccordion title="Level Remarks" remarks={remarks} />
                    </>
                )}
                {wfPermissions && (
                    <View style={styles.buttonRow}>
                        {actionButtons.map((item, index) => (
                            <ActionButton
                                key={index}
                                name={item.icon}
                                label={item.label}
                                color={item.color || Colors.primary}
                                onPress={item.onClick}
                                show={item?.show}
                            />
                        ))}
                    </View>
                )}

                {/* Modals */}
                {isDocViewModal && (
                    <DocViewModal
                        id={safData?.id}
                        onClose={() => setIsDocViewModal(false)}
                        token={token}
                    />
                )}
                {isShowVerificationModal && (
                <TcVerificationDtlModal
                    id={verificationId}
                    onClose={() => setIsShowVerificationModal(false)}
                />
                )}

                {/* same modal */}
                {isShowSamModal && (
                <SAMModal
                    id={samReceiptId}
                    onClose={() => setIsShowSamModal(false)}
                />
                )}

                {/* {isShowFamModal && (
                <FamReceiptModal
                    id={samReceiptId}
                    onClose={() => setIsShowFamModal(false)}
                />
                )} */}
                {isShowPaymentReceiptModal&&(
                    <PaymentReceiptModal id={paymentReceiptId} onClose={()=>setIsShowPaymentReceiptModal(false)} />
                )}
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default SafDetails;

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    card: {
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 16,
        margin: 12,
        elevation: 4,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: Colors.background,
        backgroundColor: Colors.headignColor,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 4,
    },
    rowTable: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    labelFixed: {
        fontSize: 13,
        marginVertical: 2,
        fontWeight: '600',
        color: '#555',
        width: 120,
    },
    value: {
        flex: 1,
        color: '#222',
    },
    headerRow: {
        backgroundColor: Colors.textSecondary,
    },
    cell: {
        minWidth: 70,
        paddingVertical: 4,
        paddingHorizontal: 6,
        textAlign: 'center',
        fontSize: 10,
        color: '#333',
        borderRightWidth: 0.5,
        borderColor: '#ccc',
    },
    containerdue: {
        backgroundColor: Colors.background,
        borderRadius: 10,
        margin: 12,
        elevation: 4,
        paddingBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 4,
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexWrap: 'nowrap',
    },

    tableHeader: {
        backgroundColor: '#f0f0f0',
    },

    tableCell: {
        minWidth: 80,
        padding: 4,
        textAlign: 'center',
        borderRightWidth: 0.5,
        borderColor: '#ccc',
        fontSize: 10,
        color: '#000',
        flex: 1,
    },

    headerText: {
        fontWeight: 'bold',
        color: '#fff',
    },

    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1d2a7e',
        marginBottom: 10,
    },
    logoWrapper: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logoCircle: {
        fontSize: 30,
    },
    corpName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    receiptType: {
        alignSelf: 'center',
        marginVertical: 5,
        borderWidth: 1,
        paddingHorizontal: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 13,
        marginVertical: 2,
    },
    bold: {
        fontWeight: 'bold',
    },
    tableWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 15,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 6,
    },
    tableRowModal: {
        flexDirection: 'row',
        padding: 6,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    col: {
        flex: 1,
        fontSize: 12,
    },
    footerRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
    qrBox: {
        width: 90,
        height: 90,
        backgroundColor: '#ccc',
        alignSelf: 'center',
    },
    footerText: {
        fontSize: 13,
        marginBottom: 2,
    },
    generatedNote: {
        fontSize: 11,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 15,
    },
    closeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 8,
        alignItems: 'center',
    },
    docModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docModalContent: {
        backgroundColor: '#fff',
        width: '95%',
        maxHeight: '85%',
        borderRadius: 10,
        padding: 16,
        elevation: 5,
    },
    docModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#222',
    },
    docTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    docTableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    docCellHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
    },
    docCell: {
        flex: 1,
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    docFileLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    docCloseButton: {
        backgroundColor: '#007bff',
        marginTop: 14,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    docCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    viewButton: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    viewButtonText: {
        color: Colors.background,
        backgroundColor: Colors.primary,
        fontSize: 11,
        padding: 8,
        borderRadius: 8,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#ccc',
    },
    disabledButtonText: {
        color: '#888',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 12,
        marginBottom: 4,
    },
    penaltyBox: {
        backgroundColor: '#ffe6e6',
        padding: 10,
        marginBottom: 10,
    },
    rebateBox: {
        backgroundColor: '#e6ffe6',
        padding: 10,
        marginBottom: 10,
    },
    totalPayableBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff3cd',
        padding: 10,
        marginTop: 10,
    },
    totalPayableLabel: {
        fontWeight: 'bold',
    },
    totalPayableAmount: {
        fontWeight: 'bold',
        color: '#d9534f',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        minWidth: 1200,
    },
    tableSubHeader: {
        backgroundColor: '#f0f0f0',
    },
    tableFooter: {
        backgroundColor: 'white',
    },
    payNowButton: {
        backgroundColor: '#28a745',
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    payNowButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    dropdown: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    fullScreenModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeFullScreenButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    closeFullScreenButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    fullScreenScrollView: {
        flex: 1,
        width: '100%',
    },
    fullScreenScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fullScreenImage: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 100,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', // **Key change for wrapping**
        justifyContent: 'flex-start',
        paddingHorizontal: responsiveWidth(1),
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
    },
    buttonWrapper: {
        width: '32%', 
        marginHorizontal: '0.66%', 
        marginBottom: 10,
    },
    button: { 
        width: '100%',      
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { 
        padding: 10,
        borderRadius: 8,   
        backgroundColor: Colors.primary,
        color: '#fff', 
        fontWeight: '700', 
        fontSize: responsiveWidth(3.2), 
        textAlign: "center",
        flexWrap: 'wrap', 
    },
});
