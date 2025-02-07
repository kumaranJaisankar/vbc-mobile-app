import React from 'react';
import {ScrollView, Image} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const NetworkFlowDiagram = props => {
  return (
    <RBSheet
      ref={props.sheetRef}
      closeOnDragDown={true}
      closeOnPressMask={false}
      height={700}
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
        style={{}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Image
          source={require('../../../assets/images/pic2.png')}
          style={{alignSelf: 'center'}}></Image>
      </ScrollView>
    </RBSheet>
  );
};

export default NetworkFlowDiagram;
