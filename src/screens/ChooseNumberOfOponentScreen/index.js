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

export class ChooseNumberOfOponentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTypes: [
        {
          id: 0,
          numberOfPlayers: 2
        },
        {
          id: 0,
          numberOfPlayers: 3
        },
        {
          id: 0,
          numberOfPlayers: 4
        }
      ]
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
  }

  fetchGameTypes = async () => {
    let apiData = {
      endpoint: 'gametype.php',
      method: 'GET'
    }
    let response = await APICALL(apiData)
    if (response.status === 200) {
      this.setState({ gameTypes: response.data }, () => {
        console.log('gameTypesRes: ', JSON.stringify(this.state.gameTypes))
      })
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
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
              <Text style={styles.selectGameTypeLabelText}>Choose number of opponents</Text>
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
                      />
                      <Image
                        source={Images.next}
                        style={styles.nextImageStyle}
                      />
                      <View style={styles.gameTypeLabel}>
                        <Text style={styles.gameTypeLabelText}>{item.numberOfPlayers} Players</Text>
                      </View>
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

export default ChooseNumberOfOponentScreen;
