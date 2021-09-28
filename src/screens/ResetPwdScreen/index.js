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
import { showToast } from '../../common/Toaster'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

export class ResetPwdScreen extends Component {
  constructor(props) {
    super(props);
    this.colorValue = new Animated.Value(0);
    this.state = {
      buttonLoader: false,
      password: '',
      confirmpassword: '',
      successMessage: '',
      formError: '',
      Email: ''
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    let successMessage = this.props.navigation.state.params.forgotApiMessage
    let Email = this.props.navigation.state.params.Email
    this.setState({ successMessage, Email })
  }

  _validateForm = () => {
    let { password, confirmpassword, otp } = this.state;
    var formIsNotFilled = false
    if (password === '' || confirmpassword === '' || otp === '') {
      formIsNotFilled = true
    } else {
      formIsNotFilled = false
    }
    if (formIsNotFilled) {
      this.setState({ formError: 'Hey dear! Please fill up all the fields' })
    } else {
      this._resetPassword()
    }
  }

  _resetPassword = async () => {
    let { password, Email, otp, buttonLoader } = this.state;
    if (!buttonLoader) {
      this.setState({ buttonLoader: true });
      var formData = new FormData()
      formData.append('OTP', otp);
      formData.append('Password', password);
      formData.append('Email', Email);

      let response = await APICALL('resetpassword.php', 'POST', formData)
      if (response.status === 200) {
        showToast(response.message)
        this.setState({ password: '', Email: '', otp: '', buttonLoader: false })
        this.props.navigation.navigate('LoginScreen')
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
    this.props.navigation.navigate('LoginScreen');
  };

  render() {
    let {password, confirmpassword, buttonLoader, otp, successMessage, formError} = this.state
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
                  <Text style={styles.Login_text_style}>Reset password</Text>
                </View>
                {
                  successMessage !== '' &&
                  <Text style={styles.successMessageStyle}>{successMessage}</Text>
                }
                {
                  formError !== '' &&
                  <Text style={styles.formError}>{formError}</Text>
                }
                <View style={styles.txt_input_view}>
                  <View style={styles.new_pwd_txt_input_view}>
                    <TextInput
                      placeholder={'OTP'}
                      onChangeText={(otp) => this.setState({ otp })}
                      value={otp}
                      keyboardType="number-pad"
                      style={{ paddingLeft: 20 }}
                    />
                  </View>
                  <View style={styles.confirm_pwd_txt_input_view}>
                    <TextInput
                      placeholder={'New password'}
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({ password })}
                      value={password}
                      style={{ paddingLeft: 20 }}
                    />
                  </View>
                  <View style={styles.confirm_pwd_txt_input_view}>
                    <TextInput
                      placeholder={'Confirm password'}
                      secureTextEntry={true}
                      onChangeText={(confirmpassword) =>
                        this.setState({ confirmpassword })
                      }
                      value={confirmpassword}
                      style={{ paddingLeft: 20 }}
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
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.sign_up_btn_input_view}
                onPress={this.LoginButton}>
                <Ionicons name="ios-arrow-back-circle" size={25} color="#40916C" />
                <Text style={styles.sign_up_btn_text_style}>
                  Login
                  </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default ResetPwdScreen;
