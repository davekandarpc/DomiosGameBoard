import React, {Component} from 'react';
import {Text, AppState} from 'react-native';
import AppContainer from './src/Navigator/AppNavigation';
import {apiEndpoint,updateState} from './src/common/functions';
import io from 'socket.io-client';

console.disableYellowBox = true;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const socket = io(apiEndpoint, {
    transports: ['websocket'],
    rejectUnauthorized: false,
    jsonp: false,
  });

export class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    };
    global.myNavigation = this.props.navigation;
    global.numberofUser = 0;
  }

  componentDidMount() {
    // AppState.addEventListener('change', this.handleAppStateChange);
    socket.connect()
      //  socket = io.connect(window.location.protocol + "//" + window.location.hostname + (window.location.port!=80?":"+window.location.port:"" ) );
  }


  // handleAppStateChange = (nextAppState) => {
  //   console.log('handleAppStateChange  APPP: ' + nextAppState);
  //   console.log('handleAppStateChange global.UserId APPP: ' + global.UserId);
  //   if (nextAppState === 'background') { // background inactive
  //       console.log('handleAppStateChange IFFFF');
  //       // updateState(global.UserId,0)
  //       // this.disconnectSocket()
  //       console.log('the app is closed');
  //   }else if (nextAppState === 'active') {
  //       console.log('handleAppStateChange ELSEEE');
  //       updateState(global.UserId,1)
  //       console.log('the app is open');
  //   }
  // };

  // disconnectSocket = ()=>{
  //   console.log("disconnectSocket Starttttt")
  //   var data = {
  //         UserId:global.UserId
  //     }

  //     socket.on("forceDisconnectSend",() =>{
  //       socket.emit("forceDisconnect", data);
  //     })
  //     socket.disconnect(data);
  //     console.log("disconnectSocket ENDDD")
  // }

  componentWillUnmount() {
    // this.backHandler.remove();
    // AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    return <AppContainer />;
  }
}

export default SplashScreen;
