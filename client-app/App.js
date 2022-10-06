import React from 'react';
import type {Node} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faTwitter,
  faGoogle,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';

const App: () => Node = () => {
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
              placeholder="Username"
              style={styles.loginInput}
              autoComplete="email"
            />
            <TextInput
              placeholder="Password"
              style={styles.loginInput}
              autoComplete="password"
              secureTextEntry={true}
            />
            <View style={styles.loginSeparator}>
              <View style={styles.loginSeparatorLine} />
              <Text>or</Text>
              <View style={styles.loginSeparatorLine} />
            </View>
            <View style={styles.loginBoxIcons}>
              <FontAwesomeIcon icon={faTwitter} style={styles.loginIcon} />
              <FontAwesomeIcon icon={faGoogle} style={styles.loginIcon} />
              <FontAwesomeIcon icon={faFacebook} style={styles.loginIcon} />
            </View>
          </View>
          <LinearGradient
            useAngle={true}
            angle={-45}
            colors={colors.background}
            style={styles.loginBtn}>
            <Button
              title="Login"
              TouchableComponent={TouchableHighlight}
              color="transparent"
              activeOpacity={0.0}
              underlayColor="transparent"
              containerStyle={styles.loginBtn}
              buttonStyle={styles.loginBtn}
            />
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
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    elevation: 7,
    width: '50%',
    borderRadius: 50,
  },
  loginBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '75%',
    height: '65%',
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
    height: '55%',
  },
  loginText: {
    fontSize: 30,
  },
  loginInput: {
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
  loginBoxIcons: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  loginIcon: {
    transform: [{scale: 2}],
  },
});

export default App;
