import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {Component} from 'react';

import {Link} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NavService from '../components/NavService';
import {connect} from 'react-redux';

//import {auth} from '../screens/Firebase';

class Signin extends Component {
  state = {
    email: '',
    password: '',
    hasFocus: false,
    hasFocus1: false,
    isLoading: false,
  };

  signIn = async () => {
    const {email, password} = this.state;
    if (!email || !password) {
      return alert('Email or Password field is empty');
    }
    this.setState({isLoading: true});
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      let userData = await firestore()
        .collection('user')
        .doc(user.user.uid)
        .get();
      console.log('sss', userData.data());
      this.props.Login(userData.data());
      NavService.reset(0, [{name: 'AppStack'}]);
    } catch (e) {
      alert(e.message);
    } finally {
      this.setState({email: '', password: '', isLoading: false});
    }
  };
  render() {
    const {width, height} = Dimensions.get('screen');
    const {email, password} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          //justifyContent: 'center',
          //alignItems: 'center',
        }}>
        <View
          style={{
            flex: 3,

            // justifyContent: 'center',
            // alignItems: 'center',
          }}>
          <Image
            style={{height: height * 0.4}}
            source={require('../assets/Images/bgc.png')}
          />
        </View>
        <View
          style={{
            flex: 7,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            //   overflow: 'hidden',
            borderTopLeftRadius: 35,
          }}>
          <View
            style={{
              marginVertical: 30,
              marginBottom: 30,
              alignItems: 'center',
            }}>
            <Text style={{color: '#FFA925', fontWeight: '800', fontSize: 18}}>
              Log In
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#F6F7FB',
              borderRadius: 10,
              paddingHorizontal: 15,
              borderColor: this.state.hasFocus1 ? '#FFA925' : null,
              borderWidth: this.state.hasFocus1 ? 1 : null,
            }}>
            <TextInput
              onFocus={() => {
                this.setState({hasFocus1: true});
              }}
              onBlur={() => {
                this.setState({hasFocus1: false});
              }}
              onChangeText={text => {
                this.setState({email: text});
              }}
              value={email}
              style={{height: 40}}
              placeholder="Email"
            />
          </View>
          <View
            style={{
              borderColor: this.state.hasFocus ? '#FFA925' : null,
              borderWidth: this.state.hasFocus ? 1 : null,
              backgroundColor: '#F6F7FB',
              borderRadius: 10,
              paddingHorizontal: 15,
              marginVertical: 20,
            }}>
            <TextInput
              onFocus={() => {
                this.setState({hasFocus: true});
              }}
              onBlur={() => {
                this.setState({hasFocus: false});
              }}
              onChangeText={text => {
                this, this.setState({password: text});
              }}
              value={password}
              secureTextEntry
              style={{height: 40}}
              placeholder="Password"
            />
          </View>
          <TouchableOpacity
            disabled={this.state.isLoading}
            onPress={this.signIn}
            style={{
              marginVertical: 20,
              borderRadius: 10,
              backgroundColor: '#FFA925',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.isLoading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text style={{color: 'white'}}>Sign In </Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginVertical: 30,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text>Are you have an account? </Text>
            <Link style={{color: '#FFA925'}} to={{screen: 'Signup'}}>
              Sign Up
            </Link>
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    Login: data => {
      console.log('asdssssszzxx', data);
      dispatch({type: 'SAVE_USER', payload: data});
    },
  };
};
export default connect(null, mapDispatchToProps)(Signin);
