import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
// const data = [
//   {
//     name: 'Shahmeer',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'ash',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'alasfasi',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'ali',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'aadli',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'alsari',
//     photo: require('../assets/Images/cat.png'),
//   },
//   {
//     username: 'lali',
//     photo: require('../assets/Images/cat.png'),
//   },
// ];
const ListItem = ({item, onPress, id}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            backgroundColor: '#C0C0C0',
          }}
          source={{
            uri: item.imageUrl,
          }}
        />
        <Text style={{marginLeft: 15}}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
};
export class Newchat extends Component {
  state = {
    isVisbile: false,
    // listData: data,
    search: '',
    userData: [],
    isFocused: true,
    isFocusedd: true,
    chats: [],
  };
  toggle = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({isVisbile: !this.state.isVisbile});
    this.setState({search: ''});
  };
  // onSearch = text => {
  //   const filteredList = data.filter(item => {
  //     return item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());
  //   });
  //   this.setState({listData: filteredList});
  // };

  getAllUser = async () => {
    const user = firestore()
      .collection('user')
      .get()
      .then(res => {
        let newData = [];
        res.forEach(item => {
          newData.push(item.data());
        });
        this.setState({userData: newData});
        this.setState({isFocused: false});
      });
    this.setState({isFocusedd: false});
  };
  componentDidMount() {
    this.getAllUser();
    this.getAllChats();
  }
  getAllChats = () => {
    firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', this.props.user.uid)
      .get()
      .then(res => {
        let newChat = [];
        res.forEach(item => {
          const chatDocument = item.data();
          chatDocument.documentID = item.id;
          newChat.push(chatDocument);
        });
        this.setState({chats: newChat});
      });
  };
  storeInFirestore = item => {
    console.log('itemss', item);
    const {uid, imageUrl, username} = this.props?.user;
    console.log('user', this.props?.user);
    const id1 = this.props.user?.uid;
    const id2 = item?.uid;
    firestore()
      .collection('chatRooms')
      //.doc()
      .add({
        participants: [this.props.user?.uid, item?.uid],
        users: {
          [id1]: {
            name: username ? username : '',
            imageUrl: imageUrl ? imageUrl : null,
          },
          [id2]: {
            name: item?.username,
            imageUrl: item?.imageUrl ? item?.imageUrl : null,
          },
        },
      })
      .then(res => {
        console.log('fire', this.foo);
        // this.setState({id: res.data()});
        this.props.navigation.navigate('chat', {
          item: {
            documentID: res.id,
            participants: [id1, id2],
            users: {
              [id1]: {
                name: this.props?.user?.username,
                imageUrl: this.props.user.imageUrl,
              },
              [id2]: {
                name: item?.username,
                imageUrl: item?.imageUrl,
              },
            },
          },
        });

        alert('success');
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    const {height} = Dimensions.get('screen');
    const {chats, userData, search} = this.state;
    const myUid = this.props.user.uid;
    const other = chats?.map(data => {
      const otherUser = data?.participants?.filter(part => part !== myUid)[0];
      return otherUser;
    });

    const newData = userData.filter(item => {
      //   console.log(item);
      //  console.log('includes', other.includes(item.uid));
      if (!other.includes(item.uid)) return item;
    });

    console.log(newData);

    const finalData = newData?.filter(item => {
      return (
        item?.username?.toLowerCase().includes(search.toLowerCase()) &&
        this.props.user.uid !== item.uid
      );
    });

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 2,
            backgroundColor: '#0c1c32',
            justifyContent: 'center',
          }}>
          {!this.state.isVisbile ? (
            <View
              style={{
                marginTop: 30,
                flexDirection: 'row',
                marginHorizontal: 20,
                justifyContent: 'space-between',

                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Image source={require('../assets/Images/back1.png')} />
              </TouchableOpacity>
              <Text style={{color: 'white', fontWeight: '800', fontSize: 16}}>
                Select contact
              </Text>
              <View>
                <TouchableOpacity onPress={this.toggle}>
                  <Image
                    style={{width: 30, height: 30, borderRadius: 30}}
                    source={require('../assets/Images/search.png')}
                  />
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
                    value={this.state.search}
                    onChangeText={text => {
                      this.setState({
                        search: text,
                      });
                      // this.onSearch(text);
                    }}
                    style={{flex: 1}}
                    placeholder="Search Here"
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FFA925',
                      padding: 5,
                      borderRadius: 15,
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
        <View style={{flex: 8}}>
          {this.state.isFocused ? (
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
              key={this.state.id}
              ListEmptyComponent={() => {
                return (
                  <Text style={{textAlign: 'center', color: 'grey'}}>
                    Your search query didn't match any of your contact
                  </Text>
                );
              }}
              style={{flex: 1}}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
              }}
              data={finalData}
              renderItem={({item}) => {
                console.log('fdsd', item);
                return (
                  <ListItem
                    isFocused={this.state.isFocusedd}
                    item={item}
                    id={this.props.user.uid}
                    onPress={() => {
                      this.storeInFirestore(item);

                      // this.setState({listData: data});
                      //tgissetListData(data);
                    }}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
function mapStateToProps({reducer: {user}}) {
  console.log('====================================');
  console.log(user);
  console.log('====================================');
  return {
    user,
  };
}
export default connect(mapStateToProps)(Newchat);
