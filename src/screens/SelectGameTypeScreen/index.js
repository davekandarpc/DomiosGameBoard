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
  ImageBackground,
  Dimensions
} from 'react-native';
import { Images } from '../../common/Images';
import { APICALL } from '../../common/ApiCaller';
import { styles } from './styles';
import Orientation from 'react-native-orientation';

export class SelectGameTypeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTypes: []
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    console.log("Number OF USeer SelectGameTypeScreen: "+global.numberofUser)
    this.fetchGameTypes()
  }

  fetchGameTypes = async () => {
    let apiData = {
      endpoint: 'gametype',
      method: 'GET'
    }
    let response = await APICALL(apiData)
    console.log('gameTypesRes: ', JSON.stringify(response))
    if (response.status === 200) {
      this.setState({ gameTypes: response.data }, () => {
        console.log('gameTypesRes: ', JSON.stringify(this.state.gameTypes))
      })
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
  }


  createGame = async (item,index) =>{
    var header = {'Content-Type': 'application/json'}
    var formData = JSON.stringify({
      "type": {
      'GameType': index+1,
      'GameName': global.gameName,
      "HostId":global.UserId
    }
    })
      let apiData = {
        endpoint: 'creategame',
        method: 'POST',
        header : header,
        body: formData
      }
      let response = await APICALL(apiData)
      if (response.status === 200) {
        console.log("Response : "+JSON.stringify(response))
        console.log("GameId : "+JSON.stringify(response.GameID))
        this.props.navigation.navigate('FindUsersScreen', { selectedGameTypeData: item, GameID:response.GameID })
        // global.admin = global.UserId
        // showToast('successfully send Invitation')
      } else {
        let message = 'Something went wrong'
        if (response.message !== undefined) {
          message = response.message
        }
        this.setState({ formError: response.message, loginLoader: false })
      }
  }

  next = (item,index) => {
    global.selectedGameType = item.TypeName
    this.createGame(item,index)
    // this.props.navigation.navigate('FindUsersScreen', { selectedGameTypeData: item })
  }

  render() {
    const { gameTypes } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={Images.woodenBackground} style={styles.screenBackgroundStyle}>
          <View style={{ flexDirection: 'row' }}>
            <ImageBackground source={Images.back} style={styles.backImageStyle}>
              <TouchableOpacity style={styles.backButtonStyle} onPress={this.goBack} />
            </ImageBackground>
            <View style={styles.selectGameTypeLablel}>
              <Text style={styles.selectGameTypeLabelText}>Select Game Type</Text>
            </View>
          </View>
          <View style={styles.gameTypeHorizontalView}>
            <ScrollView contentContainerStyle={styles.gameTypeScrollView} horizontal={true}>
              {
                gameTypes !== undefined &&
                gameTypes.length !== 0 &&
                gameTypes.map((item, index) => {
                  return (
                    <TouchableOpacity style={styles.gameTypeItem}>
                      <Image
                        source={Images.dominoDice}
                        style={styles.dominoImgStyle}
                        resizeMode={'contain'}
                      />
                      <View style={styles.gameTypeLabel}>
                        <Text style={styles.gameTypeLabelText}>{item.TypeName}</Text>
                      </View>
                      <TouchableOpacity style={styles.playButtonStyle} onPress={() => this.next(item,index)}>
                        <ImageBackground
                          source={Images.playButton}
                          resizeMode={'contain'}
                          style={styles.playButtonImageStyle} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )
                })
              }
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default SelectGameTypeScreen;
