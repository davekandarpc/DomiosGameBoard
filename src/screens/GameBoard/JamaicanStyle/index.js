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
  Modal,
  BackHandler,
  Pressable,
  Alert,
} from 'react-native';
import {Images} from '../../../common/Images';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import {Dice} from '../../../components/Dice';
import {getHeight, getWidth,updateState} from '../../../common/functions';
import {showToast} from '../../../common/Toaster';
import {APICALL} from '../../../common/ApiCaller';
import {apiEndpoint} from '../../../common/functions';
import io from 'socket.io-client';

export class JamaicanStyle extends Component {

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
      bornYardDices: [
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 0,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 1,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 1,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 2,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 2,
        },
        {
          upperDotsNumber: 2,
          lowerDotsNumber: 2,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 3,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 3,
        },
        {
          upperDotsNumber: 2,
          lowerDotsNumber: 3,
        },
        {
          upperDotsNumber: 3,
          lowerDotsNumber: 3,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 4,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 4,
        },
        {
          upperDotsNumber: 2,
          lowerDotsNumber: 4,
        },
        {
          upperDotsNumber: 3,
          lowerDotsNumber: 4,
        },
        {
          upperDotsNumber: 4,
          lowerDotsNumber: 4,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 2,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 3,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 4,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 5,
          lowerDotsNumber: 5,
        },
        {
          upperDotsNumber: 0,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 1,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 2,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 3,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 4,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 5,
          lowerDotsNumber: 6,
        },
        {
          upperDotsNumber: 6,
          lowerDotsNumber: 6,
        },
      ],
      gameEnd: false,
      backGame: false,
      mainPanel: [],
      activeUserTurn: 0,
      nonActiveUser: 0,
      match: 0,
      selectedDiceIndex: -1,
      selectedDomino: null,
      userList:[],
      turnwinner: [],
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    this.backHandel();
    this.setAdminUser();
    this.startTurnSocket();
    this.startWINSocket();
    this.startLeaveSocket();
    this.getUserList();
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
          onPress: () => this.exitGame(2),
          style: 'cancel',
        },
        // {text: 'leave this page', onPress: () => this.goBack()},
        {text: 'leave this gane', onPress: () => this.exitGame(1)},
      ],
      {cancelable: false},
    );
    return true;
  };

  backAction = () => {
    this.setState({backGame: true});
  };

  /* startLeaveSocket = () => {
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

  startTurnSocket = () => {
    this.socket = io(apiEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
    this.socket.on('turn', (turn) => {
      console.log('turn : socket' + JSON.stringify(turn));
      var winner = false;
      var nonActiveUser = 0;
      console.log('Board LEngth ::: ' + turn.winner.board.length);
      if (turn.winner.board.length > 1) {
        var winner = this.checkWinner(turn.winner);
      }
      this.setState({turnwinner: turn.winner})
      console.log('Winner Game : ' + winner);
      if (turn.winner.user1.length < 2) {
        this.winercall(turn.winner);
      } else if (turn.winner.user2.length < 2) {
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
            } else {
              this.winercall(turn.winner);
              this.setState({mainPanel: turn.domino});
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
        }
        console.log('User Winner 1 : ' + winpoint);
      } else if (user1Total > user2Total) {
        // this.winApi(winpoint);
        winpoint = user1Total - user2Total;
        if (userInfo == 'user2') {
          winuser = 2;
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
      console.log('USER LIST : ' + JSON.stringify(response.user[0].UserId));
      console.log('USER LIST : ' + JSON.stringify(global.UserId));
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

  _asignInitialDominoes = async () => {
    console.log('GameId 111 Block Type : ' + global.GameId);
    console.log('UserId 111 Block Type : ' + global.UserId);
    // var formData = new FormData()
    //   formData.append('GameId', global.GameId);
    //   formData.append('UserId', global.UserId);
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

    var player1Dominoes = [];
    //var player2Dominoes = [];
    player1Dominoes = response.domino;
    //player2Dominoes = response.domino
    var tmp = [];
    // while (player1Dominoes.length < 7) {
    //   tmp.push(bornYardDices.splice(Math.floor(Math.random() * bornYardDices.length - 1), 1)[0]);
    //   player1Dominoes.push(tmp.pop());
    // }

    // while (player2Dominoes.length < 7) {
    //   tmp.push(bornYardDices.splice(Math.floor(Math.random() * bornYardDices.length - 1), 1)[0]);
    //   player2Dominoes.push(tmp.pop());
    // }

    // this.setState({ player1Dominoes, player2Dominoes, bornYardDices })
    this.setState({player1Dominoes, bornYardDices});
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  _highlightUserTurn = () => {
    this.setState({activeUserTurn: 2, selectedDiceIndex: -1}, () => {
      this.changeTurn(this.state.mainPanel);
    });
  };

  _checkDominoCompatibility = (selectedDomino, index, fromBornyard = false) => {
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
        if (mainPanel.length === 0) {
          if (
            selectedDomino.upperDotsNumber === selectedDomino.lowerDotsNumber
          ) {
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
            // console.log(leftCompatible + ', ' + rightCompatible)
            if (leftCompatible && rightCompatible) {
              showToast('Both ends are compatible');
            } else if (endToBeAdded === 'left') {
              mainPanel.unshift(selectedDomino);
            } else {
              mainPanel.push(selectedDomino);
            }
            player1Dominoes.splice(index, 1);
            this.setState(
              {mainPanel, player1Dominoes, selectedDiceIndex: -1},
              () => {
                this.changeTurn(mainPanel);
              },
            );
            // this._highlightUserTurn()
          }
        } else {
          return isCompatible;
        }
      }
      this.setState({selectedDomino: null});
    }
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
      if (isCompatible) {
        this.toggleBornyard(0);
        // this._highlightUserTurn()
      }
    // }
  };

  _onBoneYardPress = () => {
    if (this.state.boneYardOpen === 0) {
      this.toggleBornyard(1);
    } else {
      this.toggleBornyard(0);
    }
  };

  selectDomino = (selectedDomino, selectedDiceIndex) => {
    const {mainPanel, activeUserTurn} = this.state;
    if (activeUserTurn == 1) {
      this.setState({selectedDomino}, () => {
        console.log('main panal===> ' + mainPanel.length);
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

  checkLeftCompatibility = (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'left';
    let rotateValue = 0;

    let leftEndDice = mainPanel[0];
    if (leftEndDice.upperLocked) {
      console.log('left end upper locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
      }
    } else if (leftEndDice.lowerLocked) {
      console.log('left end lower locked');
      if (selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[0].upperLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === leftEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
        console.log('1');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
        console.log('2');
      } else if (
        selectedDomino.upperDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[0].lowerLocked = true;
        isCompatible = true;
        rotateValue = '90deg';
        console.log('3');
      } else if (
        selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[0].upperLocked = true;
        isCompatible = true;
        rotateValue = '-90deg';
        console.log('4');
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      if (endToBeAdded === 'left') {
        mainPanel.unshift(selectedDomino);
      }
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes}, () => {
        this.changeTurn(mainPanel);
      });
      // this._highlightUserTurn()
      //this.selectDomino(selectedDomino,index)
    }
    if (isCompatible) {
      this.setState({selectedDomino: null, selectedDiceIndex: -1});
    }
  };

  checkRightCompatibility = (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.mainPanel;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'right';
    let rotateValue = 0;

    let rightEndDice = mainPanel[mainPanel.length - 1];
    if (rightEndDice.upperLocked) {
      if (!isCompatible) {
        console.log('right end upper locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
          selectedDomino.upperLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          rotateValue = '90deg';
        }
      }
    } else if (rightEndDice.lowerLocked) {
      if (!isCompatible) {
        console.log('right end lower locked');
        if (selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber) {
          selectedDomino.upperLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].upperLocked = true;
          isCompatible = true;
          rotateValue = '90deg';
        }
      }
    } else {
      console.log('un lockedd');
      if (selectedDomino.upperDotsNumber === rightEndDice.lowerDotsNumber) {
        selectedDomino.upperLocked = true;
        mainPanel[mainPanel.length - 1].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[mainPanel.length - 1].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '90deg';
      } else if (
        selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[mainPanel.length - 1].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[mainPanel.length - 1].upperLocked = true;
        isCompatible = true;
        endToBeAdded = 'right';
        rotateValue = '90deg';
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      mainPanel.push(selectedDomino);
      player1Dominoes.splice(index, 1);
      this.setState({mainPanel, player1Dominoes, selectedDiceIndex: -1}, () => {
        this.changeTurn(mainPanel);
      });
      // this._highlightUserTurn()
      //this.selectDomino(selectedDomino,index)
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  gotohome = async (val) => {
    var header = {'Content-Type': 'application/json'};
    var leave = 0
    if(val ==1 ){
      leave = 1
    }
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
      Leave : leave
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
        updateState(global.UserId,1)
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

  render() {
    const {
      playersData,
      player1Dominoes,
      player2Dominoes,
      mainPanel,
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
                flexDirection: 'row',
                width: '80%',
                justifyContent: 'center',
                flexWrap: 'wrap',
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
              {mainPanel !== null &&
                mainPanel.map((item, index) => {
                  return (
                    <Dice
                      upperDotsNumber={item.upperDotsNumber}
                      lowerDotsNumber={item.lowerDotsNumber}
                      key={'dice' + index}
                      rotateValue={item.rotateValue}
                      mainPanel={true}
                    />
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.backGame}
          onRequestClose={() => {
            // this.setState({modalVisible: false});
            // Alert.alert('Modal has been closed.');
            // setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are You Sure You Want to exit Game ?
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Pressable
                  style={[styles.button, {backgroundColor: 'red '}]}
                  onPress={() => {
                    this.exitGame(2);
                  }}>
                  <Text style={styles.textStyle}>No</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    this.exitGame(1);
                  }}>
                  <Text style={styles.textStyle}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default JamaicanStyle;
