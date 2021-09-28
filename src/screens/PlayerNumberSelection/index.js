import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  Modal,
  View,
  Pressable,
  AppState,
  Image,
} from 'react-native';
import {Images} from '../../common/Images';
import {APICALL} from '../../common/ApiCaller';
import {apiEndpoint, updateState} from '../../common/functions';
import {styles} from './styles';
import Orientation from 'react-native-orientation';
import io from 'socket.io-client';
import {showToast} from '../../common/Toaster';

export class PlayerNumberSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNumber: [
        {
          TypeName: '2 Player',
          img:Images.user2,
          user:2
        },
        {
          TypeName: '3 Player',
          img:Images.user3,
          user:3
        },
        {
          TypeName: '4 Player',
          img:Images.user4,
          user:4
        },
      ],
    };
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
    AppState.addEventListener('change', this.handleAppStateChange);
    global.numberofUser = 0
  }

  _onNewGame = () => {
    this.props.navigation.navigate('EnterGameNameScreen');
  };

  next =(item,index)=>{
    console.log("User Select : "+item.user)
    global.numberofUser= item.user
    this.props.navigation.navigate('EnterGameNameScreen');
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {userNumber} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={Images.woodenBackground}
          style={styles.screenBackgroundStyle}>
          <View style={{flexDirection: 'row'}}>
            <ImageBackground source={Images.back} style={styles.backImageStyle}>
              <TouchableOpacity
                style={styles.backButtonStyle}
                onPress={this.goBack}
              />
            </ImageBackground>
            <View style={styles.selectGameTypeLablel}>
              <Text style={styles.selectGameTypeLabelText}>
                Select Game Type
              </Text>
            </View>
          </View>
          <View style={styles.gameTypeHorizontalView}>
            <ScrollView
              contentContainerStyle={styles.gameTypeScrollView}
              horizontal={true}>
              {userNumber !== undefined &&
                userNumber.length !== 0 &&
                userNumber.map((item, index) => {
                  return (
                    <TouchableOpacity style={styles.gameTypeItem}>
                      <Image
                        // source={Images.dominoDice}
                        source={item.img}
                        style={styles.dominoImgStyle}
                        resizeMode={'contain'}
                      />
                      <View style={styles.gameTypeLabel}>
                        <Text style={styles.gameTypeLabelText}>
                          {item.TypeName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.playButtonStyle}
                        onPress={() => this.next(item, index)}>
                        <ImageBackground
                          source={Images.playButton}
                          resizeMode={'contain'}
                          style={styles.playButtonImageStyle}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default PlayerNumberSelection;
