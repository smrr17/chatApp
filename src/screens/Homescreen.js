import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  LayoutAnimation,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';

import firestore from '@react-native-firebase/firestore';
const data = [
  {
    username: 'shahmeer',
    photo: require('../assets/Images/cat.png'),
  },
];

class Homescreen extends Component {
  constructor(props) {
    super(props);
    const {user} = this.props;
    this.state = {
      isVisbile: false,
      isFocused: false,
      data: data,
      search: '',
      chats: [],
      isBlur: true,
      isModel: this.props?.user?.isFirstTime ? true : false,
    };
  }
  listItem = ({item, index}) => {
    const myUid = this.props.user.uid;
    const otherUserUid = item.participants.filter(part => part !== myUid)[0];
    const otherUser = item?.users[otherUserUid];
    const myself = item?.users[myUid];

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('chat', {item})}
        style={{
          marginBottom: 8,
          padding: 15,
          borderRadius: 15,
          backgroundColor: '#F6F7FB',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* <Image
            style={{
              backgroundColor: '#C0C0C0',
              width: 35,
              height: 35,
              borderRadius: 25,
            }}
            source={{uri: otherUser?.imageUrl}}
          /> */}
          <Text style={{marginLeft: 15}}>{otherUser?.name}</Text>
          {myself.count > 0 ? (
            <View
              style={{
                position: 'absolute',
                right: 5,
                backgroundColor: 'green',
                borderRadius: 15,
                height: 15,
                width: 15,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>{myself.count}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  componentDidMount() {
    
    const {user} = this.props;
    console.log(user, 'user');
    this.focus = this.props.navigation.addListener('focus', async () => {
      setTimeout(() => {
        this.getAllUser();
        this.getAllChats();
      }, 1000);
    });
  }
  componentWillUnmount() {
    this.focus();
  }
  getAllUser = async () => {
    const user = firestore()
      .collection('user')
      .get()
      .then(res => {
        let newData = [];
        res.forEach(item => {
          // console.log('res', item.data());
          newData.push(item.data());
        });
        this.setState({userData: newData});
        this.setState({isFocused: false});
      });
    this.setState({isFocusedd: false});
  };
  getAllChats = () => {
    const {uid, username,} = this.props.user;
    firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', this.props.user.uid)
      .get()
      .then(res => {
        let newChat = [];
        res.forEach(item => {
          console.log('ioi', item.id);
          const chatDocument = item.data();
          console.log('chatssss', chatDocument.count);
          chatDocument.documentID = item.id;

          newChat.push(chatDocument);
          this.setState({chats: newChat});
          // firestore()
          //   .collection('user')
          //   .get()
          //   .then(res => {
          //     res.forEach(item2 => {
          //       console.log('item', item2.data());
          //       const id2 = item2.data().uid;
          //       const imageUrl2 = item2.data().imageUrl;
          //       const name2 = item2.data().username;
          //       firestore()
          //         .collection('chatRooms')
          //         .doc(item.id)
          //         .update({
          //           users: {
          //             [uid]: {
          //               name: username,
          //               imageUrl: imageUrl ? imageUrl : null,
          //             },
          //             [id2]: {
          //               name: name2,
          //               imageUrl: imageUrl2 ? imageUrl2 : null,
          //             },
          //           },
          //         })
          //         .then(() => {
          //           // alert('succeed');
          //         });
          //     });
          //   });
        });
        this.setState({isBlur: false});
        console.log(newChat, 'newchats');
      });
  };

  // newData = [];
  // newData.push({
  //   username: route.params?.item?.username,
  //   photo: route.params?.item?.imageUrl,
  // });
  // const [isVisbile, setIsVisbile] = useState(false);
  // const [isFocused, setIsFocused] = useState(false);
  // const [data, setData] = useState(newData);
  // const [search, setSearch] = useState('');

  toggle = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      isVisbile: !this.state.isVisbile,
      search: '',
    });
    // setIsVisbile(!isVisbile);
    // setSearch('');
  };

  render() {
    const { username,isFirstTime} = this.props?.user;
    const {isFocused, isVisbile, data, search, chats} = this.state;
    const {navigation, route} = this.props;
    console.log('state', this.state.isModel,isFirstTime);

    const {width, height} = Dimensions.get('screen');

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Modal transparent visible={this.state.isModel}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00000080',
            }}>
            <View
              style={{
                height: 200,
                width: 200,
                backgroundColor: 'white',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                onPress={() => {
                  firestore()
                    .collection('user')
                    .doc(this.props.user.uid)
                    .update({isFirstTime: false}).then(( res)=>{
                      console.log('updated res',res)
                      this.setState({isModel:false})
                      this.props?.Login({...this.props.user,isFirstTime:false})
                    }).catch((e)=>{
                      alert(e.message)
                    }
                    )

                }}
                style={{alignSelf: 'flex-end', marginRight: 5}}>
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>x</Text>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Welcome to Chat App Mr {username}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flex: 2,
            backgroundColor: '#0c1c32',
            justifyContent: 'center',
          }}>
          {!isVisbile ? (
            <View
              style={{
                marginTop: 30,
                flexDirection: 'row',
                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={this.toggle}>
                <Image source={require('../assets/Images/search.png')} />
              </TouchableOpacity>
              <Text style={{color: 'white', fontWeight: '800', fontSize: 16}}>
                Home
              </Text>
              <View
                style={{
                  borderColor: 'white',
                  borderWidth: 2,
                  width: 32,
                  height: 32,
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('profile');
                  }}>
            
                    <Text
                      style={{color: 'white', fontSize: 18, fontWeight: '800'}}>
                      {username[0]}
                    </Text>
              
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                marginTop: 30,
                flexDirection: 'row',
                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  //   height: height,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    height: height * 0.065,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                    paddingHorizontal: 20,
                  }}>
                  <TextInput
                    value={search}
                    onChangeText={text => {
                      this.setState({search: text});
                    }}
                    style={{flex: 1}}
                    placeholder="Search Here"
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FFA925',
                      padding: 5,
                      borderRadius: 20,
                    }}
                    onPress={this.toggle}>
                    <Image
                      style={{width: 20, height: 20, tintColor: 'white'}}
                      source={require('../assets/Images/close.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={{flex: 9}}>
          {this.state.isBlur ? (
            <ActivityIndicator
              size={'large'}
              style={{
                marginTop: 10,
                flex: 1,
                alignSelf: 'center',
              }}
            />
          ) : (
            <FlatList
              ListEmptyComponent={() => (
                <Text style={{textAlign: 'center', color: 'grey'}}>
                  Your search query didn't match any of your contact.
                </Text>
              )}
              style={{flex: 1}}
              contentContainerStyle={{
                flexGrow: 1,

                padding: 20,
              }}
              // data={chats}
              data={chats.filter(item => {
                const myUid = this.props.user.uid;
                const otherUserUid = item?.participants?.filter(
                  part => part !== myUid,
                )[0];
                const otherUser = item?.users[otherUserUid];
                // console.log('yuyus', otherUser);
                console.log(item.users[otherUserUid]);
                return otherUser?.name
                  ?.toLowerCase()
                  .includes(search.toLowerCase());
              })}
              renderItem={this.listItem}
            />
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('newchat');
            }}
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
            }}>
            <Image source={require('../assets/Images/chat.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
function mapStateToProps({reducer: {user}}) {
  return {
    user,
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
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Homescreen);
