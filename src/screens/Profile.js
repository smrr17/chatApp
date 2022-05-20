import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import NavService from '../components/NavService';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
  }

  state = {
    username: this.props.user.username,
    email: this.props.user.email,
    imageUrl: this.props.user?.imageUrl ? this.props.user?.imageUrl : '',
    isEditable: false,
    isLoader: false,
  };
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
    const {username, imageUrl} = this.props.user;
    if (username === this.state.username && imageUrl === this.state.imageUrl) {
      this.setState({isEditable: false, isLoader: false});
      return alert('Please make some changes');
    }
    const newUser = {};
    if (imageUrl !== this.state.imageUrl) {
      const url = await this.uploadPicture();
      newUser.imageUrl = url;
      newUser.username = this.state.username;
    }
    if (username !== this.state.username) {
      newUser.username = this.state.username;
      newUser.imageUrl = this.state.imageUrl;
    }
    console.log('new', newUser);
    this.setState({isLoader: true});
    firestore()
      .collection('user')
      .doc(this.props.user.uid)
      .update(newUser)
      .then(() => {
        const userFromRedux = this.props.user;
        userFromRedux.username = newUser.username;
        userFromRedux.imageUrl = newUser.imageUrl;
        this.props.Login(userFromRedux);
        alert('Profile updated successfully');
      })
      .catch(e => console.log('e', e))
      .finally(() => this.setState({isLoader: false}));
  };

  logout = () => {
    this.props.Logout();
    NavService.reset(0, [{name: 'AuthStack'}]);
  };
  render() {
    const {isEditable, imageUrl, isLoader} = this.state;
    // console.log('fire', this.textInputRef);

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
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 40, left: 10}}
            onPress={() => {
              // this.storeInFirestore();
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
            {imageUrl.length ? (
              <Image
                style={{
                  height: width * 0.35,
                  width: width * 0.35,
                  borderRadius: height,
                  backgroundColor: '#C0C0C0',
                }}
                source={
                  imageUrl
                    ? {uri: imageUrl}
                    : require('../assets/Images/profilePic.png')
                }
              />
            ) : (
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
                  {this.state.username[0]}
                </Text>
              </View>
            )}

            {isEditable ? (
              <TouchableOpacity
                onPress={this.selectPicture}
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
        <View style={{flex: 7, padding: 20, backgroundColor: 'white'}}>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor: !isEditable ? '#f5f5f5' : 'white',
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
              }}
            />
          </View>
          <View
            style={{
              padding: 3,
              marginBottom: 10,
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              backgroundColor: '#f5f5f5',
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
              style={{fontWeight: 'bold', fontSize: 15}}
            />
          </View>

          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
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
                        color: 'white',
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
                        color: 'white',
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
                  width: 100,
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
                    color: 'white',
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
                width: 100,
                alignItems: 'center',
              }}
              onPress={this.logout}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: 16,
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
function mapStateToProps({reducer: {user}}) {
  console.log('asdxxx', user);
  return {
    user,
  };
}
const mapDispatchToProps = dispatch => {
  return {
    Login: data => {
      console.log('asd', data);
      dispatch({type: 'SAVE_USER', payload: data});
    },
    Logout: () => {
      dispatch({type: 'LOGOUT'});
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
