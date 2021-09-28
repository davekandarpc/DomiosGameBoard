import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Images } from '../../common/Images';
import { styles } from './styles';
import Orientation from 'react-native-orientation';

export class invitedGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitedGames: [
        {
          gameName: 'Office Group',
          host: 'Kandarp Dave',
          memners: [
            { name: 'Kandarp Dave', id: 1 },
            { name: 'Mahammad Momin', id: 1 },
            { name: 'Yash Khandar', id: 1 },
            { name: 'Dev Suthar', id: 1 }
          ]
        },
        {
          gameName: 'GadgetApp',
          host: 'Dhaval Shah',
          memners: [
            { name: 'Mahammad Momin', id: 1 },
            { name: 'Kandarp Dave', id: 1 },
            { name: 'Yash Khandar', id: 1 },
            { name: 'Dev Suthar', id: 1 }
          ]
        },
        {
          gameName: 'Default',
          host: 'Dhaval Shah',
          memners: [
            { name: 'Mahammad Momin', id: 1 },
            { name: 'Kandarp Dave', id: 1 },
            { name: 'Yash Khandar', id: 1 },
            { name: 'Dev Suthar', id: 1 }
          ]
        },
        {
          gameName: 'GadgetApp',
          host: 'Dhaval Shah',
          memners: [
            { name: 'Mahammad Momin', id: 1 },
            { name: 'Kandarp Dave', id: 1 },
            { name: 'Yash Khandar', id: 1 },
            { name: 'Dev Suthar', id: 1 }
          ]
        },
        {
          gameName: 'Default',
          host: 'Dhaval Shah',
          memners: [
            { name: 'Mahammad Momin', id: 1 },
            { name: 'Kandarp Dave', id: 1 },
            { name: 'Yash Khandar', id: 1 },
            { name: 'Dev Suthar', id: 1 }
          ]
        },
      ]
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.lockToLandscape();
  }

  _onNewGame = () => {
    this.props.navigation.navigate('EnterGameNameScreen')
  }

  _goToInvitedGamesList = () => {
    this.props.navigation.navigate('InvitedGamesList')
  }

  renderSeparator = () => {
    return (
      <View style={{ height: 1, margin: 5 }} />
    );
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key);
  }

  renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.gameTypeItem}>
        <Image
          source={Images.dominoDice}
          style={styles.dominoImgStyle}
          resizeMode={'contain'}
        />
        <Text style={styles.gameTypeLabelText}>{item.gameName}</Text>
        <View style={styles.gameNameView}>
          <Text style={styles.gameHostText}>Hosted By: </Text>
          <Text style={styles.gameHostText}>{item.host}</Text>
        </View>
        {/* <View>
        </View> */}
        {
          item.memners.map((member, index)=> {
            return(
              <Text style={styles.gameMemberText}>{member.name}</Text>
            )
          })
        }
      </TouchableOpacity>
    )
  }

  render() {
    const { invitedGames } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={Images.woodenBackground} style={styles.screenBackgroundStyle}>
          {/* <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}> */}
          <FlatList
            data={invitedGames}
            renderItem={({ item }) => this.renderItem(item)}
            ItemSeparatorComponent={this.renderSeparator}
            horizontal
            style={{ margin: 50, alignSelf: 'center' }}
          />
          {/* </ScrollView> */}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default invitedGames;
