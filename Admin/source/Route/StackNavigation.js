import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Login from '../Views/Components/login/Login';
import LandingPage from '../Views/Components/login/LandingPage';
import Dashboard from '../Views/Components/dashboard/Dashboard';
import Payments from '../Views/Components/Payments/Payments';
import EmployeeStatus from '../Views/Components/EmployeeStatus/EmployeeStatus';
import Complaints from '../Views/Components/Complaints/Complaints';
import Leads from '../Views/Components/Leads/LeadsList';
import AddNetwork from '../Views/Components/AddNetwork/AddNetwork';
import Pickups_List from '../Views/Components/PIckups/Pickups_List';
import LocationNavigation from '../Views/Components/LocationNavigation/LocationNavigation';
import KYC_List from '../Views/Components/CustomerKYC/KYCList/KYC_List';
import KYC_Add_Update from '../Views/Components/CustomerKYC/KYC_Add_Update/KYC_Add_Update';
import AddComplaints from '../Views/Components/Complaints/AddComplaints';
import {Colors} from '../Views/Common/Colors';
import PaymentGateWayWebView from '../Views/Common/PaymentGateWayWebView';
import Customer360Info from '../Views/Components/CustomerKYC/Customer360Info/Customer360Info';
import PlanRenewal from '../Views/Components/CustomerKYC/Customer360Info/UserInfo/PlanRenewal/PlanRenewal';
import NotificationList from '../Views/Components/Notofications/NotificationList';
import {connect} from 'react-redux';
import Dashboard2 from '../Views/Components/dashboard/Dashboard2';
import TrafficSessionReport from '../Views/Components/CustomerKYC/Customer360Info/UserInfo/TrafficSessionReport/TrafficSessionReport';
import ExpiryList from '../Views/Components/dashboard/ExpiryList';

import MapDesignView from '../Views/Components/Complaints/MapDesignView';
import NetworkPreviewDetails from '../Views/Components/AddNetwork/NetworkPreviewDetails';
import ConnectedDevicesDetails from '../Views/Components/AddNetwork/ConnectedDevicesDetails';
import BillingHistory from '../Views/Components/Finance/BillingHistory/BillingHistory';
import PdfViewBill from '../Views/Components/Finance/BillingHistory/PdfViewBill';
import Reports from '../Views/Components/Reports/Reports';
import SecurityGroup from '../Views/Components/Reports/SecurityGroup';
import ConnectedDevicePDP from '../Views/Components/AddNetwork/ConnectedDevicePDP';
import ConnectedChildDP from '../Views/Components/AddNetwork/ConnectedChildDP';
import ConnectedCPE from '../Views/Components/AddNetwork/ConnectedCPE';
import CustomerReports from '../Views/Components/Reports/CustomerReports';
import HelpdeskReports from '../Views/Components/Reports/HelpdeskReports';
import LedgerReports from '../Views/Components/Reports/LedgerReports';
import RevenueReports from '../Views/Components/Reports/RevenueReports';
import FranchiseReports from "../Views/Components/Reports/FranchiseReports";
import InvoiceReport from "../Views/Components/Reports/InvoiceReports";
import GstReports from "../Views/Components/Reports/GstReports"
import LeadReports from '../Views/Components/Reports/LeadReports';
import Extend from '../Views/Components/CustomerKYC/Customer360Info/UserInfo/Extend/Extend';
import Shifting from '../Views/Components/CustomerKYC/Customer360Info/UserInfo/Shifting/Shifting';
const Stack = createStackNavigator();

function MainNavigator(props) {
  return (
    <Stack.Navigator initialRouteName="Splashscreen">
      <Stack.Group>
        <Stack.Screen
          options={{
            headerShown: false,
            headerLeft: null,
            animationEnabled: true,
          }}
          name="LandingPage"
          component={LandingPage}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            headerLeft: null,
            animationEnabled: true,
          }}
          name="Login"
          component={Login}
        />
      </Stack.Group>
      {props.isAuthenticated && (
        <Stack.Group>
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Dashboard"
            component={Dashboard2}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="ExpiryList"
            component={ExpiryList}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Payments"
            component={Payments}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="EmployeeStatus"
            component={EmployeeStatus}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Complaints"
            component={Complaints}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="TrafReports"
            component={TrafficSessionReport}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="MapDesignView"
            component={MapDesignView}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Add_Complaints"
            component={AddComplaints}
          />

          <Stack.Screen
            options={{
              headerTintColor: Colors.black,
              headerTitle: 'Payment Page',
              headerStyle: {backgroundColor: Colors.green_0D6542},
            }}
            name="PaymentGateWayWebView"
            component={PaymentGateWayWebView}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Leads"
            component={Leads}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="AddNetwork"
            component={AddNetwork}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="NetworkPreviewDetails"
            component={NetworkPreviewDetails}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="ConnectedDevicesDetails"
            component={ConnectedDevicesDetails}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="ConnectedDevicesDetailsPDP"
            component={ConnectedDevicePDP}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="ConnectedDevicesDetailsCDP"
            component={ConnectedChildDP}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="ConnectedDevicesDetailsCPE"
            component={ConnectedCPE}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Pickups_List"
            component={Pickups_List}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="LocationNavigation"
            component={LocationNavigation}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="KYC_List"
            component={KYC_List}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="KYC_Add_Update"
            component={KYC_Add_Update}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Customer360Info"
            component={Customer360Info}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="PlanRenewal"
            component={PlanRenewal}
          />
 <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Extend"
            component={Extend}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Shifting"
            component={Shifting}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="notificationList"
            component={NotificationList}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="BillingHistory"
            component={BillingHistory}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="PdfViewBill"
            component={PdfViewBill}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="Reports"
            component={Reports}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="SecurityGroupReport"
            component={SecurityGroup}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="CustomersReport"
            component={CustomerReports}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="HelpdeskReport"
            component={HelpdeskReports}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="LedgerReport"
            component={LedgerReports}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="RevenueReport"
            component={RevenueReports}
          />
           <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="FranchiseReport"
            component={FranchiseReports}
          />
            <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="InvoiceReports"
            component={InvoiceReport}
          />
           <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="GSTReports"
            component={GstReports}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              headerLeft: null,
              animationEnabled: true,
            }}
            name="LeadsReports"
            component={LeadReports}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

function mapStateToProps(state, props) {
  return {
    isAuthenticated: state.mainReducers.main.isAuthenticated,
  };
}

export default connect(mapStateToProps)(MainNavigator);
