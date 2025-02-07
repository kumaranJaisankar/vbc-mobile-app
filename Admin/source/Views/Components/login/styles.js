import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Common/Colors';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  mobilenotitleStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 18,
    textAlign: 'center',
  },
  mobilenotitleStyle1: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
    textAlign: 'center',
  },
  otperrormessageStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.red_FF0000,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  otpmessageStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.grey_888888,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  messageStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 18,
    textAlign: 'center',
    width: 280,
    marginTop: 20,
  },
  loginButtonStyle: {
    backgroundColor: '#4C6DD8',
    width: 280,
    marginVertical: 20,
  },
  loginButtonTextStyle: {
    fontSize: 20,
    fontFamily: 'Titillium-Semibold',
    fontWeight: 'normal',
    color: Colors.white,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchSection1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  hyperlinkStyle: {
    color: 'blue',
    fontFamily: 'Titillium-Semibold',
    fontSize: 14,
  },
  hyperlinkStyle1: {
    color: 'black',
    fontFamily: 'Titillium-Semibold',
    fontSize: 13,
  },
  spinnerTextStyle: {
    color: 'white',
  },
});
export default styles;
