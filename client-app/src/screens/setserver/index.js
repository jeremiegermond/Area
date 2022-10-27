import React, {useEffect, useState} from 'react';
import {Button, Switch, Text, TextInput, View} from 'react-native';
import Gradient from '../../components/Gradient';
import {getItem, setItem} from '../../data';
import {pingServer} from '../../api';
import {Toast} from '../../components/Toast';

const SetServerScreen = ({navigation}) => {
  const [server, setServer] = React.useState('');
  const [https, setHttps] = useState(false);
  useEffect(() => {
    getItem('@https').then(r => setHttps(r ?? false));
    getItem('@server').then(r => setServer(r ?? ''));
    getItem('@ip').then(r => {
      setTimeout(() => {
        pingServer(r)
          .then(() => navigation.navigate('Login'))
          .catch(() => {
            console.log(`Server ${r} not found`);
          });
      }, 200);
    });
  }, []);

  const checkServer = () => {
    if (server.length < 7) {
      return;
    }
    const uri = (https ? 'https://' : 'http://') + server;
    pingServer(uri)
      .then(async () => {
        await Promise.all([
          setItem('@server', server),
          setItem('@ip', uri),
          setItem('@https', https),
        ]);
        navigation.navigate('Login');
      })
      .catch(e => Toast(e.message));
  };
  return (
    <>
      <Gradient>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>HTTPS</Text>
          <Switch
            value={https}
            onChange={() => {
              setHttps(!https);
            }}
          />
        </View>
        <TextInput
          value={server}
          placeholderTextColor="lightgray"
          multiline={server.length < 1}
          numberOfLines={1}
          placeholder="Server ip / domain"
          onChangeText={setServer}
          autoComplete="off"
          autoFocus={true}
          autoCapitalize="none"
          blurOnSubmit={false}
          onSubmitEditing={checkServer}
          maxLength={20}
          style={{textAlign: 'center'}}
        />
        <Button
          title="Connect server"
          disabled={server.length < 7 && !server.match(/.+\..{2,}/)}
          onPress={checkServer}
        />
      </Gradient>
    </>
  );
};

export default SetServerScreen;
