import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../../Common/Colors';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  logo_style: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  title1: {
    width: '100%',
    flexDirection: 'row',
  },
  parent: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
  },
  title1_child1: {
    flex: 2,
    alignItems: 'flex-start',
  },
  child: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  child1: {
    flex: 1,
    justifyContent: 'center',
  },
  child2: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title1_child2: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 5,
  },
  switchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 10,
  },
  textStyle_attachment: {
    color: Colors.black,
    fontSize: 15,
    fontFamily: 'Titillium-Semibold',
  },
  textStyle_close_attachment: {
    color: Colors.red_FF0000,
    fontSize: 16,
    fontFamily: 'Titillium-Semibold',
  },
  mText: {
    backgroundColor: '#fff',
    padding: 5,
    height: 40,
    borderStyle: 'solid',
    fontFamily: 'Titillium-Semibold',
  },
  counter_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.colorgradient3,
    fontSize: 50,
  },
  audio_controls_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 20,
  },
  titletextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  },
  normalTextStyle: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    alignSelf: 'center',
    fontSize: 15,
    textAlign: 'left',
  },
  button_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.white,
    alignSelf: 'center',
    fontSize: 18,
  },
  messag_text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
  },
  text_style: {
    fontFamily: 'Titillium-Semibold',
    color: Colors.black,
    fontSize: 16,
    marginTop: 5,
  },
  status_dialog_style: {
    padding: 7,
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: Colors.black,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {height: 1, width: 1},
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  signature: {
    height: 400,
    marginTop: 10,
  },

  textFocus: {
    backgroundColor: '#eee',
    borderColor: '#5d05d5',
    fontFamily: 'Titillium-Semibold',
  },
  spinnerTextStyle: {
    color: 'white',
  },
});

export default styles;
