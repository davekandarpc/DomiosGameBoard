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
      mainDomino: [],
      player1Dominoes: [],
      player2Dominoes: [],
      maintrain: [],
      maxicantrain: [],
      player1train: [],
      player2train: [],
      bornYardDices: [],
      gameEnd: false,
      backGame: false,
      mainPanel: [],
      activeUserTurn: 0,
      nonActiveUser: 0,
      match: 0,
      selectedDiceIndex: -1,
      selectedDomino: null,
      userblockUpdate: [
        {
          userblock: 0,
          userblockid: 0,
          usergameblock: 0,
        },
        {
          userblock: 0,
          userblockid: 0,
          usergameblock: 0,
        },
      ],
      blockBornYard: false,
      userList: [],
      userDominoTrain: [],
      turnwinner: [],
      turnChangeData: [],
    };
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    await this.getUserList();
    await this._asignInitialDominoes();
    await this.backHandel();
    await this.setAdminUser();
    await this.startWINSocket();
    await this.startLeaveSocket();
    console.log('GameId 111 : ');
    await this.startTurnSocket();
    this.setToEnd();
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
    console.log('gotohome Response : ' + JSON.stringify(response));
    // if (response.status == 200) {
      this.props.navigation.navigate('MainMenuScreen');
    // }
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
    var turnChangeData = this.state.turnChangeData
    for(var i =0 ;turnChangeData.length > i ;i++){
      if(turnChangeData[i].UserId == global.UserId){
        turnChangeData[i].leave = true
      }
    }
    console.log("exitGame turnChangeData: "+JSON.stringify(turnChangeData))
    this.setState({turnChangeData},()=>{
      if (val == 2) {
        this.setState({backGame: false});
      } else {
        this.setState({backGame: false}, async () => {
          var uStatus = await updateState(global.UserId, 1);
          if (uStatus.status == 200) {
            if (this.state.activeUserTurn === 1) {
              console.log('Exit Game Cahnge IFFF : ' + this.state.activeUserTurn);
              await this.changeTurn(turnChangeData);
              await this.gotohome(1);
            } else {
              console.log(
                'Exit Game Cahnge ELSEE : ' + this.state.activeUserTurn,
              );
              await this.changeTurn(turnChangeData, 1);
              await this.gotohome(1);
            }
          }
          uStatus = await updateState(global.UserId, 1);
          console.log('uStatus : ' + JSON.stringify(uStatus));
        });
      }
    })
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
    await this.setFirstTurn(response.data);
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
      await this.getUserList();
      // console.log(
      //   'turn : socket Bornyard_Array' + JSON.stringify(turn.Bornyard_Array),
      // );
      // console.log('Board LEngth ::: ' + turn.winner.board.length);
      // console.log('Board winner ::: ' + JSON.stringify(turn));
      this.setState({blockBornYard: false, mainDomino: turn.domino});
      var userblock = this.state.userblock;
      var userblockid = this.state.userblockid;
      var usergameblock = this.state.usergameblock;
      var usergameblockUpdate = this.state.userblockUpdate;
      var winner = false;
      var nonActiveUser = 0;
      var userDominoTrain = this.state.userDominoTrain;

      console.log(
        'usergameblockUpdate : ' + JSON.stringify(usergameblockUpdate),
      );
      this.setState({turnwinner: turn.winner})
      if (turn.winner.board != undefined && turn.winner.board.length > 1) {
        var bornYard = turn.Bornyard_Array;
        var winner = this.checkWinner(turn.winner, bornYard);
        // if(bornYard == 0 && check == true){
        //   winner = true
        // }
      }


      if (turn.Bornyard_Array.length > 0) {
        this.setState({bornYardDices: turn.Bornyard_Array}, () => {
          // console.log('bornYardDices : ' + this.state.bornYardDices);
          // console.log(
          //   'bornYardDices length : ' + this.state.bornYardDices.length,
          // );
          // console.log(
          //   'bornYardDices typeof : ' + typeof this.state.bornYardDices,
          // );
        });
      }
      // console.log('Winner Game : ' + winner);
      if (turn.winner.user1.length == 0) {
        this.winercall(turn.winner);
      } else if (turn.winner.user2.length == 0) {
        this.winercall(turn.winner);
      } else {
        // if (winner == false) {
        for (var i = 0; turn.data.length > i; i++) {
          console.log('nonActiveUser Turn : ' + turn.data[i].Turn);
          if (turn.data[i].Turn == 1) {
            nonActiveUser = turn.data[i].UserId;
            console.log('IFFF nonActiveUser : ' + nonActiveUser + ' : I :' + i);
          }
          console.log(
            'usergameblockUpdate LOOOPPPP  111 : ' +
              JSON.stringify(usergameblockUpdate),
          );
          console.log(
            'usergameblockUpdate LOOOPPPP  22222 : ' +
              usergameblockUpdate[0].userblock,
          );
          if (turn.data[i].UserId == global.UserId) {
            console.log(
              'IFFF turn.data[i].IsUserBlock : ' +
                JSON.stringify(turn.data[i]) +
                '  GLOBAL ID : ' +
                global.UserId,
            );
            if (turn.data[i].IsUserBlock == 1) {
              console.log('GLobal ID IFFFF 1: ' + global.UserId);
              usergameblockUpdate[0].userblock = 1;
              usergameblockUpdate[0].userblockid = turn.data[i].UserId;
              usergameblockUpdate[0].usergameblock = 1;
              // this.setState({userblock,userblockid,usergameblock});
              // this.tempDomnoSet(turn,i,userblock,userblockid,usergameblock)
              // break;
            } else if (turn.data[i].IsUserBlock == 0) {
              console.log('GLobal ID ELSEEE 1: ' + global.UserId);
              usergameblockUpdate[0].userblock = 0;
              usergameblockUpdate[0].userblockid = 0;
              usergameblockUpdate[0].usergameblock = 0;
              // this.setState({userblock,userblockid,usergameblock});
            }
          }
          if (turn.data[i].UserId != global.UserId) {
            console.log(
              'ELSEEE IFFF turn.data[i].IsUserBlock : ' +
                JSON.stringify(turn.data[i]) +
                '  GLOBAL ID : ' +
                global.UserId,
            );
            if (turn.data[i].IsUserBlock == 1) {
              console.log('GLobal ID IFFFF 2: ' + global.UserId);
              usergameblockUpdate[1].userblock = 2;
              usergameblockUpdate[1].userblockid = turn.data[i].UserId;
              usergameblockUpdate[1].usergameblock = 2;
              // this.setState({userblock,userblockid,usergameblock});
              // this.tempDomnoSet(turn,i,userblock,userblockid,usergameblock)
              // break;
            } else if (turn.data[i].IsUserBlock == 0) {
              console.log('GLobal ID ELSEEE 2: ' + global.UserId);
              usergameblockUpdate[1].userblock = 0;
              usergameblockUpdate[1].userblockid = 0;
              usergameblockUpdate[1].usergameblock = 0;
            }
          }
          for (var j = 0; userDominoTrain.length > j; j++) {
            if (userDominoTrain[j].UserId == turn.data[i].UserId) {
              var data = {
                userblock: 0,
                userblockid: 0,
                usergameblock: 0,
              };
              if (turn.data[i].IsUserBlock == 1) {
                if (turn.data[i].UserId == global.UserId) {
                  data = {
                    userblock: 1,
                    userblockid: turn.data[i].UserId,
                    usergameblock: 1,
                  };
                } else if (turn.data[i].UserId != global.UserId) {
                  data = {
                    userblock: 2,
                    userblockid: turn.data[i].UserId,
                    usergameblock: 2,
                  };
                }
              }
            }
            userDominoTrain[j].userblockUpdate = data;
          }
          console.log("userDominoTrain userblockUpdate: "+JSON.stringify(userDominoTrain))
          this.setState({userDominoTrain})

          // this.setState({userblock, userblockid, usergameblock}, () => {
          this.setState({userblockUpdate: usergameblockUpdate}, () => {
            console.log('GLobal ID userblock: ' + userblock);
            console.log('GLobal ID userblockid: ' + userblockid);
            console.log('GLobal ID usergameblock: ' + usergameblock);

            if (
              turn.data[i].UserId == global.UserId &&
              turn.data[i].Turn == 1
            ) {
              var sid = turn.data[i].UserId;
              var st = turn.data[i].Turn;
              // console.log('turn : socket User ID : ' + JSON.stringify(sid));
              // console.log('turn : socket User ID : ' + JSON.stringify(st));
              if (winner == false) {
                this.setState(
                  {
                    activeUserTurn: 1,
                    userblock,
                    userblockid,
                    usergameblock,
                    //  mainPanel: turn.domino
                  },
                  () => {
                    console.log('setDomino  0');
                    this.setDomino(turn.domino);
                  },
                );
              } else {
                this.winercall(turn.winner);
                console.log('setDomino  1');
                this.setState(
                  {
                    userblock,
                    userblockid,
                    usergameblock,
                  },
                  () => {
                    this.setDomino(turn.domino);
                  },
                );
                // this.setState({mainPanel: turn.domino});
              }
            } else if (
              turn.data[i].UserId == global.UserId &&
              turn.data[i].Turn == 0
            ) {
              // console.log("turn.data[i].IsUserBlock "+JSON.stringify(turn.data[i].IsUserBlock))
              // console.log("turn.data[i].UserId "+turn.data[i].UserId)

              if (winner == false) {
                this.setState(
                  {
                    activeUserTurn: 2,
                    userblock,
                    userblockid,
                    usergameblock,
                    //  mainPanel: turn.domino
                  },
                  () => {
                    console.log('setDomino  2');
                    this.setDomino(turn.domino);
                  },
                );
              } else {
                this.winercall(turn.winner);
                console.log('setDomino  3');
                this.setState(
                  {
                    userblock,
                    userblockid,
                    usergameblock,
                  },
                  () => {
                    this.setDomino(turn.domino);
                  },
                );
                // this.setState({mainPanel: turn.domino});
              }
            }
          });
          this.setState({nonActiveUser},()=>{
            this.setState({userDominoTrain})
          });
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


      // if(turn.)
    });
  };

  setDomino = async (mainBoard) => {
    if (mainBoard != null) {
      if (mainBoard.length > 0) {
        var dominoLength = mainBoard.length;
        dominoLength -= 1;
        var userDominoTrain = this.state.userDominoTrain;
        var maintrain = this.state.maintrain;
        var player1train = this.state.player1train;
        var player2train = this.state.player2train;
        var maxicantrain = this.state.maxicantrain;
        var turnChangeData = this.state.turnChangeData;
        console.log('Set Domino global.UserId: ' + global.UserId);
        console.log('Set Domino UID: ' + mainBoard[dominoLength].uid);
        console.log('Set Domino maintrain Length: ' + maintrain.length);
        console.log('Set Domino maintrain: ' + JSON.stringify(maintrain));
        console.log('Set Domino mainBoard: ' + JSON.stringify(mainBoard));
        console.log(
          'Set Domino mainBoard INdex DOmino : ' +
            JSON.stringify(mainBoard[dominoLength]) +
            'UserId: ' +
            global.UserId,
        );
        if (mainBoard[dominoLength].add == 1) {
          if (
            mainBoard[dominoLength].endToBeAdded == 'main' &&
            mainBoard[dominoLength].uid != global.UserId
          ) {
            // if (maintrain.length < 1) {
            //   this.setState({maintrain: mainBoard[dominoLength]},()=>{
            //     console.log('IFFFF : ' + JSON.stringify(maintrain));
            //   });
            // } else {
            maintrain.push(mainBoard[dominoLength]);
            this.setState({maintrain,turnChangeData:maintrain});
            // }
          } else if (mainBoard[dominoLength].endToBeAdded == 'user') {
            console.log(
              'userDominoTrain : ' +
                JSON.stringify(userDominoTrain) +
                ' : USER ID : ' +
                global.UserId,
            );
            for (var i = 0; userDominoTrain.length > i; i++) {
              console.log(
                'userDominoTrain : ' + userDominoTrain[i] + ': I :' + i,
              );
              if(mainBoard[i].leave == true){
                userDominoTrain[i].leave = mainBoard[i].leave
              }
              if (mainBoard[dominoLength].from == 1) {
                if (mainBoard[dominoLength].uid == userDominoTrain[i].UserId) {
                  var newData = userDominoTrain[i].DominoTrian;
                  newData.push(mainBoard[dominoLength]);
                  userDominoTrain[i].DominoTrian = newData;
                }
                // if ( mainBoard[dominoLength].uid != userDominoTrain[i].UserId ){
                // }else if(mainBoard[dominoLength].uid == userDominoTrain[i].UserId){

                // }
              }
              else if (mainBoard[dominoLength].from == 2){
                if (mainBoard[dominoLength].uid == userDominoTrain[i].UserId) {
                  var newData = userDominoTrain[i].DominoTrian;
                  newData.push(mainBoard[dominoLength]);
                  userDominoTrain[i].DominoTrian = newData;
                }
              }
            }
            this.setState({userDominoTrain,turnChangeData:userDominoTrain}, () => {
              console.log(
                'userDominoTrain NEWWWWWWW: ' + JSON.stringify(userDominoTrain),
              );
            });
            console.log(
              'mainBoard[dominoLength] user uid: ' +
                JSON.stringify(mainBoard[dominoLength].uid),
            );
            console.log(
              'mainBoard[dominoLength] global.UserId: ' + global.UserId,
            );
            // if (
            //   mainBoard[dominoLength].from == 1 &&
            //   mainBoard[dominoLength].uid != global.UserId &&
            //   mainBoard[dominoLength].add == 1
            // ) {
            //   console.log('mainBoard[dominoLength] IFFFF 1 ');
            //   if (
            //     mainBoard[dominoLength].from == 1 &&
            //     mainBoard[dominoLength].uid != global.UserId
            //   ) {
            //     console.log(
            //       'mainBoard[dominoLength] ELSEE  1: ' +
            //         JSON.stringify(mainBoard[dominoLength]) +
            //         ' user UserId: ' +
            //         global.UserId,
            //     );
            //     player2train.push(mainBoard[dominoLength]);
            //     this.setState({player2train});
            //   } else if (
            //     mainBoard[dominoLength].from == 1 &&
            //     mainBoard[dominoLength].uid == global.UserId
            //   ) {
            //     player1train.push(mainBoard[dominoLength]);
            //     this.setState({player1train}, () => {
            //       console.log(
            //         'mainBoard[dominoLength] ELSEE  2: ' +
            //           JSON.stringify(mainBoard[dominoLength]) +
            //           ' user UserId: ' +
            //           global.UserId,
            //       );
            //     });
            //   }
            // } else if (mainBoard[dominoLength].from == 2) {
            //   console.log(
            //     'mainBoard[dominoLength] IFFFF 222 ' +
            //       mainBoard[dominoLength].uid,
            //   );
            //   console.log('mainBoard[dominoLength] IFFFF 222 ' + global.UserId);
            //   if (mainBoard[dominoLength].uid == global.UserId) {
            //     player1train.push(mainBoard[dominoLength]);
            //     this.setState({player1train}, () => {
            //       console.log(
            //         'mainBoard[dominoLength] ELSEE  3: ' +
            //           JSON.stringify(mainBoard[dominoLength]) +
            //           ' user UserId: ' +
            //           global.UserId,
            //       );
            //     });
            //   } else if (mainBoard[dominoLength].uid != global.UserId) {
            //     player2train.push(mainBoard[dominoLength]);
            //     this.setState({player2train}, () => {
            //       console.log(
            //         'mainBoard[dominoLength] ELSEE  4: ' +
            //           JSON.stringify(mainBoard[dominoLength]) +
            //           ' user UserId: ' +
            //           global.UserId,
            //       );
            //     });
            //   }
            // }
          } else if (
            mainBoard[dominoLength].endToBeAdded == 'maxican' &&
            mainBoard[dominoLength].uid != global.UserId
          ) {
            console.log(
              'mainBoard[dominoLength] ELSEE  2: ' +
                JSON.stringify(mainBoard[dominoLength]) +
                ' user UserId: ' +
                global.UserId,
            );
            maxicantrain.push(mainBoard[dominoLength]);
            this.setState({maxicantrain,turnChangeData:maxicantrain});
          }
        }else{
          for (var i = 0; userDominoTrain.length > i; i++) {
            console.log(
              'userDominoTrain : ' + userDominoTrain[i] + ': I :' + i,
            );
            if(mainBoard[i].leave == true){
              userDominoTrain[i].leave = mainBoard[i].leave
            }
          }
        }
      }
      this.setState({userDominoTrain})

      this.setToEnd();
    }
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

  checkWinner = (data, bornYard) => {
    console.log('checkWinner : ' + JSON.stringify(data));
    var board = data.board;
    var lock = false;
    if (board != undefined && board.length > 0) {
      var user1 = data.user1;
      var user2 = data.user2;
      var left = board[board.length - 1];
      var main = board[board.length - 1];
      var maxican = board[board.length - 1];
      var bornYard = false;
      if (bornYard.length - 1 == 0) {
        bornYard = true;
      }
      for (var i = 0; data.length - 1 > i; i++) {
        if (data[i].endToBeAdded == 'user' && data[i].uid == global.UserId) {
          left = data[i];
        }
        if (data[i].endToBeAdded == 'main' && data[i].uid == global.UserId) {
          main = data[i];
        }
        if (data[i].endToBeAdded == 'maxican' && data[i].uid == global.UserId) {
          maxican = data[i];
        }
      }

      // var user1left = this.checkLock(left, user1);
      // var user2left = this.checkLock(left, user2);
      // var user1main = this.checkLock(main, user1);
      // var user2main = this.checkLock(main, user2);
      // var user1maxican = this.checkLock(maxican, user2);
      // var user2maxican = this.checkLock(maxican, user2);
      // console.log('left  : ' + JSON.stringify(left));
      // console.log('main  : ' + JSON.stringify(main));
      // console.log('maxican  : ' + JSON.stringify(maxican));
      // console.log('user1left Left Lock : ' + user1left);
      // console.log('user2left Left Lock : ' + user2left);
      // console.log('user1main Left Lock : ' + user1main);
      // console.log('user2main Left Lock : ' + user2main);
      // console.log('user1maxican Left Lock : ' + user1maxican);
      // console.log('user2maxican Left Lock : ' + user2maxican);
      // console.log('user2maxican Left Lock : ' + user2maxican);
      var usersData = [];
      for (var i = 0; data.users.length > i; i++) {
        var NewUser = JSON.parse(data.users[i].Domino_Array);
        var user = [];
        console.log('Winner Check User Data NewUser: ' + NewUser);
        var userleft = this.checkLock(left, NewUser);
        var usermain = this.checkLock(main, NewUser);
        var usermaxican = this.checkLock(maxican, NewUser);
        usersData.push(userleft, usermain, usermaxican);
        // usersData.push(user);
        console.log(
          'Winner Check User Data FINAL 2 : ' + JSON.stringify(usersData),
        );
      }

      for (var j = 0; usersData.length > j; j++) {
        console.log('Winner Check User Data FINAL FORRRR : ' + usersData[j]);
        if (
          usersData[j].userleft == true &&
          usersData[j].usermain == true &&
          usersData[j].usermaxican == true
        ) {
          console.log('Winner Check User Data FINAL IFFFF : ');
          lock = true;
        }
      }

      // if (
      //   user1left == true &&
      //   user2left == true &&
      //   user1main == true &&
      //   user2main == true &&
      //   user1maxican == true &&
      //   user2maxican == true &&
      //   bornYard == true
      // ) {
      //   lock = true;
      // }
      // else if (user1left == true && user1right == true) {
      //   lock = true;
      // } else if (user2left == true && user2right == true) {
      //   lock = true;
      // }
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
      console.log('Leave Data 12: ' + JSON.stringify(win.data[0]));

      await this.getUserList()
      this.setState({gameChart: win.data}, async () => {
        if (win.data[0].Id == global.GameId) {
          showToast('One Player Leave The Game');
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
          if (this.state.userList.length < 2) {
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
      this.setState({gameChart: win.data}, () => {
        console.log('gameChart: ' + JSON.stringify(this.state.gameChart));
      });
    });
  };

  /* getUserList = async () => {
    // console.log('getUserList Call');
    // console.log('getUserList Call' + global.GameId);

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
      // console.log('USER LIST RES: ' + JSON.stringify(response));
      // console.log('USER LIST : ' + JSON.stringify(global.UserId));
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
          score: 0,
          dominoesLeft:
            response.user[1].UserId == global.UserId
              ? `${JSON.parse(response.user[0].Domino_Array).length}`
              : `${JSON.parse(response.user[1].Domino_Array).length}`,
          uid:
            response.user[1].UserId == global.UserId
              ? response.user[1].UserId
              : response.user[0].UserId,
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
      // console.log(
      //   'USER LIST Stright Game Domino_Array length 1 : ' +
      //     JSON.parse(response.user[1].Domino_Array).length,
      // );
      var newUsers = [];
      var userList = [];
      // var userDominoTrain = this.state.userDominoTrain;
      var userDominoTrain = [];
      console.log(
        'userDominoTrain 1: ' + JSON.stringify(this.state.userDominoTrain),
      );
      console.log(
        'userDominoTrain 2: ' + JSON.stringify(this.state.userDominoTrain),
      );
      /* const newPData = [
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
      ]; */

      for (var i = 0; response.user.length > i; i++) {
        var user = null;

        userList.push(response.user[i].UserId);
        var userDominoData = {
          UserId: response.user[i].UserId,
          DominoTrian: [],
          UserName: `${response.user[i].FirstName}`,
          userblockUpdate: null,
        };
        userDominoTrain.push(userDominoData);
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
      // console.log('NEW USER ADDDEDD DATAAAA 2: ' + JSON.stringify(newPData));
      console.log('NEW USER ADDDEDD DATAAAA 3: ' + JSON.stringify(userList));
      console.log(
        'NEW USER ADDDEDD DATAAAA userDominoTrain length: ' +
          this.state.userDominoTrain.length,
      );

      // userDominoTrain.push(userDominoData);

      this.setState({
        playersData: newUsers, // newPData
        userList,
      });
      if (this.state.userDominoTrain.length == 0) {
        console.log(
          'NEW USER ADDDEDD DATAAAA userDominoTrain IFFF UNDERRR:  ' +
            JSON.stringify(userDominoTrain),
        );
        this.setState({userDominoTrain});
      }
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
    // console.log('Respnse : ' + JSON.stringify(response));
    // var bornYardDices = this.state.bornYardDices;
    var bornYardDices = response.bornyard;
    // console.log('Respnse bornYardDices: ' + JSON.stringify(bornYardDices));

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

  _highlightUserTurn = () => {
    this.setState({activeUserTurn: 2, selectedDiceIndex: -1}, async () => {
      // await this.setOldMainPanel();
      await this.setMainDomino();
      await this.setState({usergameblock: 1}, async () => {
        await this.blockuser();
      });
      this.changeTurn(this.state.mainDomino);
      // if (this.state.activeUserTurn === 1) {
      // }else{
      //   this.changeTurn(this.state.mainDomino);
      // }
    });
  };

  blockuser = async (val) => {
    console.log('blockuser Call  : ');
    var header = {'Content-Type': 'application/json'};
    var formData = JSON.stringify({
      GameId: global.GameId,
      UserId: global.UserId,
      Block: this.state.usergameblock,
    });
    let apiData = {
      endpoint: 'blockuser',
      method: 'POST',
      header: header,
      body: formData,
    };
    let response = await APICALL(apiData);
    console.log('blockuser Call  : ' + JSON.stringify(response));
  };

  // UpdateDomino = async () => {
  //   //UPDATE gameuser set Domino_Array = '[{"upperDotsNumber":4,"lowerDotsNumber":4},{"upperDotsNumber":4,"lowerDotsNumber":6},{"upperDotsNumber":1,"lowerDotsNumber":5},{"upperDotsNumber":1,"lowerDotsNumber":3},{"upperDotsNumber":2,"lowerDotsNumber":5},{"upperDotsNumber":2,"lowerDotsNumber":2},{"upperDotsNumber":0,"lowerDotsNumber":3}]' where GameId = 108 and UserId = 11
  //   var header = {'Content-Type': 'application/json'};
  //   var formData = JSON.stringify({
  //     GameId: global.GameId,
  //     UserId: global.UserId,
  //     domino: this.state.player1Dominoes,
  //     bornYard: this.state.bornYardDices,
  //   });
  //   let apiData = {
  //     endpoint: 'updateGameUserDomino',
  //     method: 'POST',
  //     header: header,
  //     body: formData,
  //   }
  //   let response = await APICALL(apiData);
  //   console.log('Update Respnse : ' + JSON.stringify(response));
  // };

  // changeTurn = async (domino, block = 0) => {
  //  this.UpdateDomino();
  //  console.log("changeTurn : mainPanel : "+ domino)
  //   var header = {'Content-Type': 'application/json'};
  //   var formData = JSON.stringify({
  //     GameId: global.GameId,
  //     domino: domino,
  //     UserId: global.UserId,
  //     Block: block,
  //   });
  //   let apiData = {
  //     endpoint: 'turnchange',
  //     method: 'POST',
  //     header: header,
  //     body: formData,
  //   };
  //   // console.log('changeTurn : Respnse : ' + JSON.stringify(apiData));
  //   // let response = await APICALL(apiData);
  //   console.log('Respnse changeTurn: ' + JSON.stringify(response));
  // };

  setMainDomino = () => {
    var mainPanel = this.state.mainDomino;
    for (var i = 0; mainPanel.length > i; i++) {
      mainPanel[i].add = 0;
    }
    this.setState({mainDomino: mainPanel});
  };

  setOldMainPanel = () => {
    var mainPanel = this.state.maintrain;
    for (var i = 0; mainPanel.length > i; i++) {
      mainPanel[i].add = 0;
    }
    this.setState({maintrain: mainPanel});
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
    console.log('BoronYard Click : ' + JSON.stringify(item));
    // if (player1Dominoes.length < 15) { // change 23/08/2021
      let isCompatible = await this._checkDominoCompatibility(
        item,
        index,
        true,
      );
      player1Dominoes.push(item);
      bornYardDices.splice(index, 1);
      this.setState({player1Dominoes, selectedDiceIndex: -1});
      if (isCompatible) {
        // this.setState({blockBornYard:true},()=>{
        this.toggleBornyard(0);
        // })
        // this._highlightUserTurn()
      }
      this.setState({blockBornYard: true}, () => {
        this.toggleBornyard(0);
      });
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
        if (mainPanel.length < 1) {
          this.setState({selectedDomino, selectedDiceIndex}, () => {
            this._checkDominoCompatibility(selectedDomino, selectedDiceIndex);
          });
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
    console.log('UpdateDomino Response : ' + JSON.stringify(response));
  };

  getNextId = () => {
    const {userList} = this.state;
    console.log('USER LIST User ID = ' + global.UserId);
    console.log('USER LIST getNextId = ' + userList);
    var idx = 0;
    var nextidx = 0;
    // for(var i=0;userList.length>i;i++){
    idx = userList.indexOf(global.UserId);
    console.log(
      'USER LIST getNextId IDX= ' + idx + ' : USER ID : : ' + global.UserId,
    );
    console.log('USER LIST getNextId LENGTH= ' + userList.length);
    // if(userList.length == idx + 1){
    //   nextidx = 0;
    // }else{
      if (userList.length - 1 !== idx) {
        nextidx = idx + 1;
      }
    // }
    console.log('USER LISTgetNextId  = ' + userList[nextidx]);
    console.log('USER LISTgetNextId  = ' + userList[nextidx].UserId);
    return userList[nextidx];
    // }
  };

  changeTurn = async (domino, Skip = 0) => {
    await this.UpdateDomino();
    var id = this.getNextId();
    console.log("changeTurn getNextId : "+id)
    console.log("changeTurn getNextId : "+global.UserId)
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
    console.log('Respnse changeTurn: ' + JSON.stringify(response));
  };

  _checkDominoCompatibility = async (
    selectedDomino,
    index,
    fromBornyard = false,
  ) => {
    if (this.state.maintrain.length < 2) {
      if (this.state.activeUserTurn === 1 || fromBornyard) {
        this.setState({selectedDiceIndex: index});
        let mainPanel = this.state.maintrain;
        let player1Dominoes = this.state.player1Dominoes;
        let isCompatible = false;
        let endToBeAdded = 'main';
        let rotateValue = 0;
        let leftCompatible = false;
        let rightCompatible = false;
        let add = 1;
        let uid = global.UserId;
        await this.setOldMainPanel();
        if (mainPanel.length === 0) {
          if (
            selectedDomino.upperDotsNumber === selectedDomino.lowerDotsNumber
          ) {
            isCompatible = true;
            rotateValue = '-90deg';
            add = add;
            uid = uid;
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
              endToBeAdded = 'main';
              rotateValue = '90deg';
            } else if (
              selectedDomino.lowerDotsNumber === leftEndDice.lowerDotsNumber
            ) {
              selectedDomino.lowerLocked = true;
              mainPanel[0].lowerLocked = true;
              isCompatible = true;
              leftCompatible = true;
              endToBeAdded = 'main';
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
                endToBeAdded = 'main';
                rotateValue = '90deg';
              } else if (
                selectedDomino.lowerDotsNumber === leftEndDice.upperDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[0].upperLocked = true;
                isCompatible = true;
                leftCompatible = true;
                endToBeAdded = 'main';
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
                endToBeAdded = 'main';
                rotateValue = '-90deg';
              } else if (
                selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[mainPanel.length - 1].lowerLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'main';
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
                endToBeAdded = 'main';
                rotateValue = '-90deg';
              } else if (
                selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
              ) {
                selectedDomino.lowerLocked = true;
                mainPanel[mainPanel.length - 1].upperLocked = true;
                isCompatible = true;
                rightCompatible = true;
                endToBeAdded = 'main';
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
            selectedDomino.add = add;
            selectedDomino.uid = global.UserId;
            // console.log(leftCompatible + ', ' + rightCompatible)
            if (leftCompatible && rightCompatible) {
              showToast('Both ends are compatible');
            }
            // else if (endToBeAdded === 'main') {
            //   mainPanel.unshift(selectedDomino);
            // }
            else {
              mainPanel.push(selectedDomino);
            }
            player1Dominoes.splice(index, 1);
            console.log('mainPanel : ' + JSON.stringify(mainPanel));
            this.setState(
              {
                // maintrain: mainPanel,
                player1Dominoes,
              },
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
      this.setState({selectedDomino: null, selectedDiceIndex: -1});
    }
  };

  checkMainTrainCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.maintrain;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'main';
    let rotateValue = 0;
    let add = 1;
    let uid = global.UserId;

    await this.setOldMainPanel();

    if (mainPanel.length === 0) {
      if (selectedDomino.upperDotsNumber === selectedDomino.lowerDotsNumber) {
        isCompatible = true;
        rotateValue = '-90deg';
        add = add;
        uid = uid;
      } else {
        isCompatible = false;
      }
    }
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
        endToBeAdded = 'main';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[mainPanel.length - 1].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'main';
        rotateValue = '90deg';
      } else if (
        selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.upperLocked = true;
        mainPanel[mainPanel.length - 1].lowerLocked = true;
        isCompatible = true;
        endToBeAdded = 'main';
        rotateValue = '-90deg';
      } else if (
        selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
      ) {
        selectedDomino.lowerLocked = true;
        mainPanel[mainPanel.length - 1].upperLocked = true;
        isCompatible = true;
        endToBeAdded = 'main';
        rotateValue = '90deg';
      }
    }

    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.endToBeAdded = endToBeAdded;
      selectedDomino.add = add;
      selectedDomino.uid = uid;
      mainPanel.push(selectedDomino);
      player1Dominoes.splice(index, 1);
      this.setState(
        {
          maintrain: mainPanel,
          player1Dominoes,
          selectedDiceIndex: -1,
          turnChangeData:mainPanel
        },
        () => {
          this.changeTurn(mainPanel);
        },
      );
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  checkUserCompatibility = async (from,userUid,indexDomino,itm) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.player1train;
    // let mainDomino = this.state.mainDomino;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'user';
    let rotateValue = 0;
    let add = 1;
    let uid = global.UserId;
    let otherUid = 0;
    let otherTrain = false;
    let userDominoTrainDemo = this.state.userDominoTrain;

    // await this.setOldMainPanel();
    await this.setMainDomino();
    console.log('mainPanel.length :' + mainPanel.length);

    if (mainPanel.length === 0 && from == 1) {
      var maindomino = this.state.maintrain[0];
      console.log('MAIN DOMINO CHECK :' + JSON.stringify(maindomino));
      if (maindomino.upperDotsNumber == selectedDomino.upperDotsNumber) {
        isCompatible = true;
        selectedDomino.upperLocked = true;
        rotateValue = '-90deg';
        add = add;
        uid = uid;
      } else if (maindomino.upperDotsNumber == selectedDomino.lowerDotsNumber) {
        isCompatible = true;
        selectedDomino.lowerLocked = true;
        rotateValue = '90deg';
        add = add;
        uid = uid;
      } else {
        isCompatible = false;
      }
    } else {
      let rightEndDice = null;
      console.log('global.UserId : ' + global.UserId);
      console.log(
        'this.state.userblockUpdate[1].userblockid : ' +
          this.state.userblockUpdate[1].userblockid,
      );
      console.log('this.state.userblockUpdate[1].userblockid FROOMM: ' + from);
      if (
        from == 2
        //  &&
        // global.UserId != this.state.userblockUpdate[1].userblockid
      ) {
        var idx = 0;
        console.log('IFFF FOoooR ');
        // for (var i = 0; this.length - 1 > i; i++) {
        //   console.log("Main Panel Id = "+JSON.stringify(mainPanel[i]))
        //   if (global.UserId != mainPanel[i].uid && endToBeAdded == 'user') {
        //     idx = i;
        //   }
        //   console.log("Main Panel III = "+idx)
        // }
        // rightEndDice = mainPanel[idx];
        console.log(
          'player2train : ' + JSON.stringify(userDominoTrainDemo),
        );
        console.log(
          'player2train length: ' + JSON.stringify(userDominoTrainDemo[indexDomino].DominoTrian.length),
        );
        console.log(
          'player2train item: ' + JSON.stringify(itm),
        );
        // rightEndDice = this.state.player2train[this.state.player2train.length - 1];
        var rightEndDiceindex = itm.DominoTrian.length-1;
        // var rightEndDiceDomino = userDominoTrainDemo[indexDomino].DominoTrian[rightEndDiceindex];
        rightEndDice = itm.DominoTrian[rightEndDiceindex]
        // otherUid = this.state.player2train[this.state.player2train.length - 1].uid;
        otherUid = userUid;
        otherTrain = true;
      } else {
        var rightEndDiceindex = itm.DominoTrian.length-1;
        // var rightEndDiceDomino = userDominoTrainDemo[indexDomino].DominoTrian[rightEndDiceindex];
        rightEndDice = itm.DominoTrian[rightEndDiceindex]
        // rightEndDice = mainPanel[mainPanel.length - 1];
      }
      console.log('right end : ' + JSON.stringify(rightEndDice));
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
          console.log('right end lower locked' + rightEndDice.upperDotsNumber);
          console.log(
            'right end lower locked' + selectedDomino.upperDotsNumber,
          );
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
          endToBeAdded = 'user';
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          endToBeAdded = 'user';
          rotateValue = '90deg';
        } else if (
          selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
        ) {
          selectedDomino.upperLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          endToBeAdded = 'user';
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].upperLocked = true;
          isCompatible = true;
          endToBeAdded = 'user';
          rotateValue = '90deg';
        }
      }
    }
    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.endToBeAdded = endToBeAdded;
      selectedDomino.add = add;
      // if(otherTrain == true){
      //   selectedDomino.uid = otherUid;
      // }else{
      // }
      selectedDomino.uid = uid;
      player1Dominoes.splice(index, 1);
      if (from == 1) {
        await this.setMainDomino();
        console.log('Frooooommmmm : ' + from);
        let mainDomino = this.state.mainDomino;
        selectedDomino.from = 1;
        // mainPanel.push(this.state.mainDomino)
        mainPanel.push(selectedDomino);
        mainDomino.push(selectedDomino);
        this.setState(
          {
            player1train: mainPanel,
            player1Dominoes,
            selectedDiceIndex: -1,
            turnChangeData:mainDomino
          },
          () => {
            console.log('BLOCK global.UserId' + global.UserId);
            console.log(
              'BLOCK this.state.userblockid' + this.state.userblockid,
            );
            if (global.UserId == this.state.userblockUpdate[0].userblockid) {
              //usergameblockUpdate[0]
              console.log(' IFF BLOCK global.UserId');
              this.setState({usergameblock: 0}, async () => {
                await this.blockuser();
                // this.changeTurn(mainPanel);
                this.changeTurn(mainDomino);
              });
            } else {
              // this.changeTurn(mainPanel);
              this.changeTurn(mainDomino);
            }
          },
        );
      } else if (from == 2) {
        console.log('Frooooommmmm : ' + from);
        // await this.setMainDomino();
        let mainDomino12 = this.state.mainDomino;
        selectedDomino.from = 2;
        selectedDomino.uid = otherUid;
        // mainPanel.push(this.state.mainDomino)
        // mainPanel.push(selectedDomino);
        mainDomino12.push(selectedDomino);
        this.setState({selectedDiceIndex: -1,turnChangeData:mainDomino12}, () => {
          this.changeTurn(mainDomino12);
        });
        console.log('Frooooommmmm ENDDD 1: ' + this.state.player1train);
        console.log('Frooooommmmm ENDDD 2: ' + this.state.player2train);
        // this.setState(
        //   {
        //     // player2train: mainPanel,
        //     // player1Dominoes,
        //     // selectedDiceIndex: -1,
        //   },
        //   () => {
        //     // this.changeTurn(mainPanel);
        //      this.changeTurn(mainDomino12);
        //   },
        // );
      }
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  checkMaxicanTrainCompatibility = async (fromBornyard = false) => {
    let selectedDomino = this.state.selectedDomino;
    let index = this.state.selectedDiceIndex;
    this.setState({selectedDiceIndex: index});
    let mainPanel = this.state.maxicantrain;
    let player1Dominoes = this.state.player1Dominoes;
    let isCompatible = false;
    let endToBeAdded = 'maxican';
    let rotateValue = 0;
    let add = 1;
    let uid = global.UserId;

    await this.setOldMainPanel();

    if (mainPanel.length === 0) {
      var maindomino = this.state.maintrain[0];
      if (maindomino.upperDotsNumber == selectedDomino.upperDotsNumber) {
        isCompatible = true;
        rotateValue = '-90deg';
        add = add;
        uid = uid;
      } else if (maindomino.upperDotsNumber == selectedDomino.lowerDotsNumber) {
        isCompatible = true;
        rotateValue = '90deg';
        add = add;
        uid = uid;
      } else {
        isCompatible = false;
      }
    } else {
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
          endToBeAdded = 'maxican';
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.lowerDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          endToBeAdded = 'maxican';
          rotateValue = '90deg';
        } else if (
          selectedDomino.upperDotsNumber === rightEndDice.upperDotsNumber
        ) {
          selectedDomino.upperLocked = true;
          mainPanel[mainPanel.length - 1].lowerLocked = true;
          isCompatible = true;
          endToBeAdded = 'maxican';
          rotateValue = '-90deg';
        } else if (
          selectedDomino.lowerDotsNumber === rightEndDice.upperDotsNumber
        ) {
          selectedDomino.lowerLocked = true;
          mainPanel[mainPanel.length - 1].upperLocked = true;
          isCompatible = true;
          endToBeAdded = 'maxican';
          rotateValue = '90deg';
        }
      }
    }
    if (isCompatible) {
      console.log('isCompatible:' + isCompatible);
      selectedDomino.rotateValue = rotateValue;
      selectedDomino.endToBeAdded = endToBeAdded;
      selectedDomino.add = add;
      selectedDomino.uid = uid;
      mainPanel.push(selectedDomino);
      player1Dominoes.splice(index, 1);
      this.setState(
        {
          maxicantrain: mainPanel,
          player1Dominoes,
          selectedDiceIndex: -1,
          turnChangeData:mainPanel
        },
        () => {
          this.changeTurn(mainPanel);
        },
      );
      // this._highlightUserTurn()
    }
    if (isCompatible) {
      this.setState({selectedDomino: null});
    }
  };

  setToEnd = () => {
    console.log("this.scrollview_Ref : "+this.scrollview_Ref)
    setTimeout(() => {
        if(this.scrollview_Ref !== null ){
          this.scrollview_Ref.scrollToEnd({animated: true});
        }
      }, 1000);
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
      maintrain,
      player1train,
      player2train,
      maxicantrain,
      userDominoTrain,
      userList
    } = this.state;
    let bornYardLeftOffset = this.bornYardLeftOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [140 + getWidth(), 30],
    });
    console.log('Train 11 = ' + this.state.userblock);
    console.log('Train 22 = ' + this.state.userblock);
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
          <View style={styles.mainTrainPanelView}>
            <View style={styles.maintrainview}>
              <View style={styles.mainTrainPanel}>
                <Text style={styles.playerPanelLabel}>Main Train</Text>
              </View>
              <View style={[styles.maintraindominoview]}>
                <ScrollView
                  horizontal={true}
                  ref={(ref) => {
                    this.scrollview_Ref = ref;
                  }}
                  // onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                >
                  {maintrain.length > 0 &&
                    maintrain.map((item, index) => {
                      return (
                        <Dice
                          // onPress={() => this.selectDomino(item, index)}
                          upperDotsNumber={item.upperDotsNumber}
                          lowerDotsNumber={item.lowerDotsNumber}
                          rotateValue={item.rotateValue}
                          key={'dice' + index}
                          // selectedDiceIndex={selectedDiceIndex === index}
                          // diceBorderColor={
                          //   selectedDiceIndex === index ? '#cc0000' : '#fff'
                          // }
                          // is_diceSelected={selectedDiceIndex === index}
                        />
                      );
                    })}
                  <TouchableOpacity
                    onPress={this.checkMainTrainCompatibility}
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
                </ScrollView>
              </View>
            </View>
            <View style={{height: getHeight()/3.5}}>
              <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:20}}>
                {userDominoTrain.map((itm, idx) => {

                  console.log('ITMMM : ' + JSON.stringify(itm));
                  return (
                    itm.UserId == global.UserId && (
                      <View style={styles.usertrainview}>
                        <View style={styles.mainTrainPanel}>
                          <Text style={styles.playerPanelLabel}>
                            {itm.UserName}
                          </Text>
                        </View>
                        <View style={styles.maintraindominoview}>
                          <ScrollView
                            horizontal={true}
                            ref={(ref) => {
                              this.scrollView = ref;
                            }}
                            // onContentSizeChange={() =>
                            //   this.scrollView.scrollToEnd({animated: true})
                            // }
                            //contentContainerStyle={{flexGrow:1}}
                          >
                            {itm.DominoTrian !== null &&
                              itm.DominoTrian.length > 0 &&
                              itm.DominoTrian.map((item, index) => {
                                console.log(
                                  'player1train : ' + JSON.stringify(item),
                                );
                                return (
                                  <Dice
                                    // onPress={() => this.selectDomino(item, index)}
                                    upperDotsNumber={item.upperDotsNumber}
                                    lowerDotsNumber={item.lowerDotsNumber}
                                    upperLocked={item.upperLocked}
                                    lowerLocked={item.lowerLocked}
                                    rotateValue={item.rotateValue}
                                    key={'dice' + index}
                                    // isUserBlock={
                                    //   this.state.userblockUpdate[0].userblock ==
                                    //   1
                                    //     ? true
                                    //     : false
                                    // }
                                    isUserBlock={
                                      itm.userblockUpdate.userblockid == item.uid
                                        ? true
                                        : false
                                    }
                                    length={itm.DominoTrian.length-1}
                                    index={index}
                                    // selectedDiceIndex={selectedDiceIndex === index}
                                    // diceBorderColor={
                                    //   selectedDiceIndex === index ? '#cc0000' : '#fff'
                                    // }
                                    // is_diceSelected={selectedDiceIndex === index}
                                  />
                                );
                              })}
                            <TouchableOpacity
                              onPress={() => this.checkUserCompatibility(1,itm.UserId,idx,itm)}
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
                          </ScrollView>
                        </View>
                      </View>
                    )
                  );
                })}
                {userDominoTrain.map((itm, idx) => {
                  console.log('ITMMM : ' + JSON.stringify(itm));
                  return (
                    itm.leave != true &&
                    itm.UserId !== global.UserId && (
                      <View style={styles.usertrainview}>
                        <View style={styles.mainTrainPanel}>
                          <Text style={styles.playerPanelLabel}>
                            {itm.UserName}
                          </Text>
                        </View>
                        <View style={styles.maintraindominoview}>
                          <ScrollView
                            horizontal={true}
                            ref={(ref) => {
                              this.scrollView = ref;
                            }}
                            // onContentSizeChange={() =>
                            //   this.scrollView.scrollToEnd({animated: true})
                            // }
                            //contentContainerStyle={{flexGrow:1}}
                          >
                            {itm.DominoTrian !== null &&
                              itm.DominoTrian.length > 0 &&
                              itm.DominoTrian.map((item, index) => {
                                console.log(
                                  'player2train : ' + JSON.stringify(item),
                                );
                                return (
                                  <Dice
                                    // onPress={() => this.selectDomino(item, index)}
                                    upperDotsNumber={item.upperDotsNumber}
                                    lowerDotsNumber={item.lowerDotsNumber}
                                    upperLocked={item.upperLocked}
                                    lowerLocked={item.lowerLocked}
                                    rotateValue={item.rotateValue}
                                    key={'dice' + index}
                                    // isUserBlock={
                                    //   this.state.userblockUpdate[0].userblock ==
                                    //   1
                                    //     ? true
                                    //     : false
                                    // }
                                    isUserBlock={
                                      itm.userblockUpdate.userblockid == item.uid
                                        ? true
                                        : false
                                    }
                                    length={itm.DominoTrian.length-1}
                                    index={index}
                                    // selectedDiceIndex={selectedDiceIndex === index}
                                    // diceBorderColor={
                                    //   selectedDiceIndex === index ? '#cc0000' : '#fff'
                                    // }
                                    // is_diceSelected={selectedDiceIndex === index}
                                  />
                                );
                              })}
                            {/* {this.state.userblockUpdate[1].userblock == 2 && ( */}
                            {itm.userblockUpdate !== null &&
                            itm.userblockUpdate.userblockid == itm.UserId && (
                              <TouchableOpacity
                                onPress={() => this.checkUserCompatibility(2,itm.UserId,idx,itm)}
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
                          </ScrollView>
                        </View>
                      </View>
                    )
                  );
                })}
                {/*<View style={styles.maintrainview}>
              <View style={styles.mainTrainPanel}>
                <Text style={styles.playerPanelLabel}>
                  {playersData[1].name}
                </Text>
              </View>
              <View style={styles.maintraindominoview}>
                <ScrollView
                  horizontal={true}
                  ref={(ref) => {
                    this.scrollView = ref;
                  }}
                  onContentSizeChange={() =>
                    this.scrollView.scrollToEnd({animated: true})
                  }>
                  {player2train.map((item, index) => {
                    console.log('player2train : ' + JSON.stringify(item));
                    return (
                      <Dice
                        // onPress={() => this.selectDomino(item, index)}
                        upperDotsNumber={item.upperDotsNumber}
                        lowerDotsNumber={item.lowerDotsNumber}
                        upperLocked={item.upperLocked}
                        lowerLocked={item.lowerLocked}
                        rotateValue={item.rotateValue}
                        key={'dice' + index}
                        isUserBlock={
                          this.state.userblockUpdate[1].userblock == 2
                            ? true
                            : false
                        }
                        length={player2train.length - 1}
                        index={index}
                        // selectedDiceIndex={selectedDiceIndex === index}
                        // diceBorderColor={
                        //   selectedDiceIndex === index ? '#cc0000' : '#fff'
                        // }
                        // is_diceSelected={selectedDiceIndex === index}
                      />
                    );
                  })}
                  {this.state.userblockUpdate[1].userblock != 0 && (
                    <TouchableOpacity
                      onPress={() => this.checkUserCompatibility(2)}
                      style={{
                        shadowColor: '#fff',
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 0.5,
                        elevation: 10,
                        height: 50,
                        width: 50,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 0, 0, 0.2)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 50,
                      }}
                    />
                  )}
                </ScrollView>
              </View>
            </View> */}
              </ScrollView>
            </View>
            <View style={styles.maintrainview}>
              <View style={styles.mainTrainPanel}>
                <Text style={styles.playerPanelLabel}>Maxican Train</Text>
              </View>
              <View style={styles.maintraindominoview}>
                <ScrollView
                  horizontal={true}
                  ref={(ref) => {
                    this.scrollView = ref;
                  }}
                  onContentSizeChange={() =>
                    this.scrollView.scrollToEnd({animated: true})
                  }>
                  {maxicantrain.map((item, index) => {
                    return (
                      <Dice
                        //  onPress={() => this.selectDomino(item, index)}
                        upperDotsNumber={item.upperDotsNumber}
                        lowerDotsNumber={item.lowerDotsNumber}
                        rotateValue={item.rotateValue}
                        key={'dice' + index}
                        // selectedDiceIndex={selectedDiceIndex === index}
                        // diceBorderColor={
                        //   selectedDiceIndex === index ? '#cc0000' : '#fff'
                        // }
                        is_diceSelected={selectedDiceIndex === index}
                      />
                    );
                  })}
                  <TouchableOpacity
                    onPress={() => this.checkMaxicanTrainCompatibility()}
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
                </ScrollView>
              </View>
              {/* </View>
            </ScrollView> */}
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
          <View
            style={
              activeUserTurn === 1 ? styles.selfPanel_active : styles.selfPanel
            }>
            {playersData.map((itmul,idxul)=>{
              console.log("itmul :"+JSON.stringify(itmul))
              return(
                itmul.UserId == global.UserId &&

               <View
              style={{
                backgroundColor: '#28302d',
                paddingHorizontal: 10,
                borderRadius: 4,
                width: 140,
              }}>
              {/* <Text style={styles.playerNameText}>{playersData[0].name}</Text> */}
              <Text style={styles.playerNameText}>{itmul.name}</Text>
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
                  {/* {playersData[1]!= undefined && playersData[1].score} */}
                  {itmul.score}
                </Text>
              </View>
              {/* <View style={styles.playerPanelValuesRow}>
                <Text numberOfLines={1} style={styles.selfPanelLabel}>
                  uid
                </Text>
                <Text style={styles.selfPanelValue}>{playersData[1].uid}</Text>
              </View> */}
            </View>
            )
          })
          }
            {player1Dominoes.map((item, index) => {
              console.log('ITEM :L:: ' + JSON.stringify(item));
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
                  // isUserBlock={this.state.userblock}
                  // length={player1Dominoes.length-1}
                  // index = {index}
                />
              );
            })}
          </View>
          {activeUserTurn == 1 ? (
            <TouchableOpacity
              onPress={() => this._highlightUserTurn()}
              style={styles.SkipButtonStyle}>
              <Text style={styles.SkipButtonTextStyle}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.SkipButtonDisebleStyle}>
              <Text style={styles.SkipButtonTextStyle}>Skip</Text>
            </View>
          )}
          {this.state.blockBornYard == false ? (
            <TouchableOpacity
              onPress={this._onBoneYardPress}
              style={styles.bornYardStyle}>
              <Text style={styles.bornYardText}>Boneyard</Text>
              <Text style={styles.bornYardDicesText}>
                {this.state.bornYardDices.length}
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              onPress={this._onBoneYardPress}
              style={styles.bornYardDisebleStyle}>
              <Text style={styles.bornYardText}>Boneyard</Text>
              <Text style={styles.bornYardDicesText}>
                {this.state.bornYardDices.length}
              </Text>
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
              {mainPanel.map((item, index) => {
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
            {/* <Animated.View
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
            </Animated.View> */}
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

export default GameBoard;
