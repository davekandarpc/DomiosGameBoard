import React, { Component } from 'react';
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
  ScrollView
} from 'react-native';
import { Images } from '../../common/Images';
import { styles } from './styles';
import { APICALL } from '../../common/ApiCaller'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

export class ForgetPassWordScreen extends Component {
  constructor(props) {
    super(props);
    this.colorValue = new Animated.Value(0);
    this.state = {
      is_loading_submit: false,
      is_loading_login: false,
      Email: '',
      formError: '',
      buttonLoader: false,
      successMessage: ''
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
  }

  _validateForm = () => {
    let { Email } = this.state;
    var formIsNotFilled = false
    if (Email === '') {
      formIsNotFilled = true
    } else {
      formIsNotFilled = false
    }
    if (formIsNotFilled) {
      this.setState({ formError: 'Hey dear! Please fill up all the fields' })
    } else {
      this._validateEmail(Email)
    }
  }

  _validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({ formError: 'Hey dear! Please enter a valid email' })
    }
    else {
      this._onForgotPassword()
    }
  }

  _onForgotPassword = async () => {
    let { Email, buttonLoader } = this.state;
    if (!buttonLoader) {
      this.setState({ buttonLoader: true });
      var formData = new FormData()
      formData.append('Email', Email);
      let apiData = {
        endpoint: 'forgotpassword.php',
        method: 'POST',
        body: formData
      }
      let response = await APICALL(apiData)
      if (response.status === 200) {
        this.setState({ Email: '', buttonLoader: false })
        this.props.navigation.navigate('ResetPwdScreen', {
          forgotApiMessage: response.message,
          Email
        })
      } else {
        let message = 'Something went wrong'
        if (response.message !== undefined) {
          message = response.message
        }
        this.setState({ formError: response.message, buttonLoader: false })
      }
    }
  };

  LoginButton = () => {
    this.props.navigation.navigate('LoginScreen')
  };

  render() {
    let { Email, formError, buttonLoader, successMessage } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
        <KeyboardAvoidingView enabled style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.main_view_container}>
              <View style={styles.logo_view}>
                <Image source={Images.domino_logo} style={styles.logo} />
              </View>
              <View style={styles.txt_box_view}>
                <View style={styles.title_view}>
                  <Text style={styles.Logo_text_style}>
                    Domino{' '}
                    <Text style={[styles.Logo_text_style, { color: '#000' }]}>
                      Circus
                    </Text>
                  </Text>
                </View>
                <View style={styles.title_login_view}>
                  <Text style={styles.Login_text_style}>Forgot password</Text>
                </View>
                {
                  formError !== '' &&
                  <Text style={styles.formError}>{formError}</Text>
                }
                <View style={[styles.txt_input_view, { marginTop: formError === '' ? 50 : 20 }]}>
                  <View style={styles.email_txt_input_view}>
                    <TextInput
                      placeholder={'Email'}
                      keyboardType="email-address"
                      style={{ paddingLeft: 20 }}
                      value={Email}
                      onChangeText={(Email) => this.setState({ Email })}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.login_btn_input_view}
                    onPress={this._validateForm}>
                    {buttonLoader && (
                      <Image
                        style={styles.loader}
                        source={require('../../assets/images/ajax-loader.gif')}
                      />
                    )}
                    <Text style={styles.Login_btn_text_style}>
                      {buttonLoader ? 'loading...' : 'Submit'}
                    </Text>
                    {
                      !buttonLoader &&
                      <Ionicons name="ios-arrow-forward-circle" size={25} color="#fff" />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sign_up_btn_input_view}
                    onPress={this.LoginButton}>
                    <Ionicons name="ios-arrow-back-circle" size={25} color="#40916C" />
                    <Text style={styles.sign_up_btn_text_style}>
                      Login
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default ForgetPassWordScreen;
