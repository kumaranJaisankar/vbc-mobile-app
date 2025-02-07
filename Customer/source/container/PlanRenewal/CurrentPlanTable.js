import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../commoncomponents/Colors';
import {strings} from '../../strings/i18n';
import {useTheme as useMDtheme} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';

const CurrentPlanTable = props => {
  const color = useTheme().colors;
  const materialColor = useMDtheme().colors;
  const currentPlanData = props.itemdata;
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    column: {
      flex: 0.5,
      height: 50,
      flexDirection: 'row',
      marginTop: -10,
      justifyContent: 'center',
      borderColor: Colors.grey_A9A9A9,
      borderWidth: 1,
    },
    text: {
      fontFamily: 'Titillium-Semibold',
      color: color.text,
      fontSize: 12,
      padding: 5,
      marginTop: 7,
    },
    renewButton: {
      backgroundColor: materialColor.primary,
      borderRadius: 10,
      height: 30,
      marginTop: 7,
      padding: 5,
      width: 65,
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: 'Titillium-Semibold',
      color: materialColor.primaryContainer,
      fontSize: 12,
      alignSelf: 'center',
    },
  });

  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.text}>{currentPlanData.package_name}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.text}>
            ₹{parseFloat(currentPlanData.total_plan_cost)}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.text}>
            {currentPlanData.time_unit +
              ' ' +
              (currentPlanData.time_unit > 1
                ? strings('Plan.TimeUnit')
                : strings('Plan.SingularTimeUnit'))}
          </Text>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={props.onItemClick}
            style={styles.renewButton}>
            <Text style={styles.buttonText}>Renew</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CurrentPlanTable;
