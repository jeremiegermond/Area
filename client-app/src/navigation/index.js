import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import ConnectScreen from '../screens/connect';
import LoginScreen from '../screens/login';
import HomeScreen from '../screens/home';
import {NavigationContainer} from '@react-navigation/native';

const AppNavigation = () => {
  const [connected, setConnected] = useState(false);
  const handleLogin = () => {
    console.log('parent handling');
    setConnected(!connected);
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Server"
        screenOptions={{headerShown: connected}}>
        {connected ? (
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen handleLogin={handleLogin} {...props} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Server" component={ConnectScreen} />
            <Stack.Screen name="Login">
              {props => <LoginScreen handleLogin={handleLogin} {...props} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
