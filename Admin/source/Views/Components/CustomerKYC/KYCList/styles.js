import React from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors} from '../../../Common/Colors';

const styles = StyleSheet.create({
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
  disabledBtn:{
    padding: 10,
    backgroundColor: Colors.grey_A9A9A9,
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
  text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.orange_295CBF,
    fontSize: 16,
  },
  text_style1: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 15,
  },
});
export default styles;
