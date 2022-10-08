import React, {useEffect} from 'react';
import {Button, TextInput, ToastAndroid} from 'react-native';
import Gradient from '../../components/Gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetServerScreen = ({navigation}) => {
  const [server, setServer] = React.useState('');
  useEffect(() => {
    const ip = async () => await AsyncStorage.getItem('@ip');
    ip().then(r => {
      setServer(r);
      setTimeout(() => {
        axios
          .get(`http://${r}:8080/ping2`, {timeout: 400})
          .then(navigation.navigate('Login'))
          .catch(e => console.log(e));
      }, 200);
    });
  }, []);
  const checkServer = () => {
    axios
      .get(`http://${server}:8080/ping2`, {timeout: 400})
      .then(() => {
        AsyncStorage.setItem('@ip', server).then();
        navigation.navigate('Login');
      })
      .catch(e =>
        ToastAndroid.showWithGravity(
          e.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        ),
      );
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
