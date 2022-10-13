import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';
import {faReddit, faTwitter} from '@fortawesome/free-brands-svg-icons';
import DefaultPressable from '../../components/DefaultPressable';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getServer, postServer} from '../../api';
import PressableIcon from '../../components/PressableIcon';
import {faLink} from '@fortawesome/free-solid-svg-icons';

const AddScreen = ({navigation}) => {
  const [actionId, setActionId] = useState('');
  const [actionList, setActionList] = useState([]);
  const [reactionList, setReactionList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCurrentList(actionList);
      setActionId('');
      getServer('user/getActions')
        .then(r => {
          setActionList(r.data);
          setCurrentList(r.data);
        })
        .catch(e => console.log(e));
      getServer('user/getReactions')
        .then(r => {
          setReactionList(r.data);
        })
        .catch(e => console.log(e));
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <DefaultView>
        <Text style={styles.mainText}>
          {actionId.length > 0 ? 'Do___' : 'When___'}
        </Text>
        <View style={styles.boxesView}>
          {currentList.map(item => {
            return (
              <DefaultBox padding={0} key={item._id}>
                <DefaultPressable
                  width={'100%'}
                  height={'100%'}
                  radius={40}
                  onPress={() => {
                    if (actionId.length > 0) {
                      postServer('user/addActionReaction', {
                        action_id: actionId,
                        reaction_id: item._id,
                      })
                        .then(() => {
                          navigation.navigate('Home');
                        })
                        .catch(e => console.log(e));
                    } else {
                      setActionId(item._id);
                      setCurrentList(reactionList);
                    }
                  }}>
                  <FontAwesomeIcon
                    icon={icons[item.service.name]}
                    size={50}
                    style={{width: '30%'}}
                  />
                  <Text style={{width: '70%', color: 'black', fontSize: 30}}>
                    {item.name}
                  </Text>
                </DefaultPressable>
              </DefaultBox>
            );
          })}
          <DefaultBox padding={0} style={{backgroundColor: 'lightgreen'}}>
            <PressableIcon
              icon={faLink}
              size={80}
              style={{width: '100%', height: '100%', borderRadius: 40}}
              onPress={() => navigation.navigate('Profile')}
            />
          </DefaultBox>
        </View>
      </DefaultView>
    </>
  );
};

const icons = {
  twitter: faTwitter,
  reddit: faReddit,
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
