import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconButton from '../../components/IconButton';
import {
  faFacebook,
  faGoogle,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

const LoginScreen = ({handleLogin}) => {
  return (
    <>
      <StatusBar hidden={true} translucent={true} />
      <LinearGradient
        useAngle={true}
        angle={-45}
        colors={colors.background}
        style={styles.home}>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.loginBoxBtn}>
            <TextInput
              placeholderTextColor="gray"
              placeholder="Username"
              style={styles.loginInput}
              autoComplete="email"
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
          <LinearGradient
            useAngle={true}
            angle={-45}
            colors={colors.background}
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
              <Text style={styles.loginBtnText}>Login</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </LinearGradient>
    </>
  );
};

const colors = {
  background: [
    'rgb(3, 217, 223)',
    'rgb(79, 151, 232)',
    'rgb(140, 98, 241)',
    'rgb(250, 2, 255)',
  ],
};
const styles = StyleSheet.create({
  home: {
    margin: 0,
    padding: 0,
    maxWidth: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  loginBtn: {
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
