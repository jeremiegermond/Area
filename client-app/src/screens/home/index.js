import React from 'react';
import {Button} from 'react-native';
import Gradient from '../../components/Gradient';

const HomeScreen = ({handleLogin}) => {
  return (
    <>
      <Gradient>
        <Button title="Go back" onPress={handleLogin} />
      </Gradient>
    </>
  );
};

export default HomeScreen;
