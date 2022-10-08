import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetServerScreen from '../screens/setserver';
import LoginScreen from '../screens/login';
import HomeScreen from '../screens/home';
import {NavigationContainer} from '@react-navigation/native';
import {Button} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCirclePlus, faHome, faUser} from '@fortawesome/free-solid-svg-icons';
import ProfileScreen from '../screens/profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  const [connected, setConnected] = useState(false);
  const handleLogin = () => {
    console.log('parent handling');
    setConnected(!connected);
  };
  return (
    <NavigationContainer>
      {connected ? (
        <>
          <Tab.Navigator
            initialRouteName="Server"
            screenOptions={{headerShown: false}}
            options={{
              headerRight: () => <Button title="Update count" />,
            }}>
            <Tab.Screen
              name="Home"
              options={{
                tabBarIcon: ({focused}) => (
                  <FontAwesomeIcon
                    icon={faHome}
                    color={focused ? 'blue' : 'black'}
                  />
                ),
              }}
              component={HomeScreen}
            />
            <Tab.Screen
              name="Add"
              options={{
                tabBarIcon: ({focused}) => (
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    color={focused ? 'blue' : 'black'}
                  />
                ),
              }}>
              {props => <HomeScreen {...props} />}
            </Tab.Screen>
            <Tab.Screen
              name="Profile"
              options={{
                tabBarIcon: ({focused}) => (
                  <FontAwesomeIcon
                    icon={faUser}
                    color={focused ? 'blue' : 'black'}
                  />
                ),
              }}>
              {props => <ProfileScreen handleLogin={handleLogin} {...props} />}
            </Tab.Screen>
          </Tab.Navigator>
        </>
      ) : (
        <>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Server" component={SetServerScreen} />
            <Stack.Screen name="Login">
              {props => <LoginScreen handleLogin={handleLogin} {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
