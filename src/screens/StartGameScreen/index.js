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
import {apiEndpoint,updateState} from '../../common/functions';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import io from 'socket.io-client';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

export class StartGameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriendsList: [],
      GameId:null
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    this.startSocket();
    // if(this.props.navigation.state.params.selectedFriendsList != undefined){
    let selectedFriendsList = this.props.navigation.state.params.selectedFriendsList;
    let GameId = this.props.navigation.state.params.GameId;
    this.setState({GameId},()=>{
      this.getUserList(GameId);
    })

    // }
  }

  getUserList = async (GameId) => {
    console.log('getUserList Call');
    console.log('getUserList Call' + global.GameId);
    console.log('getUserList Call' + GameId);
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
    });
    let apiData = {
      endpoint: 'gameuser',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      console.log('USER LIST : ' + JSON.stringify(response));
      this.setUserList(response.user);
    } else {
      let message = 'Something went wrong';
    }
  };

  setUserList = (selectedFriendsList) => {
    if (selectedFriendsList.length > 0) {
      console.log(
        'selectedFriendsList : ' + JSON.stringify(selectedFriendsList),
      );
      this.setState({selectedFriendsList}, () => {
        console.log('selectedFriendsList ID: ' + selectedFriendsList[0].Id);
      });
    }
    let selectedGameType = global.selectedGameType;
    let gameName = global.gameName;
    console.log('selectedFriendsList: ', selectedFriendsList);
    console.log('selectedGameType: ', selectedGameType);
    console.log('gameName: ', gameName);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  startSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('startGameSocket', async (data) => {
      console.log('startGameSocket SOcket 1: ' + JSON.stringify(data));
      console.log('startGameSocket SOcket 2: ' + data.userID);
      console.log('startGameSocket SOcket 3: ' + data.HostId);
      console.log('startGameSocket SOcket 3 users: ' + data.users);
      console.log('startGameSocket SOcket 3 users: ' + typeof(data.users));
      console.log('startGameSocket SOcket 3 users length: ' + data.users.length);
      console.log('startGameSocket SOcket 3 selectedFriendsList length: ' + this.state.selectedFriendsList);
      // if(global.admin == data.HostId ){
        // }
        var userInGame = false
        for(var i = 0;data.users.length>i;i++){
        console.log('startGameSocket SOcket 3 users for selectedFriendsList: ' + this.state.selectedFriendsList[i]);
        console.log('startGameSocket SOcket 3 users fro UserId: ' + global.UserId);
        if(data.users[i] === global.UserId){
          userInGame = true
          break
        }
      }
      if(userInGame == true){
        await updateState(global.UserId,2)
        this.enterGameBoard();
      }
    });
    this.socket.on('invitationAction', async (data) => {
      this.getUserList(this.state.GameId);
    })
  };

  enterGameBoard = () => {
    console.log("EnterGameBoard :: "+global.UserId)
    if (global.selectedGameType === 'Straight Dominoes') {
      this.props.navigation.navigate('StarightDominoType');
    } else if (global.selectedGameType === 'Block') {
      this.props.navigation.navigate('BlockType');
    } else if (global.selectedGameType === 'Draw') {
      this.props.navigation.navigate('DrawType');
    } else if (global.selectedGameType === 'AllFive') {
      this.props.navigation.navigate('AllFive');
    } else if (global.selectedGameType === 'MexicanTrain') {
      this.props.navigation.navigate('MexicanTrain');
    } else if (global.selectedGameType === 'JamaicanStyle') {
      this.props.navigation.navigate('JamaicanStyle');
    }
  };

  startGame = async () => {
    console.log("Start Game FLLL: "+JSON.stringify(this.state.selectedFriendsList))
    var fl = this.state.selectedFriendsList
    var FLID = []
    for(var i =0;fl.length>i;i++){
      if(fl[i].id !== global.admin){
        FLID.push(fl[i].Id)
      }
    }
    console.log("FLIDDD : "+JSON.stringify(FLID))
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      HostId: global.admin,
      // users: this.state.selectedFriendsList[0].Id,
      users: FLID,
      GameId: global.GameId,
    });
    let apiData = {
      endpoint: 'startgame',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      console.log('response : ' + JSON.stringify(response));
      updateState(global.UserId,2)
      this.enterGameBoard();
      // if (global.selectedGameType === 'Straight Dominoes') {
      //   this.props.navigation.navigate('StarightDominoType');
      // } else {
      //   this.props.navigation.navigate('BlockType');
      // }
    } else {
      let message = 'Something went wrong';
      if (response.message !== undefined) {
        message = response.message;
      }
      this.setState({formError: response.message, loginLoader: false});
    }
  };

  render() {
    const {selectedFriendsList} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          <View style={{flexDirection: 'row'}}>
            <ImageBackground source={Images.back} style={styles.backImageStyle}>
              <TouchableOpacity
                style={styles.backButtonStyle}
                onPress={this.goBack}
              />
            </ImageBackground>
          </View>
          <View style={styles.gameTypeHorizontalView}>
            <TouchableOpacity style={styles.gameTypeItem}>
              <Image source={Images.dominoDice} style={styles.dominoImgStyle} />
              <Text style={styles.gameTypeLabelStyle}>Game Type</Text>
              <View style={styles.gameTypeLabel}>
                <Text style={styles.gameTypeLabelText}>
                  {global.selectedGameType}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gameTypeItem}>
              <Image source={Images.dominoDice} style={styles.dominoImgStyle} />
              <Text style={styles.gameTypeLabelStyle}>Game Name</Text>
              <View style={styles.gameTypeLabel}>
                <Text style={styles.gameTypeLabelText} numberOfLines={1}>
                  {global.gameName}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{justifyContent: 'center', flex: 1}}>
              <ScrollView
                contentContainerStyle={styles.selectedFriendsScrollView}>
                {selectedFriendsList !== undefined &&
                  selectedFriendsList.length !== 0 &&
                  selectedFriendsList.map((item, index) => {
                    return (
                      <ImageBackground
                        source={Images.findUserNameBackground}
                        style={styles.findUserNameBackgroundStyle}>
                        <TouchableOpacity style={styles.friendItem}>
                          <Text style={styles.userNameStyle}>
                            {item.FirstName} {item.LastName}
                          </Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    );
                  })}
              </ScrollView>
              {global.admin == global.UserId ? (
                <ImageBackground
                  resizeMode={'contain'}
                  source={Images.start}
                  style={styles.startGameImageStyle}>
                  <TouchableOpacity
                    style={styles.startGameButton}
                    onPress={this.startGame}
                  />
                </ImageBackground>
              ) : (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Loading.....
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default StartGameScreen;
