import { StyleSheet } from 'react-native';
import { Fonts } from '../../common/fonts';
export const styles = StyleSheet.create({
  main_view_container: {
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
    height: 350,
    width: 350,
    resizeMode: 'contain',
  },
  logo_view: {
    alignSelf: 'center',
    width: '100%',
  },
  title_view: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title_login_view: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10
  },
  Login_text_style: {
    fontFamily: Fonts.OpenSans_Bold,
    color: '#000',
    fontSize: 30
  },
  Logo_text_style: {
    fontFamily: Fonts.Righteous_Regular,
    color: '#009074',
    fontSize: 40
  },
  txt_box_view: {
    flex: 1,
    marginTop: -80
  },
  txt_input_view: {
    width: '90%',
    alignSelf: 'center',
  },
  email_txt_input_view: {
    backgroundColor: '#95D5B2',
    borderRadius: 25,
    borderColor: '#89D1B1',
    borderWidth: 1,
    shadowColor: "#95D5B2",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 3,
    shadowRadius: 23.00,
    elevation: 24,
  },
  password_txt_input_view: {
    marginTop: 20,
    backgroundColor: '#95D5B2',
    borderRadius: 25,
    elevation: 9,
    borderColor: '#89D1B1',
    borderWidth: 1
  },
  login_btn_input_view: {
    marginTop: 20,
    backgroundColor: '#40916C',
    borderRadius: 25,
    elevation: 9,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  Login_btn_text_style: {
    fontFamily: Fonts.OpenSans_Bold,
    color: '#fff',
    fontSize: 18,
    marginRight: 10
  },
  loader: {
    width: 16,
    height: 16,
    marginRight: 10
  },
  sign_up_btn_input_view: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 9,
    borderColor: '#89D1B1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  sign_up_btn_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    color: '#40916C',
    fontSize: 14,
  },
  formError: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
    marginHorizontal: 24
  }
});
