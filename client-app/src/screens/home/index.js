import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PressableIcon from '../../components/PressableIcon';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';

const HomeScreen = ({navigation}) => {
  return (
    <>
      <DefaultView>
        <Text style={styles.mainText}>Select or edit your action</Text>
        <View style={styles.boxesView}>
          <DefaultBox>
            <View style={styles.boxTextView}>
              <Text style={styles.boxBoldText}>Do </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                Spotify Play Music
              </Text>
              <Text style={styles.boxBoldText}>When </Text>
              <Text style={styles.boxText} numberOfLines={1}>
                New Email
              </Text>
            </View>
            <View style={styles.boxIconView}>
              <PressableIcon icon={faPencil} size={30} />
              <PressableIcon
                icon={faTrash}
                size={30}
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          </DefaultBox>
          <DefaultBox />
          <DefaultBox />
          <DefaultBox />
          <DefaultBox />
        </View>
      </DefaultView>
    </>
  );
};

const styles = StyleSheet.create({
  boxesView: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  boxTextView: {
    width: '70%',
    justifyContent: 'space-around',
  },
  boxIconView: {
    maxWidth: '30%',
    justifyContent: 'space-evenly',
  },
  mainText: {
    textAlignVertical: 'center',
    height: 70,
    color: 'black',
    fontSize: 30,
  },
  boxText: {
    color: 'black',
    fontSize: 20,
  },
  boxBoldText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
