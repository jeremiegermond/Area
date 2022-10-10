import React, {useEffect, useState} from 'react';
import DefaultBox from '../../components/DefaultBox';
import DefaultView from '../../components/DefaultView';
import PressableIcon from '../../components/PressableIcon';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import {
  faFacebook,
  faGoogle,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {Text} from 'react-native';
import {removeItem} from '../../data';
import {connectApi, deleteApi, hasApi} from '../../api';

const ProfileScreen = ({handleLogin, navigation}) => {
  const [twitter, setTwitter] = useState(false);
  const updateApi = (api: string, setter) => {
    hasApi(api).then(r => setter(r));
  };
  useEffect(() => {
    updateApi('twitter', setTwitter);
    const unsubscribe = navigation.addListener('state', s => {
      setTimeout(() => updateApi('twitter', setTwitter), 1000);
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
        <DefaultBox padding={0}>
          <PressableIcon
            icon={faGoogle}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => console.log('Google api')}
          />
        </DefaultBox>
        <DefaultBox padding={0}>
          <PressableIcon
            icon={faFacebook}
            size={80}
            style={{width: '100%', height: '100%', borderRadius: 40}}
            onPress={() => console.log('Facebook api')}
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
