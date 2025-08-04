import React from 'react';
import { TouchableOpacity } from 'react-native';

const NoRippleButton = (props) => (
  <TouchableOpacity {...props} activeOpacity={1} />
);

export default NoRippleButton;
