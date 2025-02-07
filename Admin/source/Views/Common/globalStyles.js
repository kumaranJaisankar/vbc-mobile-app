import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from './Colors';
const {width, height} = Dimensions.get('window');

const globalStyles = StyleSheet.create({
  spinnerTextStyle: {
    color: 'white',
  },
});
export default globalStyles;
