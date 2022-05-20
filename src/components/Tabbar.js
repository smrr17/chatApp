import React from 'react';
import {TouchableOpacity, StyleSheet, Image, View, Text} from 'react-native';
import {Colors, Fonts} from '../config';
import {isIphoneX} from './Device';
const shakeJar = require('../assets/shakeJar.png');
const calender = require('../assets/calender.png');
const community = require('../assets/community.png');
const rewards = require('../assets/rewards.png');
const user = require('../assets/user.png');

export default function MyTabBar({state, descriptors, navigation}) {
  console.log(state);
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let icon = shakeJar;
        if (route.name == 'Calender') icon = calender;
        if (route.name == 'Community') icon = community;
        if (route.name == 'Rewards') icon = rewards;
        if (route.name == 'Profile') icon = user;

        let title = route.name;
        if (route.name == 'ShakeJar') title = 'Shake & Pick';
        if (route.name == 'Community') title = 'Fourm';

        const onPress = () => {
          navigation.navigate({name: route.name, merge: true});
        };
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.tab}>
            <Image
              source={icon}
              resizeMode="contain"
              style={[styles.icon, {tintColor: Colors.White}]}
            />
            <Text
              style={[
                {
                  fontFamily: Fonts.bold,
                  color: Colors.White,
                  fontSize: 12,
                  marginTop: 5,
                },
                isFocused ? styles.shadow : null,
              ]}>
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    backgroundColor: Colors.color1,
    justifyContent: 'space-evenly',
    paddingBottom: isIphoneX ? 20 : 0,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  icon: {
    height: 25,
    width: 25,
    tintColor: Colors.White,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
