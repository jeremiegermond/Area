import React from 'react';
import {StyleSheet, View} from 'react-native';

function DefaultBox(props) {
  return <View style={[styles.defaultBox, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  defaultBox: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderRadius: 40,
    margin: 10,
    padding: 20,
    width: '100%',
    height: 170,
    flexGrow: 1,
    backgroundColor: 'lightgray',
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    elevation: 7,
  },
});
export default DefaultBox;
