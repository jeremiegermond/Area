import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';
import {faGoogle, faTwitter} from '@fortawesome/free-brands-svg-icons';
import DefaultPressable from '../../components/DefaultPressable';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const AddScreen = ({navigation}) => {
  const [whenId, setWhenId] = useState('');
  return (
    <>
      <DefaultView>
        <Text style={styles.mainText}>
          {whenId.length > 0 ? 'Do___' : 'When___'}
        </Text>
        <View style={styles.boxesView}>
          <DefaultBox padding={0}>
            <DefaultPressable
              width={'100%'}
              height={'100%'}
              radius={40}
              onPress={() => setWhenId(whenId.length > 0 ? '' : 'id_example')}>
              <FontAwesomeIcon
                icon={faTwitter}
                size={50}
                style={{width: '30%'}}
              />
              <Text style={{width: '70%', color: 'black', fontSize: 30}}>
                New follower
              </Text>
            </DefaultPressable>
          </DefaultBox>
          <DefaultBox padding={0}>
            <DefaultPressable
              width={'100%'}
              height={'100%'}
              radius={40}
              onPress={() => setWhenId(whenId.length > 0 ? '' : 'id_example')}>
              <FontAwesomeIcon
                icon={faGoogle}
                size={50}
                style={{width: '30%'}}
              />
              <Text style={{width: '70%', color: 'black', fontSize: 30}}>
                New Email
              </Text>
            </DefaultPressable>
          </DefaultBox>
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

export default AddScreen;
