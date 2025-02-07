import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Colors} from '../../../../Common/Colors';
import DialogView from '../../../../Common/DialogView';
import Feather from 'react-native-vector-icons/Feather';
import NoData from '../../../../Common/NoData';
import styles from '../styles';
import {getComplaintsInfo} from '../../../../services/MainService';
import Accordion from 'react-native-collapsible/Accordion';
import {getStars} from '../../../../Common/Common';
import {formatDate} from '../../../../Common/utility';
import {useNavigation} from '@react-navigation/native';
import {
  getComplaintsStatusBackgroundColor,
  getComplaintsStatus,
} from '../../../../Common/Common';
//redux
import {connect} from 'react-redux';

const ComplaintInfo = props => {
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height - 200;
  const [complaintsData, setComplaintsData] = useState({});
  const [ticketsData, setTicketsData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeSections, setActiveSections] = React.useState([]);

  useEffect(() => {
    // getComplaintsData();
    setTicketsData(props?.complaintsData);
  }, []);

  console.log('monir', props?.customer?.user?.username);
  // const getComplaintsData = async () => {
  //   setIsDataLoading(true);
  //   try {
  //     const response = await getComplaintsInfo(props.customer.username);
  //     if (response.isSuccess) {
  //       if (response.result.tickets.length > 0) {
  //         setComplaintsData(response.result);
  //         setTicketsData(response.result.tickets);
  //         setIsDataAvailable(true);
  //         setIsDataLoading(false);
  //       } else {
  //         setComplaintsData(response.result);
  //         setIsDataAvailable(false);
  //         setIsDataLoading(false);
  //       }
  //     } else {
  //       const responseMsg = response;
  //       setIsDataAvailable(false);
  //       setIsDataLoading(false);
  //     }
  //   } catch (err) {
  //     const errorresponse = err.toString();
  //     setIsDataAvailable(false);
  //     setIsDataLoading(false);
  //   }
  // };
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
        <Text
          style={{
            fontFamily: 'Titillium-Semibold',
            color: '#808080',
            fontSize: 15,
            marginLeft: 5,
          }}>
          {'T' + section.id}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
                paddingBottom: 5,
                paddingTop: 5,
              }}>
              Category : {section.ticket_category.category}
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
                backgroundColor: getComplaintsStatusBackgroundColor(
                  section.status,
                ),
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
                {getComplaintsStatus(section.status)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
                paddingBottom: 5,
                paddingTop: 5,
              }}>
              Sub Category : {section.sub_category.name}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
                paddingBottom: 5,
                paddingTop: 5,
              }}>
              Created On : {section.created ? formatDate(section.created) : ''}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Titillium-Semibold',
                color: '#808080',
                fontSize: 15,
                marginLeft: 5,
              }}>
              Rating : {getStars('VP')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  return (
    <View>
      <ScrollView>
        <View>
          <View style={styles.title1}>
            <View>
              <Feather
                name={'list'}
                size={25}
                color={Colors.orange_295CBF}
                style={{padding: 10}}
              />
            </View>
            <View style={styles.title1_child1}>
              <Text
                style={{
                  color: Colors.orange_295CBF,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  marginTop: 12,
                }}>
                Complaints
              </Text>
            </View>
            <View style={{margin: 8, marginHorizontal: 15}}>
              <TouchableOpacity
                style={{height: 40}}
                onPress={() => {
                  navigation.navigate('Add_Complaints', {
                    addComplaint: true,
                    valueFromser: props?.customer?.user?.username,
                  });
                }}>
                <Text
                  style={{
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
                  New Complaints
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={
              (styles.title1,
              {margin: 8, marginHorizontal: 15, alignItems: 'flex-end'})
            }>
            <View style={styles.title1_child1}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 16,
                  fontFamily: 'Titillium-Semibold',
                  marginTop: 12,
                }}>
                {'Overall Rating: ' + props?.overall_rating}
              </Text>
            </View>
          </View>
          <View>
            {ticketsData ? (
              <Accordion
                sections={ticketsData}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
              />
            ) : (
              <View style={{height: windowHeight}}>
                <NoData />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <DialogView
        showLoadingDialog
        visible={isDataLoading}
        text={'Loading Complaints...'}></DialogView>
    </View>
  );
};

function mapStateToProps(state, props) {
  return {
    customer: state.mainReducers.main.customer,
  };
}

export default connect(mapStateToProps)(ComplaintInfo);
