import React, {useEffect, useState} from 'react';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';
import PressableIcon from '../../components/PressableIcon';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import {
  faReddit,
  faTwitch,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {Text} from 'react-native';
import {removeItem} from '../../data';
import {connectApi, deleteApi, hasApi} from '../../api';

const ProfileScreen = ({handleLogin, navigation}) => {
  const [twitter, setTwitter] = useState(false);
  const [reddit, setReddit] = useState(false);
  const [twitch, setTwitch] = useState(false);
  const updateApi = (api: string, setter) => {
    hasApi(api).then(r => setter(r));
  };
  useEffect(() => {
    updateApi('twitter', setTwitter);
    updateApi('reddit', setReddit);
    updateApi('twitch', setTwitch);
    const unsubscribe = navigation.addListener('state', s => {
      setTimeout(() => {
        updateApi('twitter', setTwitter);
        updateApi('reddit', setReddit);
        updateApi('twitch', setTwitch);
      }, 1000);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <DefaultView>
        <Text style={{color: 'black', fontSize: 16}}>
          Connect to your API's
        </Text>
        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
          By doing this, you consent the usage of your data
        </Text>
        <DefaultBox
          padding={0}
          style={{backgroundColor: twitter ? 'lightgreen' : 'lightgray'}}>
          <PressableIcon
            icon={faTwitter}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => {
              if (twitter) {
                deleteApi('twitter').then(() =>
                  updateApi('twitter', setTwitter),
                );
              } else {
                connectApi('twitter', navigation).then();
              }
            }}
          />
        </DefaultBox>
        <DefaultBox
          padding={0}
          style={{backgroundColor: reddit ? 'lightgreen' : 'lightgray'}}>
          <PressableIcon
            icon={faReddit}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => {
              if (reddit) {
                deleteApi('reddit').then(() => updateApi('reddit', setReddit));
              } else {
                connectApi('reddit', navigation).then();
              }
            }}
          />
        </DefaultBox>
        <DefaultBox
          padding={0}
          style={{backgroundColor: twitch ? 'lightgreen' : 'lightgray'}}>
          <PressableIcon
            icon={faTwitch}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => {
              if (twitch) {
                deleteApi('twitch').then(() => updateApi('twitch', setTwitch));
              } else {
                connectApi('twitch', navigation).then();
              }
            }}
          />
        </DefaultBox>
        <DefaultBox padding={0}>
          <PressableIcon
            icon={faRightFromBracket}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => {
              removeItem('@token').then();
              handleLogin();
            }}
          />
        </DefaultBox>
      </DefaultView>
    </>
  );
};

export default ProfileScreen;
