import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Colors} from './Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';
import format from 'date-fns/format';

const CustomDateTimePicker = () => {
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  var dateTime = '';
  const formatDate = (date, time) => {
    dateTime = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${time.getHours()}:${time.getMinutes()}`;
    return dateTime;
  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatePicker = () => {
    showMode('date');
  };
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
    }
  };
  return (
    <View style={{marginTop: 15}}>
      <View
        style={{
          marginHorizontal: 10,
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
          backgroundColor: '#FAFAFA',
          borderColor: Colors.grey_C0C0C0,
          borderWidth: 1,
          borderRadius: 5,
          padding: 5,
        }}>
        <Text
          style={{
            flex: 0.9,
            fontFamily: 'Titillium-Semibold',
            color: Colors.grey_888888,
            fontSize: 15,
          }}>
          {date && time ? formatDate(date, time) : ''}
        </Text>
        <TouchableOpacity
          style={{flex: 0.1, alignItems: 'center'}}
          onPress={showDatePicker}>
          <Ionicons
            name={'calendar'}
            size={20}
            color={Colors.grey_888888}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default CustomDateTimePicker;
