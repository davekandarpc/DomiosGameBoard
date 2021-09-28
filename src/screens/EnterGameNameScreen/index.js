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
  ScrollView,
  ImageBackground
} from 'react-native';
import { Images } from '../../common/Images';
import { APICALL } from '../../common/ApiCaller';
import { styles } from './styles';
import Orientation from 'react-native-orientation';

export class EnterGameNameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: ''
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    console.log("Number OF USeer EnterGameNameScreen : "+global.numberofUser)
  }

  setGameName = (gameName) => {
    this.setState({gameName});
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  next = () => {
    global.gameName = this.state.gameName
    this.props.navigation.navigate('SelectGameTypeScreen')
  }

  render() {
    const { gameName } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={Images.woodenBackground} style={styles.screenBackgroundStyle}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ImageBackground source={Images.back} style={styles.backImageStyle}>
              <TouchableOpacity style={styles.backButtonStyle} onPress={this.goBack} />
            </ImageBackground>
            <View style={styles.selectGameTypeLablel}>
              <Text style={styles.selectGameTypeLabelText}>Enter Game Name</Text>
            </View>
            <ImageBackground source={Images.nextArrow} style={styles.backImageStyle}>
              <TouchableOpacity style={styles.backButtonStyle} onPress={this.next} />
            </ImageBackground>
          </View>
          <View style={styles.mainContent}>
            <View style={styles.textboxView}>
              <TextInput
              ref={this.textbox}
                placeholder={'Enter Game Name'}
                placeholderTextColor='#0a0a0a'
                style={styles.gameNameTextBox}
                value={gameName}
                onChangeText={(value)=> this.setGameName(value)}
              />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default EnterGameNameScreen;
