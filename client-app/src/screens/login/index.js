import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import PressableIcon from '../../components/PressableIcon';
import {
  faFacebook,
  faGoogle,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import Gradient from '../../components/Gradient';
import DefaultPressable from '../../components/DefaultPressable';
import {userExist, userLogin} from '../../api';
import {Toast} from '../../components/Toast';

const LoginScreen = ({handleLogin}) => {
  const [login, setLogin] = useState(false);
  const [username, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');

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
              onChangeText={onChangeUser}
              value={username}
              onKeyPress={() => {
                userExist(username)
                  .then(res => setLogin(res.data))
                  .catch(e => console.log(e));
              }}
            />
            <TextInput
              placeholderTextColor="gray"
              placeholder="Password"
              style={styles.loginInput}
              autoComplete="password"
              secureTextEntry={true}
              value={password}
              onChangeText={onChangePassword}
            />
            <View style={styles.loginSeparator}>
              <View style={styles.loginSeparatorLine} />
              <Text style={styles.loginSeparatorText}>or</Text>
              <View style={styles.loginSeparatorLine} />
            </View>
            <View style={styles.loginBoxIcons}>
              <PressableIcon
                icon={faTwitter}
                onPress={() => {
                  console.log('twitter pressed');
                }}
              />
              <PressableIcon
                icon={faGoogle}
                onPress={() => {
                  console.log('google pressed');
                }}
              />
              <PressableIcon
                icon={faFacebook}
                onPress={() => {
                  console.log('facebook pressed');
                }}
              />
            </View>
          </View>
          <Gradient style={styles.loginBtn}>
            <DefaultPressable
              width={'100%'}
              height={'100%'}
              radius={50}
              disabled={username.length < 1 || password.length < 1}
              onPress={() => {
                if (login) {
                  userLogin(username, password)
                    .then(r => {
                      handleLogin();
                    })
                    .catch(e => {
                      console.log(e.message);
                      Toast('Wrong password');
                    });
                }
                console.log('Login pressed');
                // handleLogin();
              }}>
              <Text style={styles.loginBtnText}>
                {login ? 'Login' : 'Register'}
              </Text>
            </DefaultPressable>
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
