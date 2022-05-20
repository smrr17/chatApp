import React from 'react';
import {View, Dimensions, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
const {width, height} = Dimensions.get('screen');

export default function Loader() {
  const loader = useSelector(state => state?.reducer?.loader || false);
  if (!loader) return null;
  return (
    <View
      style={{
        zIndex: 99,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
