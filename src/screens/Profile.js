import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NavService from '../components/NavService';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import reducer from '../redux/reducers/reducer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';


export class Profile extends Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  state = {
    username: this.props.user.username,
    email: this.props.user.email,
    // imageUrl: this.props.user?.imageUrl ? this.props.user?.imageUrl : '',
    isEditable: false,
    isLoader: false,
    age: this.props?.user?.age ? this.props?.user?.age : '',
    gender: this?.props?.user?.gender ? this.props?.user?.gender : '',
    isToggle:this.props.darkMode=='black'? true: false,
  };

  componentDidMount() {
    // console.log('props', this.props.user);
  }
  selectPicture = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
    }).then(image => {
      console.log(image);
      this.setState({imageUrl: image.path});
    });
  };

  onCancel = () => {
    this.setState({
      username: this.props.user.username,
      email: this.props.user.email,
      imageUrl: this.props.user?.imageUrl ? this.props.user?.imageUrl : '',
      isEditable: false,
    });
  };

  uploadPicture = async () => {
    const date = new Date();
    const timeMil = date.getTime();
    const fileName =
      // 'image' + timeMil + Math.floor(100000 + Math.random() * 900000);
      'image' + 'abc';
    try {
      const reference = storage().ref(`images/${fileName}`);
      await reference.putFile(this.state.imageUrl);
      const url = await storage().ref(`images/${fileName}`).getDownloadURL();
      return url;
    } catch (e) {
      console.log('error', e);
    }
  };
  save = async () => {
    const {username, imageUrl, age, gender} = this.props.user;
    if (
      username === this.state.username &&
      // imageUrl === this.state.imageUrl &&
      gender === this.state?.gender &&
      age === this.state?.age
    ) {
      this.setState({isEditable: false, isLoader: false});
      return alert('Please make some changes');
    }
    const newUser = {};
    // if (imageUrl !== this.state.imageUrl) {
    //   const url = await this.uploadPicture();
    //   newUser.imageUrl = url;
    // }else{
    //     newUser.imageUrl = this.state.imageUrl;
    // }
    newUser.username = this.state.username;
    newUser.age = this.state.age;
    newUser.gender = this.state.gender;
    console.log('new', newUser);
    this.setState({isLoader: true});
    firestore()
      .collection('user')
      .doc(this.props.user.uid)
      .update(newUser)
      .then(() => {
        this.props?.Login({...this.props.user, ...newUser});
        alert('Profile updated successfully');
      })
      .catch(e => console.log('e', e))
      .finally(() => this.setState({isLoader: false}));
  };

  deleteAccount = () => {
    auth()
      .currentUser.delete()
      .then(res => {
        console.log('res', res);
        firestore()
          .collection('user')
          .doc(this.props.user.uid)
          .delete()
          .then(async() => {
         await GoogleSignin.signOut()
            if (this.state.isToggle) {
              this.props?.DarkMode( 'white');
            }else{
              this.props?.DarkMode( 'black');
            }
            NavService.reset(0, [{name: 'AuthStack'}]);
            setTimeout(() => {
              this.props.Logout();
            }, 1000);
          });
      })
      .catch(e => alert(e.message));
  };
  logout = async() => {
    await GoogleSignin.signOut()
    NavService.reset(0, [{name: 'AuthStack'}]);
    setTimeout(() => {
      
      this.props.Logout();
}, 1000);
   
    if (this.state.isToggle) {
      this.props?.DarkMode( 'black');
    }else{
      this.props?.DarkMode( 'white');
    }
  };
  render() {
    const {isEditable, imageUrl, isLoader} = this.state;

    console.log('fire', this.props.darkMode, this.state.isToggle);

    const {width, height} = Dimensions.get('screen');
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0c1c32',
            padding:10
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 40, left: 10}}
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Image source={require('../assets/Images/back1.png')} />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              borderWidth: 3,
              borderColor: '#FFA925',
              width: width * 0.4,
              height: width * 0.4,
              borderRadius: (width * 0.4) / 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: width * 0.35,
                width: width * 0.35,
                borderRadius: height,
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#0c1c32', fontSize: 85}}>
                {this.props.user?.username?.charAt(0).toUpperCase()}
              </Text>
            </View>

            {isEditable ? (
              <TouchableOpacity
                // onPress={this.selectPicture}
                style={{backgroundColor: 'red'}}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 110,
                    marginTop: -45,
                    tintColor: '#31a589',
                  }}
                  source={require('../assets/Images/edit.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={{flex: 7, padding: 20, backgroundColor: this?.props?.darkMode === 'black'?'black': 'white'}}>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor:this?.props?.darkMode === 'black'?'black': !isEditable ? '#f5f5f5' : 'white',
            }}>
            <Text
              style={{
                color: 'grey',
                fontWeight: '500',
                paddingBottom: 5,
                fontSize: 12,
              }}>
              Username
            </Text>
            <TextInput
              ref={this.textInputRef}
              editable={isEditable}
              onChangeText={text => {
                this.setState({username: text});
              }}
              value={this.state.username}
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                color:this?.props?.darkMode === 'black'?'white':'black',
              }}
            />
          </View>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor:this?.props?.darkMode === 'black'?'black': !isEditable ? '#f5f5f5' : 'white',
            }}>
            <Text
              style={{
                color: 'grey',
                fontWeight: '500',
                paddingBottom: 5,
                fontSize: 12,
              }}>
              Email
            </Text>
            <TextInput
              editable={false}
              onChangeText={text => {
                this.setState({email: text});
              }}
              value={this.state.email}
              style={{fontWeight: 'bold', fontSize: 15, color:this?.props?.darkMode === 'black'?'white':'black'}}
            />
          </View>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor:this?.props?.darkMode === 'black'?'black': !isEditable ? '#f5f5f5' : 'white',
            }}>
            <Text
              style={{
                color: 'grey',
                fontWeight: '500',
                paddingBottom: 5,
                fontSize: 12,
              }}>
              Age
            </Text>
            <TextInput
              editable={isEditable}
              onChangeText={text => {
                this.setState({age: text});
              }}
              value={this.state.age}
              style={{fontWeight: 'bold', fontSize: 15, color:this?.props?.darkMode === 'black'?'white':'black'}}
            />
          </View>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor:this?.props?.darkMode === 'black'?'black': !isEditable ? '#f5f5f5' : 'white',
            }}>
            <Text
              style={{
                color: 'grey',
                color:this?.props?.darkMode === 'black'?'white':'grey',
                fontWeight: '500',
                paddingBottom: 5,
                fontSize: 12,
              }}>
              Gender
            </Text>
            <TextInput
              editable={isEditable}
              onChangeText={text => {
                this.setState({gender: text});
              }}
              value={this.state.gender}
              style={{fontWeight: 'bold', fontSize: 15, color:this?.props?.darkMode === 'black'?'white':'black'}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{color:this?.props?.darkMode === 'black'?'white':'black'}}>Dark Mode</Text>
            <TouchableOpacity
              style={{
                width: 50,
                padding: 3,
                borderColor: '#0c1c32',
                borderWidth: 1,
                borderRadius: 50,
                alignItems: this.state?.isToggle ? 'flex-end' : 'flex-start',
                backgroundColor: this.state.isToggle
                  ? '#0c1c32'
                  : 'transparent',
              }}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                this.setState({isToggle: !this.state.isToggle});
                if (this.state.isToggle) {
                  this.props?.DarkMode( 'white');
                }else{
                  this.props?.DarkMode( 'black');
                }
              }}>
              <View
                style={{
                  backgroundColor: this.state.isToggle ? 'white' : '#0c1c32',
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                }}></View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            {isEditable ? (
              isLoader ? (
                <ActivityIndicator />
              ) : (
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FFA925',
                      padding: 10,
                      width: 100,
                      alignItems: 'center',
                      borderRadius: 100,
                    }}
                    onPress={this.onCancel}>
                    <Text
                      style={{
                        color:this?.props?.darkMode === 'black'?'black': 'white',
                        fontWeight: '800',

                        fontSize: 16,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FFA925',
                      padding: 10,
                      width: 100,
                      alignItems: 'center',
                      borderRadius: 100,
                    }}
                    onPress={this.save}>
                    <Text
                      style={{
                        color:this?.props?.darkMode === 'black'?'black': 'white',
                        fontWeight: '800',
                        fontSize: 16,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </>
              )
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFA925',
                  padding: 10,
                  width: 180,
                  alignItems: 'center',
                  borderRadius: 100,
                }}
                onPress={() => {
                  this.setState({isEditable: true}, () => {
                    this.textInputRef.current.focus();
                  });
                }}>
                <Text
                  style={{
                    color:this?.props?.darkMode === 'black'?'black': 'white',
                    fontWeight: '800',

                    fontSize: 16,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              marginVertical: 10,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#0c1c32',
                padding: 10,
                borderRadius: 100,
                width: 180,
                alignItems: 'center',
              }}
              onPress={this.logout}>
              <Text
                style={{
                  color:this?.props?.darkMode === 'black'?'black': 'white',
                  fontWeight: '800',
                  fontSize: 16,
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                padding: 10,
                borderRadius: 100,
                width: 180,
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
              onPress={this.deleteAccount}>
              <Text
                style={{
                  color:this.props.darkMode ==='black'?'white':"black",
                  fontWeight: '800',
                  fontSize: 16,
                }}>
                Delete Acoount
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
function mapStateToProps({reducer, colorReducer: {darkMode}}) {
  console.log('asdxxx', darkMode);
  return {
    user: reducer.user,
    darkMode,
  };
}
const mapDispatchToProps = dispatch => {
  return {
    Login: data => {
      dispatch({type: 'SAVE_USER', payload: data});
    },
    Logout: () => {
      dispatch({type: 'LOGOUT'});
    },
    DarkMode: data => {
      dispatch({type: 'DARK_MODE', payload: data});
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
