import React, {useEffect} from 'react';
import {Button, TextInput, ToastAndroid} from 'react-native';
import Gradient from '../../components/Gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectScreen = ({navigation}) => {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@ip');
      if (value !== null) {
        console.log(`value found ${value}`);
        return value;
      } else {
        console.log('nothing found');
        return '';
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [server, setServer] = React.useState('');
  useEffect(() => {
    getData().then(r => {
      setServer(r);
    });
  }, []);
  return (
    <>
      <Gradient>
        <TextInput
          value={server}
          placeholderTextColor="gray"
          placeholder="Server ip"
          onChangeText={setServer}
          autoComplete="off"
          autoFocus={true}
          keyboardType="number-pad"
        />
        <Button
          title="Connect server"
          disabled={server.length < 7}
          onPress={() => {
            axios
              .get(`http://${server}:8080/ping2`, {timeout: 400})
              .then(res => {
                console.log(res.data);
                AsyncStorage.setItem('@ip', server).then();
                navigation.navigate('Login');
              })
              .catch(e => {
                ToastAndroid.showWithGravity(
                  'Error server not found',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
                console.log(e);
              });
          }}
        />
      </Gradient>
    </>
  );
};

export default ConnectScreen;
