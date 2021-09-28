import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  Animated,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  AppState,
} from 'react-native';
import {Images} from '../../common/Images';
import {styles} from './styles';
import {APICALL} from '../../common/ApiCaller';
import {showToast} from '../../common/Toaster';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiEndpoint} from '../../common/functions';
import io from 'socket.io-client';
import {NavigationEvents} from 'react-navigation';

const socket = io(apiEndpoint, {
  transports: ['websocket'],
  rejectUnauthorized: false,
  jsonp: false,
});

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.colorValue = new Animated.Value(0);
    this.state = {
      loginLoader: false,
      is_loading_sign_up: false,
      is_loading_forgetPWD: false,
      // email: '',
      // password: '',
      email: 'test1@test.com',
      password: 'test1',
      formError: '',
    };
    global.UserId = 0;
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToPortrait();
    AppState.addEventListener('change', this.handleAppStateChange);
    console.log('API CALLL : ' + apiEndpoint);
  }

  handleAppStateChange = (nextAppState) => {
    console.log('handleAppStateChange : ' + nextAppState);
    if (nextAppState === 'inactive') {
      console.log('the app is closed');
    }
  };

  _validateLoginForm = () => {
    let {email, password} = this.state;
    var formIsNotFilled = false;
    if (email === '' || password === '') {
      formIsNotFilled = true;
    } else {
      formIsNotFilled = false;
    }
    if (formIsNotFilled) {
      this.setState({formError: 'Hey dear! Please fill up all the fields'});
    } else {
      this._validateEmail(email);
    }
  };

  _validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({formError: 'Hey dear! Please enter a valid email'});
    } else {
      this._onLogin();
    }
  };

  _onLogin = async () => {
    let {email, password, loginLoader} = this.state;
    if (!loginLoader) {
      this.setState({loginLoader: true});
      var formData = new FormData();
      /* formData.append('email', email);
      formData.append('password', password); */
      var formData = JSON.stringify({
        email: email,
        password: password,
      });
      var header = {'Content-Type': 'application/json'};
      let apiData = {
        endpoint: 'login',
        method: 'POST',
        header: header,
        body: formData,
      };
      let response = await APICALL(apiData);
      if (response.status === 200) {
        await AsyncStorage.setItem('User', JSON.stringify(response.loginUser));
        global.UserId = response.loginUser.Id;
        this.props.navigation.navigate('MainMenuScreen');
        this.setState({email: '', password: '', loginLoader: false});
        this.setState({loginLoader: false});
      } else {
        console.log('Error : ' + JSON.stringify(response));
        let message = 'Something went wrong';
        if (response.message !== undefined) {
          message = response.message;
        }
        this.setState({formError: response.message, loginLoader: false});
      }
    }
  };

  _onSignup = () => {
    this.props.navigation.navigate('SignUpScreen');
  };

  _onForgotPassword = () => {
    this.props.navigation.navigate('ForgetPassWordScreen');
  };

  reload = ()=>{
    StatusBar.setHidden(true);
    Orientation.lockToPortrait();
  }

  render() {
    let {email, password, loginLoader, formError} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#f1f1f1'}}>
        <NavigationEvents
          onWillFocus={() => {this.reload()}}
        />
        <KeyboardAvoidingView enabled style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.main_view_container}>
              <View style={styles.logo_view}>
                <Image source={Images.domino_logo} style={styles.logo} />
              </View>
              <View style={styles.txt_box_view}>
                <View style={styles.title_view}>
                  <Text style={styles.Logo_text_style}>
                    Domino{' '}
                    <Text style={[styles.Logo_text_style, {color: '#000'}]}>
                      Circus
                    </Text>
                  </Text>
                </View>
                <View style={styles.title_login_view}>
                  <Text style={styles.Login_text_style}>Login</Text>
                </View>
                {formError !== '' && (
                  <Text style={styles.formError}>{formError}</Text>
                )}
                <View
                  style={[
                    styles.txt_input_view,
                    {marginTop: formError === '' ? 50 : 20},
                  ]}>
                  <View style={styles.email_txt_input_view}>
                    <TextInput
                      placeholder={'Email'}
                      keyboardType="email-address"
                      style={{paddingLeft: 20}}
                      value={email}
                      onChangeText={(email) => this.setState({email})}
                    />
                  </View>
                  <View style={styles.password_txt_input_view}>
                    <TextInput
                      placeholder={'Password'}
                      secureTextEntry={true}
                      style={{paddingLeft: 20}}
                      value={password}
                      onChangeText={(password) => this.setState({password})}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.login_btn_input_view]}
                    onPress={this._validateLoginForm}>
                    {loginLoader && (
                      <Image
                        style={styles.loader}
                        source={require('../../assets/images/ajax-loader.gif')}
                      />
                    )}
                    <Text style={styles.Login_btn_text_style}>
                      {loginLoader ? 'loading...' : 'Login'}
                    </Text>
                    {!loginLoader && (
                      <Ionicons
                        name="ios-arrow-forward-circle"
                        size={25}
                        color="#fff"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity
                  style={[styles.sign_up_btn_input_view]}
                  onPress={this._onSignup}>
                  <Text style={styles.sign_up_btn_text_style}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sign_up_btn_input_view]}
                  onPress={this._onForgotPassword}>
                  <Text style={styles.sign_up_btn_text_style}>
                    Forgot password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default LoginScreen;
