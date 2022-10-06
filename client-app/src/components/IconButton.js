import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {Pressable} from 'react-native';

interface IconButtonProps {
  icon: IconDefinition;
  scale: number;
  onPress?: null;
}

function IconButton(props: IconButtonProps) {
  const {icon, scale, onPress} = props;

  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          padding: 7 * scale,
          borderRadius: 5,
        },
      ]}
      onPress={onPress}>
      <FontAwesomeIcon icon={icon} style={{transform: [{scale: scale}]}} />
    </Pressable>
  );
}

export default IconButton;
