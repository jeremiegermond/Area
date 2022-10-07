import React, {useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import IconButton from '../../components/IconButton';
import {
  faFacebook,
  faGoogle,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import Gradient from '../../components/Gradient';

const LoginScreen = ({handleLogin}) => {
  function isUserExist(user = 'user') {}
  const [login, setLogin] = useState(false);
  const [username, onChangeText] = React.useState('');
  return (
    <>
      <StatusBar hidden={true} translucent={true} />
      <Gradient>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>{login ? 'Login' : 'Register'}</Text>
          <View style={styles.loginBoxBtn}>
            <TextInput
              placeholderTextColor="gray"
              placeholder="Username"
              style={styles.loginInput}
              autoComplete="email"
              onChangeText={onChangeText}
              value={username}
              onKeyPress={() => {
                isUserExist();
                axios
                  .post('http://localhost:8080/exist/' + username)
                  .then(res => {
                    console.log(res.data);
                    setLogin(!login);
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }}
            />
            <TextInput
              placeholderTextColor="gray"
              placeholder="Password"
              style={styles.loginInput}
              autoComplete="password"
              secureTextEntry={true}
            />
            <View style={styles.loginSeparator}>
              <View style={styles.loginSeparatorLine} />
              <Text style={styles.loginSeparatorText}>or</Text>
              <View style={styles.loginSeparatorLine} />
            </View>
            <View style={styles.loginBoxIcons}>
              <IconButton
                icon={faTwitter}
                scale={2}
                onPress={() => {
                  console.log('twitter pressed');
                }}
              />
              <IconButton
                icon={faGoogle}
                scale={2}
                onPress={() => {
                  console.log('google pressed');
                }}
              />
              <IconButton
                icon={faFacebook}
                scale={2}
                onPress={() => {
                  console.log('facebook pressed');
                }}
              />
            </View>
          </View>
          <Gradient
            style={styles.loginBtn}>
            <Pressable
              style={({pressed}) => [
                {
                  backgroundColor: pressed
                    ? 'rgba(210, 230, 255, 0.5)'
                    : 'transparent',
                  height: '100%',
                  width: '100%',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                },
              ]}
              onPress={() => {
                console.log('Login pressed');
                handleLogin();
              }}>
              <Text style={styles.loginBtnText}>
                {login ? 'Login' : 'Register'}
              </Text>
            </Pressable>
          </Gradient>
        </View>
      </Gradient>
    </>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    flex: 0,
    height: '7%',
    backgroundColor: 'red',
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    elevation: 7,
    width: '50%',
    borderRadius: 50,
  },
  loginBtnText: {
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 15,
  },
  loginBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '75%',
    height: 500,
    borderRadius: 20,
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    elevation: 7,
  },
  loginBoxBtn: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    width: '80%',
    height: '58%',
  },
  loginText: {
    color: 'black',
    fontSize: 30,
  },
  loginInput: {
    color: 'black',
    width: '80%',
    borderRadius: 50,
    borderWidth: 1,
    paddingLeft: 20,
    fontSize: 16,
  },
  loginSeparator: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loginSeparatorLine: {
    height: 1,
    width: '25%',
    backgroundColor: 'black',
    marginLeft: 10,
    marginRight: 10,
  },
  loginSeparatorText: {
    color: 'black',
  },
  loginBoxIcons: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});

export default LoginScreen;
