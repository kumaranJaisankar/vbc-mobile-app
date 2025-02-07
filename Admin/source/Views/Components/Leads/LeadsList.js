import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Accordion from 'react-native-collapsible/Accordion';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getLeads} from '../../services/MainService';
import NoData from '../../Common/NoData';
import DialogView from '../../Common/DialogView';
import {Dropdown} from 'react-native-element-dropdown';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getLeadOptions} from '../../services/MainService';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {getFullAddress} from '../../Common/utility';
import Search from '../../Common/Search';
import Toast from 'react-native-toast-message';

const DashBoard = props => {
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isData, setData] = useState([]);
  const [isDataAvailable, setDataAvailable] = useState(true);
  const [isExpDate, setExpDate] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [status, setStatus] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [leadSource, setLeadSource] = useState('');
  const [fromDateShow, setFromDateShow] = useState(false);
  const [toDateShow, setToDateShow] = useState(false);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [showWarningAlertDialog, setShowWarningAlertDialog] = useState(false);
  const [isAlertMessage, setAlertMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const permission = props.userInfo.permissions;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLeadsDataOnPageLoad();
    });
    return unsubscribe;
  }, [navigation]);

  const statusData = [
    {name: 'Closed But Not Converted', value: 'CBNC'},
    {name: 'Lead Conversion', value: 'LC'},
    {name: 'Open', value: 'OPEN'},
    {name: 'Closed And Converted', value: 'CNC'},
    {name: 'Non Feasible Lead', value: 'UQL'},
    {name: 'Feasible Lead', value: 'QL'},
  ];
  const getLeadsDataOnPageLoad = async () => {
    setLoading(true);
    setStatus(null);
    setLimit(10);
    setPage(1);
    setSearch(null);
    try {
      const response = await getLeads(10, 1);
      console.log(response,"response leads")
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setData(response.result.results);
        }
        setDataAvailable(true);
        setLoading(false);
      } else {
        const responseMsg = response;
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getLeadsListLoadMore = async () => {
    setLoading(true);
    try {
      const response = await getLeads(
        limit + 10,
        page + 1,
        search,
        status,
        leadSource,
      );

      if (response.isSuccess) {
        setLimit(prevState => prevState + 10);
        setPage(prevState => prevState + 1);
        if (response.result.results.length > 0) {
          setData([...isData, ...response.result.results]);
        }
        setDataAvailable(true);
        setLoading(false);
      } else {
        //setDataAvailable(false);
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: 'No More Data Available!',
          position: 'bottom',
        });
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };

  const getPriBackgroundColor = priority => {
    if (priority == 'LC') {
      return '#FFFDC3';
    } else if (priority == 'OPEN') {
      return '#EAB7B7';
    } else if (priority == 'CNC') {
      return '#B8FABE';
    } else if (priority == 'UQL') {
      return '#B8FABE';
    } else if (priority == 'CBNC') {
      return '#EAB7B7';
    } else if (priority == 'QL') {
      return '#EAB7B9';
    }
  };
  const getStatusWiseFilteredData = async status => {
    setLoading(true);
    setLimit(10);
    setPage(1);
    try {
      const response = await getLeads(10, 1, search, status, leadSource, format(fromDate || new Date(), 'yyyy-MM-dd'),
      format(toDate || new Date(), 'yyyy-MM-dd'));
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setData(response.result.results);
          setDataAvailable(true);
        } else {
          setData([]);
          setDataAvailable(false);
        }
        setLoading(false);
      } else {
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };
  const getCustomFilteredData = async () => {
    if (fromDate && toDate && leadSource) {
      refRBSheet.current.close();
      setLoading(true);
      setLimit(10);
      setPage(1);
      try {
        const response = await getLeads(
          10,
          1,
          search,
          status,
          leadSource,
          format(fromDate, 'yyyy-MM-dd'),
          format(toDate, 'yyyy-MM-dd'),
        );
        if (response.isSuccess) {
          if (response.result.results.length > 0) {
            setData(response.result.results);
            setDataAvailable(true);
          } else {
            setData([]);
            setDataAvailable(false);
          }
          setLoading(false);
        } else {
          setDataAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        const errorresponse = error.toString();
        setDataAvailable(false);
        setLoading(false);
      }
    } else {
      setAlertMessage('Please fill up all the fields!');
      setShowWarningAlertDialog(true);
    }
  };
  const getFullStatus = status => {
    if (status == 'OPEN') {
      return 'Open Lead';
    } else if (status == 'QL') {
      return 'Feasible Lead';
    } else if (status == 'UQL') {
      return 'Non Feasible Lead';
    } else if (status == 'CBNC') {
      return 'Closed But Not Converted';
    } else if (status == 'CNC') {
      return 'Closed and Converted';
    } else if (status == 'LC') {
      return 'Lead Conversion';
    }
  };
  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <View
          style={{
            height: 2,
            backgroundColor: Colors.grey_C0C0C0,
            marginBottom: 5,
          }}
        />
        <Text style={styles.headerText}>
          {section.first_name + ' ' + section.last_name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              Lead ID : {section.id}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: getPriBackgroundColor(section.status),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                  marginHorizontal: 10,
                  padding: 1,
                }}>
                {section.status ? getFullStatus(section.status) : ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name={'person-outline'}
              size={16}
              color={'#666666'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Lead Name
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.first_name}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name={'person-outline'}
              size={16}
              color={'#666666'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Source
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.lead_source?.name}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name={'location-sharp'}
              size={16}
              color={'#666666'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Address
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {/* {section.address?.getFullAddress(section.address)} */}
              {`${section?.house_no},${section?.street},${section?.landmark},${section?.city},${section?.district},${section?.state},${section?.country},${section?.pincode}`}

            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'source-branch'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Referal
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.lead_source.name}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'calendar-month-outline'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Date
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.created_at
                ? format(new Date(section.created_at), 'dd MMM, yyyy')
                : ''}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center'}}>
            <Feather
              name={'user-plus'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Added By
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.created_by}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.4, flexDirection: 'row'}}>
            <Feather
              name={'thumbs-up'}
              size={18}
              color={'#777777'}
              style={{}}
            />
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Feedback
            </Text>
          </View>
          <View style={{flex: 0.1, flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
              }}>
              :
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              {section.notes}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };
  const showFromDatePicker = () => {
    showFromDateMode();
  };
  const showFromDateMode = () => {
    setFromDateShow(true);
  };
  const showToDatePicker = () => {
    showToDateMode();
  };
  const showToDateMode = () => {
    setToDateShow(true);
  };
  const onFromDateChange = (event, selectedValue) => {
    setFromDateShow(Platform.OS === 'ios');
    const selectedTime = selectedValue || new Date();
    setFromDate(selectedTime);
    setFromDateShow(Platform.OS === 'ios');
  };
  const onToDateChange = (event, selectedValue) => {
    setToDateShow(Platform.OS === 'ios');
    const selectedTime = selectedValue || new Date();
    setToDate(selectedTime);
    setToDateShow(Platform.OS === 'ios');
  };
  const getLeadFilterOptions = async () => {
    try {
      const response = await getLeadOptions();
      if (response.isSuccess) {
        if (response.result.lead_source.length > 0) {
          setLeadSourceData(response.result.lead_source);
        }
      } else {
        const responseMsg = response;
      }
    } catch (error) {
      const errorresponse = error.toString();
    }
  };

  const onResetClick = () => {
    setFirstName('');
    setLastName('');
    setFromDate(new Date());
    setToDate(new Date());
    setLeadSource('');
  };
  const getSearchedItem = async () => {
    console.log('search here');
    setLoading(true);
    try {
      setLimit(10);
      setPage(1);
      console.log('search', search);
      const response = await getLeads(10, 1, search, status, leadSource);
      console.log(
        '🚀 ~ file: LeadsList.js:659 ~ getSearchedItem ~ response:',
        response.result.results,
      );
      if (response.isSuccess) {
        if (response.result.results.length > 0) {
          setData(response.result.results);
          setDataAvailable(true);
        } else {
          setData([]);
          setDataAvailable(false);
        }
        setLoading(false);
      } else {
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setDataAvailable(false);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          username={'Leads'}
          showHeader
          showRefreshIcon
          onMenuClick={() => {
            setModalVisible(true);
          }}
          onRefreshClicked={() => {
            getLeadsDataOnPageLoad();
          }}
        />
        <View style={{flex: 1}}>
          <View style={{padding: 5, marginTop: 10}}>
            <Search
              value={search}
              placeholderText={'Lead Name'}
              onChangeText={text => setSearch(text)}
              onClearText={() => setSearch(null)}
              onSearchPressed={() => {
                getSearchedItem();
              }}
            />
          </View>
          {permission.find(code => code === 303) && (
            <View style={{flexDirection: 'row', padding: 10, marginTop: 5}}>
              <View style={{flex: 0.4}}>
                <Dropdown
                  style={[styles.dropdown]}
                  containerStyle={{marginTop: -22}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={statusData}
                  maxHeight={200}
                  labelField="name"
                  valueField="value"
                  placeholder="Status"
                  value={status}
                  onFocus={() => {
                    setIsFocus(true);
                  }}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setStatus(item.value);
                    getStatusWiseFilteredData(item.value);
                    setIsFocus(false);
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#555555',
                      flexDirection: 'row',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name={'filter'}
                      size={20}
                      color={'#777777'}
                      style={{padding: 3}}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#555555',
                        fontSize: 15,
                        marginHorizontal: 10,
                      }}>
                      Filters
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{marginBottom: 100, backgroundColor: Colors.white}}>
            <ScrollView>
              {isDataAvailable ? (
                <View>
                  <Accordion
                    sections={isData}
                    activeSections={activeSections}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_updateSections}
                  />
                  <View style={styles.footer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={getLeadsListLoadMore}
                      style={styles.loadMoreBtn}>
                      <Text style={styles.btnText}>Load More</Text>
                      {isLoading ? (
                        <ActivityIndicator
                          color="white"
                          style={{marginLeft: 8}}
                        />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{marginTop: 150}}>
                  <NoData />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            height: 50,
            marginTop: 30,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowRadius: 2,
            margin: 1,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowColor: '#000000',
            elevation: 4,
          }}>
          <Headerview showFooter />
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={520}
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
              height: 1,
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
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                refRBSheet.current.close();
              }}>
              <Ionicons name={'arrow-back'} size={23} color={Colors.black} />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 18,
                  marginLeft: 15,
                }}>
                Filters
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                }}>
                <Ionicons name={'arrow-back'} size={23} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 18,
                    marginLeft: 15,
                  }}>
                  Filters
                </Text>
              </View>
            </View>
          </View>
          {/* <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                First Name
              </Text>
              <TextInput
                style={styles.messag_text_style}
                multiline={true}
                maxLength={20}
                underlineColorAndroid="transparent"
                value={firstName}
                onChangeText={text => setFirstName(text)}
              />
            </View>
            <View style={{flex: 0.5, flexDirection: 'column', marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Last Name
              </Text>
              <TextInput
                style={styles.messag_text_style}
                multiline={true}
                maxLength={20}
                underlineColorAndroid="transparent"
                value={lastName}
                onChangeText={text => setLastName(text)}
              />
            </View>
          </View> */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Date From *
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 50,
                  width: '100%',
                  backgroundColor: '#FAFAFA',
                  borderRadius: 10,
                  borderColor: '#E7EAEA',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                    flex: 0.8,
                  }}>
                  {fromDate ? format(new Date(fromDate), 'dd MMM, yyyy') : ''}
                </Text>
                <TouchableOpacity onPress={showFromDatePicker}>
                  <Ionicons
                    name={'calendar-outline'}
                    size={23}
                    color={Colors.black}
                    style={{flex: 0.5}}
                  />
                </TouchableOpacity>
              </View>
              {fromDateShow && (
                <DateTimePicker
                  value={fromDate}
                  mode={'date'}
                  display="default"
                  onChange={onFromDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
            <View style={{flex: 0.5, flexDirection: 'column', marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 15,
                }}>
                Date To *
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 50,
                  width: '100%',
                  backgroundColor: '#FAFAFA',
                  borderRadius: 10,
                  borderColor: '#E7EAEA',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Titillium-Semibold',
                    color: '#000000',
                    fontSize: 15,
                    flex: 0.8,
                  }}>
                  {toDate ? format(new Date(toDate), 'dd MMM, yyyy') : ''}
                </Text>
                <TouchableOpacity onPress={showToDatePicker}>
                  <Ionicons
                    name={'calendar-outline'}
                    size={23}
                    color={Colors.black}
                    style={{flex: 0.5}}
                  />
                </TouchableOpacity>
              </View>
              {toDateShow && (
                <DateTimePicker
                  value={toDate}
                  mode={'date'}
                  display="default"
                  onChange={onToDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>

          <View style={{flexDirection: 'column', marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#000000',
                fontSize: 15,
              }}>
              Lead Source *
            </Text>
            <View>
              <Dropdown
                style={[styles.dropdown]}
                containerStyle={{marginTop: -22}}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={leadSourceData}
                maxHeight={200}
                labelField="name"
                valueField="name"
                placeholder=""
                value={leadSource}
                onFocus={() => {
                  setIsFocus(true);
                  getLeadFilterOptions();
                }}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setLeadSource(item.name);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 80,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}
              onPress={onResetClick}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#000000',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 10,
                backgroundColor: '#DC631F',
                borderRadius: 10,
                padding: 10,
                borderColor: '#DC631F',
                borderWidth: 1,
              }}
              onPress={getCustomFilteredData}>
              <Text
                style={{
                  fontFamily: 'Titillium-Semibold',
                  color: '#ffffff',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <DialogView
          showWarningAlert
          confirmText={'Ok'}
          visible={showWarningAlertDialog}
          text={isAlertMessage}
          onConfirm={() => {
            setShowWarningAlertDialog(false);
          }}></DialogView>
      </RBSheet>
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text="Loading Leads..."></DialogView>
      {modalVisible && (
        <Headerview
          showSideMenu
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        />
      )}
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
  header: {
    backgroundColor: Colors.white,
    marginVertical: 10,
    padding: 7,
    flexDirection: 'column',
  },
  headerText: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
  },
  content: {
    backgroundColor: Colors.white,
    padding: 7,
    marginTop: -10,
  },
  messag_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 15,
    fontWeight: 'normal',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    textAlignVertical: 'top',
    padding: 10,
    borderColor: '#E7EAEA',
    borderWidth: 1,
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
    width: 190,
  },
  icon: {
    marginRight: 5,
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
  iconStyle: {
    width: 20,
    height: 20,
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
