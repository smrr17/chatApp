import React, {Component} from 'react';

//Navigations here
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

//Screens
import {PreSignin} from './containers';
// import {connect} from 'react-redux';
import NavService from './components/NavService';
import {
  Homescreen,
  Signin,
  SignUp,
  ChatScreen,
  Profile,
  Newchat,
} from './screens';
import {connect} from 'react-redux';

// import MyTabBar from './components/Tabbar';
// import DrawerCustom from './components/DrawerCustom';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="">
      <Stack.Screen
        name="home"
        component={Homescreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="chat"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="newchat"
        component={Newchat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
// const AppStack = () => {
//   return (
//     <Tab.Navigator
//       // tabBar={props => <MyTabBar {...props} />}
//       initialRouteName="ShakeJar"></Tab.Navigator>

//   );
// };

class Navigation extends Component {
  state = {
    ready: false,
    initialRouteName: 'AuthStack',
  };
  componentDidMount() {
    setTimeout(() => {
      if (this.props.user?.uid) {
        this.setState({initialRouteName: 'AppStack'});
      }
      this.setState({ready: true});
    }, 2000);
  }
  render() {
    const {initialRouteName, ready} = this.state;
    if (!ready) return null;
    return (
      <NavigationContainer ref={ref => NavService.setTopLevelNavigator(ref)}>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {backgroundColor: 'transparent'},
            animation: 'simple_push',
          }}
          initialRouteName={initialRouteName}>
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
function mapStateToProps({reducer: {user}}) {
  return {
    user,
  };
}

export default connect(mapStateToProps)(Navigation);
