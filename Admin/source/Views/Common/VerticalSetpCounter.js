// VerticalStepCounter.js

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

const VerticalStepCounter = ({ steps, currentStep }) => {
  const stepCount = steps.length;

  return (
    <ScrollView>
      {steps.map((step, index) => (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
          <View key={index} style={[styles.step, index === currentStep && styles.currentStep]}>
            {/* <Text style={styles.stepText}>{step}</Text> */}
            {index < stepCount - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.heading}>{step.title}</Text>
            <View>
              <Text style={styles.infoHeading}>
                Harware Device Name: {' '}
                <View style={styles.info}>
                  <Text style={{color: "#fff"}}>
                    {step.name}
                  </Text></View>
              </Text>
            </View>
            {step.branch && (
              <View>
                <Text style={styles.infoHeading}>
                  Current Device's Branch: {' '}
                  <View style={styles.info}>
                    <Text style={{color: "#fff"}}>
                      {step.branch}
                    </Text></View>
                </Text>

              </View>
            )}
            {step.total_ports && (
              <View>
                <Text style={styles.infoHeading}>
                  Total ports & Available ports: {' '}
                  <View style={styles.info}>
                    <Text style={{color: "#fff"}}>
                      ( {step.total_ports}/ {step.available_ports}
                      )
                    </Text></View>
                </Text>

              </View>
            )}
            {step.zone && (
              <View>
                <Text style={styles.infoHeading}>
                  Current Device Zone: {' '}
                  <View style={styles.info}>
                    <Text style={{color: "#fff"}}>
                      {step.zone}
                    </Text></View>
                </Text>

              </View>
            )}
            {step.connection_port && (
              <View>
                <Text style={styles.infoHeading}>
                  Connection Port: {' '}
                  <View style={styles.info}>
                    <Text style={{color: "#fff"}}>
                      {step.connection_port}
                    </Text>
                  </View>
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#198c19',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  currentStep: {
    backgroundColor: '#198c19', // Set a different color for the current step
  },
  stepText: {
    color: 'white',
  },
  line: {
    position: 'absolute',
    top: 40, // Adjust this value based on the circle's height
    left: 20, // Adjust this value based on the circle's width
    width: 2,
    height: 150, // Adjust this value based on your component height
    backgroundColor: '#108ee9',
  },
  stepDetails: {
    marginLeft: 10,
    flexDirection: 'column', // Added to stack heading and info vertically

  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlignVertical: 'center',
    color: "#0000006e"
  },
  info: {
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Titillium-Semibold',
    color: '#ffffff',
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#DC631F',
    borderRadius: 10,
    textAlignVertical: 'center',
  },
});

export default VerticalStepCounter;
