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
  BackHandler,
  ImageBackground,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import {Images} from '../../../common/Images';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import {Dice} from '../../../components/Dice';
import {getHeight, getWidth, updateState} from '../../../common/functions';
import {showToast} from '../../../common/Toaster';
import {APICALL} from '../../../common/ApiCaller';
import {apiEndpoint} from '../../../common/functions';
import io from 'socket.io-client';

export class GameBoard extends Component {

  constructor(props) {
    super(props);
    this.bornYardLeftOffset = new Animated.Value(0);
    this.state = {
      selectedFriendsList: [],
      boneYardOpen: 0,
      playersData: [
        {
          name: 'Player1',
          score: 0,
          dominoesLeft: 7,
        },
        {
          name: 'Player2',
          score: 0,
          dominoesLeft: 7,
        },
      ],
      gameChart: [],
      player1Dominoes: [],
      player2Dominoes: [],
      // bornYardDices: [
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 0,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 1,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 1,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 2,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 2,
      //   },
      //   {
      //     upperDotsNumber: 2,
      //     lowerDotsNumber: 2,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 3,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 3,
      //   },
      //   {
      //     upperDotsNumber: 2,
      //     lowerDotsNumber: 3,
      //   },
      //   {
      //     upperDotsNumber: 3,
      //     lowerDotsNumber: 3,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 4,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 4,
      //   },
      //   {
      //     upperDotsNumber: 2,
      //     lowerDotsNumber: 4,
      //   },
      //   {
      //     upperDotsNumber: 3,
      //     lowerDotsNumber: 4,
      //   },
      //   {
      //     upperDotsNumber: 4,
      //     lowerDotsNumber: 4,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 2,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 3,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 4,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 5,
      //     lowerDotsNumber: 5,
      //   },
      //   {
      //     upperDotsNumber: 0,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 1,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 2,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 3,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 4,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 5,
      //     lowerDotsNumber: 6,
      //   },
      //   {
      //     upperDotsNumber: 6,
      //     lowerDotsNumber: 6,
      //   },
      // ],
      bornYardDices: [],
      gameEnd: false,
      backGame: false,
      mainPanel: [],
      mainPanelUp: [],
      mainPanelDown: [],
      activeUserTurn: 0,
      nonActiveUser: 0,
      match: 0,
      selectedDiceIndex: -1,
      selectedDomino: null,
      totalboxleft: 0,
      totalboxcenter: 0,
      totalboxright: 0,
      totalboxtop: 0,
      totalboxbottom: 0,
      userList:[],
      turnwinner: [],
    };
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    console.log('Draw TYPEeeeeeee =====================================');
    console.log('Draw TYPEeeeeeee =====================================');
    console.log('Draw TYPEeeeeeee =====================================');
    console.log('Draw TYPEeeeeeee =====================================');
    console.log('Draw TYPEeeeeeee =====================================');
    await this._asignInitialDominoes();
    await this.backHandel();
    await this.getUserList();
    await this.setAdminUser();
    await this.startTurnSocket();
    await this.startWINSocket();
    await this.startLeaveSocket();
    console.log('GameId 111 : ');
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backHandel = () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  };

  handleBackButtonClick = () => {
    Alert.alert(
      'Domino Circus',
      'You are in the middle of Game. Are you sure you want to leave the Game?',
      [
        {
          text: 'Stay on this game',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        // {text: 'leave this page', onPress: () => this.goBack()},
        {text: 'leave this gane', onPress: () => this.exitGame(1)},
      ],
      {cancelable: false},
    );
    return true;
  };

  gotohome = async (val) => {
    var header = {'Content-Type': 'application/json'};
    var leave = 0;
    if (val == 1) {
      leave = 1;
    }
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
      Leave: leave,
    });
    let apiData = {
      endpoint: 'endgame',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    this.props.navigation.navigate('MainMenuScreen');
  };

  /* exitGame = (val) => {
    if (val == 2) {
      this.setState({backGame: false});
    } else {
      this.setState({backGame: false}, () => {
        updateState(global.UserId, 1);
        this.gotohome(1);
      });
    }
  }; */
  exitGame = async (val) => {
    if (val == 2) {
      this.setState({backGame: false});
    } else {
      this.setState({backGame: false}, async () => {
        var uStatus = await updateState(global.UserId, 1);
        if (uStatus.status == 200) {
          if (this.state.activeUserTurn === 1) {
            console.log('Exit Game Cahnge IFFF : ' + this.state.activeUserTurn);
            await this.changeTurn(this.state.mainPanel);
            await this.gotohome(1);
          } else {
            console.log(
              'Exit Game Cahnge ELSEE : ' + this.state.activeUserTurn,
            );
            await this.changeTurn(this.state.mainPanel, 1);
            await this.gotohome(1);
          }
        }
        uStatus = await updateState(global.UserId, 1);
        console.log('uStatus : ' + JSON.stringify(uStatus));
      });
    }
  };

  setAdminUser = () => {
    console.log('global.admin : ' + global.admin);
    console.log('global.UserId : ' + global.UserId);
    console.log('global.UserId : ' + global.UserId);
    this.setAdminTurn();
    // if (global.admin == global.UserId) {
    // } else {
    //   this._asignInitialDominoes();
    // }
  };

  setAdminTurn = async () => {
    console.log('Call Default User : ' + global.UserId);
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
    });
    let apiData = {
      endpoint: 'setturn',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    // this.setState({activeUserTurn: 1});
    await this.setFirstTurn(response.data)
    await this._asignInitialDominoes();
  };

  setFirstTurn = (val) => {
    var fid = 0;
    for (var i = 0; val.length > i; i++) {
      if (val[i].Turn == 1) {
        fid = val[i].UserId;
        this.setState({nonActiveUser: fid});
      }
    }
    if (fid === global.UserId) {
      this.setState({activeUserTurn: 1});
    }
  };

  startTurnSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('turn', async (turn) => {
      console.log('turn : socket' + JSON.stringify(turn));
      console.log(
        'turn : socket Bornyard_Array' + JSON.stringify(turn.Bornyard_Array),
      );
      var winner = false;
      var nonActiveUser = 0;
      console.log('Board LEngth ::: ' + turn.winner.board.length);
      if (turn.winner.board.length > 1) {
        if (turn.Bornyard_Array.length == 0) {
          // if bornyard in game mode
          var winner = this.checkWinner(turn.winner);
        }
      }
      this.setState({turnwinner: turn.winner})
      if (turn.Bornyard_Array.length > 0) {
        this.setState({bornYardDices: turn.Bornyard_Array}, () => {
          console.log('bornYardDices : ' + this.state.bornYardDices);
          console.log(
            'bornYardDices length : ' + this.state.bornYardDices.length,
          );
          console.log(
            'bornYardDices typeof : ' + typeof this.state.bornYardDices,
          );
        });
      }
      console.log('Winner Game : ' + winner);
      // if (turn.winner.user1.length < 2) {
      if (turn.winner.user1.length == 0) {
        this.winercall(turn.winner);
        // } else if (turn.winner.user2.length < 2) {
      } else if (turn.winner.user2.length == 0) {
        this.winercall(turn.winner);
      } else {
        // if (winner == false) {
        for (var i = 0; turn.data.length > i; i++) {
          if (turn.data[i].Turn == 1) {
            nonActiveUser = turn.data[i].UserId;
          }
          if (turn.data[i].UserId == global.UserId && turn.data[i].Turn == 1) {
            var sid = turn.data[i].UserId;
            var st = turn.data[i].Turn;
            console.log('turn : socket User ID : ' + JSON.stringify(sid));
            console.log('turn : socket User ID : ' + JSON.stringify(st));
            if (winner == false) {
              this.setState({activeUserTurn: 1, mainPanel: turn.domino});
              await this.setTotlaBox(turn.domino, null, 1);
              // this.setTotlaBoxTwo(turn.domino);
            } else {
              this.winercall(turn.winner);
              this.setState({mainPanel: turn.domino});
              await this.setTotlaBox(turn.domino, null, 1);
              // this.setTotlaBoxTwo(turn.domino);
            }
          } else if (
            turn.data[i].UserId == global.UserId &&
            turn.data[i].Turn == 0
          ) {
            if (winner == false) {
              this.setState({activeUserTurn: 2, mainPanel: turn.domino});
            } else {
              this.winercall(turn.winner);
              this.setState({mainPanel: turn.domino});
            }
          }
          this.setState({nonActiveUser});
        }
      }
      // } else {
      // console.log('Game END !!!!!!!!! $$$$');
      // var data = turn.winner;
      // var user1 = data.user1;
      // var user2 = data.user2;
      // var user1Total = this.calculateScore(user1);
      // console.log('Data user 1 Total :' + user1Total);
      // var user2Total = this.calculateScore(user2);
      // console.log('Data user 2 Total :' + user2Total);

      // console.log('Data user 1 :' + user1);
      // console.log('Data user 2 :' + user2);
      // if (user1Total == user2Total) {
      //   console.log('both same TIE');
      // } else if (user1Total > user2Total) {
      //   var winpoint = user1Total - user2Total
      //   console.log('User 1 Winner : '+winpoint);
      // } else if (user1Total < user2Total) {
      //   var winpoint = user2Total - user1Total
      //   console.log('User 2 Winner : '+winpoint);
      // }
      // }
      this.getUserList();

      // if(turn.)
    });
  };

  winercall = (data) => {
    console.log('Game END !!!!!!!!! $$$$');
    var data = data;
    this.setState({gameEnd: true}, () => {
      var userInfo = null;
      if (data.HostId == global.UserId) {
        userInfo = 'user1';
      } else {
        userInfo = 'user2';
      }
      var user1 = data.user1;
      var user2 = data.user2;
      var winpoint = 0;
      var winuser = 0;
      var user1Total = this.calculateScore(user1);
      var user2Total = this.calculateScore(user2);

      console.log('Data user 1 :' + user1);
      console.log('Data user 2 :' + user2);
      console.log('Data user 1 Total :' + user1Total);
      console.log('Data user 2 Total :' + user2Total);
      if (user1Total == user2Total) {
        console.log('both same TIE');
        winpoint = 0;
        this.winApi(winpoint, global.UserId);
      } else if (user1Total < user2Total) {
        winpoint = user2Total - user1Total;
        // this.winApi(winpoint);
        if (userInfo == 'user1') {
          winuser = 1;
          winpoint += this.state.playersData[0].score;
        }
        console.log('User Winner 1 : ' + winpoint);
      } else if (user1Total > user2Total) {
        // this.winApi(winpoint);
        winpoint = user1Total - user2Total;
        if (userInfo == 'user2') {
          winuser = 2;
          winpoint += this.state.playersData[1].score;
        }

        console.log('User Winner 2 : ' + winpoint);
      }

      if (winuser == 1) {
        console.log('WINPOint 1 : ' + winpoint);
        console.log('WINPOint 1 global.UserId: ' + global.UserId);
        this.winApi(winpoint, global.UserId);
      } else if (winuser == 2) {
        console.log('WINPOint 2 : ' + winpoint);
        console.log('WINPOint 2 global.UserId : ' + global.UserId);
        this.winApi(winpoint, global.UserId);
      }
    });
  };

  winApi = async (Points, id) => {
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: id,
      Points: Points,
    });
    let apiData = {
      endpoint: 'winpoint',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    // console.log("Response : "+ W)
  };

  /* checkWinner = (data) => {
    console.log('checkWinner : ' + JSON.stringify(data));
    var board = data.board;
    var lock = false;
    if (board != undefined && board.length > 0) {
      var user1 = data.user1;
      var user2 = data.user2;
      var left = board[0];
      var right = board[board.length - 1];
      var user1left = this.checkLock(left, user1);
      var user2left = this.checkLock(left, user2);
      var user1right = this.checkLock(right, user1);
      var user2right = this.checkLock(right, user2);
      console.log('user1left Left  : ' + JSON.stringify(left));
      console.log('user1left Left  : ' + JSON.stringify(right));
      console.log('user1left Left Lock : ' + user1left);
      console.log('user2left Left Lock : ' + user2left);
      console.log('user1right Left Lock : ' + user1right);
      console.log('user2right Left Lock : ' + user2right);

      if (
        user1left == true &&
        user2left == true &&
        user1right == true &&
        user2right == true
      ) {
        lock = true;
      }
      // else if (user1left == true && user1right == true) {
      //   lock = true;
      // } else if (user2left == true && user2right == true) {
      //   lock = true;
      // }
      return lock;
    }
  }; */

  checkWinner = (data) => {
    console.log('checkWinner : ' + JSON.stringify(data));
    var board = data.board;
    var lock = false;

    if (board != undefined && board.length > 0) {
      // new IMpilimaent //
      var left = board[0];
      var right = board[board.length - 1];
      var userleft = null;
      var userright = null;
      var usersData = [];
      console.log('Winner Check User Data left: ' + left);
      console.log('Winner Check User Data right: ' + right);
      for (var i = 0; data.users.length > i; i++) {
        var NewUser = JSON.parse(data.users[i].Domino_Array);
        var user = null;
        console.log('Winner Check User Data NewUser: ' + NewUser);
        userleft = this.checkLock(left, NewUser);
        userright = this.checkLock(right, NewUser);
        user = {userleft, userright};
        usersData.push(user);
        console.log(
          'Winner Check User Data FINAL 2 : ' + JSON.stringify(usersData),
        );
      }
      console.log(
        'Winner Check User Data FINAL 2: ' + JSON.stringify(usersData),
      );

      for (var j = 0; usersData.length > j; j++) {
        console.log('Winner Check User Data FINAL FORRRR : ' + usersData[j]);
        if (usersData[j].userleft == true && usersData[j].userright == true) {
          console.log('Winner Check User Data FINAL IFFFF : ');
          lock = true;
        }
      }

      // OLD implimentation
      /* var user1 = data.user1;
      var user2 = data.user2;
      var left = board[0];
      var right = board[board.length - 1];
      var user1left = this.checkLock(left, user1);
      var user2left = this.checkLock(left, user2);
      var user1right = this.checkLock(right, user1);
      var user2right = this.checkLock(right, user2);
      console.log('user1left Left  : ' + JSON.stringify(left));
      console.log('user1left Left  : ' + JSON.stringify(right));
      console.log('user1left Left Lock : ' + user1left);
      console.log('user2left Left Lock : ' + user2left);
      console.log('user1right Left Lock : ' + user1right);
      console.log('user2right Left Lock : ' + user2right);

      if (
        user1left == true &&
        user2left == true &&
        user1right == true &&
        user2right == true
      ) {
        lock = true;
      } */
      // else if (user1left == true && user1right == true) {
      //   lock = true;
      // } else if (user2left == true && user2right == true) {
      //   lock = true;
      // }
      console.log('Winner Check User Data FINAL LOCKK: ' + lock);
      return lock;
    }
  };

  checkLock = (data, user) => {
    var lock = false;
    // if (user.length == 0) {
    //   lock = true
    // } else {
    for (var i = 0; user.length > i; i++) {
      console.log('LockCheck : ' + i);
      if (data.upperLocked != undefined) {
        console.log('LockCheck upperLocked call');
        if (data.upperLocked != undefined && data.upperLocked == true) {
          if (data.lowerDotsNumber == user[i].lowerDotsNumber) {
            console.log('LockCheck upperLocked upperDotsNumber Match');
            lock = false;
            break;
          } else if (data.lowerDotsNumber == user[i].upperDotsNumber) {
            lock = false;
            break;
          } else {
            lock = true;
          }
        }
      } else if (data.lowerLocked != undefined) {
        console.log('LockCheck lowerLocked call');
        if (data.lowerLocked != undefined && data.lowerLocked == true) {
          if (data.upperDotsNumber == user[i].upperDotsNumber) {
            console.log('LockCheck lowerLocked lowerDotsNumber Match');
            lock = false;
            break;
          } else if (data.upperDotsNumber == user[i].lowerDotsNumber) {
            lock = false;
            break;
          } else {
            lock = true;
          }
        }
      } else {
        console.log('LockCheck Both Undifine');
        if (data.upperDotsNumber == user[i].upperDotsNumber) {
          console.log('LockCheck upperDotsNumber Match');
          lock = false;
          break;
        } else if (data.upperDotsNumber == user[i].lowerDotsNumber) {
          lock = false;
          break;
        } else {
          lock = true;
        }
        if (data.lowerDotsNumber == user[i].lowerDotsNumber) {
          console.log('LockCheck lowerDotsNumber Match');
          lock = false;
          break;
        } else if (data.lowerDotsNumber == user[i].upperDotsNumber) {
          lock = false;
          break;
        } else {
          lock = true;
        }
      }
      // }
    }
    return lock;
  };

  calculateScore = (data) => {
    console.log('data.upperDotsNumber : ' + JSON.stringify(data));
    console.log('data.lowerDotsNumber : ' + JSON.stringify(data));
    var total = 0;
    for (var i = 0; data.length > i; i++) {
      console.log(
        'data.upperDotsNumber typeof : ' + typeof data[i].upperDotsNumber,
      );
      console.log(
        'data.lowerDotsNumber typeof : ' + typeof data[i].lowerDotsNumber,
      );
      console.log('data.upperDotsNumber : ' + data[i].upperDotsNumber);
      console.log('data.lowerDotsNumber : ' + data[i].lowerDotsNumber);
      var uper = 0;
      var lower = 0;
      var totalUL = 0;
      uper += data[i].upperDotsNumber;
      lower += data[i].lowerDotsNumber;
      totalUL = uper + lower;
      total += totalUL;
      console.log('Total : ' + uper);
      console.log('Total : ' + lower);
      console.log('totalUL : ' + totalUL);
      console.log('Total : ' + total);
    }

    return total;
  };

 /*  startLeaveSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('leave', (win) => {
      console.log('Leave Data: ' + JSON.stringify(win.data[0]));
      this.setState({gameChart: win.data}, () => {
        if (win.data[0].Id == global.GameId) {
          showToast('Oppnent Leave The Game.You Won This Game');
          console.log('Leave GAME: ');
          this.props.navigation.navigate('MainMenuScreen');
        }
      });
    });
  }; */
  startLeaveSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('leave', async (win) => {
      console.log('Leave Data: ' + JSON.stringify(win.data[0]));


      this.setState({gameChart: win.data}, async () => {
        if (win.data[0].Id == global.GameId) {
          showToast('Oppnent Leave The Game.You Won This Game');
          console.log('Leave GAME: ');
          console.log('Leave GAME turnwinner: '+JSON.stringify(this.state.turnwinner));
          console.log(
            'Leave GAME this.state.userList.length: ' +
              this.state.userList.length +
              ' : UID : ' +
              global.UserId
              +' : Leave GAME this.state.turnwinner.length : ' +
              this.state.turnwinner.length,
          );
          // this.getUserList()
          // this.reload()
          if (this.state.userList.length <= 2) {
            if (this.state.turnwinner != undefined) {
              await this.winercall(this.state.turnwinner);
            }
            this.setState({gameEnd: true});
            // this.props.navigation.navigate('MainMenuScreen');
          }
        }
      });
    });
  };

  startWINSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('win', (win) => {
      console.log('Winner Data: ' + JSON.stringify(win.data[0]));
      this.setState({gameChart: win.data});
    });
  };

  /* getUserList = async () => {
    console.log('getUserList Call');
    console.log('getUserList Call' + global.GameId);

    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
    });
    let apiData = {
      endpoint: 'getGameUserAllDetail',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      console.log('USER LIST response: ' + JSON.stringify(response));
      console.log('USER LIST : ' + JSON.stringify(response.user[0].UserId));
      console.log('USER LIST global.UserId: ' + JSON.stringify(global.UserId));
      const newPData = [
        {
          name:
            response.user[0].UserId == global.UserId
              ? `${response.user[0].FirstName}`
              : `${response.user[1].FirstName}`,
          score:
            response.user[0].UserId == global.UserId
              ? response.user[0].Game_Points
              : response.user[1].Game_Points,
          dominoesLeft:
            response.user[0].UserId == global.UserId
              ? `${JSON.parse(response.user[0].Domino_Array).length}`
              : `${JSON.parse(response.user[1].Domino_Array).length}`,
          uid:
            response.user[0].UserId == global.UserId
              ? response.user[0].UserId
              : response.user[1].UserId,
        },
        {
          name:
            response.user[1].UserId == global.UserId
              ? `${response.user[0].FirstName}`
              : `${response.user[1].FirstName}`,
          score:
            response.user[1].UserId == global.UserId
              ? response.user[0].Game_Points
              : response.user[1].Game_Points,
          dominoesLeft:
            response.user[1].UserId == global.UserId
              ? `${JSON.parse(response.user[0].Domino_Array).length}`
              : `${JSON.parse(response.user[1].Domino_Array).length}`,
          uid:
            response.user[1].UserId == global.UserId
              ? response.user[0].UserId
              : response.user[1].UserId,
        },
      ];

      this.setState({
        playersData: newPData,
      });
    } else {
      let message = 'Something went wrong';
    }
  }; */

  getUserList = async () => {
    console.log('getUserList Call');
    console.log('getUserList Call' + global.GameId);

    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
    });
    let apiData = {
      endpoint: 'getGameUserAllDetail',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    if (response.status === 200) {
      console.log('USER LIST Stright Game : ' + JSON.stringify(response));
      console.log(
        'USER LIST Stright Game : ' + JSON.stringify(response.user[0].UserId),
      );
      console.log('USER LIST Stright Game : ' + JSON.stringify(global.UserId));
      console.log(
        'USER LIST Stright Game Domino_Array length 0 : ' +
          JSON.parse(response.user[0].Domino_Array).length,
      );
      console.log(
        'USER LIST Stright Game Domino_Array length 1 : ' +
          JSON.parse(response.user[1].Domino_Array).length,
      );
      var newUsers = [];
      var userList = [];
      const newPData = [
        {
          name:
            response.user[0].UserId == global.UserId
              ? `${response.user[0].FirstName}`
              : `${response.user[1].FirstName}`,
          score: 0,
          dominoesLeft:
            response.user[0].UserId == global.UserId
              ? `${JSON.parse(response.user[0].Domino_Array).length}`
              : `${JSON.parse(response.user[1].Domino_Array).length}`,
        },
        {
          name:
            response.user[1].UserId == global.UserId
              ? `${response.user[0].FirstName}`
              : `${response.user[1].FirstName}`,
          score: 0,
          dominoesLeft:
            response.user[1].UserId == global.UserId
              ? `${JSON.parse(response.user[0].Domino_Array).length}`
              : `${JSON.parse(response.user[1].Domino_Array).length}`,
        },
      ];

      for (var i = 0; response.user.length > i; i++) {
        var user = null;
        userList.push(response.user[i].UserId);
        console.log(
          'NEW USER ADDDEDD DATAAAA user length' + response.user.length,
        );
        console.log(
          'NEW USER ADDDEDD DATAAAA user length IIII' +
            i +
            ' USER ID : ' +
            global.UserId,
        );
        if (response.user[i].UserId == global.UserId) {
          user = {
            name: `${response.user[i].FirstName}`,
            // response.user[0].UserId == global.UserId
            //   ? `${response.user[0].FirstName}`
            //   : `${response.user[1].FirstName}`,
            score: 0,
            UserId: response.user[i].UserId,
            dominoesLeft: `${JSON.parse(response.user[i].Domino_Array).length}`,
            // response.user[0].UserId == global.UserId
            //   ? `${JSON.parse(response.user[0].Domino_Array).length}`
            //   : `${JSON.parse(response.user[1].Domino_Array).length}`,
          };
          newUsers.unshift(user);
          console.log('New USER FORRR IFFFFF : ' + JSON.stringify(newUsers));
        } else {
          user = {
            name: `${response.user[i].FirstName}`,
            score: 0,
            UserId: response.user[i].UserId,
            dominoesLeft: `${JSON.parse(response.user[i].Domino_Array).length}`,
          };
          newUsers.push(user);
          console.log('New USER FORRR ELSEEE : ' + JSON.stringify(newUsers));
        }
      }
      console.log('NEW USER ADDDEDD DATAAAA FOR OUT: ');
      console.log('NEW USER ADDDEDD DATAAAA 1: ' + JSON.stringify(newUsers));
      console.log('NEW USER ADDDEDD DATAAAA 2: ' + JSON.stringify(newPData));
      this.setState({
        playersData: newUsers, // newPData
        userList,
      });
    } else {
      let message = 'Something went wrong';
    }
  };

  _asignInitialDominoes = async () => {
    // var response = APICALL().
    console.log('GameId 111 Straight Type: ' + global.GameId);
    console.log('UserId 111 Straight Type: ' + global.admin);
    // var formData = new FormData()
    //   formData.append('GameId', global.GameId);
    //   formData.append('UserId', global.UserId);
    //   let apiData = {
    //     endpoint: 'domino',
    //     method: 'POST',
    //     body: formData
    //   }
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
    });
    let apiData = {
      endpoint: 'domino',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log('Respnse : ' + JSON.stringify(response));
    // var bornYardDices = this.state.bornYardDices;
    var bornYardDices = response.bornyard;
    console.log('Respnse bornYardDices: ' + JSON.stringify(bornYardDices));

    var player1Dominoes = [];
    //var player2Dominoes = [];
    player1Dominoes = response.domino;

    // var tmp = [];
    // while (player1Dominoes.length < 7) {
    //   tmp.push(bornYardDices.splice(Math.floor(Math.random() * bornYardDices.length - 1), 1)[0]);
    //   player1Dominoes.push(tmp.pop());
    // }

    // while (player2Dominoes.length < 7) {
    //   tmp.push(bornYardDices.splice(Math.floor(Math.random() * bornYardDices.length - 1), 1)[0]);
    //   player2Dominoes.push(tmp.pop());
    // }

    // this.setState({ player1Dominoes, player2Dominoes, bornYardDices })
    this.setState({player1Dominoes, bornYardDices: bornYardDices});
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  // _highlightUserTurn = () => {
  //   console.log('highlightturn user');
  //   if (this.state.activeUserTurn === 1) {
  //     this.setState({activeUserTurn: 2}, () => {
  //       this.oponentPlayerTurn();
  //     });
  //   } else {
  //     this.setState({activeUserTurn: 1});
  //   }
  // };

  _highlightUserTurn = () => {
    this.setState({activeUserTurn: 2, selectedDiceIndex: -1}, async () => {
      await this.setOldMainPanel();
      this.changeTurn(this.state.mainPanel);
    });
  };

  _checkDominoCompatibility = async (
    selectedDomino,
    index,
    fromBornyard = false,
  ) => {
    if (this.state.mainPanel.length < 2) {
      if (this.state.activeUserTurn === 1 || fromBornyard) {
        this.setState({selectedDiceIndex: index});
        let mainPanel = this.state.mainPanel;
        let player1Dominoes = this.state.player1Dominoes;
        let isCompatible = false;
        let endToBeAdded = 'right';
        let rotateValue = 0;
        let leftCompatible = false;
        let rightCompatible = false;
        var uid = global.UserId;
        await this.setOldMainPanel();
        if (mainPanel.length === 0) {
          if (
            selectedDomino.upperDotsNumber === selectedDomino.lowerDotsNumber
          ) {
            endToBeAdded = 'center';
            isCompatible = true;
          } else {
            isCompatible = false;
          }
        }

        if (mainPanel.length === 1) {
          if (selectedDomino.upperDotsNumber === mainPanel[0].upperDotsNumber) {
            selectedDomino.upperLocked = true;
            isCompatible = true;
            rotateValue = '-90deg';
          } else if (
            selectedDomino.upperDotsNumber === mainPanel[0].lowerDotsNumber
          ) {
            selectedDomino.upperLocked = true;
            isCompatible = true;
            rotateValue = '-90deg';
          } else if (
            selectedDomino.lowerDotsNumber === mainPanel[0].lowerDotsNumber
          ) {
            selectedDomino.lowerLocked = true;
            isCompatible = true;
            rotateValue = '90deg';
          } else if (
            selectedDomino.lowerDotsNumber === mainPanel[0].upperDotsNumber
          ) {
            selectedDomino.lowerLocked = true;
            isCompatible = true;
            rotateValue = '90deg';
          } else {
            isCompatible = false;
          }
        } else if (mainPanel.length > 1) {
          let leftEndDice = mainPanel[0];
          let rightEndDice = mainPanel[mainPanel.length - 1];
          if (leftEndDice.upperLocked) {
            console.log('left end upper locked');
            if (
              selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber
            ) {
              selectedDomino.upperLocked = true;
              mainPanel[0].lowerLocked = true;
              isCompatible = true;
              leftCompatible = true;
              endToBeAdded = 'left';
              rotateValue = '90deg';
            } else if (
              selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
            ) {
              selectedDomino.lowerLocked = true;
              mainPanel[0].lowerLocked = true;
              isCompatible = true;
              leftCompatible = true;
              endToBeAdded = 'left';
              rotateValue = '-90deg';
            }
          }
          if (leftEndDice.lowerLocked) {
            if (!isCompatible) {
              console.log('left end lower locked');
              if (
                selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber
              ) {
                selectedDomino.upperLocked = true;
                mainPanel[0].lowerLocked = true;
                isCompatible = true;
                leftCompatible = true;
                endToBeAdded = 'left';
                rotateValue = '90deg';
              } else if (
                selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[0].upperLocked = true;
                isCompatible = true;
                leftCompatible = true;
                endToBeAdded = 'left';
                rotateValue = '-90deg';
              }
            }
          }
          if (rightEndDice.upperLocked) {
            if (!isCompatible) {
              console.log('right end upper locked');
              if (
                selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber
              ) {
                selectedDomino.upperLocked = true;
                mainPanel[mainPanel.length - 1].lowerLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'right';
                rotateValue = '-90deg';
              } else if (
                selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[mainPanel.length - 1].lowerLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'right';
                rotateValue = '90deg';
              }
            }
          }
          if (rightEndDice.lowerLocked) {
            if (!isCompatible) {
              console.log('right end lower locked');
              if (
                selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
              ) {
                selectedDomino.upperLocked = true;
                mainPanel[mainPanel.length - 1].lowerLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'right';
                rotateValue = '-90deg';
              } else if (
                selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[mainPanel.length - 1].upperLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'right';
                rotateValue = '90deg';
              }
            }
          }
        }

        if (!fromBornyard) {
          if (!isCompatible) {
            setTimeout(() => {
              this.setState({selectedDiceIndex: -1});
            }, 1000);
          } else {
            selectedDomino.rotateValue = rotateValue;
            selectedDomino.endToBeAdded = endToBeAdded;
            selectedDomino.add = 1;
            selectedDomino.uid = uid;
            // console.log(leftCompatible + ', ' + rightCompatible)
            if (leftCompatible && rightCompatible) {
              showToast('Both ends are compatible');
            } else if (endToBeAdded === 'left') {
              mainPanel.unshift(selectedDomino);
            } else {
              mainPanel.push(selectedDomino);
            }
            player1Dominoes.splice(index, 1);
            this.setState({mainPanel, player1Dominoes}, async () => {
              await this.setTotlaBox(mainPanel, uid); //global.UserId
              this.changeTurn(mainPanel);
            });
            // this._highlightUserTurn()
          }
        } else {
          return isCompatible;
        }
      }
      this.setState({selectedDomino: null, selectedDiceIndex: -1});
    }
  };

  setTotlaBox = (mainPanel, UserId, from) => {
    if (mainPanel.length == 0) {
      console.log('mainPanel[length].endToBeAdded : ' + mainPanel.length);
      return;
    }
    var length = mainPanel.length - 1;
    console.log('MAin PAnel : ' + JSON.stringify(mainPanel));
    console.log('MAin PAnel : ' + length);
    console.log('MAin PAnel 1: ' + JSON.stringify(mainPanel[length]));
    console.log('MAin PAnel UserId: ' + UserId);
    console.log('MAin PAnel global.UserId: ' + global.UserId);
    var total = 0;
    var totalright = 0;
    var totalbottom = 0;
    var totalup = 0;
    var totalleft = 0;
    var Duid = 0;

    if (
      mainPanel.length == 1 &&
      mainPanel[length].endToBeAdded == 'center' &&
      mainPanel[length].add == 1
    ) {
      console.log('MAin PAnel 1 center: ' + JSON.stringify(mainPanel[length]));
      total += mainPanel[length].upperDotsNumber;
      total += mainPanel[length].lowerDotsNumber;
      Duid = mainPanel[length].uid;
      this.setState({totalboxcenter: total}, () => {
        this.setTotalPoint(Duid, total, from);
        console.log('MAin PAnel 1 center: ' + this.state.totalboxcenter);
      });
    }
    if (
      mainPanel[length].endToBeAdded == 'right' &&
      mainPanel[length].add == 1
    ) {
      if (
        mainPanel[length].upperLocked != undefined &&
        mainPanel[length].upperLocked == true
      ) {
        totalright = mainPanel[length].lowerDotsNumber;
        Duid = mainPanel[length].uid;
        console.log(
          'MAin Panel right number  : ' + mainPanel[length].lowerDotsNumber,
        );
        this.setState({totalboxright: totalright}, () => {
          this.setTotlaBoxTotal(Duid, totalright, from);
        });
        console.log('MAin Panel right lowerDotsNumber: ' + totalright);
      } else if (
        mainPanel[length].lowerLocked != undefined &&
        mainPanel[length].lowerLocked == true
      ) {
        totalright = mainPanel[length].upperDotsNumber;
        Duid = mainPanel[length].uid;
        console.log(
          'MAin Panel right number  : ' + mainPanel[length].upperDotsNumber,
        );
        this.setState({totalboxright: totalright}, () => {
          this.setTotlaBoxTotal(Duid, totalright, from);
        });
        console.log('MAin Panel right upperDotsNumber: ' + totalright);
      }
    }
    if (
      mainPanel[length].endToBeAdded == 'down' &&
      mainPanel[length].add == 1
    ) {
      if (
        mainPanel[length].upperLocked != undefined &&
        mainPanel[length].upperLocked == true
      ) {
        totalbottom = mainPanel[length].lowerDotsNumber;
        Duid = mainPanel[length].uid;
        console.log(
          'MAin Panel down number  : ' + mainPanel[length].lowerDotsNumber,
        );
        this.setState({totalboxbottom: totalbottom}, () => {
          this.setTotlaBoxTotal(Duid, totalbottom, from);
        });
        console.log('MAin Panel down lowerDotsNumber: ' + totalbottom);
      } else if (
        mainPanel[length].lowerLocked != undefined &&
        mainPanel[length].lowerLocked == true
      ) {
        totalbottom = mainPanel[length].upperDotsNumber;
        Duid = mainPanel[length].uid;
        console.log(
          'MAin Panel down number  : ' + mainPanel[length].upperDotsNumber,
        );
        this.setState({totalboxbottom: totalbottom}, () => {
          this.setTotlaBoxTotal(Duid, totalbottom, from);
        });
        console.log('MAin Panel down upperDotsNumber: ' + totalbottom);
      }
    }
    if (mainPanel[0].endToBeAdded == 'left' && mainPanel[0].add == 1) {
      if (
        mainPanel[0].upperLocked != undefined &&
        mainPanel[0].upperLocked == true
      ) {
        totalleft = mainPanel[0].lowerDotsNumber;
        Duid = mainPanel[0].uid;
        console.log('MAin Panel left number : ' + mainPanel[0].lowerDotsNumber);
        this.setState({totalboxleft: totalleft}, () => {
          this.setTotlaBoxTotal(Duid, totalleft, from);
        });
        console.log('MAin Panel left lowerDotsNumber: ' + totalleft);
      } else if (
        mainPanel[0].lowerLocked != undefined &&
        mainPanel[0].lowerLocked == true
      ) {
        totalleft = mainPanel[0].upperDotsNumber;
        Duid = mainPanel[0].uid;
        console.log('MAin Panel left number : ' + mainPanel[0].upperDotsNumber);
        this.setState({totalboxleft: totalleft}, () => {
          this.setTotlaBoxTotal(Duid, totalleft, from);
        });
        console.log('MAin Panel left upperDotsNumber: ' + totalleft);
      }
    }
    if (mainPanel[0].endToBeAdded == 'up' && mainPanel[0].add == 1) {
      if (
        mainPanel[0].upperLocked != undefined &&
        mainPanel[0].upperLocked == true
      ) {
        totalup = mainPanel[0].lowerDotsNumber;
        Duid = mainPanel[0].uid;
        console.log('MAin Panel up number : ' + mainPanel[0].lowerDotsNumber);
        this.setState({totalboxtop: totalup}, () => {
          this.setTotlaBoxTotal(Duid, totalup, from);
        });
        console.log('MAin Panel up lowerDotsNumber: ' + totalup);
      } else if (
        mainPanel[0].lowerLocked != undefined &&
        mainPanel[0].lowerLocked == true
      ) {
        totalup = mainPanel[0].upperDotsNumber;
        Duid = mainPanel[0].uid;
        console.log('MAin Panel up number : ' + mainPanel[0].upperDotsNumber);
        this.setState({totalboxtop: totalup}, () => {
          this.setTotlaBoxTotal(Duid, totalup, from);
        });
        console.log('MAin Panel up upperDotsNumber: ' + totalup);
      }
    }
    console.log('Tottoal : ' + total);
  };

  setTotlaBoxTotal = (UserId, newvalue, from) => {
    // var total =
    //   this.state.totalboxleft +
    //   this.state.totalboxright +
    //   this.state.totalboxtop +
    //   this.state.totalboxbottom;
    var totalboxcenter = this.state.totalboxcenter + newvalue;
    this.setState({totalboxcenter: totalboxcenter}, async () => {
      await this.setTotalPoint(UserId, totalboxcenter, from);

      console.log('Total  totalboxcenter : ' + this.state.totalboxcenter);
    });
  };

  setTotalPoint = async (UserId, total, from) => {
    console.log('UserId 123123 : ' + UserId);
    // if (UserId != undefined) {
    //   return;
    // }

    var check = await this.checkDividebyfive(total);
    console.log('setTotalPoint : ' + total);
    console.log('cehck : ' + check);
    console.log('UserId : ' + UserId);
    var pd = this.state.playersData;
    for (var i = 0; pd.length > i; i++) {
      console.log('this.state.playersData Before 1: ' + JSON.stringify(pd[i]));
      if (check == 0 && pd[i].uid == UserId) {
        console.log(
          'this.state.playersData Before 2: ' + JSON.stringify(pd[i]),
        );
        console.log('cehck : ' + check);
        console.log('UserId : ' + UserId);
        pd[i].score = total;
        console.log('this.state.playersData After 3: ' + JSON.stringify(pd[i]));
        if (from != 1) {
          await this.updatePoints(UserId, total);
        }
        this.setState({playersData: pd}, () => {
          this.setState({
            totalboxleft: 0,
            totalboxright: 0,
            totalboxtop: 0,
            totalboxbottom: 0,
            totalboxcenter: 0,
          });
          console.log(
            'this.state.playersData After 12: ' +
              JSON.stringify(this.state.playersData),
          );
        });
      }
      // for(this.state.playersData)
    }
    // }
  };

  updatePoints = async (userid, points) => {
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: userid,
      Points: points,
    });
    let apiData = {
      endpoint: 'updategamepoints',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log('Update API : ' + JSON.stringify(response));
  };

  checkDividebyfive = (total) => {
    var div = total % 5;
    return div;
  };

  toggleBornyard = (value) => {
    this.setState({boneYardOpen: value});
    Animated.timing(this.bornYardLeftOffset, {
      toValue: value,
      duration: 500,
    }).start();
  };

  _checkBornyardDominoCompatibility = async (item, index) => {
    let {bornYardDices, player1Dominoes} = this.state;
    // if (player1Dominoes.length < 8) {  // change 23/08/2021
      let isCompatible = await this._checkDominoCompatibility(
        item,
        index,
        true,
      );
      player1Dominoes.push(item);
      bornYardDices.splice(index, 1);
      this.setState({player1Dominoes, selectedDiceIndex: -1});
      this.toggleBornyard(0);
      if (isCompatible) {
        // this.toggleBornyard(0);
        // this._highlightUserTurn()
      }
    // }
  };

  _onBoneYardPress = () => {
    const {activeUserTurn} = this.state;
    if (activeUserTurn == 1) {
      if (this.state.boneYardOpen === 0) {
        this.toggleBornyard(1);
      } else {
        this.toggleBornyard(0);
      }
    }
  };

  selectDomino = (selectedDomino, selectedDiceIndex) => {
    const {mainPanel, activeUserTurn} = this.state;
    if (activeUserTurn == 1) {
      this.setState({selectedDomino}, () => {
        if (mainPanel.length < 2) {
          this._checkDominoCompatibility(selectedDomino, selectedDiceIndex);
        } else if (mainPanel.length > 1) {
          this.setState({selectedDomino, selectedDiceIndex});
        }
      });
    } else {
      console.log('wait');
    }
  };

  UpdateDomino = async () => {
    //UPDATE gameuser set Domino_Array = '[{"upperDotsNumber":4,"lowerDotsNumber":4},{"upperDotsNumber":4,"lowerDotsNumber":6},{"upperDotsNumber":1,"lowerDotsNumber":5},{"upperDotsNumber":1,"lowerDotsNumber":3},{"upperDotsNumber":2,"lowerDotsNumber":5},{"upperDotsNumber":2,"lowerDotsNumber":2},{"upperDotsNumber":0,"lowerDotsNumber":3}]' where GameId = 108 and UserId = 11
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
      domino: this.state.player1Dominoes,
      bornYard: this.state.bornYardDices,
    });
    let apiData = {
      endpoint: 'updateGameUserDomino',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log('Respnse : ' + JSON.stringify(response));
  };

  getNextId = ()=>{
    const {userList} = this.state
    console.log("USER LIST getNextId = "+userList)
    var idx = 0
    var nextidx = 0
    // for(var i=0;userList.length>i;i++){
      idx = userList.indexOf(global.UserId)
      console.log("USER LIST getNextId IDX= "+idx + " : USER ID : : "+global.UserId)
      console.log("USER LIST getNextId LENGTH= "+userList.length)
      if(userList.length-1 !== idx){
        nextidx = idx+1
      }
    console.log("USER LISTgetNextId  = "+userList[nextidx])
    console.log("USER LISTgetNextId  = "+userList[nextidx].UserId)
    return userList[nextidx]
    // }
  }

  changeTurn = async (domino,Skip = 0) => {
    await this.UpdateDomino();
    var id = this.getNextId()
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
      NextId: id,
      domino: domino,
      Skip: Skip,
    });
    let apiData = {
      endpoint: 'turnchange',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log('Respnse : ' + JSON.stringify(response));
  };

  setOldMainPanel = () => {
    var mainPanel = this.state.mainPanel;
    for (var i = 0; mainPanel.length > i; i++) {
      mainPanel[i].add = 0;
    }
    this.setState({mainPanel});
  };

  getLastIndex = (val) => {
    var mainpanel = this.state.mainPanel;
    var count = 0;
    if (mainpanel.length > 1) {
      for (var i = 0; mainpanel.length > i; i++) {
        console.log('I : ' + i + ' Val :' + JSON.stringify(mainpanel[i]));
        if (
          mainpanel[i].endToBeAdded != undefined &&
          mainpanel[i].endToBeAdded == val
        ) {
          count = i;
          break;
        } else if (mainpanel[i].endToBeAdded == 'center') {
          count = i;
        }
      }
    }
    console.log('IDXXX METHOD : ' + count);
    return count;
  };

  getLastIndexRev = (val) => {
    var mainpanel = this.state.mainPanel;
    var count = 0;
    var len = mainpanel.length - 1;
    if (mainpanel.length > 1) {
      for (var i = len; i > 0; i--) {
        console.log('I : ' + i + ' Val :' + JSON.stringify(mainpanel[i]));
        if (
          mainpanel[i].endToBeAdded != undefined &&
          mainpanel[i].endToBeAdded == val
        ) {
          count = i;
          break;
        } else if (mainpanel[i].endToBeAdded == 'center') {
          count = i;
        }
      }
    }
    console.log('IDXXX METHOD REV: ' + count);
    return count;
  };

  checkUpCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'up';
    let rotateValue = 0;
    var uid = global.UserId;
    await this.setOldMainPanel();

    var idx = this.getLastIndex('up');
    console.log('IDXX UPPPPPP VAL : ' + idx);
    let leftEndDice = mainPanel[idx];
    console.log('IDXX UPPPPPP leftEndDice: ' + JSON.stringify(leftEndDice));
    console.log(
      'IDXX UPPPPPP selectedDomino: ' + JSON.stringify(selectedDomino),
    );
    if (leftEndDice.upperLocked) {
      console.log('up end upper locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        console.log('up end upper locked 1');
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '180deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        console.log('up end upper locked 2');
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '0deg';
      }
    } else if (leftEndDice.lowerLocked) {
      console.log('up end lower locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber) {
        console.log('up end lower locked 1');
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '180deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        console.log('up end lower locked 2');
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        rotateValue = '0deg';
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '180deg';
        console.log('1');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '0deg';
        console.log('2');
      } else if (
        selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '180deg';
        console.log('3');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        rotateValue = '0deg';
        console.log('4');
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.add = 1;
      selectedDomino.uid = uid;
      if (endToBeAdded === 'up') {
        selectedDomino.endToBeAdded = endToBeAdded;
        mainPanel.unshift(selectedDomino);
      }
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes}, async () => {
        await this.setTotlaBox(mainPanel, uid);
        this.changeTurn(mainPanel);
      });
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null, selectedDiceIndex: -1});
    }
  };

  checkDownCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'down';
    let rotateValue = 0;
    await this.setOldMainPanel();
    var uid = global.UserId;
    var idx = this.getLastIndexRev('down');

    // let rightEndDice = mainPanel[mainPanel.length - 1];
    console.log('IDXX DOWNNNN VAL: ' + idx);
    let rightEndDice = mainPanel[idx];
    console.log('IDXX DOWNNNN leftEndDice: ' + JSON.stringify(rightEndDice));
    console.log(
      'IDXX UPPPPPP selectedDomino: ' + JSON.stringify(selectedDomino),
    );
    if (rightEndDice.upperLocked) {
      if (!isCompatible) {
        console.log('down end upper locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
          console.log('down end upper locked 1');
          selectedDomino.upperLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '0deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
        ) {
          console.log('down end upper locked 2');
          selectedDomino.lowerLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '180deg';
        }
      }
    } else if (rightEndDice.lowerLocked) {
      if (!isCompatible) {
        console.log('down end lower locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber) {
          console.log('down end lower locked 1');
          selectedDomino.upperLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '0deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
        ) {
          console.log('down end lower locked 2');
          selectedDomino.lowerLocked = true;
          mainPanel[idx].upperLocked = true;
          isCompatible = true;
          rotateValue = '180deg';
        }
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'down';
        rotateValue = '0deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'down';
        rotateValue = '180deg';
      } else if (
        selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'down';
        rotateValue = '0deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        endToBeAdded = 'down';
        rotateValue = '180deg';
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.endToBeAdded = endToBeAdded;
      selectedDomino.add = 1;
      selectedDomino.uid = uid;
      mainPanel.push(selectedDomino);
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes, selectedDiceIndex: -1}, () => {
        this.changeTurn(mainPanel);
        this.setTotlaBox(mainPanel, uid);
      });
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  checkLeftCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'left';
    let rotateValue = 0;
    var uid = global.UserId;
    await this.setOldMainPanel();

    var idx = this.getLastIndex('left');
    console.log('IDXX Down VAL: ' + idx);
    let leftEndDice = mainPanel[idx];
    console.log('IDXX Down leftEndDice: ' + JSON.stringify(leftEndDice));
    console.log(
      'IDXX UPPPPPP selectedDomino: ' + JSON.stringify(selectedDomino),
    );
    if (leftEndDice.upperLocked) {
      console.log('left end upper locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        console.log('left end upper locked 1');
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        console.log('left end upper locked 2');
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
      }
    } else if (leftEndDice.lowerLocked) {
      console.log('left end lower locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber) {
        console.log('left end lower locked 1');
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        console.log('left end lower locked 2');
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
        console.log('1');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
        console.log('2');
      } else if (
        selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
        console.log('3');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
        console.log('4');
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.add = 1;
      selectedDomino.uid = uid;
      if (endToBeAdded === 'left') {
        selectedDomino.endToBeAdded = endToBeAdded;
        mainPanel.unshift(selectedDomino);
      }
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes}, async () => {
        await this.setTotlaBox(mainPanel, uid);
        this.changeTurn(mainPanel);
      });
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null, selectedDiceIndex: -1});
    }
  };

  checkRightCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'right';
    let rotateValue = 0;
    await this.setOldMainPanel();
    var uid = global.UserId;
    var idx = this.getLastIndexRev('right');

    // let rightEndDice = mainPanel[idx];
    console.log('IDXX RIGHTTT VAL: ' + idx);
    let rightEndDice = mainPanel[idx];
    console.log('IDXX RIGHTTT leftEndDice: ' + JSON.stringify(rightEndDice));
    console.log(
      'IDXX UPPPPPP selectedDomino: ' + JSON.stringify(selectedDomino),
    );
    if (rightEndDice.upperLocked) {
      if (!isCompatible) {
        console.log('right end upper locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
          console.log('right end upper locked 1');
          selectedDomino.upperLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
        ) {
          console.log('right end upper locked 2');
          selectedDomino.lowerLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '90deg';
        }
      }
    } else if (rightEndDice.lowerLocked) {
      if (!isCompatible) {
        console.log('right end lower locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber) {
          console.log('right end lower locked 1');
          selectedDomino.upperLocked = true;
          mainPanel[idx].lowerLocked = true;
          isCompatible = true;
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
        ) {
          console.log('right end lower locked 2');
          selectedDomino.lowerLocked = true;
          mainPanel[idx].upperLocked = true;
          isCompatible = true;
          rotateValue = '90deg';
        }
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '90deg';
      } else if (
        selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[idx].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[idx].upperLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '90deg';
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.endToBeAdded = endToBeAdded;
      selectedDomino.add = 1;
      selectedDomino.uid = uid;
      mainPanel.push(selectedDomino);
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes, selectedDiceIndex: -1}, () => {
        this.changeTurn(mainPanel);
        this.setTotlaBox(mainPanel, uid);
      });
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  render() {
    var {
      playersData,
      player1Dominoes,
      player2Dominoes,
      mainPanel,
      mainPanelUp,
      mainPanelDown,
      activeUserTurn,
      nonActiveUser,
      selectedDiceIndex,
      bornYardDices,
      selectedDomino,
    } = this.state;
    let bornYardLeftOffset = this.bornYardLeftOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [140 + getWidth(), 30],
    });
    console.log(
      'Render This.state.playersData :: ' +
        JSON.stringify(this.state.playersData),
    );
    console.log('Render playersData :: ' + JSON.stringify(playersData));
    console.log(
      'Render playersData [0].score:: ' + JSON.stringify(playersData[0].score),
    );
    console.log(
      'Render playersData [1].score:: ' + JSON.stringify(playersData[1].score),
    );
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          {/* <View
            style={
              activeUserTurn === 2
                ? styles.oponentPlayerPanel_active
                : styles.oponentPlayerPanel
            }>
            <Text style={styles.playerNameText}>{playersData[1].name}</Text>
            <View style={styles.playerPanelValuesRow}>
              <Text style={styles.playerPanelLabel}>DOMINOES LEFT</Text>
              <Text style={styles.playerPanelValue}>
                {playersData[1].dominoesLeft}
              </Text>
            </View>
            <View style={styles.playerPanelValuesRow}>
              <Text style={styles.playerPanelLabel}>SCORE</Text>
              <Text style={styles.playerPanelValue}>
                {playersData[1].score}
              </Text>
            </View>
          </View> */}
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              top: 0,
              justifyContent: 'space-around',
              width: '100%',
            }}>
            {playersData.map((itm, idx) => {
              console.log('playersData MAP : ' + JSON.stringify(itm));
              return (
                itm.UserId !== global.UserId && (
                  <View
                    style={
                      // activeUserTurn === 2
                      nonActiveUser === itm.UserId
                        ? styles.oponentPlayerPanel_active
                        : styles.oponentPlayerPanel
                    }
                    // style={styles.oponentPlayerPanel}
                  >
                    {/* <Text style={styles.playerNameText}>{playersData[1].name}</Text> */}
                    <Text style={styles.playerNameText}>{itm.name}</Text>
                    <View style={styles.playerPanelValuesRow}>
                      <Text style={styles.playerPanelLabel}>DOMINOES </Text>
                      <Text style={styles.playerPanelValue}>
                        {/* {playersData[1].dominoesLeft} */}
                        {itm.dominoesLeft}
                      </Text>
                    </View>
                    <View style={styles.playerPanelValuesRow}>
                      <Text style={styles.playerPanelLabel}>SCORE</Text>
                      <Text style={styles.playerPanelValue}>
                        {/* {playersData[1].score} */}
                        {itm.score}
                      </Text>
                    </View>
                  </View>
                )
              );
            })}
          </View>
          <View
            style={
              activeUserTurn === 1 ? styles.selfPanel_active : styles.selfPanel
            }>
            <View
              style={{
                backgroundColor: '#28302d',
                paddingHorizontal: 10,
                borderRadius: 4,
                width: 170,
              }}>
              <Text style={styles.playerNameText}>{playersData[0].name}</Text>
              <View style={styles.playerPanelValuesRow}>
                <Text numberOfLines={1} style={styles.selfPanelLabel}>
                  DOMINOES LEFT
                </Text>
                <Text style={styles.selfPanelValue}>
                  {player1Dominoes.length}
                </Text>
              </View>
              <View style={styles.playerPanelValuesRow}>
                <Text numberOfLines={1} style={styles.selfPanelLabel}>
                  SCORE
                </Text>
                <Text style={styles.selfPanelValue}>
                  {playersData[0].score}
                </Text>
              </View>
              {/* <View style={styles.playerPanelValuesRow}>
                <Text numberOfLines={1} style={styles.selfPanelLabel}>
                  SCORE 2
                </Text>
                <Text style={styles.selfPanelValue}>
                  {playersData[0].score}
                </Text>
              </View> */}
            </View>
            {player1Dominoes.map((item, index) => {
              return (
                <Dice
                  onPress={() => this.selectDomino(item, index)}
                  upperDotsNumber={item.upperDotsNumber}
                  lowerDotsNumber={item.lowerDotsNumber}
                  key={'dice' + index}
                  selectedDiceIndex={selectedDiceIndex === index}
                  diceBorderColor={
                    selectedDiceIndex === index ? '#cc0000' : '#fff'
                  }
                  is_diceSelected={selectedDiceIndex === index}
                />
              );
            })}
          </View>
          <View style={[styles.boxtotal, {left: 20, bottom: 50}]}>
            <Text style={{color: '#d09320', fontWeight: 'bold'}}>
              {this.state.totalboxleft}
            </Text>
          </View>
          <View style={[styles.boxtotal, {left: 50, bottom: 50}]}>
            <Text style={{color: '#1f7b5d', fontWeight: 'bold'}}>
              {this.state.totalboxcenter}
            </Text>
          </View>
          <View style={[styles.boxtotal, {left: 80, bottom: 50}]}>
            <Text style={{color: '#d09320', fontWeight: 'bold'}}>
              {this.state.totalboxright}
            </Text>
          </View>
          <View style={[styles.boxtotal, {left: 50, bottom: 80}]}>
            <Text style={{color: '#d09320', fontWeight: 'bold'}}>
              {this.state.totalboxtop}
            </Text>
          </View>
          <View style={[styles.boxtotal, {left: 50, bottom: 20}]}>
            <Text style={{color: '#d09320', fontWeight: 'bold'}}>
              {this.state.totalboxbottom}
            </Text>
          </View>
          {activeUserTurn == 1 ? (
            <TouchableOpacity
              onPress={this._highlightUserTurn}
              style={styles.SkipButtonStyle}>
              <Text style={styles.SkipButtonTextStyle}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.SkipButtonDisebleStyle}>
              <Text style={styles.SkipButtonTextStyle}>Skip</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={this._onBoneYardPress}
            style={styles.bornYardStyle}>
            <Text style={styles.bornYardText}>Boneyard</Text>
            <Text style={styles.bornYardDicesText}>
              {this.state.bornYardDices.length}
            </Text>
          </TouchableOpacity>
          <View style={styles.gameBoard}>
            <View style={styles.centerlogoview}>
              <Image
                resizeMode={'contain'}
                style={styles.centerlogo}
                source={Images.boardcenterlogo1}
              />
            </View>
            <View
              style={{
                // flexDirection: 'row',
                alignItems: 'center',
                width: '20%',
                justifyContent: 'center',
                // flexWrap: 'wrap',
              }}>
              {selectedDomino &&
                mainPanel.length > 0 && ( // dhaval na pade 6 because bau array handel karava pade
                  <TouchableOpacity
                    onPress={this.checkUpCompatibility}
                    style={{
                      marginBottom: 8,
                      shadowColor: '#fff',
                      shadowOffset: {width: 0, height: 5},
                      shadowOpacity: 0.5,
                      elevation: 10,
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 0, 0, 0.2)',
                      // backgroundColor: 'rgba(0, 0, 0, 0.2)', //rgba(0, 0, 0, 0.2)
                      backgroundColor: 'gray',
                      borderRadius: 50,
                    }}
                  />
                )}
              {mainPanel.map((item, index) => {
                return (
                  item.endToBeAdded == 'up' && (
                    <Dice
                      upperDotsNumber={item.upperDotsNumber}
                      lowerDotsNumber={item.lowerDotsNumber}
                      endToBeAdded={'up'}
                      key={'dice' + index}
                      rotateValue={item.rotateValue}
                      mainPanel={true}
                      length={mainPanel.length}
                    />
                  )
                );
              })}
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '45%',
                  justifyContent: 'flex-end',
                  // flexWrap: 'wrap',
                }}>
                {selectedDomino && mainPanel.length > 1 && (
                  <TouchableOpacity
                    onPress={this.checkLeftCompatibility}
                    style={{
                      shadowColor: '#fff',
                      shadowOffset: {width: 0, height: 5},
                      shadowOpacity: 0.5,
                      elevation: 10,
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 0, 0, 0.2)',
                      // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'gray',
                      borderRadius: 50,
                    }}
                  />
                )}
                {mainPanel.map((item, index) => {
                  return (
                    item.endToBeAdded == 'left' && (
                      // item.endToBeAdded != 'down' && (
                      <Dice
                        upperDotsNumber={item.upperDotsNumber}
                        lowerDotsNumber={item.lowerDotsNumber}
                        item={item}
                        key={'dice' + index}
                        rotateValue={item.rotateValue}
                        mainPanel={true}
                        length={mainPanel.length}
                      />
                    )
                  );
                })}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '6%',
                  justifyContent: 'center',
                  // flexWrap: 'wrap',
                }}>
                {mainPanel.map((item, index) => {
                  return (
                    item.endToBeAdded == 'center' && (
                      // item.endToBeAdded != 'down' && (
                      <Dice
                        upperDotsNumber={item.upperDotsNumber}
                        lowerDotsNumber={item.lowerDotsNumber}
                        item={item}
                        key={'dice' + index}
                        rotateValue={item.rotateValue}
                        mainPanel={true}
                        length={mainPanel.length}
                      />
                    )
                  );
                })}
              </View>
              {/* {mainPanelUp.map((item, index) => {
                return (
                  <Dice
                    upperDotsNumber={item.upperDotsNumber}
                    lowerDotsNumber={item.lowerDotsNumber}
                    key={'dice' + index}
                    rotateValue={item.rotateValue}
                    mainPanel={true}
                    length = {mainPanel.length}
                  />
                );
              })} */}
              <View
                style={{
                  flexDirection: 'row',
                  width: '45%',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                {/* {mainPanelDown.map((item, index) => {
                return (
                  <Dice
                    upperDotsNumber={item.upperDotsNumber}
                    lowerDotsNumber={item.lowerDotsNumber}
                    key={'dice' + index}
                    rotateValue={item.rotateValue}
                    mainPanel={true}
                    length = {mainPanel.length}
                  />
                );
              })} */}
                {mainPanel.map((item, index) => {
                  return (
                    item.endToBeAdded == 'right' && (
                      // item.endToBeAdded != 'down' && (
                      <Dice
                        upperDotsNumber={item.upperDotsNumber}
                        lowerDotsNumber={item.lowerDotsNumber}
                        item={item}
                        key={'dice' + index}
                        rotateValue={item.rotateValue}
                        mainPanel={true}
                        length={mainPanel.length}
                      />
                    )
                  );
                })}

                {selectedDomino && mainPanel.length > 1 && (
                  <TouchableOpacity
                    onPress={this.checkRightCompatibility}
                    style={{
                      shadowColor: '#fff',
                      shadowOffset: {width: 0, height: 5},
                      shadowOpacity: 0.5,
                      elevation: 10,
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 0, 0, 0.2)',
                      // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'gray',
                      borderRadius: 50,
                    }}
                  />
                )}
              </View>
            </View>
            {/* <View style={styles.gameBoard}> */}

            {/* </View> */}
            {/* <View style={styles.gameBoard}> */}
            <View
              style={{
                // flexDirection: 'row',
                alignItems: 'center',
                width: '25%',
                justifyContent: 'center',
                // flexWrap: 'wrap',
              }}>
              {mainPanel.map((item, index) => {
                return (
                  item.endToBeAdded == 'down' && (
                    <Dice
                      upperDotsNumber={item.upperDotsNumber}
                      lowerDotsNumber={item.lowerDotsNumber}
                      item={item}
                      key={'dice' + index}
                      rotateValue={item.rotateValue}
                      mainPanel={true}
                      length={mainPanel.length}
                    />
                  )
                );
              })}
              {selectedDomino && mainPanel.length > 0 && (
                <TouchableOpacity
                  onPress={this.checkDownCompatibility}
                  style={{
                    marginTop: 8,
                    shadowColor: '#fff',
                    shadowOffset: {width: 0, height: 5},
                    shadowOpacity: 0.5,
                    elevation: 10,
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 0, 0, 0.2)',
                    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'gray',
                    borderRadius: 50,
                  }}
                />
              )}
            </View>
            <Animated.View
              style={[styles.bornYardBoardStyle, {left: bornYardLeftOffset}]}>
              <ImageBackground
                source={Images.woodenBackground}
                imageStyle={styles.bornYardBGImageStyle}
                style={styles.bornYardBoardStyle}>
                {bornYardDices.map((item, index) => {
                  return (
                    <Dice
                      onPress={() =>
                        this._checkBornyardDominoCompatibility(item, index)
                      }
                      key={'dice' + index}
                      marginHorizontal={10}
                      marginTop={20}
                      bornYard={true}
                    />
                  );
                })}
              </ImageBackground>
            </Animated.View>
          </View>
        </ImageBackground>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.gameEnd}
          onRequestClose={() => {
            this.setState({gameEnd: false});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ImageBackground
                source={Images.winanim}
                style={styles.imageBackground}>
                {this.state.gameChart != undefined &&
                this.state.gameChart.length > 0 &&
                this.state.gameChart[0].Points > 0 ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.modalText}>User Winner</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <Text style={styles.textStyle}>User Name </Text>
                      <Text style={styles.textStyle}>Point </Text>
                    </View>

                    {this.state.gameChart.map((item, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <Text style={styles.textStyle}>
                              {item.FirstName}{' '}
                            </Text>
                            <Text style={styles.textStyle}>
                              {item.LastName}{' '}
                            </Text>
                          </View>
                          <Text style={styles.textStyle}>{item.Points} </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View>
                    <Text style={styles.modalText}>Match Tie</Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Pressable
                    style={[styles.button, {backgroundColor: '#894f25'}]}
                    onPress={() => {
                      this.gotohome(0);
                    }}>
                    <Text style={styles.textStyle}>OK</Text>
                  </Pressable>
                </View>
              </ImageBackground>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default GameBoard;
