import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import Search from '../../Common/Search';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {RadioButton} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  getNASList,
  getOLTList,
  getpDPList,
  getcDPList,
  getCPEList,
  getParentNASId,
  getFranchiseByBranchId,
  getZoneByFranchiseId,
  getAreaByZoneId,
  getfilteredOltList,
  getfilteredNasList,
  getfilteredCpeList,
  getNasLocations,
  getOltLocations,
  getCpeLocations,
  getPdpLocations,
  getCdpLocations,
  searchNetworkList,
} from '../../services/MainService';
import NoData from '../../Common/NoData';
import DialogView from '../../Common/DialogView';
import NASForm from './NAS/NASForm';
import OLTForm from './OLT/OLTForm';
import NASList from './NAS/NASList';
import OLTList from './OLT/OLTList';
import DPList from './DP/DPList';
import DPHomeScreen from './DP/DPHomeScreen';
import CPEList from './CPE/CPEList';
import DPForm from './DP/DPForm';
import DPEditForm from './DP/DPEditForm';
import CPEForm from './CPE/CPEForm';
import CPEHomeScreen from './CPE/CPEHomeScreen';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import {it, tr} from 'date-fns/locale';
import MapView from 'react-native-maps';
import {Dropdown} from 'react-native-element-dropdown';
import {getNASBranchList} from '../../services/MainService';

const DashBoard = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const paramTxt = route?.params?.paramTxt;
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const refRBSheetdp = useRef();
  const refRBSheetNasFilter = useRef();
  var [buttonPressed, setbuttonPressed] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [parentSNO, setParentSNO] = React.useState('');
  const [nasadd, setNasAdd] = React.useState(1);
  
  const [nasolt, setOLTAdd] = React.useState(1);
  const [nasDPLevel, setDPLevel] = React.useState(0);
  const [cpeLevel, setCPELevel] = React.useState(0);
  const [checked, setChecked] = React.useState('first');
  const [showDPImage, setshowDPImage] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [isDataAvailable, setDataAvailable] = React.useState(true);
  const [dpType, setDPType] = React.useState('parent');
  const [isData, setData] = React.useState({});
  const [isNASData, setNASData] = React.useState([]);
  const [isOLTData, setOLTData] = React.useState([]);
  const [ispDPData, setIspDPData] = React.useState([]);
  const [iscDPData, setIscDPData] = React.useState([]);
  const [cpeData, setCPEData] = React.useState([]);
  const [branchData, setBranchData] = React.useState([]);
  const [zoneData, setZoneData] = React.useState([]);
  const [lastParentObject, setLastParentObject] = React.useState({});
  const [isAlertMessage, setAlertMessage] = React.useState('');
  const [showSuccessfulAlertDialog, setShowSuccessfulAlertDialog] =
    React.useState(false);
  const [showErrorAlertDialog, setShowErrorAlertDialog] = React.useState(false);
  const [showAccessAlertDialog, setShowAccessAlertDialog] = React.useState(false);
  const [isAccessAlertMessage, setAccessAlertMessage] = React.useState('');
  const permission = props.userInfo.permissions;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  // map view variables
  const [nasMapView, setNasMapView] = React.useState(false);
  const [oltMapView, setOltMapView] = React.useState(false);
  const [dpMapView, setDpMapView] = React.useState(false);
  const [cpeMapView, setCpeMapView] = React.useState(false);

  // filter view variable
  const [nasFilterView, setNasFilterView] = React.useState(false);
  const [oltFilterView, setOltFilterView] = React.useState(false);
  const [dpFilterView, setDpFilterView] = React.useState(false);
  const [cpeFilterView, setCpeilterView] = React.useState(false);

  // const [hardwareCategory, setHardwareCategory] = React.useState([]);
  const [hardwareCategoryName, setHardwareCategoryName] = React.useState('');
  const [selectedBranchName, setSelectedBranchName] = React.useState('');
  const [selectedFranchiseName, setSelectedFranchiseName] = React.useState('');
  const [selectedZoneName, setSelectedZoneName] = React.useState('');
  const [selectedAreaName, setSelectedAreaName] = React.useState('');

  const [franchiseName, setFranchiseName] = React.useState('');
  const [branch, setBranch] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [franchiseData, setFranchiseData] = React.useState([]);
  const [areaData, setAreaData] = React.useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  //edit functionality
  const [editNasFormData, setEditNasFormData] = useState({});
  const [nasEdit, setNasEdit] = React.useState(1);
  const [nasFormKey, setNasFormKey] = useState(1);
  const [editOltFormData, setEditOltFormData] = useState({});
  const [oltEdit, setOltEdit] = React.useState(1);
  const [oltFormKey, setOltFormKey] = useState(1);
  const [editDpFormData, setEditDpFormData] = useState({});
  const [dpEdit, setDpEdit] = React.useState(1);
  const [dpFormKey, setDpFormKey] = useState(1);
  const [editCpeFormData, setEditCpeFormData] = useState({});
  const [cpeEdit, setCpeEdit] = React.useState(1);
  const [cpeFormKey, setcpeFormKey] = useState(1);
  console.log(permission,"permission permission")
  const hardwareCategory = [
    {name: 'Internet', id: 'INT'},
    {name: 'Cable TV', id: 'CT'},
  ];
  let addNetwork = false;
  if (
    (props?.userInfo?.user_type === "Super Admin") ||
    (props?.userInfo?.user_type === "Admin")
  ) {
    addNetwork = true;
  }
  const activeSheet = {
    1: "NAS",
    2: "OLT",
    3: "DP",
    4: "CPE"
  }

  const getBranchList = async () => {
    try {
      const response = await getNASBranchList();
      if (response.isSuccess) {
        if (response.result.length > 0) {
          setBranchData(response.result);
        } else {
          const responseMsg = response;
          Toast.show({
            type: 'error',
            text1: 'No Branch found!',
          });
        }
      } else {
        const responseMsg = response;
        Toast.show({
          type: 'error',
          text1: 'No Branch found!',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      Toast.show({
        type: 'error',
        text1: 'Something went wrong! Please try again later.',
      });
    }
  };

  const getFranchise = async branchId => {
    try {
      const response = await getFranchiseByBranchId(branchId);
      if (response.isSuccess) {
        console.log('franchise data====>', response);
        setFranchiseData(response.result);
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getZone = async franchiseId => {
    try {
      const response = await getZoneByFranchiseId(franchiseId);
      if (response.isSuccess) {
        console.log('zone data====>', response);
        setZoneData(response.result);
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  const getArea = async zoneId => {
    try {
      const response = await getAreaByZoneId(zoneId);
      if (response.isSuccess) {
        console.log('area data====>', response);
        setAreaData(response.result);
        // setParentNASID(response.result[response.result.length - 1].id);
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorResponse = error.toString();
    }
  };

  React.useEffect(() => {
    console.log("its the nas details", nasadd, nasEdit);
    getBranchList();

    const unsubscribe = navigation.addListener('focus', () => {
      if (nasadd == 1) {
        getNASData();
      }
      if (nasolt == 1) {
        getOLTData();
      }
      if (paramTxt === 'olt') {
        setbuttonPressed(2);
      }
      if (paramTxt === 'dp') {
        setbuttonPressed(3);
      }
      if (paramTxt === 'cpe') {
        setbuttonPressed(4);
      }
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    getNasLocationList();
    getOltLocationList();
    getCpeLocationList();
    // getPdpLocationList();
    // getCdpLocationList();
  }, []);

  const [nasLocations, setNasLocations] = useState();

  const getNasLocationList = async () => {
    const res = await getNasLocations();
    console.log(
      '🚀 ~ file: AddNetwork.js:239 ~ getNasLocationList ~ res:',
      res,
    );
    const structuredData = [];
    res?.result?.nas?.forEach(nas => {
      if (nas.latitude !== null && nas.longitude !== null) {
        structuredData.push({
          title: nas.branch,
          coordinate: {
            latitude: nas.latitude,
            longitude: nas.longitude,
          },
        });
        console.log(
          '🚀 ~ file: AddNetwork.js:249 ~ getNasLocationList ~ structuredData:',
          structuredData,
        );
        setNasLocations(structuredData ? structuredData : []);
      }
    });
  };

  const [oltLocations, setOltLocations] = useState();
  const getOltLocationList = async () => {
    const res = await getOltLocations();
    console.log(
      '🚀 ~ file: AddNetwork.js:259 ~ getOltLocationList ~ res:',
      res,
    );
    const structuredData = [];
    res?.result?.olt?.forEach(nas => {
      if (nas.latitude !== null && nas.longitude !== null) {
        structuredData.push({
          title: nas.branch,
          coordinate: {
            latitude: nas.latitude,
            longitude: nas.longitude,
          },
        });
        console.log(
          '🚀 ~ file: AddNetwork.js:271 ~ getOltLocationList ~ structuredData:',
          structuredData,
        );
        setOltLocations(structuredData ? structuredData : []);
      }
    });
  };

  const [cpeLocations, setCpeLocations] = useState();
  const getCpeLocationList = async () => {
    const res = await getCpeLocations();
    console.log(
      '🚀 ~ file: AddNetwork.js:259 ~ getOltLocationList ~ res:',
      res,
    );
    const structuredData = [];
    res?.result?.olt?.forEach(nas => {
      if (nas.latitude !== null && nas.longitude !== null) {
        structuredData.push({
          title: nas.branch,
          coordinate: {
            latitude: nas.latitude,
            longitude: nas.longitude,
          },
        });
        console.log(
          '🚀 ~ file: AddNetwork.js:271 ~ getOltLocationList ~ structuredData:',
          structuredData,
        );
        setCpeLocations(structuredData ? structuredData : []);
      }
    });
  };

  const [pdpLocations, setPdpLocations] = useState();
  const getPdpLocationList = async () => {
    const res = await getPdpLocations();
    console.log(
      '🚀 ~ file: AddNetwork.js:304 ~ getPdpLocationList ~ res:',
      res,
    );
    const structuredData = [];
    res?.result?.parentdp?.forEach(nas => {
      if (nas.latitude !== null && nas.longitude !== null) {
        structuredData.push({
          title: nas.branch,
          coordinate: {
            latitude: nas.latitude,
            longitude: nas.longitude,
          },
        });
        console.log(
          '🚀 ~ file: AddNetwork.js:316 ~ getPdpLocationList ~ structuredData:',
          structuredData,
        );
        setPdpLocations(structuredData ? structuredData : []);
      }
    });
  };

  const [cdpLocations, setCdpLocations] = useState();
  const getCdpLocationList = async () => {
    const res = await getCdpLocations();
    console.log(
      '🚀 ~ file: AddNetwork.js:326 ~ getCdpLocationList ~ res:',
      res,
    );
    const structuredData = [];
    res?.result?.childdp?.forEach(nas => {
      if (nas.latitude !== null && nas.longitude !== null) {
        structuredData.push({
          title: nas.branch,
          coordinate: {
            latitude: nas.latitude,
            longitude: nas.longitude,
          },
        });
        console.log(
          '🚀 ~ file: AddNetwork.js:338 ~ getCdpLocationList ~ structuredData:',
          structuredData,
        );
        setCdpLocations(structuredData ? structuredData : []);
      }
    });
  };

  const markers = [
    {
      title: 'Bapatla',
      coordinate: {
        latitude: 17.385,
        longitude: 78.4867,
      },
    },
    {
      title: 'London',
      coordinate: {
        latitude: 17.485,
        longitude: 78.4867,
      },
    },
    {
      title: 'Vijaywada',
      coordinate: {
        latitude: 17.585,
        longitude: 78.4867,
      },
    },
    {
      title: 'Marker 4',
      coordinate: {
        latitude: 17.185,
        longitude: 78.5867,
      },
    },
    ,
    {
      title: 'Marker 5',
      coordinate: {
        latitude: 17.285,
        longitude: 78.6867,
      },
    },
    {
      title: 'Marker 6',
      coordinate: {
        latitude: 17.185,
        longitude: 78.4867,
      },
    },
  ];

  const getNASData = async () => {
    setLimit(10);
    setPage(1);
    setLoading(true);
    try {
      const response = await getNASList(10, 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:282 ~ getNASData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setNASData(response.result?.results);
        setDataAvailable(true);
        setLoading(false);
      } else {
        setNASData([]);
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setNASData([]);
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getNASDataLoadMore = async () => {
    // setLimit(limit + 10);
    setPage(page + 1);
    setLoading(true);
    try {
      const response = await getNASList(limit, page + 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:310 ~ getNASDataLoadMore ~ response:',
        response,
      );
      if (response.isSuccess) {
        setNASData([...isNASData, ...response.result.results]);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
      Toast.show({
        type: 'info',
        text1: 'No More Data Available!',
        position: 'bottom',
      });
    }
  };

  const getOLTData = async () => {
    setLoading(true);
    try {
      const response = await getOLTList(10, 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:344 ~ getOLTData ~ getOLTList:',
        getOLTList,
      );
      if (response.isSuccess) {
        setOLTData(response.result?.results);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const [oltPage, setOltpage] = useState(1);
  const getOLTDataLoadMore = async () => {
    setOltpage(oltPage + 1);
    setLoading(true);
    try {
      const response = await getOLTList(10, oltPage + 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:370 ~ getOLTDataLoadMore ~ response:',
        response,
      );
      if (response.isSuccess) {
        setOLTData([...isOLTData, ...response.result.results]);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
      Toast.show({
        type: 'info',
        text1: 'No More Data Available!',
        position: 'bottom',
      });
    }
  };

  const [nasPage, setNasPage] = useState(1);
  const getFilterNASData = async (branch, franchise, zone, area) => {
    setLoading(true);
    try {
      const response = await getfilteredNasList(branch, franchise, zone, area, limit, nasPage);
      setSelectedBranchName('');
      setSelectedFranchiseName('');
      setSelectedZoneName('');
      setSelectedAreaName('');
      setBranch('');
      setFranchiseName('');
      if (response.isSuccess ) {
        setNASData(response.result?.results);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getFilterOLTData = async (branch, franchise, zone, area) => {
    setLoading(true);
    try {
      const response = await getfilteredOltList(branch, franchise, zone, area);
      console.log('filtered data', response);
      setSelectedBranchName('');
      setSelectedFranchiseName('');
      setSelectedZoneName('');
      setSelectedAreaName('');
      setBranch('');
      setFranchiseName('');
      if (response.isSuccess) {
        setOLTData(response.result);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getFilterCPEData = async (branch, franchise, zone, area) => {
    setLoading(true);
    try {
      const response = await getfilteredCpeList(branch, franchise, zone, area);
      console.log('filtered CPE data', response);
      setSelectedBranchName('');
      setSelectedFranchiseName('');
      setSelectedZoneName('');
      setSelectedAreaName('');
      setBranch('');
      setFranchiseName('');
      if (response.isSuccess) {
        setCPEData(response.result);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const [pdpPage, setPdppage] = useState(1);
  const loadMoreData = async () => {
    setLoading(true);
    // setLimit(10);
    setPage(pdpPage + 1);
    try {
      const response = await getpDPList(10, pdpPage + 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:489 ~ loadMoreData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setPdppage(prevState => prevState + 1);
        setData(response.result);
        if (response.result.results.length > 0) {
          setIspDPData([...ispDPData, ...response.result.results]);
          // setIspDPData(response.result.results);
        }
        setLoading(false);
      } else {
        const responseMsg = response;
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading(false);
    }
  };

  const getPDPData = async () => {
    getPdpLocationList();
    setLoading(true);
    try {
      const response = await getpDPList(10, 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:523 ~ getPDPData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setIspDPData(response.result?.results);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setLoading(false);
    }
  };

  const [cpage, setCPage] = useState(1);
  const cploadMoreData = async () => {
    setLoading(true);
    // setLimit(10);
    setPage(cpage + 1);
    try {
      const response = await getcDPList(10, cpage + 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:547 ~ cploadMoreData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setCPage(prevState => prevState + 1);
        setData(response.result);
        if (response.result.results.length > 0) {
          setIscDPData([...iscDPData, ...response.result.results]);
          // setIscDPData(response.result.results);
        }
        setLoading(false);
      } else {
        const responseMsg = response;
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setLoading(false);
    }
  };

  const getCDPData = async () => {
   
    getCdpLocationList();
    setLoading(true);
    try {
      const response = await getcDPList(10, 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:577 ~ getCDPData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setIscDPData(response.result?.results);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setLoading(false);
    }
  };

  const getCPEData = async () => {
    setLoading(true);
    try {
      const response = await getCPEList(10, 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:578 ~ getCPEData ~ response:',
        response,
      );
      if (response.isSuccess) {
        setCPEData(response.result?.results);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const [cpepage, setCpePage] = useState(1);
  const getCPEDataLoadMore = async () => {
    setLoading(true);
    // setCpePage(cpepage + 1);
    try {
      const response = await getCPEList(10, cpepage + 1);
      console.log(
        '🚀 ~ file: AddNetwork.js:600 ~ getCPEDataLoadMore ~ response:',
        response,
      );
      if (response.isSuccess) {
        setCpePage(prevState => prevState + 1);
        setCPEData([...cpeData, ...response.result.results]);
        setDataAvailable(true);
        setLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
      Toast.show({
        type: 'info',
        text1: 'No More Data Available!',
        position: 'bottom',
      });
    }
  };

  const getDeviceDetails = async (text) => {
    setSearchLoading(true);
    let networkType;
    try {
      // const response = await getParentNASId(search);
      if(buttonPressed===1){
        networkType="nas"
      }
      if(buttonPressed===2){
        networkType="olt"
      }
      if(buttonPressed===3){
        if(dpType==='parent'){
          networkType="parentdp"
        }else{
          networkType="childdp"
        }
       
      }
      if(buttonPressed===4){
        networkType="cpe"
      }
      const response = await searchNetworkList(networkType, limit, page,text)
      if (response.isSuccess ) {
        if(buttonPressed===1){
          setNASData(response.result?.results);
        }
        if(buttonPressed===2){
         setOLTData(response.result?.results);
        }
        if(buttonPressed===3){
          if(dpType==='parent'){
            setIspDPData(response.result?.results);
          }else{
           setIscDPData(response.result?.results)
          }
         }
        if(buttonPressed===4){
          setCPEData(response.result?.results);
         }
        setDataAvailable(true);
        setSearchLoading(false);
      } else {
        const resposneMsg = response;
        setDataAvailable(false);
        setSearchLoading(false);
      }
    } catch (error) {
      const errorResponse = error.toString();
      setDataAvailable(false);
      setSearchLoading(false);
    }
    //   if (response.isSuccess) {
    //     if (response.result != 'Matching Serial No Does Not Exist') {
    //       setLastParentObject(response.result[response.result.length - 1]);
    //       setSearchLoading(false);
    //       refRBSheetdp.current.open();
    //     } else {
    //       const resposneMsg = response;
    //       setSearchLoading(false);
    //       Toast.show({
    //         type: 'error',
    //         text1: 'Matching Serial No Does Not Exist!',
    //       });
    //     }
    //   } else {
    //     const resposneMsg = response;
    //     setSearchLoading(false);
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Matching Serial No Does Not Exist!',
    //     });
    //   }
    // } catch (error) {
    //   const errorResponse = error.toString();
    //   setSearchLoading(false);
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Something went wrong! Please try again later.',
    //   });
    // }
  };

  const showNASAdd = () => {
    console.log(props?.userInfo?.user_type,"props?.userInfo?.user_type")
  const nasPermission = permission.find(code => code === 26);
  if(nasPermission && addNetwork){
    setNasAdd(0);
    setNasFormKey(nasFormKey + 1);
    setNasEdit(1);
    setNasMapView(false);
    setNasFilterView(false);
  }
  else{
    setShowAccessAlertDialog(true);
    setAccessAlertMessage("Please switch to Franchise or Branch user to Add Network devices.")
  }
   
  };

  const showNASEdit = (section) => {
    setEditNasFormData(section);
    setNasAdd(1);
    setNasEdit(0);
    setNasMapView(false);
    setNasFilterView(false);
  }

  const showNASList = () => {
    setNasAdd(1);
    setNasEdit(1);
    getNASData();
    setNasMapView(false);
    setNasFilterView(false);
  };

  const showOLTAdd = () => {
    const oltPermission = permission.find(code => code === 36);
    if(oltPermission && !addNetwork){
    setOLTAdd(0);
    setOltEdit(1);
    setOltFormKey(oltFormKey + 1);
    setOltMapView(false);
    setOltFilterView(false);
    }else{
      setShowAccessAlertDialog(true);
      setAccessAlertMessage("Please switch to Franchise or Branch user to Add Network devices.")
    }
  };

  const showOLTEdit = (section) => {
    setEditOltFormData(section);
    console.log("its the olt data for edit", section);
    setOLTAdd(1);
    setOltEdit(0);
    setOltMapView(false);
    setOltFilterView(false);
  }

  const showOLTList = () => {
    setOLTAdd(1);
    setOltEdit(1);
    getOLTData();
    setOltMapView(false);
    setOltFilterView(false);
  };

  const showDPAdd = () => {
    if(!addNetwork){
    setDpEdit(1);
    setDpFormKey(dpFormKey + 1);
    setDPLevel(1);
    setDpMapView(false);
    setDpFilterView(false);
    } 
    else{
      setShowAccessAlertDialog(true);
      setAccessAlertMessage("Please switch to Franchise or Branch user to Add Network devices.")
    }
  };

  const showDPList = () => {
    setDPLevel(2);
    setDpEdit(1);
    getPDPData();
    getCDPData();
    setDpMapView(false);
    setDpFilterView(false);
  };

  const showDPEdit = (section) => {
    setEditDpFormData(section);
    setDpEdit(0);
    setDPLevel(1);
    setDpMapView(false);
    setDpFilterView(false);
  }

  const showCPEAdd = () => {
    const cpePermission = permission.find(code => code === 51);
    if(cpePermission && !addNetwork){
    setCPELevel(1);
    setcpeFormKey(cpeFormKey + 1);
    setCpeEdit(1);
    setCpeMapView(false);
    setCpeilterView(false);
    }
    else{
      setShowAccessAlertDialog(true);
      setAccessAlertMessage("Please switch to Franchise or Branch user to Add Network devices.")
    }
  };

  const showCPEList = () => {
    setCPELevel(2);
    setCpeEdit(1);
    getCPEData();
    setCpeMapView(false);
    setCpeilterView(false);
  };

  const showCPEEdit = (section) => {
    setEditCpeFormData(section);
    setCpeEdit(0);
    setCPELevel(1);
    setCpeMapView(false);
    setCpeilterView(false);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          username={'Network'}
          showHeaderBack
          onBackClick={() => {
            navigation.goBack();
          }}
        />
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              style={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'column', padding: 10}}>
                <View style={{alignItems: 'center'}}>
                  <ScrollView
                    horizontal={true}
                    style={{flex: 1, marginTop: -5}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => {setbuttonPressed(1);setSearch('');getDeviceDetails('')}}>
                      <Text
                        style={
                          buttonPressed == 1
                            ? styles.btnPress
                            : styles.btnNormal
                        }>
                        NAS
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setbuttonPressed(2);setSearch('');getDeviceDetails('')}}>
                      <Text
                        style={
                          buttonPressed == 2
                            ? styles.btnPress
                            : styles.btnNormal
                        }>
                        OLT
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setbuttonPressed(3);setSearch('');getDeviceDetails('')}}>
                      <Text
                        style={
                          buttonPressed == 3
                            ? styles.btnPress
                            : styles.btnNormal
                        }>
                        DP
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setbuttonPressed(4);setSearch('');getDeviceDetails('')}}>
                      <Text
                        style={
                          buttonPressed == 4
                            ? styles.btnPress
                            : styles.btnNormal
                        }>
                        CPE
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>

                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    <Search
                      value={search}
                      placeholderText={'Serial No.'}
                      // onChangeText={{text => setSearch(text);getDeviceDetails()}}
                      onChangeText={(text) => {
                        setSearch(text);
                        getDeviceDetails(text);
                      }}
                      onClearText={() => setSearch('')}
                      onMICClicked={() => {}}
                      onSearchPressed={(text) => {
                        getDeviceDetails(text);
                      }}
                    />
                  </View>

                  {buttonPressed == 1 && (
                    <View
                      style={{
                        // justifyContent: 'center',
                        flex: 1,
                        // alignItems: 'center',
                        marginTop: 5,
                        width: '100%',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                          flexDirection: 'row',
                          // backgroundColor:"red"
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setNasMapView(true);
                            setNasEdit(1);
                            setNasAdd(4);
                          }}>
                          <View
                            style={
                              nasMapView
                                ? styles.nas_Map_clicked
                                : styles.nas_Map_normal
                            }>
                            <Text
                              style={
                                nasMapView
                                  ? styles.txt_clicked
                                  : styles.txt_normal
                              }>
                              Map
                            </Text>
                            <Image
                              source={{
                                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: nasMapView ? 'white' : 'grey',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            padding: 1,
                            borderRadius: 7,
                            borderColor: '#CACACA',
                            // borderWidth: 1,
                            // width: 200,
                            flexDirection: 'row',
                            // backgroundColor:"red"
                          }}>
                          <TouchableOpacity onPress={() => showNASList()}>
                            <View
                              style={
                                (nasadd == 1 && nasEdit !== 0)
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  (nasadd == 1 && nasEdit !== 0)
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                List
                              </Text>
                              <Feather
                                name={'menu'}
                                size={22}
                                color={nasadd == 1 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => showNASAdd()}>
                            <View
                              style={
                                nasadd == 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  nasadd == 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Add
                              </Text>
                              <Feather
                                name={'plus'}
                                size={22}
                                color={nasadd == 0 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                          {nasEdit === 0 && (<TouchableOpacity>
                            <View
                              style={
                                nasEdit == 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  nasEdit == 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Edit
                              </Text>
                              <Feather
                                name={'plus'}
                                size={22}
                                color={nasEdit == 0 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>)}
                        </View>
                        {nasadd == 1 && nasEdit == 1 && (
                          <TouchableOpacity
                            onPress={() => {
                              setNasFilterView(true);
                              // setNasAdd(4);
                              refRBSheetNasFilter.current.open();
                            }}>
                            <View
                              style={
                                oltFilterView
                                  ? styles.nas_Filter_clicked
                                  : styles.nas_Filter_normal
                              }>
                              <Text
                                style={
                                  oltFilterView
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Filter
                              </Text>
                              <MaterialCommunityIcons
                                name={'filter'}
                                size={20}
                                color={oltFilterView ? 'white' : 'grey'}
                                style={{padding: 3}}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* adding map view  */}
                      {nasMapView && (
                        <View
                          style={{
                            width: '100%',
                            height: windowHeight,
                            marginTop: 10,
                          }}>
                          <MapView
                            style={{width: '100%', height: windowHeight}}
                            initialRegion={{
                              latitude: 17.385,
                              longitude: 78.4867,
                              latitudeDelta: 0.5,
                              longitudeDelta: 0.5,
                            }}>
                            {nasLocations?.map((marker, index) => (
                              <MapView.Marker
                                key={index}
                                coordinate={marker.coordinate}
                                title={marker.title}
                              />
                            ))}
                          </MapView>
                        </View>
                      )}

                      {buttonPressed == 1 &&
                        (nasadd == 0 || nasEdit == 0) &&
                        permission.find(code => code === 26) && (
                          <View style={{width: '100%'}}>
                            <NASForm 
                              key={nasFormKey} 
                              navigate={navigation} 
                              isEditForm={nasEdit === 0} 
                              formData={editNasFormData}
                              nasListView={showNASList}
                            />
                          </View>
                        )}

                      {(nasadd == 1 && nasEdit == 1) && permission.find(code => code === 27) && (
                        <View style={{width: '100%', marginTop: 20}}>
                          {isNASData.length > 0 ? (
                            <ScrollView keyboardShouldPersistTaps="always">
                              <NASList
                                nasList={isNASData}
                                navigate={navigation}
                                onClickNasEdit={showNASEdit}
                              />
                              <View style={styles.footer}>
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={getNASDataLoadMore}
                                  style={styles.loadMoreBtn}>
                                  <Text style={styles.btnText}>Load More</Text>
                                </TouchableOpacity>
                              </View>
                            </ScrollView>
                          ) : (
                            <View style={{height: '70%'}}>
                              <NoData />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  {buttonPressed == 2 && (
                    <View
                      style={{
                        // justifyContent: 'center',
                        flex: 1,
                        // alignItems: 'center',
                        marginTop: 5,
                        width: '100%',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                          marginTop: 5,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setOltMapView(true);
                            setOLTAdd(4);
                          }}>
                          <View
                            style={
                              oltMapView
                                ? styles.nas_Map_clicked
                                : styles.nas_Map_normal
                            }>
                            <Text
                              style={
                                oltMapView
                                  ? styles.txt_clicked
                                  : styles.txt_normal
                              }>
                              Map
                            </Text>
                            <Image
                              source={{
                                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: nasMapView ? 'white' : 'grey',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            padding: 1,
                            borderRadius: 10,
                            borderColor: '#CACACA',
                            // borderWidth: 2,
                            // width: 300,
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity onPress={() => showOLTList()}>
                            <View
                              style={
                                (nasolt == 1 && oltEdit !== 0)
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  (nasolt == 1 && oltEdit !== 0)
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                List
                              </Text>
                              <Feather
                                name={'menu'}
                                size={22}
                                color={nasolt == 1 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                          {nasolt == 1 && oltEdit == 1 && (
                            <TouchableOpacity
                              onPress={() => {
                                setNasFilterView(true);
                                // setNasAdd(4);
                                refRBSheetNasFilter.current.open();
                              }}>
                              <View
                                style={
                                  nasFilterView
                                    ? styles.nas_Filter_clicked
                                    : styles.nas_Filter_normal
                                }>
                                <Text
                                  style={
                                    nasFilterView
                                      ? styles.txt_clicked
                                      : styles.txt_normal
                                  }>
                                  Filter
                                </Text>
                                <MaterialCommunityIcons
                                  name={'filter'}
                                  size={20}
                                  color={nasFilterView ? 'white' : 'grey'}
                                  style={{padding: 3}}
                                />
                              </View>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity onPress={() => showOLTAdd()}>
                            <View
                              style={
                                nasolt == 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  nasolt == 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Add
                              </Text>
                              <Feather
                                name={'plus'}
                                size={22}
                                color={nasolt == 0 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                          {oltEdit == 0 && <TouchableOpacity onPress={() => showOLTAdd()}>
                            <View
                              style={
                                oltEdit == 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  oltEdit == 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Edit
                              </Text>
                              <Feather
                                name={'edit'}
                                size={22}
                                color={oltEdit == 0 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>}
                        </View>
                      </View>
                      {/* adding map view  */}
                      {oltMapView && (
                        <View
                          style={{
                            width: '100%',
                            height: windowHeight,
                            marginTop: 10,
                          }}>
                          <MapView
                            style={{width: '100%', height: windowHeight}}
                            initialRegion={{
                              latitude: 17.385,
                              longitude: 78.4867,
                              latitudeDelta: 0.5,
                              longitudeDelta: 0.5,
                            }}>
                            {oltLocations?.map((marker, index) => (
                              <MapView.Marker
                                key={index}
                                coordinate={marker.coordinate}
                                title={marker.title}
                              />
                            ))}
                          </MapView>
                        </View>
                      )}
                      {(nasolt == 0 || oltEdit == 0) && permission.find(code => code === 36) && (
                        <View style={{width: '100%'}}>
                          <OLTForm 
                            key={oltFormKey} 
                            navigate={navigation} 
                            isEditForm={oltEdit === 0} 
                            formData={editOltFormData}
                            oltListView={showOLTList}
                          />
                        </View>
                      )}
                      {(nasolt == 1 && oltEdit == 1) && permission.find(code => code === 37) && (
                        <View style={{width: '100%', marginTop: 20}}>
                          {isOLTData.length > 0 ? (
                            <ScrollView keyboardShouldPersistTaps="always">
                              <OLTList
                                oltList={isOLTData}
                                navigate={navigation}
                                onClickOltEdit={showOLTEdit}
                              />
                              <View style={styles.footer}>
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={getOLTDataLoadMore}
                                  style={styles.loadMoreBtn}>
                                  <Text style={styles.btnText}>Load More</Text>
                                </TouchableOpacity>
                              </View>
                            </ScrollView>
                          ) : (
                            <View style={{height: '70%'}}>
                              <NoData />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  {buttonPressed == 3 && (
                    <View style={{flex: 1, width: '100%'}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setDpMapView(true);
                            setDPLevel(4);
                          }}>
                          <View
                            style={
                              dpMapView
                                ? styles.nas_Map_clicked
                                : styles.nas_Map_normal
                            }>
                            <Text
                              style={
                                dpMapView
                                  ? styles.txt_clicked
                                  : styles.txt_normal
                              }>
                              Map
                            </Text>
                            <Image
                              source={{
                                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: dpMapView ? 'white' : 'grey',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            padding: 1,
                            borderRadius: 10,
                            borderColor: '#CACACA',
                            // borderWidth: 2,
                            // width: 300,
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity onPress={() => showDPList()}>
                            <View
                              style={
                                nasDPLevel == 2
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  nasDPLevel == 2
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                List
                              </Text>
                              <Feather
                                name={'menu'}
                                size={25}
                                color={nasDPLevel == 2 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>

                          {nasDPLevel == 2 && (
                            <TouchableOpacity
                              onPress={() => {
                                setDpFilterView(true);
                                // setNasAdd(4);
                                refRBSheetNasFilter.current.open();
                              }}>
                              <View
                                style={
                                  dpFilterView
                                    ? styles.nas_Filter_clicked
                                    : styles.nas_Filter_normal
                                }>
                                <Text
                                  style={
                                    dpFilterView
                                      ? styles.txt_clicked
                                      : styles.txt_normal
                                  }>
                                  Filter
                                </Text>
                                <MaterialCommunityIcons
                                  name={'filter'}
                                  size={20}
                                  color={dpFilterView ? 'white' : 'grey'}
                                  style={{padding: 3}}
                                />
                              </View>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity onPress={() => showDPAdd()}>
                            <View
                              style={
                                (nasDPLevel == 0 || nasDPLevel == 1) && dpEdit !== 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  (nasDPLevel == 0 || nasDPLevel == 1) && dpEdit !== 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Add
                              </Text>
                              <Feather
                                name={'plus'}
                                size={25}
                                color={
                                  (nasDPLevel == 0 || nasDPLevel == 1) && dpEdit !== 0
                                    ? '#ffffff'
                                    : '#777777'
                                }
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                          {dpEdit === 0 && (
                          <TouchableOpacity onPress={() => showDPAdd()}>
                          <View
                            style={
                              nasDPLevel == 0 || nasDPLevel == 1
                                ? styles.nas_clicked
                                : styles.nas_normal
                            }>
                            <Text
                              style={
                                nasDPLevel == 0 || nasDPLevel == 1
                                  ? styles.txt_clicked
                                  : styles.txt_normal
                              }>
                              Edit
                            </Text>
                            <Feather
                              name={'edit'}
                              size={25}
                              color={
                                nasDPLevel == 0 || nasDPLevel == 1
                                  ? '#ffffff'
                                  : '#777777'
                              }
                              style={{alignSelf: 'center'}}
                            />
                          </View>
                        </TouchableOpacity>)}
                        </View>
                      </View>
                      {/* adding map view  */}
                      {dpMapView && (
                        <View
                          style={{
                            width: '100%',
                            height: windowHeight,
                            marginTop: 10,
                          }}>
                          {dpType == 'parent' ? (
                            <MapView
                              style={{width: '100%', height: windowHeight}}
                              initialRegion={{
                                latitude: 17.385,
                                longitude: 78.4867,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.5,
                              }}>
                              {pdpLocations?.map((marker, index) => (
                                <MapView.Marker
                                  key={index}
                                  coordinate={marker.coordinate}
                                  title={marker.title}
                                />
                              ))}
                            </MapView>
                          ) : (
                            <MapView
                              style={{width: '100%', height: windowHeight}}
                              initialRegion={{
                                latitude: 17.385,
                                longitude: 78.4867,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.5,
                              }}>
                              {cdpLocations?.map((marker, index) => (
                                <MapView.Marker
                                  key={index}
                                  coordinate={marker.coordinate}
                                  title={marker.title}
                                />
                              ))}
                            </MapView>
                          )}
                        </View>
                      )}

                      {nasDPLevel == 0 && showDPList()}
                      {nasDPLevel == 1 && dpEdit !== 0 &&
                        (permission.find(code => code === 41) ||
                          permission.find(code => code === 46)) && 
                          <DPForm 
                            key={dpFormKey} 
                            navigate={navigation} 
                            isEditForm={dpEdit === 0} 
                            formData={editDpFormData}
                            dpListView={showDPList}
                          />}

                      {nasDPLevel == 1 && dpEdit == 0 &&
                        (permission.find(code => code === 41) ||
                          permission.find(code => code === 46)) && 
                          <DPEditForm 
                            key={dpFormKey} 
                            navigate={navigation} 
                            isEditForm={dpEdit === 0} 
                            formData={editDpFormData}
                            dpListView={showDPList}
                            selectedDPType={dpType == "parent" ? 1 : 2}
                          />}

                      {nasDPLevel == 2 && (
                        <View style={{width: '100%', marginTop: 20}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                            }}>
                            <RadioButton
                              value="parent"
                              status={
                                dpType === 'parent' ? 'checked' : 'unchecked'
                              }
                              onPress={() => {setDPType('parent');setSearch('');getDeviceDetails('')}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: Colors.grey_888888,
                                fontSize: 16,
                                marginRight: 10,
                              }}>
                              Parent DP
                            </Text>
                            <RadioButton
                              value="child"
                              status={
                                dpType === 'child' ? 'checked' : 'unchecked'
                              }
                              onPress={() => {setDPType('child');setSearch('');getDeviceDetails('')}}
                            />
                            <Text
                              style={{
                                fontFamily: 'Titillium-Semibold',
                                color: Colors.grey_888888,
                                fontSize: 16,
                              }}>
                              Child DP
                            </Text>
                          </View>
                          {dpType == 'parent' &&
                            permission.find(code => code === 42) &&
                            (ispDPData.length > 0 ? (
                              <ScrollView>
                                <DPList
                                  handleloadmore={loadMoreData}
                                  dpList={ispDPData}
                                  navigate={navigation}
                                  onClickDpEdit={showDPEdit}
                                />
                              </ScrollView>
                            ) : (
                              <View style={{height: '70%'}}>
                                <NoData />
                              </View>
                            ))}
                          {dpType == 'child' &&
                            permission.find(code => code === 47) &&
                            (iscDPData.length > 0 ? (
                              <ScrollView>
                                <DPList
                                  handleloadmore={cploadMoreData}
                                  dpList={iscDPData}
                                  navigate={navigation}
                                  onClickDpEdit={showDPEdit}
                                />
                              </ScrollView>
                            ) : (
                              <View style={{height: '70%'}}>
                                <NoData />
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  )}

                  {buttonPressed == 4 && (
                    <View style={{flex: 1, width: '100%'}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setCpeMapView(true);
                            setCPELevel(4);
                          }}>
                          <View
                            style={
                              cpeMapView
                                ? styles.nas_Map_clicked
                                : styles.nas_Map_normal
                            }>
                            <Text
                              style={
                                cpeMapView
                                  ? styles.txt_clicked
                                  : styles.txt_normal
                              }>
                              Map
                            </Text>
                            <Image
                              source={{
                                uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: nasMapView ? 'white' : 'grey',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            padding: 1,
                            borderRadius: 10,
                            borderColor: '#CACACA',
                            // borderWidth: 2,
                            // width: 300,
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity onPress={() => showCPEList()}>
                            <View
                              style={
                                cpeLevel == 2
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  cpeLevel == 2
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                List
                              </Text>
                              <Feather
                                name={'menu'}
                                size={25}
                                color={cpeLevel == 2 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>

                          {cpeLevel == 2 && (
                            <TouchableOpacity
                              onPress={() => {
                                setCpeilterView(true);
                                // setNasAdd(4);
                                refRBSheetNasFilter.current.open();
                              }}>
                              <View
                                style={
                                  cpeFilterView
                                    ? styles.nas_Filter_clicked
                                    : styles.nas_Filter_normal
                                }>
                                <Text
                                  style={
                                    cpeFilterView
                                      ? styles.txt_clicked
                                      : styles.txt_normal
                                  }>
                                  Filter
                                </Text>
                                <MaterialCommunityIcons
                                  name={'filter'}
                                  size={20}
                                  color={cpeFilterView ? 'white' : 'grey'}
                                  style={{padding: 3}}
                                />
                              </View>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity onPress={() => showCPEAdd()}>
                            <View
                              style={
                                (cpeLevel == 0 || cpeLevel == 1) && cpeEdit !== 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  (cpeLevel == 0 || cpeLevel == 1) && cpeEdit !== 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Add
                              </Text>
                              <Feather
                                name={'plus'}
                                size={25}
                                color={
                                  (cpeLevel == 0 || cpeLevel == 1) && cpeEdit !== 0
                                    ? '#ffffff'
                                    : '#777777'
                                }
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>

                          {cpeEdit === 0 && (<TouchableOpacity>
                            <View
                              style={
                                cpeEdit == 0
                                  ? styles.nas_clicked
                                  : styles.nas_normal
                              }>
                              <Text
                                style={
                                  cpeEdit == 0
                                    ? styles.txt_clicked
                                    : styles.txt_normal
                                }>
                                Edit
                              </Text>
                              <Feather
                                name={'edit'}
                                size={22}
                                color={cpeEdit == 0 ? '#ffffff' : '#777777'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>)}
                        </View>
                      </View>

                      {/* adding map view  */}
                      {cpeMapView && (
                        <View
                          style={{
                            width: '100%',
                            height: windowHeight,
                            marginTop: 10,
                          }}>
                          <MapView
                            style={{width: '100%', height: windowHeight}}
                            initialRegion={{
                              latitude: 17.385,
                              longitude: 78.4867,
                              latitudeDelta: 0.5,
                              longitudeDelta: 0.5,
                            }}>
                            {cpeLocations?.map((marker, index) => (
                              <MapView.Marker
                                key={index}
                                coordinate={marker.coordinate}
                                title={marker.title}
                              />
                            ))}
                          </MapView>
                        </View>
                      )}

                      {cpeLevel == 0 && showCPEList()}
                      {cpeLevel == 1 && permission.find(code => code === 51) && 
                        <CPEForm 
                          key={cpeFormKey} 
                          navigate={navigation} 
                          isEditForm={cpeEdit === 0} 
                          formData={editCpeFormData}
                          cpeListView={showCPEList}
                        />
                      }
                      {cpeLevel == 2 && permission.find(code => code === 52) && (
                        <View style={{width: '100%', marginTop: 20}}>
                          {cpeData?.length > 0 ? (
                            <ScrollView keyboardShouldPersistTaps="always">
                              <CPEList
                                cpeList={cpeData}
                                navigate={navigation}
                                onClickCpeEdit={showCPEEdit}
                              />

                              <View style={styles.footer}>
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={getCPEDataLoadMore}
                                  style={styles.loadMoreBtn}>
                                  <Text style={styles.btnText}>Load More</Text>
                                </TouchableOpacity>
                              </View>
                            </ScrollView>
                          ) : (
                            <View style={{height: '70%'}}>
                              <NoData />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {nasDPLevel == 0 && buttonPressed == 3 && (
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 10,
              }}>
              <TouchableOpacity
                onPress={() => setDPLevel(1)}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#ffffff',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Continue
                </Text>
                <Feather
                  name={'arrow-right'}
                  size={23}
                  color={'#ffffff'}
                  style={{alignSelf: 'center', marginLeft: 5}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {cpeLevel == 0 && buttonPressed == 4 && (
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 10,
              }}>
              <TouchableOpacity
                onPress={() => setCPELevel(1)}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
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
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#ffffff',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Continue
                </Text>
                <Feather
                  name={'arrow-right'}
                  size={23}
                  color={'#ffffff'}
                  style={{alignSelf: 'center', marginLeft: 5}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <RBSheet
          ref={refRBSheetdp}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={600}
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
          <ScrollView
            style={{padding: 10, flexDirection: 'column'}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Text
              style={{
                flex: 1,
                fontFamily: 'Titillium-Semibold',
                color: '#DC631F',
                fontSize: 16,
              }}>
              Network Hierarchy
            </Text>

            {/* NAS */}
            <View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View
                  style={{
                    height: 25,
                    width: 25,
                    backgroundColor: '#DC631F',
                    borderRadius: 50,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 16,
                    marginLeft: 10,
                  }}>
                  NAS
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  borderLeftColor: '#DC631F',
                  borderLeftWidth: 2,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 14,
                    marginLeft: 10,
                  }}>
                  Hardware Device Name
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    padding: 5,
                    borderRadius: 10,
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#ffffff',
                    fontSize: 12,
                    marginLeft: 10,
                    backgroundColor: '#258925',
                  }}>
                  {Object.keys(lastParentObject)?.length == 0
                    ? ''
                    : lastParentObject?.available_hardware?.parentnas_info !=
                      undefined
                    ? lastParentObject?.available_hardware?.parentnas_info.name
                    : lastParentObject?.available_hardware?.nas_info.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderLeftColor: '#DC631F',
                  borderLeftWidth: 2,
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 14,
                    marginLeft: 10,
                  }}>
                  Current Device’s Branch
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    flex: 0.5,
                    padding: 5,
                    borderRadius: 10,
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#ffffff',
                    fontSize: 12,
                    marginLeft: 10,
                    backgroundColor: '#258925',
                  }}>
                  {Object.keys(lastParentObject)?.length == 0
                    ? ''
                    : lastParentObject?.available_hardware.parentnas_info !=
                      undefined
                    ? lastParentObject?.available_hardware.parentnas_info.branch
                    : lastParentObject?.available_hardware.nas_info.branch}
                </Text>
              </View>
            </View>

            {/* OLT */}
            {Object.keys(lastParentObject)?.length > 0 &&
              lastParentObject?.available_hardware.olt_info && (
                <View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        backgroundColor: '#DC631F',
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                        marginLeft: 10,
                      }}>
                      OLT
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Hardware Device Name
                    </Text>
                    <Text
                      style={{
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.olt_info.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Total ports & Available ports
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.olt_info
                            .available_ports +
                          '/' +
                          lastParentObject?.available_hardware.olt_info
                            .total_ports}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Current Device Zone
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.olt_info.zone}
                    </Text>
                  </View>
                </View>
              )}

            {/* ParentOLT */}
            {Object.keys(lastParentObject)?.length > 0 &&
              lastParentObject?.available_hardware.parentolt_info && (
                <View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        backgroundColor: '#DC631F',
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                        marginLeft: 10,
                      }}>
                      OLT
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Hardware Device Name
                    </Text>
                    <Text
                      style={{
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentolt_info
                            .name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Total ports & Available ports
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentolt_info
                            .available_ports +
                          '/' +
                          lastParentObject?.available_hardware.parentolt_info
                            .total_ports}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Current Device Zone
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentolt_info
                            .zone}
                    </Text>
                  </View>
                </View>
              )}

            {/* ParentDP1 */}
            {Object.keys(lastParentObject)?.length > 0 &&
              lastParentObject?.available_hardware.parentdp1_info && (
                <View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        backgroundColor: '#DC631F',
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                        marginLeft: 10,
                      }}>
                      ParentDP1
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Hardware Device Name
                    </Text>
                    <Text
                      style={{
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp1_info
                            .name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Total ports & Available ports
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp1_info
                            .available_ports +
                          '/' +
                          lastParentObject?.available_hardware.parentdp1_info
                            .total_ports}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Current Device Zone
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp1_info
                            .zone}
                    </Text>
                  </View>
                </View>
              )}

            {/* ParentDP2 */}
            {Object.keys(lastParentObject)?.length > 0 &&
              lastParentObject?.available_hardware.parentdp2_info && (
                <View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        backgroundColor: '#DC631F',
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                        marginLeft: 10,
                      }}>
                      ParentDP2
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Hardware Device Name
                    </Text>
                    <Text
                      style={{
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp2_info
                            .name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Total ports & Available ports
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp2_info
                            .available_ports +
                          '/' +
                          lastParentObject?.available_hardware.parentdp2_info
                            .total_ports}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Current Device Zone
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.parentdp2_info
                            .zone}
                    </Text>
                  </View>
                </View>
              )}

            {/* ChildDP */}
            {Object.keys(lastParentObject)?.length > 0 &&
              lastParentObject?.available_hardware.childdp_info && (
                <View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        backgroundColor: '#DC631F',
                        borderRadius: 50,
                      }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 16,
                        marginLeft: 10,
                      }}>
                      ChildDP
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Hardware Device Name
                    </Text>
                    <Text
                      style={{
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.childdp_info
                            .name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Total ports & Available ports
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware.childdp_info
                            .available_ports +
                          '/' +
                          lastParentObject?.available_hardware.childdp_info
                            .total_ports}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderLeftColor: '#DC631F',
                      borderLeftWidth: 2,
                      marginLeft: 10,
                      marginBottom: 20,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        marginLeft: 10,
                      }}>
                      Current Device Zone
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        flex: 0.5,
                        padding: 5,
                        borderRadius: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: '#258925',
                      }}>
                      {Object.keys(lastParentObject)?.length == 0
                        ? ''
                        : lastParentObject?.available_hardware?.childdp_info
                            .zone}
                    </Text>
                  </View>
                </View>
              )}
          </ScrollView>
        </RBSheet>
        {/* filter sheet start */}
        <RBSheet
          ref={refRBSheetNasFilter}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={500}
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
          <View style={{width: '95%', alignSelf: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 30,
              }}>
              Filter
            </Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Hardware Category
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={hardwareCategory}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Type"
                    value={hardwareCategoryName}
                    onFocus={() => {
                      // setIsFocus(true);
                      // getLeadFilterOptions();
                    }}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      console.log(item);
                      setHardwareCategoryName(item.id);
                      // setLeadSource(item.name);
                      // setIsFocus(false);
                    }}
                  />
                </View>
              </View>

              {/* second view in row */}
              <View>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Internet Hardware Type
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={[{name: activeSheet[buttonPressed], id: activeSheet[buttonPressed]}]}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Type"
                    value={activeSheet[buttonPressed]}
                    onFocus={() => {
                      // setIsFocus(true);
                      // getLeadFilterOptions();
                    }}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      console.log(item);
                      // setLeadSource(item.name);
                      // setIsFocus(false);
                    }}
                  />
                </View>
              </View>
            </View>

            {/* for second row filter */}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Branch
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    labelField="name"
                    data={branchData}
                    valueField="id"
                    placeholder="Select Branch *"
                    value={branch}
                    onFocus={() => {
                      setIsFocus(true);
                      getBranchList();
                    }}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setBranch(item.id);
                      setIsFocus(false);
                      getFranchise(item.id);
                      setSelectedBranchName(item.id);
                    }}
                  />
                </View>
              </View>

              {/* second view in row */}
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Franchise
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={franchiseData}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Franchise *"
                    value={franchiseName}
                    onFocus={() => {
                      // setIsFocus(true);
                      // getLeadFilterOptions();
                    }}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      console.log(item);
                      setSelectedFranchiseName(item.id);
                      setFranchiseName(item.id);

                      getZone(item.id);
                      // setLeadSource(item.name);
                      // setIsFocus(false);
                    }}
                  />
                </View>
              </View>
            </View>

            {/* third row filter */}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Zone
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={zoneData}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Zone *"
                    value={selectedZoneName}
                    onFocus={() => {
                      // setIsFocus(true);
                      // getLeadFilterOptions();
                    }}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      console.log(item);
                      setSelectedZoneName(item.id);
                      // setIsFocus(false);
                      getArea(item.id);
                    }}
                  />
                </View>
              </View>

              {/* second view in row */}
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                  }}>
                  Area
                </Text>
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={{marginTop: -22}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={areaData}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Area *"
                    value={selectedAreaName}
                    onFocus={() => {
                      // setIsFocus(true);
                      // getLeadFilterOptions();
                    }}
                    // onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      console.log(item);
                      setSelectedAreaName(item.id);
                      // setIsFocus(false);
                    }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                refRBSheetNasFilter.current.close();

                console.log('branch', selectedBranchName);
                console.log('franchise', selectedFranchiseName);
                console.log('zone', selectedZoneName);
                console.log('area', selectedAreaName);
                if (buttonPressed == 1) {
                  getFilterNASData(
                    selectedBranchName,
                    selectedFranchiseName,
                    selectedZoneName,
                    selectedAreaName,
                  );
                } else if (buttonPressed == 2) {
                  getFilterOLTData(
                    selectedBranchName,
                    selectedFranchiseName,
                    selectedZoneName,
                    selectedAreaName,
                  );
                } else if (buttonPressed == 3) {
                  getFilterOLTData(
                    selectedBranchName,
                    selectedFranchiseName,
                    selectedZoneName,
                    selectedAreaName,
                  );
                } else {
                  getFilterCPEData(
                    selectedBranchName,
                    selectedFranchiseName,
                    selectedZoneName,
                    selectedAreaName,
                  );
                }
              }}>
              <View
                style={{
                  backgroundColor: '#DC631F',
                  borderRadius: 10,
                  borderWidth: 1,
                  width: windowWidth * 0.4,
                  padding: 10,
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: windowHeight * 0.02,
                  }}>
                  Filter
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text="Loading List..."></DialogView>
      <DialogView
        showLoadingDialog
        visible={searchLoading}
        text={search===''?'Loading List...':'Searching for device...'}></DialogView>
      <DialogView
        showSuccessfulAlert
        confirmText={'Ok'}
        visible={showSuccessfulAlertDialog}
        text={isAlertMessage}
        onConfirm={() => {
          setShowSuccessfulAlertDialog(false);
        }}></DialogView>
      <DialogView
        showUnSuccessfulAlert
        confirmText={'Ok'}
        visible={showErrorAlertDialog}
        text={isAlertMessage}
        onConfirm={() => {
          setShowErrorAlertDialog(false);
        }}></DialogView>
         <DialogView
        showUnSuccessfulAlert
        confirmText={'Ok'}
        visible={showAccessAlertDialog}
        text={isAccessAlertMessage}
        onConfirm={() => {
          setShowAccessAlertDialog(false);
        }}></DialogView>
    </SafeAreaView>
  );
};

function mapStateToProps(state, props) {
  return {
    userInfo: state.mainReducers.main.userInfo,
  };
}

export default connect(mapStateToProps)(DashBoard);

const styles = StyleSheet.create({
  txt_clicked1: {
    color: Colors.white,
  },
  txt_clicked: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    fontSize: 14,
  },
  txt_normal: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#777777',
    fontSize: 14,
  },
  nas_clicked: {
    width: 70,
    height: 40,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  nas_Map_clicked: {
    width: 70,
    height: 40,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight:10
  },
  nas_Map_normal: {
    width: 70,
    height: 40,
    backgroundColor: Colors.grey_F8F7FD,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight:10
  },

  nas_normal: {
    width: 70,
    height: 40,
    backgroundColor: Colors.grey_F8F7FD,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnNormal: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },
  btnPress: {
    marginHorizontal: 7,
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    fontSize: 14,
    width: 78,
    height: 38,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    padding: 6,
    textAlignVertical: 'center',
  },

  nas_Filter_clicked: {
    width: 70,
    height: 40,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  nas_Filter_normal: {
    width: 70,
    height: 40,
    backgroundColor: Colors.grey_F8F7FD,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red"
    marginLeft: 10,
  },
  dropdown: {
    marginTop: 5,
    borderColor: Colors.grey_C0C0C0,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 0,
    width: '100%',
  },
  placeholderStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.grey_888888,
    fontSize: 15,
  },
  selectedTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: '#000000',
    fontSize: 14,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: Colors.orange_295CBF,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
  },
});
