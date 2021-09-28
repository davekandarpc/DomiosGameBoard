import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Images} from '../../common/Images';
import {APICALL} from '../../common/ApiCaller';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import io from 'socket.io-client';
import {showToast} from '../../common/Toaster';
import {apiEndpoint} from '../../common/functions';

export class FindUsersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendsList: [],
      selectedIndex: 0,
      sendInvitationNumber: 1,
      acceptInvitationNumber: 1,
      GameId: null,
      invitationSendAction: false,
    };
  }
  async componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    await this.fetchGameUser();
    this.waitingInvitation();
  }

  waitingInvitation = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('invitationAction', async (data) => {
      // console.log('Get invitationAction: ' + JSON.stringify(data)+" : User ID : "+global.UserId);
      console.log(
        'Get invitationAction data.action: ' +
          data.action +
          ' : User ID : ' +
          global.UserId,
      );
      console.log('Get SOcket : ' + JSON.stringify(data));
      if (data.action == 2 && data.user != undefined && data.userData != undefined) {
        console.log('Get SOcket userData IDFFFFFFFFFFFFF:=== ');
        console.log('Get SOcket userData :=== ' + JSON.stringify(data.userData));
        console.log('Get SOcket length : ' + data.userData.length);
        console.log(
          'Get invitationAction: IFFFF ' +
            JSON.stringify(data) +
            ' : User ID : ' +
            global.UserId +
            ' : ACtion : ' +
            data.action ==
            3,
        );
        for (var i = 0; data.user.length; i++) {
          if (data.user[i] != undefined) {
            console.log('Get invitationAction global.UserId: ' + global.UserId);
            console.log(
              'Get invitationAction data.user[i]: ' +
                JSON.stringify(data.user[i]),
            );
            if (global.UserId == data.user[i]) {
              console.log(
                'Game Start Invitation data.user.length' + data.user.length,
              );
              console.log(
                'Game Start Invitation global.numberofUser' +
                  global.numberofUser,
              );
              if (global.numberofUser == data.userData.length + 1) {
                this.next();
                console.log('Game Start Invitation Accept');
                showToast('Game Start Invitation Accept');
              }
              // break;
            }
          } else {
            console.log("Game Start Invitation REJECTTTTT ++++++========== " )
            // var sendInvitationNumber = this.state.sendInvitationNumber;
            // sendInvitationNumber -= 1;
            // this.setState({sendInvitationNumber});
            break;
          }
        }
        // this.setState({modalVisible:true,inviteHostId:data.user[0].HostId})
      } else if (data.action == 3) {
        console.log(
          'Get invitationAction: ELSEEEE ' +
            JSON.stringify(data) +
            ' : User ID : ' +
            global.UserId +
            ' : ACtion : ' +
            data.action ==
            3,
        );
        var sendInvitationNumber = this.state.sendInvitationNumber;
            sendInvitationNumber -= 1;
        this.setState({sendInvitationNumber,invitationSendAction: false}, () => {
          console.log('Invitation Rejected FindUsersScreen');
          showToast('Invitation Rejected FindUsersScreen');
          this.selectUser(this.state.selectedIndex, null, 1);
          // var res = await this.fetchGameUser()
        });
      }
    });
  };

  fetchGameUser = async () => {
    var GameId = this.props.navigation.state.params.GameID;
    let response = null;
    let responsedata = null;
    console.log('DID MOUNT Game ID State : ' + GameId);
    global.GameId = GameId;
    let apiData = {
      // endpoint: 'finduser.php',
      endpoint: 'user',
      method: 'GET',
    };
    response = await APICALL(apiData);
    this.setState({GameId: GameId}, async () => {
      console.log('DID MOUNT Game ID : ' + this.state.GameId);
      // let apiData = {
      //   // endpoint: 'finduser.php',
      //   endpoint: 'user',
      //   method: 'GET',
      // };
      if (response.status === 200) {
        this.setState({friendsList: response.data}, () => {
          responsedata = this.state.friendsList;
          console.log('friendsList 1: ', JSON.stringify(responsedata));
          // console.log('friendsList 3: ', JSON.stringify(this.state.friendsList));
        });
      }
      responsedata = response.data;
      console.log('friendsList 2: ' + JSON.stringify(responsedata));
    });
    // console.log('friendsList 3: '+ JSON.stringify(responsedata));
    return response.data;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  next = () => {
    // if(this.state.inviteSuccess == true){null}
    let friendsList = this.state.friendsList;
    let selectedFriendsList = [];
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].isSelected) {
        selectedFriendsList.push(friendsList[i]);
      }
    }
    this.props.navigation.navigate('StartGameScreen', {
      selectedFriendsList,
      GameId: this.state.GameId,
    });
  };

  sendInvitaion = async (id) => {
    // var formData = new FormData()
    //   formData.append('HostId', 8); // Loged in user id
    //   formData.append('users', id);
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.emit('connection', () => {
      console.log('COnection Socket');
    });
    console.log('Game IDD : ' + JSON.stringify(this.state.GameId));
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      HostId: global.UserId,
      users: id,
      gameName: global.gameName,
      gameType: global.selectedGameType,
      GameId: this.state.GameId,
    });
    let apiData = {
      endpoint: 'invitation',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      global.admin = global.UserId;
      showToast('successfully send Invitation');
    } else {
      let message = 'Something went wrong';
      if (response.message !== undefined) {
        message = response.message;
      }
      this.setState({formError: response.message, loginLoader: false});
    }
  };

  selectUser = async (index, id, action) => {
    var res = await this.fetchGameUser();
    // var data = this.state.friendsList
    var data = res;
    var sendInvitationNumber = this.state.sendInvitationNumber;
    console.log('DaTa : ' + JSON.stringify(res));
    console.log('DaTa INDEX: ' + JSON.stringify(data[index]));
    let friendsList = data;
    var status = friendsList[index].Status;
    if (friendsList[index].isSelected === undefined) {
      if (status != 2 && status != 0) {
        if (action == 1) {
          this.setState({selectedIndex: index});
          friendsList[index].isSelected = false;
          // friendsList[index].isSelected = !friendsList[index].isSelected;
        } else {
          sendInvitationNumber += 1;
          this.setState(
            {invitationSendAction: true, sendInvitationNumber},
            () => {
              this.sendInvitaion(id);
              this.setState({selectedIndex: index});
              friendsList[index].isSelected = true;
            },
          );
        }
      } else {
        if (status == 2) {
          showToast('Already In Game');
        } else {
          showToast('User Is Offline');
        }
      }
    } else {
      friendsList[index].isSelected = !friendsList[index].isSelected;
    }
    this.setState({friendsList});
  };

  render() {
    const {friendsList,sendInvitationNumber} = this.state;
    console.log("sendInvitationNumber ::: === "+sendInvitationNumber)
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ImageBackground source={Images.back} style={styles.backImageStyle}>
              <TouchableOpacity
                style={styles.backButtonStyle}
                onPress={this.goBack}
              />
            </ImageBackground>
            <View style={styles.selectGameTypeLablel}>
              <Text style={styles.selectGameTypeLabelText}>Find Friends</Text>
            </View>
            <ImageBackground
              source={Images.nextArrow}
              style={styles.backImageStyle}>
              <TouchableOpacity
                style={styles.backButtonStyle}
                onPress={this.next}
              />
            </ImageBackground>
          </View>
          <ImageBackground
            source={Images.reload1}
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              right: 20,
              top: 50,
              zIndex: +1,
            }}>
            <TouchableOpacity
              style={{height: '100%', width: '100%'}}
              onPress={() => this.fetchGameUser()}
            />
          </ImageBackground>
          <View style={styles.mainContent}>
            <View>
              <ScrollView contentContainerStyle={styles.friendsListView}>
                {friendsList.length !== 0 &&
                  friendsList.map((item, index) => {
                    return item.Id != global.UserId &&
                      // this.state.invitationSendAction == false ? (
                      this.state.sendInvitationNumber != global.numberofUser ? (
                      <ImageBackground
                        source={Images.findUserNameBackground}
                        style={styles.findUserNameBackgroundStyle}>
                        <TouchableOpacity
                          style={styles.friendItem}
                          onPress={() => this.selectUser(index, item.Id, 0)}>
                          <Text style={styles.userNameStyle}>
                            {item.FirstName} {item.LastName}{' '}
                          </Text>
                          {item.Status != undefined && (
                            <View
                              style={{
                                height: item.Status != 2 ? 10 : null,
                                width: item.Status != 2 ? 10 : null,
                                borderRadius: 5,
                                backgroundColor:
                                  item.Status == 0 ? 'red' : 'green',
                              }}>
                              <Text style={styles.userNameStyle}>
                                {item.Status == 0
                                  ? ' '
                                  : item.Status == 1
                                  ? ' '
                                  : item.Status == 2
                                  ? 'In Game'
                                  : null}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                        {item.isSelected !== undefined && item.isSelected && (
                          <Ionicons
                            name="ios-checkmark-done-circle"
                            size={30}
                            style={styles.selectedIconStyle}
                          />
                        )}
                      </ImageBackground>
                    ) : (
                      item.Id != global.UserId && (
                        <ImageBackground
                          source={Images.findUserNameBackground}
                          style={styles.findUserNameBackgroundStyle}>
                          <View style={styles.friendItemDiseble}>
                            <Text style={styles.userNameStyle}>
                              {item.FirstName} {item.LastName}{' '}
                            </Text>
                            {item.Status != undefined && (
                              <View
                                style={{
                                  height: item.Status != 2 ? 10 : null,
                                  width: item.Status != 2 ? 10 : null,
                                  borderRadius: 5,
                                  backgroundColor:
                                    item.Status == 0 ? 'red' : 'green',
                                }}>
                                <Text style={styles.userNameStyle}>
                                  {item.Status == 0
                                    ? ' '
                                    : item.Status == 1
                                    ? ' '
                                    : item.Status == 2
                                    ? 'In Game'
                                    : null}
                                </Text>
                              </View>
                            )}
                          </View>
                          {item.isSelected !== undefined && item.isSelected && (
                            <Ionicons
                              name="ios-checkmark-done-circle"
                              size={30}
                              style={styles.selectedIconStyle}
                            />
                          )}
                        </ImageBackground>
                      )
                    );
                  })}
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default FindUsersScreen;
