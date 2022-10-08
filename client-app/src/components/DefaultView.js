import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

function DefaultView(props) {
  return (
    <ScrollView style={styles.mainScroll}>
      <View style={styles.mainView}>{props.children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  mainView: {
    margin: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default DefaultView;
