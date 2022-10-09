import React, {useEffect} from 'react';
import {Button, TextInput} from 'react-native';
import Gradient from '../../components/Gradient';
import {getItem, setItem} from '../../data';
import {pingServer} from '../../api';
import {Toast} from '../../components/Toast';

const SetServerScreen = ({navigation}) => {
  const [server, setServer] = React.useState('');
  useEffect(() => {
    getItem('@ip').then(r => {
      setServer(r || '');
      setTimeout(() => {
        pingServer()
          .then(navigation.navigate('Login'))
          .catch(e => console.log(e));
      }, 200);
    });
  }, []);
  const checkServer = () => {
    if (server.length < 7) {
      return;
    }
    pingServer(server)
      .then(() => {
        setItem('@ip', server).then();
        navigation.navigate('Login');
      })
      .catch(e => Toast(e.message));
  };
  return (
    <>
      <Gradient>
        <TextInput
          value={server}
          placeholderTextColor="white"
          placeholder="Server ip"
          onChangeText={setServer}
          autoComplete="off"
          autoFocus={true}
          keyboardType="number-pad"
          onSubmitEditing={checkServer}
        />
        <Button
          title="Connect server"
          disabled={server.length < 7}
          onPress={checkServer}
        />
      </Gradient>
    </>
  );
};

export default SetServerScreen;
