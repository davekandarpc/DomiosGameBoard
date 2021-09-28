import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  Modal,
  View,
  Pressable,
  AppState
} from 'react-native';
import {Images} from '../../common/Images';
import {APICALL} from '../../common/ApiCaller';
import {apiEndpoint,updateState} from '../../common/functions';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import io from 'socket.io-client';
import {showToast} from '../../common/Toaster';
import {NavigationEvents} from 'react-navigation';


export class MainMenuScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      friendsList: [],
      modalVisible: false,
      inviteHostId: null,
      inviteGameId: null,
    };
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    AppState.addEventListener('change',this.handleAppStateChange);
    await this.updateState();
    await this.startSocket();
  }

  handleAppStateChange = (nextAppState) => {
    console.log("handleAppStateChange : "+nextAppState)
    if (nextAppState === 'inactive') {
    console.log('the app is closed');
   }
  }

  componentWillUnmount() {
    // this.backHandler.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  updateState = async()=>{
    // updateState(global.UserId,1)
    // var header = {'Content-Type': 'application/json'};
    // var formData = JSON.stringify({
    //   users: global.UserId,
    //   action: 1,
    // });
    // console.log("formData : "+JSON.stringify(formData))
    // let apiData = {
    //   endpoint: 'userState',
    //   method: 'POST',
    //   header: header,
    //   body: formData,
    // };
    // let response = await APICALL(apiData);
    // console.log("Update State : "+JSON.stringify(response))

  }

  startSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
var data ={
  Id:global.UserId
}
    this.socket.emit('setSocketId',data)
    this.socket.on('getSocketId', () => {
      console.log("setSocketId")
    })
    this.socket.on('invitationList', (invitationData) => {
      console.log(
        'Get SOcket invitationList: ' + JSON.stringify(invitationData),
      );
      console.log(
        'Get SOcket invitationList: ' +
          JSON.stringify(invitationData.data.user[0].UserId),
      );
      for(var i = 0;invitationData.data.user.length >0;i++ ){

        if (global.UserId == invitationData.data.user[i].UserId) {
          console.log('wahhh');
          global.selectedGameType = invitationData.gametype;
          global.gameName = invitationData.gamename;
          global.GameId=invitationData.GameId
          global.admin = invitationData.hostid;
          this.setState({
            modalVisible: true,
            inviteHostId: invitationData.data.user[0].HostId,
            inviteGameId: invitationData.GameId,
          });
        }
      }
    });
  };

  _onNewGame = () => {
    // this.props.navigation.navigate('EnterGameNameScreen');
    this.props.navigation.navigate('PlayerNumberSelection');
  };

  _goToInvitedGamesList = () => {
    this.props.navigation.navigate('InvitedGamesList');
  };

  _goToGameHistory = () => {
    this.props.navigation.navigate('GameHistory');
  };

  acceptInvitation = async (id) => {
    // var formData = new FormData()
    //   formData.append('HostId', 8); // Loged in user id
    //   formData.append('users', id);
    console.log("this.state.inviteGameId : "+this.state.inviteGameId)
    console.log("API CALLL : "+apiEndpoint)
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      HostId: this.state.inviteHostId,
      users: global.UserId,
      action: 2,
      gameid: this.state.inviteGameId
    });
    console.log("formData : "+JSON.stringify(formData))
    let apiData = {
      endpoint: 'acceptinvitation',
      method: 'PUT',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      showToast('Invitation Accepteed');
      let selectedFriendsList = [];
      // this.props.navigation.navigate('StartGameScreen');
      global.GameId = this.state.inviteGameId
      // updateState(global.UserId,2)
      console.log("Main Screeen : "+this.state.inviteGameId)

      this.props.navigation.navigate('StartGameScreen', {selectedFriendsList,GameId:this.state.inviteGameId});
    } else {
      let message = 'Something went wrong';
      if (response.message !== undefined) {
        message = response.message;
      }
      this.setState({formError: response.message, loginLoader: false});
    }
    this.setState({modalVisible: false, inviteHostId: null});
  };

  rejectInvitation = async () => {
    console.log("Call Invitation Reject")
    // var formData = new FormData()
    //   formData.append('HostId', 8); // Loged in user id
    //   formData.append('users', id);
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      HostId: this.state.inviteHostId,
      // action: 3,
      UserId: global.UserId,
      GameId: global.GameId
    });
    let apiData = {
      endpoint: 'invitationreject',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log("Reject GAME : "+JSON.stringify(response))
    if (response.status === 200) {
      showToast('successfully send Invitation');
    } else {
      let message = 'Something went wrong';
      if (response.message !== undefined) {
        message = response.message;
      }
      this.setState({formError: response.message, loginLoader: false});
    }
    this.setState({modalVisible: false, inviteHostId: null});
  };

  logout =async ()=>{
    await updateState(global.UserId,0)
    this.props.navigation.navigate('LoginScreen')
  }

  reload=async()=>{
    console.log("RELOADDD : "+global.UserId)
    await updateState(global.UserId,1)
  }

  render() {
    const {modalVisible} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationEvents
          onWillFocus={() => {this.reload()}}
        />
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.friendItem}
              onPress={this._onNewGame}>
              <Text style={styles.userNameStyle}>New Game</Text>
            </TouchableOpacity>
           {/*  <TouchableOpacity
              style={styles.friendItem}
              onPress={this._goToInvitedGamesList}>
              <Text style={styles.userNameStyle}>Invited Games</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.friendItem}
              onPress={this._goToGameHistory}>
              <Text style={styles.userNameStyle}>Game History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.friendItem}
              onPress={()=>this.logout()}>
              <Text style={styles.userNameStyle}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false},()=>{
              this.rejectInvitation();
            });
            // Alert.alert('Modal has been closed.');
            // setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Invitation From your friend</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Pressable
                  style={[styles.button, {backgroundColor: 'red '}]}
                  onPress={() => {
                    this.rejectInvitation();
                  }}>
                  <Text style={styles.textStyle}>Reject</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    this.acceptInvitation();
                  }}>
                  <Text style={styles.textStyle}>Accept</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default MainMenuScreen;
