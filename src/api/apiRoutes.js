import { BASE_URL } from "../config";

export const API_ROUTES = {
  // trade api routes
  TRADE_DETAILS: `${BASE_URL}/api/trade/get-dtl`,
  TRADE_SEARCH: `${BASE_URL}/api/trade/search`,
  TRADE_MASTER_DETAILS:`${BASE_URL}/api/trade/get-trade-master-data`,
  TRADE_DUE_DETAILS:`${BASE_URL}/api/trade/get-due`,
  TRADE_PAYMENT:`${BASE_URL}/api/trade/pay-demand`,
  TRADE_PAYMENT_RECEIPT:`${BASE_URL}/api/trade/payment-receipt`,
  TRADE_REVIEW_TAX:`${BASE_URL}/api/trade/review-tax`,
  TRADE_APPLY:`${BASE_URL}/api/trade/apply`, 
  TRADE_PAY_DEMAND:`${BASE_URL}/api/trade/pay-demand`,
  TRADE_DOCUMENT_DETAILS:`${BASE_URL}/api/trade/get-uploaded-doc-list`,
  TRADE_UPLOAD_DOC:`${BASE_URL}/api/trade/uploaded-doc`,
  TRADE_REVIEW_INBOX:`${BASE_URL}/api/trade/inbox`,
  TRADE_APPLY:`${BASE_URL}/api/trade/apply`,
  TRADE_POST_NEXT:`${BASE_URL}/api/trade/post-next`,
};

export const WARD_API ={
  OLD_WARD_API : `${BASE_URL}/api/property/get-new-ward-by-old`,
}

export const PROPERTY_REPORTS_API ={
  COLLECTION_REPORT_API:`${BASE_URL}/api/property/report/collection`,
  PAYMENT_MODE_WISE_REPORT_API:`${BASE_URL}/api/property/report/collection-summary`, 
}
export const SAF_API_ROUTES = {
  SAF_VARIFICATION_MODEL: `${BASE_URL}/api/property/field-verification-dtl`,
  APPLY_SAF: `${BASE_URL}/api/property/saf-apply`,
  APPLY_SAF_RESSESMENT_API: `${BASE_URL}/api/property/saf-apply`,
  SEND_TO_LEVEL_API: `${BASE_URL}/api/property/post-next`, 
};
export const WORK_FLOW_PERMISSION = `${BASE_URL}/api/get-workflow-permission`;
export const PROPERTY_API = {
  MASTER_DATA: `${BASE_URL}/api/property/get-saf-master-data`,
  FIELD_VARIFICATION_API: `${BASE_URL}/api/property/field-verification`,
  GEOTAGING_IMAGE_API: `${BASE_URL}/api/property/geotage`,
  APARTMENT_API: `${BASE_URL}/api/property/get-apartment-by-old-ward`, // 👈 added missing slash
  TEST_REQUEST_API: `${BASE_URL}/api/property/test-request`,

};
export const HOLDIGN_API_ROUTES ={
  SEARCH_API:`${BASE_URL}/api/property/search-prop`,
  DETAILS_API:`${BASE_URL}/api/property/get-prop-dtl`,
  MASTER_DATA_API:`${BASE_URL}/api/property/get-saf-master-data`,
  DEMAND_API:`${BASE_URL}/api/property/get-prop-demand`,
  PAY_DEMAND_API:`${BASE_URL}/api/property/pay-prop-demand`,
  RECEIPT_API:`${BASE_URL}/api/property/payment-receipt`

  
};

export const Water_Api = `${BASE_URL}/api/water/app`;

export const WATER_API_ROUTES = {
  WATER_SEARCH: `${Water_Api}/search`,
  WATER_DETAILS: `${Water_Api}/dtl`,
  WATER_DUE: `${Water_Api}/due`,
  PAY_DEMAND: `${Water_Api}/pay-demand`,
  PAYMENT_RECEIPT: `${Water_Api}/payment-receipt`,
  WATER_DOC_LIST: `${Water_Api}/get-uploaded-doc-list`,
  WATER_REMARKS: `${Water_Api}/post-next`,
  MASTER_DATA: `${Water_Api}/master-data`,
  TEST_REQUEST: `${Water_Api}/test-request`,
  APPLY_CONNECTION: `${Water_Api}/apply-connection`,
  REVIEW_TAX: `${Water_Api}/review-tax`,
  INBOX: `${Water_Api}/inbox`,
  POST_NEXT: `${Water_Api}/post-next`,
  TEST_REQUEST:`${Water_Api}/test-request`,
 CONSUMER_FIELD_VERIFICATION_API: `${Water_Api}/field-verification`,
  GET_FIELD_VERIFICATION_API: `${Water_Api}/get-field-verification`,
  GET_FIELD_VERIFICATION_DTLS_API: `${Water_Api}/field-verification-dtl`,



}


export const CUSTOMER_API ={
  CUSTOMER_DETAILS_API:`${BASE_URL}/api/water/consumer/dtl`,
  CUSTOMER_SEARCH_API:`${BASE_URL}/api/water/consumer/search`,
  CUSTOMER_DUE_API:`${BASE_URL}/api/water/consumer/due`,
  CUSTOMER_PAYMENT_RECIPT_API:`${BASE_URL}/api/water/app/payment-receipt`,
  CUSTOMER_PAY_DUE_API:`${BASE_URL}/api/water/consumer/pay-due`,
  CONSUMER_GENERATE_DEMAND_API:`${BASE_URL}/api/water/consumer/generate-demand`,
  CONSUMER_DEMAND_HISTORY_API:`${BASE_URL}/api/water/consumer/demand-history
`,


}


export const  PAYMENT_MODE = {
  PAYMENT_MODE_API:`${BASE_URL}/api/property/report/payment-mode`
}

export const FORGET_PASS_API = `${BASE_URL}/api/forgot-password`
export const OTP_VERIFY_API = `${BASE_URL}/api/otp-verify`
export const CHANGE_PASS_API = `${BASE_URL}/api/otp-change-pass`

export const subCategory = `${BASE_URL}/api/property/get-swm-subCategory`
export const swmRate = `${BASE_URL}/api/property/get-swm-rate`



export const usrProfileApi = `${BASE_URL}/api/user-profile`;
export const heartBeatApi = `${BASE_URL}/api/heartbeat`;

export const Ulb_Api = (id) => `${BASE_URL}/api/ulb/show/${id}`;


  