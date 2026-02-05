import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { MasterDataProvider } from './src/Context/MasterDataContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reports
import PropertyCollection from './src/Module/PropertyMenu/Report/Collection';
import PaymentWiseReportPorpty from './src/Module/PropertyMenu/Report/PaymentWiseReport';

// Water
import WaterInbox from './src/Module/Water/Inbox/Inbox';
import WaterSurvey from './src/Module/Water/Inbox/WaterSurvey';
import SubmitSurey from './src/Module/Water/Inbox/SubmitSurey';
import SubmitApply from './src/Module/Water/ApplyWater/SubmitApply';
import ApplyWaterConnectionForm from './src/Module/Water/ApplyWater/ApplyWaterConnectionForm';
import SearchWater from './src/Module/Water/Details/Search';
import WaterDetails from './src/Module/Water/Details/Details';
import MyInput from './src/Module/Water/ApplyWater/MyInput';

// Trade
import ApplyLicense from './src/Module/Trade/ApplyLicense';
import ApplyLicenseSummary from './src/Module/Trade/ApplyLicenseSummary';
import Search from './src/Module/Trade/Details/Search';
import InboxScreen from './src/Module/Trade/Inbox/InboxScreen';
import TradeDetails from './src/Module/Trade/Details/TradeDetails';
import DocUpload from './src/Module/Trade/DocUpload';
import RenewLicense from './src/Module/Trade/Renew/RenewLicense';
import RenewLicensePage from './src/Module/Trade/Renew/RenewLicensePage';
import SurrenderLicense from './src/Module/Trade/Surender/SurrenderLicense';
import SurrenderLicensePage from './src/Module/Trade/Surender/SurrenderLicensePage';
import InboxDtls from './src/Module/Trade/Inbox/InboxDtls';
import Amedment from './src/Module/Trade/Amedment/Amedment';
import AmedmentSummery from './src/Module/Trade/Amedment/AmedmentSummery';

// Property
import DashBoard from './src/Screen/DashBoard';
import StaffCard from './src/Screen/StaffCard';
import Property from './src/Screen/Property';
import Assessment from './src/Screen/Assessment';
import Inbox from './src/Screen/Inbox';
import FieldVarification from './src/Module/PropertyMenu/Saf/FieldVarification';
import SurveyPage from './src/Module/PropertyMenu/Saf/SurveyPage';
import VerifiedStatus from './src/Module/PropertyMenu/Saf/VerifiedStatus';
import SearchAssesment from './src/Module/PropertyMenu/Saf/SearchAssesment';
import SafDueDetails from './src/Module/PropertyMenu/Saf/SafDueDetails';
import ApplyAssessment from './src/Module/PropertyMenu/Saf/ApplyAssessment';
import AssessmentSummary from './src/Module/PropertyMenu/Saf/AssessmentSummary';
import ApplyAssessmentComponentized from './src/Module/PropertyMenu/Saf/ApplyAssessmentComponentized';
import SubmitVarification from './src/Module/PropertyMenu/Saf/SubmitVarification';
import SearchHolding from './src/Module/PropertyMenu/Holding/Search';
import HoldingDetails from './src/Module/PropertyMenu/Holding/HoldingDetails';
import RessesmentSummry from './src/Module/PropertyMenu/Saf/SubmitData/RessesmentSummry';
import MutationScreen from './src/Module/PropertyMenu/Saf/SubmitData/Verification/MutationScreen';
import SubmitSummaryPage from './src/Module/PropertyMenu/Saf/SubmitData/Verification/SubmitSummaryPage';

// Customer
import SearchCustomer from './src/Module/Customer/Search';
import CustomerDetails from './src/Module/Customer/Details';

// Auth
import WelcomeScreen from './src/Screen/WelcomeScreen';
import LoginScreen from './src/Screen/LoginScreen';
import ForgotPassword from './src/Screen/ForgetPassword';
import ChangePasswordScreen from './src/Screen/ChangePasswordScreen';

// Profile
import ProfilePage from './src/Screen/ProfilePage';
import Sidebar from './src/Screen/Sidebar';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const expiry = await AsyncStorage.getItem('tokenExpiry');
        const now = new Date().getTime();

        if (token && expiry && now < JSON.parse(expiry)) {
          setInitialRoute('DashBoard');
        } else {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userDetails');
          await AsyncStorage.removeItem('tokenExpiry');
          setInitialRoute('WelcomeScreen');
        }
      } catch (error) {
        console.error('Token check error:', error);
        setInitialRoute('WelcomeScreen');
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading || !initialRoute) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MasterDataProvider>
        <AlertNotificationRoot>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{ headerShown: false, unmountOnBlur: true }}
            >
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="DashBoard" component={DashBoard} />

              <Stack.Screen name="StaffCard" component={StaffCard} />
              <Stack.Screen name="SurveyPage" component={SurveyPage} />
              <Stack.Screen name="Property" component={Property} />
              <Stack.Screen name="Assessment" component={Assessment} />
              <Stack.Screen name="Inbox" component={Inbox} />
              <Stack.Screen
                name="FieldVarification"
                component={FieldVarification}
              />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="VerifiedStatus" component={VerifiedStatus} />
              <Stack.Screen
                name="SearchAssesment"
                component={SearchAssesment}
              />
              <Stack.Screen name="SafDueDetails" component={SafDueDetails} />
              <Stack.Screen
                name="ApplyAssessment"
                component={ApplyAssessment}
              />
              <Stack.Screen
                name="AssessmentSummary"
                component={AssessmentSummary}
              />
              <Stack.Screen
                name="ApplyAssessmentComponentized"
                component={ApplyAssessmentComponentized}
              />
              <Stack.Screen name="ApplyLicense" component={ApplyLicense} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="InboxScreen" component={InboxScreen} />
              <Stack.Screen name="TradeDetails" component={TradeDetails} />
              <Stack.Screen
                name="ApplyLicenseSummary"
                component={ApplyLicenseSummary}
              />
              <Stack.Screen name="RenewLicense" component={RenewLicense} />
              <Stack.Screen
                name="ApplyWaterConnection"
                component={ApplyWaterConnectionForm}
              />
              <Stack.Screen
                name="SurrenderLicense"
                component={SurrenderLicense}
              />
              <Stack.Screen
                name="SubmitVarification"
                component={SubmitVarification}
              />
              <Stack.Screen name="DocUpload" component={DocUpload} />
              <Stack.Screen name="SearchWater" component={SearchWater} />
              <Stack.Screen
                name="SurrenderLicensePage"
                component={SurrenderLicensePage}
              />
              <Stack.Screen
                name="RenewLicensePage"
                component={RenewLicensePage}
              />
              <Stack.Screen name="InboxDtls" component={InboxDtls} />
              <Stack.Screen name="SearchHolding" component={SearchHolding} />
              <Stack.Screen name="HoldingDetails" component={HoldingDetails} />
              <Stack.Screen
                name="RessesmentSummry"
                component={RessesmentSummry}
              />
              <Stack.Screen name="SubmitApply" component={SubmitApply} />
              <Stack.Screen name="MyInput" component={MyInput} />
              <Stack.Screen name="WaterDetails" component={WaterDetails} />
              <Stack.Screen name="SearchCustomer" component={SearchCustomer} />
              <Stack.Screen
                name="CustomerDetails"
                component={CustomerDetails}
              />
              <Stack.Screen
                name="SubmitSummaryPage"
                component={SubmitSummaryPage}
              />
              <Stack.Screen name="WaterInbox" component={WaterInbox} />
              <Stack.Screen name="WaterSurvey" component={WaterSurvey} />
              <Stack.Screen name="SubmitSurey" component={SubmitSurey} />
              <Stack.Screen
                name="PropertyCollection"
                component={PropertyCollection}
              />
              <Stack.Screen
                name="PaymentWiseReportPorpty"
                component={PaymentWiseReportPorpty}
              />
              <Stack.Screen name="MutationScreen" component={MutationScreen} />
              <Stack.Screen name="Amedment" component={Amedment} />
              <Stack.Screen
                name="AmedmentSummery"
                component={AmedmentSummery}
              />
              <Stack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
              />

              <Stack.Screen name="ProfilePage" component={ProfilePage} />
              <Stack.Screen name="Sidebar" component={Sidebar} />
            </Stack.Navigator>
          </NavigationContainer>
        </AlertNotificationRoot>
      </MasterDataProvider>

      {/* Toast notification */}
      <Toast
        config={toastConfig}
        topOffset={60}
        visibilityTime={2500}
        position="top"
      />
    </GestureHandlerRootView>
  );
};

export default App;
