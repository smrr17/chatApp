import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {Component, useLayoutEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';

// import AgoraVoiceCall from '../components/AgoraVoiceCall';
import VoiceCall from '../components/VoiceCall';
// import AgoraUIKit, {PropsInterface} from 'agora-rn-uikit';

// const mockData = [
//   {
//     user: {
//       id: 1,
//       name: 'shahmeer',
//       address: 'karachi',
//     },
//     messages: 'hello',
//   },
//   {
//     user: {
//       id: 2,
//       name: 'shahmeer',
//       address: 'karachi',
//     },
//     messages: 'bye',
//   },
// ];

// const VoiceCall = () => {
//   const [voiceCall, setVoiceCall] = useState(true);
//   const props: PropsInterface = {
//     rtcProps: {appId: 'e213b99f5ab44846a756d8aa92dc3482', channel: 'test'},
//     callbacks: {EndCall: () => setVoiceCall(false)},
//   };
//   return voiceCall ? (
//     <SafeAreaView>
//       <AgoraUIKit rtcProps={props.rtcProps} callbacks={props.callbacks} />
//     </SafeAreaView>
//   ) : null;
// };

class ChatScreen extends React.Component {
  state = {
    message: '',
    messages: [],
    // image: null,
    // username: this.props.route.params.item.username,
    imageUrl: this.props.route.params.item?.imageUrl,
    sendImage: '',
    chats: null,
    isVisible: false,
    url: '',
    isLoader: false,
    count: 0,
    videoCall: false,
    vvisible: false,
    // participants: [this.props.route.params.item.uid, this.props.user.uid],
  };
  sendPicture = async () => {
    // ImagePicker.openPicker({
    //   multiple: true,
    //   mediaType: 'any',
    // })
    //   .then(images => {
    //     let newimage = [];
    //     images.forEach(item => {
    //       newimage.push(item.sourceURL);
    //     });
    //     this.setState({image: newimage});
    //     console.log('state', this.state.image);
    //     const date = new Date();
    //     const timeMil = date.getTime();
    //     const fileName =
    //       'image' + timeMil + Math.floor(100000 + Math.random() * 900000);
    //     const reference = storage().ref(`imagess/${fileName}`);
    //     console.log('dsgdsg', this.state.image);
    //     this.state.image.forEach(item => {
    //       console.log('kali', item);
    //       reference.putFile(item);
    //       console.log('lgfjhfgo');
    //       const url = reference.getDownloadURL().then(url => {
    //         console.log('dsfds', url);
    //       });
    //     });
    //   })
    //   .catch(e => {
    //     alert(e.message);
    //   });
    // try {
    //   console.log('assad', this.state.ImageUrl);
    // } catch (e) {
    //   console.log('error', e);
    // }
    ImagePicker.openPicker({
      width: 400,
      height: 400,
    }).then(image => {
      console.log(image);
      this.setState({sendImage: image.path, isVisible: true});
    });
  };
  uploadPicture = async () => {
    try {
      const date = new Date();
      const timeMil = date.getTime();
      const fileName =
        'image' + timeMil + Math.floor(100000 + Math.random() * 900000);
      const reference = storage().ref(`images/${fileName}`);
      await reference.putFile(this.state.sendImage);
      console.log('dfssd', this.state.sendImage);
      const url = await storage().ref(`images/${fileName}`).getDownloadURL();
      console.log(url);
      return url;
    } catch (e) {
      console.log('error', e);
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.getAllChats();
    }, 1000);
  }

  mockItem = ({item, index}) => {
    //   console.log('saad', item);
    const sentByMe = item.sentBy === this.props.user.uid;
    return (
      <View
        style={{
          maxWidth: item.image ? '90%' : '45%',
          backgroundColor: sentByMe ? '#e5e4e1' : '#FFA925',
          alignSelf: sentByMe ? 'flex-end' : 'flex-start',
          padding: 10,
          borderRadius: 20,
          borderBottomRightRadius: sentByMe ? 0 : 20,
          borderBottomLeftRadius: sentByMe ? 20 : 0,
          marginBottom: 15,
        }}>
        {item?.image ? (
          <Image
            style={{width: 200, height: 100, borderRadius: 10}}
            source={{uri: item?.image}}
          />
        ) : (
          <Text>{item?.text}</Text>
        )}
      </View>
    );
  };

  getAllChats = async () => {
    const {item} = this.props.route.params;
    console.log('ids', item.documentID);
    firestore()
      .collection('chatRooms')
      .doc(item?.documentID)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        snapshot => {
          const messages = [];
          snapshot.forEach(message => {
            messages.unshift(message.data());
          });
          this.setState({chats: messages});
          // this.message;
        },
        error => {
          console.log(error);
        },
      );
  };

  message = async () => {
    const {message, messages, count} = this.state;
    this.setState({isLoader: true});
    if (this.state.sendImage.length) {
      const url = await this.uploadPicture();
      this.setState({url: url});
    }
    const {item} = this.props.route.params;
    const myUid = this.props.user.uid;
    const otherUserUid = item.participants.filter(part => part !== myUid)[0];
    const myself = item?.users[myUid];
    const otherUser = item?.users[otherUserUid];
    console.log('dsfdf', otherUser);
    console.log(myself);
    messages.push(message);
    this.setState({count: messages.length});

    if (this.state.message.length || this.state.sendImage?.length) {
      firestore()
        .collection('chatRooms')
        .doc(item.documentID)
        .collection('messages')
        .doc()
        .set({
          sentBy: this.props.user.uid,
          text: this.state.message,
          image: this.state?.url,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          firestore()
            .collection('chatRooms')
            .doc(item.documentID)
            .update({
              users: {
                [otherUserUid]: {
                  ...otherUser,
                  count: this.state.count,
                },
                [myUid]: {...myself},
              },
            })
            .then(() => {
              alert('success');
            });
        })
        .catch(e => {
          console.log(e.message);
        });
    } else {
      alert('Please enter your message');
    }
    this.setState({message: '', isVisible: false, isLoader: false});
  };

  componentWillUnmount() {
    this.countUpdate();
  }

  countUpdate = () => {
    const {item} = this.props.route.params;
    const myUid = this.props.user.uid;
    const otherUserUid = item.participants.filter(part => part !== myUid)[0];
    const myself = item?.users[myUid];
    const otherUser = item?.users[otherUserUid];
    console.log('====================================');
    console.log(otherUser);
    console.log('====================================');
    console.log(myself);
    firestore()
      .collection('chatRooms')
      .doc(item.documentID)
      .update({
        users: {
          [otherUserUid]: {
            ...otherUser,
          },
          [myUid]: {...myself, count: 0},
        },
      })
      .then(() => {
        alert('success');
      });
  };

  render() {
    const {width, height} = Dimensions.get('screen');
    console.log('state', this.state.vvisible);
    const data = this.props.route.params.item;
    const participants = this.props.route.params.item?.participants;
    const otherID = participants?.filter(
      item => item !== this.props.user.uid,
    )[0];
    const otherUser = data?.users[otherID];
    const myUid = this.props.user.uid;
    const {item} = this.props.route.params;
    const myself = data?.users[myUid];
    console.log(this.state.vvisible);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingTop: 20}}>
        <Modal visible={this.state.vvisible}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <VoiceCall />
            <TouchableOpacity
              onPress={() => {
                this.setState({vvisible: false});
              }}>
              <Text style={{fontSize: 40, color: 'black', marginBottom: 50}}>
                X
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FAFAFA',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('home');
            }}>
            <Image source={require('../assets/Images/back1.png')} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}>
            <Image
              style={{
                height: 30,
                width: 30,
                borderRadius: 30,
                backgroundColor: '#C0C0C0',
              }}
              source={
                otherUser?.imageUrl
                  ? {uri: otherUser?.imageUrl}
                  : require('../assets/Images/profilePic.png')
              }
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
                alignItems: 'flex-start',
              }}>
              <Text>{otherUser?.name}</Text>
              <Text style={{fontSize: 10, color: '#FFA925'}}>online now</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('../assets/Images/video.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({vvisible: true});
            }}>
            <Image source={require('../assets/Images/call.png')} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{
              marginHorizontal: 20,
              flexGrow: 1,
            }}
            inverted
            data={this.state.chats}
            renderItem={this.mockItem}
            style={{flex: 1, marginTop: 20}}
          />
        </View>
        {!this.state.isVisible ? (
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              backgroundColor: '#FAFAFA',
            }}>
            <TouchableOpacity onPress={this.sendPicture}>
              <Image source={require('../assets/Images/plus.png')} />
            </TouchableOpacity>
            <View></View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View
                style={{
                  backgroundColor: '#D4D4D4',
                  height: 40,
                  width: 5,
                  marginLeft: 5,
                }}
              />

              <TextInput
                value={this.state.message}
                onChangeText={text => {
                  this.setState({message: text});
                }}
                style={{
                  width: '90%',
                  paddingHorizontal: 10,
                }}
                placeholder="Type Something"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.message();
              }}>
              <Image source={require('../assets/Images/arrowup.png')} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flex: 0.2,
              backgroundColor: '#FAFAFA',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', left: 15, top: 8, zIndex: 299}}
              onPress={() => {
                this.setState({isVisible: false});
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../assets/Images/close.png')}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: 10,
                paddingHorizontal: 10,
              }}>
              <View
                style={{flex: 9, alignItems: 'center', marginHorizontal: 5}}>
                <Image
                  style={{
                    width: width * 0.6,
                    height: 90,
                    borderRadius: 10,
                    resizeMode: 'stretch',
                  }}
                  source={{uri: this.state.sendImage}}
                />
              </View>
              {this.state.isLoader ? (
                <ActivityIndicator color={'black'} size={'large'} />
              ) : (
                <TouchableOpacity
                  style={{flex: 1.5}}
                  onPress={() => {
                    this.message();
                  }}>
                  <Image source={require('../assets/Images/arrowup.png')} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
function mapStateToProps({reducer: {user}}) {
  console.log('asdxxx', user);
  return {
    user,
  };
}
export default connect(mapStateToProps)(ChatScreen);
