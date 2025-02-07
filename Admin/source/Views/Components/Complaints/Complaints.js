import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import {Colors} from '../../Common/Colors';
import Headerview from '../../Common/HeaderView1';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {getBranchDateWiseComplaintsData} from '../../services/MainService';
import DialogView from '../../Common/DialogView';
import {useNavigation} from '@react-navigation/native';

const DashBoard = props => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = React.useState(false);

  const [isLoading, setLoading] = React.useState(false);

  const [isData, setData] = React.useState({});

  const [last7DaysTicketsbyBranch, setLast7DaysTicketsbyBranch] =
    React.useState([]);

  const [last1MonthTicketsbyBranch, setLast1MonthTicketsbyBranch] =
    React.useState([]);

  const [last3MonthTicketsbyBranch, setLast3MonthTicketsbyBranch] =
    React.useState([]);

  const [totalTicketsbyBranch, setTotalTicketsbyBranch] = React.useState([]);

  const [last7DaysTotalTickets, setLast7DaysTotalTickets] = React.useState([]);

  const [last1MonthTotalTickets, setLast1MonthTotalTickets] = React.useState(
    [],
  );

  const [last3MonthTotalTickets, setLast3MonthTotalTickets] = React.useState(
    [],
  );

  const [isDataAvailable, setDataAvailable] = React.useState(false);

  const [isNoDataAvailable, setNoDataAvailable] = React.useState(true);

  const [isExpDate, setExpDate] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getComplaintsData();
    });
    return unsubscribe;
  }, [navigation]);

  const getComplaintsData = async () => {
    setLoading(true);
    try {
      const response = await getBranchDateWiseComplaintsData();
      console.log(
        '🚀 ~ file: Complaints.js:77 ~ getComplaintsData ~ response',
        response,
      );
      if (response.isSuccess) {
        setData(response.result);
        setDataAvailable(true);
        setNoDataAvailable(false);
        setLoading(false);
      } else {
        const responseMsg = response;
        setNoDataAvailable(true);
        setDataAvailable(false);
        setLoading(false);
      }
    } catch (error) {
      const errorresponse = error.toString();
      setNoDataAvailable(true);
      setDataAvailable(false);
      setLoading(false);
    }
  };
  const dataq = {
    labels: ['Web servers', 'Operating systems', 'Programming languages'], // optional
    data: [0.4, 0.6, 0.7],
    colors: [
      'rgba(226,137,242,0.9)',
      'rgba(176,133,255,0.9)',
      'rgba(133,92,248,0.9)',
    ],
  };

  const data = [
    {
      name: 'Open',
      population: 200,
      color: '#B085FF',
      legendFontColor: '#B085FF',
      legendFontSize: 14,
    },
    {
      name: 'InProgress',
      population: 250,
      color: '#E289F2',
      legendFontColor: '#E289F2',
      legendFontSize: 14,
    },
    {
      name: 'On Hold',
      population: 300,
      color: '#A659B4',
      legendFontColor: '#A659B4',
      legendFontSize: 14,
    },
    {
      name: 'Resolved',
      population: 150,
      color: '#503795',
      legendFontColor: '#503795',
      legendFontSize: 14,
    },
    {
      name: 'Closed',
      population: 100,
      color: '#855CF8',
      legendFontColor: '#855CF8',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  const chartConfig1 = {
    backgroundGradientFrom: '#cccccc',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#cccccc',
    backgroundGradientToOpacity: 0,
    color: (opacity = 0.1) => `rgba(26, 255, 255, ${opacity})`,
    strokeWidth: 1,
    useShadowColorFromDataset: false,
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Headerview
          username={'Complaints'}
          showHeader
          onMenuClick={() => {
            setModalVisible(true);
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
                <View style={{}}>
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    horizontal={true}
                    style={{flex: 1, marginTop: 10}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <Text
                      style={{
                        marginHorizontal: 7,
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        width: 100,
                        backgroundColor: '#DC631F',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      Last 7 Days
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 7,
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        width: 100,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      Last 1 Month
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 7,
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        width: 110,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      Last 3 Months
                    </Text>
                  </ScrollView>

                  <Text
                    style={{
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontFamily: 'Titillium-Semibold',
                      color: '#777777',
                      fontSize: 18,
                      marginTop: 20,
                    }}>
                    Total Complaints
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome name={'ticket'} size={23} color={'#DC631F'} />
                    <Text
                      style={{
                        marginLeft: 10,
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#DC631F',
                        fontSize: 25,
                      }}>
                      {isData.total_no_of_tickets}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginVertical: 20,
                      marginHorizontal: 10,
                    }}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#555555',
                          fontSize: 16,
                        }}>
                        Status
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <MaterialCommunityIcons
                        name={'google-maps'}
                        size={20}
                        color={'#777777'}
                      />
                      <Text
                        style={{
                          fontFamily: 'Titillium-Semibold',
                          color: '#555555',
                          fontSize: 15,
                        }}>
                        Select Location
                      </Text>
                      <AntDesign
                        name={'caretdown'}
                        size={18}
                        color={'#cccccc'}
                        style={{marginLeft: 5}}
                      />
                    </View>
                  </View>

                  <PieChart
                    doughnut={true}
                    data={data}
                    width={700}
                    height={400}
                    hasLegend={false}
                    chartConfig={{
                      backgroundColor: '#e26a00',
                      backgroundGradientFrom: '#fb8c00',
                      backgroundGradientTo: '#ffa726',
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                      },
                    }}
                    accessor={'population'}
                    backgroundColor={'transparent'}
                    center={[25, 10]}
                    absolute
                    style={{marginTop: -60}}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#855CF8',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#855CF8',
                        fontSize: 15,
                      }}>
                      Open - 100
                    </Text>

                    <View style={{width: 10, height: 0}}></View>

                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#B085FF',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#B085FF',
                        fontSize: 15,
                      }}>
                      InProgress - 250
                    </Text>

                    <View style={{width: 10, height: 0}}></View>

                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#E289F2',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#E289F2',
                        fontSize: 15,
                      }}>
                      On Hold - 400
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#A659B4',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#A659B4',
                        fontSize: 15,
                      }}>
                      Resolved - 500
                    </Text>

                    <View style={{width: 10, height: 0}}></View>

                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#503795',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#503795',
                        fontSize: 15,
                      }}>
                      Closed - 200
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontFamily: 'Titillium-Semibold',
                      color: '#000000',
                      fontSize: 18,
                      marginTop: 20,
                    }}>
                    Common Complaints
                  </Text>

                  <ScrollView
                    horizontal={true}
                    keyboardShouldPersistTaps="always"
                    style={{flex: 1, marginTop: 10}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <Text
                      style={{
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#ffffff',
                        fontSize: 14,
                        width: 170,
                        backgroundColor: '#DC631F',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      Frequently raised issues
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 7,
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        width: 170,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      Time taking issues
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 7,
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#000000',
                        fontSize: 14,
                        width: 100,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 10,
                        padding: 6,
                      }}>
                      others
                    </Text>
                  </ScrollView>

                  <ProgressChart
                    data={dataq}
                    width={400}
                    height={300}
                    strokeWidth={16}
                    withCustomBarColorFromData={true}
                    radius={50}
                    chartConfig={{
                      backgroundGradientFromOpacity: 0.5,
                      backgroundGradientToOpacity: 1,
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      propsForLabels: {fill: '#000000'},
                      decimalPlaces: 2,
                      color: (opacity = 1, _index) => `rgba(0,0,0,${opacity})`,
                    }}
                    hideLegend={true}
                    style={{marginTop: 20, marginBottom: 20}}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#855CF8',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#855CF8',
                        fontSize: 15,
                      }}>
                      Internet Issue
                    </Text>

                    <View style={{width: 10, height: 0}}></View>

                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#B085FF',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#B085FF',
                        fontSize: 15,
                      }}>
                      Payment Issue
                    </Text>

                    <View style={{width: 10, height: 0}}></View>

                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#E289F2',
                        borderRadius: 10,
                        marginHorizontal: 5,
                      }}></View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Titillium-Semibold',
                        color: '#E289F2',
                        fontSize: 15,
                      }}>
                      Product Issue
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            height: 50,
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
      <DialogView
        showLoadingDialog
        visible={isLoading}
        text={'Loading Complaint Dashboard...'}></DialogView>
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

export default DashBoard;

const styles = StyleSheet.create({});
