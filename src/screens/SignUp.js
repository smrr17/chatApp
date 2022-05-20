import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, {Component} from 'react';
//import {Button, Image, Input} from 'react-native-elements';
import {Link} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {connect} from 'react-redux';
import NavService from '../components/NavService';

export class SignUp extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hasFocus: false,
    hasFocus1: false,
    hasFocus2: false,
    hasFocus3: false,
    isLoading: false,
  };
  SignUp = async () => {
    const {email, password, username, confirmPassword} = this.state;
    if (!email || !password || !username || !confirmPassword) {
      return alert('Please fill all the details');
    }
    this.setState({isLoading: true});
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        firestore()
          .collection('user')
          .doc(user.user.uid)
          .set({email, username, uid: user.user.uid, password})
          .then(() => {
            this.props.Login({email, username, uid: user.user.uid, password});
            NavService.reset(0, [{name: 'AppStack'}]);
          })
          .catch(e => {
            alert(e.message);
          })
          .finally(() => {
            this.setState({
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              isLoading: false,
            });
          });
      })
      .catch(e => {
        alert(e.message);
        this.setState({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          isLoading: false,
        });
      });
  };
  render() {
    const {width, height} = Dimensions.get('screen');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          //justifyContent: 'center',
          //alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
          style={{position: 'absolute', top: 60, left: 15, zIndex: 199}}>
          <Image
            style={{width: 20, height: 20, tintColor: 'black'}}
            source={require('../assets/Images/back.png')}
          />
        </TouchableOpacity>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginVertical: 30,
                marginBottom: 30,
                alignItems: 'center',
              }}>
              <Text style={{color: '#FFA925', fontWeight: '800', fontSize: 18}}>
                Create An Acoount
              </Text>
            </View>
            <View
              style={{
                borderColor: this.state.hasFocus3 ? '#FFA925' : null,
                borderWidth: this.state.hasFocus3 ? 1 : null,
                backgroundColor: '#F6F7FB',
                borderRadius: 10,
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              <TextInput
                onFocus={() => {
                  this.setState({hasFocus3: true});
                }}
                onBlur={() => {
                  this.setState({hasFocus3: false});
                }}
                onChangeText={text => {
                  this, this.setState({username: text});
                }}
                style={{height: 40}}
                placeholder="Username"
              />
            </View>
            <View
              style={{
                borderColor: this.state.hasFocus ? '#FFA925' : null,
                borderWidth: this.state.hasFocus ? 1 : null,
                backgroundColor: '#F6F7FB',
                borderRadius: 10,
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              <TextInput
                onFocus={() => {
                  this.setState({hasFocus: true});
                }}
                onBlur={() => {
                  this.setState({hasFocus: false});
                }}
                onChangeText={text => {
                  this, this.setState({email: text});
                }}
                style={{height: 40}}
                placeholder="Email"
              />
            </View>
            <View
              style={{
                borderColor: this.state.hasFocus1 ? '#FFA925' : null,
                borderWidth: this.state.hasFocus1 ? 1 : null,
                backgroundColor: '#F6F7FB',
                borderRadius: 10,
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              <TextInput
                onFocus={() => {
                  this.setState({hasFocus1: true});
                }}
                onBlur={() => {
                  this.setState({hasFocus1: false});
                }}
                onChangeText={text => {
                  this, this.setState({password: text});
                }}
                secureTextEntry
                style={{height: 40}}
                placeholder="Password"
              />
            </View>
            <View
              style={{
                borderColor: this.state.hasFocus2 ? '#FFA925' : null,
                borderWidth: this.state.hasFocus2 ? 1 : null,
                backgroundColor: '#F6F7FB',
                borderRadius: 10,
                paddingHorizontal: 15,
                marginVertical: 20,
              }}>
              <TextInput
                onFocus={() => {
                  this.setState({hasFocus2: true});
                }}
                onBlur={() => {
                  this.setState({hasFocus2: false});
                }}
                onChangeText={text => {
                  this, this.setState({confirmPassword: text});
                }}
                secureTextEntry
                style={{height: 40}}
                placeholder="Confirm Password"
              />
            </View>
            <TouchableOpacity
              disabled={this.state.isLoading}
              onPress={this.SignUp}
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
                <Text style={{color: 'white'}}>Sign up</Text>
              )}
            </TouchableOpacity>
            <View
              style={{
                marginVertical: 20,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text>Are you have an account? </Text>
              <Link style={{color: '#FFA925'}} to={{screen: 'Signin'}}>
                Sign In
              </Link>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    Login: data => {
      console.log('asd', data);
      dispatch({type: 'SAVE_USER', payload: data});
    },
  };
};
export default connect(null, mapDispatchToProps)(SignUp);
