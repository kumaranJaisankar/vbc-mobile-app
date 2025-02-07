import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import {Checkbox, RadioButton, TextInput} from 'react-native-paper';
import {
  getAssignedToUser,
  getAssignUsers,
  postComplaint,
  editTicket,
  getNAS,
  getOLT,
  getDP,
  getPort,
  sendOTP,
  verifyOTP,
  getSubCat,
  technicianList,
  getWorkNote,
  workNotesSave,
  verifyOTPEnc,
  getAssignUsersV2,
  verifyProvisioningOTP,
} from '../../services/MainService';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import globalStyles from '../../Common/globalStyles';
import {
  formatCustomDate,
  formatCustomDateWithTime,
  formatDate,
  formatDateV3,
} from '../../Common/utility';
import styles from './styles';
import {formData} from '../../Common/formData';
import FormFieldInput from '../CustomerKYC/FormFields/KYC_FormField1';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Toast from 'react-native-toast-message';
import {set} from 'date-fns';
import DialogView from '../../Common/DialogView';
import MacAddressInput from '../../Common/MacAddressInput';
import { useNavigation } from '@react-navigation/native';

const ComplaintsForm = props => {
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const [isFocus, setIsFocus] = useState(false);
  const [openBy, setOpenBy] = useState('');
  const [customerID, setCustomerID] = useState(
    props.customerID ? props.customerID : '',
  );
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [branch, setBranch] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [nasID, setNASID] = useState('');
  const [nas, setNAS] = useState({});
  const [oltID, setOLTID] = useState('');
  const [olt, setOLT] = useState({});
  const [dpID, setDPID] = useState('');
  const [dp, setDP] = useState({});
  const [portID, setPortID] = useState('');
  const [port, setPort] = useState({});
  const [assignedToData, setAssignedToData] = useState([]);
  const [isLoading, setLoading] = useState({
    spinner: false,
    spinnerText: '',
  });
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [nasList, setNASList] = useState([]);
  const [oltList, setOLTList] = useState([]);
  const [dpList, setDPList] = useState([]);
  const [portList, setPortList] = useState([]);
  const [otpResponse, setOTPResponse] = useState({});
  const [otpVerifyResponse, setOTPVerifyResponse] = useState({});
  const [subCategoryDatas, setSubCategoryData] = useState([]);
  const [technicianListValue, setTechnicianListValue] = useState([]);
  const [technicianValue, setTechnicianValue] = useState('');
  const [technicianValueName, setTechnicianValueName] = useState('');
  const [workNote, setWorkNote] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [checked, setChecked] = useState(false);

  const [enable, setEnable] = useState(false);
  const [isRenewRecent, setRenewRecent] = React.useState({
    text: '',
    visible: false,
  });

  const permission = props.userInfo.permissions;
  console.log('🚀 ~ file: ComplaintsForm.js:95 ~ permission', props);

  console.log('complaintItemData.ticket_category.category', complaintItemData);

  console.log('props?.valueFromser', props?.customerID);

  var customersData = props.customers;
  var categoryData = props.category;
  var priorityData = props.priority?.map(x => {
    return {
      id: x.id,
      name: x.name,
      response_time: x.response_time,
      resolution_time: x.resolution_time,
      escalation_notification_message: x.escalation_notification_message,
      notification_frequency: x.notification_frequency,
    };
  });
  console.log('props is data ', props);
  var statusData = props.status;
  var subcategoryData = props.subcategory;
  var complaintItemData = props.isEditClicked ? props.complaintItem : null;
  console.log('cData props', props.userInfo.id);
  console.log('status', status);
  console.log('props', props.userInfo.user_type);

  console.log('complaintItemData', complaintItemData);

  console.log(
    'permissions logic',
    permission.find(code => code != 454),
  );

  var data = {
    openDate: formatCustomDate(),
    username: props.userInfo.username,
    category: props.isEditClicked
      ? complaintItemData.ticket_category.category
      : '',
    customerID: props.isEditClicked ? complaintItemData.open_for : '',
    sub_category: props.isEditClicked
      ? complaintItemData.sub_category.name
      : '',
    assigned_date: props.isEditClicked
      ? complaintItemData.assigned_date
        ? formatDate(complaintItemData.assigned_date)
        : ''
      : formatCustomDateWithTime(),
    priority: props.isEditClicked ? complaintItemData.priority_sla.name : '',
    watchList2: [],
    customerNotes: props.isEditClicked ? complaintItemData.customer_notes : '',
    notes: props.isEditClicked ? complaintItemData.notes : '',
    branch: props.isEditClicked
      ? complaintItemData.branch
        ? complaintItemData.branch
        : ''
      : '',
    mac: '',
    setup: '',
    extension: '',
    otpCode: '',
  };

  const changeStatusText = status => {
    console.log(status);
    if (status == 'CLD') {
      statusData = 'Closed';
    } else if (status == 'Hold') {
      statusData = 'Hold';
    } else if (status == 'INP') {
      statusData = 'In Progress';
    } else if (status == 'OPN') {
      statusData = 'Open';
    } else if (status == 'RSL') {
      statusData = 'Resolved';
    } else if (status == 'ASN') {
      statusData = 'Assigned';
    } else {
      statusData = status;
    }
    return statusData;
  };

  console.log('111', status);

  // helpdesk data
  const helpdskStatusData = [
    {name: 'Open', id: 'OPN'},
    {name: 'Assigned', id: 'ASN'},
    {name: 'Closed', id: 'CLD'},
  ];

  // zonal manager
  const zonalStatusData = [
    {name: 'Open', id: 'OPN'},
    {name: 'Assigned', id: 'ASN'},
    {name: 'Closed', id: 'CLD'},
  ];

  // staff
  const staffStatusData = [
    {name: 'In Progress', id: 'INP'},
    {name: 'Resolved', id: 'RSL'},
  ];

  const getNASData = async () => {
    setDropdownLoading(true);
    try {
      const response = await getNAS(props.userInfo.branch.id);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setNASList(response.result);
          setDropdownLoading(false);
        } else {
          setRenewRecent({
            text: 'No NAS Available For This Branch!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No NAS Available For This Branch!',
          // });
          setDropdownLoading(false);
        }
      } else {
        const resposneMsg = response;
        setRenewRecent({
          text: 'No NAS Available For This Branch!',
          visible: true,
        });
        setDropdownLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setRenewRecent({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later',
      // });
      setDropdownLoading(false);
    }
  };
  const getOLTData = async nasID => {
    try {
      const response = await getOLT(nasID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setOLTList(response.result);
        } else {
          setOLTList([]);
          setRenewRecent({
            text: 'No OLT available for this NAS!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No OLT available for this NAS!',
          // });
        }
      } else {
        const resposneMsg = response;
        setOLTList([]);
        setRenewRecent({
          text: 'No OLT available for this NAS!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No OLT available for this NAS!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setOLTList([]);
      setRenewRecent({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later',
      // });
    }
  };
  const getDPData = async oltID => {
    try {
      const response = await getDP(oltID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setDPList(response.result);
        } else {
          setDPList([]);
          setRenewRecent({
            text: 'No DP available for this OLT!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No DP available for this OLT!',
          // });
        }
      } else {
        const resposneMsg = response;
        setDPList([]);
        setRenewRecent({
          text: 'No DP available for this OLT!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No DP available for this OLT!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDPList([]);
      setRenewRecent({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later',
      // });
    }
  };
  const getPortData = async dpID => {
    try {
      const response = await getPort(dpID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setPortList(response.result);
        } else {
          setPortList([]);
          setRenewRecent({
            text: 'No Port available for this DP!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Port available for this DP!',
          // });
        }
      } else {
        const resposneMsg = response;
        setPortList([]);
        setRenewRecent({
          text: 'No Port available for this DP!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No Port available for this DP!',
        // });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setPortList([]);
      setRenewRecent({
        text: 'Something went wrong! Please try again later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later',
      // });
    }
  };
  const [formValues, handleFormValueChange, setFormValues] = formData(data);
  const onResetClick = () => {
    if (props.isEditClicked) {
      setAssignedTo('');
      setStatus('');
      setNASID('');
      setOLTID('');
      setDPID('');
      setPortID('');
      setFormValues({
        notes: '',
        mac: '',
        setup: '',
        extension: '',
      });
      setTechnicianValue('');
      setAdditionalInfo('');
    } else {
      setCustomerID('');
      setCategory('');
      setSubCategory('');
      setAssignedTo('');
      setPriority('');
      setBranch('');
      setStatus('');
      setFormValues({
        notes: '',
        watchList2: [],
        customerNotes: '',
      });
    }
  };
  const sendTicketOTP = async () => {
    let body = {
      username: complaintItemData.username,
    };
    setLoading({
      spinner: true,
      spinnerText: 'Sending OTP...',
    });
    try {
      const response = await sendOTP(body);
      if (response.isSuccess) {
        setOTPResponse(response.result);
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'OTP Sent Successfully!',
        });
        refRBSheet.current.open();
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: 'OTP Sent Failed! Please try later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'OTP Sent Failed! Please try later',
        // });
      }
    } catch (ex) {
      const errorresponse = error.toString();
      setLoading({spinner: false, spinnerText: ''});
      setRenewRecent({
        text: 'OTP Sent Failed! Please try later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'OTP Sent Failed! Please try later',
      // });
    }
  };
  const verifyTicketOTP = async () => {
    let body = {
      otp: formValues.otpCode,
      username: complaintItemData.username,
    };
    setLoading({
      spinner: true,
      spinnerText: 'Verifying OTP...',
    });
    try {
      if (
        complaintItemData.ticket_category.category ==
          'Provisioning_for_refund' &&
        status == 'CLD'
      ) {
        let value = {
          otp: formValues.otpCode,
          username: complaintItemData.username,
          sub_category: {
            id: complaintItemData?.sub_category?.id,
            name: complaintItemData?.sub_category?.name,
          },
          ticket_category: {
            id: complaintItemData?.ticket_category?.id,
            category: complaintItemData?.ticket_category?.category,
          },
          ticket_id: complaintItemData.id,
        };
        console.log('complaint value', value);
        var response = await verifyProvisioningOTP(value);
        console.log(
          '🚀 ~ file: ComplaintsForm.js:421 ~ verifyTicketOTP ~ response:',
          response,
        );
      } else {
        var response = await verifyOTPEnc(body);
      }

      if (response.isSuccess) {
        setOTPVerifyResponse(response.result);
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'OTP Verification Successful!',
        });
        refRBSheet.current.close();
        if (response.result.status) {
          let body = {
            id: complaintItemData?.id,
            open_for: complaintItemData?.open_for,
            assigned_to: assignedTo
              ? assignedTo
              : complaintItemData.assigned_to != undefined
              ? complaintItemData.assigned_to.id.toString()
              : '',
            open_date: complaintItemData?.open_date,
            assigned_date:
              status == 'ASN' && !complaintItemData.assigned_date
                ? formatCustomDateWithTime()
                : complaintItemData.assigned_date,
            status: status ? status : complaintItemData?.status,
            // priority_sla: {
            //   id: complaintItemData.priority_sla.id,
            //   name: complaintItemData.priority_sla.name,
            // },
            priority_sla: priorityData?.find(item => item?.id === priority)
              ? find(item => item?.id === priority)
              : {
                  id: complaintItemData?.priority_sla?.id,
                  name: complaintItemData?.priority_sla?.name,
                },

            customer_notes: complaintItemData.customer_notes,
            notes: formValues.notes,
            ticket_category: {
              id: complaintItemData?.ticket_category?.id,
              category: complaintItemData.ticket_category.category,
            },
            sub_category: {
              id: complaintItemData?.sub_category?.id,
              name: complaintItemData.sub_category.name,
            },
            work_notes: complaintItemData.work_notes,
            watchlists:
              complaintItemData.watchlists.length > 0
                ? [
                    {
                      user: complaintItemData.watchlists[0].user.id,
                    },
                  ]
                : [],
            created: complaintItemData.created,
            modified: complaintItemData.modified,
          };
          if (technicianValue) {
            body.technician_comment = {
              id: technicianValue,
              name: technicianValueName,
            };
          }
          if (status == 'CLD') {
            body.closed_by = props.userInfo.id;
          } else if (status == 'INP') {
            body.inprogress_by = props.userInfo.id;
          } else if (status == 'OPN') {
            body.opened_by = props.userInfo.id;
          } else if (status == 'RSL') {
            body.resolved_by = props.userInfo.id;
          } else if (status == 'ASN') {
            body.assigned_by = props.userInfo.id;
          }

          console.log('body', body);
          updateTicket(body);
        } else {
          setRenewRecent({
            text: 'OTP Verification Failed! Please try later',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'OTP Verification Failed! Please try later.',
          // });
        }
      } else {
        const errorresponse = response;
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: 'OTP Verification Failed! Please try later',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'OTP Verification Failed! Please try later.',
        // });
        refRBSheet.current.close();
      }
    } catch (ex) {
      const errorresponse = error.toString();
      setLoading({spinner: false, spinnerText: ''});
      setRenewRecent({
        text: 'OTP Verification Failed! Please try later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'OTP Verification Failed! Please try later.',
      // });
      refRBSheet.current.close();
    }
  };

  const onAddClick = async () => {
    if (props.isEditClicked) {
      if (
        complaintItemData.ticket_category.category == 'Provisioning' &&
        complaintItemData.status == 'ASN'
      ) {
        if (
          nas &&
          olt &&
          dp &&
          port &&
          formValues.mac &&
          formValues.setup &&
          formValues.extension
        ) {
          let body = {
            id: complaintItemData?.id,
            open_for: complaintItemData?.open_for,
            assigned_to: assignedTo
              ? assignedTo
              : complaintItemData.assigned_to != undefined
              ? complaintItemData.assigned_to?.id.toString()
              : '',
            open_date: complaintItemData.open_date,
            assigned_date:
              status == 'ASN' && !complaintItemData.assigned_date
                ? formatCustomDateWithTime()
                : complaintItemData.assigned_date,
            status: status ? status : complaintItemData.status,
            // priority_sla: {
            //   id: complaintItemData.priority_sla.id,
            //   name: complaintItemData.priority_sla.name,
            // },
            priority_sla: priorityData?.find(item => item?.id === priority)
              ? find(item => item?.id === priority)
              : {
                  id: complaintItemData.priority_sla?.id,
                  name: complaintItemData.priority_sla?.name,
                },
            // priority_sla: {id: priority, name: },
            customer_notes: complaintItemData.customer_notes,
            notes: formValues.notes,
            ticket_category: {
              id: complaintItemData.ticket_category?.id,
              category: complaintItemData.ticket_category.category,
            },
            sub_category: {
              id: complaintItemData.sub_category.id,
              name: complaintItemData.sub_category.name,
            },
            work_notes: complaintItemData.work_notes,
            watchlists:
              complaintItemData.watchlists.length > 0
                ? [
                    {
                      user: complaintItemData.watchlists[0].user?.id,
                    },
                  ]
                : [],
            created: complaintItemData.created,
            modified: complaintItemData.modified,
            network_info: {
              extension_no: formValues.extension,
              serial_no: formValues.setup,
              onu_mac: formValues.mac,
              nas: nas,
              olt: olt,
              dp: dp,
              port: port,
            },
          };
          if (technicianValue) {
            body.technician_comment = {
              id: technicianValue,
              name: technicianValueName,
            };
          }
          if (status == 'CLD') {
            body.closed_by = props.userInfo.id;
          } else if (status == 'INP') {
            body.inprogress_by = props.userInfo.id;
          } else if (status == 'OPN') {
            body.opened_by = props.userInfo.id;
          } else if (status == 'RSL') {
            body.resolved_by = props.userInfo.id;
          } else if (status == 'ASN') {
            body.assigned_by = props.userInfo.id;
          }
          console.log('body', body);
          updateTicket(body);
        } else {
          setRenewRecent({
            text: 'Please fill up all the required fields!',
            visible: true,
          });
          // Toast.show({
          //   type: 'warning',
          //   text1: 'Please fill up all the required fields!',
          // });
        }
      } else if (
        complaintItemData.ticket_category.category == 'Installation' &&
        status == 'CLD'
      ) {
        sendTicketOTP();
      } else if (
        complaintItemData.ticket_category.category == 'Provisioning' &&
        status == 'CLD'
      ) {
        sendTicketOTP();
      } else if (
        complaintItemData.ticket_category.category ==
          'Provisioning_for_refund' &&
        status == 'CLD'
      ) {
        sendTicketOTP();
      } else {
        let body = {
          id: complaintItemData?.id,
          open_for: complaintItemData.open_for,
          assigned_to: assignedTo
            ? assignedTo
            : complaintItemData.assigned_to != undefined
            ? complaintItemData?.assigned_to?.id.toString()
            : '',
          open_date: complaintItemData.open_date,
          assigned_date:
            status == 'ASN' && !complaintItemData.assigned_date
              ? formatCustomDateWithTime()
              : complaintItemData.assigned_date,
          status: status ? status : complaintItemData.status,
          // priority_sla: {
          //   id: complaintItemData.priority_sla.id,
          //   name: complaintItemData.priority_sla.name,
          // },
          priority_sla: priorityData?.find(item => item?.id === priority)
            ? find(item => item?.id === priority)
            : {
                id: complaintItemData.priority_sla.id,
                name: complaintItemData.priority_sla.name,
              },
          // priority_sla: {id: priority, name: },
          customer_notes: complaintItemData.customer_notes,
          notes: formValues.notes,
          ticket_category: {
            id: complaintItemData.ticket_category.id,
            category: complaintItemData.ticket_category.category,
          },
          sub_category: {
            id: complaintItemData.sub_category.id,
            name: complaintItemData.sub_category.name,
          },
          work_notes: complaintItemData.work_notes
            ? complaintItemData.work_notes
            : '',
          watchlists:
            complaintItemData.watchlists.length > 0
              ? [
                  {
                    user: complaintItemData.watchlists[0].user.id,
                  },
                ]
              : [],
          created: complaintItemData.created,
          modified: complaintItemData.modified,
        };
        if (technicianValue) {
          body.technician_comment = {
            id: technicianValue,
            name: technicianValueName,
          };
        }
        if (status == 'CLD') {
          body.closed_by = props.userInfo.id;
        } else if (status == 'INP') {
          body.inprogress_by = props.userInfo.id;
        } else if (status == 'OPN') {
          body.opened_by = props.userInfo.id;
        } else if (status == 'RSL') {
          body.resolved_by = props.userInfo.id;
        } else if (status == 'ASN') {
          body.assigned_by = props.userInfo.id;
        }
        console.log(body, 'bodybody');
        updateTicket(body);
      }
    } else {
      if (formValues.customerNotes == null || !formValues.customerNotes) {
        setRenewRecent({
          text: 'Customer Notes is required!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Customer Notes is required!',
        // });
        return;
      } else if (/^[a-zA-Z0-9]+$/.test(formValues.customerNotes) === false) {
        setRenewRecent({
          text: 'Customer Notes should contain alpha numerics!',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Customer Notes should contain alpha numerics!',
        // });
        return;
      }
      if (
        customerID &&
        category &&
        subCategory &&
        assignedTo &&
        formValues.assigned_date &&
        priority &&
        status &&
        formValues.customerNotes
      ) {
        let body = {
          open_for: customerID,
          ticket_category: category.toString(),
          sub_category: subCategory.toString(),
          assigned_to: parseInt(assignedTo),
          status: status,
          assigned_date: formValues.assigned_date,
          priority_sla: priority.toString(),
          customer_notes: formValues.customerNotes,
          watchlists: [{user: parseInt(assignedTo)}],
          notes: formValues.notes,
          opened_by: props.userInfo.id,
        };
        setLoading({
          spinner: true,
          spinnerText: 'Creating  Complaint...',
        });
        console.log(body, 'body');
        try {
          const response = await postComplaint(body);
          if (response.isSuccess) {
            const responseMsg = response;
            onResetClick();
            setLoading({spinner: false, spinnerText: ''});
            Toast.show({
              type: 'success',
              text1: 'Complaint Created Successfully!',
            });
          } else {
            const errorresponse = response;
            if(errorresponse?.message?.response?.data?.non_field_errors[0] === "A Ticket already exists for this user!") {
              setLoading({spinner: false, spinnerText: ''});
              setRenewRecent({
                text: "A Ticket already exists for this user!",
                visible: true,
              }); 
            } else if(errorresponse?.message?.response?.data?.includes("DoesNotExist")) {
              setLoading({spinner: false, spinnerText: ''});
              setRenewRecent({
                text: "User Does not exist",
                visible: true,
              });
            } else {
              console.log(
                '🚀 ~ file: ComplaintsForm.js:655 ~ onAddClick ~ errorresponse',
                errorresponse?.message?.response?.data?.non_field_errors[0],
              );
              setLoading({spinner: false, spinnerText: ''});
              setRenewRecent({
                text: errorresponse?.message?.response?.data?.non_field_errors[0],
                visible: true,
              });
              // Toast.show({
              //   type: 'error',
              //   text1:
              //     errorresponse?.message?.response?.data?.non_field_errors[0],
              // });
            }
          }
        } catch (err) {
          const errorresponse = err.toString();
          console.log(
            '🚀 ~ file: ComplaintsForm.js:663 ~ onAddClick ~ errorresponse',
            errorresponse,
          );
          setLoading({spinner: false, spinnerText: ''});
          setRenewRecent({
            text: 'Request not Successful! Please try later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'Request not Successful! Please try later.',
          // });
        }
      } else {
        setRenewRecent({
          text: 'Please fill up all the required fields!',
          visible: true,
        });
        // Toast.show({
        //   type: 'warning',
        //   text1: 'Please fill up all the required fields!',
        // });
      }
    }
  };
  const updateTicket = async body => {
    setLoading({
      spinner: true,
      spinnerText: 'Updating  Complaint...',
    });
    try {
      console.log(body, '123');
      const response = await editTicket(complaintItemData.id, body);
      console.log(response);
      if (response.isSuccess) {
        const responseMsg = response;
        onResetClick();
        // navigation.navigate('Add_Complaints');
        props.showTicketList();
        setLoading({spinner: false, spinnerText: ''});
        Toast.show({
          type: 'success',
          text1: 'Complaint Updated Successfully!',
        });
      } else {
        const errorresponse = response;
        console.log(errorresponse, 'errorresponse1');
        setLoading({spinner: false, spinnerText: ''});
        setRenewRecent({
          text: 'Request not Successful! Please try later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Request not Successful! Please try later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      console.log(errorresponse, 'errorresponse2');
      setLoading({spinner: false, spinnerText: ''});
      setRenewRecent({
        text: 'Request not Successful! Please try later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Request not Successful! Please try later.',
      // });
    }
  };
  const getUsers = async () => {
    try {
      const response = await getAssignUsersV2();
      console.log(
        '🚀 ~ file: ComplaintsForm.js:762 ~ getUsers ~ response',
        response,
      );
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setAssignedToData(response?.result);
        } else {
          setRenewRecent({
            text: 'No data found! Please try later.',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No data found! Please try later.',
          // });
        }
      } else {
        setRenewRecent({
          text: 'No data found! Please try later.',
          visible: true,
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'No data found! Please try later.',
        // });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setRenewRecent({
        text: 'Something went wrong! Please try again later.',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong! Please try again later.',
      // });
    }
  };
  const getAssignedToUserInfo = async userID => {
    try {
      const response = await getAssignedToUser(userID);
      console.log(response);
      if (response.isSuccess) {
        setBranch(
          response.result.branch.name ? response.result.branch.name : '',
        );
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  const saveWorkNote = async () => {
    let body = {
      note: additionalInfo,
      status: status ? status : complaintItemData?.status,
    };
    setLoading({
      spinner: true,
      spinnerText: 'Saving Work Note...',
    });
    const response = await workNotesSave(
      props?.complaintItem?.id ? props?.complaintItem?.id : '',
      body,
    );
    if (response?.status === 201) {
      setLoading({
        spinner: false,
        spinnerText: '',
      });
      getWorkNoteList(props?.complaintItem?.id);
      setAdditionalInfo('');
    } else {
      setLoading({
        spinner: false,
        spinnerText: 'Saving Work Note...',
      });
    }
  };

  const getSubCatOption = async catID => {
    setLoading({
      spinner: true,
      spinnerText: 'Getting Sub-Categories...',
    });
    try {
      setSubCategoryData([]);
      const response = await getSubCat(catID);
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setSubCategoryData(response.result);
          setLoading({
            spinner: false,
          });
        } else {
          setLoading({
            spinner: false,
            spinnerText: '',
          });
          setTimeout(() => {
            setRenewRecent({
              text: 'No Data Found!',
              visible: true,
            });
            // Toast.show({
            //   type: 'error',
            //   text1: 'No Data Found!',
            // });
          }, 20000);
        }
      } else {
        setLoading({
          spinner: false,
          spinnerText: '',
        });
        setTimeout(() => {
          setRenewRecent({
            text: 'No Data Found!',
            visible: true,
          });
          // Toast.show({
          //   type: 'error',
          //   text1: 'No Data Found!',
          // });
        }, 20000);
      }
    } catch (error) {
      setSubCategoryData([]);
      const errorresponse = error.toString();
      setLoading({
        spinner: false,
        spinnerText: '',
      });
      setRenewRecent({
        text: 'Something Went Wrong! Please Try Again Later',
        visible: true,
      });
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something Went Wrong! Please Try Again Later',
      // });
    }
  };

  const getTechnicianList = async () => {
    console.log('hi');
    const response = await technicianList();
    console.log('responseeeeeeeeeeee', response);
    if (response?.result?.length > 0) {
      setTechnicianListValue(response?.result);
    } else {
      console.log('Problem in Technician List');
    }
  };

  const getWorkNoteList = async ticketID => {
    setLoading({
      spinner: true,
      spinnerText: 'Getting Work Note....',
    });
    const response = await getWorkNote(ticketID);
    if (response?.result?.work_notes?.length > 0) {
      setWorkNote(response?.result?.work_notes);
      setLoading({
        spinner: false,
        spinnerText: 'Getting Work Note....',
      });
    } else {
      setLoading({
        spinner: false,
        spinnerText: 'Getting Work Note....',
      });
    }
  };

  useEffect(() => {
    getTechnicianList();
    if (props?.complaintItem?.id) {
      getWorkNoteList(props?.complaintItem?.id);
    }
    if (complaintItemData?.status === 'OPN') {
      setEnable(true);
    }
  }, []);

  useEffect(() => {
    console.log(props?.userInfo);
    if (props?.userInfo?.branch?.name) setBranch(props?.userInfo?.branch?.name);
  }, [props?.userInfo]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.white, marginTop: 20}}>
      <View>
        <FormFieldInput
          title={'Open Date'}
          formKey={'open_date'}
          isMandatory={true}
          showInputField
          isEnabled={false}
          length={20}
          value={formValues.openDate}
        />
      </View>
      <View style={{marginTop: 15}}>
        <FormFieldInput
          title={'Open By'}
          formKey={'username'}
          isMandatory={true}
          showInputField
          isEnabled={false}
          length={20}
          value={formValues.username}
        />
      </View>
      <View
        style={
          props.isEditClicked
            ? {marginTop: 15}
            : {flexDirection: 'row', marginTop: 15}
        }>
        {props.isEditClicked ? (
          <FormFieldInput
            title={'Customer ID' + ' *'}
            formKey={'customerID'}
            isMandatory={true}
            showInputField
            isEnabled={false}
            length={20}
            value={formValues.customerID}
          />
        ) : (
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Customer ID
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            <SafeAreaView>
              <SearchableDropdown
                onItemSelect={item => {
                  setCustomerID(item.id);
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                }}
                itemTextStyle={{color: '#222'}}
                itemsContainerStyle={{
                  maxHeight: 140,
                  backgroundColor: '#fff',
                  borderColor: '#bbb',
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                items={props.customers?.map(item => {
                  {
                    return {
                      id: item.username,
                      name: item.username,
                    };
                  }
                })}
                resetValue={false}
                textInputProps={{
                  // onTextChange: text => setCustomerBoxText(text),
                  // value: customerBoxText,
                  placeholder: customerID ? customerID : 'Search Customer',
                  underlineColorAndroid: 'transparent',
                  style: styles.dropdown,
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </SafeAreaView>
          </View>
        )}
      </View>
      <View
        style={
          props.isEditClicked
            ? {marginTop: 15}
            : {flexDirection: 'row', marginTop: 15}
        }>
        {props.isEditClicked ? (
          <FormFieldInput
            title={'Category' + ' *'}
            formKey={'category'}
            isMandatory={true}
            showInputField
            isEnabled={false}
            length={20}
            value={formValues.category}
          />
        ) : (
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Category
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={categoryData}
              maxHeight={200}
              labelField="category"
              valueField="id"
              placeholder=""
              value={category}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setCategory(item.id);
                getSubCatOption(item.id);
                setIsFocus(false);
              }}
            />
          </View>
        )}
      </View>
      <View
        style={
          props.isEditClicked
            ? {marginTop: 15}
            : {flexDirection: 'row', marginTop: 15}
        }>
        {props.isEditClicked ? (
          <FormFieldInput
            title={'Sub Category' + ' *'}
            formKey={'sub_category'}
            isMandatory={true}
            showInputField
            isEnabled={false}
            length={20}
            value={formValues.sub_category}
          />
        ) : (
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Sub Category
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={subCategoryDatas}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder=""
              value={subCategory}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSubCategory(item.id);
                setIsFocus(false);
              }}
            />
          </View>
        )}
      </View>
      {permission.find(code => code === 455) && (
        <View>
          {props.isEditClicked && complaintItemData?.status != 'OPN' && (
            <View style={{flexDirection: 'row'}}>
              <Checkbox
                color={Colors.black}
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                  setStatus('ASN');
                  setEnable(true);
                }}
              />
              {/* <RadioButton
                value="reassign"
                status={checked === 'reassign' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('reassign');
                  setStatus('ASN');
                  setEnable(true);
                }}
              /> */}
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 16,
                  marginRight: 10,
                  marginTop: 5,
                }}>
                Reassigned
              </Text>
            </View>
          )}
        </View>
      )}

      {props.isEditClicked && (
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Assigned To
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={assignedToData}
              maxHeight={200}
              labelField="username"
              valueField="id"
              placeholder={
                props.isEditClicked
                  ? complaintItemData?.assigned_to != undefined
                    ? complaintItemData?.assigned_to?.username
                    : ''
                  : ''
              }
              value={assignedTo}
              onFocus={() => {
                setIsFocus(true);
                getUsers();
              }}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setAssignedTo(item.id);
                setIsFocus(false);
                getAssignedToUserInfo(item.id);
                setStatus('ASN');
              }}
              disable={!enable}
            />
          </View>
        </View>
      )}

      {!props.isEditClicked && (
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Assigned To
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            {permission.find(code => code === 454) ? (
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={assignedToData}
                maxHeight={200}
                labelField="username"
                valueField="id"
                placeholder={
                  props.isEditClicked
                    ? complaintItemData?.assigned_to != undefined
                      ? complaintItemData?.assigned_to?.username
                      : ''
                    : ''
                }
                value={assignedTo}
                onFocus={() => {
                  setIsFocus(true);
                  getUsers();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setStatus('ASN');
                  setAssignedTo(item.id);
                  setIsFocus(false);
                  getAssignedToUserInfo(item.id);
                }}
              />
            ) : (
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={assignedToData}
                maxHeight={200}
                labelField="username"
                valueField="id"
                placeholder={
                  props.isEditClicked
                    ? complaintItemData?.assigned_to != undefined
                      ? complaintItemData?.assigned_to?.username
                      : ''
                    : ''
                }
                value={assignedTo}
                onFocus={() => {
                  setIsFocus(true);
                  getUsers();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setStatus('ASN');
                  setAssignedTo(item.id);
                  setIsFocus(false);
                  getAssignedToUserInfo(item.id);
                }}
                disable={enable}
              />
            )}
          </View>
        </View>
      )}

      <View style={{marginTop: 15}}>
        <FormFieldInput
          title={'Assigned Date' + ' *'}
          formKey={'assigned_date'}
          isMandatory={true}
          showInputField
          isEnabled={false}
          length={20}
          value={formValues.assigned_date}
        />
      </View>

      <View style={!props.isEditClicked ? {marginTop: 15} : {marginTop: 0}}>
        {!props.isEditClicked ? (
          <FormFieldInput
            title={'Branch'}
            formKey={'branch'}
            isMandatory={true}
            showInputField
            isEnabled={false}
            length={20}
            value={branch}
          />
        ) : null}
      </View>
      <View
        style={
          props.isEditClicked
            ? {marginTop: 15}
            : {flexDirection: 'row', marginTop: 15}
        }>
        {props.isEditClicked ? (
          <>
            {props?.userInfo?.id !== complaintItemData?.created_by?.id ? (
              <FormFieldInput
                title={'Priority'}
                formKey={'priority'}
                isMandatory={true}
                showInputField
                isEnabled={props?.userInfo?.id === false}
                length={20}
                value={formValues.priority}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setPriority(item.id);
                  setIsFocus(false);
                }}
              />
            ) : (
              <View
                style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.grey_888888,
                      fontSize: 14,
                    }}>
                    Priority
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: Colors.grey_888888,
                      fontSize: 14,
                    }}>
                    *
                  </Text>
                </View>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={priorityData}
                  maxHeight={200}
                  labelField="name"
                  valueField="id"
                  placeholder={formValues?.priority}
                  value={priority}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setPriority(item.id);
                    setIsFocus(false);
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                Priority
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                }}>
                *
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={priorityData}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder=""
              value={priority}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPriority(item.id);
                setIsFocus(false);
              }}
            />
          </View>
        )}
      </View>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              Status
            </Text>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              *
            </Text>
          </View>

          <View>
            {props.userInfo.user_type === 'Help Desk' ? (
              <View>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={helpdskStatusData}
                  maxHeight={200}
                  labelField="name"
                  valueField="id"
                  placeholder={complaintItemData?.status_name}
                  value={status}
                  onFocus={() => {
                    setIsFocus(true);
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setStatus(item.id);
                    setIsFocus(false);
                  }}
                />
              </View>
            ) : props.userInfo.user_type === 'Zonal Manager' ? (
              <View>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={zonalStatusData}
                  maxHeight={200}
                  labelField="name"
                  valueField="id"
                  placeholder={complaintItemData?.status_name}
                  value={status}
                  onFocus={() => {
                    setIsFocus(true);
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setStatus(item.id);
                    setIsFocus(false);
                  }}
                />
              </View>
            ) : props.userInfo.user_type === 'Staff' ? (
              <View>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={staffStatusData}
                  maxHeight={200}
                  labelField="name"
                  valueField="id"
                  placeholder={complaintItemData?.status_name}
                  value={status}
                  onFocus={() => {
                    setIsFocus(true);
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setStatus(item.id);
                    setIsFocus(false);
                  }}
                />
              </View>
            ) : (
              <View>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={statusData}
                  maxHeight={200}
                  labelField="name"
                  valueField="id"
                  placeholder={
                    props.isEditClicked
                      ? changeStatusText(complaintItemData.status)
                      : ''
                  }
                  // value={changeStatusText(status)}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    console.log(item?.id);
                    setStatus(item.id);
                    setIsFocus(false);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      {/* {complaintItemData.status == 'CLD' && 
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              MAC ID
            </Text>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: Colors.grey_888888,
                fontSize: 14,
              }}>
              *
            </Text>
          </View>
          <View>
            <MacAddressInput macID={props.mac_id ?? ""} />
          </View>
        </View>
      </View>} */}
      {props.isEditClicked &&
      complaintItemData.ticket_category.category == 'Provisioning' &&
      complaintItemData.status == 'ASN' ? (
        <View style={{marginTop: 15}}>
          <Text
            style={{
              color: Colors.orange_295CBF,
              fontSize: 15,
              fontFamily: 'Titillium-Semibold',
              padding: 10,
              height: 40,
            }}>
            NETWORK INFO:
          </Text>
          <View>
            <FormFieldInput
              title={'Branch'}
              formKey={'branch'}
              isMandatory={true}
              showInputField
              isEnabled={false}
              length={20}
              value={formValues.branch}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  NAS
                </Text>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  *
                </Text>
                {dropdownLoading ? (
                  <ActivityIndicator color={Colors.grey_888888} />
                ) : null}
              </View>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={nasList}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder={''}
                value={nasID}
                onFocus={() => {
                  setIsFocus(true);
                  getNASData();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setNASID(item.id);
                  setNAS(item);
                  getOLTData(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  OLT
                </Text>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  *
                </Text>
              </View>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={oltList}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder={''}
                value={oltID}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setOLTID(item.id);
                  setOLT(item);
                  getDPData(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  DP
                </Text>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  *
                </Text>
              </View>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dpList}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder={''}
                value={dpID}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setDPID(item.id);
                  setDP(item);
                  getPortData(item.id);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  Port
                </Text>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: Colors.grey_888888,
                    fontSize: 14,
                  }}>
                  *
                </Text>
              </View>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={portList}
                maxHeight={200}
                labelField="name"
                valueField="id"
                placeholder={''}
                value={portID}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setPortID(item.id);
                  setPort(item);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
          <FormFieldInput
            title={'ONU MAC *'}
            formKey={'mac'}
            isMandatory={true}
            showInputField
            isEnabled={true}
            length={20}
            value={formValues.mac}
            handleFormValueChange={handleFormValueChange}
          />
          <FormFieldInput
            title={'Setup Box No *'}
            formKey={'setup'}
            isMandatory={true}
            showInputField
            isEnabled={true}
            length={20}
            value={formValues.setup}
            handleFormValueChange={handleFormValueChange}
          />
          <FormFieldInput
            title={'Extension number *'}
            formKey={'extension'}
            isMandatory={true}
            showInputField
            isEnabled={true}
            length={20}
            value={formValues.extension}
            handleFormValueChange={handleFormValueChange}
          />
        </View>
      ) : null}
      <View style={!props.isEditClicked ? {marginTop: 15} : {marginTop: 0}}>
        {!props.isEditClicked ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: Colors.grey_888888,
                  fontSize: 14,
                  marginLeft: 13,
                }}>
                Watchlist
                <AntDesign
                  name="adduser"
                  size={14}
                  color={Colors.grey_888888}
                />
              </Text>
            </View>
            <View>
              <FormFieldInput
                title={''}
                formKey={'watchlist1'}
                isMandatory={true}
                showInputField
                isEnabled={false}
                length={20}
                value={customerID + ' ' + assignedTo}
              />
              <FormFieldInput
                title={''}
                formKey={'watchList2'}
                isMandatory={true}
                showInputField
                isEnabled={true}
                length={20}
                value={formValues.watchList2}
                handleFormValueChange={handleFormValueChange}
              />
            </View>
          </View>
        ) : null}
      </View>
      <View style={{marginTop: 15}}>
        {status === 'RSL' || props.complaintItem?.status === 'RSL' ? (
          <View style={{marginLeft: 11}}>
            <Text style={{fontSize: 20}}>TECHNICIAN</Text>
          </View>
        ) : null}
      </View>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        {status === 'RSL' || props.complaintItem?.status === 'RSL' ? (
          <View style={{flex: 0.97, flexDirection: 'column', marginLeft: 10}}>
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={{marginTop: -22}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={technicianListValue}
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder={'Technician Comment'}
              value={
                props.complaintItem?.technician_comment?.id
                  ? props.complaintItem?.technician_comment?.id
                  : technicianValue
              }
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setTechnicianValue(item.id);
                setTechnicianValueName(item.name);
                setIsFocus(false);
              }}
            />
          </View>
        ) : null}
      </View>
      <View style={{marginTop: 15}}>
        <FormFieldInput
          title={'Customer Notes *'}
          formKey={'customerNotes'}
          isMandatory={true}
          showInputField
          isEnabled={props.isEditClicked ? false : true}
          length={500}
          value={formValues.customerNotes}
          handleFormValueChange={handleFormValueChange}
        />
      </View>
      <View style={{marginTop: 15, marginBottom: 15}}>
        <FormFieldInput
          title={'Notes'}
          formKey={'notes'}
          isMandatory={true}
          showInputField
          isEnabled={true}
          length={200}
          value={formValues.notes}
          handleFormValueChange={handleFormValueChange}
        />
      </View>
      {/* {props.complaintItem?.status === 'RSL' ||
      props.complaintItem?.status === 'CLD' ? null : ( */}

      <View style={{marginTop: 15}}>
        {workNote?.length > 0 ? (
          <View>
            {props.isEditClicked && (
              <View style={{marginLeft: 12}}>
                <Text style={{marginTop: 8, fontSize: 20}}>Work Notes</Text>
                <Text style={{marginTop: 7, fontSize: 15}}>Activity</Text>
              </View>
            )}
          </View>
        ) : null}

        {props.isEditClicked && (
          <View>
            {workNote?.length > 0 ? (
              <View>
                {workNote?.map(item => {
                  return (
                    <View
                      style={{
                        marginLeft: 12,
                        marginTop: 10,
                        borderWidth: 1,
                        padding: 5,
                      }}>
                      <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                        ADMIN ({formatDateV3(item?.created)})
                      </Text>
                      <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                        Note: {item?.note}
                      </Text>
                      <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                        Status:{' '}
                        {item?.status === 'CLD'
                          ? 'Closed'
                          : item?.status == 'Hold'
                          ? 'Hold'
                          : item?.status === 'INP'
                          ? 'In Progress'
                          : item?.status === 'OPN'
                          ? 'Open'
                          : item?.status === 'RSL'
                          ? 'Resolved'
                          : item?.status === 'ASN'
                          ? 'Assigned'
                          : ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        )}
        {props.isEditClicked && (
          <View style={{marginTop: 10}}>
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label={'Add Additional Information'}
                value={additionalInfo}
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="default"
                placeholderStyle={{fontSize: 20}}
                underlineColorAndroid="transparent"
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 10,
                  fontSize: 15,
                  width: '95%',
                  fontFamily: 'Titillium-Semibold',
                  fontWeight: 'normal',
                  paddingBottom: 0,
                  backgroundColor: '#FAFAFA',
                }}
                onChangeText={text => setAdditionalInfo(text)}
                theme={{
                  colors: {
                    placeholder: Colors.grey_888888,
                    text: Colors.black,
                    primary: Colors.grey_C0C0C0,
                    underlineColor: 'transparent',
                    backgroundColor: Colors.white,
                  },
                  fonts: {
                    regular: {
                      fontFamily: 'Titillium-Semibold',
                      fontWeight: 'normal',
                    },
                  },
                }}
              />
            </View>
          </View>
        )}
        {props.isEditClicked && (
          <View style={{marginTop: 10, width:'50%',marginLeft:80}}>
            <TouchableOpacity
              style={{flex: 0.5, height: 40}}
              onPress={saveWorkNote}>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 14,
                  textAlign: 'center',
                  backgroundColor: '#DC631F',
                  borderRadius: 10,
                  padding: 5,
                  borderColor: '#DC631F',
                  borderWidth: 1,
                }}>
                Save Additional Info
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={{
          height: 60,
          backgroundColor: '#ffffff',
          shadowRadius: 2,
          margin: 1,
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowColor: '#000000',
          elevation: 4,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          {/* <TouchableOpacity
            style={{flex: 0.5, height: 40}}
            onPress={onResetClick}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 14,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}>
              Reset
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{flex: 1, height: 40}}
            onPress={onAddClick}>
            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                fontFamily: 'Titillium-Semibold',
                color: '#ffffff',
                fontSize: 14,
                textAlign: 'center',
                backgroundColor: '#DC631F',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}>
              {props.isEditClicked ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={350}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderRadius: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -20,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 20,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={{padding: 20}}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View>
              <View>
                <View style={{flex: 2, flexDirection: 'column'}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 15,
                          fontFamily: 'Titillium-Semibold',
                          padding: 10,
                        }}>
                        OTP will expire in
                      </Text>
                    </View>
                    <View>
                      <CountDown
                        size={15}
                        until={180}
                        onFinish={() => alert('OTP Expired')}
                        digitStyle={{
                          backgroundColor: '#FFF',
                          borderWidth: 2,
                          borderColor: '#DC631F',
                        }}
                        digitTxtStyle={{
                          color: Colors.black,
                          fontSize: 15,
                          fontFamily: 'Titillium-Semibold',
                        }}
                        timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                        separatorStyle={{color: '#DC631F'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: null, s: null}}
                        showSeparator
                      />
                    </View>
                  </View>
                  <View style={{flex: 1}}>
                    <FormFieldInput
                      title={'OTP Code'}
                      formKey={'otpCode'}
                      isMandatory={true}
                      showInputField
                      isEnabled={true}
                      length={6}
                      keyboardType={'numeric'}
                      value={formValues.otpCode}
                      handleFormValueChange={handleFormValueChange}
                    />
                  </View>
                </View>
                <View style={{flex: 2, flexDirection: 'row', marginTop: 25}}>
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={{height: 40}}
                      onPress={() => {
                        setFormValues({
                          otpCode: '',
                        });
                        refRBSheet.current.close();
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#000000',
                          fontSize: 16,
                          textAlign: 'center',
                          backgroundColor: '#ffffff',
                          borderRadius: 10,
                          padding: 10,
                          borderColor: '#DC631F',
                          borderWidth: 1,
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={{height: 40}}
                      onPress={verifyTicketOTP}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontFamily: 'Titillium-Semibold',
                          color: '#ffffff',
                          fontSize: 16,
                          textAlign: 'center',
                          backgroundColor: '#DC631F',
                          borderRadius: 10,
                          // padding: 10,
                          paddingBottom: 15,
                          paddingTop: 5,
                          borderColor: '#DC631F',
                          borderWidth: 1,
                        }}>
                        Verify
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
      <DialogView
        showAlertDialog
        visible={isRenewRecent.visible}
        text={isRenewRecent.text}
        onConfirm={() => {
          setRenewRecent({text: '', visible: false});
        }}
        textConfirm={'Okay'}></DialogView>
      <Spinner
        animation={'fade'}
        overlayColor={Colors.orange_295CBF}
        indicatorStyle={globalStyles.loader}
        visible={isLoading.spinner}
        textContent={isLoading.spinnerText}
        textStyle={globalStyles.spinnerTextStyle}
      />
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(ComplaintsForm);
