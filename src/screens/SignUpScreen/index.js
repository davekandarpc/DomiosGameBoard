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
} from 'react-native';
import {Images} from '../../common/Images';
import {styles} from './styles';
import {APICALL} from '../../common/ApiCaller';
import {showToast} from '../../common/Toaster';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

export class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.colorValue = new Animated.Value(0);
    this.state = {
      is_loading_register: false,
      is_loading_login: false,
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      Phone: '',
      // FirstName: 'Test 2',
      // LastName: 'Test 2',
      // Email: 'test2@test.com',
      // Password: 'test2',
      // Phone: '22222222',
      registerLoader: false,
      formError: '',
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
  }

  _validateForm = () => {
    let {FirstName, LastName, Email, Password, Phone, formError} = this.state;
    var formIsNotFilled = false;
    if (
      FirstName === '' ||
      LastName === '' ||
      Email === '' ||
      Password === '' ||
      Phone === ''
    ) {
      formIsNotFilled = true;
    } else {
      formIsNotFilled = false;
    }
    if (formIsNotFilled) {
      this.setState({formError: 'Hey dear! Please fill up all the fields'});
    } else {
      this._validateEmail(Email);
    }
  };

  _validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({formError: 'Hey dear! Please enter a valid email'});
    } else {
      this._onRegister();
    }
  };

  _onRegister = async () => {
    let {
      FirstName,
      LastName,
      Email,
      Password,
      Phone,
      registerLoader,
    } = this.state;
    if (!registerLoader) {
      this.setState({registerLoader: true});
      // var formData = new FormData()
      // formData.append('FirstName', FirstName);
      // formData.append('LastName', LastName);
      // formData.append('Email', Email);
      // formData.append('Password', Password);
      // formData.append('Phone', Phone);
      console.log("password type : "+typeof(Password))
      var header = {'Content-Type': 'application/json'}
      var formData = JSON.stringify({
        fname: FirstName,
        lname: LastName,
        email: Email,
        password: Password,
        phone: Phone,
      });
      console.log("Email : "+JSON.stringify(formData))
      // formData.append('fname', FirstName);
      // formData.append('lname', LastName);
      // formData.append('email', Email);
      // formData.append('password', Password);
      // formData.append('phone', Phone);
      let apiData = {
        // endpoint: 'register.php',
        endpoint: 'register',
        method: 'POST',
        body: formData,
        header : header
      };
      let response = await APICALL(apiData);
      if (response.status === 200) {
        showToast('You are registered successfully');
        this.setState({
          FirstName: '',
          LastName: '',
          Email: '',
          Password: '',
          Phone: '',
          registerLoader: false,
        });
      } else {
        let message = 'Something went wrong';
        if (response.message !== undefined) {
          message = response.message;
        }
        this.setState({formError: response.message, registerLoader: false});
      }
    }
  };

  LoginButton = () => {
    this.props.navigation.navigate('LoginScreen');
  };

  render() {
    let {
      FirstName,
      LastName,
      Email,
      Password,
      Phone,
      registerLoader,
      formError,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#f1f1f1'}}>
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
                  <Text style={styles.Login_text_style}>Registration</Text>
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
                      placeholder={'First Name'}
                      style={{paddingLeft: 20}}
                      value={FirstName}
                      onChangeText={(FirstName) => this.setState({FirstName})}
                    />
                  </View>
                  <View style={styles.password_txt_input_view}>
                    <TextInput
                      placeholder={'Last Name'}
                      style={{paddingLeft: 20}}
                      value={LastName}
                      onChangeText={(LastName) => this.setState({LastName})}
                    />
                  </View>
                  <View style={styles.password_txt_input_view}>
                    <TextInput
                      placeholder={'Email'}
                      keyboardType="email-address"
                      style={{paddingLeft: 20}}
                      value={Email}
                      onChangeText={(Email) => this.setState({Email})}
                    />
                  </View>
                  <View style={styles.password_txt_input_view}>
                    <TextInput
                      placeholder={'Phone'}
                      keyboardType="number-pad"
                      style={{paddingLeft: 20}}
                      value={Phone}
                      onChangeText={(Phone) => this.setState({Phone})}
                    />
                  </View>
                  <View style={styles.password_txt_input_view}>
                    <TextInput
                      placeholder={'Password'}
                      secureTextEntry={true}
                      style={{paddingLeft: 20}}
                      value={Password}
                      onChangeText={(Password) => this.setState({Password})}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.login_btn_input_view}
                    onPress={this._validateForm}>
                    {registerLoader && (
                      <Image
                        style={styles.loader}
                        source={require('../../assets/images/ajax-loader.gif')}
                      />
                    )}
                    <Text style={styles.Login_btn_text_style}>
                      {registerLoader ? 'loading...' : 'Register'}
                    </Text>
                    {!registerLoader && (
                      <Ionicons
                        name="ios-arrow-forward-circle"
                        size={25}
                        color="#fff"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.alreadyHaveAccText}>
                Already have an account?
              </Text>
              <TouchableOpacity
                style={styles.sign_up_btn_input_view}
                onPress={() => this.LoginButton()}>
                <Ionicons
                  name="ios-arrow-back-circle"
                  size={25}
                  color="#40916C"
                />
                <Text style={styles.sign_up_btn_text_style}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default SignUpScreen;
