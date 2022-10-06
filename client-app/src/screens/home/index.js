import React from 'react';
import {Button} from 'react-native';

const HomeScreen = ({handleLogin}) => {
  return (
    <>
      <Button title="Go back" onPress={handleLogin} />
    </>
  );
};

export default HomeScreen;
